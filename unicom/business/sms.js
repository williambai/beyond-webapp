var _ = require('underscore');
var async = require('async');
var sp = require('../libs/sms');
var config = require('../config/sp').SGIP12;

var sms = {};

/**
 * 由新建状态 转移到 失败状态或已发送状态
 * -或者-
 * 发送失败重试3次：
 * 由失败状态 转移到 失败状态或已发送状态 
 */
sms.submit = function(models, options, done) {
	models.PlatformSms
		.find({
			'status': '新建'
				// $or: [{
				// 	'status': '新建'
				// }, {
				// 	'status': '失败',
				// 	'tryTimes': {
				// 		$lt: 3
				// 	}
				// }]
		})
		.limit(20)
		.exec(function(err, docs) {
			if (err) return done(err);
			if (_.isEmpty(docs)) return done(null, {
				count: 0
			}); //没有可执行的新建SMS
			//** send sms
			var count = docs.length;
			sp.send(docs, function(err, newDocs) {
				if (err) return res.status(406).send(err);
				//** save sms'series info
				async.each(newDocs, function(newDoc, callback) {
					//** 短信 cmdSubmit 对象
					var command = newDoc.command || {};
					var header = command.header || {};
					var headerSeries = header.srcNodeID + '' + header.cmdTime + '' + header.cmdSeq;
					var sender = config.options.SPNumber || '';
					var status = '已发送';
					models.PlatformSms
						.findByIdAndUpdate(
							newDoc._id, {
								$set: {
									'header': header,
									'headerSeries': headerSeries,
									'sender': sender,
									'status': status,
								}
							}, {
								'upsert': false,
								'new': true,
							},
							function(err) {
								if (err) return callback(err);
								callback();
							});
					// models.PlatformSms
					// 	.findByIdAndUpdate(
					// 		doc._id, {
					// 			$set: {
					// 				'status': '失败',
					// 			},
					// 			$inc: {
					// 				'tryTimes': 1
					// 			}
					// 		}, {
					// 			'upsert': false,
					// 			'new': true,
					// 		},
					// 		function(err, newDoc) {
					// 			if (err) return done(err);
					// 			setTimeout(function() {
					// 				_send(docs);
					// 			}, 50);
					// 		});
				}, function(err) {
					if (err) return done(err);
					done(null, {
						count: count
					});
				});
			});
		});
};
/**
 * SGIP服务反馈短信发送的结果报告
 * 由已发送状态 转化为失败状态或已确认状态
 */
sms.report = function(models, options, done) {
	//** 短信报告cmdReport对象
	var command = options.body.command || {};
	//** 短信报告cmdReport.header对象
	var header = command.header || {};
	var headerSeries = header.srcNodeID + '' + header.cmdTime + '' + header.cmdSeq;
	var status = command.ErrCode == 0 ? '已确认' : '失败';
	models.PlatformSms
		.findOneAndUpdate({
				'headerSeries': headerSeries,
			}, {
				$set: {
					'status': status,
				}
			}, {
				'upsert': false,
				'new': true,
			},
			function(err) {
				if (err) return done(err);
				done(null, {});
			});
};

/**
 * 创建客户上行短信deliver
 * 状态为收到
 */
var deliver = function(models,options,done) {
	//** 短信报告cmdDeliever对象
	var command = options.body.command || {};
	//** cmdDeliever.header对象
	var header = command.header || {};
	var doc = {};
	doc.header = header;
	doc.headerSeries = header.srcNodeID + '' + header.cmdTime + '' + header.cmdSeq;
	doc.sender = command.SpNumber;
	doc.receiver = command.UserNumber;
	doc.content = command.MessageContent;
	doc.status = '收到';
	models.PlatformSms
		.create(doc, function(err) {
			if (err) return done(err);
			done(null, {});
		});
};

exports = module.exports = sms;
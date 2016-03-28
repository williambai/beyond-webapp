var _ = require('underscore');
var async = require('async');
var sp = require('../libs/sms');
var config = require('../config/sp').SGIP12;
var sendSMS = require('../libs/sms').send;

var sms = {};

/**
 * 由新建状态 转移到 已发送状态
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
sms.submit = function(models, done) {
	models.PlatformSms
		.find({
			'status': '新建'
		})
		.limit(20)
		.exec(function(err, docs) {
			if (err) return done(err);
			if (_.isEmpty(docs)) return done(null, {
				count: 0
			}); //没有可执行的新建SMS
			//** send sms
			var count = docs.length;
			sendSMS(docs, function(err, newDocs) {
				if (err) return done(err);
				//** save sms'series info
				async.each(newDocs, function(newDoc, callback) {
					//** 短信 cmdSubmit 对象
					var command = newDoc.command || {};
					var header = command.header || {};
					var headerSeries = header.srcNodeID + '' + header.cmdTime + '' + header.cmdSeq;
					models.PlatformSms
						.findOneAndUpdate({
								headerSeries: headerSeries
							}, {
								$set: {
									status: '已发送',
								}
							}, {
								'upsert': false,
								'new': true,
							},
							function(err) {
								if (err) return callback(err);
								callback();
							});
					// var sender = config.options.SPNumber || '';
					// var status = '已发送';
					// models.PlatformSms
					// 	.findByIdAndUpdate(
					// 		newDoc._id, {
					// 			$set: {
					// 				'header': header,
					// 				'headerSeries': headerSeries,
					// 				'sender': sender,
					// 				'status': status,
					// 			}
					// 		}, {
					// 			'upsert': false,
					// 			'new': true,
					// 		},
					// 		function(err) {
					// 			if (err) return callback(err);
					// 			callback();
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
	var command = options.command || {};
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
				done(null);
			});
};

/**
 * 创建客户上行短信deliver
 * 状态为收到
 */
sms.deliver = function(models, options, done) {
	//** 短信报告cmdDeliever对象
	var command = options.command || {};
	//** cmdDeliever.header对象
	var header = command.header || {};
	var doc = {};
	doc.header = header;
	doc.headerSeries = header.srcNodeID + '' + header.cmdTime + '' + header.cmdSeq;
	doc.sender = command.UserNumber;
	doc.receiver = command.SPNumber;
	//** message content transform
	var messageContent = command.MessageContent || {};
	var messageContentType = messageContent.type || 'Buffer';
	var messageContentData = messageContent.data || [];

	var content = new Buffer(messageContentData).toString('utf8');
	doc.content = content;
	doc.status = '收到';
	models.PlatformSms
		.create(doc, function(err) {
			if (err) return done(err);
			done(null);
		});
};

exports = module.exports = sms;
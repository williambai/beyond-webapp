//@Deprecated!
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
			//** 没有可执行的新建SMS
			if (_.isEmpty(docs)) return done(null, {
				count: 0
			});
			//** send sms
			var count = docs.length;
			sendSMS(docs, function(err, results) {
				if (err) return done(err);
				//** save sms'series info
				async.each(results, function(result, callback) {
					//** 短信 cmdSubmit 对象
					var command = result || {};
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
	//** TODO TP_pid = 0
	// var TP_pid = command.TP_pid;
	//** TODO command.TP_udhi = 1 表示是短信的一部分，需要拼接短信
	//** 数据的前4位一样，5/6位有含义：[5,0,3,144,3,1...
	//** 第五位表示有3条，第六位表示是3条中的第1条
	// var TP_udhi = command.TP_udhi;

	//** 解析短信内容
	var MessageCoding = command.MessageCoding;
	var MessageContent = command.MessageContent;
	if(MessageCoding == 0 && MessageContent){
		//** acsii
		doc.content = new Buffer(MessageContent,'ascii').toString('utf8');
	}else if(MessageCoding == 8 && MessageContent){
		//** ucs2 
		//** 注意：javascript是低位在前，短信协议是高位在前，要做转换
		var newMessageContent = new Buffer(MessageContent.length);
		for (var i = 0, len = MessageContent.length; i < len; i += 2) {
			newMessageContent.writeUInt16LE(MessageContent.readUInt16BE(i), i);
		};
		doc.content = newMessageContent.toString('ucs2');
	}
	doc.status = '收到';
	models.PlatformSms
		.create(doc, function(err) {
			if (err) return done(err);
			done(null);
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

exports = module.exports = sms;
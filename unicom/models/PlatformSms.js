var mongoose = require('mongoose');
var _ = require('underscore');
var async = require('async');
var sendSMS = require('../libs/sms').send;
//*** 实用方法
//** SP配置文件
var spConfig = require('../config/sp').SGIP12;
//** 同一时间不重复的序列号
var curSeq = 0xffffffff;

//** 产生下一个序列号，为长短信留出十个分批发送的序列号
var genNextSeq = function() {
	curSeq = (curSeq > 0x7fffff00) ? 0 : curSeq + 10;
	return curSeq;
};
//** 获取当前时间
var getCurrentTime = function(){
	var d = new Date();
	var mTime = 0;
	mTime = mTime * 100 + (d.getMonth() + 1);
	mTime = mTime * 100 + d.getDate();
	mTime = mTime * 100 + d.getHours();
	mTime = mTime * 100 + d.getMinutes();
	mTime = mTime * 100 + d.getSeconds();
	return mTime;
};

//*** Schema
var schema = new mongoose.Schema({
	header: { //** SMS 发送时的头。包括源节点，时间戳和序列号
		srcNodeID: Number,
		cmdTime: Number,
		cmdSeq: Number
	},
	headerSeries: String, //** srcNodeID + cmdTime + cmdSeq
	sender: String,
	receiver: String,
	content: String,
	category: { //** 新建/收到短信的业务类型，2G/3G/4G
		type: String,
		// enum: {
		// 	values: '2G|3G|4G'.split('|'),
		// 	message: 'enum validator failed for path {PATH} with value {VALUE}',
		// }
	},
	status: {
		type: String,
		enum: {
			values: '新建|已发送|已确认|收到|已处理|失败'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
	createBy: {
		id: String,
		name: String,
	},
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
});

//** pre-save
schema.pre('save', function(next) {
	//** 收到的SMS直接存储，不做改动
	if (this.status != '收到') {
		//** 没有设置SMS头
		if (!this.headerSeries) {
			this.header = {};
			this.header.srcNodeID = spConfig.NodeID;
			this.header.cmdTime = getCurrentTime();
			this.header.cmdSeq = genNextSeq();
			this.headerSeries = this.header.srcNodeID + '' + this.header.cmdTime + '' + this.header.cmdSeq;
		}
		//** 没有设置sender, 采用默认的SPNumber作为发送方
		if (!this.sender) {
			this.sender = spConfig.options.SPNumber;
		} else {
			this.sender = spConfig.options.SPNumber + '' + this.sender;
		}
		//** 没有设置status, 默认的status
		if (!this.status) {
			this.status = '新建';
		}
	}
	//** 保证短信少于140个英文字符或70个汉字
	// var content = this.content || '';
	// var len = this.content.length;
	// var isChinese = false;
	// for(var i=0; i<len; i++){
	// 	//** 判断含有中文字符
	// 	if(content.charCodeAt(i) > 127) {
	// 		isChinese = true;
	// 		break;
	// 	}
	// }
	// if(isChinese){
	// 	this.content = content.slice(0,70);
	// }else{
	// 	this.content = content.slice(0,70);
	// }
	next();
});

schema.set('collection', 'platform.smses');

module.exports = exports = function(connection) {
	connection = connection || mongoose;

	/**
	 * 发送新建的短信
	 * 由新建状态 转移到 已发送状态
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */

	schema.statics.sendSms = function(done) {
		var PlatformSms = connection.model('PlatformSms');
		PlatformSms
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
						PlatformSms
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
	 * 接收客户上行短信deliver
	 * 状态为收到
	 */
	schema.statics.receiveSms = function(options, done) {
		var PlatformSms = connection.model('PlatformSms');
		var Goods = connection.model('Goods');
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
		if (MessageCoding == 0 && MessageContent) {
			//** acsii
			doc.content = new Buffer(MessageContent, 'ascii').toString('utf8');
		} else if (MessageCoding == 8 && MessageContent) {
			//** ucs2 
			//** 注意：javascript是低位在前，短信协议是高位在前，要做转换
			var newMessageContent = new Buffer(MessageContent.length);
			for (var i = 0, len = MessageContent.length; i < len; i += 2) {
				newMessageContent.writeUInt16LE(MessageContent.readUInt16BE(i), i);
			};
			doc.content = newMessageContent.toString('ucs2');
		}
		doc.status = '收到';

		var regex = new RegExp('^' + spConfig.options.SPNumber);
		Goods.findOne({
			smscode: (doc.sender || '').replace(regex, ''), //** 找到对应的goods
		}, function(err, goods) {
			if (err) console.error(err);
			//** 无论找到与否，都继续保存sms
			goods = goods || {};
			//** 给sms的category赋值: 2G/3G/4G 之一
			doc.category = goods.category || '';
			PlatformSms
				.create(doc, function(err) {
					if (err) return done(err);
					done(null);
				});

		});
	};

	/**
	 * SGIP服务反馈短信发送的结果报告
	 * 由已发送状态 转化为失败状态或已确认状态
	 */
	schema.statics.report = function(options, done) {
		var PlatformSms = connection.model('PlatformSms');
		//** 短信报告cmdReport对象
		var command = options.command || {};
		//** 短信报告cmdReport.header对象
		var header = command.header || {};
		var headerSeries = header.srcNodeID + '' + header.cmdTime + '' + header.cmdSeq;
		var status = command.ErrCode == 0 ? '已确认' : '失败';
		PlatformSms
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

	return connection.model('PlatformSms', schema);
};
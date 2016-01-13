/**
 * 由新建状态 转移到 已发送状态
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var sendSmsForNew = function(callback) {
	models.Sms
		.find({
			'status': '新建',
		})
		.limit(20)
		.exec(function(err, docs) {
			if (err) return callback(err);
			if (_.isEmpty(docs)) return callback(null); //没有可执行的新建SMS
			//** send sms
			var msg = new Submit(docs);
			sp.send(msg, function(err, replies) {
				if (err) return callback(err);
				//update status
				var doc_ids = _.pluck(docs, '_id');
				models.Sms
					.update({
							'_id': {
								$or: doc_ids
							}
						}, {
							$set: {
								'status': '已发送',
							}
						}, {
							'upsert': false,
							'new': true,
							'multi': true,
						},
						function(err, newDocs) {
							if (err) return callback(err);
							//success
							callback(null, true);
						});
			});
		});
};

/**
 * 发送失败重试3次：
 * 由失败状态 转移到 失败状态或已发送状态 
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var sendSmsForFailture = function(callback) {
	models.Sms
		.find({
			'status': '失败',
			'tryTimes': {
				$lt: 3
			},
		})
		.limit(20)
		.exec(function(err, docs) {
			if (err) return callback(err);
			if (_.isEmpty(docs)) return callback(null); //没有可执行的新建SMS
			var msg = new Submit(docs);
			//** send sms
			sp.send(msg, function(err, replies) {
				if (err) return callback(err);
				//update status
				var doc_ids = _.pluck(docs, '_id');
				models.Sms
					.update({
						'_id': {
							$or: doc_ids
						}
					}, {
						$set: {
							'status': '已发送',
						}
					}, {
						'upsert': false,
						'new': true,
						'multi': true,
					}, function(err, newDocs) {
						if (err) return callback(err);
						//success
						callback(null, true);
					});
			});
		});
};

/**
 * 发送结果报告
 * 由已发送状态 转化为失败状态 或已确认状态
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var receiveReport = function(callback){
	models.Sms
		.findOneAndUpdate({
				'status': '已发送',
			}, {
				$set: {
					status: '已确认',
				},
				replies: {
					$push: data
				}
			}, {
				'upsert': false,
				'new': true,
			},
			callback
		);
	models.Sms
		.findOneAndUpdate({
				'status': '已发送',
			}, {
				$set: {
					status: '失败',
				},
				replies: {
					$push: data
				}
			}, {
				'upsert': false,
				'new': true,
			},
			callback
		);
};

/**
 * 接收到用户回复
 * 由已确认状态，转化为已回复状态
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var receiveCustomerReply = function(callback) {
	models.Sms
		.findOneAndUpdate({
				'status': '已确认',
			}, {
				$set: {
					status: '已回复',
				},
				replies: {
					$push: data
				}
			}, {
				'upsert': false,
				'new': true,
			},
			callback
		);
};

if (process.argv[1] === __filename) {
	var _ = require('underscore');
	var mongoose = require('mongoose');
	//** import the models
	var models = {
		Sms: require('../models/PlatformSms')(mongoose),
	};
	var SP = require('../libs/sms').nodeSP;
	var msgSubmit = require('../libs/sms').msgSubmit;
	var msgReport = require('../libs/sms').msgReport;
	var msgDeliver = require('../libs/sms').msgDeliver;
	//** start sp
	var sp = new SP(config.sp);
	sp.connect({}, function() {
		logger.info('sp service is connected.');
	});
	//** listen to sp
	sp.on('report', function(data) {
		if (req instanceof msgReport.Class) {
			console.log('\nReport:');
		} else if (req instanceof msgDeliver.Class) {
			console.log('\nDeliver:');
		}
	});
	sp.on('deliver', function(data) {
		async.waterfall(
			[
				receiveCustomerReply,
				function doOrder(sms, callback) {
					//2,3G业务
					//4G业务
				},
				function updateOrder(doResult, callback) {

				},
				function updateRevenue(order, callback) {

				}
			],
			function(err, result) {

			});
	});

}
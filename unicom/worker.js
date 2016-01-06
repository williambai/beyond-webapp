var log4js = require('log4js');
var path = require('path');
log4js.configure(path.join(__dirname, 'log4js.json'));
var logger = log4js.getLogger('worker');
logger.setLevel('INFO');

var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var SMS = require('./libs/sms');

var mongoose = require('mongoose');
var config = {
	db: require('./config/db')
};

//** import the models
var models = {
	Sms: require('./models/Sms')(mongoose),
};

var sms = new SMS();
sms.on('answer', function(data) {
	async.waterfall(
		[
			function updateSms(callback) {
				models.Sms
					.findOneAndUpdate({

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
			},
			function doOrder(sms, callback){
				//2,3G业务
				//4G业务
			},
			function updateOrder(doResult,callback){

			},
			function updateRevenue(order,callback){

			}
		],
		function(err, result) {

		});
});

sms.connect({}, function() {
	logger.info('sms service is connected.');
});

var status = {
	platform: false,
};

var intervalObject;

var start = function() {
	if (status.platform) return;
	logger.info('worker start.');
	mongoose.connect(config.db.URI, function onMongooseError(err) {
		if (err) {
			logger.error('Error: can not open Mongodb.');
			throw err;
		}
	});
	var lastTimestamp = Date.now();
	var interval = 5000;
	intervalObject = setInterval(function() {
		logger.debug('interval: ' + interval);
		models.Strategy
			.find({
				'status.code': 1
			})
			.exec(function(err, strategies) {
				if (err) return logger.error(err);
				if (_.isEmpty(strategies)) return logger.warn('没有可执行的。');
				trading.run(strategies, function(err, result) {
					if (err) return logger.error(err);
					var now = Date.now();
					interval = now - lastTimestamp;
					if (interval < 1) {
						interval = 1;
						logger.warn('执行时间太长，应调节间隔');
					}
					lastTimestamp = now;
				});
			});
	}, interval);
	status.platform = true;
	process.send && process.send(status);
};

var stop = function() {
	if (!status.platform) return;
	logger.info('worker stop.');
	intervalObject && clearInterval(intervalObject);
	mongoose.disconnect();
	status.platform = false;
	process.send && process.send(status);
};

var workflow = function() {
	async.series([
		function sendSmsForNew(callback) {
			models.Sms
				.find({
					'status': '新建',
				})
				.limit(20)
				.exec(function(err, docs) {
					if (err) return callback(err);
					if (_.isEmpty(docs)) return callback(null); //没有可执行的新建SMS
					sms.send(docs, function(err, replies) {
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
								},
								{
									'upsert': false,
									'new': true,
									'multi': true,
								}
							}, function(err, newDocs) {
								if (err) return callback(err);
								//success
								callback(null, true);
							});
					});
				});
		},
		function sendSmsForFailture(callback) {
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
					Sms.send(docs, function(err, replies) {
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
								},
								{
									'upsert': false,
									'new': true,
									'multi': true,
								}
							}, function(err, newDocs) {
								if (err) return callback(err);
								//success
								callback(null, true);
							});
					});
				});
		},
		function(callback) {
			callback(null);
		}
	], function(err, results) {
		if (err) return logger.error(err);
	});
};
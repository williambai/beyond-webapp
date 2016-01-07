var log4js = require('log4js');
var path = require('path');
log4js.configure(path.join(__dirname, './config/log4js.json'));
var logger = log4js.getLogger('worker');
logger.setLevel('INFO');

var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var SP = require('./libs/sms').nodeSP;
var msgSubmit = require('./libs/sms').msgSubmit;
var msgReport = require('./libs/sms').msgReport;
var msgDeliver = require('./libs/sms').msgDeliver;

var mongoose = require('mongoose');
var config = {
	db: require('./config/db'),
	sp: require('./config/sp'),
};

//** import the models
var models = {
	Sms: require('./models/PlatformSms')(mongoose),
};

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

var status = {
	platform: false,
};

var intervalObject;

var start = function() {
	if (status.platform) return;
	status.platform = true;
	logger.info('worker start.');
	mongoose.connect(config.db.URI, function onMongooseError(err) {
		if (err) {
			logger.error('Error: can not open Mongodb.');
			throw err;
		}
	});
	var lastTimestamp = Date.now();
	var interval = 5000;
	var func = setTimeout(function() {
		logger.debug('interval: ' + interval);
		workflow(function(err) {
			if (err) logger.error('SP service is closed.');
			var now = Date.now();
			interval = now - lastTimestamp;
			if (interval < 1) {
				interval = 1;
				logger.warn('执行时间太长，应调节间隔');
			}
			lastTimestamp = now;
			if (!status.platform) return;
			func();
		});
	}, interval);
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

var workflow = function(done) {
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
			},
			function(callback) {
				callback(null);
			}
		],
		function(err, results) {
			if (err) return done(err);
			done(null);
		});
};

//unit test
if (process.argv[1] === __filename) {
	console.log('');
}
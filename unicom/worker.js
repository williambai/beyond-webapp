var log4js = require('log4js');
var path = require('path');
log4js.configure(path.join(__dirname, './config/log4js.json'));
var logger = log4js.getLogger('worker');
logger.setLevel('INFO');

var request = require('request');
var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var SP = require('./libs/sms').nodeSP;
var msgSubmit = require('./libs/sms').msgSubmit;
var msgReport = require('./libs/sms').msgReport;
var msgDeliver = require('./libs/sms').msgDeliver;

var config = {
	sp: require('./config/sp'),
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
		request.post('http://localhost:8092/platform/smses',{
			form: {
				action: 'report',

			}
		},function(err){
			if(err) logger.error(err);
		});
	} else if (req instanceof msgDeliver.Class) {
		console.log('\nDeliver:');
		request.post('http://localhost:8092/platform/smses',{
			form: {
				action: 'reply',

			}
		},function(err){
			if(err) logger.error(err);
		});
	}
});

var status = {
	platform: false,
};

var intervalObject;

var start = function() {
	if (status.platform) return;
	status.platform = true;
	logger.info('worker start.');

	var lastTimestamp = Date.now();
	var interval = 5000;
	var func = function() {
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
	};
	setTimeout(func, 0);
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
				request.post('http://localhost:8092/platform/smses',{
					form: {
						action: 'sendNew',

					}
				},function(err){
					if(err) return callback(err);
					callback();
				});
			},
			function sendSmsForFailture(callback) {
				request.post('http://localhost:8092/platform/smses',{
					form: {
						action: 'sendFailure',

					}
				},function(err){
					if(err) return callback(err);
					callback();
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
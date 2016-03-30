//** common packages
var path = require('path');
var fs = require('fs');
var net = require('net');
var request = require('request');
var config = {
	db: require('./config/db'),
	sp: require('./config/sp').SGIP12,
};
//** logger packages
var log4js = require('log4js');
log4js.configure(path.join(__dirname, 'config/log4js.json'));
var logger = log4js.getLogger(path.relative(process.cwd(), __filename));
//** CronJob package
var CronJob = require('cron').CronJob;

//** MongoDB packages
var mongoose = require('mongoose');
mongoose.connect(config.db.URI, function onMongooseError(err) {
	if (err) {
		logger.error('Error: can not open Mongodb.');
		throw err;
	}
});
//** import MongoDB's models
var models = {};
fs.readdirSync(path.join(__dirname, 'models')).forEach(function(file) {
	if (/\.js$/.test(file)) {
		var modelName = file.substr(0, file.length - 3);
		models[modelName] = require('./models/' + modelName)(mongoose);
	}
});

//** schedule Jobs
// var updateWechatAccessToken = require('./business/wechat').updateAccessToken;
// var refreshWechatAccessTokenJob = new CronJob({
// 	cronTime: '00 */59 * * * *',
// 	onTick: function() {
// 		updateWechatAccessToken(models,{},function(err,result) {
// 			if(err) return logger.error(err);
// 			logger.debug('Wechat AccessToken: ' + JSON.stringify(result));
// 			logger.info('call Wechat AccessToken peroid job successfully.');
// 		});
// 	},
// 	start: true,
// 	runOnInit: true,//** execute right now!
// });

// var updateCbssCookie = require('./commands/updateCbssCookie');
// var refreshCbssCookieJob = new CronJob({
// 	cronTime: '00 */5 * * * *',
// 	onTick: function(){
// 		updateCbssCookie(function() {
// 			logger.info('call refresh CBSS Accounts Cookie job successfully.');
// 		});
// 	},
// 	start: true,
// 	runOnInit: true,//** execute right now!
// });
// 

var processOrder = require('./business/order').process;
var processOrderJob = new CronJob({
	cronTime: '10 */2 * * * *',
	onTick: function() {
		processOrder(models,
			config.sp.options,
			function(err, result) {
				if (err) return logger.error(err);
				logger.info('call Order peroid job successfully.');
			}
		);
	},
	start: true,
	runOnInit: true, //** execute right now!
});
logger.info('scheduleJobs is started.');

//** process uncaughtException
process.on('uncaughtException', function(){
	logger.warn('uncaughtException and process exit.');
	process.exit(1);
});
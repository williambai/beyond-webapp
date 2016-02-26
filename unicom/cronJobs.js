var log4js = require('log4js');
var logger = log4js.getLogger('server:main');
logger.setLevel('INFO');
var CronJob = require('cron').CronJob;

//** schedule Jobs
// var updateWechatAccessToken = require('./commands/updateWechatAccessToken');
// var refreshWechatAccessTokenJob = new CronJob({
// 	cronTime: '00 */59 * * * *',
// 	onTick: function() {
// 		updateWechatAccessToken(function(err) {
// 			if (err) return logger.error(err);
// 			logger.info('update Wechat AccessToken successfully.');
// 		});
// 	},
// 	start: true,
// 	runOnInit: true,//** execute right now!
// });

// var updateCbssCookie = require('./commands/updateCbssCookie');
// var refreshCbssCookieJob = new CronJob({
// 	cronTime: '00 */5 * * * *',
// 	onTick: function(){
// 		updateCbssCookie(function(err) {
// 			if (err) return logger.info(err);
// 			logger.info('update CBSS Accounts Cookie successfully.');
// 		});
// 	},
// 	start: true,
// 	runOnInit: true,//** execute right now!
// });
// 
var processSMS = require('./commands/processSMS');
var processSMSJob = new CronJob({
	cronTime: '*/10 * * * * *',
	onTick: function(){
		processSMS.submit(function(err) {
			if (err) return logger.info(err);
			logger.info('process SMS peroid successfully.');
		});
	},
	start: true,
	runOnInit: true,//** execute right now!
});
var processOrder = require('./commands/processOrder');
var processOrderJob = new CronJob({
	cronTime: '10 */2 * * * *',
	onTick: function(){
		processOrder.processOrder(function(err) {
			if (err) return logger.info(err);
			logger.info('process Order peroid successfully.');
		});
	},
	start: true,
	runOnInit: true,//** execute right now!
});
logger.info('scheduleJobs is started.');
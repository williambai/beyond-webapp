var path = require('path');
var log4js = require('log4js');
log4js.configure(path.join(__dirname, 'config/log4js.json'));
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var CronJob = require('cron').CronJob;

//** schedule Jobs
// var updateWechatAccessToken = require('./commands/updateWechatAccessToken');
// var refreshWechatAccessTokenJob = new CronJob({
// 	cronTime: '00 */59 * * * *',
// 	onTick: function() {
// 		updateWechatAccessToken(function() {
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
var processSMS = require('./commands/processSMS');
var processSMSJob = new CronJob({
	cronTime: '*/10 * * * * *',
	onTick: function(){
		processSMS.submit(function() {
			logger.info('call SMS peroid job successfully.');
		});
	},
	start: true,
	runOnInit: true,//** execute right now!
});
var processOrder = require('./commands/processOrder');
var processOrderJob = new CronJob({
	cronTime: '10 */2 * * * *',
	onTick: function(){
		processOrder.processOrder(function() {
			logger.info('call Order peroid job successfully.');
		});
	},
	start: true,
	runOnInit: true,//** execute right now!
});
logger.info('scheduleJobs is started.');
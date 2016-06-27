//** common packages
var path = require('path');
var fs = require('fs');
var net = require('net');
var request = require('request');
var config = {
	db: require('../config/db'),
	sp: require('../config/sp').SGIP12,
};
//** logger packages
var log4js = require('log4js');
log4js.configure(path.join(__dirname,'../config/log4js.json'), {cwd: path.resolve(__dirname, '..')});
var logger = log4js.getLogger(path.relative(process.cwd(), __filename));
//** CronJob package
var CronJob = require('cron').CronJob;

//** MongoDB packages
var mongoose = require('mongoose');
var models = {};

//** schedule Jobs
var refreshWechatAccessTokenJob = function(){
	new CronJob({
		cronTime: '00 */59 * * * *',
		onTick: function() {
			models.PlatformWeChat.updateAccessToken(function(err,result) {
				if(err) return logger.error(err);
				logger.debug('Wechat AccessToken: ' + JSON.stringify(result));
				logger.info('call Wechat AccessToken peroid job successfully.');
			});
		},
		start: true,
		runOnInit: true,//** execute right now!
	});
};

mongoose.connect(config.db.URI, function onMongodbConnected(err) {
	if (err) {
		logger.error('Error: 微信定时服务 can not open Mongodb.');
		mongoose.disconnect();
		return process.exit(1);
	}
	//** import MongoDB's models Sync
	fs.readdirSync(path.join(__dirname, '../models')).forEach(function(file) {
		if (/\.js$/.test(file)) {
			var modelName = file.substr(0, file.length - 3);
			models[modelName] = require('../models/' + modelName)(mongoose);
		}
	});
	//** 启动服务
	// refreshWechatAccessTokenJob();
	logger.info('微信定时服务已开启。');
});

//** process uncaughtException
process.on('uncaughtException', function(err){
	logger.error('微信定时服务 异常退出，请及时处理！');
	logger.error(err);
	mongoose.disconnect();
	process.exit(1);
});

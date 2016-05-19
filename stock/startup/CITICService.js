/**
 * 
 * 处理股票订单服务
 * 
 */

//** common packages
var path = require('path');
var fs = require('fs');
var net = require('net');
var request = require('request');
var config = {
	db: require('../config/db'),
};
//** 启动log4js配置
var log4js = require('log4js');
log4js.configure(path.join(__dirname,'../config/log4js.json'), {cwd: path.join(__dirname, '..')});
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
fs.readdirSync(path.join(__dirname, '../models')).forEach(function(file) {
	if (/\.js$/.test(file)) {
		var modelName = file.substr(0, file.length - 3);
		models[modelName] = require('../models/' + modelName)(mongoose);
	}
});

//** 保持登录状态(刷新cookie)
var refreshCookieJob = new CronJob({
	cronTime: '00 */5 * * * *',
	onTick: function() {
		models.TradeAccount.refreshCookie(function(err) {
			if (err) return logger.error(err);
			logger.info('成功发送指令: refresh CITIC Accounts Cookie.');
		});
	},
	start: true,
	runOnInit: true, //** execute right now!
});
logger.info('CITIC 刷新cookie服务已开启。');

//** 股票订单处理
var processOrderJob = new CronJob({
	//** 每过7秒钟检查一次订单
	cronTime: '*/7 * * * * *',
	onTick: function() {
		logger.info('发送指令: process CITIC Order.');
		models.TradeOrder.process(function(err, result) {
				if (err) return logger.error(err);
				logger.info('成功处理指令: process CITIC Order.');
			}
		);
	},
	start: true,
	runOnInit: true, //** execute right now!
});
logger.info('CITIC 股票订单服务已开启。');

//** process uncaughtException
process.on('uncaughtException', function(err){
	logger.error('CITICService 异常退出，请及时处理！');
	logger.error(err);
	process.exit(1);
});


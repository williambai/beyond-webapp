/**
 * 
 * 处理联通2G/3G订单服务
 * 
 */

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

//** 2G/3G 订单处理
var processOrderJob = function(){
	new CronJob({
		//** 每过7秒钟检查一次订单
		cronTime: '*/7 * * * * *',
		onTick: function() {
			models.Order.process2G_3G(function(err, result) {
					if (err) return logger.error(err);
					logger.info('call Order peroid job successfully.');
				}
			);
		},
		start: true,
		runOnInit: true, //** execute right now!
	});
};

mongoose.connect(config.db.URI, function onMongodbConnected(err) {
	if (err) {
		logger.error('Error: 联通BSS处理2G/3G订单服务 can not open Mongodb.');
		mongoose.disconnect();
		return process.exit(1);
	}
	//** import MongoDB's models
	fs.readdirSync(path.join(__dirname, '../models')).forEach(function(file) {
		if (/\.js$/.test(file)) {
			var modelName = file.substr(0, file.length - 3);
			models[modelName] = require('../models/' + modelName)(mongoose);
		}
	});
	//** 启动服务
	processOrderJob();
	logger.info('联通BSS处理2G/3G订单服务已开启。');
});

//** process uncaughtException
process.on('uncaughtException', function(err){
	logger.error('联通BSS处理2G/3G订单服务异常退出，请及时处理！');
	logger.error(err);
	mongoose.disconnect();
	process.exit(1);
});

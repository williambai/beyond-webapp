var fs = require('fs');
var path = require('path');

//** 启动log4js配置
var log4js = require('log4js');
log4js.configure(path.join(__dirname,'../config/log4js.json'), {cwd: path.join(__dirname, '..')});
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

//** CronJob package
var CronJob = require('cron').CronJob;

var mongoose = require('mongoose');
var config = {
	mail: require('../config/mail'),
	db: require('../config/db')
};

//import the models
var models = {};
fs.readdirSync(path.join(__dirname, '../models')).forEach(function(file) {
	if (/\.js$/.test(file)) {
		var modelName = file.substr(0, file.length - 3);
		models[modelName] = require('../models/' + modelName)(mongoose);
	}
});

mongoose.connect(config.db.URI, function onMongooseError(err) {
	if (err) {
		logger.error('Error: can not open Mongodb.');
		throw err;
	}
});

//** 股票服务
var processStockJob = new CronJob({
	//** 每5秒钟询价一次
	cronTime: '*/5 * * * * *',
	onTick: function() {
		logger.info('发送指令: 股票投资组合询价');
		models.TradePortfolio.processStock(function(err){
			if (err) return logger.error(err);
			logger.info('成功处理指令: 股票投资组合询价');
		});
	},
	start: true,
	runOnInit: true, //** execute right now!
});
logger.info('CITIC 股票投资组合服务已开启。');

process.on('SIGTERM', function() {
	logger.info('StockService 因 kill 退出。');
	process.exit(1);
});

//** process uncaughtException
process.on('uncaughtException', function(e){
	logger.warn('StockService 因 uncaughtException 退出。');
	logger.debug(e);
	process.exit(1);
});

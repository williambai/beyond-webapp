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

//** 2G/3G 订单处理
var processOrderJob = new CronJob({
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

//** process uncaughtException
process.on('uncaughtException', function(err){
	logger.error('CronJob 异常退出，请及时处理！');
	logger.error(err);
	process.exit(1);
});
logger.info('联通BSS处理2G/3G订单服务已开启。');
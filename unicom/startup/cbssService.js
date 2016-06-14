/**
 * 
 * 处理联通4G订单服务
 * > node cbssService 
 */

//** common packages
var path = require('path');
var fs = require('fs');
var net = require('net');
var request = require('request');
var config = {
	db: require('../config/db'),
	cbss: require('../config/cbss'),
};
//** logger packages
var log4js = require('log4js');
log4js.configure(path.join(__dirname,'../config/log4js.json'), {cwd: path.resolve(__dirname, '..')});
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

var city = process.argv[2] || 'xiaogan';//** 城市编码
var options = config.cbss.accounts[city] || {};

var account = {};
//** 4G 账户登录
var login = function(options){
	models.CbssAccount.login(options, function(err, doc){
		//** 登录失败，重新登录，直至成功
		if(err || !doc){
			logger.warn('尝试重新登录：' + JSON.stringify(options));
			setTimeout(function(){
				login(options);
			},5000);
			return;
		} 
		account = doc;
		//** 定时刷新Cookie，保持登录状态，每过7分钟刷新一次
		var refreshCookieJob = function(){
				models.CbssAccount.refreshCookie(account, function(err, success) {
					if (err || !success){
						logger.error(err);
						setTimeout(function(){
							login(options);
						},50);
						return;
					}
					logger.info('refresh 4G Account cookie peroid job successfully.');
					setTimeout(function(){
						refreshCookieJob();
					},420000);
				});
			};
		setTimeout(refreshCookieJob,420000);
		//** 定时处理 4G 订单处理,每过7秒钟检查一次订单
		var processOrderJob = function(){
				models.Order.process4G(account, function(err) {
					if (err){
						logger.error(err);
						setTimeout(function(){
							login(options);
						},50);
						return;
					}
					logger.info('call 4G Order peroid job successfully.');
					setTimeout(function(){
						processOrderJob();
					},7000);
				});
			};
		setTimeout(processOrderJob, 7000);
	});
};
//** 启动
login(options);

//** process uncaughtException
process.on('uncaughtException', function(err){
	logger.error('城市(' + options['city'] + ') cbssService 异常退出，请及时处理！');
	logger.error(err);
	mongoose.disconnect();
	process.exit(1);
});
logger.info('贵州省联通CBSS城市(' + options['city'] + ')处理4G订单服务已开启。');
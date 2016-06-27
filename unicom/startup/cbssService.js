/**
 * 
 * 处理联通4G订单服务
 * > node cbssService 
 */

//** common packages
var path = require('path');
var fs = require('fs');
var config = {
	db: require('../config/db'),
	cbss: require('../config/cbss'),
};
//** logger packages
var log4js = require('log4js');
log4js.configure(path.join(__dirname,'../config/log4js.json'), {cwd: path.resolve(__dirname, '..')});
var logger = log4js.getLogger(path.relative(process.cwd(), __filename));

//** MongoDB packages
var mongoose = require('mongoose');
var models = {};

var refreshPeroid = 427000;

//** 4G 账户登录
var async = require('async');
var accounts = config.cbss.accounts || [];
var accountsEnable = {};
var _login = function(account, done){
	models.CbssAccount.login(account, function(err, doc){
		//** 登录失败，重新登录，直至成功
		if(err || !doc){
			logger.warn('尝试重新登录：' + JSON.stringify(account));
			setTimeout(function(){
				_login(account,done);
			},5000);
			return;
		} 
		accountsEnable[doc.id] = doc;
		done && done(null);
	});
};

var login = function(accounts, done){
	async.eachSeries(accounts, function(account,callback){
		account = account || {};
		if(account.status == '有效'){
			_login(account, callback);
			logger.info('登录：' + JSON.stringify(account));
		}else{
			callback(null);
		} 
	},function(err){
		if(err) return done(err);
		done && done(null);
	});
};

//** 定时刷新Cookie，保持登录状态，每过7分钟刷新一次
var refreshCookieJob = function(accounts){
		async.eachSeries(accounts, function(account,callback){
			account = account || {};
			if(account.status == '有效'){
				_login(account, callback);
				logger.info('重新登录：' + JSON.stringify(account));
			}else{
				callback(null);
			} 
		},function(err){
			if(err) logger.error(err);
			setTimeout(function(){
				refreshCookieJob(accounts);
				logger.info('refresh 4G Account cookie peroid job successfully.');
			},refreshPeroid);
		});
	};

//** 定时处理 4G 订单处理,每过7秒钟检查一次订单
var processOrderJob = function(accountsByCity){
		var accountsT = [];
		for(var city in accountsByCity){
			accountsT.push(accountsByCity[city]);
		}
		models.Order.process4G(accountsT, function(err,result) {
			if (err)logger.error(err);

			result = result || {};
			if(result.logout){
				logger.info('call 4G Order peroid job fail, bacause of account logout.');
				setTimeout(function(){
					login([result.account || {}]);
				},5000);
			}else{
				logger.info('call 4G Order peroid job successfully.');
			}
			setTimeout(function(){
				processOrderJob(accountsT);
			},7000);
		});
	};

//** 启动
var startService = function(){
	login(accounts,function(err){
		if(err) return logger.error(err);
		setTimeout(function(){
			refreshCookieJob(accounts);
		},refreshPeroid);
		setTimeout(function(){
			processOrderJob(accountsEnable);
		}, 7000);
		var cities = [];
		accounts.forEach(function(acc){
			if(acc.status == '有效') cities.push(acc.city);
		});
		logger.info('贵州省联通CBSS城市(' + cities.join(' | ') + ') 处理4G订单服务已开启。');
	});
};

//** 连接数据库
mongoose.connect(config.db.URI, function onMongodbConnected(err) {
	if (err) {
		logger.error('Error: 贵州省 cbssService can not open Mongodb.');
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
	startService();
});
//** process uncaughtException
process.on('uncaughtException', function(err){
	logger.error('贵州省 cbssService 异常退出，请及时处理！');
	logger.error(err);
	mongoose.disconnect();
	process.exit(1);
});




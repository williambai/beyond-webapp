var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var spawn = require('child_process').spawn;
var mongoose = require('mongoose');
var connection = mongoose;
var schema = new mongoose.Schema({
	province_name: String, //** 省市名称
	province_id: String, //** 省市编码
	username: String,//** cbss账号
	password: String,//** cbss密码
	cookies: [],
	cookieRaw: String,
	login: {
		type: Boolean,
		default: false
	},
	status: {
		type: String,
		enum: {
			values: '有效|无效'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
});

schema.set('collection','cbss.accounts');

/**
 * 自动登录
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
schema.statics.login = function(options, done){
	connection.models
		.CbssAccount
		.findOne({},function(err, account){
			if(err) return done(err);
			if(!account) return done(null, '账号不存在');
			logger.debug('登录...');
			var trunks = [];
			var child = spawn(
					'casperjs',
					[
						'../libs/cbss/login.test.casper.js',

					],{
						cwd: __dirname,
					}
				);
			child.on('error', function(err){
				logger.debug(err);
				done(err);
			});
			child.stderr.on('data', function(err){
				logger.debug(err);
				done(err);
			});
			child.stdout.on('data', function(data){
				trunks.push(data);
			});
			child.on('close', function(code){
				if(code != 0) return done('login() 非正常退出 code: ' + code);
				var data = trunks.join('').toString().replace(/\n/g,'');
				logger.debug('自动登录程序返回内容: ' + data);
				if(/login:true/.test(data)){
					logger.debug('自动登录成功。')
					done(null,account);
				}else if(/login:false/.test(data)){
					logger.debug('自动登录失败。')
					done('登录失败');
				}else{
					logger.debug('程序异常：是否已登录检查程序异常。');
					done('登录失败');
				}
			});
			child.stdout.pipe(process.stdout);
			process.stdin.pipe(child.stdin);			
		});
};

/**
 * 刷新Cookie
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
schema.statics.refreshCookie = function(options, done){

};

module.exports = exports = function(conn){
	connection = conn || mongoose;
	return connection.model('CbssAccount',schema);
};
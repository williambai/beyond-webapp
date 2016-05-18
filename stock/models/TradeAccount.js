var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var mongoose = require('mongoose');
var cp = require('child_process');
var http = require('http');
var querystring = require('querystring');
var crypto = require('crypto');
//** 配置文件
var CITIC = require('../config/citic');

var connection = mongoose;
var schema = new mongoose.Schema({
	username: String,//账户登录名称
	password: String,//账户登录密码
	user: {//账户所有人信息
		name: String,//** 真实姓名
	},
	company: {//账户所属公司
		id: String,
		name: String,
		avatar: String,
	},
	asset: Number,//** 资产总额
	balance: Number,//** 账户资产结余		
	cookies: [],
	cookieRaw: String,
	login: {
		type: Boolean,//** 是否已经自动登录成功
		default: false
	},
	status: {
		type: String,
		enum: {
			values: '有效|无效'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
	createBy: {//** 账户创建者
		id: String,
		name: String,
	},
	lastupdatetime: {
		type: Date,
		default: Date.now
	},

});

schema.set('collection','trade.accounts');

/**
 * 获取登录页面信息
 * 设置登录页面截图和验证码图片的存储路径
 */
schema.statics.getLoginPage = function(options, done) {
	//** 账户id
	var id = options.id || '';
	//** 设置captcha图片上传POST回调，由casperjs调用
	// var callback_url = req.header('origin') + '/trade/accounts';
	var callback_url = 'http://localhost:8091' + '/trade/accounts';
	//** 预设希望captcha图片文件的存储路径
	var captcha_file = options.captcha_file || 'captcha.png';
	//** 预设希望login页面截图文件的存储路径(调试有用，生产无用)
	var login_file = options.login_file || 'login.png';
	//** 运行casperjs的相对路径
	casperjs_cwd = path.join(__dirname, '../libs/citic');
	//** 调用casperjs子进程
	var worker = cp.execFile(
		'casperjs', [
			'login.casper.js',
			'--id=' + id,
			'--callback_url=' + callback_url,
			'--captcha_file=' + captcha_file,
			'--login_file=' + login_file,

		], {
			cwd: casperjs_cwd,
		},
		function(err, stdout, stderr) {
			if (err) return logger.error(err);
		});
	logger.debug('casperjs started.');
	done(null);
};

/**
 * 获取验证码后，自动登录
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
schema.statics.autoLogin = function(options,done) {
	var id = options.id || '';
	var captchaText = options.plain || '';

	connection.models.TradeAccount
		.findById(id)
		.exec(function(err, doc) {
			//** casperjs server(localhost:8084) is waiting for feedback on step 1 forever.
			//** so feeback casperjs server when captcha has been parsed.(step 2)
			//** (step 5)transfer username/password/captcha to casperjs(as webServer)
			var password = crypto.privateDecrypt(CITIC.privateKey, new Buffer(doc.password, 'base64')).toString();
			// logger.debug(password);
			postData = querystring.stringify({
				action: 'login',
				username: doc.username,
				password: password,
				captcha: captchaText,
			});
			logger.debug(postData)
			var request = http.request({
				hostname: 'localhost',
				port: 8084,
				path: '/',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': postData.length
				},
			}, function(response) {
				logger.debug('response from casper(action:login): ' + response.statusCode);
			});
			request.on('error', function(err) {
				logger.error('problem with request: ' + err.message);
			});
			request.write(postData);
			request.end();
			done(null);
		});
};

/**
 * 登录后更新Cookie
 */

schema.statics.updateCookie = function(options, done) {
	var id = options.id || '';
	var cookies = [];
	try {
		cookies = JSON.parse(options.cookies || []);
	} catch (e) {
		if(e) return done(err);
	};
	connection.models.TradeAccount
		.findByIdAndUpdate(
			id, {
				$set: {
					'login': options.success,
					'cookieRaw': options.cookies,
					'cookies': cookies,
					'lastupdatetime': Date.now(),
				}
			}, {
				'upsert': false,
				'new': true,
			},
			function(err, doc) {
				if (err) return done(err);
				//** (step 6)tell casperjs(as webServer) that cookie is received.
				// var http = require('http');
				// var querystring = require('querystring');
				// postData = querystring.stringify({
				// 	action: 'cookie_received',
				// });
				// var request = http.request({
				// 	hostname: 'localhost',
				// 	port: 8084,
				// 	path: '/',
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/x-www-form-urlencoded',
				// 		'Content-Length': postData.length
				// 	},
				// }, function(response) {
				// 	logger.debug('response from casper(action:cookie_received): ' + response.statusCode);
				// });
				// request.on('error', function(err) {
				// 	logger.error('problem with request: ' + err.message);
				// });
				// request.write(postData);
				// request.end();
				done(null);
			});
};

/**
 * 在登录状态下，刷新cookie
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
schema.statics.refreshCookie = function(options, done) {
	if(typeof options == 'function'){
		done = options;
		options = {};
	}
	connection.models.TradeAccount
		.find({
			'company.name': '中信证券',
			'login': true,
			'status': '有效',
			'lastupdatetime': {
				$lte: (Date.now() - 300000) //** 选择超过5分钟以上的
			}
		})
		.limit(5)
		.exec(function(err, docs) {
			if (err) return done(err);
			if (!docs) return done(null);
			var _refreshCiticCookie = function(docs) {
				//** process one
				var doc = docs.pop();
				if (!doc) return done(null);
				var id = doc._id;
				var path = require('path');
				casperjs_cwd = path.join(__dirname, '../libs/citic');
				var worker = require('child_process').execFile(
					'casperjs', [
						'cookie.casper.js',
						'--id=' + id,
						'--cookie=' + JSON.stringify(doc.cookies),
						'--refresh_url=' + 'http://localhost:8091/trade/accounts'
					], {
						cwd: casperjs_cwd,
					},
					function(err, stdout, stderr) {
						if (err) logger.error(err);
						logger.debug('-----refresh citic cookie--------');
						logger.debug(stdout);
						setTimeout(function() {
							_refreshCiticCookie(docs);
						}, 1000);
					});
			};
			_refreshCiticCookie(docs);
		});
};

module.exports = exports = function(conn){
	connection = conn || mongoose;
	return connection.model('TradeAccount',schema);
};
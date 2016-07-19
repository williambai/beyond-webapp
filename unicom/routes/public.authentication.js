var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

module.exports = exports = function(app, models) {
	var _ = require('underscore');
	var async = require('async');
	var request = require('request');
	var crypto = require('crypto');
	var nodemailer = require('nodemailer');
	var smtpTransport = require('nodemailer-smtp-transport');
	var config = {
		mail: require('../config/mail'),
		server: require('../config/server'),
		sms: require('../config/sms'),
	};
	var Account = models.Account;

	/**
	 * 刷手机验证码
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	var refreshCaptcha = function(req,res){
		//** 检查sesssion中验证码的时间戳，如果< 5500ms，则返回'太频繁'的错误
		var refreshCaptchaTime = req.session.refreshCaptchaTime;
		if(refreshCaptchaTime && (Date.now()-refreshCaptchaTime) < 5500) return res.send({code:40112,errmsg: '太频繁'});
		//** 检查手机号码有效性
		var mobile = req.body.mobile;
		if(!/^1\d{10}$/.test(mobile)){
			return res.send({code: 40411,errmsg: '手机号码错误'});
		}
		//*** 创建4位验证码
		var captcha = _.random(1000,9999);
		logger.debug('注册验证码：' + captcha);
		//*** 使用短信模板更新短信内容
		var content = config.sms.registrationCaptcha.replace(/\{[(a-z]+\}/ig, function(name) {
				if (name == '{captcha}') return captcha;
			});
		//** 创建待发送的短信
		var sms = {};
		sms.receiver = mobile;
		sms.content = content;
		sms.status = '新建';
		models.PlatformSms.create(sms, function(err){
			if(err) return res.send(err);
			logger.debug(mobile+ '的注册短信已发送');
			//** 将验证码保存在保存session中
			req.session.refreshCaptchaTime = Date.now();
			req.session.captcha = captcha;
			res.send({});
		});
	};

	var register = function(req, res) {
		var app = req.params.app || 'channel';
		var user = req.body || {};
		var email = req.body.email;
		var captcha = req.body.captcha;

		//** 存在手机动态验证码，则需要检查验证的正确性
		if(/^\d{11}$/.test(email)){
			if(!(captcha && (captcha == req.session.captcha))){
				return res.send({code: 11210, errmsg: '验证码不正确'});
			}
		}
		var password = user.password;

		user.password = crypto.createHash('sha256').update(password).digest('hex');
		user.registerCode = crypto.createHash('sha256').update(user.email + "beyond" + password).digest('hex');

		user.avatar = '/images/avatar.jpg';
		user.status = '未验证';
		user.apps = [];//** 注册默认来自应用'channel'
		user.apps.push(app);
		user.roles = [];
		user.lastupdatetime = new Date();

		Account.create(user, function(err, doc) {
			if (err) {
				if (err.code == 11000) {
					return res.send({
						code: 11000,
						errmsg: '该手机号码/邮箱已注册'
					});
				}
				return res.send(err);
			}
			res.send(doc);

			//** 如果是电子邮件注册，则发送邮件
			if(/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+$/.test(email)){
				var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
				var text = config.mail.register_text.replace(/\{[(a-z]+\}/ig, function(name) {
					if (name == '{host}') return req.header('host');
					if (name == '{email}') return user.email;
					if (name == '{code}') return user.registerCode;
				});

				logger.info('register confirm email text: ' + text);
				smtpTransporter.sendMail({
						from: config.mail.from,
						to: user.email,
						subject: config.mail.register_subject,
						text: text,
					},
					function(err, info) {
						if (err) return logger.error(err);
						logger.info(info);
					}
				);				
			}
		});
	};

	/**
	 * 注册邮件自助验证
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	var confirm = function(req, res) {
		var email = req.query.email;
		var registerCode = req.query.registerCode;

		if (!email || !(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email)))
			return res.send({
				code: 40101,
				errmsg: '邮件地址错误'
			});
		if (!code || !/\w+/.test(code))
			return res.send({
				code: 40110,
				errmsg: '验证码不存在',
			});
		Account
			.findOneAndUpdate({
					email: email,
					registerCode: registerCode
				}, {
					$set: {
						'status': '正常',
					}
				}, {
					'upsert': false,
					'new': true,
				},
				function(err, doc) {
					if (err) return res.send(err);
					if (!doc) return res.send({
						code: 40400,
						errmsg: '邮件校验错误'
					});
					return res.send({
						success: true
					});
				}
			);
	};

	/**
	 * 找回密码
	 * 包括：短信/邮件
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	var forgotPassword = function(req, res) {
		var email = req.body.email;
		if (null == email || !(/^\d{11}$/.test(email) || (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email))))
			return res.send({
				code: 40101,
				errmsg: '不是有效的手机号码/邮件地址'
			});

		var host = req.header('host');

		Account.findOne({
				email: email
			},
			function(err, doc) {
				if (err) return res.send(err);
				if (!doc) return res.send({
					code: 40400,
					errmsg: '手机号码/邮件不存在'
				});
				res.send({});

				if(/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+$/.test(email)){
					//** 如果是电子邮件，则发送邮件
					var password = String(_.random(10000000,99999999));
					//*** 使用找密码邮件模板更新邮件内容
					var text = config.mail.reset_text.replace(/\{[(a-z]+\}/ig, function(name) {
						if (name == '{host}') return req.header('host');
						if(name == '{password}') return password;
					});
					logger.debug('forgot password email content: ' + text);
					//** 发送邮件
					var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
					smtpTransporter.sendMail({
							from: config.mail.from,
							to: email,
							subject: config.mail.reset_subject,
							text: text,
						},
						function(err, info) {
							if (err) return logger.error('找回密码创建邮件错误');
							logger.debug('找回密码邮件已发送');
							//** 更新密码
							models.Account
								.findOneAndUpdate({
									email: email
								},{
									$set: {
										password: crypto.createHash('sha256').update(password).digest('hex'),
									}
								},{
									'upsert': false,
									'new': true
								}, function(err, doc){
									if(err) return logger.error('找回密码修改密码错误');
									logger.debug('找回密码密码已修改');
								});							
						}
					);
				}else if(/^\d{11}$/.test(email)){
					//** 如果是手机号码，则发送短信
					var password = String(_.random(100000,999999));
					//*** 使用短信模板更新短信内容
					var content = config.sms.forgotPassword.replace(/\{[(a-z]+\}/ig, function(name) {
							if (name == '{password}') return password;
						});
					var sms = {};
					sms.receiver = email;
					sms.content = content;
					sms.status = '新建';
					//** 发送短信
					models.PlatformSms
						.create(sms, function(err,doc){
							if(err) return logger.error('找回密码创建短信错误');
							logger.debug('找回密码短信已发送');
							//** 更新密码
							models.Account
								.findOneAndUpdate({
									email: email
								},{
									$set: {
										password: crypto.createHash('sha256').update(password).digest('hex'),
									}
								},{
									'upsert': false,
									'new': true
								}, function(err, doc){
									if(err) return logger.error('找回密码修改密码错误');
									logger.debug('找回密码密码已修改');
								});
						});
				}
			}
		);
	};

	/**
	 * 登录
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	var login = function(req, res) {
		var app = req.params.app;
		// logger.info(req.body);
		var email = req.body.email;
		var password = req.body.password;
		if (null == email || !(/^(1\d{10}|([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2}))$/.test(email)))
			return res.send({
				code: 40101,
				errmsg: '不是有效的手机号码/邮件地址'
			});

		if (null == password || password.length < 1)
			return res.send({
				code: 40002,
				errmsg: '忘记输入密码'
			});

		async.waterfall([
				function(callback) {
					Account
						.findOne({
							email: email
						})
						.exec(function(err, account) {
							if (err) return callback(err);
							if (!account)
								return callback({
									code: 40401,
									errmsg: '用户不存在。'
								});
							if (account.status == '禁用')
								return callback({
									code: 40405,
									errmsg: '对不起，您不能登录。'
								});
							if (account.status == '未验证')
								return callback({
									code: 40402,
									errmsg: '需要管理员审核，请联系管理员。',//或者还未通过验证，请查看邮件，并尽快验证。'
								});
							if (account.password != crypto.createHash('sha256').update(password).digest('hex'))
								return callback({
									code: 40403,
									errmsg: '密码不正确。'
								});
							if (_.indexOf(account.apps, app) == -1)
								return callback({
									code: 40404,
									errmsg: '您没有访问该应用的权限。如需访问，请联系系统管理员。'
								});
							logger.debug('登录账户:' + JSON.stringify(account));
							callback(null, account);
						});
				},
				function bindWechat(account, callback) {
					if (!req.session.openid) return callback(null, account);
					//** if wechat, bind openid to account
					Account
						.findByIdAndUpdate(
							account._id, {
								$set: {
									'openid': req.session.openid,
								}
							}, {
								'upsert': false,
								'new': true,
							}, callback);
				},
				function setGrantByAccountRole(account, callback) {
					var roles = account.roles || [];
					logger.debug('登录账户的应用：' + JSON.stringify(account.apps || []));
					logger.debug('登录账户的角色:' + JSON.stringify(roles));
					//** 根据用户的roles 查询用户权限
					models.PlatformRole
						.find({
							'nickname': {
								$in: roles,
							}
						})
						.exec(function(err, docs) {
							if (err) return callback(err);
							docs = docs || [];
							//** 权限选择各角色权限的并集
							var grant = {};
							_.each(docs, function(doc) {
								_.extend(grant, doc.grant);
							});
							logger.debug('登录账户的权限集: ' + JSON.stringify(grant));
							account.grant = grant;
							callback(null, account);
						});
				}
			],
			function(err, account) {
				if (err) {
					logger.error(err);
					return res.send(err);
				}
				req.session.accountId = account._id;
				req.session.email = account.email;//** 设置用户邮件/手机
				req.session.username = account.username;
				req.session.avatar = account.avatar || ''; 
				req.session.department = account.department || {}; //** 设置用户部门
				req.session.apps = account.apps || [];
				req.session.grant = account.grant || {};
				logger.debug('登录账户的session: ' + JSON.stringify(req.session));
				//** 取app可使用的资源与用户权限的交集
				models.PlatformApp
					.findOne({
						nickname: app
					})
					.exec(function(err,doc){
						if(err) logger.error(err);
						//** 取出app允许的features
						var features = doc && doc.features || [];
						// logger.debug('app features: ' + JSON.stringify(features));
						// logger.debug('account.grant: ' + JSON.stringify(account.grant));
						//** 计算app可使用的资源与用户权限的交集
						var grant = {};
						_.each(features,function(feature){
							grant[feature] = account.grant[feature];
						});
						// logger.debug('取app.features与account.grant的交集: ' + JSON.stringify(grant));
						res.send({
							id: req.session.accountId,
							email: req.session.email,
							username: req.session.username,
							avatar: req.session.avatar,
							grant: grant
						});
						logger.info(email + '登录成功！');
					});
			}
		);
	};

	/**
	 * 自动登录
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	var checkLogin = function(req, res) {
		//** no req.session
		if(!req.session){
			return res.send({
				code: 40100,
				errmsg: '401 Unauthorized.'
			});
		}
		// logger.debug('checkLogin(session):' + JSON.stringify(req.session));
		var app = req.params.app;
		logger.debug('从('+ app +')自动登录...');
		//** 用户正在使用该app		
		if (_.indexOf(req.session.apps, app) != -1) {
			models
				.Account
				.findById(req.session.accountId)
				.exec(function(err, account){
					if(err) return res.send(err);
					if (!account) return res.send({
							code: 40103,
							errmsg: '用户不存在'
						});
					//** 更新session
					req.session.username = account.username;
					req.session.avatar = account.avatar || '';
					req.session.department = account.department || {}; //** 设置用户部门
					models.PlatformApp
						.findOne({
							nickname: app
						})
						.exec(function(err,doc){
							if(err) return res.send(err);
							//** 取出app允许的features
							var features = doc && doc.features || [];
							// logger.debug('app features: ' + JSON.stringify(features));
							// logger.debug('req.session.grant: ' + JSON.stringify(req.session.grant));
							//** 计算app可使用的资源与用户权限的交集
							var grant = {};
							_.each(features,function(feature){
								grant[feature] = req.session.grant[feature];
							});
							logger.debug('自动登录，取app.features与account.grant的交集: ' + JSON.stringify(grant));
							res.send({
								id: req.session.accountId,
								email: req.session.email,
								username: req.session.username,
								avatar: req.session.avatar,
								grant: grant
							});
							logger.info(req.session.email + '自动登录成功！');
						});
				});
			return;	
		}
		if(req.session.openid){
			logger.debug('req.session.openid: ' + req.session.openid);
			//** step 3: get user info by using openid
			models
				.Account
				.findOne({
					'openid': req.session.openid,
				})
				.exec(function(err, account) {
					if (err) return res.send(err);
					if (!account) return res.send({
						code: 40101,
						errmsg: 'wechat unbind'
					});
					var roles = account.roles || [];
					models.PlatformRole
						.find({
							'nickname': {
								$in: roles,
							}
						})
						.exec(function(err, docs) {
							if(err) logger.error(err);
							if (err) return res.send(err);
							logger.debug('微信自动登录，用户角色集: ' + JSON.stringify(docs));
							docs = docs || [];
							//** 权限选择各角色权限的并集
							var grant = {};
							_.each(docs, function(doc) {
								_.extend(grant, doc.grant);
							});
							logger.debug('微信自动登录，用户权限集: ' + JSON.stringify(grant));
							//** 给用户权限赋值
							account.grant = grant;
							//** 更新session
							req.session.accountId = account._id;
							req.session.email = account.email;
							req.session.username = account.username;
							req.session.avatar = account.avatar || '';
							req.session.department = account.department || {}; //** 设置用户部门
							req.session.apps = account.apps || [];
							req.session.grant = account.grant || {};
							logger.debug(req.session.email + ' 用户微信自动登录(session): ' + JSON.stringify(req.session));

							if (_.indexOf(req.session.apps, app) != -1) {
								models.PlatformApp
									.findOne({
										nickname: app
									})
									.exec(function(err,doc){
										if(err) return res.send(err);
										var features = doc && doc.features || [];
										//** 取app可使用的资源与用户权限的交集
										var grant = {};
										_.each(features,function(feature){
											grant[feature] = req.session.grant[feature];
										});
										res.send({
											id: req.session.accountId,
											email: req.session.email,
											username: req.session.username,
											avatar: req.session.avatar,
											grant: grant
										});
										logger.info(req.session.email + '用户微信(openid='+ req.session.openid +')自动登录成功！');
									});
							} else {
								logger.warn(req.session.email + '用户微信(openid='+ req.session.openid +')自动登录失败！');
								res.send({
									code: 40100,
									errmsg: '401 Unauthorized.'
								});
							}
						});
				});	
			return;		
		}
		//** 来自微信客户端
		if (/MicroMessenger/.test(req.headers['user-agent'])) {
			logger.debug('user-agent:' + JSON.stringify(req.headers['user-agent']));
			//** step 1: request wechat openid
			if(!req.session.openid){
				var appid = (!_.isEmpty(req.query.appid)) ? req.query.appid : 'wx0179baae6973c5e6';
				//** 设置微信web oauth 2.0 的回调地址
				var redirect_uri = config.server.HOST + '/wechat/oauth2/authorized/' + appid;
				var state = Date.now();
				logger.debug('微信自动登录，重定向到：https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(redirect_uri) + '&response_type=code&scope=snsapi_base&state=' + state + '#wechat_redirect');
				res.send({code: 30200, redirect: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(redirect_uri) + '&response_type=code&scope=snsapi_base&state=' + state + '#wechat_redirect'});
				// res.status(302).send('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(redirect_uri) + '&response_type=code&scope=snsapi_base&state=' + state + '#wechat_redirect');
				return;
			}
		}
		logger.debug('不允许自动登录。');
		res.send({
			code: 40100,
			errmsg: '401 Unauthorized.'
		});	
	};

	/**
	 * 登出
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	var logout = function(req, res) {
		req.session.accountId = null;
		req.session.openid = undefined;
		req.session.department = {};
		req.session.apps = [];
		req.session.grant = {};
		logger.debug(req.session.email + ' 用户账户登出的session: ' + JSON.stringify(req.session));
		logger.info(req.session.email + '登出成功！');
		res.send({});
	};

	/**
	 * 用户在微信客户端登录时，OAuth 2.0 认证回调
	 *
	 * |- 微信认证"公众服务号"
	 *  |- 如果失败，则跳转至失败页面：http://wo.pdbang.cn/wechat_error.html
	 *  |- 如果成功，则跳转至默认首页：http://wo.pdbang.cn/wechat.html#index
	 *  
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	var wechatAuthorized = function(req, res) {
		//** step 2: response openid from wechat
		var code = req.query.code;
		var appid = req.params.appid || 'wx0179baae6973c5e6';
		models
			.PlatformWeChat
			.findOne({
				appid: appid
			}).exec(function(err, wechat) {
				if(err || !wechat) return res.redirect(config.server.HOST + '/wechat_error.html');
				var appsecret = wechat.appsecret || 'd4624c36b6795d1d99dcf0547af5443d';
				request({
					url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=' + appsecret + '&code=' + code + '&grant_type=authorization_code',
					method: 'GET',
					json: true,
				}, function(err, response, body) {
					if(err || !body) return res.send(err);
					logger.debug('wechat authorized callback ' + JSON.stringify(body));
					var openid = body.openid || '';
					req.session.openid = openid;
					res.redirect(config.server.HOST + '/wechat.html#index');
				});
			});
	};

	var inviteFriend = function(req, res) {
		var emails = req.body.emails || [];
		res.send({
			success: true
		});

		var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));

		var text = config.mail.invite_text.replace(/\{[(a-z]+\}/ig, function(name) {
			if (name == '{host}') return req.header('host');
			if (name == '{username}') return req.session.username;
			if (name == '{email}') return req.session.email;
		});

		logger.info('invite email text: ' + text);
		emails.forEach(function(email) {
			smtpTransporter.sendMail({
				from: config.mail.from,
				to: email,
				subject: config.mail.invite_subject,
				text: text,
			}, function(err, info) {
				if (err) return logger.error(err);
				logger.info(info);
			});
		});
	};

	/**
	 * router outline
	 */

	 //** 手机注册获取动态验证码
	app.post('/register/captcha', refreshCaptcha);
	//** 注册
	app.post('/register/:app', register);
	//** 邮件确认 /register/confirm?email=&code=
	app.get('/register/confirm', confirm);
	//** 登录
	app.post('/login/:app', login);
	//** 登出
	app.get('/logout', logout);
	//** 自动登录，检查cookie中的session_id
	app.get('/login/check/:app', checkLogin);
	//** 找回密码
	app.post('/forgotPassword', forgotPassword);
	//** 邀请好友
	app.post('/invite/friend', app.grant, inviteFriend);
	//** 微信OAuth2.0认证回调
	app.get('/wechat/oauth2/authorized/:appid', wechatAuthorized);

};

	//Depreciated!
	//** reset password
	// app.post('/resetPassword', resetPassword);

	// var resetPassword = function(req, res) {
	// 	var token = req.body.token;
	// 	if (null == token)
	// 		return res.send({
	// 			code: 40400,
	// 			errmsg: '无效的请求，缺少token'
	// 		});

	// 	var password = req.body.password;
	// 	var cpassword = req.body.cpassword;

	// 	if (null == password || null == cpassword || password.length < 5)
	// 		return res.send({
	// 			code: 40102,
	// 			errmsg: '密码长度不正确'
	// 		});
	// 	if (cpassword != password)
	// 		return res.send({
	// 			name: 40103,
	// 			errmsg: '两次输入不一致'
	// 		});
	// 	var id = token;
	// 	Account.findByIdAndUpdate(id, {
	// 			$set: {
	// 				password: crypto.createHash('sha256').update(password).digest('hex')
	// 			}
	// 		}, {
	// 			upsert: false
	// 		},
	// 		function(err, doc) {
	// 			if (err) return res.send(err);
	// 			res.send(doc);
	// 		}
	// 	);
	// };


	//Depreciated!
	//** confirm
	// app.post('/register/confirm', confirm);
	// var confirm = function(req, res) {
	// 	var email = req.body.email;
	// 	var code = req.body.code;

	// 	if (null == email || !(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email)))
	// 		return res.send({
	// 			code: 40101,
	// 			errmsg: '邮件地址错误'
	// 		});
	// 	if (null == code)
	// 		return res.send({
	// 			code: 40110,
	// 			errmsg: '验证码不存在',
	// 		});
	// 	Account
	// 		.findOneAndUpdate({
	// 				email: email,
	// 				registerCode: code
	// 			}, {
	// 				$set: {
	// 					'status.code': 0,
	// 					'status.message': '注册成功，可以登陆'
	// 				}
	// 			}, {
	// 				upsert: false,
	// 			},
	// 			function(err, doc) {
	// 				if (err) return res.send(err);
	// 				if (!doc) return res.send({
	// 					code: 40400,
	// 					errmsg: '验证错误'
	// 				});
	// 				return res.send({
	// 					success: true
	// 				});
	// 			}
	// 		);
	// };

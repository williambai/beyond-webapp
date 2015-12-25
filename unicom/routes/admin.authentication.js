var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:authentication.admin');
logger.setLevel('DEBUG');

exports = module.exports = function(app, models) {
	// var _ = require('underscore');
	// var async = require('async');
	// var crypto = require('crypto');
	// var administrators = require('../config/admin');

	// // var login = function(req, res) {
	// // 	var email = req.body.email;
	// // 	var password = req.body.password;
	// // 	if (null == email || email.length < 1 || null == password || password.length < 1)
	// // 		return res.send({
	// // 			code: 40002,
	// // 			errmsg: 'email or password is null.'
	// // 		});
	// // 	if (!_.has(administrators, email))
	// // 		return res.send({
	// // 			code: 40100,
	// // 			errmsg: 'email does not exist.'
	// // 		});
	// // 	var hash_pass = crypto.createHash('sha256').update(password).digest('hex');
	// // 	if (administrators[email] != hash_pass)
	// // 		return res.send({
	// // 			code: 40101,
	// // 			errmsg: 'password is incorrect.'
	// // 		});
	// // req.session.isUser = false;
	// // req.session.isSuperAdmin = false;
	// // 	req.session.isAdmin = true;
	// // req.session.accountId = account._id;
	// // req.session.email = account.email;
	// // req.session.username = account.username;
	// // req.session.avatar = account.avatar || '';
	// // req.session.grant = account.grant || {};
	// // logger.debug(req.session.email + 'login(session): ' + JSON.stringify(req.session));
	// // res.send({
	// // 	id: req.session.accountId,
	// // 	email: req.session.email,
	// // 	username: req.session.username,
	// // 	avatar: req.session.avatar,
	// // 	grant: req.session.grant
	// // });
	// // logger.info('login(admin): ' + email);
	// // };

	// var login = function(req, res) {
	// 	// logger.info(req.body);
	// 	var email = req.body.email;
	// 	var password = req.body.password;
	// 	if (null == email || !(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email)))
	// 		return res.send({
	// 			code: 40101,
	// 			errmsg: '不是有效的邮件地址'
	// 		});

	// 	if (null == password || password.length < 1)
	// 		return res.send({
	// 			code: 40002,
	// 			errmsg: '忘记输入密码'
	// 		});

	// 	async.waterfall([
	// 			function(callback) {
	// 				models.Account
	// 					.findOne({
	// 						email: email
	// 					})
	// 					.exec(function(err, account) {
	// 						if (err) return callback(err);
	// 						if (!account)
	// 							return callback({
	// 								code: 40401,
	// 								errmsg: '用户不存在。'
	// 							});
	// 						if (account.status.code == -1)
	// 							return callback({
	// 								code: 40402,
	// 								errmsg: '还未通过验证，请查看邮件，并尽快验证。'
	// 							});
	// 						if (account.password != crypto.createHash('sha256').update(password).digest('hex'))
	// 							return callback({
	// 								code: 40403,
	// 								errmsg: '密码不正确。'
	// 							});
	// 						callback(null, account);
	// 					});
	// 			},
	// 			function role(account, callback) {
	// 				logger.debug('account:' + JSON.stringify(account));
	// 				var roles = account.roles || [];
	// 				logger.debug('roles:' + JSON.stringify(roles));

	// 				models.PlatformRole
	// 					.find({
	// 						'nickname': roles,
	// 					})
	// 					.exec(function(err, docs) {
	// 						if (err) return callback(err);
	// 						logger.debug('docs: ' + JSON.stringify(docs));
	// 						docs = docs || [];
	// 						var grant = {};
	// 						_.each(docs, function(doc) {
	// 							_.extend(grant, doc.grant);
	// 						});
	// 						logger.debug('grant: ' + JSON.stringify(grant));
	// 						account.grant = grant;
	// 						callback(null, account);
	// 					});
	// 			}
	// 		],
	// 		function(err, account) {
	// 			if (err) return res.send(err);
	// 			req.session.isUser = false;
	// 			req.session.isSuperAdmin = false;
	// 			req.session.isAdmin = true;
	// 			req.session.accountId = account._id;
	// 			req.session.email = account.email;
	// 			req.session.username = account.username;
	// 			req.session.avatar = account.avatar || '';
	// 			req.session.grant = account.grant || {};
	// 			logger.debug(req.session.email + 'login(session): ' + JSON.stringify(req.session));
	// 			res.send({
	// 				id: req.session.accountId,
	// 				email: req.session.email,
	// 				username: req.session.username,
	// 				avatar: req.session.avatar,
	// 				grant: req.session.grant
	// 			});
	// 			logger.info('login(admin): ' + email);
	// 		});
	// };

	// var logout = function(req, res) {
	// 	req.session.isAdmin = false;
	// 	req.session.grant = {};
	// 	logger.debug(req.session.email + ' logout(session): ' + JSON.stringify(req.session));
	// 	logger.info('logout(admin): ' + req.session.email);
	// 	res.send({});
	// };

	// //登录判断
	// var checkLogin = function(req, res) {
	// 	logger.info('checkLogin: ' + req.session.email);
	// 	logger.debug('checkLogin(session):' + JSON.stringify(req.session));
	// 	if (req.session.isAdmin) {
	// 		res.send({
	// 			id: req.session.accountId,
	// 			email: req.session.email,
	// 			username: req.session.username,
	// 			avatar: req.session.avatar,
	// 			grant: req.session.grant
	// 		});
	// 		logger.info('checkLogin(pass admin): ' + req.session.email);
	// 	} else {
	// 		res.send({
	// 			code: 40100,
	// 			errmsg: '401 Unauthorized.'
	// 		});
	// 		logger.warn('checkLogin(fail admin): ' + req.session.email);
	// 	}
	// };

	// /**
	//  * router outline
	//  */

	// //login
	// app.post('/admin/login', login);
	// //logout
	// app.get('/admin/logout', logout);
	// //authenticate
	// app.get('/admin/login/check', checkLogin);
};
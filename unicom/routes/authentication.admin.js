var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:authentication.admin');
logger.setLevel('INFO');

 exports = module.exports = function(app, models) {
 	var _ = require('underscore');
 	var crypto = require('crypto');
 	var administrators = require('../config/admin');

 	var login = function(req, res) {
 		var email = req.body.email;
 		var password = req.body.password;
 		if (null == email || email.length < 1 || null == password || password.length < 1)
 			return res.send({
 				code: 40002,
 				errmsg: 'email or password is null.'
 			});
 		if (!_.has(administrators, email))
 			return res.send({
 				code: 40100,
 				errmsg: 'email does not exist.'
 			});
 		var hash_pass = crypto.createHash('sha256').update(password).digest('hex');
 		if (administrators[email] != hash_pass)
 			return res.send({
 				code: 40101,
 				errmsg: 'password is incorrect.'
 			});
 		req.session.isAdmin = true;
 		res.send({
 			email: email,
 			features: ['promote/product/index','promote/media/index']
 		});
 	};

 	var logout = function(req, res) {
 		req.session.isAdmin = false;
 		console.log('admin logout.');
 		// console.log(req.session);
 		res.send({});
 	};

 	//登录判断
 	var checkLogin = function(req, res) {
 		if (req.session.isAdmin) return res.send({});
 		res.send({
 			code: 40100,
 			errmsg: '401 Unauthorized.'
 		});
 	};

 	/**
 	 * router outline
 	 */

 	//login
 	app.post('/admin/login', login);
 	//logout
 	app.get('/admin/logout', logout);
 	//authenticate
 	app.get('/admin/login/check', checkLogin);

 	//

 };
var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:authentication.superadmin');
logger.setLevel('DEBUG');

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
 		logger.info(email + ' login.');
 		logger.debug('session(superadmin):' + JSON.stringify(req.session));
 		req.session.isSuperAdmin = true;
 		//grant_super
 		var grant = {};
 		req.session.grant_super = grant;
 		logger.debug(email + ' new grant: '+ util.inspect(req.session.grant_super));
 		logger.info(email + ' is granted.');
 		res.send({
 			email: email
 		});
 	};

 	var logout = function(req, res) {
		req.session.isSuperAdmin = false;
 		req.session.grant_super = {};
		logger.debug(req.session.email + ' logout(session): ' + req.session);
 		logger.info('logout(superadmin): ' + req.session.email);
 		res.send({});
 	};

 	var checkLogin = function(req, res) {
 		var email = req.session.email || '';
 		var grant = req.session.grant || '';
 		if(_.isEmpty(email)) logger.error('email is lost.');
 		if(_.isUndefined(grant)) logger.error('grant is lost.');
 		logger.info(email + ' access.');
 		logger.debug(email + ' grant: ' + JSON.stringify(grant));
 		if (req.session.isSuperAdmin) return res.send({});
 		res.send({
 			code: 40100,
 			errmsg: '401 Unauthorized.'
 		});
 	};

 	/**
 	 * router outline
 	 */

 	//login
 	app.post('/super/login', login);
 	//logout
 	app.get('/super/logout', logout);
 	//check login
 	app.get('/super/login/check', checkLogin);
 };
var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:authentication.superadmin');
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
 		logger.info(email + ' login.');
 		//grant
 		var grants = req.session.grant.split(';');
 		grants = _.without(grants,'');
 		var grant_superadmin = ['/platform/apps','/platform/features'];
 		var grants_new = grants.concat(grant_superadmin);
 		grants_new = _.uniq(grants_new);
 		req.session.isSuperAdmin = true;
 		req.session.grant = grants_new.join(';');
 		logger.debug(email + ' new grant: '+ util.inspect(req.session.grant));
 		logger.info(email + ' is granted.');
 		res.send({
 			email: email
 		});
 	};

 	var logout = function(req, res) {
		req.session.isSuperAdmin = false;
 		var email = req.session.email || '';
 		var grant = req.session.grant || '';
 		if(_.isEmpty(email)) logger.error('email is lost.');
 		if(_.isEmpty(grant)) logger.error('grant is lost.');
 		// cancel grant
 		req.session.grant = '';
 		// var grants = grant.split(';');
 		// grants = _.without(grants, '');
 		// logger.debug(grants);
 		// var grant_superadmin = ['/platform/apps','/platform/features'];
 		// _.each(grant_superadmin,function(item){
 		// 	grants = _.without(grants,item);
 		// })
 		// logger.debug(grants);
 		// req.session.grant = grants.join(';') || '';
 		// logger.debug(email + ' new grant: '+ req.session.grant);
 		logger.info(email + ' super admin logout.');
 		res.send({});
 	};

 	var checkLogin = function(req, res) {
 		var email = req.session.email || '';
 		var grant = req.session.grant || '';
 		if(_.isEmpty(email)) logger.error('email is lost.');
 		if(_.isUndefined(grant)) logger.error('grant is lost.');
 		logger.info(email + ' access.');
 		logger.debug(email + ' grant: ' + grant);
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
 exports = module.exports = function(app, models) {
 	var _ = require('underscore');
 	var crypto = require('crypto');
 	var administrators = require('../config/admin');
 
 	var login = function(req,res){
 		var email = req.body.email;
 		var password = req.body.password;
		if(null == email || email.length<1 || null == password || password.length<1)
			return res.send({code:40002,errmsg: 'email or password is null.'});
		if(!_.has(administrators,email))
			return res.send({code: 40100, errmsg: 'email does not exist.'});
		var hash_pass = crypto.createHash('sha256').update(password).digest('hex');
		if(administrators[email] != hash_pass)
			return res.send({code: 40101, errmsg: 'password is incorrect.'});
		res.send({email: email, token: hash_pass});
 	};

 	var authenticated = function(req,res){
 		var email = req.body.email;
 		var token = req.body.token;
		if(token == administrators[email])
			return res.send({});
		res.sendStatus(401);
 	};

	//登录判断中间件
	app.isAdmin = function(req,res,next){
		var bear_token = req.headers['bear_token'];
		if(token){
			var arr = bear_token.split(':') || [];//email:password
			if(administrators[arr[0]] == arr[1])
				return next();
		}
		res.sendStatus(401);
	};

 	/**
 	 * router outline
 	 */

 	//login
 	app.post('/admin/login', login);
 	//authenticate
 	app.post('/admin/authenticated', authenticated);

 	//

 };
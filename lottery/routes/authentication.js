module.exports = exports = function(app,models){
	var crypto = require('crypto');
 	var nodemailer = require('nodemailer');
	var smtpTransport = require('nodemailer-smtp-transport');
	var config = {
			mail: require('../config/mail')
		};		
	var Account = models.Account;
	
	var register = function(req,res){
			var user = req.body || {};
			var username = user.username;
			var password = user.password;
			user.password = crypto.createHash('sha256').update(password).digest('hex');
			user.createby = {
				username: username,
				avatar: '',
			};
			user.avatar = '';
			user.roles = {
				admin: false,
				agent: false,
				user: true
			};
			user.business = {
				stage: 'prod',
				times: 10,
				expired: (new Date()).getTime() + 1000*60*60*24*3
			};
			user.balance = 0;
			user.enable = false;
			user.registerCode = crypto.createHash('sha256').update(email + "beyond" + password).digest('hex');

			var user = new Account(user);
			user.createby.id = user._id;

			user.save(function(err){
				if(err){
					callback(err);
					return;					
				}
				var host = req.header('host');
				var registerConfirmUrl = 'http://' + host + '/register/confirm';
				registerConfirmUrl += '?email=' + user.email + '&' + 'code=' + user.registerCode;
				var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));

				smtpTransporter.sendMail(
					{
						from: 'cai@pdbang.cn',
						to: user.email,
						subject: '祝您好运系统注册确认',
						text: 'Click here to finish your registration: ' + registerConfirmUrl
					},
					function(succss){

					}
				);
				res.sendStatus(200);
			});		
		};

	var confirm = function(req,res){
			var email = req.query.email;
			var code = req.query.code;
			Account
				.findOneAndUpdate({
						email: email,
						registerCode: code
					},
					{
						$set: {enable: true}
					},
					function(result){
						if(result){
							res.render('registrationSuccess.jade');
						}else{
							res.render('registrationFailure.jade');
						}
					}
				);
		};

	var login = function(req,res){
			var email = req.body.email;
			var password = req.body.password;

			if(null == email || email.length<1 || null == password || password.length<1){
				res.send({code:40002,message: 'email or password is null.'});
				return;
			}
			
			Account
				.findOne({
					email: email,
					password: crypto.createHash('sha256').update(password).digest('hex'),
					enable: true,
				})
				.exec(function(err,account){
					if(err){
						res.send({code:40100,message: 'login error.'});
						return;
					}
					if(!account){
						res.send({code:40401,message: 'user not exist.'});
						return;
					}
					req.session.loggedIn = true;
					req.session.account = account;
					req.session.account.id = account._id;
					console.log('login:');
					console.log(req.session);
					res.json({
						id: req.session.account._id,
						email: req.session.account.email,
						username: req.session.account.username,
						avatar: req.session.account.avatar,
						roles: req.session.account.roles
					});
				});
		};

	var logout = function(req,res){
			req.session.loggedIn = false;
			console.log('logout:');
			console.log(req.session);
			res.sendStatus(200);
		};

	var forgotPassword = function(req,res){
			var email = req.body.email;
			if(null == email || email.length<1){
				res.send({code:40001,message: 'email is null.'});
				return;
			}
			var host = req.header('host');
			var resetPasswordUrl = 'http://' + host + '/resetPassword';
			Account.findOne(
				{
				email:email
				},
				function(err,doc){
					if(err){
						callback && callback(err);
						return;
					}
					var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
					resetPasswordUrl += '?account=' + doc._id;

					smtpTransporter.sendMail(
						{
							from: 'cai@pdbang.cn',
							to: email,
							subject: 'ID service Password Reset Request',
							text: 'Click here to reset your password: ' + resetPasswordUrl
						},
						function(success){
							if(!success){
								res.send({errocde:40401,message:'username does not exist.'});
								return;
							}
							res.sendStatus(200);
						}
					);
				}
			);
		};

	var resetPasswordForm = function(req,res){
			var accountId = req.param('account', null);
			res.render('resetPassword.jade',{locals: {accountId: accountId}});

		};

	var resetPassword = function(req,res){
			var accountId = req.body.accountId;
			var password = req.body.password;
			if(null != accountId && null != password){
				Account.update(
					{
						_id: accountId
					},
					{
						$set:{
							password: crypto.createHash('sha256').update(newPassword).digest('hex')
						}
					},
					{
						upsert:false
					},
					callback
				);
			}
			res.render('resetPasswordSuccess.jade');
		};

	var authenticated = function(req,res){
			// console.log('authenticated:');
			console.log(req.session)
			if(req.session.loggedIn){
				res.json({
					id: req.session.account._id,
					email: req.session.account.email,
					username: req.session.account.username,
					avatar: req.session.account.avatar,
					roles: req.session.account.roles
				});
			}else{
				res.send({code:40101,message: 'did not login.'});
			}
		};

/**
 * router outline
 */

 	//register
 	app.post('/register',register);
 	//confirm
 	app.get('/register/confirm', confirm);
 	//login
 	app.post('/login',login);
 	//logout
 	app.get('/logout', logout);
 	//forgot password
 	app.post('/forgotPassword', forgotPassword);
 	//reset password
 	app.get('/resetPassword', resetPasswordForm);
 	//reset password
 	app.post('/resetPassword', resetPassword);
 	//authenticated
 	app.get('/authenticated', authenticated);
};
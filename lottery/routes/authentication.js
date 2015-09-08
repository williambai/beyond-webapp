module.exports = exports = function(app,models){
	var Account = models.Account;
	
	var register = function(req,res){
			var username = req.body.username || '';
			var email = req.body.email;
			var password = req.body.password;

			if(null == email || email.length<1 || null == password || password.length<1){
				res.send({errcode:40000,errmsg: 'email or password is null.'});
				return;
			}
			var host = req.header('host');
			var registerConfirmUrl = 'http://' + host + '/register/confirm';
			Account.register(email,password,username,registerConfirmUrl);
			res.sendStatus(200);
		};

	var confirm = function(req,res){
			var email = req.query.email;
			var code = req.query.code;
			Account.registerConfirm(email,code,function(result){
				if(result){
					res.render('registrationSuccess.jade');
				}else{
					res.render('registrationFailure.jade');
				}
			});
		};

	var login = function(req,res){
			var email = req.body.email;
			var password = req.body.password;

			if(null == email || email.length<1 || null == password || password.length<1){
				res.send({errcode:40002,errmsg: 'email or password is null.'});
				return;
			}
			Account.login(email,password,function(err,account){
				if(err){
					res.send({errcode:40100,errmsg: 'login error.'});
					return;
				}
				if(!account){
					res.send({errcode:40401,errmsg: 'user not exist.'});
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
				res.send({errcode:40001,errmsg: 'email is null.'});
				return;
			}
			var host = req.header('host');
			var resetPasswordUrl = 'http://' + host + '/resetPassword';
			Account.forgotPassword(email, resetPasswordUrl,function(success){
				if(!success){
					res.send({errocde:40401,errmsg:'username does not exist.'});
					return;
				}
				res.sendStatus(200);
			});
			res.sendStatus(200);
		};

	var resetPasswordForm = function(req,res){
			var accountId = req.param('account', null);
			res.render('resetPassword.jade',{locals: {accountId: accountId}});

		};

	var resetPassword = function(req,res){
			var accountId = req.body.accountId;
			var password = req.body.password;
			if(null != accountId && null != password){
				Account.resetPassword(accountId,password);
			}
			res.render('resetPasswordSuccess.jade');
		};

	var authenticated = function(req,res){
			// console.log('authenticated:');
			// console.log(req.session)
			if(req.session.loggedIn){
				res.json({
					id: req.session.account._id,
					email: req.session.account.email,
					username: req.session.account.username,
					avatar: req.session.account.avatar,
					roles: req.session.account.roles
				});
			}else{
				res.send({errcode:40101,errmsg: 'did not login.'});
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
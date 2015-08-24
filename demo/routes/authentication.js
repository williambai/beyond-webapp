module.exports = exports = function(app,models){
	var Account = models.Account;
	
	var register = function(req,res){
			var username = req.body.username || '';
			var email = req.body.email;
			var password = req.body.password;

			if(null == email || email.length<1 || null == password || password.length<1){
				res.sendStatus(400);
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
				res.sendStatus(400);
				return;
			}
			Account.login(email,password,function(account){
				if(!account){
					res.sendStatus(401);
					return;
				}
				// console.log(email + ': login successfully.');
				req.session.loggedIn = true;
				req.session.accountId = account._id;
				req.session.email = account.email;
				req.session.username = account.username;
				req.session.avatar = account.avatar;
				res.json({
					id: req.session.accountId,
					email: req.session.email,
					username: req.session.username,
					avatar: req.session.avatar
				});
			});
		};

	var logout = function(req,res){
			delete req.session.loggedIn;
			// console.log(req.session.accountId + ': logout sucessfully.');
			res.sendStatus(200);
		};

	var forgotPassword = function(req,res){
			var email = req.body.email;
			if(null == email || email.length<1){
				res.sendStatus(400);
				return;
			}
			var host = req.header('host');
			var resetPasswordUrl = 'http://' + host + '/resetPassword';
			Account.forgotPassword(email, resetPasswordUrl,function(success){
				if(!success){
					res.sendStatus(404);
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
			if(req.session.loggedIn){
				res.json({
					id: req.session.accountId,
					email: req.session.email,
					username: req.session.username,
					avatar: req.session.avatar
				});
			}else{
				res.sendStatus(401);
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
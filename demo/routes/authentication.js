module.exports = exports = function(app, models) {
	var crypto = require('crypto');
	var nodemailer = require('nodemailer');
	var smtpTransport = require('nodemailer-smtp-transport');
	var config = {
		mail: require('../config/mail')
	};
	var Account = models.Account;

	var register = function(req, res) {
		var user = req.body || {};

		var password = user.password;
		user.password = crypto.createHash('sha256').update(password).digest('hex');

		user.registerCode = crypto.createHash('sha256').update(user.email + "beyond" + password).digest('hex');

		user.status = {
			code: -1,
			message: '注册但未验证'
		};
		user.lastupdatetime = new Date();

		Account.create(user, function(err, doc) {
			if (err) return res.send(err);
			res.send(doc);

			var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));

			smtpTransporter.sendMail({
					from: config.email.from,
					to: user.email,
					subject: config.email.subject,
					text: config.email.text.replace(/\{[(a-z]+\}/ig, function(name) {
						if (name == '{host}') return req.header('host');
						if (name == '{email}') return user.email;
						if (name == '{code}') return user.registerCode;
					}),
				},
				function(succss) {
				}
			);
		});
	};

	var confirm = function(req, res) {
		var email = req.query.email;
		var code = req.query.code;
		Account
			.findOneAndUpdate({
					email: email,
					registerCode: code
				}, {
					$set: {
						enable: 0
					}
				},
				function(result) {
					if (result) {
						res.render('registrationSuccess.jade');
					} else {
						res.render('registrationFailure.jade');
					}
				}
			);
	};

	var login = function(req, res) {
		var email = req.body.email;
		var password = req.body.password;

		if (null == email || email.length < 1 || null == password || password.length < 1) {
			res.send({
				code: 40002,
				message: 'email or password is null.'
			});
			return;
		}

		Account
			.findOne({
				email: email,
				password: crypto.createHash('sha256').update(password).digest('hex'),
				'status.code': 0,
			})
			.exec(function(err, account) {
				if (err) {
					res.send({
						code: 40100,
						message: 'login error.'
					});
					return;
				}
				if (!account) {
					res.send({
						code: 40401,
						message: 'user not exist.'
					});
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

	var logout = function(req, res) {
		req.session.loggedIn = false;
		console.log('logout:');
		console.log(req.session);
		res.sendStatus(200);
	};

	var forgotPassword = function(req, res) {
		var email = req.body.email;
		if (null == email || email.length < 1) {
			res.send({
				code: 40001,
				message: 'email is null.'
			});
			return;
		}
		var host = req.header('host');
		var resetPasswordUrl = 'http://' + host + '/resetPassword';
		Account.findOne({
				email: email
			},
			function(err, doc) {
				if (err) {
					callback && callback(err);
					return;
				}
				var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
				resetPasswordUrl += '?account=' + doc._id;

				smtpTransporter.sendMail({
						from: 'socialworkserivce@appmod.cn',
						to: email,
						subject: 'SocialWork Password Reset Request',
						text: 'Click here to reset your password: ' + resetPasswordUrl
					},
					function(success) {
						if (!success) {
							res.send({
								errocde: 40401,
								message: 'username does not exist.'
							});
							return;
						}
						res.sendStatus(200);
					}
				);
			}
		);
	};

	var resetPasswordForm = function(req, res) {
		var accountId = req.param('account', null);
		res.render('resetPassword.jade', {
			locals: {
				accountId: accountId
			}
		});

	};

	var resetPassword = function(req, res) {
		var accountId = req.body.accountId;
		var password = req.body.password;
		if (null != accountId && null != password) {
			Account.update({
					_id: accountId
				}, {
					$set: {
						password: crypto.createHash('sha256').update(newPassword).digest('hex')
					}
				}, {
					upsert: false
				},
				callback
			);
		}
		res.render('resetPasswordSuccess.jade');
	};

	var inviteFriend = function(req, res) {
		var emails = req.body.emails;
		var inviteUrl = 'http://' + req.header('host');
		var username = req.session.username;
		var email = req.session.email;

		var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
		inviteUrl = inviteUrl ? inviteUrl : 'http://localhost:8080';
		emails.forEach(function(email) {
			smtpTransporter.sendMail({
				from: 'socialworkserivce@appmod.cn',
				to: email,
				subject: '我的工作社交网--邀请信',
				text: '您的朋友' + username + '(' + email + ')' + '邀请您加入。请点击：' + inviteUrl,
			}, function(err) {
				if (err) return res.send(err);
				res.sendStatus(200);
			});
		});
	};

	var authenticated = function(req, res) {
		if (req.session.loggedIn) {
			res.json({
				id: req.session.accountId,
				email: req.session.email,
				username: req.session.username,
				avatar: req.session.avatar
			});
		} else {
			res.sendStatus(401);
		}
	};

	/**
	 * router outline
	 */

	//register
	app.post('/register', register);
	//confirm
	app.get('/register/confirm', confirm);
	//login
	app.post('/login', login);
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
	//invite
	app.post('/invite/friend', app.isLogined, inviteFriend);
};
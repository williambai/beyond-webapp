module.exports = exports = function(app, models) {
	var _ = require('underscore');
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
			var text = config.mail.register_text.replace(/\{[(a-z]+\}/ig, function(name) {
				if (name == '{host}') return req.header('host');
				if (name == '{email}') return user.email;
				if (name == '{code}') return user.registerCode;
			});

			console.log('register confirm email text: ' + text);
			smtpTransporter.sendMail({
					from: config.mail.from,
					to: user.email,
					subject: config.mail.register_subject,
					text: text,
				},
				function(err,info) {
					if(err) return console.error(err);
					console.log(info);
				}
			);
		});
	};

	var confirm = function(req, res) {
		var email = req.body.email;
		var code = req.body.code;

		if (null == email || !(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email)))
			return res.send({
				code: 40101,
				errmsg: '邮件地址错误'
			});
		if (null == code)
			return res.send({
				code: 40110,
				errmsg: '验证码不存在',
			});
		Account
			.findOneAndUpdate({
					email: email,
					registerCode: code
				}, {
					$set: {
						'status.code': 0,
						'status.message': '注册成功，可以登陆'
					}
				}, {
					upsert: false,
				},
				function(err, doc) {
					if (err) return res.send(err);
					if (!doc) return res.send({
						code: 40400,
						errmsg: '验证错误'
					});
					return res.send({
						success: true
					});
				}
			);
	};

	var login = function(req, res) {
		var email = req.body.email;
		var password = req.body.password;
		if (null == email || !(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email)))
			return res.send({
				code: 40101,
				errmsg: '不是有效的邮件地址'
			});

		if (null == password || password.length < 1)
			return res.send({
				code: 40002,
				errmsg: '忘记输入密码'
			});

		Account
			.findOne({
				email: email
			})
			.exec(function(err, account) {
				if (err)
					return res.send(err);
				if (!account)
					return res.send({
						code: 40401,
						errmsg: '用户不存在。'
					});
				if (account.status.code == -1)
					return res.send({
						code: 40402,
						errmsg: '还未通过验证，请查看邮件，并尽快验证。'
					});
				if (account.password != crypto.createHash('sha256').update(password).digest('hex'))
					return res.send({
						code: 40403,
						errmsg: '密码不正确。'
					});
				console.log(email + ': login successfully.');
				console.log(req.session);
				req.session.loggedIn = true;
				req.session.accountId = account._id;
				req.session.email = account.email;
				req.session.username = account.username;
				req.session.avatar = account.avatar;
				res.send({
					id: req.session.accountId,
					email: req.session.email,
					username: req.session.username,
					avatar: req.session.avatar
				});
			});

	};

	var logout = function(req, res) {
		req.session.loggedIn = false;
		// console.log('logout:');
		// console.log(req.session);
		res.sendStatus(200);
	};

	var forgotPassword = function(req, res) {
		var email = req.body.email;
		if (null == email || !(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(email)))
			return res.send({
				code: 40101,
				errmsg: '不是有效的邮件地址'
			});

		var host = req.header('host');

		Account.findOne({
				email: email
			},
			function(err, doc) {
				if (err) return res.send(err);
				if (!doc) return res.send({
					code: 40400,
					errmsg: '邮件不存在'
				});
				res.send(doc);

				var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
				var text = config.mail.reset_text.replace(/\{[(a-z]+\}/ig, function(name) {
					if (name == '{host}') return req.header('host');
					if (name == '{token}') return doc._id
				});
				console.log('forgot password email content: ' + text);
				smtpTransporter.sendMail({
						from: config.mail.from,
						to: email,
						subject: config.mail.reset_subject,
						text: text,
					},
					function(err,info) {
						if(err) return console.error(err);
						console.log(info);
					}
				);
			}
		);
	};

	var resetPassword = function(req, res) {
		var token = req.body.token;
		if (null == token)
			return res.send({
				code: 40400,
				errmsg: '无效的请求，缺少token'
			});

		var password = req.body.password;
		var cpassword = req.body.cpassword;

		if (null == password || null == cpassword || password.length < 5)
			return res.send({
				code: 40102,
				errmsg: '密码长度不正确'
			});
		if (cpassword != password)
			return res.send({
				name: 40103,
				errmsg: '两次输入不一致'
			});
		var id = token;
		Account.findByIdAndUpdate(id, {
				$set: {
					password: crypto.createHash('sha256').update(password).digest('hex')
				}
			}, {
				upsert: false
			},
			function(err, doc) {
				if (err) return res.send(err);
				res.send(doc);
				// res.redirect('/reset_success.html');
			}
		);
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

		console.log('invite email text: ' + text);
		emails.forEach(function(email) {
			smtpTransporter.sendMail({
				from: config.mail.from,
				to: email,
				subject: config.mail.invite_subject,
				text: text,
			}, function(err,info) {
				if(err) return console.error(err);
				console.log(info);
			});
		});
	};

	var authenticated = function(req, res) {
		if (req.session.loggedIn) {
			res.send({
				id: req.session.accountId,
				email: req.session.email,
				username: req.session.username,
				avatar: req.session.avatar
			});
		} else {
	 		res.send({code: 40100, errmsg: '401 Unauthorized.'});
		}
	};

	/**
	 * router outline
	 */

	//register
	app.post('/register', register);
	//confirm
	app.post('/register/confirm', confirm);
	//login
	app.post('/login', login);
	//logout
	app.get('/logout', logout);
	//forgot password
	app.post('/forgotPassword', forgotPassword);
	// reset password
	app.post('/resetPassword', resetPassword);
	//authenticated
	app.get('/authenticated', authenticated);
	//invite
	app.post('/invite/friend', app.isLogined, inviteFriend);
};
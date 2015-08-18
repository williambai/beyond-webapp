module.exports = exports = function(app, config,mongoose,nodemailer){
	var account = null;

	var smtpTransport = require('nodemailer-smtp-transport');

	var crypto = require('crypto');

	var schemaOptions = {
			toJSON: {
				virtuals: true
			},
			toObject: {
				virtuals: true
			}
		};
	
	var accountSchema = new mongoose.Schema({
			createBy: {
				id: String,
				username: String,
				avatar: String,
			},
			email : {type: String, unique: true},
			password: String,
			username: String,
			avatar: String,
			birthday: {
				day: {type:Number,min:1,max:31, required: false},
				month: {type:Number, min:1, max: 12, required: false},
				year: {type: Number}
			},
			biography: String,
			roles: {
				admin: Boolean,
				agent: Boolean,
				user: Boolean,
				app: Boolean
			},
			business: {
				type: {
					verify: Boolean,
					base: Boolean,
					whole: Boolean 
				},
				prices: {
					verify: Number,
					base: Number,
					whole: Number,
				},
				times: {
					verify: Number,
					base: Number,
					whole: Number,
				},
				stage: String, /** test,dev,prod */
				limit: Number,
				expired: Date,
			},
			app: {
				app_id: String,
				app_secret: String,
				apis: {
					verify: Boolean,
					base: Boolean,
					whole: Boolean
				}
			},
			balance: Number,
			enable: Boolean, //账号的有效性；false：注册但不能登录；true：正常可登陆
			registerCode: String, //注册验证码

		});

	var AccountModel = mongoose.model('Account', accountSchema);

	var Account = function(model){
		this.model = model;
	};

	Account.prototype.debug = true;
	Account.prototype.defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Account Save/Remove/Update successfully.');
		};

	Account.prototype.register = function(email,password,username,registerConfirmUrl,callback){
			var shaSum = crypto.createHash('sha256');
			shaSum.update(password);

			var user = new this.model({
				createBy: {
					username: username,
					avatar: '',
				},
				email: email,
				password: shaSum.digest('hex'),
				username: username,
				avatar: '',
				roles: {
					admin: false,
					agent: false,
					user: true
				},
				business: {
					stage: 'prod',
					times: 10,
					expired: (new Date()).getTime() + 1000*60*60*24*3
				},
				balance: 0,
				enable: false,
				registerCode: crypto.createHash('sha256').update(email + "beyond" + password).digest('hex')
			});
			user.createBy.id = user._id;

			user.save(function(err){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);					
				}else{
					callback && callback(user);
				}
				var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
				registerConfirmUrl += '?email=' + user.email + '&' + 'code=' + user.registerCode;

				smtpTransporter.sendMail({
					from: 'idserivce@pdbang.cn',
					to: user.email,
					subject: '公民身份验证系统注册确认',
					text: 'Click here to finish your registration: ' + registerConfirmUrl
				},function(err){
					this.debug && this.defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(true);
					}
				});
			});
		};

	Account.prototype.registerConfirm = function(email,code,callback){
			this.model
				.findOneAndUpdate({
						email: email,
						registerCode: code
					},
					{
						$set: {enable: true}
					},
					function(err){
						this.debug && this.defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(true);
						}
					}
				);
		};

	Account.prototype.add = function(creator, account, callback){
			var password = account.password;
			var shaSum = crypto.createHash('sha256');
			if(account && account.password){
				shaSum.update(account.password);
			}
			account.createBy = creator;
			account.app = {
				app_id: crypto.randomBytes(8).toString('hex'),
				app_secret: crypto.randomBytes(16).toString('hex'),
				apis: {
					verify: false,
					base: false,
					whole: false
				}
			};
			
			account.business.times = {
				verify: 5,
				base: 1,
				whole: 1
			};

			account.business.prices = {
				verify: 2,
				base: 5,
				whole: 10
			};

			account.registerCode = crypto.createHash('sha256').update(account.email + "beyond" + account.password).digest('hex');
			var user = new this.model(account);

			// var user = new this.model({
			// 	createBy: {
			// 		id: creator.id,
			// 		username: creator.username || '',
			// 		avatar: creator.avatar || '',
			// 	},
			// 	email: account.email,
			// 	password: shaSum.digest('hex'),
			// 	username: account.username,
			// 	avatar: account.avatar || '',
			// 	roles: {
			// 		admin: account.roles.admin || false,
			// 		agent: account.roles.agent || false,
			// 		user: account.roles.user || false
			// 	},
			// 	business: {
			// 		stage: account.business.stage || 'test',
			// 		type: {
			// 			verify: account.business.type.verify || false,
			// 			base: account.business.type.base || false,
			// 			whole: account.business.type.whole || false
			// 		},
			// 		times: {
			// 			verify: 5,
			// 			base: 1,
			// 			whole: 1
			// 		},
			// 		limit: account.business.limit || -1,
			// 		expired: account.business.expired || (new Date()).getTime() + 1000*60*60*24*3
			// 	},
			// 	app: {
			// 		app_id: crypto.randomBytes(8).toString('hex'),
			// 		app_secret: crypto.randomBytes(16).toString('hex'),
			// 		apis: {
			// 			base: false,
			// 			photoBase: false
			// 		}
			// 	},
			// 	balance: account.balance || 0,
			// 	enable: true,
			// 	registerCode: crypto.createHash('sha256').update(account.email + "beyond" + account.password).digest('hex')
			// });

			user.save(function(err){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);					
				}else{
					callback && callback(user);
				}
				var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));

				smtpTransporter.sendMail({
					from: 'idserivce@pdbang.cn',
					to: user.email,
					subject: '公民身份验证系统注册信息',
					text: '您现在可以登录<a href="http://id.pdbang.cn">公民身份验证系统</a>了。<br><br>' + 
							'用户名：' + user.email + '<br>' +
							'密码：' + password + '<br>'
				},function(err){
					this.debug && this.defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(true);
					}
				});
			});
		};

	Account.prototype.update = function(id,account,callback){
			this.model
				.findByIdAndUpdate(
					id,
					account,
					function(err){
						this.debug && this.defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(true);
						}
					}
				);
		};

	Account.prototype.login = function(email,password, callback){
			var shaSum = crypto.createHash('sha256');
			shaSum.update(password);
			
			this.model.findOne({
				email: email,
				password: shaSum.digest('hex'),
				// enable: 0,
			},function(err,doc){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(doc);
				}
			});
		};

	Account.prototype.inviteFriend = function(emails, inviteUrl, username, email, callback){
			var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
			inviteUrl ? inviteUrl : 'http://localhost:8080';
			emails.forEach(function(email){
				smtpTransporter.sendMail({
					from: 'socialworkserivce@appmod.cn',
					to: email,
					subject: '我的工作社交网--邀请信',
					text: '您的朋友' + username + '(' + email + ')' + '邀请您加入。请点击：' + inviteUrl,
				},function inviteCallback(err){
					this.debug && this.defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(true);
					}
				});
			});
		};

	Account.prototype.forgotPassword = function(email,resetPasswordUrl,callback){
		this.model.findOne({email:email},function(err,doc){
			if(err){
				this.debug && this.defaultCallback(err);
				callback && callback(null);
				return;
			}
			var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
			resetPasswordUrl += '?account=' + doc._id;

			smtpTransporter.sendMail({
				from: 'idservice@pdbang.cn',
				to: email,
				subject: 'ID service Password Reset Request',
				text: 'Click here to reset your password: ' + resetPasswordUrl
			},function forgetPasswordCallback(err){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(true);
				}
			});
		});
	};

	Account.prototype.resetPassword = function(accountId,newPassword, callback){
			var shaSum = crypto.createHash('sha256');
			shaSum.update(newPassword);
			this.model.update(
				{
					_id: accountId
				},
				{
					$set:{password: shaSum.digest('hex')}
				},
				{
					upsert:false
				},
				function(err){
					this.debug && this.defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback({_id: accountId});
					}
			});
		};

	Account.prototype.findById = function(accountId,callback){
		this.model.findOne({_id: accountId}, function(err,doc){
			this.debug && this.defaultCallback(err);
			if(err){
				callback && callback(null);
			}else{
				callback && callback(doc);
			}
		});
	};

	Account.prototype.findAll = function(accountIds, page, callback){
		page = (!page || page<0) ? 0 : page;
		var per = 20;
		this.model
			.find({_id: {$in: accountIds}})
			.skip(page*per)
			.limit(per)
			.exec(function(err,docs){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(docs);
				}
			});
		};

	Account.prototype.findByString = function(createId,searchStr,page,callback){
		page = (!page || page<0) ? 0 : page;
		var per = 20;
		var searchRegex = new RegExp(searchStr,'i');
		this.model
			.find({
				$or: [
					{'username': {$regex: searchRegex}},
					{'email': {$regex: searchRegex}}
				]
			})
			.where({
				'createBy.id': createId
			})
			.skip(page*per)
			.limit(per)
			.exec(function(err,accounts){
			this.debug && this.defaultCallback(err);
			if(err || accounts.length == 0){
				callback && callback(null);
			}else{
				callback && callback(accounts);
			}
		});
	};

	Account.prototype.updateAvatar = function(id,avatar,callback){
			this.model
				.findByIdAndUpdate(
					id,
					{
						avatar: avatar
					},
					function(err){
						this.debug && this.defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(true);
						}
					}
				);
		};

	if(!account){
		account = new Account(AccountModel);
	}

	Account.prototype.updateTimes = function(id,type,count,callback){
		var path = 'business.times.' + type;
		this.model
			.findByIdAndUpdate(
				id,
				{
					'$inc': {path: -1}
				},
				callback(err,doc)
			);
	};

	Account.prototype.updateBalance = function(id,cost,callback){
		var path = 'balance';
		this.model
			.findByIdAndUpdate(
				id,
				{
					'$inc': {path: -cost}
				},
				callback(err,doc)
			);
	};

	return account;
};
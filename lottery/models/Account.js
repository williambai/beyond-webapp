module.exports = exports = function(app, config,mongoose,nodemailer){
	var _ = require('underscore');
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
			createby: {
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

	Account.prototype.register = function(email,password,username,registerConfirmUrl,callback){
			callback = callback || function(){};

			var shaSum = crypto.createHash('sha256');
			shaSum.update(password);

			var user = new this.model({
				createby: {
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
			user.createby.id = user._id;

			user.save(function(err){
				if(err){
					callback && callback(err);
					return;					
				}
				if(registerConfirmUrl && registerConfirmUrl.length > 0){
					var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
					registerConfirmUrl += '?email=' + user.email + '&' + 'code=' + user.registerCode;

					smtpTransporter.sendMail(
						{
							from: 'idserivce@pdbang.cn',
							to: user.email,
							subject: '祝您好运系统注册确认',
							text: 'Click here to finish your registration: ' + registerConfirmUrl
						},
						callback
					);
				}else{
					callback(null,user);
				}
			});
		};

	Account.prototype.registerConfirm = function(email,code,callback){
			callback = callback || function(){};

			this.model
				.findOneAndUpdate({
						email: email,
						registerCode: code
					},
					{
						$set: {enable: true}
					},
					callback
				);
		};

	Account.prototype.add = function(creator, account, callback){
			callback = callback || function(){};

			var password = account.password;
			var shaSum = crypto.createHash('sha256');
			if(account && account.password){
				shaSum.update(account.password);
				account.password = shaSum.digest('hex');
			}
			account.createby = creator;
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

			user.save(function(err,doc){
				if(err){
					callback(err);
					return;
				}
				var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));

				smtpTransporter.sendMail(
					{
						from: 'idserivce@pdbang.cn',
						to: user.email,
						subject: '公民身份验证系统注册信息',
						text: '您现在可以登录<a href="http://id.pdbang.cn">公民身份验证系统</a>了。<br><br>' + 
								'用户名：' + user.email + '<br>' +
								'密码：' + password + '<br>'
					},
					callback
				);
			});
		};

	Account.prototype.update = function(id,account,callback){
			callback = callback || function(){};
			if(account.password){
				var shaSum = crypto.createHash('sha256');
				shaSum.update(account.password);
				account.password = shaSum.digest('hex');
			}
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

			this.model
				.findByIdAndUpdate(
					id,
					account,
					callback
				);
		};

	Account.prototype.login = function(email,password, callback){
			callback = callback || function(){};
			var shaSum = crypto.createHash('sha256');
			shaSum.update(password);
			
			this.model
				.findOne({
					email: email,
					password: shaSum.digest('hex'),
					enable: true,
				})
				.exec(callback);
		};

	Account.prototype.inviteFriend = function(emails, inviteUrl, username, email, callback){
			callback = callback || function(){};
			var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
			inviteUrl ? inviteUrl : 'http://localhost:8080';
			emails.forEach(function(email){
				smtpTransporter.sendMail(
					{
						from: 'socialworkserivce@appmod.cn',
						to: email,
						subject: '我的工作社交网--邀请信',
						text: '您的朋友' + username + '(' + email + ')' + '邀请您加入。请点击：' + inviteUrl,
					},
					callback
				);
			});
		};

	Account.prototype.forgotPassword = function(email,resetPasswordUrl,callback){
			callback = callback || function(){};
		this.model.findOne({email:email},function(err,doc){
			if(err){
				callback && callback(err);
				return;
			}
			var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
			resetPasswordUrl += '?account=' + doc._id;

			smtpTransporter.sendMail(
				{
					from: 'idservice@pdbang.cn',
					to: email,
					subject: 'ID service Password Reset Request',
					text: 'Click here to reset your password: ' + resetPasswordUrl
				},
				callback
			);
		});
	};

	Account.prototype.resetPassword = function(accountId,newPassword, callback){
			callback = callback || function(){};
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
				callback
			);
		};

	Account.prototype.findById = function(accountId,select,callback){
			callback = callback || function(){};
			var _default = {
				createby: 0,
				password: 0,
				registerCode: 0,
			};
			var selected = _.extend(_default,select);
			this.model
				.findById(accountId)
				.select(selected)
				.exec(callback);
		};

	Account.prototype.findOne = function(query,select,callback){
			callback = callback || function(){};
			var _default = {
				createby: 0,
				password: 0,
				registerCode: 0,
			};
			var selected = _.extend(_default,select);
			this.model
				.findOne(query)
				.select(selected)
				.exec(callback);
		};

	Account.prototype.findAll = function(createId,page,callback){
			callback = callback || function(){};
			var _default = {
				createby: 0,
				password: 0,
				registerCode: 0,
			};
			page = (!page || page<0) ? 0 : page;
			var per = 20;
			this.model
				.find({})
				.where({
					'createby.id': createId
				})
				.select(_default)
				.skip(page*per)
				.limit(per)
				.exec(callback);		
		};

	Account.prototype.findByIds = function(accountIds, page, callback){
			callback = callback || function(){};
			page = (!page || page<0) ? 0 : page;
			var per = 20;
			this.model
				.find({_id: {$in: accountIds}})
				.skip(page*per)
				.limit(per)
				.exec(callback);
		};

	Account.prototype.findByString = function(createId,searchStr,page,callback){
			callback = callback || function(){};
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
					'createby.id': createId
				})
				.skip(page*per)
				.limit(per)
				.exec(callback);
		};

	Account.prototype.updateAvatar = function(id,avatar,callback){
			callback = callback || function(){};
			var path_avatar = 'avatar';
			this.model
				.findByIdAndUpdate(
					id,
					{
						$set: {path_avatar: avatar}
					},
					callback
				);
		};

	Account.prototype.updateTimes = function(id,type,count,callback){
			callback = callback || function(){};
			var path_type = 'business.times.' + type;
			this.model
				.findByIdAndUpdate(
					id,
					{
						$inc: {path_type: -1}
					},
					{
						select: {business: 1}
					},
					callback
				);
		};

	Account.prototype.updateBalance = function(id,cost,callback){
			callback = callback || function(){};
			var path_balance = 'balance';
			this.model
				.findByIdAndUpdate(
					id,
					{
						$inc: {path_balance: -cost}
					},
					{
						select: {business: 1}
					},
					callback
				);
		};

	if(!account){
		account = new Account(AccountModel);
	}

	return account;
};
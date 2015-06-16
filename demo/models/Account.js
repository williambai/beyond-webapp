module.exports = exports = function(app, config,mongoose,nodemailer){
	var debug = true;

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
	
	var contactSchema = new mongoose.Schema({
			'accountId': {type: String},
			'username': {type: String},
			'avatar': {type: String},
			'added': {type: Date}, //when the contact was added
			'updated': {type: Date} // when the contanct was updated
		},schemaOptions);

	contactSchema.virtual('online').get(function(){
		return app.isAccountOnline(this.get('accountId'));
	});

	mongoose.contactSchema = contactSchema;

	var accountSchema = new mongoose.Schema({
			'email' : {type: String, unique: true},
			'password': {type: String},
			'username': {type: String},
			'realname': {type: String},
			'registerCode': {type: String}, //注册验证码
			'enable': {type: Number, default: -1}, //账号的有效性；-1：注册但不能登录；0：正常可登陆

			'birthday': {
				day: {type:Number,min:1,max:31, required: false},
				month: {type:Number, min:1, max: 12, required: false},
				year: {type: Number}
			},

			'avatar': {type: String},
			'biography': {type: String},
			'contacts': [contactSchema],
			projects: [
				{
					_id: mongoose.Schema.ObjectId,
					name: String,
					type: {type: String}, //参与或主持
					notification: {type: Number}, //通知提醒，0: 接收；1: 拒绝
					agree: {type: Number} //0: 正常；1: 待确认；-1: 拒绝/不显示
				}
			], //主持或参与的项目
			'activity': [], //All status updates including friends
		});

	mongoose.accountSchema = accountSchema;

	var Account = mongoose.model('Account', accountSchema);

	var defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Account Save/Remove/Update successfully.');
		};

	var register = function(email,password,username,registerConfirmUrl,callback){
			var shaSum = crypto.createHash('sha256');
			shaSum.update(password);

			var user = new Account({
				email: email,
				username: username,
				realname: username,
				password: shaSum.digest('hex'),
				registerCode: crypto.createHash('sha256').update(email + "beyond" + password).digest('hex'),
				enable: -1,
				avatar: ''
			});
			user.save(function(err){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);					
				}else{
					callback && callback(user);
				}
				var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
				registerConfirmUrl += '?email=' + user.email + '&' + 'code=' + user.registerCode;

				smtpTransporter.sendMail({
					from: 'socialworkserivce@appmod.cn',
					to: user.email,
					subject: 'SocialWork Registration Confirm Request',
					text: 'Click here to finish your registration: ' + registerConfirmUrl
				},function forgetPasswordCallback(err){
					debug && defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(true);
					}
				});
			});
		};

	var registerConfirm = function(email,code,callback){
			Account
				.findOneAndUpdate({
						email: email,
						registerCode: code
					},
					{
						$set: {enable: 0}
					},
					function(err){
						debug && defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(true);
						}
					}
				);
		};

	var login = function(email,password, callback){
			var shaSum = crypto.createHash('sha256');
			shaSum.update(password);
			
			Account.findOne({
				email: email,
				password: shaSum.digest('hex'),
				// enable: 0,
			},function(err,doc){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(doc);
				}
			});
		};

	var forgotPassword = function(email,resetPasswordUrl,callback){
		Account.findOne({email:email},function(err,doc){
			if(err){
				debug && defaultCallback(err);
				callback && callback(null);
				return;
			}
			var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
			resetPasswordUrl += '?account=' + doc._id;

			smtpTransporter.sendMail({
				from: 'socialworkserivce@appmod.cn',
				to: email,
				subject: 'SocialWork Password Reset Request',
				text: 'Click here to reset your password: ' + resetPasswordUrl
			},function forgetPasswordCallback(err){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(true);
				}
			});
		});
	};

	var resetPassword = function(accountId,newPassword, callback){
			var shaSum = crypto.createHash('sha256');
			shaSum.update(newPassword);
			Account.update(
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
					console.log('Change password done for account ' + accountId);
					debug && defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback({_id: accountId});
					}
			});
		};

	var findById = function(accountId,callback){
		Account.findOne({_id: accountId}, function(err,doc){
			debug && defaultCallback(err);
			if(err){
				callback && callback(null);
			}else{
				callback && callback(doc);
			}
		});
	};

	var findAll = function(accountIds, page, callback){
		page = (!page || page<0) ? 0 : page;
		var per = 20;
		Account
			.find({_id: {$in: accountIds}})
			.skip(page*per)
			.limit(per)
			.exec(function(err,docs){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(docs);
				}
			});
		};

	var addContact = function(account, contactJson, callback){
		var contactNew = {
			accountId: contactJson._id,
			username: contactJson.username,
			avatar: contactJson.avatar,
			added: new Date(),
			updated: new Date()
		};
		account.contacts.forEach(function(contact){
			if(contactJson._id == contact.accountId){
				contactNew = null;
			}
		});
		if(contactNew && (contactJson._id.toString() != account._id.toString())){
			account.contacts.push(contactNew);
			account.save(function(err){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(contactNew);
				}
			});
		}
	};

	var removeContact = function(account, contactId, callback){
		if(null == account.contacts || account.contacts.length == 0) return;
		account.contacts.forEach(function(contact){
			if(contactId == contact.accountId){
				account.contacts.remove(contact);
				account.save(function(err){
					debug && defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(contact);
					}
				});
			}
		});
	};

	var hasContact = function(account, contactId){
		if(null == account.contacts) return false;

		account.contacts.forEach(function(contact){
			if(contactId == contact.accountId){
				return true;
			}
		});
		return false;
	};

	var findByString = function(searchStr,callback){
		var searchRegex = new RegExp(searchStr,'i');
		Account.find({
			$or: [
				{'username': {$regex: searchRegex}},
				{'email': {$regex: searchRegex}}
			]
		},function(err,accounts){
			debug && defaultCallback(err);
			if(err || accounts.length == 0){
				callback && callback(null);
			}else{
				callback && callback(accounts);
			}
		});
	};
	var updateAvatar = function(id,avatar,callback){
			Account
				.findByIdAndUpdate(
					id,
					{
						avatar: avatar
					},
					function(err){
						debug && defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(true);
						}
					}
				);
		};

	var addProject = function(id, projectId,name,type,callback){
			var projectNew = {
				_id: projectId,
				name: name,
				type: type || 0,
				notification: 0,
				agree: 0,
			};

			Account.findOne({_id:id}, function(err,account){
				debug && defaultCallback(err);
				if(err || account == null){
					callback && callback(null);
					return;
				}
				account.projects = account.projects || [];
				account.projects.forEach(function(project){
					if(projectNew._id == project._id){
						projectNew = null;
					}
				});
				if(projectNew){
					account.projects.push(projectNew);
					account.save(function(err){
						debug && defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(projectNew);
						}
					});
				}			
			});	
		};

	var removeProject = function(id, projectId){
			Account.findOne({_id: id}, function(err,account){
				debug && defaultCallback(err);
				if(err || account == null){
					callback && callback(null);
					return;
				}
				if(null == account.projects || account.projects.length == 0) return;

				account.projects.forEach(function(project){
					if(projectId == project._id){
						account.projects.remove(project);
						account.save(function(err){
							debug && defaultCallback(err);
							if(err){
								callback && callback(null);
							}else{
								callback && callback(project);
							}
						});
					}
				});
			});
		};

	var updateAccount = function(id,account,callback){
			Account
				.findByIdAndUpdate(
					id,
					account,
					function(err){
						debug && defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(true);
						}
					}
				);
		};

	return {
		Account: Account,
		findById: findById,
		findAll: findAll,
		register: register,
		registerConfirm: registerConfirm,
		forgotPassword: forgotPassword,
		resetPassword: resetPassword,
		login: login,
		addContact: addContact,
		removeContact: removeContact,
		hasContact: hasContact,
		findByString: findByString,
		updateAvatar: updateAvatar,
		updateAccount: updateAccount,
		addProject: addProject,
		removeProject: removeProject,
	};
};
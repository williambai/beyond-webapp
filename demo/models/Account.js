module.exports = exports = function(app, config,mongoose,nodemailer){
	var debug = true;

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
			'username': {type: String},
			'accountId': {type: String},
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

			'birthday': {
				day: {type:Number,min:1,max:31, required: false},
				month: {type:Number, min:1, max: 12, required: false},
				year: {type: Number}
			},

			'avatar': {type: String},
			'biography': {type: String},
			'contacts': [contactSchema],
			'activity': [], //All status updates including friends
		});

	mongoose.accountSchema = accountSchema;

	var Account = mongoose.model('Account', accountSchema);

	var registerCallback = function(err){
		if(err){
			return console.log(err);
		}
		return console.log('Account was created');
	};

	var register = function(email,password,username){
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);

		var user = new Account({
			email: email,
			username: username,
			realname: username,
			password: shaSum.digest('hex'),
			avatar: ''
		});
		user.save(registerCallback);
	};

	var login = function(email,password, callback){
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		
		Account.findOne({
			email: email,
			password: shaSum.digest('hex')
		},function(err,doc){
			callback(doc);
		});
	};

	var forgotPassword = function(email,resetPasswordUrl,callback){
		Account.findOne({email:email},function(err,doc){
			if(err){
				callback(false);
				return;
			}
			var smtpTransport = nodemailer.createTransport('SMTP',config.mail);
			resetPasswordUrl += '?account=' + doc._id;

			smtpTransport.sendMail({
				from: 'admin@appmod.cn',
				to: email,
				subject: 'SocialNet Password Reset Request',
				text: 'Click here to reset your password: ' + resetPasswordUrl
			},function forgetPasswordCallback(err){
				if(err){
					callback(false);
				}else{
					callback(true);
				}
			})
		});
	};

	var resetPassword = function(accountId,newPassword){
		var shaSum = crypto.createHash('sha256');
		shaSum.update(newPassword);
		Account.update({_id: accountId},{$set:{password: shaSum.digest('hex')}},{upsert:false},
			function changePasswordCallback(err){
				console.log('Change password done for account ' + accountId);
		});
	};

	var findById = function(accountId,callback){
		Account.findOne({_id: accountId}, function(err,doc){
			callback(doc);
		});
	};

	var findAll = function(accountIds, page, callback){
		page = (!page || page<0) ? 0 : page;
		var per = 20;
		Account.find({_id: {$in: accountIds}}, function(err,docs){
			if(err){
				registerCallback(err);
				return;
			}
			callback(docs);
		}).skip(page*per).limit(per);
	};

	var addContact = function(account, contactJson){
		var contact = {
			username: contactJson.username,
			accountId: contactJson._id,
			avatar: contactJson.avatar,
			added: new Date(),
			updated: new Date()
		};
		account.contacts.push(contact);
		account.save(function(err){
			if(err){
				console.log('Error saving account: ' + err);
			}
		});
	};

	var removeContact = function(account, contactId){
		if(null == account.contacts || account.contacts.length == 0) return;
		account.contacts.forEach(function(contact){
			if(contactId == contact.accountId){
				account.contacts.remove(contact);
			}
		});
		account.save(function(err){
			if(err){
				console.log('Error remove contact from account: ' + err);
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
			if(err || accounts.length == 0){
				callback(null);
			}else{
				callback(accounts);
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
						debug && registerCallback(err);
						callback && callback(err);
					}
				);
		};

	var updateAccount = function(id,account,callback){
			Account
				.findByIdAndUpdate(
					id,
					account,
					function(err){
						debug && registerCallback(err);
						callback && callback(err);
					}
				);
		};

	return {
		Account: Account,
		findById: findById,
		findAll: findAll,
		register: register,
		forgotPassword: forgotPassword,
		resetPassword: resetPassword,
		login: login,
		addContact: addContact,
		removeContact: removeContact,
		hasContact: hasContact,
		findByString: findByString,
		updateAvatar: updateAvatar,
		updateAccount: updateAccount,
	};
};
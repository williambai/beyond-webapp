module.exports = exports = function(app, config,mongoose,nodemailer){
	var crypto = require('crypto');

	var schemaOptions = {
			toJSON: {
				virtuals: true
			},
			toObject: {
				virtuals: true
			}
		};

	var statusSchema = new mongoose.Schema({
			name: {
				first: {type: String},
				last: {type: String}
			},
			status: {type: String}
		});
	mongoose.statusSchema = statusSchema;
	
	var contactSchema = new mongoose.Schema({
			'name': {
				'first': {type: String },
				'last': {type: String }
			},
			'accountId': {type: mongoose.Schema.ObjectId},
			'added': {type: Date}, //when the contact was added
			'updated': {type: Date} // when the contanct was updated
		},schemaOptions);

	contactSchema.virtual('online').get(function(){
		return app.isAccountOnline(this.get('accountId'));
	});

	mongoose.contactSchema = contactSchema;

	// contactSchema.pre('save',function(next){
	// 	console.log(this.name + ':' + this.accountId);
	// 	next();
	// });


	var accountSchema = new mongoose.Schema({
			'email' : {type: String, unique: true},
			'password': {type: String},
			'name': {
				'first': {type: String},
				'last': {type: String},
				'full': {type: String}
			},
			'birthday': {
				day: {type:Number,min:1,max:31, required: false},
				month: {type:Number, min:1, max: 12, required: false},
				year: {type: Number}
			},
			'photoUrl': {type: String},
			'biography': {type: String},
			'contacts': [contactSchema],
			'status': [statusSchema],//My own status updates only
			'activity': [statusSchema], //All status updates including friends
		});
	mongoose.accountSchema = accountSchema;

	var Account = mongoose.model('Account', accountSchema);

	var registerCallback = function(err){
		if(err){
			return console.log(err);
		}
		return console.log('Account was created');
	};

	var register = function(email,password,firstName,lastName){
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);

		var user = new Account({
			email: email,
			name: {
				first: firstName,
				last: lastName,
				full: firstName + ' ' + lastName
			},
			password: shaSum.digest('hex')
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
			name: {
				first: contactJson.name.first,
				last: contactJson.name.last
			},
			accountId: contactJson._id,
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
				{'name.full': {$regex: searchRegex}},
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
		findByString: findByString
	};
};
module.exports = exports = function(config,mongoose,nodemailer){
	var crypto = require('crypto');

	var AccountSchema = new mongoose.Schema({
			'email' : {type: String, unique: true},
			'password': {type: String},
			'name': {
				'first': {type: String},
				'last': {type: String}
			},
			'birthday': {
				day: {type:Number,min:1,max:31, required: false},
				month: {type:Number, min:1, max: 12, required: false},
				year: {type: Number}
			},
			'photoUrl': {type: String},
			'biography': {type: String}
		});

	var Account = mongoose.model('Account', AccountSchema);

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
				last: lastName
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
			callback(null != doc);
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

	return {
		model: Account,
		register: register,
		forgotPassword: forgotPassword,
		resetPassword: resetPassword,
		login: login,
	};
};
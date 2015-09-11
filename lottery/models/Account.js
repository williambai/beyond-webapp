module.exports = exports = function(mongoose){

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
			email : String,
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

	return mongoose.model('Account', accountSchema);

};
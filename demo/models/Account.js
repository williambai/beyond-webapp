module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			email: {type: String, unique: true},
			password: String,
			username: String,
			birthday: {
				day: {type:Number,min:1,max:31, required: false},
				month: {type:Number, min:1, max: 12, required: false},
				year: {type: Number}
			},
			avatar: String,
			biography: String,
			registerCode: String, //注册验证码

			histroies: [],
			status: {
				code: Number,//账号的有效性；-1：注册但不能登录；0：正常可登陆
				message: String,
			},
			createby: {
				uid: String,
				username: String,
				avatar: String,
			},
			lastupdatetime: Date
		});

	schema.set('collection', 'accounts');

	return mongoose.model('Account', schema);
};
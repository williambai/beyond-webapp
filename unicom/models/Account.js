module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		email: {
			type: String,
			unique: true
		},
		openid: String, //wechat openid
		password: String,
		username: String,
		apps: [],
		roles: [],
		department: {
			id: String, //** 营业厅
			name: String,
			path: String,
		},
		birthday: {
			day: {
				type: Number,
				min: 1,
				max: 31,
				required: false
			},
			month: {
				type: Number,
				min: 1,
				max: 12,
				required: false
			},
			year: {
				type: Number
			}
		},
		avatar: String,
		biography: String,
		registerCode: String, //注册验证码
		status: {
			type: String,
			enum: {
				values: '未验证|正常|禁用'.split('|'),//账号的有效性；注册但不能登录；正常登陆；禁止登录
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		creator: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Account',
			},
			username: String,
			avatar: String,
		},
		histories: [],
		lastupdatetime: Date
	});

	schema.set('collection', 'accounts');

	return mongoose.model('Account', schema);
};
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		username: String,//账户登录名称
		password: String,//账户登录密码
		user: {//账户所有人信息
			name: String,
		},
		company: {//账户所属公司信息
			name: String,
			website: String,
		},
		cookies: [],
		cookieRaw: String,
		login: {
			type: Boolean,
			default: false
		},
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},

	});

	schema.set('collection','stock.accounts');
	return mongoose.model('StockAccount',schema);
};
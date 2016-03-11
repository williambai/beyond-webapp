module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		username: String,//账户登录名称
		password: String,//账户登录密码
		user: {//账户所有人信息
			name: String,//** 真实姓名
		},
		company: {//账户所属公司
			id: String,
			name: String,
			avatar: String,
		},
		asset: Number,//** 资产总额
		balance: Number,//** 账户资产结余		
		cookies: [],
		cookieRaw: String,
		login: {
			type: Boolean,//** 是否已经自动登录成功
			default: false
		},
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		createBy: {//** 账户创建者
			id: String,
			name: String,			
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},

	});

	schema.set('collection','trade.accounts');
	return mongoose.model('TradeAccount',schema);
};
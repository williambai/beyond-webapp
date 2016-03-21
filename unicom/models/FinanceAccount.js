/**
 * 财务模块
 * - 用户资金账号
 */
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		uid: { //** 系统用户
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account'
		},
		amount: { //** 账户结余
			type: Number,
			default: 0
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','finance.accounts');
	return mongoose.model('FinanceAccount',schema);
};
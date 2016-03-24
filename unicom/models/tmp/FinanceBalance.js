/**
 * 财务模块
 * - 用户财务资金平衡调整
 */
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		uid: { //** 系统用户
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account'
		},
		amount: Number, //** 调整金额，增加为+，减少为-
		reason: String, //** 调整原因
		createdBy: {
			id: String, //** 调整操作人Id
			name: String, //** 调整操作人name
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','finance.balances');
	return mongoose.model('FinanceBalance',schema);
};
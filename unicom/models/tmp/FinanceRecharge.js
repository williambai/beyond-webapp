/**
 * 财务模块
 * - 用户充值
 */
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		uid: { //** 系统用户
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account'
		},
		amount: Number, //** 充值金额，增加为+，减少为-
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','finance.recharges');
	return mongoose.model('FinanceRecharge',schema);
};
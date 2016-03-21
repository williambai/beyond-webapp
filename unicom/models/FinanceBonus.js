/**
 * 财务模块
 * - 用户佣金
 */

module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		uid: { //** 系统用户
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account'
		},
		oid: { //** 订单Id
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Order'
		},
		category:{
			type: String,
			enum: {
				values: '第一次解冻|第二次解冻|第三次解冻|全部解冻'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		amount: Number, //** 佣金收入金额，增加为+，减少为-
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection', 'finance.bonuses');
	return mongoose.model('FinanceBonus', schema);
};
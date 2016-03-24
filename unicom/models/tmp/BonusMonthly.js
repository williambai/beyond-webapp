/**
 * 财务模块
 * - 用户佣金
 */

module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		uid: { //** 用户ID
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account'
		},
		year: Number, //** 年份
		month: Number,//** 月份
		product: {
			name: String, //** 产品名称
		},
		price: Number, //** 单个产品佣金收入。产品收入 = size(bonuses) * price
		bonuses: [], //**  佣金明细ID, FinanceBonus._id
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection', 'bonuses.monthly');
	return mongoose.model('BonusMonthly', schema);
};
/**
 * 财务模块
 * - 用户佣金发放
 */

module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		uid: String, //** 用户ID
		username: String, //** 用户名
		mobile: String, //** 用户手机号
		year: Number, //** 年份
		month: Number,//** 月份
		amount: Number,//** 业务数额
		tax: Number,//** 税收
		cash: Number, //** 实际派发数额
		reason: String, //** 调整原因
		status: {
			type: String,
			enum: {
				values: '未核算|已核算'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			},
			default: '未核算',
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection', 'finance.bonuses');
	return mongoose.model('FinanceBonus', schema);
};
/**
 * 财务模块
 * - 用户银行卡
 */
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		uid: String, //** 用户Id
		mobile: String, //** 用户手机号
		bankName: String,//** 银行名称
		bankCode: String,//** 银行代码
		bankAddr: String,//** 银行地址
		accountName: String,//** 银行卡姓名
		accountNo: String, //** 银行卡卡号
		cardId: String, //** 身份证号码
		expired: Date, //** 有效期
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','finance.banks');
	return mongoose.model('FinanceBank',schema);
};
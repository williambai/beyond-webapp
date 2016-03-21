/**
 * 财务模块
 * - 用户充值/提现
 */
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		uid: { //** 系统用户
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account'
		},
		bankName: String,//** 银行名称
		bankCode: String,//** 银行代码
		bankAddr: String,//** 银行地址
		accountName: String,//** 银行卡姓名
		accountNo: String, //** 银行卡卡号
		type: {//** 类型
			type: String,
			enum: {
				values: '充值|提现'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		amount: Number, //** 充值/提现金额。充值为"+"，提现减少为"-"
		createdBy: {
			id: String, //** 调整操作人Id
			name: String, //** 调整操作人name
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','finance.cashes');
	return mongoose.model('FinanceCash',schema);
};
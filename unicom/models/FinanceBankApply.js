/**
 * 财务模块
 * - 用户申请收款银行卡，待管理员审核后覆盖用户银行卡FinanceBank方可生效
 */
var mongoose = require('mongoose');
var mongooseToCsv = require('mongoose-to-csv');
var CSV = require('comma-separated-values');
var async = require('async');

var schema = new mongoose.Schema({
	uid: String, //** 用户Id
	mobile: String, //** 用户手机号
	bankName: String, //** 银行名称
	bankCode: String, //** 银行代码
	bankAddr: String, //** 银行地址
	accountName: String, //** 银行卡姓名
	accountNo: String, //** 银行卡卡号
	cardId: String, //** 身份证号码
	expired: String, //** 有效期
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		enum: {
			values: '新建|通过|放弃'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
});

schema.set('collection', 'finance.banks.apply');

//** 导出csv
schema.plugin(mongooseToCsv,{
	headers: '手机号码 银行名称 银行代码 开户地址 银行卡主姓名 银行卡号码 身份证号码 有效期',
	constraints: {
		'手机号码': 'mobile',
		'银行名称': 'bankName',
		'银行代码': 'bankCode',
		'开户地址': 'bankAddr',
		'银行卡主姓名': 'accountName',
		'银行卡号码': 'accountNo',
		'身份证号码': 'cardId',
		'有效期': 'expired',
	}
});

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('FinanceBankApply', schema);
};
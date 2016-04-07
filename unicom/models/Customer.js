var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String, //** 客户姓名
	mobile: String, //** 客户手机号
	idNo: String, //** 客户身份证号码
	idType: String, //** 客户身份证类型
	idAddress: String, //** 客户身份证地址
	address: String, //** 客户通讯地址
	phone: String, //** 客户备用联系电话
	location: String, //** 客户地理位置
	department: { //** 客户直接管理部门
		id: String,
		name: String, //** 营业厅名称
		city: String, //** 城市名称
		grid: String, //** 网格编码
		district: String, //** 地区编码
	},
	account_name: String, //** 特定客户经理
	account_mobile: String, //** 特定客户经理ID
	status: {
		type: String,
		enum: {
			values: '有效|无效'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
});

schema.set('collection', 'customers');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('Customer', schema);
};
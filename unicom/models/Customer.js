module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String, //** 客户姓名
		mobile: String, //** 客户手机号
		idNo: String, //** 客户身份证号码
		idType: String, //** 客户身份证类型
		idAddress: String, //** 客户身份证地址
		address: String, //** 客户通讯地址
		phone: String,//** 客户备用联系电话
		location: String, //** 客户地理位置
		department: [String], //** 客户直接管理部门
		account_name: String,//** 特定客户经理
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

	schema.set('collection','customers');
	return mongoose.model('Customer',schema);
};
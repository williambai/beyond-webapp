/**
 * 电子商务中的产品
 * 
 */
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String, //** 产品名称
	description: String, //** 产品描述
	category: String, //** 产品分类，4G
	barcode: String, //** 产品编码，唯一编码
	smscode: String, //** 业务编码，sms短信
	price: Number, //** 产品建议价格
	unit: String, //** 产品价格单位
	quantity: Number, //** 产品库存：库存量
	bonus: { //** 单个佣金
		type: Number,
		default: 0,
	},
	status: {
		type: String,
		enum: {
			values: '有效|无效'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
});

schema.set('collection', 'goods');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('Goods', schema);
};
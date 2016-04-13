/**
 * 电子商务中的产品
 * 
 */
var mongoose = require('mongoose');
var mongooseToCsv = require('mongoose-to-csv');

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

//** 导出csv
schema.plugin(mongooseToCsv,{
	headers: '产品名称 产品分类 产品编码 业务编码 价格 价格单位 产品库存数量 佣金 状态',
	constraints: {
		'产品名称': 'name',
		'产品分类': 'category',
		'产品编码': 'barcode',
		'业务编码': 'smscode',
		'价格': 'price',
		'价格单位': 'unit',
		'佣金': 'bonus',
		'状态': 'status',
	}
});
module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('Goods', schema);
};


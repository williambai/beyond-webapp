/**
 * 简单商品 
 * 每个商品与产品(goods._id)一对一
 */
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	description: String,
	category: String,
	thumbnail_url: String,
	url: String,
	price: Number,
	unit: String,
	quantity: Number,
	starttime: String,
	endtime: String,
	display_sort: {
		type: Number,
		default: 0
	},
	tags: String, //** 以空格分隔的字符串
	goods: {
		name: String, //** 产品名称(goods.name)
		id: String, //** 产品id(goods._id)
		category: String, //** 产品分类(goods.category)
		barcode: String, //** 产品编码(goods.barcode)
		smscode: String, //** 业务(SMS)编码(goods.smscode)
		price: Number, //** 产品单价(product.price)
		bonus: Number, //** 单个产品佣金
	},
	// bonus: {
	// 	income: Number,//** 佣金收入
	// 	times: Number, //** 佣金分几次兑现
	// 	points: Number,//** 积分
	// },
	status: {
		type: String,
		enum: {
			values: '有效|无效'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
});

schema.set('collection', 'product.directs');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('ProductDirect', schema);
};
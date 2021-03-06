var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	product: {
		id: String,
		name: String,
		description: String,
		category: String,
		price: Number,
		quantity: {
			type: Number,
			default: 1
		},
	},
	customer: {
		id: String,
		name: String,
		phone: String,
		email: String,
		age: Number,
		sex: {
			type: String,
			enum: {
				values: '保密|男|女'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		zipcode: String,
		address: String,
		attach: String, //留言
	},
	seller: { //** 客户经理
		id: String, //** Account._id
		email: String, //** 用户手机号
		username: String,
	},
	status: {
		type: String,
		enum: {
			values: '未处理|废弃|成功'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		},
		default: '未处理',
	},
	lastupdatetime: {
		type: Date,
		default: Date.now,
	},
});

schema.set('collection', 'sale.leads');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('SaleLead', schema);
};
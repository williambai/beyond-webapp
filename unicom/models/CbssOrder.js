var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	'order_id': String, //** '订单id',
	'phone': String, //** '手机号',
	'product_name': String, //** '产品名称',
	'account': String, //** '账号',
	'password': String, //** 密码
	'order_status': { //** 订购状态
		type: String,
		default: '-1',
	},
	'err_msg': String, //** '出错原因',
	'order_status_time': Date, //** '订购状态返回时间',
	'add_time': { //** '记录添加时间',
		type: Date,
		default: Date.now
	}
});

schema.set('collection', 'cbss.orders');

module.exports = exports = function(connection) {
	connection = connection || mongoose;
	return connection.model('CbssOrder', schema);
};
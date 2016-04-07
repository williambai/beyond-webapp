/**
 * 财务模块
 * - 用户佣金
 */

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	uid: { //** 用户
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account'
	},
	oid: { //** 订单Id
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Order'
	},
	user_name: String,//**用户名
	product_name: String, //** 产品名
	city: String, //** 用户所属城市
	grid: String, //** 用户所属网格
	department: String, //** 用户所属团体
	category:{
		type: String,
		enum: {
			values: '第一次解冻|第二次解冻|第三次解冻|全部解冻'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
	amount: Number, //** 佣金收入金额，增加为+，减少为-
	status: { //** 佣金是否有效
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

schema.set('collection', 'bonuses');

module.exports = exports = function(connection) {
	connection = connection || mongoose;
	return connection.model('Bonus', schema);
};
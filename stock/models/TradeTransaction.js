var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	account: {//** StockAccount 交易账号信息
		id: String,//** 交易账号
		user: {//** 账户所有人信息
			name: String,//** 真实姓名
		},
		company: {
			name: String,
			avatar: String,
		},
	},
	symbol: {//** 品种交易别名
		type: String,
		required: true,
	},
	name: String, //** 品种名称，如: 中国国航
	nickname: String,//** 品种代码，如: 601111
	direction: {
		type: String,
		enum: '买入|卖出'.split('|'),
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	tax: {
		type: Number,
		default: 0,
	},
	status: {
		code: {
			type: Number,
			enum: [-1, 0], //-1 未成交；0 成交
			default: 0,
		},
		message: String,
	},
	date: {
		type: String,
		match: [/[0-9]+\-[0-9]+\-[0-9]+/, '{PATH}日期格式不对，格式为 xxxx-xx-xx'],
		required: true,
	},
	time: {
		type: String,
		match: [/[0-9]+:[0-9]+:[0-9]+/, '{PATH}时间格式不对，格式为 xx:xx:xx'],
		required: true,
	},
	createBy: {//** 交易拥有者
		id: String,
		name: String,			
	},
	lastupdatetime: {
		type: Date,
		default: Date.now,
	}
});

schema.set('collection', 'trade.transactions');

exports = module.exports = function(connection) {
	connection = connection || mongoose;
	return connection.model('TradeTransaction', schema);
};
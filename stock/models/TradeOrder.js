module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		account: {//** StockAccount 交易账号信息
			id: String,
			user: {//账户所有人信息
				name: String,//** 真实姓名
			},
			company: {
				id: String,
				name: String,
				avatar: String,
			},
		},
		transaction: {//** 交易
			price: {
				type: Number, //成交价(元)
				min: 0,
				max: 100,
			},
			quantity: {
				type: Number, //买入量(股)
				min: -100000,
				max: 100000,
			},
			direction: {
				type: String, 
				enum: {
					values: '买入|卖出'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				},
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
		},
		status: {
			type: String,
			enum: {
				values: '新建|下单|成功|失败'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			},
			default: '新建',
		},
	});
	schema.set('collection','trade.orders');
	return mongoose.model('TradeOrder',schema);
};
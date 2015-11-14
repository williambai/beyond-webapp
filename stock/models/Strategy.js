exports = module.exports = function(mongoose) {

	var schema = new mongoose.Schema({
		symbol: {
			type: String,
			unique: true,
			required: true
		},
		stock: {
			name: String,
			code: String,
		},
		//strategy params
		params: {
			name: {
				type: String,
				enum: {
					values: 'T0'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				},
				required: true,
			},
			description: String,
			risk_h: {
				type: Number, //区间高点(元)
				required: true,
				min: 0,
				max: 100,
				validate: [
					function(val) {
						if (this.init.risk_l > val) return false;
					},
					'risk_h < risk_l is not allowed.',
					'NumberError'
				]
			},
			risk_l: {
				type: Number, //区间低点(元)
				required: true,
				min: 0,
				max: 100,
				validate: [
					function(val) {
						if (this.init.risk_h < val) return false;
					},
					'risk_h > risk_l is not allowed.',
					'NumberError'
				]
			},
			init_p: {
				type: Number, //初始成交价(元)
				required: true,
				min: 0,
				max: 100,
			},
			init_v: {
				type: Number, //初始买入量(股)
				required: true,
				min: 1000,
				max: 10000,
			},
			buy_lt: {
				type: Number, //上涨%百分比(绝对值)，买入
				required: true,
				min: 1,
				max: 10,
			},
			sell_gt: {
				type: Number, //下跌%百分比(绝对值)，卖出
				required: true,
				min: 1,
				max: 10,
			},
			amount: {
				type: Number, //每次买入量（股）
				required: true,
				min: 1000,
			},
			method: {
				type: String,
				default: 'eq',
				enum: {
					values: 'eq'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				},
			}
		},
		//transactions deepth
		transactions: [{
			price: {
				type: Number, //成交价(元)
				min: 0,
				max: 100,
			},
			volume: {
				type: Number, //买入量(股)
				min: -100000,
				max: 100000,
			},
			direction: {
				type: Number, // 低价卖入：-1，高价买出：1
				enum: {
					values: '-1|1'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				},
			},

		}],
		// last_price: {
		// 	type: Number, //上次成交价(元)
		// 	min: 0,
		// 	max: 100,
		// },
		// last_volume: {
		// 	type: Number, //上次买入量(股)
		// 	min: 1000,
		// 	max: 10000,
		// },
		deepth: {
			type: Number, //连续买卖次数：买入一次，价格降低：--，；卖出一次，价格升高：++
			default: 0,
			enum: {
				values: '-3|-2|-1|0|1|2|3'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			},
		},
		status: {
			code: {
				type: Number,
				enum: {
					values: '0|1'.split('|'), //1: 正常交易，0：停止交易
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				},
			},
			message: String,
		},
		lastupdatetime: {
			type: Date,
			default: Date.now,
		},
	});

	schema.set('collection', 'stragtegies');
	if (mongoose.models.Strategy) {
		return mongoose.model('Strategy');
	}
	return mongoose.model('Strategy', schema);
};
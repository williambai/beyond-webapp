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
				// min: 1,
				max: 10,
			},
			sell_gt: {
				type: Number, //下跌%百分比(绝对值)，卖出
				required: true,
				// min: 1,
				max: 10,
			},
			quantity: {
				type: Number, //每次买入量（股）
				required: true,
				min: 1000,
			},
			depth: {
				type: Number, //连续买卖最大次数
				default: 0,
				min: 1,
				max: 5,
			},
			times_max: Number, //允许最大交易次数
			method: {
				type: String,
				default: 'eq',
				enum: {
					values: 'eq'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				},
			}
		},
		//transactions depth
		transactions: [{
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
				type: String, // 低价卖入：-1，高价买出：1
				enum: {
					values: '买入|卖出'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				},
			},
		}],
		times: {
			type: Number, //买卖总次数
			default: 0,
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
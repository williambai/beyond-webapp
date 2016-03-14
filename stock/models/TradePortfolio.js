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
		symbol: {//** 品种交易别名，如: sh601111
			type: String,
			required: true
		},
		name: String, //** 品种名称，如: 中国国航
		nickname: String,//** 品种代码，如: 601111

		quantity: {//** 品种当前数量
			type: Number,
			default: 0
		},
		quantity_sold: {//** 品种已卖出数量，用于T+0卖出交易判断
			type: Number,
			default: 0
		},
		asset: Number,//** 初始资产，在启动时初始化。收益 = 当前品种价格 * 当前品种数量 + 债务 - 初始资产
		price: Number,//** 初始资产单位价格
		debt: {//** 债务，卖出减少债务，买入增加债务
			type: Number,
			default: 0,
		},
		bid: {//** 记录回撤时的最高或最低出价
			direction: {
				type: String, 
				enum: {
					values: '买入|待定|卖出'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				},
				default: '待定',
			},
			price: {// 最高卖出或最低买入的竞价
				type: Number,
				min: 0,
				default: 0,
			},
		},
		times: {
			buy: {
				type: Number, //买总次数
				default: 0,
			},
			sell: {
				type: Number, //卖总次数
				default: 0,
			},
		},
		params: {//** 当前模型快照

		},
		lastTransaction: {//** 最后一次交易
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
			},
			time: {
				type: String,
				match: [/[0-9]+:[0-9]+:[0-9]+/, '{PATH}时间格式不对，格式为 xx:xx:xx'],
			},
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
				type: String, 
				enum: {
					values: '买入|卖出'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				},
			},
			date: {
				type: String,
				match: [/[0-9]+\-[0-9]+\-[0-9]+/, '{PATH}日期格式不对，格式为 xxxx-xx-xx'],
			},
			time: {
				type: String,
				match: [/[0-9]+:[0-9]+:[0-9]+/, '{PATH}时间格式不对，格式为 xx:xx:xx'],
			},
		}],
		status: {
			type: String,
			enum: {
				values: '实战|模拟'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			},
			default: '模拟',
		},
		createBy: {//** 创建者
			id: String,
			name: String,			
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},

	});
	schema.set('collection','trade.portfolios');
	return mongoose.model('TradePortfolio',schema);
	// schema.set('collection','trade.portfolio.histories');
	// mongoose.model('TradePortfolioHistory',schema); //** 保存历史记录
};
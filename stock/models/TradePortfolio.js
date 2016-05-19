var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var _ = require('underscore');
var async = require('async');
var Trading = require('../libs/trading').stock;
var citic = require('../libs/citic');

var mongoose = require('mongoose');
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

/**
 * 询价处理
 */
schema.statics.processStock = function(options,done){
	if(typeof options == 'function'){
		done = options;
		options = {};
	}
	connnection.models.TradePortfolio
		.find({
		})
		.select({transactions: 0})// ** 忽略 transactions
		.exec(function(err, strategies) {
			if (err) return logger.error(err);
			if (_.isEmpty(strategies)) return logger.debug('没有可执行的股票投资组合。');
			trading = new Trading();

			//** 将报价保存到数据库
			trading.on('quote', function(stock) {
				// logger.debug('quote: ' + JSON.stringify(stock.symbol));
				// if (stock.price != '0.00') {
				// 	connnection.models.TradeQuote
				// 		.findOneAndUpdate({
				// 				'symbol': stock.symbol,
				// 				'date': stock.date,
				// 				'time': stock.time,
				// 			}, {
				// 				$set: stock
				// 			}, {
				// 				upsert: true
				// 			},
				// 			function(err, doc) {
				// 				if (err) return logger.error(err);
				// 			}
				// 		);
				// }
			});
			trading.on('bid', function(trade) {
				trade = trade || {};
				var stock = trade.stock;
				var transaction = trade.transaction;
				transaction.symbol = stock.symbol;
				logger.info('bid transaction: ' + JSON.stringify(transaction));
				connnection.models.TradePortfolio.findOneAndUpdate({
						'symbol': stock.symbol
					}, {
						$set: {
							bid: {
								direction: transaction.direction,
								price: transaction.price,
							}
						}
					}, {
						upsert: false,
					},
					function(err, result) {
						if (err) return logger.error(err);
					});

			});
			trading.on('sell', function(trade) {
				trade = trade || {};
				var stock = trade.stock;
				var strategy = trade.strategy;
				var transaction = trade.transaction;
				transaction.symbol = stock.symbol;
				var debt = transaction.price * transaction.quantity;
				logger.info('sell transaction: ' + JSON.stringify(transaction));
				async.waterfall(
					[
						function pushTransaction(callback) {
							//** 当前交易
							var currentTransaction = {
								price: transaction.price,
								quantity: transaction.quantity,
								direction: transaction.direction,
								date: stock.date,
								time: stock.time,
							};
							connnection.models.TradePortfolio
								.findOneAndUpdate({
										'symbol': stock.symbol
									}, {
										$set: {
											lastTransaction: currentTransaction,//** 设置最后一次交易
											bid: {
												direction: '待定',
												price: transaction.price
											}
										},
										$push: {
											transactions: currentTransaction
										},
										$inc: {
											'times.sell': 1, //** 增加交易次数
											'debt': debt, //** 减少债务(趋向正数方向)
											'quantity': -transaction.quantity, //** 减少持有数量
										}
									}, {
										upsert: false,
									},
									function(err, result) {
										if (err) return callback(err);
										callback(null);
									}
								);
						},
						function saveTransaction(callback) {
							var newTrade = {
								account: strategy.account,
								symbol: stock.symbol,
								name: strategy.name,
								nickname: strategy.nickname,
								price: transaction.price,
								quantity: transaction.quantity,
								direction: transaction.direction,
								status: '未成交',
								tax: 0,
								date: stock.date,
								time: stock.time,
							};
							connnection.models.TradeTransaction.create(newTrade, function(err, doc) {
								if (err) return callback(err);
								callback(null);
							});
						},
					],
					function(err, result) {
						if (err) return logger.error(err);
					}
				);
			});
			trading.on('buy', function(trade) {
				trade = trade || {};
				var stock = trade.stock;
				var strategy = trade.strategy;
				var transaction = trade.transaction;
				var debt = transaction.price * transaction.quantity;
				transaction.symbol = stock.symbol;
				logger.info('buy transaction: ' + JSON.stringify(transaction));

				async.waterfall(
					[
						function pushTransaction(callback) {
							//** 当前交易
							var currentTransaction = {
								price: transaction.price,
								quantity: transaction.quantity,
								direction: transaction.direction,
								date: stock.date,
								time: stock.time,
							};
							connnection.models.TradePortfolio
								.findOneAndUpdate({
										'symbol': stock.symbol
									}, {
										$set: {
											lastTransaction: currentTransaction,
											bid: {
												direction: '待定',
												price: transaction.price
											}
										},
										$push: {
											'transactions': currentTransaction
										},
										$inc: {
											'times.buy': 1, //** 增加交易次数
											'debt': -debt, //** 增加债务(趋向负数方向)
											'quantity': transaction.quantity, //** 增加持有数量
										}
									}, {
										upsert: false,
									},
									function(err, result) {
										if (err) return callback(err);
										callback(null);
									}
								);
						},
						function saveTransaction(callback) {
							var newTrade = {
								account: strategy.account,
								symbol: stock.symbol,
								name: strategy.name,
								nickname: strategy.nickname,
								price: transaction.price,
								quantity: transaction.quantity,
								direction: transaction.direction,
								status: '未成交',
								tax: 0,
								date: stock.date,
								time: stock.time,
							};
							connnection.models.TradeTransaction.create(newTrade, function(err, doc) {
								if (err) return callback(err);
								callback(null);
							});
						},
					],
					function(err, result) {
						if (err) return logger.error(err);
					}
				);

			});
			trading.run(strategies, function(err, result) {
				if (err) return done(err);
				done();
			});
		});
};

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('TradePortfolio',schema);
};
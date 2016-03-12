var log4js = require('log4js');
var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var path = require('path');
var cst = require('./config/constant');
var Trading = require('./libs/trading').stock;
var citic = require('./libs/citic');

log4js.configure(path.join(__dirname, 'config', 'log4js.json'));
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

var status = {
	platform: false,
	trade: false,
};

var intervalObject;

var mongoose = require('mongoose');
var config = {
	mail: require('./config/mail'),
	db: require('./config/db')
};


//import the models
var models = {};
fs.readdirSync(path.join(__dirname, 'models')).forEach(function(file) {
	if (/\.js$/.test(file)) {
		var modelName = file.substr(0, file.length - 3);
		models[modelName] = require('./models/' + modelName)(mongoose);
	}
});

var quote = function(stock) {
	// logger.debug('quote: ' + JSON.stringify(stock.symbol));
	if (stock.price != '0.00') {
		models.TradeQuote
			.findOneAndUpdate({
					'symbol': stock.symbol,
					'date': stock.date,
					'time': stock.time,
				}, {
					$set: stock
				}, {
					upsert: true
				},
				function(err, doc) {
					if (err) return logger.error(err);
				}
			);
	}
};

var bid = function(trade) {
	trade = trade || {};
	var stock = trade.stock;
	var transaction = trade.transaction;
	transaction.symbol = stock.symbol;
	logger.info('bid transaction: ' + JSON.stringify(transaction));
	models.TradePortfolio.findOneAndUpdate({
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

};

var buy = function(trade) {
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
				models.TradePortfolio
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
								'times': 1, //** 增加交易次数
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
				models.TradeTransaction.create(newTrade, function(err, doc) {
					if (err) return callback(err);
					callback(null);
				});
			},
		],
		function(err, result) {
			if (err) return logger.error(err);
		}
	);

};

var sell = function(trade) {
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
				models.TradePortfolio
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
								'times': 1, //** 增加交易次数
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
				models.TradeTransaction.create(newTrade, function(err, doc) {
					if (err) return callback(err);
					callback(null);
				});
			},
		],
		function(err, result) {
			if (err) return logger.error(err);
		}
	);
};

var getStatus = function() {
	logger.info('collect status.');
	process.send && process.send(status);
};

var start = function() {
	if (status.platform) return;
	logger.info('worker start.');
	mongoose.connect(config.db.URI, function onMongooseError(err) {
		if (err) {
			logger.error('Error: can not open Mongodb.');
			throw err;
		}
	});
	var lastTimestamp = Date.now();
	var interval = 5000;
	intervalObject = setInterval(function() {
		logger.debug('执行交易间隔 interval: ' + interval);
		models.TradePortfolio
			.find({
				'status': '实战'
			})
			.exec(function(err, strategies) {
				if (err) return logger.error(err);
				if (_.isEmpty(strategies)) return logger.debug('没有可执行的。');
				trading = new Trading();
				trading.on('quote', quote);
				trading.on('bid', bid);
				trading.on('sell', sell);
				trading.on('buy', buy);
				trading.run(strategies, function(err, result) {
					if (err) return logger.error(err);
					var now = Date.now();
					interval = now - lastTimestamp;
					if (interval < 1) {
						interval = 1;
						logger.warn('执行时间太长，应调节间隔');
					}
					lastTimestamp = now;
				});
			});
	}, interval);
	status.platform = true;
	process.send && process.send(status);
};

var stop = function() {
	if (!status.platform) return;
	logger.info('worker stop.');
	intervalObject && clearInterval(intervalObject);
	mongoose.disconnect();
	status.platform = false;
	process.send && process.send(status);
};

var startTrade = function() {
	if (status.trade) return;
	logger.info('trade start.');
	status.trade = true;
	process.send && process.send(status);
};

var stopTrade = function() {
	if (!status.trade) return;
	logger.info('trade stop.');
	status.trade = false;
	process.send && process.send(status);
};

var keepAlive = function() {
	return setInterval(function() {
		process.send({});
	}, 5000);
};

var captcha = function(options) {
	logger.info(options);
};
/**
 * client process
 * @param  {[type]} msg) {	msg        message Object
 * @return {[type]}      [description]
 */

process.on('SIGTERM', function() {
	logger.info('Worker Got a SIGTERM, exiting...');
	process.exit(1);
});

process.on('message', function(msg) {
	msg = msg || {};
	var command = msg.command || '';
	switch (command) {
		case 'status':
			getStatus();
			break;
		case 'start':
			// keepAlive();
			start();
			break;
		case 'stop':
			stop();
			break;
		case 'startTrade':
			startTrade();
			break;
		case 'stopTrade':
			stopTrade();
			break;
		case 'captcha':
			captcha(msg);
			break;
		default:
			break;
	}
});

process.on('exit', function() {
	//ONLY accept synchronous operations
	logger.info('exit');
});

process.on('error', function(err) {
	logger.error('error.');
	process.exit(1);
});

//dev
if (process.argv.length == 3) {
	start();
	setTimeout(function() {
		stop();
	}, 10000);
}
var log4js = require('log4js');
var path = require('path');
var _ = require('underscore');
log4js.configure(path.join(__dirname,'../../..','log4js.json'));
var logger = log4js.getLogger('trading');
logger.setLevel('INFO');

var T0 = function(options) {
	this.options = options || {};
	_.extend(this, T0);
	return this;
};

var isTradingTime = function(time) {
	var hhmmss = time.split(':');
	var morningBeginTime = 9 * 60 * 60 + 30 * 60; //9:30:00
	var morningEndTime = 11 * 60 * 60 + 30 * 60; //11:30:00
	var afternoonBeginTime = 13 * 60 * 60; //13:00:00
	var afternonnEndTime = 15 * 60 * 60; //15:00:00
	var seconds = (parseInt(hhmmss[0]) * 3600 + parseInt(hhmmss[1]) * 60 + parseInt(hhmmss[2]));
	if ((seconds > morningBeginTime && seconds < morningEndTime) ||
		(seconds > afternoonBeginTime && seconds < afternonnEndTime)) {
		return true;
	}
	return false;
};

T0.judge = function(stock, strategy, callback) {
	try {
		var price, top, bottom, quantity, direction;
		stock = stock || {};
		strategy = strategy || {};
		var price = Number(stock.price);
		var symbol = strategy.symbol;
		var bid = strategy.bid || {};
		var bid_direction = bid.direction || '待定';
		var bid_price = bid.price || price;
		var params = strategy.params;
		var buy_drawdown = params.buy_drawdown || 1;//buy回撤率
		var sell_drawdown = params.sell_drawdown || 1;//sell回撤率
		var depth = params.depth || 0;
		var transactions = strategy.transactions || [];
		var transaction = _.last(transactions);
		if (_.isEmpty(transaction)) {
			top = Number((params.init_p * (1 + 0.01 * params.sell_gt)).toFixed(2));
			bottom = Number((params.init_p * (1 - 0.01 * params.buy_lt)).toFixed(2));
			quantity = Number(params.quantity);
		} else {
			logger.debug(symbol + ' last transaction: ' + JSON.stringify(transaction));
			top = Number((transaction.price * (1 + 0.01 * params.sell_gt)).toFixed(2));
			bottom = Number((transaction.price * (1 - 0.01 * params.buy_lt)).toFixed(2));
			direction = transaction.direction;
			quantity = Number(transaction.quantity);
		}
		logger.info(stock.date + ' ' + stock.time + ' ' + symbol + '(' + stock.price + ') ' + '[' + bottom + ' - ' + top + ']');
		// is not trading time, do nothing
		if (!isTradingTime(stock.time)) return callback(null);
		// is times more than times_max, do nothing
		if(strategy.times > params.times_max) return callback(null);
		if(bid_direction == '待定'){
			if(price <= bottom){
				//price is lower than bottom, think to buy
				return callback(null, {
					action: 'bid',
					price: price,
					direction: '买入',
				});
			}else if(price >= top){
				//price is greater than top, think to sell
				return callback(null, {
					action: 'bid',
					price: price,
					direction: '卖出',
				});
			}else{
				// price is between bottom and top, do nothing
				return callback(null);
			}
		}else if(bid_direction == '买入'){
			if(price < bid_price){
				//price is lower than bid_price, think to buy
				return callback(null, {
					action: 'bid',
					price: price,
					direction: '买入',
				});				
			}else if (price >= bid_price * (1 + 0.01*buy_drawdown)) {
				//transaction is less than depth, do buy transaction
				if (_.isEmpty(transactions)) {
					return callback(null, {
						action: 'buy',
						price: price,
						quantity: quantity,
						direction: '买入',
					});
				} else {
					var directions = _.pluck(transactions, 'direction');
					var countBuy = _.without(directions, '卖出');
					var countSell = _.without(directions, '买入');
					logger.info(symbol + '[buy,sell] count:' + countBuy.length + ',' + countSell.length);
					//is count of buy direction less than depth ? if yes, buy now
					if ((countBuy.length - countSell.length) < depth) {
						// //is not same direction depth too many?
						return callback(null, {
							action: 'buy',
							price: price,
							quantity: quantity,
							direction: '买入',
						});
					} else {
						return callback(null);
					}
				}
			}else{
				// price is between bid_price and buy_drawdown, do nothing
				return callback(null);
			}
		}else if(bid_direction == '卖出'){
			if(price > bid_price){
				//price is greater than bid_price, think to sell
				return callback(null, {
					action: 'bid',
					price: price,
					direction: '卖出',
				});				
			}else if (price <= bid_price * (1-0.01*sell_drawdown)) {
				//price is higher than top, think to sell
				if (_.isEmpty(transactions)) {
					//transaction is less than depth, do sell transaction
					return callback(null, {
						action: 'sell',
						price: price,
						quantity: quantity,
						direction: '卖出',
					});
				} else {
					var directions = _.pluck(transactions, 'direction');
					var countBuy = _.without(directions, '卖出');
					var countSell = _.without(directions, '买入');
					logger.info(symbol + '[buy,sell] count:' + countBuy.length + ',' + countSell.length);
					//is count of sell direction less than depth ? if yes, sell now
					if ((countSell.length - countBuy.length) < depth) {
						// is not same direction depth too many?
						return callback(null, {
							action: 'sell',
							price: price,
							quantity: quantity,
							direction: '卖出',
						});
					} else {
						return callback(null);
					}
				}
			}else{
				// price is between sell_drawdown and bid_price, do nothing
				return callback(null);
			}
		}else{
			return callback(null);
		}
	} catch (err) {
		return callback(err);
	}
};

exports = module.exports = T0;
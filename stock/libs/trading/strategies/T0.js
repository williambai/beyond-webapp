var _ = require('underscore');

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
		var top, bottom, direction, quantity;
		stock = stock || {};
		strategy = strategy || {};
		var symbol = strategy.symbol;
		var params = strategy.params;
		var depth = params.depth || 0;
		var transactions = strategy.transactions || [];
		var transaction = _.last(transactions);
		if (_.isEmpty(transaction)) {
			top = (params.init_p * (1 + 0.01 * params.sell_gt)).toFixed(2);
			bottom = (params.init_p * (1 - 0.01 * params.buy_lt)).toFixed(2);
		} else {
			top = (transaction.price * (1 + 0.01 * params.sell_gt)).toFixed(2);
			bottom = (transaction.price * (1 - 0.01 * params.buy_lt)).toFixed(2);
			direction = transaction.direction;
			quantity = transaction.quantity;
		}
		console.log(stock.date + ' ' + stock.time + ' ' + symbol + '(' + stock.price + ') ' + '[' + bottom + ' - ' + top + ']');
		// is not trading time, do nothing
		if (!isTradingTime(stock.time)) return callback(null);
		// is times more than times_max, do nothing
		if(strategy.times > params.times_max) return callback(null);
		// price is between bottom and top, do nothing
		if (stock.price > bottom && stock.price < top) return callback(null);
		//price is lower than bottom, think to buy
		if (stock.price <= bottom) {
			//transaction is less than depth, do buy transaction
			if (transactions.length < depth) {
				return callback(null, {
					action: 'buy',
					price: stock.price,
					quantity: params.quantity,
					direction: '买入',
				});
			} else {
				var directions = _.pluck(transactions, 'direction');
				var countBuy = _.without(directions, '卖出');
				var countSell = _.without(directions, '买入');
				//is count of buy direction less than depth ? if yes, buy now
				if ((countBuy.length - countSell.length) < depth) {
					// //is not continuous same direction?
					// var last3Transactions = _.last(transactions, depth);
					// var last3Dirctions = _.uniq(_.pluck(last3Transactions, 'direction'));
					// if (last3Dirctions.length > 1) {
					return callback(null, {
						action: 'buy',
						price: stock.price,
						quantity: params.quantity,
						direction: '买入',
					});
				} else {
					return callback(null);
				}
			}

		}
		//price is higher than top, think to sell
		if (stock.price >= top) {
			//transaction is less than depth, do sell transaction
			if (transactions.length < depth) {
				return callback(null, {
					action: 'sell',
					price: stock.price,
					quantity: params.quantity,
					direction: '卖出',
				});
			} else {
				var directions = _.pluck(transactions, 'direction');
				var countBuy = _.without(directions, '卖出');
				var countSell = _.without(directions, '买入');
				//is count of sell direction less than depth ? if yes, sell now
				if ((countSell.length - countBuy.length) < depth) {
					// //is not continuous same direction?
					// var last3Transactions = _.last(transactions, depth);
					// var last3Dirctions = _.uniq(_.pluck(last3Transactions, 'direction'));
					// if (last3Dirctions.length > 1) {
					return callback(null, {
						action: 'sell',
						price: stock.price,
						quantity: params.quantity,
						direction: '卖出',
					});
				} else {
					return callback(null);
				}
			}
		}
		return callback(null);
	} catch (err) {
		return callback(err);
	}
};

exports = module.exports = T0;
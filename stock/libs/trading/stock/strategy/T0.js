var path = require('path');
var _ = require('underscore');
var logger = require('log4js').getLogger(path.relative(process.cwd(),__filename));

var isTradingTime = function(time) {
	var hhmmss = time.split(':');
	var morningBeginTime = 9 * 60 * 60 + 30 * 60; //9:30:00
	var morningEndTime = 11 * 60 * 60 + 30 * 60; //11:30:00
	var afternoonBeginTime = 13 * 60 * 60; //13:00:00
	var afternonnEndTime = 15 * 60 * 60; //15:00:00
	var seconds = (parseInt(hhmmss[0]) * 3600 + parseInt(hhmmss[1]) * 60 + parseInt(hhmmss[2]));
	//is trading time?
	if ((seconds > morningBeginTime && seconds < morningEndTime) ||
		(seconds > afternoonBeginTime && seconds < afternonnEndTime)) {
		return true;
	}
	return false;
};

var judge = function(stock, strategy, callback) {
	try {
		stock = stock || {};
		strategy = strategy || {};
		var stockPrice = Number(stock.price);
		var symbol = strategy.symbol;
		var bid = strategy.bid || {};
		var bid_direction = bid.direction || '待定';
		var bid_price = bid.price || stockPrice;
		var params = strategy.params;
		//** 设置buy回撤率
		var buy_drawdown = params.buy_drawdown || 0;
		//** 设置sell回撤率
		var sell_drawdown = params.sell_drawdown || 0;
		var depth = params.depth || 0;
		//** 最后一次交易价格
		var lastTransactionPrice;
		//** 计划交易价格上限
		var top;
		//** 计划交易价格下限
		var bottom;
		//** 计划交易量
		var quantity;
		//** 取出最后一次交易
		var lastTransaction = strategy.lastTransaction || {};
		if (!lastTransaction.price) {
			//** 设置计划交易价格
			lastTransactionPrice = Number(params.init_p);
			//** 设置计划交易量
			quantity = Number(params.quantity);
		} else {
			//** 设置计划交易价格
			lastTransactionPrice = Number(lastTransaction.price);
			//** 设置计划交易量
			quantity = Number(lastTransaction.quantity);
		}
		//** 设置交易上限
		top = Number((lastTransactionPrice * (1 + 0.01 * params.sell_gt)).toFixed(2));
		//** 设置交易下限
		bottom = Number((lastTransactionPrice * (1 - 0.01 * params.buy_lt)).toFixed(2));
		//** 设置买入次数
		var countBuy = strategy.times.buy || 0;
		//** 设置卖出次数
		var countSell = strategy.times.sell || 0;
		logger.info(stock.date + ' ' + stock.time + ' ' + symbol + '(' + stockPrice + ') ' + '[' + countBuy + ',' + countSell +'][' + bottom + ' - ' +  lastTransactionPrice + ' - ' + top + ']');
		// is not trading time, do nothing
		if (!isTradingTime(stock.time)) return callback(null);
		// is times more than times_max, do nothing
		if(Math.abs(countBuy + countSell) > params.times_max) return callback(null);
		if(bid_direction == '待定'){
			if(stockPrice <= bottom){
				//** 出价低于设定最低买入价时，考虑执行买入出价指令
				if (Math.abs(countBuy - countSell) < depth) {
					//** 买入与卖出深度差小于设定买入深度时，方可执行买入出价指令
					return callback(null, {
						action: 'bid',
						price: stockPrice,
						direction: '买入',
					});
				} else {
					return callback(null);
				}
			}else if(stockPrice >= top){
				//** 出价高于最高设定卖出价时，考虑执行卖出出价指令
				if (Math.abs(countSell - countBuy) < depth) {
					//** 卖出与买入深度差小于设定卖出深度时，方可执行卖出出价指令
					return callback(null, {
						action: 'bid',
						price: stockPrice,
						direction: '卖出',
					});
				} else {
					return callback(null);
				}
			}else{
				//** 当前价格在最低和最后指定区间是，不执行任何操作
				return callback(null);
			}
		}else if(bid_direction == '买入'){
			if(stockPrice < bid_price){
				//** 价格低于“最低出价”时，执行更新最新出价指令
				return callback(null, {
					action: 'bid',
					price: stockPrice,
					direction: '买入',
				});				
			}else if(stockPrice >= bid_price && stockPrice < bid_price * (1 + 0.01*buy_drawdown)){
				//** 价格高于"最低出价"，且低于“最低出价的买入回撤率”时，放空
				return callback(null);
			}else if (stockPrice >= bid_price * (1 + 0.01*buy_drawdown) && stockPrice < lastTransactionPrice) {
				//** 价格高出“最低出价指定的回撤率”，并且小于“最后一次交易价格”时，执行买入指令
				return callback(null, {
					action: 'buy',
					price: stockPrice,
					quantity: quantity,
					direction: '买入',
				});
			}else{
				//** 价格高出“最后一次交易价格”时，撤销本次买入指令，执行恢复出价指令
				return callback(null, {
					action: 'bid',
					price: stockPrice,
					direction: '待定',
				});
			}
		}else if(bid_direction == '卖出'){
			if(stockPrice > bid_price){
				//** 价格在比“最高出价”还高时，执行更新最新出价指令
				return callback(null, {
					action: 'bid',
					price: stockPrice,
					direction: '卖出',
				});				
			}else if(stockPrice > bid_price * (1-0.01*sell_drawdown) && stockPrice <= bid_price){
				//** 价格低于"最高出价"，且高于“最高出价的卖出回撤率”时，放空
				return callback(null);
			}else if (stockPrice > lastTransactionPrice && stockPrice <= bid_price * (1-0.01*sell_drawdown)) {
				//** 价格低于“最高出价指定的回撤率”，并且大于“最后一次交易价格”时，执行卖出指令
				return callback(null, {
					action: 'sell',
					price: stockPrice,
					quantity: quantity,
					direction: '卖出',
				});
			}else{
				//** 价格低于“最后一次交易价格”时，撤销本次卖出指令，执行恢复出价指令
				return callback(null, {
					action: 'bid',
					price: stockPrice,
					direction: '待定',
				});
			}
		}else{
			return callback(null);
		}
	} catch (err) {
		return callback(err);
	}
};

exports = module.exports = judge;
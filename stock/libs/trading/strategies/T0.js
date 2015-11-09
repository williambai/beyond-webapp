var _ = require('underscore');
var quote = require('../robot/quote')();

var t0 = null;

var T0 = function(options){
	this.options = options || {};
};

T0.prototype.start = function(){
	var that = this;
	this.intervalObject = setInterval(function(){
		var symbols = _.keys(that.options);
		quote.getQuote(symbols[0], function(err,stock){
			if(err) return console.log(err);
			that.judge(stock);
		});
	},5000);
};

T0.prototype.stop = function(){
	clearInterval(this.intervalObject);
};

T0.prototype.buy = function(symbol,price, amount){
	var that = this;
	console.log(symbol + ' buy: ' + price);
	that.options[symbol].bid_p = price;
	that.options[symbol].bid_v = amount;
};

T0.prototype.sell = function(symbol,price,amount){
	var that = this;
	console.log(symbol + ' sell: ' + price);
	that.options[symbol].bid_p = price;
	that.options[symbol].bid_v = amount;
};


T0.prototype.judge = function(stock){
	var that = this;
	var config = this.options[stock.symbol];
	var top = (config.bid_p * (1 + 0.01 * config.sell_at)).toFixed(2);
	var bottom = (config.bid_p * (1 - 0.01 * config.buy_at)).toFixed(2);
	console.log(stock.symbol + '[' + bottom + ' - ' + top + ']');
	if(stock.price < bottom){
		that.buy(stock.symbol,stock.price,config.amount);
	}else if(stock.price > top){
		that.sell(stock.symbol,stock.price,config.amount);
	}else{
		console.log(stock.symbol + '['+stock.date + ' ' + stock.time + '] ' + config.bid_p + ' ' + stock.price);
	}
};

exports = module.exports = function(options){
	if(!t0)
		t0 = new T0(options);
	return t0;
};
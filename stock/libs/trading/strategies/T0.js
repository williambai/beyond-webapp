var _ = require('underscore');

var t0 = null;

var T0 = function(options){
	this.options = options || {};
};

T0.prototype.judge = function(stock,strategy){
	var that = t0;
	var symbol = strategy.symbol;
	var params = strategy.params;
	var top = (params.init_p * (1 + 0.01 * params.sell_gt)).toFixed(2);
	var bottom = (params.init_p * (1 - 0.01 * params.buy_lt)).toFixed(2);
	console.log(stock.date + ' ' + stock.time + ' ' + symbol+ '('+ stock.price +') ' + '[' + bottom + ' - ' + top + ']');
	if(stock.price < bottom){
		return -1;
	}else if(stock.price > top){
		return 1;
	}else{
		return 0;
	}
};

exports = module.exports = function(options){
	if(!t0)
		t0 = new T0(options);
	return t0;
};
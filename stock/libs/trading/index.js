var request = require('request');
var _ = require('underscore');
var robot = require('./robot/robot')();
var quote = require('./robot/quote')();

var trading = null;
var Trading = function(options){

};

Trading.prototype.getQuote = function(symbol,callback){
	quote.getQuote(symbol,callback);
};

Trading.prototype.buy = function(symbol,price,amount,done){
	done();
	robot.buy(symbol,price,amount);
};

Trading.prototype.sell = function(symbol,price,amount,done){
	done();
	robot.sell(symbol,price,amount);
};

Trading.prototype.verify = function(pic,done){
	robot.verify(pic,done);
};

Trading.prototype.confirm = function(done){
	done();
	robot.confirm();
};

exports = module.exports = function(options){
	if(!trading)
		trading = new Trading(options);
	return trading;
};
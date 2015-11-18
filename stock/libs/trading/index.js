var request = require('request');
var util = require('util');
var EventEmitter = require('events');
var _ = require('underscore');
var async = require('async');

var quote = require('./robot/quote');
var T0 = require('./strategies/T0');

var Trading = function(options) {
	this.options = options || {};
	_.extend(this, Trading);
	return this;
};

util.inherits(Trading, EventEmitter);
_.extend(Trading, EventEmitter.prototype);

var executeStrategy = function(strategy, done) {
	var symbol = strategy.symbol;
	quote.getQuote(symbol, function(err, stock) {
		if(err) return done(err);
		Trading.emit('quote', stock);
		var judged = 0;
		if (strategy.params.name == 'T0') {
			judged = T0.judge(stock, strategy);
		}
		if (judged == -1) { //buy
			Trading.emit('buy', {
				stock: strategy.stock.code,
				price: stock.price,
				quantity: strategy.params.amount,
			});
		} else if (judged == 1) { //sell
			Trading.emit('sell', {
				stock: strategy.stock.code,
				price: stock.price,
				quantity: strategy.params.amount,
			});
		}
		done(null);
	});

};

Trading.run = function(strategies, done) {
	async.eachSeries(strategies, executeStrategy, done);
};

exports = module.exports = Trading;
var request = require('request');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var async = require('async');

var quote = require('./quote');
var T0 = require('./strategy/T0');

var StockTrading = function(options) {
	this.options = options || {};
	EventEmitter.call(this);
};
util.inherits(StockTrading, EventEmitter);

StockTrading.prototype.executeStrategy = function(stocks) {
	var that = this;
	return function(strategy, done) {
		var symbol = strategy.symbol;
		that.emit('quote', stocks[symbol]);
		T0(stocks[symbol], strategy, function(err, data) {
			if (err || !data) return done(null);
			if(data.action == 'bid') {
				that.emit('bid', {
					stock: stocks[symbol],
					strategy: strategy,
					transaction: data,
				});
			}else if (data.action == 'buy') {
				that.emit('buy', {
					stock: stocks[symbol],
					strategy: strategy,
					transaction: data,
				});
			} else if (data.action == 'sell') {
				that.emit('sell', {
					stock: stocks[symbol],
					strategy: strategy,
					transaction: data,
				});
			}
			done(null);
		});
	};
};

StockTrading.prototype.run = function(strategies, done) {
	var that = this;
	//** 不在报价时间段，返回
	if (!quote.isQuoteTime()) return;
	var symbols = _.pluck(strategies, 'symbol');
	quote.getQuotes(symbols, function(err, stocks) {
		if (err) return done(err);
		console.log('----  '+ (new Date()).toLocaleString() +'  ----');
		async.eachSeries(strategies, that.executeStrategy(stocks), done);
	}, done);
};

exports = module.exports = StockTrading;
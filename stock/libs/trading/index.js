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
		if (err) return done(err);
		Trading.emit('quote', stock);
		T0.judge(stock, strategy, function(err, data) {
			if (err || !data) return done(null);
			if (data.action == 'buy') {
				Trading.emit('buy', {
					stock: stock,
					strategy: strategy,
					transaction: data,
				});
			} else if (data.action == 'sell') {
				Trading.emit('sell', {
					stock: stock,
					strategy: strategy,
					transaction: data,
				});
			}
			done(null);
		});
	});

};

Trading.run = function(strategies, done) {
	async.eachSeries(strategies, executeStrategy, done);
};

exports = module.exports = Trading;
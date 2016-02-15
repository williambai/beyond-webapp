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

var isTradingTime = function() {
	var now = new Date();
	var day = now.getDay();
	var hh = now.getHours();
	var mm = now.getMinutes();
	var ss = now.getSeconds();
	var morningBeginTime = 9 * 60 * 60 + 25 * 60; //9:25:00
	var morningEndTime = 11 * 60 * 60 + 35 * 60; //11:35:00
	var afternoonBeginTime = 13 * 60 * 60 - 5*60; //12:55:00
	var afternonnEndTime = 15 * 60 * 60 + 5 * 60; //15:05:00
	var seconds = (parseInt(hh) * 3600 + parseInt(mm) * 60 + parseInt(ss));
	//is working day?
	if (day > 0 && day < 6) {
		//is trading time?
		if ((seconds > morningBeginTime && seconds < morningEndTime) ||
			(seconds > afternoonBeginTime && seconds < afternonnEndTime)) {
			return true;
		}
		// if ((seconds > morningBeginTime && seconds < afternonnEndTime)) {
		// 	return true;
		// }
	}
	return false;
};

util.inherits(Trading, EventEmitter);
_.extend(Trading, EventEmitter.prototype);

var executeStrategy = function(stocks) {
	return function(strategy, done) {
		var symbol = strategy.symbol;
		Trading.emit('quote', stocks[symbol]);
		T0.judge(stocks[symbol], strategy, function(err, data) {
			if (err || !data) return done(null);
			if(data.action == 'bid') {
				Trading.emit('bid', {
					stock: stocks[symbol],
					strategy: strategy,
					transaction: data,
				});
			}else if (data.action == 'buy') {
				Trading.emit('buy', {
					stock: stocks[symbol],
					strategy: strategy,
					transaction: data,
				});
			} else if (data.action == 'sell') {
				Trading.emit('sell', {
					stock: stocks[symbol],
					strategy: strategy,
					transaction: data,
				});
			}
			done(null);
		});
	};
};


Trading.run = function(strategies, done) {
	if (!isTradingTime()) return;
	var symbols = _.pluck(strategies, 'symbol');
	quote.getQuotes(symbols, function(err, stocks) {
		if (err) return done(err);
		async.eachSeries(strategies, executeStrategy(stocks), done);
	}, done);
};

/**
 * @deprecated [description]
 */
Trading.run1 = function(strategies, done) {
	if (!isTradingTime()) return;

	var symbols = _.pluck(strategies, 'symbol');
	quote.getQuotes(symbols, function(err, stocks) {
		if (err) return done(err);
		// console.log(stocks);
		async.eachSeries(strategies, function(strategy, callback) {
			if (err) return callback(err);
			var symbol = strategy.symbol;
			Trading.emit('quote', stocks[symbol]);
			T0.judge(stocks[symbol], strategy, function(err, data) {
				if (err || !data) return callback(null);
				if (data.action == 'buy') {
					Trading.emit('buy', {
						stock: stocks[symbol],
						strategy: strategy,
						transaction: data,
					});
				} else if (data.action == 'sell') {
					Trading.emit('sell', {
						stock: stocks[symbol],
						strategy: strategy,
						transaction: data,
					});
				}
				callback(null);
			});
		}, done);
	});
};

exports = module.exports = Trading;
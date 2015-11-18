var request = require('request');
var util = require('util');
var EventEmitter = require('events');
var _ = require('underscore');
var async = require('async');
var robot = require('./robot/robot');
var quote = require('./robot/quote');
var T0 = require('./strategies/T0');

var Trading = function(options) {
	this.options = options || {};
	this.models = this.options.models || {};
	_.extend(this, Trading);
	return this;
};

util.inherits(Trading, EventEmitter);
_.extend(Trading, EventEmitter.prototype);

var models = {};

Trading.setModels = function(mods) {
	models = mods;
};

var getQuote = function(symbol, callback) {
	quote.getQuote(symbol, callback);
};

var buy = function(symbol, price, amount, done) {
	// robot.buy(symbol, price, amount,done);
	console.log('buy: ');
	done(null, {});
};

var sell = function(symbol, price, amount, done) {
	// robot.sell(symbol, price, amount,done);
	console.log('Sell: ')
	done(null, {});
};

var verify = function(data, done) {
	// robot.verify(data, done);
	done(null, {});
};

var confirm = function(strategy, done) {
	// robot.confirm(strategy,done);
	done(null, {});
};

var executeStrategy = function(strategy, done) {
	var symbol = strategy.symbol;
	getQuote(symbol, function(err, stock) {
		async.waterfall(
			[
				function saveQuote(callback) {
					// models.StockQuote
					// 	.findOneAndUpdate({
					// 			'symbol': stock.symbol,
					// 			'date': stock.date,
					// 			'time': stock.time,
					// 		}, {
					// 			$set: stock
					// 		}, {
					// 			upsert: true
					// 		},
					// 		callback
					// 	);
					models.StockQuote.findOne({
						'symbol': stock.symbol,
						'date': stock.date,
						'time': stock.time,
					}, function(err, doc) {
						if (err) return callback(err);
						if (doc) return callback({
							code: 40100,
							errmsg: 'quote existed.'
						});
						models.StockQuote.create(stock,callback);
					});
				},
				function decide(doc, callback) {
					var judged = T0.judge(stock, strategy);
					if (judged == -1) { //buy
						buy(symbol, stock.price, strategy.init.amount, callback);
					} else if (judged == 1) { //sell
						sell(symbol, stock.price, strategy.init.amount, callback);
					} else { //do nothing
						callback(null, {});
					}
				},
				function verify(data, callback) {
					// Trding.verify(data, callback);
					callback(null, true);
				},
				// function confirm(ok, callback) {
				// 	if (ok) {
				// 		Trding.confirm(strategy,function() {
				// 			callback(null, true);
				// 		});
				// 	} else {
				// 		callback(null, false);
				// 	}
				// },
				function save(confirm, callback) {
					if (confirm) {
						callback(null, true);
					} else {
						callback(null, false);
					}
				}
			],
			function(err, result) {
				if (err) return console.log(err);
				done(null, result);
			}
		);

	});

};

Trading.run = function(done) {
	async.waterfall([
			function(callback) {
				models.Strategy
					.find({
						'status.code': 1
					})
					.exec(function(err, docs) {
						if (err) return callback(err);
						if (!docs) return callback({
							code: 40400,
							errmsg: '没有可执行的。'
						});
						callback(null, docs);
					});
			},
			function(strategies, callback) {
				async.eachSeries(strategies, executeStrategy, callback);
			}
		],
		function(err, result) {
			if (err) return done(err);
			return done(null, result);
		}
	);
};

exports = module.exports = Trading;
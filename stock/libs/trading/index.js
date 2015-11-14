var request = require('request');
var _ = require('underscore');
var async = require('async');
var robot = require('./robot/robot')();
var quote = require('./robot/quote')();
var T0 = require('./strategies/T0')();

var trading = null;
var Trading = function(options) {
	options = options || {};
	this.models = options.models || {};
};

Trading.prototype.setModels = function(models) {
	this.models = models;
};

Trading.prototype.getQuote = function(symbol, callback) {
	quote.getQuote(symbol, callback);
};

Trading.prototype.buy = function(symbol, price, amount, done) {
	robot.buy(symbol, price, amount,done);
};

Trading.prototype.sell = function(symbol, price, amount, done) {
	robot.sell(symbol, price, amount,done);
};

Trading.prototype.verify = function(data, done) {
	robot.verify(data, done);
};

Trading.prototype.confirm = function(strategy,done) {
	robot.confirm(strategy,done);
};

Trading.prototype.executeStrategy = function(strategy, done) {
	var that = trading;
	var symbol = strategy.symbol;
	that.getQuote(symbol, function(err, stock) {
		async.waterfall(
			[
				function decide(callback) {
					var judged = T0.judge(stock, strategy);
					if (judged == -1) { //buy
						that.buy(symbol, stock.price, strategy.init.amount, callback);
					} else if (judged == 1) { //sell
						that.sell(symbol, stock.price, strategy.init.amount, callback);
					} else { //do nothing
						callback(null,{});
					}
				},
				function verify(data, callback) {
					// that.verify(data, callback);
					callback(null, true);
				},
				// function confirm(ok, callback) {
				// 	if (ok) {
				// 		that.confirm(strategy,function() {
				// 			callback(null, true);
				// 		});
				// 	} else {
				// 		callback(null, false);
				// 	}
				// },
				function save(confirm, callback){
					if(confirm){
						callback(null,true);
					}else{
						callback(null,false);
					}
				}
			],
			function(err, result) {
				if (err) return console.log(err);
				done(null,result);
			}
		);

	});

};

Trading.prototype.run = function(done) {
	var that = this;
	async.waterfall([
			function(callback){
				that.models.Strategy
					.find({
						'status.code': 1
					})
					.exec(function(err,docs){
						if(err) return callback(err);
						if(!docs) return callback({code: 40400, errmsg: '没有可执行的。'});
						callback(null,docs);
					});
			},
			function(strategies, callback){
				async.eachSeries(strategies,that.executeStrategy,callback);
			}
		],
		function(err, result) {
			if (err) return done(err);
			return done(null, result);
		}
	);
};

exports = module.exports = function(options) {
	if (!trading)
		trading = new Trading(options);
	return trading;
};
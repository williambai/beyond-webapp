var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var path = require('path');
var cst = require('./config/constant');
var trading = require('./libs/trading');

var intervalObject;

var mongoose = require('mongoose');
var config = {
	mail: require('./config/mail'),
	db: require('./config/db')
};
//** import the models
var models = {
	StockQuote: require('./models/StockQuote')(mongoose),
	Trading: require('./models/Trading')(mongoose),
	Strategy: require('./models/Strategy')(mongoose),
};

trading.on('quote', function(stock) {
	console.log('quote: ');
	models.StockQuote
		.findOneAndUpdate({
				'symbol': stock.symbol,
				'date': stock.date,
				'time': stock.time,
			}, {
				$set: stock
			}, {
				upsert: true
			},
			function(err, doc) {
				if (err) return console.log(err);
			}
		);
});

trading.on('buy', function(trade) {
	console.log('buy: ');

	trade = trade || {};
	var stock = trade.stock;
	var transaction = trade.transaction;
	console.log('transaction: ' + JSON.stringify(transaction));

	async.waterfall(
		[
			function pushTransaction(callback) {
				models.Strategy
					.findOneAndUpdate({
							'symbol': stock.symbol
						}, {
							$push: {
								'transactions': {
									price: transaction.price,
									quantity: transaction.quantity,
									direction: transaction.direction
								}
							},
							$inc: {
								'times': 1
							}
						}, {
							upsert: false,
						},
						function(err, result) {
							if (err) return callback(err);
							callback(null);
						}
					);
			},
			function saveTrading(callback) {
				var newTrade = {
						symbol: stock.symbol,
						stock: stock.stock,
						price: transaction.price,
						quantity: transaction.quantity,
						direction: transaction.direction,
						status: {
							code: -1,
							message: '未成交',
						},
						tax: 0,
						date: stock.date,
						time: stock.time,
					};
				models.Trading.create(newTrade, function(err, doc) {
					if (err) return callback(err);
					callback(null);
				});
			},
		],
		function(err, result) {
			if (err) return console.log(err);
		}
	);

});

trading.on('sell', function(trade) {
	console.log('sell: ');

	trade = trade || {};
	var stock = trade.stock;
	var transaction = trade.transaction;
	console.log('transaction: ' + JSON.stringify(transaction));
	async.waterfall(
		[
			function pushTransaction(callback) {
				models.Strategy
					.findOneAndUpdate({
							'symbol': stock.symbol
						}, {
							$push: {
								transactions: {
									price: transaction.price,
									quantity: transaction.quantity,
									direction: transaction.direction
								}
							},
							$inc: {
								'times': 1
							}
						}, {
							upsert: false,
						},
						function(err, result) {
							if (err) return callback(err);
							callback(null);
						}
					);
			},
			function saveTrading(callback) {
				var newTrade = {
						symbol: stock.symbol,
						stock: stock.stock,
						price: transaction.price,
						quantity: transaction.quantity,
						direction: transaction.direction,
						status: {
							code: -1,
							message: '未成交',
						},
						tax: 0,
						date: stock.date,
						time: stock.time,
					};
				models.Trading.create(newTrade, function(err, doc) {
					if (err) return callback(err);
					callback(null);
				});
			},
		],
		function(err, result) {
			if (err) return console.log(err);
		}
	);
});

var start = function() {

	mongoose.connect(config.db.URI, function onMongooseError(err) {
		if (err) {
			console.error('Error: can not open Mongodb.');
			throw err;
		}
	});
	var lastTimestamp = Date.now();
	var interal = 5000;
	intervalObject = setInterval(function() {
		models.Strategy
			.find({
				'status.code': 1
			})
			.exec(function(err, strategies) {
				if (err) return console.log(err);
				if (!strategies) return console.log('没有可执行的。');
				trading.run(strategies, function(err, result) {
					if (err) console.log(err);
					// console.log(result);
					var now = Date.now();
					interal = now - lastTimestamp;
					if (interal < 1) {
						interal = 1;
						console.log('执行时间太长，应调节间隔');
					}
					lastTimestamp = now;
				});
			});
	}, interal);
	process.send && process.send({
		code: 200,
		status: 'Ok'
	});
};

var stop = function() {
	console.log('\nclient stop.\n');
	intervalObject && clearInterval(intervalObject);
	mongoose.disconnect();
	process.send && process.send({
		code: 200,
		status: 'Ok'
	});
};


var keepAlive = function() {
	return setInterval(function() {
		process.send({});
	}, 5000);
};

/**
 * client process
 * @param  {[type]} msg) {	msg        message Object
 * @return {[type]}      [description]
 */

process.on('SIGTERM', function() {
	console.log('Worker Got a SIGTERM, exiting...');
	process.exit(1);
});

process.on('message', function(msg) {
	msg = msg || {};
	var command = msg.command || '';
	switch (command) {
		case 'start':
			// keepAlive();
			start();
			break;
		case 'stop':
			stop();
			break;
		default:
			break;
	}
});

process.on('exit', function() {
	//ONLY accept synchronous operations
	console.log('exit');
});

process.on('error', function(err) {
	console.log('error.');
	process.exit(1);
});

//dev
if (process.argv.length == 3) {
	start();
	setTimeout(function() {
		stop();
	}, 10000);
}
/**
 * 手动强制处理交易订单
 */

if (process.argv[1] === __filename) {
	console.log('process buy trading start...');
	var _ = require('underscore');
	var mongoose = require('mongoose');

	var config = {
		server: require('../config/server'),
		mail: require('../config/mail'),
		db: require('../config/db')
	};

	mongoose.connect(config.db.URI, function onMongooseError(err) {
		if (err) {
			logger.error('Error: can not open Mongodb.');
			throw err;
		}
	});
	//** import the models
	var models = {
		TradeOrder: require('../models/TradeOrder')(mongoose),
	};

	models.TradeOrder.process(function(err) {
		if (err) return console.log(err);
		console.log('process CITIC TradeOrder successfully.');
		mongoose.disconnect();
	});
}
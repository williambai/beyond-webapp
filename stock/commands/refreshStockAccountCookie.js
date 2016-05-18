/**
 * 手动刷新TradeAccount的 Cookie
 * @param  {[type]} process.argv[1] [description]
 * @return {[type]}                 [description]
 */

if (process.argv[1] === __filename) {
	console.log('refresh cookie start...');
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
		TradeAccount: require('../models/TradeAccount')(mongoose),
	};

	models.TradeAccount.refreshCookie(function(err) {
		if (err) return console.log(err);
		console.log('refresh CITIC Accounts Cookie successfully.');
		mongoose.disconnect();
	});
}
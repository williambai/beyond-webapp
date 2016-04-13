//** send 'new' sms in database

if (process.argv[1] === __filename) {
	//** common packages
	var path = require('path');
	var fs = require('fs');
	var config = {
		db: require('../config/db'),
	};
	//** MongoDB packages
	var mongoose = require('mongoose');
	mongoose.connect(config.db.URI, function onMongooseError(err) {
		if (err) {
			logger.error('Error: can not open Mongodb.');
			throw err;
		}
	});
	//** import MongoDB's models
	var models = {};
	fs.readdirSync(path.join(__dirname, '../models')).forEach(function(file) {
		if (/\.js$/.test(file)) {
			var modelName = file.substr(0, file.length - 3);
			models[modelName] = require('../models/' + modelName)(mongoose);
		}
	});
	models.PlatformSms.sendSms(function(err, result) {
		if (err) console.log(err);
		console.log(result);
		mongoose.disconnect();
	});
}
//** process and confirm 2G/3G Orders

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
	models.Order.process2G_3G(function(err,result){
		if(err) return console.log(err);
		console.log('process order ok.');
		models.Order.confirm2G_3G(function(err,result){
			if(err) return console.log(err);
			console.log('confirm order ok.');
			mongoose.disconnect();
		});
	});
}
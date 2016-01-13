var processCiticTrading = function(models,callback) {

	models.Trading
		.find({
		})
		.limit(5)
		.exec(function(err, docs) {
			if (err) return callback(err);
			if (!docs) return callback();
			var _processCiticTrading = function(docs) {
				//** process one
				var doc = docs.pop();
				if (!doc) return callback();
				var id = doc._id;
				var path = require('path');
				cbss_cwd = path.join(__dirname, '../libs/citic');
				var worker = require('child_process').execFile(
					'casperjs', [
						'order.buy.casper.js',
						'--id=' + id,
						'--cookie=' + JSON.stringify(doc.cookies),
						'--callback_url=' + 'http://localhost:8091/stock/tradings'
					], {
						cwd: cbss_cwd,
					},
					function(err, stdout, stderr) {
						if (err) console.error(err);
						console.log('-----citic buy trading --------');
						console.log(stdout);
						setTimeout(function() {
							_processCiticTrading(docs);
						}, 1000);
					});
			};
			_processCiticTrading(docs);
		});
};
exports = module.exports = processCiticTrading;

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
		Trading: require('../models/Trading')(mongoose),
	};

	processCiticTrading(models,function(err) {
		if (err) return console.log(err);
		console.log('process CITIC buy trading successfully.');
	});
}
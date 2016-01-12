var refreshCiticCookie = function(models,callback) {

	models.StockAccount
		.find({
			'company.name': '中信证券',
			'login': true,
			'status': '有效',
			'lastupdatetime': {
				$lte: (Date.now() - 3000)
			}
		})
		.limit(5)
		.exec(function(err, docs) {
			if (err) return callback(err);
			if (!docs) return callback();
			var _refreshCiticCookie = function(docs) {
				//** process one
				var doc = docs.pop();
				if (!doc) return callback();
				var id = doc._id;
				var path = require('path');
				cbss_cwd = path.join(__dirname, '../libs/citic');
				var worker = require('child_process').execFile(
					'casperjs', [
						'cookie.casper.js',
						'--id=' + id,
						'--cookie=' + JSON.stringify(doc.cookies),
						'--refresh_url=' + 'http://localhost:8091/stock/accounts'
					], {
						cwd: cbss_cwd,
					},
					function(err, stdout, stderr) {
						if (err) console.error(err);
						// console.log('++++')
						// console.log(stdout);
						setTimeout(function() {
							_refreshCiticCookie(docs);
						}, 1000);
					});
			};
			_refreshCiticCookie(docs);
		});
};
exports = module.exports = refreshCiticCookie;

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
		StockAccount: require('../models/StockAccount')(mongoose),
	};

	refreshCiticCookie(models,function(err) {
		if (err) return console.log(err);
		console.log('refresh CITIC Accounts Cookie successfully.');
		// process.exit();
	});
}
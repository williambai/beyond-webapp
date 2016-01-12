var updateCookie = function(callback) {

	models.CbssAccount
		.find({
			'status': '有效',
			'cookie.max_age': {
				$lte: 30,
			},
		})
		.limit(20)
		.exec(function(err, docs) {
			if(err) return callback(err);
			if(!docs) return callback();
			var _updateCookie = function(docs) {
				if (!doc) return callback();
				//** process one
				var doc = docs.pop();
				var id = doc._id;
				var path = require('path');
				cbss_cwd = path.join(__dirname, '../libs/cbss');
				var worker = require('child_process').execFile(
					'casperjs', [
						'cookie.casper.js',
						'--id=' + id,
						'--cookie=' + doc.cookieRaw,
					], {
						cwd: cbss_cwd,
					},
					function(err, stdout, stderr) {
						if (err) return console.error(err);
						var cookieRaw = stdout;
						var cookie = {};
						models.CbssAccount
							.findByIdAndUpdate(id, {
								$set: {
									'cookieRaw': cookieRaw,
									'cookie': cookie,
								}
							}, {
								'upsert': false,
								'new': true,
							}, function(err, doc) {
								if(err) return console.error(err);
							});
					});
				setTimeout(function() {
					_updateCookie(docs);
				}, 1000);
			};
		});
};

if (process.argv[1] === __filename) {
	var _ = require('underscore');
	var mongoose = require('mongoose');
	//** import the models
	var models = {
		CbssAccount: require('../models/CbssAccount')(mongoose),
	};
	updateCookie(function(err){
		if(err) return console.log(err);
		console.log('refresh CBSS Accounts Cookie successfully.');
	});
}
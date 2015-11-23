var mongoose = require('mongoose');
var async = require('async');
var crypto = require('crypto');

var config = {
	db: require('../../config/db'),
};

//** import the models
var models = {
	Account: require('../../models/Account')(mongoose),
	Trading: require('../../models/Trading')(mongoose),
	Strategy: require('../../models/Strategy')(mongoose)
};

mongoose.connect(config.db.URI, function onMongooseError(err) {
	if (err) {
		console.error('Error: can not open Mongodb.');
		throw err;
	}
});

var users = [{
	email: 'demo@appmod.cn',
	password: crypto.createHash('sha256').update('123456').digest('hex'),
	username: 'demo',
	birthday: {
		day: 20,
		month: 5,
		year: 1980
	},
	biography: '',
	avatar: '',
	status: {
		code: 0,
		message: '正常'
	}
}];

var dropCollections = function(done) {
	async.series(
		[
			function(callback){
				models.Account.remove(callback);
			},
			function(callback) {
				models.Strategy.remove(callback);
			}
		],
		function(err, result) {
			if (err) return done(err);
			done(null, result);
		}
	);
};

/**
 * 
 * create Accounts
 * 
 */
var upsertAccounts = function(callback) {
	var upsertAccount = function(index) {
		var user = users[index];
		var clone = _.clone(user);
		models.Account.create(
			user,
			function(err, result) {
				if (err) return callback(err);
				callback(null);
			}
		);
	};
	upsertAccount(0);
};


/**
 * 
 * create Strategies
 * 
 */
var upsertStrategies = function(done) {
	var strategies = require('./strategies');
	async.eachSeries(strategies, function(strategy, callback) {
		models.Strategy.create(strategy, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};

async.series(
	[
		dropCollections,
		upsertAccounts,
		upsertStrategies,
	],
	function(err, result) {
		if (err) console.log(err);
		mongoose.disconnect();
	}
);
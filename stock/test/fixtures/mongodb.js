var mongoose = require('mongoose');
var async = require('async');

var config = {
	db: require('../../config/db'),
};
//** import the models
var models = {
	Trading: require('../../models/Trading')(mongoose),
	Strategy: require('../../models/Strategy')(mongoose)
};

mongoose.connect(config.db.URI, function onMongooseError(err) {
	if (err) {
		console.error('Error: can not open Mongodb.');
		throw err;
	}
});

var dropCollections = function(done) {
	async.series(
		[
			function(callback){
				models.Strategy.remove(callback);
			}
		],
		function(err, result) {
			if(err) return done(err);
			done(null,result);
		}
	);
};

var createStrategies = function(done){
	var strategies = require('./strategies');
	async.eachSeries(strategies,function(strategy,callback){
		models.Strategy.create(strategy,function(err){
			if(err) return callback(err);
			callback(null);
		});
	},done);
};

async.series(
	[
		dropCollections,
		createStrategies,
	],
	function(err, result) {
		if (err) console.log(err);
		mongoose.disconnect();
	}
);
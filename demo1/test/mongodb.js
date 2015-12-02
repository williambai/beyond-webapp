var _ = require('underscore');
var async = require('async');
var crypto = require('crypto');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var config = {
		db: require('../config/db')
	};		

//import the models
var models = {
	};

mongoose.connect(config.db.URI,function onMongooseError(err){
	if(err) {
		console.error('Error: can not open Mongodb.');
		throw err;
	}
});

/**
 * 准备数据
 * 
 */


var dropCollections = function(done) {
	async.series(
		[
		],
		function(err, result) {
			if (err) return done(err);
			done(null, result);
		}
	);
};

/**
 * 
 * create XXXXX
 * 
 */


/**
 * process workflow
 * 
 */

async.series(
	[
		dropCollections,
	],
	function(err, result) {
		if (err) console.log(err);
		mongoose.disconnect();
	}
);

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
		Account: require('../models/Account')(mongoose),
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

var accounts = require('./accounts');

var dropCollections = function(done) {
	async.series(
		[
			function(callback){
				models.Account.remove(callback);
			},
		],
		function(err, result) {
			if (err) return done(err);
			done(null, result);
		}
	);
};

/**
 * 
 * create Account
 * 
 */
var upsertAccounts = function(callback) {
	var upsertAccount = function(index) {
		var account = accounts[index];
		models.Account.create(
			account,
			function(err, result) {
				if (err) return callback(err);
				callback(null);
			}
		);
	};
	upsertAccount(0);
};

async.series(
	[
		dropCollections,
		upsertAccounts,
	],
	function(err, result) {
		if (err) console.log(err);
		mongoose.disconnect();
	}
);
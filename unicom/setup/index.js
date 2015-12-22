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
		AccountActivity: require('../models/AccountActivity')(mongoose),
		PlatformApp: require('../models/PlatformApp')(mongoose),
		PlatformFeature: require('../models/PlatformFeature')(mongoose),
		PlatformRole: require('../models/PlatformRole')(mongoose),		
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
			function(callback){
				models.PlatformFeature.remove(callback);
			},
			function(callback){
				models.PlatformRole.remove(callback);
			},
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
 * create Feature
 * 
 */
var upsertFeatures = function(done) {
	var features = require('./features');
	async.eachSeries(features, function(feature, callback) {
		models.PlatformFeature.create(feature, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};
/**
 * 
 * create Role
 * 
 */
var upsertRoles = function(done) {
	var roles = require('./roles');
	async.eachSeries(roles, function(role, callback) {
		models.PlatformRole.create(role, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};
/**
 * 
 * create Account
 * 
 */var accounts = require('./accounts');

var upsertAccounts = function(done) {
	var accounts = require('./accounts');
	async.eachSeries(accounts, function(account, callback) {
		models.Account.create(account, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};

async.series(
	[
		dropCollections,
		upsertFeatures,
		upsertRoles,
		upsertAccounts,
	],
	function(err, result) {
		if (err) console.log(err);
		mongoose.disconnect();
	}
);
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var crypto = require('crypto');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var config = {
		db: require('../config/db')
	};		

//import the models
var models = {};
fs.readdirSync(path.join(__dirname, '..', 'models')).forEach(function(file) {
	if (/\.js$/.test(file)) {
		var modelName = file.substr(0, file.length - 3);
		models[modelName] = require('../models/' + modelName)(mongoose);
	}
});

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
				models.PlatformApp.remove(callback);
			},
			function(callback){
				models.Account.remove(callback);
			},
			function(callback){
				models.Goods.remove(callback);
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
 * create Feature
 * 
 */
var upsertApps = function(done) {
	var apps = require('./apps');
	async.eachSeries(apps, function(app, callback) {
		models.PlatformApp.create(app, function(err) {
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
 */

var upsertAccounts = function(done) {
	var accounts = require('./accounts');
	async.eachSeries(accounts, function(account, callback) {
		models.Account.create(account, function(err) {
			if (err) return callback(err);
			callback(null);
		});
	}, done);
};

/**
 * 
 * create Goods
 * 
 */

var upsertGoods = function(done) {
	var goods = require('./goods');
	async.eachSeries(goods, function(item, callback) {
		models.Goods.create(item, function(err) {
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
		upsertApps,
		upsertAccounts,
		upsertGoods,
	],
	function(err, result) {
		if (err) console.log(err);
		mongoose.disconnect();
	}
);
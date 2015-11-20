var _ = require('underscore');
var async = require('async');
var crypto = require('crypto');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var config = {
		db: require('../../config/db')
	};		

//app emulator
var app = {
	isAccountOnline: function(accountId){
		return false;
	}
};

//import the models
var models = {
		Account: require('../../models/Account')(mongoose),
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
		],
		function(err, result) {
			if (err) return done(err);
			done(null, result);
		}
	);
};

/**
 * 
 * create Account and AccountActivity
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



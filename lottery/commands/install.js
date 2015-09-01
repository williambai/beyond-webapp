var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');
var async = require('async');

var url = 'mongodb://localhost:27017/lottery';

var initAccount = function(db,callback){
		var accounts = db.collection('accounts');
		accounts.findOneAndUpdate(
			{
				email: 'admin@pdbang.cn'
			},
			{
				email: 'admin@pdbang.cn',
				username: 'admin',
				password: crypto.createHash('sha256').update('123456').digest('hex'),
				avatar: '',
				roles: {
					admin: true,
					agent: true,
					user: true
				},
				business: {
					stage: 'prod',
					times: -1,
					expired: -1
				},
				balance: 100000,
			},
			{
				upsert: true
			},
			callback
		);
	};

MongoClient.connect(url, function(err,db){
	async.waterfall(
		[
			function(callback){
				initAccount(db,callback);
			},
		],
		function(err,result){
			db.close();
		}
	);
});

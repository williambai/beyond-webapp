var mongoose = require('mongoose');
var async = require('async');

var config = {
		server: require('../config/server'),
		mail: require('../config/mail'),
		db: require('../config/db')
	};		
//import the models
var models = {
		Account: require('../models/Account')(mongoose),
		Order: require('../models/Order')(mongoose),
		Record: require('../models/Record')(mongoose),
	};

var initAccount = function(){

		mongoose.connect(config.db.URI,function onMongooseError(err){
			if(err) {
				console.error('Error: can not open Mongodb.');
				throw err;
			}
		});

		models.Account.findOneAndUpdate(
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
			function(err,doc){
				if(err) return console.log(err);
				mongoose.disconnect();
				console.log('creating admin account: done!');
			}
		);
	};

setTimeout(initAccount,1);

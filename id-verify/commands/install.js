var nodemailer = require('nodemailer');
//import the data layer
var mongoose = require('mongoose');
var config = {
		server: require('../config/server'),
		mail: require('../config/mail'),
		db: require('../config/db')
	};	
	
mongoose.connect(config.db.URI,function onMongooseError(err){
	if(err) {
		console.error('Error: can not open Mongodb.');
		throw err;
	}
});

//import the models
var models = {
		Account: require('../models/Account')(this,config,mongoose,nodemailer),
	};

var Account = models.Account;


//insert admin account
Account.add(
	{
		id: 0,
		username: 'admin',
		avatar: '',
	},
	{
		email: 'admin@pdbang.cn',
		username: 'admin',
		password: '123456',
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
	}
);

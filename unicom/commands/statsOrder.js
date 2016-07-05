/**
 * 
 * 按月统计各城市订单数据 
 */

if (process.argv[1] === __filename) {
	var now = new Date();
	var year = process.argv[2] || now.getFullYear();
	var month = process.argv[3] || now.getMonth() + 1; 
	//** common packages
	var path = require('path');
	var fs = require('fs');
	var config = {
		db: require('../config/db'),
	};
	//** MongoDB packages
	var mongoose = require('mongoose');
	mongoose.connect(config.db.URI, function onMongooseError(err) {
		if (err) {
			logger.error('Error: can not open Mongodb.');
			throw err;
		}
	});
	//** import MongoDB's models
	var models = {};
	fs.readdirSync(path.join(__dirname, '../models')).forEach(function(file) {
		if (/\.js$/.test(file)) {
			var modelName = file.substr(0, file.length - 3);
			models[modelName] = require('../models/' + modelName)(mongoose);
		}
	});
	//** 按月统计佣金数据 
	models.PlatformStatsCity
		.statOrderByMonthly({
			year: year,
			month:month,
		},function(err,result){
			if(err) return console.log(err);
			console.log('按月统计各城市用户数据 process ok.');
			mongoose.disconnect();
		});
}
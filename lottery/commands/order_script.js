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
	

var createRecordsFromOrder = function(){

	mongoose.connect(config.db.URI,function onMongooseError(err){
		if(err) {
			console.error('Error: can not open Mongodb.');
			throw err;
		}
	});

	var stream = models.Order
						.find({
							status: 0,
							'game.remained': {&gt: 0}	
						}).limit(10).stream();

	stream
		.on('data', function(order){

			async.waterfall(
				[
					function(callback){
						stream.pause();
						callback(null,order);
					},
					//检查Order.customer身份证号码
					//检查Order有效
					//检查是否已经创建Record
					//创建Record

					//更新Order
					function(order,callback){
						var record ={
								createtime: new Date(),
							};
						order.records.push(record);
						order.save(function(err){
							if(err) return callback(err);
							callback(null,order);
						});
					}
					//发送SMS
				],
				function(err,result){
					if(err) return callback(err);
					stream.resume();
				}
			);
		})
		.on('error', function(err){
			console.error(err);
		})
		.on('close', function(){
			mongoose.disconnect();
			console.log('creating records from order: done!');
		});
}

setTimeout(createRecordsFromOrder,1);

var mongoose = require('mongoose');
var async = require('async');
var config = {
		server: require('../config/server'),
		mail: require('../config/mail'),
		db: require('../config/db'),
		lottery: require('../config/lottery')
	};		
var request = require('request');

//import the models
var models = {
		Account: require('../models/Account')(mongoose),
		Order: require('../models/Order')(mongoose),
		Record: require('../models/Record')(mongoose),
	};
	

var requestLotteryFromRecord = function(){

	mongoose.connect(config.db.URI,function onMongooseError(err){
		if(err) {
			console.error('Error: can not open Mongodb.');
			throw err;
		}
	});

	var stream = models.Record
						.find({
							status: 0,
						}).limit(10).stream();

	stream
		.on('data', function(record){

			async.waterfall(
				[
					function(callback){
						stream.pause();
						callback(null,record);
					},
					//检查今天是否已经处理
					//请求 Lottery.command1000
					function(record,callback){
						var body = '';
						request(
							{
								url: 'http://localhost:9001/getlot/1000',
								method: 'POST',
								headers: {
									'content-type': 'application/xml'
								},
								body: body
							},
							function(err,response){
								if(err) return callback(err);
								record.histories.push(response.body);
								callback(null,record);
							}
						);
					},
					//更新Record
					function(record,callback){
						record.save(function(err){
							if(err) return callback(err);
							callback(null,record);
						});
					}
					//发送SMS
				],
				function(err,result){
					if(err) return console.log(err);
					stream.resume();
				}
			);
		})
		.on('error', function(err){
			console.error(err);
		})
		.on('close', function(){
			mongoose.disconnect();
			console.log('creating records from record: done!');
		});
}

setTimeout(requestLotteryFromRecord,1);

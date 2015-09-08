var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var Lottery = require('../libs');

var lottery = new Lottery();

var url = 'mongodb://localhost:27017/lottery';

var command1000 = function(db,callback){
		var collection = db.collection('orders');
		var cursor = collection.find();
		var next = function(cursor){
			if(!cursor.hasNext()){
				callback(null);
				return;
			}
			var order = cursor.next();
			var body ={

			};
			lottery.command1000(body,function(err,result){
				collection.findOneAndUpdate(
					{
						_id: order._id
					},
					{
						$push: {messages: result}
					},
					function(err,result){
						if(err){
							callback(err);
							return;
						}
						setTimeout(function(){
							next(cursor);
						},1000);
					}
				);
			});
		}
	};

MongoClient.connect(url, function(err,db){
	async.waterfall(
		[
			function(callback){
				command1000(db,callback);
			},
		],
		function(err,result){
			db.close();
		}
	);
});
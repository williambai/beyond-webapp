var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var path = require('path');
var cst = require('./config/constant');
var trading = require('./libs/trading')();

var intervalObject;

var mongoose = require('mongoose');
var config = {
	mail: require('./config/mail'),
	db: require('./config/db')
};
//** import the models
var models = {
	StockQuote: require('./models/StockQuote')(mongoose),
	Trading: require('./models/Trading')(mongoose),
	Strategy: require('./models/Strategy')(mongoose),
};

trading.setModels(models);

var start = function() {

	mongoose.connect(config.db.URI, function onMongooseError(err) {
		if (err) {
			console.error('Error: can not open Mongodb.');
			throw err;
		}
	});
	var lastTimestamp = Date.now();
	var interal = 5000;
	intervalObject = setInterval(function() {
		// console.log('+++')
		// console.log(lastTimestamp)
		trading.run(function(err, result) {
			if (err) console.log(err);
			// console.log(result);
			var now = Date.now();
			interal = now - lastTimestamp;
			if (interal < 1) {
				interal = 1;
				console.log('执行时间太长，应调节间隔');
			}
			lastTimestamp = now;
		});
	}, interal);
	process.send && process.send({
		code: 200,
		status: 'Ok'
	});
};

var stop = function() {
	console.log('\nclient stop.\n');
	intervalObject && clearInterval(intervalObject);
	mongoose.disconnect();
	process.send && process.send({
		code: 200,
		status: 'Ok'
	});
};


var keepAlive = function(){
	return setInterval(function(){
		process.send({});
	},5000);
};

/**
 * client process
 * @param  {[type]} msg) {	msg        message Object
 * @return {[type]}      [description]
 */
process.on('message', function(msg) {
	msg = msg || {};
	var command = msg.command || '';
	switch (command) {
		case 'start':
			keepAlive();
			start();
			break;
		case 'stop':
			stop();
			break;
		default:
			break;
	}
});

process.on('exit', function(){
	//ONLY accept synchronous operations
	console.log('exit');
});

process.on('error', function(err){
	console.log('error.');
	process.exit();
});

//dev
if(process.argv.length == 3){
	start();
	setTimeout(function(){
		stop();
	},10000);
}

#!/usr/bin/env node

var commander = require('commander');
var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var path = require('path');
var cst = require('../config/constant');
var trading = require('../libs/trading')();

var intervalObject;

var mongoose = require('mongoose');
var config = {
	mail: require('../config/mail'),
	db: require('../config/db')
};

var stop = function(){
	console.log('\nclient stop.\n');
	intervalObject && clearInterval(intervalObject);
	mongoose.disconnect();

	var pid_file = path.join(__dirname, cst.PATH_PID_FILE);
	var pid = fs.readFileSync(pid_file);
	fs.unlinkSync(pid_file);
	// process.kill(pid);	
};

commander
	.version('0.0.1')
	.usage('[options]')
	.option('--start', 'start client')
	.option('--stop', 'stop client')
	.option('--restart', 'restart')
	.parse(process.argv);

if (commander.start) {
	var pid_file = path.join(__dirname, cst.PATH_PID_FILE);
	//** has been started?
	if (fs.existsSync(pid_file)) {
		console.log('has been started.');
		return process.exit(0);
	}

	fs.writeFileSync(pid_file, process.pid);
	process.on('SIGINT', function() {
		stop();
	});

	//** import the models
	var models = {
		Trading: require('../models/Trading')(mongoose),
		Strategy: require('../models/Strategy')(mongoose),
	};

	mongoose.connect(config.db.URI, function onMongooseError(err) {
		if (err) {
			console.error('Error: can not open Mongodb.');
			throw err;
		}
	});
	trading.setModels(models);

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
}

if (commander.stop) {
	stop();
}

//
// Display help
//
if (process.argv.length == 2) {
	commander.parse(process.argv);
	commander.outputHelp();
	process.exit(0);
}
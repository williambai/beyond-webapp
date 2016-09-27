var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var log4js = require('log4js');
log4js.configure(path.join(__dirname,'../config/log4js.json'), {cwd: path.resolve(__dirname, '..')});
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

var config = {
	server: require('../config/server'),
	db: require('../config/db'),
};

//import the models
var models = {};
fs.readdirSync(path.resolve(__dirname, '../models')).forEach(function(file) {
	if (/\.js$/.test(file)) {
		var modelName = file.substr(0, file.length - 3);
		var modelNameCamelCase = modelName.replace(/^([a-z])/,function(all, letter){
			return letter.toUpperCase();
		});
		modelNameCamelCase = modelNameCamelCase.replace(/_([a-z])/ig, function(all, letter){
			return letter.toUpperCase();
		});
		models[modelNameCamelCase] = require('../models/' + modelName)(mongoose);
	}
});

mongoose.connect(config.db.URI, function onMongooseError(err) {
	if (err) {
		logger.error('Error: can not open Mongodb.');
		throw err;
	}
});

var app = express();

//** gzip/deflate outgoing response
// var compression = require('compression');
// app.use(compression());

//** parse urlencoding request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//** response to all requests
app.use(express.static(path.resolve(__dirname, '../public')));

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://"+ req.host +":8000");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Set-Cookie");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

//import the routes
fs.readdirSync(path.join(__dirname, '../routes')).forEach(function(file) {
	if (/\.js$/.test(file)) {
		var routeName = file.substr(0, file.length - 3);
		require('../routes/' + routeName)(app, models);
	}
});

//** create node.js http server and listen on port
http.createServer(app).listen(config.server.PORT, function(){
	console.log('api server started on port '+ config.server.PORT + '.\n');
});

//** process uncaughtException
process.on('uncaughtException', function(){
	logger.warn('uncaughtException and process exit.');
	mongoose.disconnect();
	process.exit(1);
});
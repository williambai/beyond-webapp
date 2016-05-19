var fs = require('fs');
var http = require('http');
var path = require('path');
var express = require('express');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var nodemailer = require('nodemailer');

//** 启动log4js配置
var log4js = require('log4js');
log4js.configure(path.resolve(__dirname,'../config/log4js.json'), {cwd: path.resolve(__dirname, '..')});
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

//create an http server
app.server = http.createServer(app);

//import the data layer
var mongoose = require('mongoose');
var config = {
	server: require('../config/server'),
	mail: require('../config/mail'),
	db: require('../config/db')
};

//import the models
var models = {};
fs.readdirSync(path.resolve(__dirname, '../models')).forEach(function(file) {
	if (/\.js$/.test(file)) {
		var modelName = file.substr(0, file.length - 3);
		models[modelName] = require('../models/' + modelName)(mongoose);
	}
});

mongoose.connect(config.db.URI, function onMongooseError(err) {
	if (err) {
		logger.error('Error: can not open Mongodb.');
		throw err;
	}
});
//** show origin cookie
app.use(function(req,res,next){
	// logger.info('req.cookies:' + JSON.stringify(req.headers.cookie));
	next();
});

//express configure
app.set('view engine', 'jade');
app.set('views', path.resolve(__dirname, '../views'));

app.use(express.static(path.resolve(__dirname, '../public')));
// app.use(express.limit('1mb'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

//app session
app.sessionSecret = 'it is stock project.';
app.sessionStore = new mongoStore({
	url: config.db.URI,
	collection: 'sessions'
});
app.use(session({
	secret: app.sessionSecret,
	key: 'beyond.sid',
	store: app.sessionStore,
	saveUninitialized: false,
	resave: true
}));

//登录判断中间件
app.isLogined = function(req, res, next) {
	if (req.session.loggedIn) {
		next();
	} else {
		res.sendStatus(401);
	}
};

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8000");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Set-Cookie");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

//import the routes
fs.readdirSync(path.resolve(__dirname, '../routes')).forEach(function(file) {
	if (/\.js$/.test(file)) {
		var routeName = file.substr(0, file.length - 3);
		require('../routes/' + routeName)(app, models);
	}
});

app.server.listen(config.server.PORT, function() {
	logger.info(config.server.NAME + ' App is running at ' + config.server.PORT + ' now.');
});

//** process kill signal
process.on('SIGTERM', function() {
	logger.warn(config.server.NAME + ' App is shutdowned at ' + config.server.PORT + ' because of kill signal.');
	process.exit(1);
});

//** process uncaughtException
process.on('uncaughtException', function(e){
	logger.warn(config.server.NAME + ' App is shutdowned at ' + config.server.PORT + ' because of uncaughtException.');
	logger.debug(e);
	process.exit(1);
});
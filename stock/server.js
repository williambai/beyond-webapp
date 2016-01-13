var log4js = require('log4js');
var worker = require('child_process').fork('./worker');
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

log4js.configure(path.join(__dirname,'log4js.json'));
var logger = log4js.getLogger('server');
logger.setLevel('DEBUG');

var workerStatus = {
	platform: false,
	trade: false,
};

//create an http server
app.server = http.createServer(app);

//import the data layer
var mongoose = require('mongoose');
var config = {
	server: require('./config/server'),
	mail: require('./config/mail'),
	db: require('./config/db')
};

//import the models
var models = {
	Account: require('./models/Account')(mongoose),
	StockAccount: require('./models/StockAccount')(mongoose),
	Trading: require('./models/Trading')(mongoose),
	Strategy: require('./models/Strategy')(mongoose),
};

mongoose.connect(config.db.URI, function onMongooseError(err) {
	if (err) {
		logger.error('Error: can not open Mongodb.');
		throw err;
	}
});

//express configure
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
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
fs.readdirSync(path.join(__dirname, 'routes')).forEach(function(file){
	if(/\.js$/.test(file)){
		var routeName = file.substr(0,file.length-3);
		require('./routes/' + routeName)(app,models);
	}
});

app.server.listen(config.server.PORT, function() {
	logger.info(config.server.NAME + ' App is running at ' + config.server.PORT + ' now.');

	//kill child_process
	process.on('SIGTERM', function() {
		logger.info('Master Got a SIGTERM, exiting...');
		worker.kill('SIGTERM');
		process.exit(1);
		logger.info(config.server.NAME + ' App is shutdowned at ' + config.server.PORT + ' gracefully.');
	});

	worker.on('exit', function() {
		logger.info('worker exit');
		worker = require('child_process').fork('./worker');
		logger.info('worker restart');
		worker.send({
			command: 'start'
		});
	});
	
	worker.on('message', function(msg) {
		logger.info(msg);
		workerStatus = msg;
	});
	worker.send({
		command: 'start'
	});

	app.post('/captcha', function(req,res){
		var captcha = req.body.captcha;
		worker.send({command: 'captcha', captcha: captcha});
		res.send({});
	});

	app.get('/platform/status', function(req, res) {
		res.send(workerStatus);
	});

	app.post('/platform/start', function(req, res) {
		logger.info('start platform');
		worker.send({command: 'start'});
		res.send({});
	});

	app.post('/platform/stop', function(req, res) {
		logger.info('stop platform');
		worker.send({command: 'stop'});
		res.send({});
	});
});

//** schedule Jobs
var schedule = require('node-schedule');
var refreshCiticCookie = require('./commands/refreshCiticCookie1');
schedule.scheduleJob('*/5 * * * *', function(){
	refreshCiticCookie(function(err) {
		if (err) return console.log(err);
		console.log('refresh CITIC Accounts Cookie successfully.');
	});
});
console.log('scheduleJobs is started.');
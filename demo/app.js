var events = require('events');
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

//create an http server
app.server = http.createServer(app);

//create an event dispatcher
var eventDispatcher = new events.EventEmitter();
app.addEventListener = function(eventName, callback){
		eventDispatcher.on(eventName,callback);
	};
app.removeEventListener = function(eventName,callback){
		eventDispatcher.removeListener(eventName,callback);
	};
app.triggerEvent = function(eventName,eventOptions){
		eventDispatcher.emit(eventName, eventOptions);
	};	

//import the data layer
var mongoose = require('mongoose');
var config = {
		server: require('./config/server'),
		mail: require('./config/mail'),
		db: require('./config/db')
	};		

//import the models
var models = {
		Status: require('./models/Status')(app,config,mongoose,nodemailer),
		Account: require('./models/Account')(app,config,mongoose,nodemailer),
		Project: require('./models/Project')(app,config,mongoose,nodemailer),
		Chat: require('./models/Chat')(app,config,mongoose,nodemailer),
	};
	
mongoose.connect(config.db.URI,function onMongooseError(err){
	if(err) {
		console.error('Error: can not open Mongodb.');
		throw err;
	}
});

//express configure
app.set('view engine', 'jade');
app.set('views', __dirname +'/views');

app.use(express.static(__dirname + '/public'));
// app.use(express.limit('1mb'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

//app session
app.sessionSecret = 'it is mime.';
app.sessionStore = new mongoStore({
			url: config.db.URI,
			collection: 'sessions'
		});
app.use(session({
		secret: app.sessionSecret,
		key: 'beyond.sid',
		store: app.sessionStore,
		saveUninitialized: true,
        resave: true
    }));

app.get('/', function(req,res){
	res.render('index.jade',{layout: false});
});

//登录判断中间件
app.isLogined = function(req,res,next){
	if(req.session.loggedIn){
		next();
	}else{
		res.sendStatus(401);
	}
};

/** for development ONLY */
app.get('/css/app.css', function(req,res){
	res.set('Content-Type','text/css');
	var through = require('through');
	var gulp = require('gulp');
	var less = require('gulp-less');
	var cssmin = require('gulp-cssmin');
	// create a stream that reads gulp File objects and outputs their contents
	function sendTo(res) {   
	    return through(
	        function write(data) {    // this will be called once for each file
	            res.write(data.contents);
	        },
	        function end() {    // this will be called when there are no more files
	            res.end();
	        }
	    );
	};

	gulp.src([path.join(__dirname,'public','less','app.less')])
	  .pipe(less({
	    paths: [ path.resolve(__dirname,'public/less')]
	  }))
	  // .pipe(cssmin())
	  .pipe(sendTo(res));

});

//import the routes
fs.readdirSync(path.join(__dirname, 'routes')).forEach(function(file){
	var routeName = file.substr(0,file.indexOf('.'));
	require('./routes/' + routeName)(app,models);
});

app.server.listen(config.server.PORT,function(){
	console.log(config.server.NAME + ' App is running at '+ config.server.PORT + ' now.');
});
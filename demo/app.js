var express = require('express');
var session = require('express-session');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var multer = require('multer'); 
var app = express();
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var config = {
		server: require('./config/server'),
		mail: require('./config/mail'),
		db: require('./config/db')
	};	
var Account = require('./models/Account')(config,mongoose,nodemailer);

mongoose.connect(config.db.URI);

app.set('view engine', 'jade');
app.set('views', __dirname +'/views');

app.use(express.static(__dirname + '/public'));
// app.use(express.limit('1mb'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({
		secret: 'it is mime.',
		store: new mongoStore({
			url: config.db.URI,
			collection: 'sessions'
		}),
		saveUninitialized: true,
        resave: true
    }));

app.get('/', function(req,res){
	res.render('index.jade',{layout: false});
});

app.post('/register',function(req,res){
	var firstName = req.param('firstName','');
	var lastName = req.param('lastName','');
	var email = req.param('email',null);
	var password = req.param('password', null);

	if(null == email || email.length<1 || null == password || password.length<1){
		res.send(400);
		return;
	}
	Account.register(email,password,firstName,lastName);
	res.send(200);
});

app.post('/login',function(req,res){
	var email = req.param('email',null);
	var password = req.param('password', null);

	if(null == email || email.length<1 || null == password || password.length<1){
		res.send(400);
		return;
	}
	Account.login(email,password,function(success){
		if(!success){
			res.send(401);
			return;
		}
		console.log(email + ': login sucessfully.');
		req.session.loggedIn = true;
		res.send(200);
	});
});

app.post('/forgotPassword',function(req,res){
	var email = req.param('email', null);
	if(null == email || email.length<1){
		res.send(400);
		return;
	}
	var hostname = req.header.host;
	var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
	Account.forgotPassword(email, resetPasswordUrl,function(success){
		if(!success){
			res.send(404);
			return;
		}
		res.send(200);
	});
	res.send(200);
});

app.get('resetPassword',function(req,res){
	var accountId = req.param('account', null);
	res.render('resetPassword.jade',{locals: {accountId: accountId}});

});

app.post('/resetPassword',function(req,res){
	var accountId = req.param('accountId', null);
	var password = req.param('password',null);
	if(null != accountId && null != password){
		Account.resetPassword(accountId,password);
	}
	res.render('resetPasswordSucess.jade');
});

app.get('/account/authenticated', function(req,res){
	if(req.session.loggedIn){
		res.send(200);
	}else{
		res.send(401);
	}
});


app.listen(config.server.PORT,function(){
	console.log(config.server.NAME + ' App is running at '+ config.server.PORT + ' now.');
});
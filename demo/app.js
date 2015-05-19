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
	var firstName = req.body.firstName || '';
	var lastName = req.body/lastName || '';
	var email = req.body.email;
	var password = req.body.password;

	if(null == email || email.length<1 || null == password || password.length<1){
		res.sendStatus(400);
		return;
	}
	Account.register(email,password,firstName,lastName);
	res.sendStatus(200);
});

app.post('/login',function(req,res){
	var email = req.body.email;
	var password = req.body.password;

	if(null == email || email.length<1 || null == password || password.length<1){
		res.sendStatus(400);
		return;
	}
	Account.login(email,password,function(account){
		if(!account){
			res.sendStatus(401);
			return;
		}
		console.log(email + ': login sucessfully.');
		req.session.loggedIn = true;
		req.session.accountId = account._id;
		res.sendStatus(200);
	});
});

app.get('/logout', function(req,res){
	delete req.session.loggedIn;
	console.log(req.session.accountId + ': logout sucessfully.');
	res.sendStatus(200);
});

app.post('/forgotPassword',function(req,res){
	var email = req.body.email;
	if(null == email || email.length<1){
		res.sendStatus(400);
		return;
	}
	var hostname = req.header.host;
	var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
	Account.forgotPassword(email, resetPasswordUrl,function(success){
		if(!success){
			res.sendStatus(404);
			return;
		}
		res.sendStatus(200);
	});
	res.sendStatus(200);
});

app.get('resetPassword',function(req,res){
	var accountId = req.param('account', null);
	res.render('resetPassword.jade',{locals: {accountId: accountId}});

});

app.post('/resetPassword',function(req,res){
	var accountId = req.body.accountId;
	var password = req.body.password;
	if(null != accountId && null != password){
		Account.resetPassword(accountId,password);
	}
	res.render('resetPasswordSucess.jade');
});

app.get('/account/authenticated', function(req,res){
	if(req.session.loggedIn){
		res.sendStatus(200);
	}else{
		res.sendStatus(401);
	}
});


app.get('/accounts/:id', function(req,res){
	var accountId = req.params.id == 'me' 
						? req.session.accountId
						: req.params.id;
	Account.findById(accountId, function(account){
		res.send(account);
	});
});

app.get('/accounts/:id/status',function(req,res){
	var accountId = req.params.id == 'me' 
						? req.session.accountId
						: req.params.id;
	Account.findById(accountId, function(account){
		res.send(account.status);
	});
});

app.post('/accounts/:id/status',function(req,res){
	var accountId = req.params.id == 'me' 
						? req.session.accountId
						: req.params.id;
	Account.findById(accountId, function(account){
		var status = {
			name: account.name,
			status: req.body.status || ''
		};
		account.status.push(status);
		account.activity.push(status);
		account.save(function(err){
			if(err){
				console.log('Error saving account: ' + err);
			}
		});
	});
	res.sendStatus(200);
});

app.get('/accounts/:id/activity',function(req,res){
	var accountId = req.params.id == 'me' 
						? req.session.accountId
						: req.params.id;
	Account.findById(accountId, function(account){
		res.send(account.activity);
	});
});

app.listen(config.server.PORT,function(){
	console.log(config.server.NAME + ' App is running at '+ config.server.PORT + ' now.');
});
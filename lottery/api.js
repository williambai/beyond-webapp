var async = require('async');
var crypto = require('crypto');
var Buffer = require('buffer');

var restify = require('restify');
var config = {
		server: require('./config/server'),
		mail: require('./config/mail'),
		db: require('./config/db')
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
		Account: require('./models/Account')(mongoose),
		Order: require('./models/Order')(mongoose),
		Record: require('./models/Record')(mongoose),
	};
	
mongoose.connect(config.db.URI,function onMongooseError(err){
	if(err) {
		console.error('Error: can not open Mongodb.');
		throw err;
	}
});

var server = restify.createServer({
	name: config.server.NAME + ' API',
});
var options = {
		url: 'http://localhost:9001/getlot', 
		callback_url: 'http://localhost:' + (config.server.PORT + 443) +'/api/callback',
		merchantid: '853602',
		prefix: 'HQT',
		ftp:  '/home/pureftpd',
		encrypt_key: '1234567890ABCDEF', 
		encrypt_iv: 0, 
		encrypt_alg: 'des-ede3', 
		encrypt_autoPadding: true,
	};

server.use(restify.queryParser());
server.use(restify.bodyParser());

server.use(function(req,res,next){
	if(!/application\/xml/.test(req.headers['content-type']))
		return res.send(
					'<?xml version="1.0" encoding="utf-8"?>'+
					'<error>'+
						'<code>40100</code>' +
						'<message>head: "content-type: application/xml" missed.</message>' +
					'</error>'
				);
	req.body = req.body.toString();
	if(!/<message>.*<head>.*<\/head>.*<body>.*<\/body>.*<\/message>/.test(req.body))
		return res.send(
					'<?xml version="1.0" encoding="utf-8"?>'+
					'<error>'+
						'<code>40101</code>' +
						'<message>message format is not correct, some tag maybe missed.</message>' +
					'</error>'
				);
	next();
});

server.use(function(req,res,next){
	var encrypt = req.body.match(/<encrypt>(.*)<\/encrypt>/)[1];
	if(!/<bodymd>.*<\/bodymd>.*<body>.*<\/body>/.test(req.body))
		return res.send(
					'<?xml version="1.0" encoding="utf-8"?>'+
					'<error>'+
						'<code>40101</code>' +
						'<message>"bodymd" or "body" tag missed.</message>' +
					'</error>'
				);
	var messageid = req.body.match(/<messageid>(.*)<\/messageid>/)[1];
	var timestamp = req.body.match(/<timestamp>(.*)<\/timestamp>/)[1];
	var bodymd = req.body.match(/<bodymd>(.*)<\/bodymd>/)[1];
	if(encrypt == 1){
		var body = req.body.match(/<body>(.*)<\/body>/)[1];
		var md5 =crypto.createHash('md5').update(body).digest('hex');
	}else{
		var body = req.body.match(/<body>(.*)<\/body>/)[0];
		var md5 =crypto.createHash('md5').update(messageid + timestamp + body + '0123456789ABCDEF').digest('hex');
	}
	console.log('md5 verify: ');
	console.log(md5)
	if(bodymd != md5)
		return res.send(
					'<?xml version="1.0" encoding="utf-8"?>'+
					'<error>'+
						'<code>40103</code>' +
						'<message>bodymd is not correct.</message>' +
					'</error>'
				);
	next();
});

server.use(function(req,res,next){
	var encrypt = req.body.match(/<encrypt>(.*)<\/encrypt>/)[1];
	var encrypt_body = req.body.match(/<body>(.*)<\/body>/)[1];
	if(encrypt == 1){
		try{
			console.log('+++++')
			var decipher = crypto.createDecipher('des-ede-cbc','0123456789ABCDEF');
			decipher.setAutoPadding(true);
			console.log(encrypt_body.toString('hex'))
			var decrypt_body = decipher.update(encrypt_body, 'base64', 'utf8');
			decrypt_body += decipher.final('utf8');
			console.log(decrypt_body)
		}catch(e){
			console.log(e);
			return res.send(
						'<?xml version="1.0" encoding="utf-8"?>'+
						'<error>'+
							'<code>40105</code>' +
							'<message>decrpt error.</message>' +
						'</error>'
					);
		}
	}
	next();
});

server.use(function(req,res,next){
	var command = req.body.match(/<command>(.*)<\/command>/)[1];
	switch(command){
		case '1000': 
		case '1001': 
		case '1002': 
		case '1003': 
		case '1004': 
		case '1008': 
			next();
			break;
		default:
			return res.send(
					'<?xml version="1.0" encoding="utf-8"?>'+
					'<error>'+
						'<code>40110</code>' +
						'<message>command not supported.</message>' +
					'</error>'
				);	
	}
});

server.use(function(req,res,next){
	var encrypt = req.body.match(/<encrypt>(.*)<\/encrypt>/)[1];
	var messageid = req.body.match(/<messageid>(.*)<\/messageid>/)[1];
	var messageid_mine = options.merchantid  + '20121117' + messageid;
	req.body = req.body.replace(/<messageid>(.*)<\/messageid>/,'<message>' +messageid_mine + '</message>');	
	
	var md5;
	var messageid = messageid_mine;
	var timestamp = req.body.match(/<timestamp>(.*)<\/timestamp>/)[1];
	var bodymd = req.body.match(/<bodymd>(.*)<\/bodymd>/)[1];
	if(encrypt == 1){
		var body = req.body.match(/<body>(.*)<\/body>/)[1];
		md5 =crypto.createHash('md5').update(body).digest('hex');
	}else{
		var body = req.body.match(/<body>(.*)<\/body>/)[0];
		md5 =crypto.createHash('md5').update(messageid + timestamp + body + '0123456789ABCDEF').digest('hex');
	}
	console.log('md5 to lottery server: ');
	console.log(md5)
	req.body = req.body.replace(/<merchantid>(.*)<\/merchantid>/,'<merchantid>' + options.merchantid + '</merchantid>');
	req.body = req.body.replace(/<bodymd>(.*)<\/bodymd>/,'<bodymd>' + md5 + '<\/bodymd>');
	next();
});

// request
var request = require('request');
server.use(function(req,res,next){
	var command = req.body.match(/<command>(.*)<\/command>/)[1];
	request(
		{
			url: options.url + '/' + command,
			method: 'POST',
			headers:{
				'content-type': 'application/xml',
			},
			body: req.body
		},
		function(err,response){
			if(err)
				return res.send(
						'<?xml version="1.0" encoding="utf-8"?>'+
						'<error>'+
							'<code>30111</code>' +
							'<message>'+ err.message +'</message>' +
						'</error>'
					);
			res.locals = response.body;
			next();
		}
	);
});

server.use(function(req,res,next){
	var encrypt = res.locals.match(/<encrypt>(.*)<\/encrypt>/)[1];
	var messageid_mine = res.locals.match(/<messageid>(.*)<\/messageid>/)[1];
	var messageid = messageid_mine.substr(14);
	res.locals = res.locals.replace(/<messageid>(.*)<\/messageid>/,'<messageid>' +messageid + '</messageid>');	

	var md5;
	var messageid = messageid;
	var timestamp = res.locals.match(/<timestamp>(.*)<\/timestamp>/)[1];
	var bodymd = res.locals.match(/<bodymd>(.*)<\/bodymd>/)[1];
	if(encrypt == 1){
		var body = res.locals.match(/<body>(.*)<\/body>/)[1];
		md5 =crypto.createHash('md5').update(body).digest('hex');
	}else{
		var body = res.locals.match(/<body>(.*)<\/body>/)[0];
		md5 =crypto.createHash('md5').update(messageid + timestamp + body + '0123456789ABCDEF').digest('hex');
	}
	console.log('md5 for customer: ');
	console.log(md5)
	res.locals = res.locals.replace(/<bodymd>(.*)<\/bodymd>/,'<bodymd>' + md5 + '<\/bodymd>')
	next();
});

server.post('/api',function(req,res){
	res.set('content-type', 'text/plain');
	res.send(res.locals);
});	

server.post('/api/callback', function(req,res){
	req.body = req.body.toString();
	var command = req.body.match(/<command>(.*)<\/command>/)[1];
	request(
		{
			url: 'http://customer_callback_url',
			headers:{
				'content-type': 'application/xml',
			},
			method: 'POST',
			body: req.body, 
		}, 
		function(err,response){
			if(err)
				return res.send(
						'<?xml version="1.0" encoding="utf-8"?>'+
						'<error>'+
							'<code>30110</code>' +
							'<message>no response.</message>' +
						'</error>'
					);	
			res.send(response.body);
		}
	);
});

server.listen(config.server.PORT + 443, function() {
  console.log('%s listening at %s', server.name, server.url);
});
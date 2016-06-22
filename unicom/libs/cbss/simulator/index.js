var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();

//** create an http server
app.server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, '../casper/js')));

app.use('/post', function(req,res){
	var trunks = [];
	console.log('\n\n------headers-------\n\n');
	console.log(req.headers);
	console.log('\n\n------query-------\n\n');
	console.log(req.query);
	req.on('data', function(trunk){
		// console.log(trunk);
		trunks.push(trunk);
	});
	req.on('end', function(){
		console.log('\n\n------body-------\n\n');
		console.log(trunks.join('').toString());
	})
	res.end('ok!');
});

app.use('/custserv', function(req,res){
	var trunks = [];
	console.log('\n\n------headers-------\n\n');
	console.log(req.headers);
	console.log('\n\n------query-------\n\n');
	console.log(req.query);
	req.on('data', function(trunk){
		// console.log(trunk);
		trunks.push(trunk);
	});
	req.on('end', function(){
		console.log('\n\n------body-------\n\n');
		console.log(trunks.join('').toString());
	})
	res.end('ok!');
});

app.server.listen(9200, function() {
 console.log('---- start at port 9200 -----');
});

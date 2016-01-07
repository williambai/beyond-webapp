var soap = require('soap');
var path = require('path');
var async = require('async');

var soapClient;
var VMSS = {};

VMSS.soap = function(next) {
	if (soapClient) return next();
	// create soap client
	soap.createClient(
		path.join(__dirname, 'wsdl.xml'),
		function(err, client) {
			if (err) throw err;
			console.log('soapClient is created.');
			soapClient = client;
			next();
		}
	);
};

VMSS.soap2 = function(userName, userPawd, action, done) {
	async.series([
		function(callback){
			VMSS.soap(function(){
				callback();
			});
		},
		function(callback){
			VMSS.bind(userName, userPawd, callback);
		},
		action,
		function(callback){
			VMSS.unBind(userName, callback);
		},
	], function(err,results){
		done(err,results[2]);
	});
};

var binded = false;
VMSS.bind = function(userName, userPawd, callback) {
	if (binded) return callback();
	soapClient.bind({
		userName: userName,
		userPawd: userPawd,
	}, function(err, result) {
		if (err) return callback(err);
		binded = true;
		callback(err, result);
	});
};

VMSS.unBind = function(userName, callback) {
	if(!binded) return callback();
	soapClient.unBind({
		userName: userName
	}, function(err, result) {
		if (err) return callback(err);
		binded = false;
		callback(err, result);
	});
};

VMSS.sendProductBag = function(phones, seq_no, operUser, operPawd, code, Final_seq_id, Tastedate, callback) {
	if (typeof phones == 'string') phones = [phones];
	soapClient.sendProductBag({
		phones: phones,
		seq_no: seq_no,
		operUser: operUser,
		operPawd: operPawd,
		code: code,
		Final_seq_id: Final_seq_id,
		Tastedate: Tastedate
	}, callback);
};

VMSS.querySeqNo = function(seq_no, operUser, operPawd, btime, etime) {
	soapClient.querySeqNo({
		seq_no: seq_no,
		operUser: operUser,
		operPawd: operPawd,
		btime: btime,
		etime: etime,
	}, function(err, result) {
		console.log(result);
		callback(err, result);
	});
};

VMSS.queryResult = function(seq_no, usernumber, operUser, operPawd) {
	soapClient.queryResult({
		seq_no: seq_no,
		usernumber: usernumber,
		operUser: operUser,
		operPawd: operPawd
	}, function(err, result) {
		console.log(result);
		callback(err, result);
	});
};

exports = module.exports = VMSS;

//unit test
if (process.argv[1] === __filename) {
	var _ = require('underscore');
	var util = require('util');
	//** USE CASE 1
	VMSS.soap(function() {
		// console.log(_.keys(VMSS));
		// console.log(_.functions(VMSS));
		// console.log(_.keys(VMSS));
		// return;
		VMSS.bind('sp_jstz', 'sp_jstz', function(err, result) {
			if (err) return console.log(err);
			console.log(result);
			VMSS.unBind('sp_jstz', function(err, result) {
				if (err) return console.log(err);
				console.log(result);
			});
		});
	});

	//** USE CASE 2
	VMSS.soap(function(){
		async.series([
			function(callback){
				VMSS.bind('sp_jstz', 'sp_jstz', callback);
			},
			//action,
			function(callback){
				VMSS.unBind('sp_jstz', callback);
			},
		], function(err,results){
			if(err) return console.log(err);
			console.log(results);
		});	
	});

	//** USE CASE 3
	VMSS.soap2('sp_jstz', 'sp_jstz',function(callback){
		VMSS.queryResult('seq_no','usernumber', 'operUser', 'operPawd', callback);
	},function(err,result){
		if(err) return console.log(err);
		//** queryResult() 的返回结果
		console.log(result);
	});
}
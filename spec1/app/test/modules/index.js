var async = require('async');
var child = require('child_process');

var cwd = process.cwd();

async.waterfall(
	[
		function(callback){
			command = 'cd ' + __dirname ;
			command += ' && casperjs ./user.casper.js';
			command += ' && cd ' + cwd;
			child.exec(command,function(err,stdout,stderr){
				if(err) return callback(err);
				console.log(stdout);
				callback(null);
			});			
		},
		function(callback){
			command = 'cd ' + __dirname ;
			command += ' && casperjs ./confirm.casper.js';
			command += ' && cd ' + cwd;
			child.exec(command,function(err,stdout,stderr){
				if(err) return callback(err);
				console.log(stdout);
				callback(null);
			});			
		},
		function(callback){
			command = 'cd ' + __dirname ;
			command += ' && casperjs ./reset.casper.js';
			command += ' && cd ' + cwd;
			child.exec(command,function(err,stdout,stderr){
				if(err) return callback(err);
				console.log(stdout);
				callback(null);
			});			
		},
		function(callback){
			command = 'cd ' + __dirname ;
			command += ' && casperjs ./admin.casper.js';
			command += ' && cd ' + cwd;
			child.exec(command,function(err,stdout,stderr){
				if(err) return callback(err);
				console.log(stdout);
				callback(null);
			});			
		},
	],
	function(err,result){
		if(err) console.log(err);
	}
);
;
var async = require('async');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var cwd = process.cwd();

async.waterfall(
	[
		// function(callback){
		// 	command = 'cd ' + __dirname ;
		// 	command += ' && casperjs ./citic.casper.js';
		// 	command += ' && cd ' + cwd;
		// 	var child = exec(command,function(err,stdout,stderr){
		// 		if(err) return callback(err);
		// 		console.log(stdout);
		// 		console.log(stderr);
		// 		callback(null);
		// 	});	
		// 	child.stdout.pipe(process.stdout);
		// },
		function(callback){
			var child = spawn('casperjs',['./citic.casper.js'],{
				cwd: __dirname,
			});
			child.stdout.pipe(process.stdout);
			child.stdin.write('000000');
			child.stdin.write('\n');
			child.stdin.write('yes');
			child.stdin.write('\n');
			child.stdin.end();
			callback(null);
		},
	],
	function(err,result){
		if(err) console.log(err);
	}
);
;
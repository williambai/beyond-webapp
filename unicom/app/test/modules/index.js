var async = require('async');
var spawn = require('child_process').spawn;

async.waterfall(
	[
		function(callback){
			var child = spawn('casperjs',['./user.casper.js'],{
				cwd: __dirname,
			});
			child.stdout.on('end', function(){
				process.stdin.end();
				callback(null);
			});
			child.stdout.pipe(process.stdout);
			process.stdin.pipe(child.stdin);
		},
		function(callback){
			var child = spawn('casperjs',['./confirm.casper.js'],{
				cwd: __dirname,
			});
			child.stdout.on('end', function(){
				process.stdin.end();
				callback(null);
			});
			child.stdout.pipe(process.stdout);
			process.stdin.pipe(child.stdin);
		},
		function(callback){
			var child = spawn('casperjs',['./reset.casper.js'],{
				cwd: __dirname,
			});
			child.stdout.on('end', function(){
				process.stdin.end();
				callback(null);
			});
			child.stdout.pipe(process.stdout);
			process.stdin.pipe(child.stdin);
		},
		function(callback){
			var child = spawn('casperjs',['./admin.casper.js'],{
				cwd: __dirname,
			});
			child.stdout.on('end', function(){
				process.stdin.end();
				callback(null);
			});
			child.stdout.pipe(process.stdout);
			process.stdin.pipe(child.stdin);
		},
	],
	function(err,result){
		if(err) console.log(err);
	}
);
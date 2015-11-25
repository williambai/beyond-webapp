var async = require('async');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var cwd = process.cwd();

async.waterfall(
	[
		function(callback){
			var child = spawn('casperjs',['./citic.casper.js'],{
				cwd: __dirname,
			});
			child.stdout.on('end', function(){
				process.stdin.end();
				callback(null);
			});
			child.stdout.pipe(process.stdout);
			process.stdin.pipe(child.stdin);
			// child.stdin.write('000000');
			// child.stdin.write('\n');
			// child.stdin.write('111111');
			// child.stdin.write('\n');
			// child.stdin.write('yes');
			// child.stdin.write('\n');
			// child.stdin.end();
			// callback(null);
		},
	],
	function(err,result){
		if(err) console.log(err);
	}
);
;
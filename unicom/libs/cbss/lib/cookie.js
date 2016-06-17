/**
 * 刷新Cookie，保持登录状态
 * 
 */
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));

module.exports = exports = function(options, done){
	options = options || {};
	var trunks = [];
	var child = spawn(
			'casperjs',
			[
				'../casper/cookie.casper.js',
				'--ignore-ssl-errors=true',
				'--tempdir=' + path.resolve(options['cwd'], options['tempdir']),
				'--release=' + (options['release'] || false), //** 默认按开发模式运行
				'--staffId=' + options['staffId'],
			],{
				cwd: __dirname,
			}
		);

	child.on('error', function(err){
		logger.debug(err);
		done(err);
	});

	child.stderr.on('data', function(err){
		logger.debug(err);
		done(err);
	});

	child.stdout.on('data', function(data){
		trunks.push(data);
	});

	child.on('close', function(code){
		if(code != 0) return done('cookie.casper.js 非正常退出 code: ' + code);
		var data = trunks.join('').toString().replace(/\n/g,'');
		logger.debug('刷新cookie程序返回内容: ' + data);
		var responseJson = (data.match(/<response>(.*?)<\/response>/) || [])[1];
		var response = {};
		try{
			response = JSON.parse(responseJson || '{}');
		}catch(e){};
		done(null, response);
	});	

	child.stdout.pipe(process.stdout);
}
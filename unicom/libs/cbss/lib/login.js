/**
 * 账户登录
 */

var path = require('path');
var spawn = require('child_process').spawn;
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));

module.exports = exports = function(options, done){
	options = options || {};
	var commandExt = '';
	for(var key in options){
		if(key != 'cwd'){
			commandExt += ' --' + key + '=' + options[key];
		}
	}
	console.log(commandExt);
	var trunks = [];
	var child = spawn(
			'casperjs',
			[
				'../casper/login.casper.js',
				'--ignore-ssl-errors=true',
				commandExt,
			],{
				cwd: options.cwd || __dirname,
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
		if(code != 0) return done('login() 非正常退出 code: ' + code);
		var data = trunks.join('').toString().replace(/\n/g,'');
		logger.debug('自动登录程序返回内容: ' + data);
		if(/login:true/.test(data)){
			logger.debug('自动登录成功。')
			done(null,true);
		}else if(/login:false/.test(data)){
			logger.debug('自动登录失败。')
			done(null,false);
		}else{
			logger.debug('程序异常：自动登录业务异常。');
			done(null,false);
		}
	});
	child.stdout.pipe(process.stdout);
	process.stdin.pipe(child.stdin);
}
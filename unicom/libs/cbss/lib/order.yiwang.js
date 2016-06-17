/**
 * 流量产品订购
 * 
 */
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var captchaParser = require('../../captcha');

module.exports = exports = function(options, done){
	options = options || {};
	var trunks = [];

	var child = spawn(
			'casperjs',
			[
				'../casper/order.yiwang.casper.js',
				'--ignore-ssl-errors=true',
				'--tempdir=' + path.resolve(options['cwd'], options['tempdir']),
				'--release=' + (options.release || false), //** 默认按开发模式运行
				'--staffId=' + options.staffId,
				'--phone=' + options.phone,
				'--prod_name=' + options.product.name,
				'--prod_price=' + options.product.price,
				'--prod_code=' + options.product.barcode,
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
		//** 请求输入验证码
		if(/please input captcha verifyCode/.test(data.toString())){
			console.log(data.toString());
			//** 解析验证码
			var captchaImageFile = path.join(options.cwd, options.tempdir, '/' + options['user'] + '_captcha.jpg');
			if(fs.existsSync(captchaImageFile)){
				// captchaParser.getAllOcr(captchaImageFile, trainDataMap, function(err, result){
				captchaParser.getAllOcrSimple(captchaImageFile, function(err, result){
					console.log('captcha text: ' + result);
					//** 输入验证码
					child.stdin.write(result);
					child.stdin.write('\n');
				});
			}else{
				done('验证码文件不存在，分析验证码不能执行。');
			}
		}else if(/do you confirm, yes or no/.test(data.toString())){
			console.log(data.toString());
			//** 确认输入验证码
			child.stdin.write('yes');
			child.stdin.write('\n');
			child.stdin.end();
		}
		trunks.push(data);
	});

	child.on('close', function(code){
		if(code != 0) return done('order.yiwang.casper.js 非正常退出 code: ' + code);
		var data = trunks.join('').toString().replace(/\n/g,'');
		// logger.debug('流量订购程序返回内容: ' + data);
		var responseJson = (data.match(/<response>(.*?)<\/response>/) || [])[1];
		var response = {};
		try{
			response = JSON.parse(responseJson || '{}');
		}catch(e){};
		done(null, response);
	});	

	child.stdout.pipe(process.stdout);
}
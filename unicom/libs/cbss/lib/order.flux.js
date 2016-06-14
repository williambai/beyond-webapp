/**
 * 流量产品订购
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
				'../casper/order.flux.casper.js',
				'--ignore-ssl-errors=true',
				'--tempdir=' + path.resolve(options['cwd'], options['tempdir']),
				'--release=' + (options['release'] || false), //** 默认按开发模式运行
				'--staffId=' + options.staffId,
				'--phone=' + options.phone,
				'--prod_name=' + options.product.name,
				'--prod_price=' + options.product.price,
				'--prod_code=' + options.product.barcode,
				'--prod_zk=' + (options.product.zk || 100), //** 折扣 如 100,50
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
		if(code != 0) return done('order.flux.casper.js 非正常退出 code: ' + code);
		var data = trunks.join('').toString().replace(/\n/g,'');
		logger.debug('流量订购程序返回内容: ' + data);
		var responseJson = (data.match(/<response>(.*?)<\/response>/) || [])[1];
		var response = {};
		try{
			response = JSON.parse(responseJson || '{}');
		}catch(e){};
		done(null, response);
	});	

	child.stdout.pipe(process.stdout);
}
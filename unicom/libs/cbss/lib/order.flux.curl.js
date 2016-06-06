/**
 * 流量产品订购
 * 
 */
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var async = require('async');

module.exports = exports = function(options, done){
	options = options || {};
	async.waterfall(
		[
			function getCookies(callback){
				var cookies = '';
				var cookiesJson = fs.readFileSync(path.resolve(options['cwd'], options['tempdir'],'_cookie.txt'),{'encoding': 'utf8'});
				var cookiesArr = [];
				try{
					cookiesArr = JSON.parse(cookiesJson);
				}catch(e){

				}
				cookiesArr.forEach(function(cookie){
					cookies += cookie.name + '=' + (cookie.value || '') + ';';
				});
				callback(null,cookies.slice(0,-1));
			},
			function(cookies, callback){
				var trunks = [];
				var child = spawn(
						'curl',
						[
							'-v',
							'-k',
							'-A ' + 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
							'-e ' + 'https://gz.cbss.10010.com/essframe',
							'-b ' + cookies,
							// '-H Cookie: ' + cookies,
							'-H Accept: text/html, application/xhtml+xml, */*',
							'-H Accept-Language: zh-CN',
							'-H Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
							'-H Host: gz.cbss.10010.com',
							'-H Connection: Keep-Alive',
							'-H Cache-Control: no-cache',
							// '../casper/order.flux.casper.js',
							// '--ignore-ssl-errors=true',
							// '--tempdir=' + path.resolve(options['cwd'], options['tempdir']),
							// '--staffId=' + options.staffId,
							// '--phone=' + options.phone,
							// '--prod_name=' + options.product.name,
							// '--prod_price=' + options.product.price,
							// '--prod_code=' + options.product.barcode,
							'https://gz.cbss.10010.com/essframe?service=page/Header&LOGIN_LOG_ID=null',
						],{
							cwd: __dirname,
						}
					);

				child.on('error', function(err){
					logger.debug(err.toString());
					callback(err);
				});

				child.stderr.on('data', function(err){
					logger.debug(err.toString());
					callback(err);
				});

				child.stdout.on('data', function(data){
					logger.debug(data.toString());
					trunks.push(data);
				});

				child.on('close', function(code){
					if(code != 0) return callback('order.flux.casper.js 非正常退出 code: ' + code);
					var data = trunks.join('');
					fs.writeFileSync(path.resolve(options['cwd'], options['tempdir'],'_curl_nav.html'), data);
					callback(null, data);
				});	

				child.stdout.pipe(process.stdout);
			},
		],
		function(err,result){
			if(err) return done(err);
			return done(null,result);
		}
	);

}
/**
 * 开发测试入口
 * >casperjs index.test.js --ssl-protocol=any --ignore-ssl-errors=true
 * 
 */
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var async = require('async');
var spawn = require('child_process').spawn;
var cwd = process.cwd();

if(process.argv[1] == __filename){
	async.waterfall(
		[
			function autoLogin(callback){
				logger.debug('Cookie登录...');
				var trunks = [];
				var child = spawn(
					'casperjs',
					[
						'./cookie.test.casper.js',
					],{
						'cwd': __dirname,
					}
				);
				child.on('error', function(err){
					logger.debug(err);
					callback(err);
				});
				child.stderr.on('data', function(err){
					logger.debug(err);
					callback(err);
				});
				child.stdout.on('data', function(data){
					trunks.push(data);
				});
				child.on('close', function(code){
					if(code != 0) return callback('autoLogin()非正常退出 code: ' + code);
					var data = trunks.join('').toString().replace(/\n/g,'');
					logger.debug('Cookie登录程序返回内容: ' + data);
					if(/login:true/.test(data)){
						logger.debug('Cookie登录成功。')
						callback(null,true);
					}else if(/login:false/.test(data)){
						logger.debug('Cookie登录失败。')
						callback(null,false);
					}else{
						logger.debug('程序异常：cookie.test.casper.js程序异常。');
						callback('程序异常：cookie.test.casper.js程序异常。');
					}
				});
			},

			function login(autoLogin, callback){
				if(autoLogin) return callback(null,true);
				logger.debug('重新登录...');
				var trunks = [];
				var child = spawn(
						'casperjs',
						[
							'./login.test.casper.js'
						],{
							cwd: __dirname,
						}
					);
				child.on('error', function(err){
					logger.debug(err);
					callback(err);
				});
				child.stderr.on('data', function(err){
					logger.debug(err);
					callback(err);
				});
				child.stdout.on('data', function(data){
					trunks.push(data);
				});
				child.on('close', function(code){
					if(code != 0) return callback('login() 非正常退出 code: ' + code);
					var data = trunks.join('').toString().replace(/\n/g,'');
					logger.debug('自动登录程序返回内容: ' + data);
					if(/login:true/.test(data)){
						logger.debug('自动登录成功。')
						callback(null,true);
					}else if(/login:false/.test(data)){
						logger.debug('自动登录失败。')
						callback(null,false);
					}else{
						logger.debug('程序异常：是否已登录检查程序异常。');
						callback(null,false);
					}
				});
				child.stdout.pipe(process.stdout);
				process.stdin.pipe(child.stdin);
			},

			//** 检查当天委托订单
			function getTodayOrders(autoLogin, callback){
				if(!autoLogin) return callback('还没登录，请先登录。');
				logger.debug('获取当天全部委托订单...');
				var trunks = [];
				var child = spawn(
						'casperjs',
						[
							'./getTodayOrders.test.casper.js'
						],{
							cwd: __dirname,
						}
					);
				child.on('error', function(err){
					logger.debug(err);
					callback(err);
				});
				child.stderr.on('data', function(err){
					logger.debug(err);
					callback(err);
				});
				child.stdout.on('data', function(data){
					trunks.push(data);
				});
				child.on('close', function(code){
					if(code != 0) return callback('getTodayOrders() 非正常退出 code: ' + code);
					var data = trunks.join('').toString().replace(/\n/g,'');
					logger.debug('获取当天全部委托订单返回内容: ' + data);
					var regexp = new RegExp('/<orders>(.*)</orders>/');
					var orders = data.match(regexp) || ['',''];
					callback(null,orders[1]);
				});
				child.stdout.pipe(process.stdout);
				process.stdin.pipe(child.stdin);
			},

			//** 买股票
			// function buyOrder(autoLogin, callback){
			// 	if(!autoLogin) return callback('还没登录，请先登录。');
			// 	logger.debug('购买股票...');
			// 	var trunks = [];
			// 	var child = spawn(
			// 			'casperjs',
			// 			[
			// 				'./order.buy.test.casper.js',
			// 			],{
			// 				cwd: __dirname,
			// 			}
			// 		);
			// 	child.on('error', function(err){
			// 		logger.debug(err);
			// 		callback(err);
			// 	});
			// 	child.stderr.on('data', function(err){
			// 		logger.debug(err);
			// 		callback(err);
			// 	});
			// 	child.stdout.on('data', function(data){
			// 		trunks.push(data);
			// 	});
			// 	child.on('close', function(code){
			// 		if(code != 0) return callback('buyOrder() 非正常退出 code: ' + code);
			// 		var data = trunks.join('').toString().replace(/\n/g,'');
			// 		logger.debug('委托买入订单返回内容: ' + data);
			// 		if(/order_buy:true/.test(data)){
			// 			logger.debug('买入订单成功。')
			// 			callback(null,true);
			// 		}else if(/order_buy:false/.test(data)){
			// 			logger.debug('买入订单失败。')
			// 			callback(null,false);
			// 		}else{
			// 			logger.debug('程序异常：委托买入程序异常。');
			// 			callback(null,false);
			// 		}
			// 	});
			// 	child.stdout.pipe(process.stdout);
			// 	process.stdin.pipe(child.stdin);
			// },

		],
		function(err,result){
			if(err) logger.debug(err);
			logger.debug(result);
		}
	);	
};
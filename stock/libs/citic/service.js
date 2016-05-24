var ip_server = '127.0.0.1:8585';

var fs = require('fs');
var system = require('system');
var server = require('webserver').create();
var casper = require('casper').create({});
var login = require('./lib/login.casper');
var cookie = require('./lib/cookie.casper');
var logined;

(function startup(){
	console.log((new Date).toString() + ': 等待登录...');
	if(!login.start()) {
		return setTimeout(startup,30000);
	}
	console.log((new Date).toString() + ': 成功登录。');
	server.listen(ip_server, function(req,res){
		console.log(req.post);
		var action = req.post.action || '';
		switch(action){
			case 'keeplive': 
				break;
			case 'order_buy':
				break;
			case 'order_sale':
				break;
			default:
				break;	
		}
	});
	//** 定时刷新 cookie
	(function refreshCookie(){
		if(!cookie()){
			console.log((new Date).toString() + ': 重新登录。');
			//** 关闭服务
			server.close();
			setTimeout(startup, 5000);
		}else{
			console.log((new Date).toString() + ': 刷新Cookie成功。')
			setTimeout(refreshCookie, 3000000);
		}
	})();

	console.log('CITIC 服务(http://' + ip_server+ '/' + ')已启动。');
})();
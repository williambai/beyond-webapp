/**
 * 获取当天全部委托订单
 */
var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
	// clientScripts: ['jquery.js'],
	pageSettings: {
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false
	},
	timeout: 100000,
	waitTimeout: 30000,
	logLevel: "debug",
	verbose: true
});
phantom.cookiesEnabled = true;
//** load cookie
var data = fs.read('./_tmp/_cookie.txt') || "[]";
// console.log(data);

try {
	phantom.cookies = JSON.parse(data);
} catch (e) {
	console.error(e);
}
// console.log(JSON.stringify(phantom.cookies));

var response = {};

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('https://etrade.cs.ecitic.com/ymtrade/professional.jsp');

casper.then(function checkLogin(){
	this.waitFor(
		function(){
			return this.exists('#menuTD');
		},function signin(){
			response.status = '已登录';
		},function signout(){
			//** 未登录，退出
			response.status = '未登录';
			this.echo(JSON.stringify(response));
			this.exit();
		},2000);
});

casper.then(function getTodayEntrust(){
	this.open('https://etrade.cs.ecitic.com/ymtrade/trade/stockAction.do',{
		method: 'post',
		data: {
			method: 'getTodayEntrust'
		}
	});
});

casper.then(function getPageContent(){
	response.page = this.getPageContent();
});

casper.run(function(){
	this.echo(JSON.stringify(response));
	this.exit();
});
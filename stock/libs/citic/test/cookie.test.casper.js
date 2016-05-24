/**
 * http://docs.casperjs.org/en/latest/modules/clientutils.html#sendajax
 * http://stackoverflow.com/questions/26555777/how-to-stop-casperjs-execution-and-let-the-user-input-some-value-and-then-contin/26556151#26556151
 * http://stackoverflow.com/questions/28271522/sendajax-data-parameter-in-casperjs
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
	// logLevel: "debug",
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

//** save cookies
casper.then(function saveCookie(){
	var cookies = JSON.stringify(phantom.cookies);
	// this.echo(JSON.stringify(phantom.cookies));
	fs.write('./_tmp/_cookie.txt', cookies, 644);
});

casper.run(function(){
	this.echo(JSON.stringify(response));
	casper.exit();
});

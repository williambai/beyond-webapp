var casper = require('casper').create({
	// clientScripts: ['jquery.js'],
	pageSettings: {
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false
	},
	timeout: 100000,
	logLevel: "info",
	verbose: true
});
phantom.cookiesEnabled = true;

var fs = require('fs');
var system = require('system');
//load cookie
var data = fs.read('./_tmp/_cookie.txt') || "[]";
phantom.cookies = JSON.parse(data);
//load account
var account = '';//JSON.parse(fs.read('../../config/account.json') || "{}");
//captcha
var code = '';

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('https://portal.chinanetcenter.com/cas/login?service=https%3A%2F%2Fportal.chinanetcenter.com%2Fuuc%2Fr_sec_login',function(){
	this.wait(1000);
	this.captureSelector('./_tmp/captcha.png', 'img');
	this.capture('./_tmp/login.png');
});	

casper.run();
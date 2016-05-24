/**
 * 验证码动态测试
 * > casperjs index.test.casper.js --ignore-ssl-errors=true 
 * 
 */
var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
	pageSettings: {
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false,
		XSSAuditingEnabled: false,
	},
	timeout: 120000,
	waitTimeout: 10000,
	logLevel: "debug",
	verbose: true
});

phantom.cookiesEnabled = true;

//** load cookie
var data = fs.read('./_tmp/_cookie.txt') || "[]";
try {
	phantom.cookies = JSON.parse(data);
} catch (e) {
}
// console.log(JSON.stringify(phantom.cookies));

//** captcha
var verifyCode = '';

var response = {};

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('https://cbss.10010.com');

casper.then(function downloadCaptchaImage() {
	this.download('https://gz.cbss.10010.com/image?mode=validate&width=60&height=20', './_tmp/captcha.jpg');
});

casper.then(function getCaptchaImage(){
	response.file = './_tmp/captcha.jpg';
	response.base64 = this.base64encode(fs.read('./_tmp/captcha.jpg'));
});

//** save cookies
casper.then(function saveCookie(){
	var cookies = JSON.stringify(phantom.cookies);
	fs.write('./_tmp/_cookie.txt', cookies, 644);
});

casper.run(function(){
	this.echo(JSON.stringify(response));
	casper.exit();
});

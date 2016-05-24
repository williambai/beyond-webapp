/**
 * 登录
 * > casperjs login.test.casper.js
 * 
 */
var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
	pageSettings: {
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false
	},
	timeout: 120000,
	waitTimeout: 10000,
	logLevel: "debug",
	verbose: true
});
phantom.cookiesEnabled = true;

//load cookie
var data = fs.read('./_tmp/_cookie.txt') || "[]";
try {
	phantom.cookies = JSON.parse(data);
} catch (e) {
}
// console.log(JSON.stringify(phantom.cookies));

var account = {};
//** captcha
var code = '';

var response = {};

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('https://etrade.cs.ecitic.com/ymtrade/professional.jsp');


casper.then(function checkLogin(){
	this.waitFor(
		function(){
			return this.exists('#menuTD');
		},function signin(){
			response.status = '已登录';
			this.echo(JSON.stringify(response));
			this.exit();
		},function signout(){
			//** 未登录，退出
			response.status = '未登录';
		},2000);
});

casper.then(function openLoginPage(){
	casper.open('https://etrade.cs.ecitic.com/ymtrade/login/login.jsp?ssl=false&ftype=pro');
});

casper.then(function hasLoginForm() {
	this.waitForSelector('div.login_content_l');
	this.captureSelector('./_tmp/captcha.png','#captchaImage');
	this.echo('captcha.png has been download at: ./_tmp/captcha.png.','INFO');
});

casper.then(function inputCaptcha() {
	var confirm = '';
	while (confirm != 'yes') {
		this.echo('please input account username: ', 'INFO');
		account.username = system.stdin.readLine();
		this.echo('please input "' + account.username + '" password: ', 'INFO');
		account.password = system.stdin.readLine();
		this.echo('captcha.png has been download, please open ../_tmp/captcha.png and read the code.','INFO');
		this.echo('please input captcha code: ','INFO');
		code = system.stdin.readLine();
		this.echo('-------- inputs ------');
		this.echo('account: ' + account.username, 'INFO');
		this.echo('password: ' + account.password, 'INFO');
		this.echo('captcha code: ' + code, 'INFO');
		this.echo('----------------------');
		this.echo('do you confirm, yes or no?', 'WARNING');
		confirm = system.stdin.readLine();
	}
});

casper.then(function loginFormFill(){
	this.evaluate(function(username, password, vcode) {
		document.querySelector('select[name="inputtype"]').setAttribute('value','Z');
		document.querySelector('input[name="inputid"]').setAttribute('value', username);
		document.querySelector('input[name="trdpwd"]').setAttribute('value', password);
		document.querySelector('input[name="vcode"]').setAttribute('value', vcode);
	}, account.username, account.password, code);
	this.capture('./_tmp/login.png');
});

casper.then(function loginSubmit(){
	this.click('input#submit_btn');
});

casper.waitFor(function(){
	return casper.exists('#menuTD');
});

//** TODO why not running?
// casper.then(function checkLogin2(){
// 	this.waitFor(
// 		function(){
// 			return this.exists('#menuTD');
// 		},function signin2(){
// 			response.status = '已登录';
// 			response.login = true;
// 		},function signout2(){
// 			//** 未登录，退出
// 			response.status = '未登录';
// 			response.login = false;
// 		},10000);
// });

//** save cookies
casper.then(function saveCookie(){
	var cookies = JSON.stringify(phantom.cookies);
	fs.write('./_tmp/_cookie.txt', cookies, 644);
});

casper.run(function(){
	this.echo(JSON.stringify(response));
	casper.exit();
});

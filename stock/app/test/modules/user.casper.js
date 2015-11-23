var casper = require('casper').create({
	pageSettings: {
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: false,
		loadPlugins: false
	},
	logLevel: "info",
	verbose: true
});
phantom.cookiesEnabled = true;

//load cookie
var fs = require('fs');
var system = require('system');
var data = fs.read('../_tmp/_cookie.json') || "[]";
phantom.cookies = JSON.parse(data);

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('http://localhost:8091/index.html',function start(){

});

casper.thenBypassIf(function isLogin(){
	var brand = this.getHTML('.navbar-brand');
	return brand == '登录' ? false : true;
},4);

casper.then(function login() {
	this.waitForSelector('#loginForm');
});

casper.then(function fillLoginForm(){
	this.evaluate(function(email, password) {
		document.querySelector('input[name="email"]').setAttribute('value', email);
		document.querySelector('input[name="password"]').setAttribute('value', password);
	}, 'demo@appmod.cn', '123456');
	this.capture('../_tmp/user_login.png');
});

casper.then(function(){
	this.click('input[type="submit"]');
});

casper.then(function(){
	// require('utils').dump(phantom);
});

casper.then(function index() {
	// this.echo(JSON.stringify(phantom.cookies));
	this.open('http://localhost:8091/index.html#index', function() {
	});
	this.capture('../_tmp/user_index.png');
	var brand = this.getHTML('.navbar-brand');
	// this.echo(brand);
});

casper.then(function saveCookie(){
	// this.echo(JSON.stringify(phantom.cookies));
	var fs = require('fs');
	var cookies = JSON.stringify(phantom.cookies);
	fs.write('../_tmp/_cookie.json', cookies, 644);
});

casper.run();
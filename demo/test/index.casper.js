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

var fs = require('fs');
var system = require('system');
var data = fs.read('./_tmp/_cookie.txt') || "[]";
phantom.cookies = JSON.parse(data);

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('http://localhost:8080/index.html',function start(){

});

casper.thenBypassIf(function(){
	var brand = this.getHTML('.navbar-brand');
	return brand == '登录' ? false : true;
},6);

casper.then(function login() {
	casper.waitForSelector('#loginForm');
});

casper.then(function fillLoginForm(){
	this.evaluate(function(email, password) {
		document.querySelector('input[name="email"]').setAttribute('value', email);
		document.querySelector('input[name="password"]').setAttribute('value', password);
	}, 'pdb101@pdbang.cn', '123456');
	this.capture('./_tmp/login.png');
});

casper.thenClick('input[type="submit"]',function submitLoginForm(){
	// require('utils').dump(phantom);
});

casper.then(function saveCookie(){
	var fs = require('fs');
	var cookies = JSON.stringify(phantom.cookies);
	// this.echo(JSON.stringify(phantom.cookies));
	fs.write('./_tmp/_cookie.txt', cookies, 644);
});

casper.then(function reloadCookie(){
	var data = fs.read('./_tmp/_cookie.txt');
	phantom.cookies = JSON.parse(data);
});

casper.then(function index() {
	// this.echo(JSON.stringify(phantom.cookies));
	this.open('http://localhost:8080/index.html#index', function() {
		casper.waitForSelector('#hot');
	});
	this.capture('./_tmp/index.png');
	var brand = this.getHTML('.navbar-brand');
	// this.echo(brand);
});

casper.run();
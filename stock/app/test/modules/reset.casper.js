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

casper.start('http://localhost:8091/reset.html#reset/token/token1');

casper.then(function fillLoginForm(){
	this.capture('../_tmp/reset_reset.png');
});

casper.then(function saveCookie(){
	// this.echo(JSON.stringify(phantom.cookies));
	var fs = require('fs');
	var cookies = JSON.stringify(phantom.cookies);
	fs.write('../_tmp/_cookie.json', cookies, 644);
});

casper.run();
/**
 * http://stackoverflow.com/questions/26555777/how-to-stop-casperjs-execution-and-let-the-user-input-some-value-and-then-contin/26556151#26556151
 * @type {[type]}
 */
var fs = require('fs');
var system = require('system');
var server = require('webserver').create();
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
//** setup params
console.log(JSON.stringify(casper.cli.options));
var accountId = casper.cli.options['id'] || '';
var cookie = casper.cli.options['cookie'] || '';

phantom.cookiesEnabled = true;
phantom.cookies = cookie;

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');
// casper.then(function openprofessionalPage(){
// 	casper.open('https://etrade.cs.ecitic.com/ymtrade/professional.jsp');
// });

// casper.then(function(){
// 	// this.echo(this.getHTML());
// 	this.capture('../_tmp/professional3.png');
// });

casper.start('https://etrade.cs.ecitic.com/ymtrade/professional.jsp');
casper.then(function(){
	if(this.exists('#menuTD')){
		this.echo('status=200;id='+ accountId + ';cookie=' + phantom.cookies).exit();
	}else{
		this.echo('status=401;id='+ accountId + ';errmsg="did not login."').exit();
	}
});
casper.run();

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
casper.start('https://portal.chinanetcenter.com/cas');
console.log('status=200;id='+ accountId +';order=true' + ';cookie=' + phantom.cookies);
casper.run();

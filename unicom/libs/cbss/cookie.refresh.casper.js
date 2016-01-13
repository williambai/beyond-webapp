/**
 * http://docs.casperjs.org/en/latest/modules/clientutils.html#sendajax
 * http://stackoverflow.com/questions/26555777/how-to-stop-casperjs-execution-and-let-the-user-input-some-value-and-then-contin/26556151#26556151
 * http://stackoverflow.com/questions/28271522/sendajax-data-parameter-in-casperjs
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
var cookie = casper.cli.options['cookie'] || '[]';
var refresh_url = casper.cli.options['refresh_url'] || '';

var cookies = [];
try {
	cookies = JSON.parse(cookie);
} catch (e) {

}
// console.log(JSON.stringify(cookies));
phantom.cookiesEnabled = true;
phantom.cookies = cookies;

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('https://portal.chinanetcenter.com/cas/');

casper.then(function(){
	casper.wait(2000);
});

casper.then(function() {
	//** login?
	var success = false;
	if (casper.exists('#menuTD')) {
		success = true;
	}
	casper.evaluate(function(url, accountId, cookies, success) {
		__utils__.sendAJAX(url, 'POST', {
			action: 'updateCookie',
			id: accountId,
			cookies: cookies,
			success: success
		}, false);
	}, refresh_url, accountId, JSON.stringify(phantom.cookies || []), success);
});

casper.run();
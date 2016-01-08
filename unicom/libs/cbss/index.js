/**
 * http://stackoverflow.com/questions/26555777/how-to-stop-casperjs-execution-and-let-the-user-input-some-value-and-then-contin/26556151#26556151
 * @type {[type]}
 */
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
var server = require('webserver').create();
//load cookie
var data = fs.read('./_tmp/_cookie.txt') || "[]";
phantom.cookies = JSON.parse(data);
//load account
var account = '';//JSON.parse(fs.read('../../config/account.json') || "{}");

//captcha
var code = '';
var captchaFile = './_tmp/captcha.png';

var continues = false; // abort the neverendingWait
var neverendingWait = function() {
	if (!continues)
		this.wait(5000, neverendingWait);
};

casper.checkCaptcha = function(captchaFile, phantomPort, captchaParseUrl) {
	// here the CAPTCHA is saved to disk but it can also be set directly if captured through casper.captureBase64
	// this.captureSelector(captchaFile, 'img');
	// this.capture('./_tmp/login.png');

	// send request to the secondary program from the page context
	this.evaluate(function(file, captchaParseUrl) {
		__utils__.sendAJAX(captchaParseUrl, 'POST', {
			file: file
		}, true);
	}, captchaFile, captchaParseUrl);

	// start the server to receive solved CAPTCHAs
	server.listen(phantomPort, {
		'keepAlive': true
	}, function(request, response) {
		console.log('Request received at ' + new Date());
		// console.log(request.url);
		// console.log(request.post.result);
		// console.log(request.postRaw);
		// response.statusCode = 200;
		// response.headers = {
		// 	'Cache': 'no-cache',
		// 	'Content-Type': 'text/plain;charset=utf-8'
		// };
		// response.write('');
		// response.close();
		// server.close();
		// continues = true; // abort the neverendingWait
		// return;

		if (request.post) { // is there a response?
			casper.then(function() {
				//** check if it is correct by reading request.post ...
				var correct = request.post.result == 'ok' ? true : false;

				if (!correct) {
					response.statusCode = 404;
					response.headers = {
						'Cache': 'no-cache',
						'Content-Type': 'text/plain;charset=utf-8'
					};
					response.write('');
					response.close();
					server.close();
					casper.checkCaptcha(captchaFile, phantomPort, captchaParseUrl);
				} else {
					console.log('captcha text is received: ' + request.post.result);
					response.statusCode = 200;
					response.headers = {
						'Cache': 'no-cache',
						'Content-Type': 'text/plain;charset=utf-8'
					};
					response.write('');
					response.close();
					server.close();
					continues = true; // abort the neverendingWait
				}
			});
		} else {
			response.statusCode = 404;
			response.headers = {
				'Cache': 'no-cache',
				'Content-Type': 'text/plain;charset=utf-8'
			};
			response.write('');
			response.close();
			server.close();
			casper.checkCaptcha(captchaFile, phantomPort, captchaParseUrl);
		}
	});
	return this;
};

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');
casper.start('https://portal.chinanetcenter.com/cas/login?service=https%3A%2F%2Fportal.chinanetcenter.com%2Fuuc%2Fr_sec_login');

casper.then(function() {
	this.checkCaptcha(captchaFile, 8084, 'http://localhost:8092/captchas');
}).then(neverendingWait);

// casper.then(function(){
//     // Do something here when the captcha is successful
// });

casper.run();
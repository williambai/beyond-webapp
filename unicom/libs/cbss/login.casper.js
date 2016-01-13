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
var callbackUrl = casper.cli.options['callback_url'] || 'http://localhost:8092/cbss/accounts';
var captchaFile = casper.cli.options['captcha_file'] || './_tmp/captcha.png';
var loginFile = casper.cli.options['login_file'] || './_tmp/login.png';
var serverPort = casper.cli.options['server_port'] || 8084;

// start the server to receive solved CAPTCHAs
server.listen(serverPort, {
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
		var action = request.post.action || '';
		if(action == 'login'){
			casper.then(function() {
				//** check if it is correct by reading request.post ...
				var username = request.post.username || '';
				var password = request.post.password || '';
				var captcha = request.post.captcha || '';

				if (!(username && password && captcha)) {
					response.statusCode = 404;
					response.headers = {
						'Cache': 'no-cache',
						'Content-Type': 'text/plain;charset=utf-8'
					};
					response.write('');
					response.close();
					server.close();
					casper.checkCaptcha();
				} else {
					console.log('captcha text is received: ' + request.post);
					response.statusCode = 200;
					response.headers = {
						'Cache': 'no-cache',
						'Content-Type': 'text/plain;charset=utf-8'
					};
					response.write('');
					response.close();
					//** do login
					casper.evaluate(function(username,password,captcha){
						document.querySelector('input[name="username"]').setAttribute('value',username);
						document.querySelector('input[name="password"]').setAttribute('value',password);
						document.querySelector('input[name="jcaptcha"]').setAttribute('value',captcha);
					},username,password,captcha);

					casper.capture(loginFile);
					//** submit login
					casper.then(function(){
						casper.click('input#submit_btn');
					});
					
					casper.wait(2000);

					casper.then(function(){
						var success = false;
						if(casper.exists('#menuTD')){
							success = true;
						}
						casper.evaluate(function(url,accountId, cookies, success){
							__utils__.sendAJAX(url,'POST', {
								action: 'updateCookie',
								id: accountId,
								cookies: cookies,
								success: success
							},false);
						},callbackUrl,accountId,JSON.stringify(phantom.cookies),success);					
					});
					//** close
					casper.then(function(){
						server.close();
						continues = true; // abort the neverendingWait
					});
				}
			});
		}
	} else {
		response.statusCode = 404;
		response.headers = {
			'Cache': 'no-cache',
			'Content-Type': 'text/plain;charset=utf-8'
		};
		response.write('');
		response.close();
		server.close();
		casper.checkCaptcha();
	}
});

phantom.cookiesEnabled = true;
//load cookie
var data = "[]"; //fs.read('./_tmp/_cookie.txt') || "[]";
phantom.cookies = JSON.parse(data);
//load account
var account = '';//JSON.parse(fs.read('../../config/account.json') || "{}");

//captcha
var code = '';

var continues = false; // abort the neverendingWait
var neverendingWait = function() {
	if (!continues)
		this.wait(5000, neverendingWait);
};

casper.checkCaptcha = function() {
	// here the CAPTCHA is saved to disk but it can also be set directly if captured through casper.captureBase64
	this.captureSelector(captchaFile, 'img');
	this.capture(loginFile);

	// send request to the secondary program from the page context
	this.evaluate(function(url,file, accountId) {
		__utils__.sendAJAX(url, 'POST', {
			action: 'uploadImage',
			file: file,
			id: accountId,
		}, false);
	}, callbackUrl, captchaFile, accountId);
	return this;
};


casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');
casper.start('https://portal.chinanetcenter.com/cas/login?service=https%3A%2F%2Fportal.chinanetcenter.com%2Fuuc%2Fr_sec_login');

casper.then(function() {
	this.checkCaptcha();
});

casper.then(neverendingWait);

casper.run();
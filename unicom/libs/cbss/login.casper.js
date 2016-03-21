/**
 * http://stackoverflow.com/questions/26555777/how-to-stop-casperjs-execution-and-let-the-user-input-some-value-and-then-contin/26556151#26556151
 * @type {[type]}
 * --ignore-ssl-errors=true
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
//** 默认http headers
var headers = {
	'Accept-Language': 'zh-CN',
	'Accept': 'text/html, application/xhtml+xml, */*',
	'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
	'Connection': 'Keep-Alive',
	'Host': 'cbss.10010.com',
};
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
		if (action == 'login') {
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
					casper.evaluate(function(username, password, captcha) {
						//** 设置用户名
						document.querySelector('#STAFF_ID').setAttribute('value', username);
						//** 设置密码
						document.querySelector('#LOGIN_PASSWORD').setAttribute('value', password);
						//** 设置省份代码，湖北:17
						var provinceObj = document.getElementById('LOGIN_PROVINCE_CODE');
						provinceObj.options[17].selected = true;
						//** 设置验证码
						document.querySelector('#VERIFY_CODE').setAttribute('value', captcha);
					}, username, password, captcha);

					//** 查看登录界面表单填写是否正确
					casper.capture(loginFile);
					//** 提交登录表单
					casper.then(function(){
						// casper.evaluate(function(){
						// 	// document.querySelector('form[name="Form0"]').submit();
						// 	document.querySelector('input[type="button"]').click();
						// });
						casper.click('input[type="button"]');
					});

					casper.wait(2000);
					//** 获取登录成功界面
					casper.capture(loginFile);
					//** 返回cookies
					casper.then(function() {
						var success = false;
						// if (casper.exists('#menuTD')) {
						// 	success = true;
						// }
						casper.evaluate(function(url, accountId, cookies, success) {
							__utils__.sendAJAX(url, 'POST', {
								action: 'updateCookie',
								id: accountId,
								cookies: cookies,
								success: success
							}, false);
						}, callbackUrl, accountId, JSON.stringify(phantom.cookies), success);
					});
					//** close
					casper.then(function() {
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
var account = ''; //JSON.parse(fs.read('../../config/account.json') || "{}");

//captcha
var code = '';

var continues = false; // abort the neverendingWait
var neverendingWait = function() {
	if (!continues)
		this.wait(5000, neverendingWait);
};

casper.checkCaptcha = function() {
	//** 下载验证码图片
	this.download('https://hb.cbss.10010.com/image?mode=validate&width=60&height=20', captchaFile);
	//** 查看登录界面是否正确显示
	this.capture(loginFile);

	//** send request to the secondary program from the page context
	this.evaluate(function(url, file, accountId) {
		__utils__.sendAJAX(url, 'POST', {
			action: 'uploadImage',
			file: file,
			id: accountId,
		}, false);
	}, callbackUrl, captchaFile, accountId);
	return this;
};


casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko');

casper.on("resource.error", function(resourceError) {
	console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
	console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
});

//** 启动
casper.start('https://cbss.10010.com/essframe', {
		method: 'get',
		headers: headers,
	});

casper.then(function() {
	this.evaluate(function() {
		//** 显示登录主界面
		document.querySelector('div#main').setAttribute('style', 'display:block');
		//** 隐藏ssl错误内容
		document.querySelector('div#dmsg2').setAttribute('style', 'display:none');
	});
	this.click('img#captureImage');
	this.click('input[type="button"]');
	this.wait(1000);
	this.capture('./_tmp/index.png');
	// this.download('https://hb.cbss.10010.com/image?mode=validate&width=60&height=20','./_tmp/captcha.png');
	// this.captureSelector('./_tmp/captchaImage.png','div#VerifyPart2');//img#captureImage');
	//** 调试登录页面
	// this.echo(this.getHTML());
	// this.echo(this.getHTML('div#main'));
});

// casper.then(function() {
// 	this.checkCaptcha();
// });

// casper.then(neverendingWait);

casper.run();
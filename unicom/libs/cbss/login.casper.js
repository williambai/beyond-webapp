/**
 * http://stackoverflow.com/questions/26555777/how-to-stop-casperjs-execution-and-let-the-user-input-some-value-and-then-contin/26556151#26556151
 * @type {[type]}
 * --ignore-ssl-errors=true
 */
var fs = require('fs');
var system = require('system');
var server = require('webserver').create();
var casper = require('casper').create({
	clientScripts: [
		// 'jquery.js'
	],
	pageSettings: {
		userAgent: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		localToRemoteUrlAccessEnabled: false,
		loadPlugins: false,
		XSSAuditingEnabled: false,
	},
	// viewportSize: {width: 800, height: 600},//** 视图大小
	timeout: 100000,
	logLevel: "debug",
	verbose: true
});
//** setup params
console.log(JSON.stringify(casper.cli.options));
var accountId = casper.cli.options['id'] || '';
var callbackUrl = casper.cli.options['callback_url'] || 'http://localhost:8092/protect/cbss/accounts';
var captchaFile = casper.cli.options['captcha_file'] || './_tmp/captcha.png';
var loginFile = casper.cli.options['login_file'] || './_tmp/login.png';
var serverPort = casper.cli.options['server_port'] || 8084;

// start the server to receive solved CAPTCHAs
server.listen(serverPort, {
	'keepAlive': true
}, function(request, response) {
	console.log('casper webserver 收到请求时间： ' + (new Date).toString());
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
			console.log('capser webserver 收到数据: ' + JSON.stringify(request.post));
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
				//** 有登录具备的条件，准备登录
				casper.then(function() {
					response.statusCode = 200;
					response.headers = {
						'Cache': 'no-cache',
						'Content-Type': 'text/plain;charset=utf-8'
					};
					response.write('');
					response.close();
					//** 填写登录表单
					casper.then(function(){
						casper.fill('form',{
							"$FormConditional": "F",
							"$FormConditional$0": "T",
							"$FormConditional$1": "T",
							"$FormConditional$2": "T",
							"$FormConditional$3": "F",
							"$FormConditional$4": "F",
							"$FormConditional$5": "F",
							"AUTH_TYPE": "0",
							"CAPTURE_URL": "/image?mode=validate&width=60&height=20",
							"Form0": "LOGIN_PROVINCE_REDIRECT_URL,AUTH_TYPE,CAPTURE_URL,WHITE_LIST_LOGIN,IPASS_LOGIN,IPASS_SERVICE_URL,IPASS_LOGIN_PROVINCE,IPASS_LOGINOUT_DOMAIN,SIGNATURE_CODE,SIGNATURE_DATA,IPASS_ACTIVATE,STAFF_ID,$FormConditional,$FormConditional$0,LOGIN_PROVINCE_CODE,$FormConditional$1,$FormConditional$2,$FormConditional$3,$FormConditional$4,$FormConditional$5,$TextField,$TextField$0,$TextField$1,$TextField$2,$TextField$3,$TextField$4,$TextField$5,$TextField$6,$TextField$7,$TextField$8,$TextField$9,$TextField$10,$TextField$11,$TextField$12,$TextField$13,$TextField$14,$TextField$15,$TextField$16,$TextField$17,$TextField$18,$TextField$19,$TextField$20,$TextField$21,$TextField$22,$TextField$23,$TextField$24,$TextField$25,$TextField$26,$TextField$27,$TextField$28,$TextField$29,$TextField$30,$TextField$31",
							"IPASS_ACTIVATE": "",
							"IPASS_LOGIN": "",
							"IPASS_LOGINOUT_DOMAIN": "",
							"IPASS_LOGIN_PROVINCE": "",
							"IPASS_SERVICE_URL": "",
							"LOGIN_PASSWORD": password,
							"LOGIN_PROVINCE_CODE": "71",
							"LOGIN_PROVINCE_REDIRECT_URL": "https://hb.cbss.10010.com/essframe",
							"SIGNATURE_CODE": "",
							"SIGNATURE_DATA": "",
							"STAFF_ID": username,
							"VERIFY_CODE": captcha,
							"WHITE_LIST_LOGIN": "",
							"service": "direct/1/Home/$Form",
							"sp": "S0"
						});
					});
					// casper.evaluate(function(username, password, captcha) {
					// 	//** 设置用户名
					// 	document.querySelector('input[name="STAFF_ID"]').setAttribute('value', username);
					// 	//** 设置密码
					// 	document.querySelector('#LOGIN_PASSWORD').setAttribute('value', password);
					// 	//** 设置省份代码，湖北:17
					// 	var provinceObj = document.getElementById('LOGIN_PROVINCE_CODE');
					// 	provinceObj.options[17].selected = true;
					// 	//** 设置验证码
					// 	document.querySelector('#VERIFY_CODE').setAttribute('value', captcha);
					// }, username, password, captcha);
				});
				//** 提交登录表单
				casper.then(function(){
					casper.wait(1000);
					//** 查看登录界面表单填写是否正确
					casper.echo('核查登录表单数据：' + JSON.stringify(casper.getFormValues('form')));
					// casper.capture(loginFile);
					// casper.evaluate(function(){
					// 	// document.querySelector('form[name="Form0"]').submit();
					// 	document.querySelector('input[type="button"]').click();
					// });
					this.mouseEvent('click','input[type="button"]');
					casper.wait(2000);
				});
				//** 获取登录成功(主页)界面
				casper.then(function(){
					casper.wait(2000);
					// casper.echo(casper.getHTML());
					casper.capture(loginFile + '_after.png');
				});
				//** 返回cookies
				casper.then(function() {
					casper.echo('login cookies:' + JSON.stringify(phantom.cookies));
					casper.echo(casper.getHTML());
					casper.download(casper.getHTML(),'./_tmp/home.html');
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

casper.on("resource.error", function(resourceError) {
	console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
	console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
});

//** http headers
var headers = {
	'Accept-Language': 'zh-CN',
	'Accept': 'text/html, application/xhtml+xml, */*',
	'Connection': 'Keep-Alive',
	'Host': 'cbss.10010.com',
};
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
	this.wait(1000);
	this.capture(loginFile);
	// this.download('https://hb.cbss.10010.com/image?mode=validate&width=60&height=20','./_tmp/captcha.png');
	// this.captureSelector('./_tmp/captchaImage.png','div#VerifyPart2');//img#captureImage');
	//** 调试登录页面
	// this.echo(this.getHTML());
	// this.echo(this.getHTML('div#main'));
});

casper.then(function() {
	this.checkCaptcha();
});

casper.then(neverendingWait);

casper.run();
/**
 * 登录
 * > casperjs login.test.casper.js --ignore-ssl-errors=true 
 * 
 */
var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
	pageSettings: {
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false,
		XSSAuditingEnabled: false,
	},
	timeout: 120000,
	waitTimeout: 10000,
	logLevel: "debug",
	verbose: true
});

phantom.ignoreSslErrors = true;
phantom.cookiesEnabled = true;

//** setup params
console.log(JSON.stringify(casper.cli.options));
var tempdir = casper.cli.options['tempdir'] || './_tmp';
var account = {
	username: casper.cli.options['user'] || '',
	password: casper.cli.options['pass'] || '',
	provinceId: casper.cli.options['provid'] || '',
};

//load cookie
var cookie_file = tempdir + '/' + account.username + '_cookie.txt';
if(fs.exists(cookie_file)){
	var data = fs.read(cookie_file) || "[]";
	try {
		phantom.cookies = JSON.parse(data);
	} catch (e) {
	}
	// console.log(JSON.stringify(phantom.cookies));
}

//** captcha
var verifyCode = '';

var response = {};

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('https://cbss.10010.com/essframe');


casper.then(function checkLogin(){
	this.waitFor(
		function(){
			return this.exists('#menuTD');
		},function signin(){
			response.status = '已登录';
			this.echo('<response>' + JSON.stringify(response) + '</response>');
			this.exit();
		},function signout(){
			//** 未登录，退出
			response.status = '未登录';
		},2000);
});

casper.then(function openLoginPage(){
	casper.open('https://cbss.10010.com');
});

casper.then(function downloadCaptchaImage() {
	this.download('https://gz.cbss.10010.com/image?mode=validate&width=60&height=20', tempdir + '/'+ account.username + '_captcha.jpg');
});

casper.then(function inputCaptcha() {
	var confirm = '';
	while (confirm != 'yes') {
		// this.echo('please input account username: ', 'INFO');
		// account.username = system.stdin.readLine();
		// this.echo('please input "' + account.username + '" password: ', 'INFO');
		// account.password = system.stdin.readLine();
		// this.echo('please input "' + account.username + '" province id: ', 'INFO');
		// account.provinceId = system.stdin.readLine();
		this.echo('captcha.png has been download, please open ../_tmp/'+ account.username + '_captcha.jpg and read the verifyCode.','INFO');
		this.echo('please input captcha verifyCode: ','INFO');
		verifyCode = system.stdin.readLine();
		this.echo('-------- inputs ------');
		this.echo('account: ' + account.username, 'INFO');
		this.echo('password: ' + account.password, 'INFO');
		this.echo('provinceId: ' + account.provinceId, 'INFO');
		this.echo('captcha verifyCode: ' + verifyCode, 'INFO');
		this.echo('----------------------');
		this.echo('do you confirm, yes or no?', 'WARNING');
		confirm = system.stdin.readLine();
	}
});

casper.then(function proxyLoginSubmit(){
	this.open('https://gz.cbss.10010.com/essframe?service=page/LoginProxy&login_type=redirectLogin', {
		method: 'post',
		headers: {
			"Accept": "text/html, application/xhtml+xml, */*",
			"Referer": "https://cbss.10010.com/essframe",
			"Accept-Language": "zh-CN",
			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
			"Content-Type":"application/x-www-form-urlencoded",
			"Host":"gz.cbss.10010.com",
			"Connection":"Keep-Alive",
			"Cache-Control":"no-cache",
		},
		encoding: 'utf8',
		data: {
			"service": "direct/1/Home/$Form",
			"sp": "S0",
			"Form0": "LOGIN_PROVINCE_REDIRECT_URL,AUTH_TYPE,CAPTURE_URL,WHITE_LIST_LOGIN,IPASS_LOGIN,IPASS_SERVICE_URL,IPASS_LOGIN_PROVINCE,IPASS_LOGINOUT_DOMAIN,SIGNATURE_CODE,SIGNATURE_DATA,IPASS_ACTIVATE,STAFF_ID,$FormConditional,$FormConditional$0,LOGIN_PROVINCE_CODE,$FormConditional$1,$FormConditional$2,$FormConditional$3,$FormConditional$4,$FormConditional$5,$TextField,$TextField$0,$TextField$1,$TextField$2,$TextField$3,$TextField$4,$TextField$5,$TextField$6,$TextField$7,$TextField$8,$TextField$9,$TextField$10,$TextField$11,$TextField$12,$TextField$13,$TextField$14,$TextField$15,$TextField$16,$TextField$17,$TextField$18,$TextField$19,$TextField$20,$TextField$21,$TextField$22,$TextField$23,$TextField$24,$TextField$25,$TextField$26,$TextField$27,$TextField$28,$TextField$29,$TextField$30",
			"$FormConditional": "F",
			"$FormConditional$0": "T",
			"$FormConditional$1": "T",
			"$FormConditional$2": "T",
			"$FormConditional$3": "F",
			"$FormConditional$4": "F",
			"$FormConditional$5": "F",
			"LOGIN_PROVINCE_REDIRECT_URL": "https://gz.cbss.10010.com/essframe",
			"AUTH_TYPE": "0",
			"CAPTURE_URL": "/image?mode=validate",
			"width": "60",
			"height": "20",
			"WHITE_LIST_LOGIN": "",
			"IPASS_LOGIN": "",
			"IPASS_SERVICE_URL": "",
			"IPASS_LOGIN_PROVINCE": "",
			"IPASS_LOGINOUT_DOMAIN": "",
			"SIGNATURE_CODE": "",
			"IPASS_ACTIVATE": "",
			"STAFF_ID": account.username,
			"LOGIN_PASSWORD": account.password,
			"LOGIN_PROVINCE_CODE": account.provinceId,
			"VERIFY_CODE": verifyCode,
		}
	});
});

casper.then(function loginSubmit(){
	this.open('https://gz.cbss.10010.com/essframe', {
		method: 'post',
		headers: {
			"Accept": "text/html, application/xhtml+xml, */*",
			"Referer": "https://gz.cbss.10010.com/essframe?service=page/LoginProxy&login_type=redirectLogin",
			"Accept-Language": "zh-CN",
			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
			"Content-Type":"application/x-www-form-urlencoded",
			"Host":"gz.cbss.10010.com",
			"Connection":"Keep-Alive",
			"Cache-Control":"no-cache",
		},
		encoding: 'gbk',
		data: {
			"service": "direct/1/LoginProxy/$Form",
			"sp": "S0",
			"Form0": "ACTION_MODE,STAFF_ID,LOGIN_PASSWORD,NEED_SMS_VERIFY,SUBSYS_CODE,LOGIN_TYPE,authDomainType,soap,menuId,error,authType,LOGIN_PROVINCE_CODE,VERIFY_CODE,WHITE_LIST_LOGIN,IPASS_SERVICE_URL,IPASS_CHECK_MESSAGE,IPASS_LOGIN_PROVINCE,SIGNATURE_CODE,SIGNATURE_DATA,IPASS_LOGIN,IPASS_ACTIVATE,NEED_INSTALL_CERT,IPASS_INSTALL_RESULT,IPASS_INSTALL_MESSAGE,IPASS_LOGINOUT_DOMAIN,btnProxyLogin",
			"ACTION_MODE": "",
			"STAFF_ID": account.username,
			"LOGIN_PASSWORD": account.password,
			"NEED_SMS_VERIFY": "",
			"SUBSYS_CODE": "",
			"LOGIN_TYPE": "redirectLogin",
			"authDomainType": "",
			"soap": "",
			"menuId": "",
			"error": "",
			"authType": "",
			"LOGIN_PROVINCE_CODE": account.provinceId,
			"VERIFY_CODE": verifyCode,
			"WHITE_LIST_LOGIN": "",
			"IPASS_SERVICE_URL": "",
			"IPASS_CHECK_MESSAGE": "",
			"IPASS_LOGIN_PROVINCE": "",
			"SIGNATURE_CODE": "",
			"SIGNATURE_DATA": "",
			"IPASS_LOGIN": "",
			"IPASS_ACTIVATE": "",
			"NEED_INSTALL_CERT": "",
			"IPASS_INSTALL_RESULT": "",
			"IPASS_INSTALL_MESSAGE": "",
			"IPASS_LOGINOUT_DOMAIN": "",
			"btnProxyLogin": "提交查询内容",
		}
	});
});

casper.then(function checkLogin(){
	var homePageHtml = this.getHTML();
	fs.write(tempdir + '/home.html', homePageHtml, 644);
	// homePageMeta =
	//     RegexUtils.regexMathes(".*(<meta.*provinceId.*?>).*",
	//         homePageHtml);
	var homePageMeta = homePageHtml.match(/<meta.*provinceId.*?>/i);
	if(homePageMeta){
		//** 已登录
	    response.login = true;
	    response.message = '登录页参数获取成功！';
	    response.meta = homePageMeta;
		fs.write(tempdir + '/_homeMeta.txt', homePageMeta, 644);
	}else{
		//** 未登录
	    response.login = false;
	    response.message = '登录页参数获取失败！';
	}
});

//** save cookies
casper.then(function saveCookie(){
	var cookies = JSON.stringify(phantom.cookies);
	fs.write(cookie_file, cookies, 644);
});

casper.run(function(){
	this.echo('<response>' + JSON.stringify(response) + '</response>');
	casper.exit(0);
	casper.bypass(99);
});

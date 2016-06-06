/**
 * http://docs.casperjs.org/en/latest/modules/clientutils.html#sendajax
 * http://stackoverflow.com/questions/26555777/how-to-stop-casperjs-execution-and-let-the-user-input-some-value-and-then-contin/26556151#26556151
 * http://stackoverflow.com/questions/28271522/sendajax-data-parameter-in-casperjs
 * 
 * > casperjs cookie.test.casper.js --ignore-ssl-errors=true 
 */
var RegexUtils = require('../lib/util.js');
var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
	// clientScripts: ['jquery.js'],
	pageSettings: {
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false
	},
	timeout: 100000,
	logLevel: "debug",
	verbose: true
});

phantom.cookiesEnabled = true;

//** setup params
console.log(JSON.stringify(casper.cli.options));
var debug = casper.cli.options['debug'] || false;
var tempdir = casper.cli.options['tempdir'] || './_tmp';
var account = {
	staffId: casper.cli.options['staffId'] || '',
};

//** load cookie
var cookie_file = tempdir + '/' + account.staffId + '_cookie.txt';
if(fs.exists(cookie_file)){
	var data = fs.read(cookie_file) || "[]";
	try {
		phantom.cookies = JSON.parse(data);
	} catch (e) {
	}
	// console.log(JSON.stringify(phantom.cookies));
}

var response = {};

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start();

casper.open('https://gz.cbss.10010.com/essframe?service=page/Nav&STAFF_ID=' + account.staffId, {
	method: 'get',
	headers: {
		"Accept": "text/html, application/xhtml+xml, */*",
		"Referer": "https://gz.cbss.10010.com/essframe",
		"Accept-Language": "zh-CN",
		"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
		"Content-Type": "application/x-www-form-urlencoded",
		"Host": "gz.cbss.10010.com",
		"Connection": "Keep-Alive",
		"Cache-Control": "no-cache",
	},
});

casper.then(function checkLogin(){
	var homePageHtml = this.getHTML();
	fs.write(tempdir + '/home_cookie.html', homePageHtml, 644);
	var homePageMeta = homePageHtml.match(/<meta.*provinceId.*?>/i);
	if(homePageMeta){
		//** 已登录
	    response.login = true;
		response.status = '已登录';
		// response.meta = RegexUtils.extractHomePageMeta(homePageHtml) || {};
	}else{
		//** 未登录
	    response.login = false;
		response.status = '未登录';
	}
});

//** save cookies
casper.then(function saveCookie(){
	var cookies = JSON.stringify(phantom.cookies);
	// this.echo(JSON.stringify(phantom.cookies));
	fs.write(cookie_file, cookies, 644);
});

casper.run(function(){
	this.echo('<response>' + JSON.stringify(response) + '</response>');
	casper.exit(0);
	casper.bypass(99);
});

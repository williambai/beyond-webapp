/**
 * 订购流量包产品
 * 
 * > casperjs order.yiwang.test.casper.js --ignore-ssl-errors=true 
 */
var RegexUtils = require('../lib/util.js');
var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
	pageSettings: {
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false
	},
	timeout: 120000,
	waitTimeout: 100000,
	logLevel: "debug",
	verbose: true,
});
casper.on('resource.received',function(resource){
	// console.log('resource: ' + resource.url);
	if(!/\.(js|css|gif|jpg|png)$/.test(resource.url)){
		fs.write(tempdir + '/' + staffId + '_yiwang_request.txt', '['+ resource.id + '] '+ resource.url + ': ' + JSON.stringify(resource) + '\n', 'a');
	}
});

phantom.cookiesEnabled = true;

//** setup params
console.log(JSON.stringify(casper.cli.options));
var debug = casper.cli.options['debug'] || false;
var tempdir = casper.cli.options['tempdir'] || './_tmp';

var staffId = casper.cli.options['staffId'] || '';

var order = {
	phone: casper.cli.options['phone'] || '',
	product: {
		name: casper.cli.options['prod_name'] || '',
		price: casper.cli.options['prod_price'] || '',
		resourceCode: casper.cli.options['prod_code'] || '',
	},
};

var homePageParams = {

};

//** load cookie
var cookie_file = tempdir + '/' + staffId + '_cookie.txt';
// if(fs.exists(cookie_file)){
// 	var data = fs.read(cookie_file) || "[]";
// 	try {
// 		phantom.cookies = JSON.parse(data);
// 	} catch (e) {
// 	}
// 	// console.log(JSON.stringify(phantom.cookies));
// }

//** load homePageParams
// var homeMeta = tempdir + '/' + staffId + '_homeMeta.txt';
// if(fs.exists(homeMeta)){
// 	var data = fs.read(homeMeta) || "[]";
// 	try {
// 		homePageParams = JSON.parse(data);
// 	} catch (e) {
// 	}
// 	// console.log(JSON.stringify(homePageParams));
// }

//****  内部中间变量 begin ******/
var urls = {
	custUrl: '',
	resourceUrl: '',
	packageUrl: '',
};
var loginRandomCode = '';
var loginCheckCode = '';
//** 可选流量包
var resTableList = [];
//** 可选流量包对应的form表单参数
var resourceParam = {};
//** 
var xCodingString = '';
//**
var rMap = {};
//****  内部中间变量 end ******/

var response = {};

casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko');

casper.start();

var account ={
	username: 'ASCBWZS1',//** 贵阳
	password: 'Lq19880625',
	provinceId: '85',//** 省份id
};

casper.open('https://gz.cbss.10010.com/essframe?service=page/Nav&STAFF_ID=' + account.username, {
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
	var homePageMeta = homePageHtml.match(/<meta.*provinceId.*?>/i);
	if(homePageMeta){
		//** 已登录
	    response.login = true;
		// response.meta = RegexUtils.extractHomePageMeta(homePageHtml) || {};
		response.status = '已登录';
		casper.echo('<response>' + JSON.stringify(response) + '</response>');
		casper.exit(0);
		casper.bypass(99);
	}else{
		//** 未登录
		response.status = '未登录';
	}
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

casper.then(function saveHomePageMeta(){
	var homePageHtml = this.getHTML();
	fs.write(tempdir + '/' + staffId + '_home.html', homePageHtml, 644);
	casper.capture(tempdir + '/' + staffId + '_home.jpg');
	var homePageMeta = RegexUtils.extractHomePageMeta(homePageHtml) || {};
	if(homePageMeta['provinceid']){
		//** 已登录
	    response.login = true;
	    response.message = '登录页参数获取成功！';
	    response.meta = homePageMeta;
	    homePageParams = homePageMeta;
		fs.write(tempdir + '/' + account.username + '_homeMeta.txt', JSON.stringify(homePageMeta), 644);
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

casper.wait(20000);


var custUrl = '';
casper.then(function(){
	casper.withFrame('sidebarframe', function(){
			var sideBarHtml = this.getHTML();
			var custUrlMatched = RegexUtils.regexMatch(/menuaddr="(.+?)"/i, sideBarHtml) || [];
			if(custUrlMatched[1] == undefined){
				rspcasper.status = '没取到url，用户认证异常';		
				this.exit(0);
				casper.bypass(99);
				return;
			}
			custUrl = custUrlMatched[1] || '';
			custUrl = custUrl.replace(/&amp;/g, '&');
			custUrl += "&staffId=" + homePageParams['staffid']
		            + "&departId=" + homePageParams['deptid']
		            + "&subSysCode=" + homePageParams['subsyscode']
		            + "&eparchyCode=" + homePageParams['epachyid'];
	});
	casper.then(function(){
			casper.evaluate(function(custUrl){
				document.querySelector('frame#contentframe').setAttribute('src', 'https://gz.cbss.10010.com/' + custUrl);
				// redirectTo('pub.chkcust.MainChkCust', 'init', '&RIGHT_CODE=csCreateCustTrade', 'chkcustframe');
			},custUrl);
	});
});

// casper.then(function(){
// 	// var resourceUrl = '';
// 	// casper.withFrame('navframe',function(){
// 	// 		var frameNav = this.getHTML();
// 	// 		var resourceUrlMatched = RegexUtils.regexMatch(/.*clickMenuItem\(this\);openmenu\('(.+?OrderGprsRes.+?)'\).*/i, frameNav) || [];
// 	// 		resourceUrl = resourceUrlMatched[1] || '';
// 	// 		resourceUrl = resourceUrl.replace(/&amp;/g,'&');
// 	// });
// 	// casper.withFrame('contentframe',function(){
// 	// 		casper.evaluate(function(resourceUrl){
// 	// 			document.querySelector('iframe#chkcustframe').setAttribute('src',resourceUrl);
// 	// 		},'https://gz.cbss.10010.com' + resourceUrl);

// 	// });
// 	// casper.then(function(){

// 	// });

// 	casper.page.switchToChildFrame('navframe');	
// 	casper.click('#BIL6216');
// 	casper.page.switchToParentFrame();
// });

casper.wait(20000);

casper.then(function(){
	casper.withFrame('contentframe',function(){
		var BSS_CUSTSERV_JSESSIONID = '';
		phantom.cookies.forEach(function(cookie){
			if(cookie.name == 'BSS_CUSTSERV_JSESSIONID') BSS_CUSTSERV_JSESSIONID = cookie.value;
		});
		console.log('++++++');
		console.log('BSS_CUSTSERV_JSESSIONID: ' + BSS_CUSTSERV_JSESSIONID);
		var custUrlNew = 'custserv;BSS_CUSTSERV_JSESSIONID=' + BSS_CUSTSERV_JSESSIONID 
						+ '?service=page/pub.chkcust.MainChkCust'
						+ '&listener=init'
						+ '&RIGHT_CODE=csCreateCustTrade'
 						+ "&staffId=" + homePageParams['staffid']
			            + "&departId=" + homePageParams['deptid']
			            + "&subSysCode=custserv"
			            + "&eparchyCode=" + homePageParams['epachyid'];

		console.log(custUrlNew);
		// casper.page.switchToChildFrame('contentframe');
		casper.evaluate(function(custUrlNew){
			document.querySelector('#chkcustframe').setAttribute('src', 'https://gz.cbss.10010.com/' + custUrlNew);
		},custUrlNew);
		casper.wait(10000);
		casper.withFrame('chkcustframe', function(){		
			var frameChkcust = this.getHTML();
			// casper.page.switchToParentFrame();
			
			casper.evaluate(function(){
				document.querySelector('#serialNumber1').setAttribute('value','15692740700');
				document.click('input[onclick="queryUserInfoBySerialNumber($F(\'serialNumber1\'));"]');
			});
		});
	});
});

// casper.then(function(){
// 	casper.withFrame('navframe', function(){
// 		// casper.click('#BIL6216');
// 		var navHtml = this.getHTML();
// 		var resourceUrlMatched = RegexUtils.regexMatch(/.*clickMenuItem\(this\);openmenu\('(.+?OrderGprsRes.+?)'\).*/i, navHtml) || [];
// 		var resourceUrl = resourceUrlMatched[1] || '';
// 		// resourceUrl = resourceUrl.replace(/&amp;/g,'&');

// 		casper.then(function(){
// 				casper.evaluate(function(resourceUrl){
// 					openmenu(resourceUrl);
// 				},resourceUrl);
// 		});
// 	});
// });

casper.wait(20000);

casper.then(function(){
	var frameMain = this.getHTML();
	fs.write(tempdir + '/' + staffId + '_frameMain.html', frameMain, 644);
	casper.capture(tempdir + '/' + staffId + '_frameMain.jpg');
});

casper.withFrame('navframe',function(){
	var frameNav = this.getHTML();
	fs.write(tempdir + '/' + staffId + '_frameNav.html', frameNav, 644);	
});

casper.withFrame('sidebarframe',function(){
	var frameSidebar = this.getHTML();
	fs.write(tempdir + '/' + staffId + '_frameSidebar.html', frameSidebar, 644);
});

casper.withFrame('slipframe',function(){
	var frameSlip = this.getHTML();
	fs.write(tempdir + '/' + staffId + '_frameSlip.html', frameSlip, 644);
});

casper.withFrame('contentframe',function(){
	var frameContent = this.getHTML();
	fs.write(tempdir + '/' + staffId + '_frameContent.html', frameContent, 644);
	casper.withFrame('chkcustframe', function(){		
		var frameChkcust = this.getHTML();
		fs.write(tempdir + '/' + staffId + '_frameChkcust.html', frameChkcust, 644);
		casper.capture(tempdir + '/' + staffId + '_frameChkcust.jpg');
	});
});

casper.then(function(){
	casper.capture(tempdir + '/' + staffId + '_frameMain1.jpg');
});

// //** save cookies
// casper.then(function saveCookie(){
// 	var cookies = JSON.stringify(phantom.cookies);
// 	// this.echo(JSON.stringify(phantom.cookies));
// 	fs.write(tempdir + '/_cookie.txt', cookies, 644);
// });

casper.run(function(){
casper.echo('<response>' + JSON.stringify(response) + '</response>');
casper.exit(0);
casper.bypass(99);
});


// casper.then(function nav(){
// 	casper.then(function getNavHtml(){
// 		casper.open('https://gz.cbss.10010.com/essframe?service=page/Nav&STAFF_ID=' + staffId, {
// 			method: 'get',
// 			headers: {
// 				"Accept": "text/html, application/xhtml+xml, */*",
// 				"Referer": "https://gz.cbss.10010.com/essframe",
// 				"Accept-Language": "zh-CN",
// 				"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
// 				"Content-Type": "application/x-www-form-urlencoded",
// 				"Host": "gz.cbss.10010.com",
// 				"Connection": "Keep-Alive",
// 				"Cache-Control": "no-cache",
// 			},
// 		});
// 	});
// 	casper.then(function checkLogin(){
// 		var navHtml = this.getHTML();
// 		fs.write(tempdir + '/' + staffId + '_nav.html', navHtml, 644);
// 		var homePageMeta = navHtml.match(/<meta.*provinceId.*?>/i);
// 		console.log(homePageMeta);
// 		if(homePageMeta){
// 			//** 已登录
// 		    response.login = true;
// 			response.status = '已登录';
// 		}else{
// 			//** 未登录
// 		    response.login = false;
// 			response.status = '未登录';
// 			casper.echo('<response>' + JSON.stringify(response) + '</response>');
// 			casper.exit(0);
// 			casper.bypass(99);
// 		}
// 	});
// 	casper.then(function parseNavHtml(){
// 		var navHtml = this.getHTML();
// 		//** 加载homePageParams吗?
// 		homePageParams = RegexUtils.extractHomePageMeta(navHtml) || {};
// 		var resourceUrlMatched = RegexUtils.regexMatch(/.*clickMenuItem\(this\);openmenu\('(.+?OrderGprsRes.+?)'\).*/i, navHtml) || [];
// 		var resourceUrl = resourceUrlMatched[1] || '';
// 		resourceUrl = resourceUrl.replace(/&amp;/g,'&');
// 		urls.resourceUrl = resourceUrl;
// 		fs.write(tempdir + '/' + staffId + '_resource_url.txt', urls.resourceUrl, 644);
// 		casper.capture(tempdir + '/' + staffId + '_nav.jpg');
// 	});
// });


//** 左边框，用于获得下一步访问地址
// casper.withFrame('sidebarframe',function(){
// 	casper.then(function sideBar(){
// 		// casper.then(function getSideBarHtml(){
// 		// 	casper.open('https://gz.cbss.10010.com/essframe?service=page/Sidebar',{
// 		// 		method: 'get',
// 		// 		headers: {
// 		// 			"Accept": "text/html, application/xhtml+xml, */*",
// 		// 			"Referer": "https://gz.cbss.10010.com/essframe",
// 		// 			"Accept-Language": "zh-CN",
// 		// 			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
// 		// 			"Content-Type": "application/x-www-form-urlencoded",
// 		// 			"Host": "gz.cbss.10010.com",
// 		// 			"Connection": "Keep-Alive",
// 		// 			"Cache-Control": "no-cache",
// 		// 		},
// 		// 		encoding: 'utf8',
// 		// 	});
// 		// });
// 		casper.then(function parserSideBarHtml(){
// 				var sideBarHtml = this.getHTML();
// 				fs.write(tempdir + '/' + staffId + '_sidebar.html', sideBarHtml, 644);
// 				casper.capture(tempdir + '/' + staffId + '_sidebar.jpg');
// 				var custUrlMatched = RegexUtils.regexMatch(/menuaddr="(.+?)"/i, sideBarHtml) || [];
// 				if(custUrlMatched[1] == undefined){
// 					rspcasper.status = '没取到url，用户认证异常';		
// 					this.exit(0);
// 					casper.bypass(99);
// 					return;
// 				}
// 				var loginRandomCodeMatched = RegexUtils.regexMatch(/LOGIN_RANDOM_CODE=(\d+)/i, sideBarHtml) || [];
// 				loginRandomCode = loginRandomCodeMatched[1] || '';
// 				var loginCheckCodeMatched = RegexUtils.regexMatch(/LOGIN_CHECK_CODE=(\d+)/i, sideBarHtml) || [];
// 				loginCheckCode = loginCheckCodeMatched[1] || '';

// 				var custUrl = custUrlMatched[1] || '';
// 				console.log('custUrl(raw): ' + custUrl);
// 				custUrl = custUrl.replace(/&amp;/g, '&');
// 				custUrl += "&staffId=" + homePageParams['staffid']
// 			            + "&departId=" + homePageParams['deptid']
// 			            + "&subSysCode=" + homePageParams['subsyscode']
// 			            + "&eparchyCode=" + homePageParams['epachyid'];
// 			    urls.custUrl = custUrl;
// 				fs.write(tempdir + '/' + staffId + '_cust_url.txt', custUrl, 644);
// 		});
// 	});
// });

// casper.withFrame('contentframe', function(){
// 	casper.then(function custAuthMain(){
// 		casper.then(function getCustAuthMainHtml(){
// 			casper.open("https://gz.cbss.10010.com/" + urls.custUrl,{
// 				method: 'get',
// 				headers: {
// 					"Accept": "text/html, application/xhtml+xml, */*",
// 					"Referer": "https://gz.cbss.10010.com/essframe?service=page/Sidebar",
// 					"Accept-Language": "zh-CN",
// 					"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
// 					"Content-Type": "application/x-www-form-urlencoded",
// 					"Host": "gz.cbss.10010.com",
// 					"Connection": "Keep-Alive",
// 					"Cache-Control": "no-cache",
// 				},
// 				encoding: 'utf8',
// 			});
// 		});

// 		casper.then(function(){
// 			casper.wait(5000);
// 		});

// 	    casper.then(function parseCustAuthMainHtml(){
// 	    	//** 客户统一认证
// 	    	var custAuthMainHtml = this.getHTML();
// 	    	fs.write(tempdir + '/' + staffId + '_cust_auth_main.html', custAuthMainHtml, 644);
// 	    });
// 	    casper.withFrame('chkcustframe', function(){
// 	    	casper.then(function(){
// 		    	var custHtml = this.getHTML();
// 		    	fs.write(tempdir + '/' + staffId + 'yiwang_cust.html', custHtml, 644);
// 	    	});
// 	    });
// 	});



// 	casper.then(function authenticate(){
// 		var authenticateUrl =
// 		    "custserv?service=swallow/pub.chkcust.MainChkCust/authenticate/1";
// 		var referUrl =
// 		    "https://gz.cbss.10010.com/custserv?service=page/pub.chkcust.MainChkCust&listener=&staffId="
// 		        + homePageParams["staffid"]
// 		        + "&departId="
// 		        + homePageParams["deptid"]
// 		        + "&subSysCode=custserv&eparchyCode="
// 		        + homePageParams["epachyid"];
// 		 var inparam = '{"CHECK_MODE":"8","EPARCHY_CODE":"'+ homePageParams["epachyid"] + '","ID_TYPE_CODE":"1","PSPT_ID":"","SERIAL_NUMBER":"' + order.phone + '"}';
// 		console.log(inparam);
// 		var ajaxReturnData ='empty';
// 		casper.then(function postAuthenticate(){
// 			ajaxReturnData = casper.evaluate(function(url, data, referUrl){
// 				url = url + '&globalPageName=' + data.globalPageName + '&inparam={"CHECK_MODE":"8","SERIAL_NUMBER":"15692740700"}';// + data.inparam;
// 				return __utils__.sendAJAX(url, 'POST', {}, false,
// 				{
// 					"Accept": "text/html, application/xhtml+xml, */*",
// 	                "x-prototype-version": "1.5.1",
// 					"Referer": referUrl,
// 	        		"x-requested-with": "XMLHttpRequest",
// 					"Accept-Language": "zh-CN",
// 					"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
// 					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
// 					"Host": "gz.cbss.10010.com",
// 					"Connection": "Keep-Alive",
// 					"Cache-Control": "no-cache",
// 				}
// 				);
// 			}, "https://gz.cbss.10010.com/" + authenticateUrl,
// 				{
// 					inparam: inparam,
// 					globalPageName: "pub.chkcust.MainChkCust",
// 				},
// 				// '{"inparam":"'+ inparam +'","globalPageName":"pub.chkcust.MainChkCust"}',
// 				referUrl
// 			);
// 			// casper.open(,{
// 			// 	method: 'post',
// 			// 	headers: {
// 			// 		"Accept": "text/html, application/xhtml+xml, */*",
// 	  //               "x-prototype-version": "1.5.1",
// 			// 		"Referer": referUrl,
// 	  //       		"x-requested-with": "XMLHttpRequest",
// 			// 		"Accept-Language": "zh-CN",
// 			// 		"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
// 			// 		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
// 			// 		"Host": "gz.cbss.10010.com",
// 			// 		"Connection": "Keep-Alive",
// 			// 		"Cache-Control": "no-cache",
// 			// 	},
// 			// 	data: {
// 			// 		"inparam": JSON.stringify(inparam),
// 			// 		"globalPageName": "pub.chkcust.MainChkCust",
// 			// 	},
// 			// 	encoding: 'utf8',
// 			// });
// 		});
// 	    casper.then(function parseAuthenticateHtml(){
// 	    	//** 首页用户认证
// 	    	// require('utils').dump(ajaxReturnData);
// 	    	var custAuthHomeHtml = ajaxReturnData;
// 	    	fs.write(tempdir + '/' + staffId + '_cust_auth_home.html', custAuthHomeHtml, 644);
// 	    	casper.capture(tempdir + '/' + staffId + '_cust_auth_home.jpg');
// 	    });
// 	});
// });


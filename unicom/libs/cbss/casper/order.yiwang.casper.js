/**
 * 订购流量包产品
 * 
 * > casperjs order.yiwang.test.casper.js --ignore-ssl-errors=true 
 */
var outputDebug = true;
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
		if(false) fs.write(tempdir + '/' + staffId + '_yiwang_request.txt', '['+ resource.id + '] '+ resource.url + ': ' + JSON.stringify(resource) + '\n', 'a');
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
if(fs.exists(cookie_file)){
	var data = fs.read(cookie_file) || "[]";
	try {
		phantom.cookies = JSON.parse(data);
	} catch (e) {
	}
	// console.log(JSON.stringify(phantom.cookies));
}

//** load homePageParams
var homeMeta = tempdir + '/' + staffId + '_homeMeta.txt';
if(fs.exists(homeMeta)){
	var data = fs.read(homeMeta) || "[]";
	try {
		homePageParams = JSON.parse(data);
	} catch (e) {
	}
	// console.log(JSON.stringify(homePageParams));
}

//****  内部中间变量 begin ******/
var urls = {
	custUrl: '',
	resourceUrl: '',
	packageUrl: '',
};
//****  内部中间变量 end ******/

var response = {};

casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko');

casper.start();


casper.then(function nav(){
	casper.then(function getNavHtml(){
		casper.open('https://gz.cbss.10010.com/essframe?service=page/Nav&STAFF_ID=' + staffId, {
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
	});
	casper.then(function checkLogin(){
		var navHtml = this.getHTML();
		var homePageMeta = navHtml.match(/<meta.*provinceId.*?>/i);
		// console.log(homePageMeta);
		if(homePageMeta){
			//** 已登录
		    response.login = true;
			response.status = '已登录';
		}else{
			//** 未登录
		    response.login = false;
			response.status = '未登录';
			casper.echo('<response>' + JSON.stringify(response) + '</response>');
			casper.exit(0);
			casper.bypass(99);
		}
	});
	casper.then(function parseNavHtml(){
		var navHtml = this.getHTML();
		//** 加载homePageParams吗?
		homePageParams = RegexUtils.extractHomePageMeta(navHtml) || {};
		var resourceUrlMatched = RegexUtils.regexMatch(/.*clickMenuItem\(this\);openmenu\('(.+?personalserv\.changeelement\.ChangeElement.+?)'\).*/i, navHtml) || [];
		var resourceUrl = resourceUrlMatched[1] || '';
		resourceUrl = resourceUrl.replace(/&amp;/g,'&');
		urls.resourceUrl = resourceUrl;
		// fs.write(tempdir + '/' + staffId + '_yiwang_resource_url.txt', urls.resourceUrl, 644);
		fs.write(tempdir + '/' + staffId + '_yiwang_frameNav.html', navHtml, 644);
		casper.capture(tempdir + '/' + staffId + '_yiwang_frameNav.jpg');
	});
});


//** 左边框，用于获得下一步访问地址
casper.then(function sideBar(){
	casper.then(function getSideBarHtml(){
		casper.open('https://gz.cbss.10010.com/essframe?service=page/Sidebar',{
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
			encoding: 'utf8',
		});
	});
	casper.then(function parserSideBarHtml(){
			var sideBarHtml = this.getHTML();
			if(outputDebug) fs.write(tempdir + '/' + staffId + '_yiwang_frameSidebar.html', sideBarHtml, 644);

			var custUrlMatched = RegexUtils.regexMatch(/menuaddr="(.+?)"/i, sideBarHtml) || [];
			if(custUrlMatched[1] == undefined){
				rspcasper.status = '没取到url，用户认证异常';		
				this.exit(0);
				casper.bypass(99);
				return;
			}

			var custUrl = custUrlMatched[1] || '';
			// console.log('custUrl(raw): ' + custUrl);
			custUrl = custUrl.replace(/&amp;/g, '&');
			custUrl += "&staffId=" + homePageParams['staffid']
		            + "&departId=" + homePageParams['deptid']
		            + "&subSysCode=" + homePageParams['subsyscode']
		            + "&eparchyCode=" + homePageParams['epachyid'];
		    urls.custUrl = custUrl;
		    // console.log('custUrl: ' + custUrl);
	});
});

casper.then(function custAuthMain(){
	casper.then(function getCustAuthMainHtml(){
		casper.open("https://gz.cbss.10010.com/" + urls.custUrl,{
			method: 'get',
			headers: {
				"Accept": "text/html, application/xhtml+xml, */*",
				"Referer": "https://gz.cbss.10010.com/essframe?service=page/Sidebar",
				"Accept-Language": "zh-CN",
				"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
				"Content-Type": "application/x-www-form-urlencoded",
				"Host": "gz.cbss.10010.com",
				"Connection": "Keep-Alive",
				"Cache-Control": "no-cache",
			},
			encoding: 'utf8',
		});
	});
	// casper.wait(10000);
    casper.then(function parseCustAuthMainHtml(){
    	//** 客户统一认证
    	var custAuthMainHtml = this.getHTML();
    	fs.write(tempdir + '/' + staffId + '_yiwang_custAuthMain.html', custAuthMainHtml, 644);
		casper.capture(tempdir + '/' + staffId + '_yiwang_custAuthMain.jpg');
    });
});

casper.then(function yiwangPage(){
	var packageUrl = urls.resourceUrl + "&staffId="
                + homePageParams['staffid'] + "&departId="
                + homePageParams['deptid']
                + "&subSysCode=BSS&eparchyCode="
                + homePageParams['epachyid'];
    urls.packageUrl = packageUrl;
	casper.then(function getYiwangHtml(){
		casper.open("https://gz.cbss.10010.com" + packageUrl ,{
			method: 'get',
			headers: {
				"Accept": "text/html, application/xhtml+xml, */*",
				"Referer": "https://gz.cbss.10010.com/" + urls.custUrl,
				"Accept-Language": "zh-CN",
				"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
				"Content-Type": "application/x-www-form-urlencoded",
				"Host": "gz.cbss.10010.com",
				"Connection": "Keep-Alive",
				"Cache-Control": "no-cache",
			},
			encoding: 'gbk',
		});
	});
	casper.then(function parseYiwangHtml(){
		var yiwangHtml = this.getHTML();
		if(outputDebug) fs.write(tempdir + '/' + staffId + '_yiwang_pageForm.html', yiwangHtml, 644);
		if(outputDebug) casper.capture(tempdir + '/' + staffId + '_yiwang_pageForm.jpg');
	});
});

//** 刷新移网产品/服务变更订购页面
casper.then(function updateYiwangForm(){
	//** 通过号码获取用户已办理资源包和可办理资源包
	casper.then(function postYiwangForm(){
		casper.thenEvaluate(function(phone){
			// document.querySelector('form[name="Form0"]').setAttribute('action','http://localhost:9200');
			document.querySelector('input[name=SERIAL_NUMBER]').setAttribute('value', phone);
		},order.phone);

		casper.then(function(){
			casper.evaluate(function(){
				__utils__.click('input[name="subQueryTrade"]');
			});
		});
	});

	casper.wait(10000);

	casper.then(function parseUpdatedYiwangHtml(){
		casper.then(function(){
			var resourceHtml = this.getHTML();
			if(outputDebug) fs.write(tempdir + '/' + staffId + '_yiwang_pageFormUpdated.html', resourceHtml, 644);
			if(outputDebug) casper.capture(tempdir + '/' + staffId + '_yiwang_pageFormUpdated.jpg');
		});
	});
});

casper.run(function(){
casper.echo('<response>' + JSON.stringify(response) + '</response>');
casper.exit(0);
casper.bypass(99);
});



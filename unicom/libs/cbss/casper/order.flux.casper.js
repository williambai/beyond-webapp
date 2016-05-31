/**
 * 订购流量包产品
 * 
 * > casperjs order.flux.test.casper.js --ignore-ssl-errors=true 
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
	timeout: 100000,
	logLevel: "debug",
	verbose: true
});
phantom.cookiesEnabled = true;

//** setup params
console.log(JSON.stringify(casper.cli.options));
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

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start();

casper.open('https://gz.cbss.10010.com/essframe?service=page/Nav&STAFF_ID=' + staffId, {
	method: 'get',
	headers: {
		"Accept": 'text/html, application/xhtml+xml, */*',
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

casper.then(function checkLogin(){
	var homePageHtml = this.getHTML();
	var homePageMeta = homePageHtml.match(/<meta.*provinceId.*?>/i);
	if(homePageMeta){
		//** 已登录
		response.meta = RegexUtils.extractHomePageMeta(homePageHtml) || {};
		response.status = '已登录';
	}else{
		//** 未登录
		response.status = '未登录';
		casper.echo('<response>' + JSON.stringify(response) + '</response>');
		casper.exit();
		casper.bypass(99);
	}
});

casper.then(function getResourceUrl(){
	var navHtml = this.getHTML();
	var resourceUrlMatched = RegexUtils.regexMatch(/.*clickMenuItem\(this\);openmenu\('(.+?OrderGprsRes.+?)'\).*/i, navHtml) || [];
	urls.resourceUrl = resourceUrlMatched[1] || '';
});

//** 左边框，用于获得下一步访问地址
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

casper.then(function getCustUrl(){
	var sideBarHtml = this.getHTML();
	var custUrlMatched = RegexUtils.regexMatch(/menuaddr="(.+?)"/i, sideBarHtml);
	if(custUrlMatched[1] == undefined){
		console.log('没取到url');
		rspcasper.status = '用户认证异常';
		
		this.exit(0);
		casper.bypass(99);
		return;
	}
	var loginRandomCodeMatched = RegexUtils.regexMatch(/LOGIN_RANDOM_CODE=(\d+)/i, sideBarHtml);
	loginRandomCode = loginRandomCodeMatched[1] || '';
	var loginCheckCodeMatched = RegexUtils.regexMatch(/LOGIN_CHECK_CODE=(\d+)/i, sideBarHtml);
	loginCheckCode = loginCheckCodeMatched[1] || '';

	var custUrl = custUrlMatched[1] || '';
	custUrl = custUrl.replace('&amp;', '&');
	custUrl += "&staffId=" + homePageParams['staffId']
            + "&departId=" + homePageParams['deptId']
            + "&subSysCode=" + homePageParams['subSysCode']
            + "&eparchyCode=" + homePageParams['epachyId'];
    urls.custUrl = custUrl;

    casper.open("https://gz.cbss.10010.com/" + custUrl,{
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

//** 账务管理，流量包资源订购
casper.then(function getPackageUrl(){
	var packageUrl = "https://gz.cbss.10010.com" + urls.resourceUrl + "&staffId="
                + homePageParams['staffId'] + "&departId="
                + homePageParams['deptId']
                + "&subSysCode=BSS&eparchyCode="
                + homePageParams['epachyId'];
    urls.packageUrl = packageUrl;

    casper.open(packageUrl,{
    	method: 'get',
    	headers: {
    		"Accept": "text/html, application/xhtml+xml, */*",
    		"Referer": urls.custUrl,
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

//** 用户流量包信息查询
casper.open('"https://gz.cbss.10010.com/acctmanm',{
	method: 'post',
	headers: {
		"Accept": "text/html, application/xhtml+xml, */*",
		"Referer": 'https://gz.cbss.10010.com/essframe?service=page/Sidebar',
		"Accept-Language": "zh-CN",
		"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
		"Content-Type": "application/x-www-form-urlencoded",
		"Host": "gz.cbss.10010.com",
		"Connection": "Keep-Alive",
		"Cache-Control": "no-cache",
	},
	encoding: 'gbk',
	data: {
		"service": "direct/1/amcharge.ordergprsresource.OrderGprsRes/$Form",
		"sp": "S0",
		"Form0": "cond_SERIAL_NUMBER,cond_NET_TYPE_CODE,bquerytop,cond_DL_NAME,cond_DL_SNUMBER,data_DL_ZJ,cond_DL_NUMBER,data_RESOURCE_TAG,data_RESOURCE_ZK,data_PACKAGE_CODE,data_RESOURCE_CODE,data_ZK_NAME,data_RESOURCE_NAME,data_LONG,data_MONEY,data_RES_MONEY,data_UNIT,data_VALID_TIME_UNIT,data_VALID_TIME,data_RESOURCE_COUNT,bsubmit1,userinfoback_PREPAY_TAG",
		"cond_ID_TYPE": "1",
		"cond_SERIAL_NUMBER": order.phone,
		"cond_NET_TYPE_CODE": "",
		"bquerytop": " 查 询 ",
		"cond_X_USER_COUNT": "",
		"cond_DL_NAME": "",
		"cond_DL_SNUMBER": "",
		"data_DL_ZJ": "",
		"cond_DL_NUMBER": "",
		"data_RESOURCE_TAG": "",
		"data_RESOURCE_ZK": "",
		"data_PACKAGE_CODE": "",
		"data_RESOURCE_CODE": "",
		"data_ZK_NAME": "",
		"data_RESOURCE_NAME": "",
		"data_LONG": "",
		"data_MONEY": "",
		"data_RES_MONEY": "",
		"data_UNIT": "",
		"data_VALID_TIME_UNIT": "",
		"data_VALID_TIME": "",
		"data_RESOURCE_COUNT": "",
		"cond_PRINT_FLAG": "",
		"cond_DL_ZJ_NAME": "",
		"userinfoback_ACCT_ID": "",
		"userinfoback_SERIAL_NUMBER": "",
		"userinfoback_PAY_NAME": "",
		"userinfoback_NET_TYPE_CODE": "",
		"userinfoback_SERVICE_CLASS_CODE": "",
		"userinfoback_USER_ID": "",
		"userinfoback_PAY_MODE_CODE": "",
		"userinfoback_ROUTE_EPARCHY_CODE": "",
		"userinfoback_PREPAY_TAG": "",
		"userinfoback_CITY_CODE": "",
		"userinfoback_PRODUCT_ID": "",
		"userinfoback_BRAND_CODE": "",
		"cond_CREDIT_VALUE": "",
		"cond_DEPOSIT_MONEY": "",
		"cond_TOTAL_FEE": "",
		"X_CODING_STR": "",
		"cond_DATE": "",
		"cond_DATE1": "",
		"cond_DATE2": "",
		"cond_DATE3": "",
		"cond_STAFF_ID1": "",
		"cond_STAFF_NAME1": "",
		"cond_DEPART_NAME1": "",
		"cond_ENDDATE": "",
		"cond_CUST_NAME": "",
		"cond_PSPT_TYPE_CODE": "",
		"cond_PSPT_ID": "",
		"cond_PSPT_ADDR": "",
		"cond_POST_ADDRESS": "",
		"cond_CONTACT": "",
		"cond_CONTACT_PHONE": "",
		"cond_EMAIL": "",
		"cond_SHOWLIST": "",
		"cond_PSPT_END_DATE": "",
		"cond_NET_TYPE_CODE1": "",		
	}
});

casper.then(function parseResourceHtml(){
	var resourceHtml = this.getHTML();

	//** 用户不能订购
	//TODO ?
	var content = RegexUtils.regexMatch(/<div class="content">(.+?)<\/div>/i, resourceHtml);
	if(content[1] && content[1].length > 0){
		response.status = '用户不能订购';
		response.content = content;
		casper.echo('<response>' + JSON.stringify(response) + '</response>');
		casper.exit(0);
		casper.bypass(99);
		return;
	}
	//** 获得已订购列表
	//TODO ?
	var resourceList = RegexUtils.extractResourceInfo(resourceHtml) || [];
	//** 是否有正在“处理中”的业务
	resourceList.forEach(function(resource){
		if(/处理中/.test(resource.dealTag)){
			console.log('用户有业务尚在处理中！');
			response.status = '用户有业务尚在处理中';
			response.content = JSON.stringify(resource);
			casper.echo('<response>' + JSON.stringify(response) + '</response>');
			casper.exit(0);
			casper.bypass(99);
		}
	});
	//** 可选择流量包
	resTableList = RegexUtils.extractResTableInfo(resourceHtml) || [];
	//** form表单参数
	resourceParam = RegexUtils.getResourceParam(resourceHtml) || {};
	xCodingString = RegexUtils.getXcodingString(resTableList);
	//** 信用额度
	var creditMoney = parseFloat(resourceParam.cond_CREDIT_VALUE) || 0;
	//** 话费余额
	var dePostMoney = parseFloat(resourceParam.cond_DEPOSIT_MONEY) || 0;
	if( creditMoney + dePostMoney < parseFloat(order.product.price)){
		response.status = '用户余额不足';
		casper.echo('<response>' + JSON.stringify(response) + '</response>');
		casper.exit(0);
		casper.bypass(99);
		return;
	}
});

casper.then(function getAmchargeXml(){
	var amchargeUrl = "https://gz.cbss.10010.com/acctmanm?service=ajaxDirect/1/amcharge.ordergprsresource.OrderGprsRes"
                + "/amcharge.ordergprsresource.OrderGprsRes/javascript/refeshZK&pagename="
                + "amcharge.ordergprsresource.OrderGprsRes"
                + "&eventname=getResZKList&staffId="
                + homePageParams['staffId']
                + "&departId="
                + homePageParams['deptId']
                + "&subSysCode=acctmanm&eparchyCode="
                + homePageParams['epachyId']
                + "&partids=refeshZK&random="
                + RegexUtils.getRandomParam()
                + "&ajaxSubmitType=post";
    casper.open(amchargeUrl, {
		method: 'post',
		headers: {
			"Accept": "text/html, application/xhtml+xml, */*",
			"Referer": 'https://gz.cbss.10010.com/acctmanm',
			"Accept-Language": "zh-CN",
			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
			"Content-Type": "application/x-www-form-urlencoded",
			"x-requested-with": "XMLHttpRequest",
			"Host": "gz.cbss.10010.com",
			"Connection": "Keep-Alive",
			"Cache-Control": "no-cache",
		},
		encoding: 'gbk',
		data: {
			"Form0": resourceParam["Form0"],
			"cond_ID_TYPE": resourceParam["cond_ID_TYPE"],
			"cond_SERIAL_NUMBER": order.phone,
			"cond_NET_TYPE_CODE": "50",
			"bquerytop": " 查 询 ",
			"cond_X_USER_COUNT": resourceParam["cond_X_USER_COUNT"],
			"cond_DL_NAME": resourceParam["cond_DL_NAME"],
			"cond_DL_SNUMBER": resourceParam["cond_DL_SNUMBER"],
			"data_DL_ZJ": "",
			"cond_DL_NUMBER": "",
			"data_RESOURCE_TAG": order.product.resourceCode,// 流量包编码
			"data_RESOURCE_ZK": "",
			"data_PACKAGE_CODE": resourceParam["data_PACKAGE_CODE"],
			"data_RESOURCE_CODE": resourceParam["data_RESOURCE_CODE"],
			"data_ZK_NAME": resourceParam["data_ZK_NAME"],
			"data_RESOURCE_NAME": resourceParam["data_RESOURCE_NAME"],
			"data_LONG": resourceParam["data_LONG"],
			"data_MONEY": resourceParam["data_MONEY"],
			"data_RES_MONEY": resourceParam["data_RES_MONEY"],
			"data_UNIT": resourceParam["data_UNIT"],
			"data_VALID_TIME_UNIT": resourceParam["data_VALID_TIME_UNIT"],
			"data_VALID_TIME": resourceParam["data_VALID_TIME"],
			"data_RESOURCE_COUNT": resourceParam["data_RESOURCE_COUNT"],
			"cond_PRINT_FLAG": resourceParam["cond_PRINT_FLAG"],
			"cond_DL_ZJ_NAME": resourceParam["cond_DL_ZJ_NAME"],
			"bsubmit1": "提 交",
			"userinfoback_ACCT_ID": resourceParam["userinfoback_ACCT_ID"],
			"userinfoback_SERIAL_NUMBER": order.phone,
			"userinfoback_PAY_NAME": resourceParam["userinfoback_PAY_NAME"],
			"userinfoback_NET_TYPE_CODE": resourceParam["userinfoback_NET_TYPE_CODE"],
			"userinfoback_SERVICE_CLASS_CODE": resourceParam["userinfoback_SERVICE_CLASS_CODE"],
			"userinfoback_USER_ID": resourceParam["userinfoback_USER_ID"],
			"userinfoback_PAY_MODE_CODE": resourceParam["userinfoback_PAY_MODE_CODE"],
			"userinfoback_ROUTE_EPARCHY_CODE": resourceParam["userinfoback_ROUTE_EPARCHY_CODE"],
			"userinfoback_PREPAY_TAG": resourceParam["userinfoback_PREPAY_TAG"],
			"userinfoback_CITY_CODE": resourceParam["userinfoback_CITY_CODE"],
			"userinfoback_PRODUCT_ID": resourceParam["userinfoback_PRODUCT_ID"],
			"userinfoback_BRAND_CODE": resourceParam["userinfoback_BRAND_CODE"],
			"cond_CREDIT_VALUE": resourceParam["cond_CREDIT_VALUE"],
			"cond_DEPOSIT_MONEY": resourceParam["cond_DEPOSIT_MONEY"],
			"cond_TOTAL_FEE": resourceParam["cond_TOTAL_FEE"],
			"X_CODING_STR": xCodingString,
			"cond_DATE": resourceParam["cond_DATE"],
			"cond_DATE1": resourceParam["cond_DATE1"],
			"cond_DATE2": resourceParam["cond_DATE2"],
			"cond_DATE3": resourceParam["cond_DATE3"],
			"cond_STAFF_ID1": resourceParam["cond_STAFF_ID1"],
			"cond_STAFF_NAME1": resourceParam["cond_STAFF_NAME1"],
			"cond_DEPART_NAME1": resourceParam["cond_DEPART_NAME1"],
			"cond_ENDDATE": resourceParam["cond_ENDDATE"],
			"cond_CUST_NAME": resourceParam["cond_CUST_NAME"],
			"cond_PSPT_TYPE_CODE": resourceParam["cond_PSPT_TYPE_CODE"],
			"cond_PSPT_ID": resourceParam["cond_PSPT_ID"],
			"cond_PSPT_ADDR": resourceParam["cond_PSPT_ADDR"],
			"cond_POST_ADDRESS": resourceParam["cond_POST_ADDRESS"],
			"cond_CONTACT": resourceParam["cond_CONTACT"],
			"cond_CONTACT_PHONE": resourceParam["cond_CONTACT_PHONE"],
			"cond_EMAIL": resourceParam["cond_EMAIL"],
			"cond_SHOWLIST": resourceParam["cond_SHOWLIST"],
			"cond_PSPT_END_DATE": resourceParam["cond_PSPT_END_DATE"],
			"cond_NET_TYPE_CODE1": resourceParam["cond_NET_TYPE_CODE1"],
			"RESOURCE_TAG": order.product.resourceCode,
    	}
    });
});

casper.then(function parseAmchargeXml(){
	var packageHtml = this.getHTML();
	var priceList = RegexUtils.queryPrice(packageHtml) || [];
	if(!priceList.contain(order.product.price)){
		console.log('价格不对，不能订');
		response.status = '价格不对，不能订';
		casper.echo('<response>' + JSON.stringify(response) + '</response>');
		casper.exit(0);
		casper.bypass(99);
	}
});

casper.then(function getRefreshMoneyXml(){
	var refreshMoneyUrl =
            "https://gz.cbss.10010.com/acctmanm?service=ajaxDirect/1/amcharge.ordergprsresource.OrderGprsRes/"
                + "amcharge.ordergprsresource.OrderGprsRes/javascript/refeshMoney&pagename="
                + "amcharge.ordergprsresource.OrderGprsRes"
                + "&eventname=getOrderResInfos&staffId="
                + homePageParams['staffId']
                + "&departId="
                + homePageParams['deptId']
                + "&subSysCode=acctmanm&eparchyCode="
                + homePageParams['epachyId']
                + "&partids=refeshMoney&random="
                + RegexUtils.getRandomParam()
                + "&ajaxSubmitType=post";

    casper.open(refreshMoneyUrl,{
		method: 'post',
		headers: {
			"Accept": "text/html, application/xhtml+xml, */*",
			"Referer": 'https://gz.cbss.10010.com/acctmanm',
			"Accept-Language": "zh-CN",
			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
			"Content-Type": "application/x-www-form-urlencoded",
			"x-requested-with": "XMLHttpRequest",
			"Host": "gz.cbss.10010.com",
			"Connection": "Keep-Alive",
			"Cache-Control": "no-cache",
		},
		encoding: 'gbk',
		data: {
			"Form0": resourceParam["Form0"],
			"cond_ID_TYPE": resourceParam["cond_ID_TYPE"],
			"cond_SERIAL_NUMBER": order.phone,
			"cond_NET_TYPE_CODE": resourceParam["userinfoback_NET_TYPE_CODE"],
			"bquerytop": " 查 询 ",
			"cond_X_USER_COUNT": resourceParam["cond_X_USER_COUNT"],
			"cond_DL_NAME": resourceParam["cond_DL_NAME"],
			"cond_DL_SNUMBER": resourceParam["cond_DL_SNUMBER"],
			"data_DL_ZJ": "",
			"cond_DL_NUMBER": "",
			"data_RESOURCE_TAG": order.product.resourceCode,// 流量包编码
			"data_RESOURCE_ZK": order.product.price,
			"data_PACKAGE_CODE": resourceParam["data_PACKAGE_CODE"],
			"data_RESOURCE_CODE": resourceParam["data_RESOURCE_CODE"],
			"data_ZK_NAME": resourceParam["data_ZK_NAME"],
			"data_RESOURCE_NAME": resourceParam["data_RESOURCE_NAME"],
			"data_LONG": resourceParam["data_LONG"],
			"data_MONEY": resourceParam["data_MONEY"],
			"data_RES_MONEY": resourceParam["data_RES_MONEY"],
			"data_UNIT": resourceParam["data_UNIT"],
			"data_VALID_TIME_UNIT": resourceParam["data_VALID_TIME_UNIT"],
			"data_VALID_TIME": resourceParam["data_VALID_TIME"],
			"data_RESOURCE_COUNT": resourceParam["data_RESOURCE_COUNT"],
			"cond_PRINT_FLAG": resourceParam["cond_PRINT_FLAG"],
			"cond_DL_ZJ_NAME": resourceParam["cond_DL_ZJ_NAME"],
			"bsubmit1": "提 交",
			"userinfoback_ACCT_ID": resourceParam["userinfoback_ACCT_ID"],
			"userinfoback_SERIAL_NUMBER": order.phone,
			"userinfoback_PAY_NAME": resourceParam["userinfoback_PAY_NAME"],
			"userinfoback_NET_TYPE_CODE": resourceParam["userinfoback_NET_TYPE_CODE"],
			"userinfoback_SERVICE_CLASS_CODE": resourceParam["userinfoback_SERVICE_CLASS_CODE"],
			"userinfoback_USER_ID": resourceParam["userinfoback_USER_ID"],
			"userinfoback_PAY_MODE_CODE": resourceParam["userinfoback_PAY_MODE_CODE"],
			"userinfoback_ROUTE_EPARCHY_CODE": resourceParam["userinfoback_ROUTE_EPARCHY_CODE"],
			"userinfoback_PREPAY_TAG": resourceParam["userinfoback_PREPAY_TAG"],
			"userinfoback_CITY_CODE": resourceParam["userinfoback_CITY_CODE"],
			"userinfoback_PRODUCT_ID": resourceParam["userinfoback_PRODUCT_ID"],
			"userinfoback_BRAND_CODE": resourceParam["userinfoback_BRAND_CODE"],
			"cond_CREDIT_VALUE": resourceParam["cond_CREDIT_VALUE"],
			"cond_DEPOSIT_MONEY": resourceParam["cond_DEPOSIT_MONEY"],
			"cond_TOTAL_FEE": resourceParam["cond_TOTAL_FEE"],
			"X_CODING_STR": xCodingString,
			"cond_DATE": resourceParam["cond_DATE"],
			"cond_DATE1": resourceParam["cond_DATE1"],
			"cond_DATE2": resourceParam["cond_DATE2"],
			"cond_DATE3": resourceParam["cond_DATE3"],
			"cond_STAFF_ID1": resourceParam["cond_STAFF_ID1"],
			"cond_STAFF_NAME1": resourceParam["cond_STAFF_NAME1"],
			"cond_DEPART_NAME1": resourceParam["cond_DEPART_NAME1"],
			"cond_ENDDATE": resourceParam["cond_ENDDATE"],
			"cond_CUST_NAME": resourceParam["cond_CUST_NAME"],
			"cond_PSPT_TYPE_CODE": resourceParam["cond_PSPT_TYPE_CODE"],
			"cond_PSPT_ID": resourceParam["cond_PSPT_ID"],
			"cond_PSPT_ADDR": resourceParam["cond_PSPT_ADDR"],
			"cond_POST_ADDRESS": resourceParam["cond_POST_ADDRESS"],
			"cond_CONTACT": resourceParam["cond_CONTACT"],
			"cond_CONTACT_PHONE": resourceParam["cond_CONTACT_PHONE"],
			"cond_EMAIL": resourceParam["cond_EMAIL"],
			"cond_SHOWLIST": resourceParam["cond_SHOWLIST"],
			"cond_PSPT_END_DATE": resourceParam["cond_PSPT_END_DATE"],
			"cond_NET_TYPE_CODE1": resourceParam["cond_NET_TYPE_CODE1"],
			"RESOURCE_TAG": order.product.resourceCode,
			"ZK_CODE": order.product.price,
		}
	});
});

casper.then(function parseRefreshMoneyXml(){
	var chargeInfo = this.getHTML();
	rMap = RegexUtils.getResourceParam(chargeInfo) || {};
	
	resTableList.forEach(function(li){
		if(li.resourceCode == rMap['data_RESOURCE_CODE']){
			rMap['data_RESOURCE_NAME'] = li.resourceName;
		}
	});
	console.log('rMap:' + JSON.stringify(rMap));
});

//** 订购提交
casper.open('https://gz.cbss.10010.com/acctmanm',{
	method: 'post',
	headers: {
		"Accept": "text/html, application/xhtml+xml, */*",
		"Referer": 'https://gz.cbss.10010.com/acctmanm',
		"Accept-Language": "zh-CN",
		"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
		"Content-Type": "application/x-www-form-urlencoded",
		"Host": "gz.cbss.10010.com",
		"Connection": "Keep-Alive",
		"Cache-Control": "no-cache",
	},
	encoding: 'gbk',
	data: {
        "service": "direct/1/amcharge.ordergprsresource.OrderGprsRes/$Form",
        "sp": "S0",
        "Form0": resourceParam["Form0"],
        "cond_ID_TYPE": resourceParam["cond_ID_TYPE"],
        "cond_SERIAL_NUMBER": order.phone,
        "cond_NET_TYPE_CODE": resourceParam["userinfoback_NET_TYPE_CODE"],
        "cond_X_USER_COUNT": "",
        "cond_DL_NAME": "",
        "cond_DL_SNUMBER": "",
        "data_DL_ZJ": "",
        "cond_DL_NUMBER": "",
        "data_RESOURCE_TAG": order.product.resourceCode,
        "data_RESOURCE_ZK": order.product.price,
        "data_PACKAGE_CODE": resourceParam["data_PACKAGE_CODE"],
        "data_RESOURCE_CODE": rMap["data_RESOURCE_CODE"],
        "data_ZK_NAME": rMap["data_ZK_NAME"],
        "data_RESOURCE_NAME": rMap["data_RESOURCE_NAME"],
        "data_LONG": rMap["data_LONG"],
        "data_MONEY": rMap["data_MONEY"],
        "data_RES_MONEY": rMap["data_RES_MONEY"],
        "data_UNIT": rMap["data_UNIT"],
        "data_VALID_TIME_UNIT": rMap["data_VALID_TIME_UNIT"],
        "data_VALID_TIME": rMap["data_VALID_TIME"],
        "data_RESOURCE_COUNT": rMap["data_RESOURCE_COUNT"],
        "cond_PRINT_FLAG": "",
        "cond_DL_ZJ_NAME": "",
        "bsubmit1": "提 交",
        "userinfoback_ACCT_ID": resourceParam["userinfoback_ACCT_ID"],
        "userinfoback_SERIAL_NUMBER": order.phone,
        "userinfoback_PAY_NAME": resourceParam["userinfoback_PAY_NAME"],
        "userinfoback_NET_TYPE_CODE": resourceParam["userinfoback_NET_TYPE_CODE"],
        "userinfoback_SERVICE_CLASS_CODE": resourceParam["userinfoback_SERVICE_CLASS_CODE"],
        "userinfoback_USER_ID": resourceParam["userinfoback_USER_ID"],
        "userinfoback_PAY_MODE_CODE": resourceParam["userinfoback_PAY_MODE_CODE"],
        "userinfoback_ROUTE_EPARCHY_CODE": resourceParam["userinfoback_ROUTE_EPARCHY_CODE"],
        "userinfoback_PREPAY_TAG": resourceParam["userinfoback_PREPAY_TAG"],
        "userinfoback_CITY_CODE": resourceParam["userinfoback_CITY_CODE"],
        "userinfoback_PRODUCT_ID": resourceParam["userinfoback_PRODUCT_ID"],
        "userinfoback_BRAND_CODE": resourceParam["userinfoback_BRAND_CODE"],
        "cond_CREDIT_VALUE": resourceParam["cond_CREDIT_VALUE"],
        "cond_DEPOSIT_MONEY": resourceParam["cond_DEPOSIT_MONEY"],
        "cond_TOTAL_FEE": "",
        "X_CODING_STR": xCodingString,
        "cond_DATE": resourceParam["cond_DATE"],
        "cond_DATE1": resourceParam["cond_DATE1"],
        "cond_DATE2": resourceParam["cond_DATE2"],
        "cond_DATE3": resourceParam["cond_DATE3"],
        "cond_STAFF_ID1": resourceParam["cond_STAFF_ID1"],
        "cond_STAFF_NAME1": resourceParam["cond_STAFF_NAME1"],
        "cond_DEPART_NAME1": resourceParam["cond_DEPART_NAME1"],
        "cond_ENDDATE": resourceParam["cond_ENDDATE"],
        "cond_CUST_NAME": resourceParam["cond_CUST_NAME"],
        "cond_PSPT_TYPE_CODE": resourceParam["cond_PSPT_TYPE_CODE"],
        "cond_PSPT_ID": resourceParam["cond_PSPT_ID"],
        "cond_PSPT_ADDR": resourceParam["cond_PSPT_ADDR"],
        "cond_POST_ADDRESS": resourceParam["cond_POST_ADDRESS"],
        "cond_CONTACT": resourceParam["cond_CONTACT"],
        "cond_CONTACT_PHONE": resourceParam["cond_CONTACT_PHONE"],
        "cond_EMAIL": resourceParam["cond_EMAIL"],
        "cond_SHOWLIST": resourceParam["cond_SHOWLIST"],
        "cond_PSPT_END_DATE": resourceParam["cond_PSPT_END_DATE"],
        "cond_NET_TYPE_CODE1": resourceParam["cond_NET_TYPE_CODE1"],
    }
});

casper.then(function getSubmitResult(){
	var contentHtml = this.getHTML();
	var content = contentHtml.match(/.*<div class="content">(.+?)<\/div>.*/i) || [];
	if(/成功/.test(content[1] || '')){
		response.status = '成功';
		response.content = content;
	}else{
		response.status = '失败';
		response.content = content;
	}
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

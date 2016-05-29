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
var account = {
	staffId: casper.cli.options['staffId'] || '',
	departId: casper.cli.options['departId'] || '',
	provinceId: casper.cli.options['provid'] || '',
	subSysCode: '',
	epachyId: '',
	resourceParam: {},
	resTableList: {},
	rMap: {},
};

//** load cookie
var data = fs.read(tempdir + '/_cookie.txt') || "[]";

try {
	phantom.cookies = JSON.parse(data);
} catch (e) {
	console.error(e);
}
// console.log(JSON.stringify(phantom.cookies));

var homePageParams = {

};

var urls = {
	custUrl: '',
	resourceUrl: '',
};

var order = {
	phone: '',
	product: {
		name: '',
		price: 0.0,
		resourceCode: '',
	},
};

var response = {};

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.start('https://cbss.10010.com/essframe');

casper.open('https://gz.cbss.10010.com/essframe?service=page/Nav&STAFF_ID=' + account.staffId, {
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
	var navHtml = this.getHTML();
	var homePageMeta = RegexUtils.regexMatch(/<meta.*provinceId.*?>/i,navHtml);
	// console.log('homePageMeta:' + JSON.stringify(homePageMeta));
	if(homePageMeta.length > 0){
		//** 已登录
		response.meta = homePageMeta;
		response.status = '已登录';
	}else{
		//** 未登录
		response.status = '未登录';
		this.echo(JSON.stringify(response));
		casper.exit();
	}
});

casper.then(function checkMenu(){
	var navHtml = this.getHTML();
	urls.resourceUrl = RegexUtils.regexMatch(/.*clickMenuItem\(this\);openmenu\('(.+?OrderGprsRes.+?)'\).*/i,
                navHtml);
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

casper.then(function custUrl(){
	var sideBarHtml = this.getHTML();
	var custUrl = RegexUtils.regexMatch(/menuaddr="(.+?)"/i, sideBarHtml);
	if(custUrl[1] == undefined){
		console.log('没取到url');
		response.status = '用户认证异常';
		this.echo(JSON.stringify(response));
		this.exit(1);
	}
	var loginRandomCode = RegexUtils.regexMatch(/LOGIN_RANDOM_CODE=(\d+)/i, sideBarHtml);
	var loginCheckCode = RegexUtils.regexMatch(/LOGIN_CHECK_CODE=(\d+)/i, sideBarHtml);
	custUrl = custUrl.replace('&amp;', '&');
	custUrl += "&staffId=" + account.staffId
            + "&departId=" + account.deptId
            + "&subSysCode=" + account.subSysCode
            + "&eparchyCode=" + account.epachyId;
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
    urls.custUrl = custUrl;
});

//** 账务管理，流量包资源订购
casper.then(function getPackageUrl(){
	var packageUrl = "https://gz.cbss.10010.com" + urls.resourceUrl + "&staffId="
                + account.staffId + "&departId="
                + account.deptId
                + "&subSysCode=BSS&eparchyCode="
                + account.epachyId;
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
	if(content[1].length > 0){
		response.status = '用户不能订购';
		response.content = content;
		casper.echo(JSON.stringify(response));
		casper.exit(1);
	}
	//** 获得已订购列表
	//TODO ?
	var resourceList = RegexUtils.extractResourceInfo(resourceHtml);
	//** 是否有正在“处理中”的业务
	resourceList.forEach(function(resource){
		if(/处理中/.test(resource.dealTag)){
			console.log('用户有业务尚在处理中！');
			response.status = '用户有业务尚在处理中';
			response.content = JSON.stringify(resource);
			casper.echo(JSON.stringify(response));
			casper.exit();
		}
	});
	//** 可选择流量包
	//TODO ?
	var resTableList = RegexUtils.extractResTableInfo(resourceHtml);
	//** form表单参数
	var resourceParam = RegexUtils.getResourceParam(resourceHtml);
	var xCodingString = RegexUtils.getXcodingString(resTableList);
	//** 信用额度
	var creditMoney = parseFloat(resourceParam.cond_CREDIT_VALUE);
	//** 话费余额
	var dePostMoney = parseFloat(resourceParam.cond_DEPOSIT_MONEY);
	if( creditMoney + dePostMoney < parseFloat(order.price)){
		response.status = '用户余额不足';
		casper.echo(JSON.stringify(response));
		casper.exit();
	}
	account.resourceParam = resourceParam;
	account.resTableList = resTableList;
	account.xCodingString = xCodingString;
});

casper.then(function(){
	var amchargeUrl = "https://gz.cbss.10010.com/acctmanm?service=ajaxDirect/1/amcharge.ordergprsresource.OrderGprsRes"
                + "/amcharge.ordergprsresource.OrderGprsRes/javascript/refeshZK&pagename="
                + "amcharge.ordergprsresource.OrderGprsRes"
                + "&eventname=getResZKList&staffId="
                + account.staffId
                + "&departId="
                + account.deptId
                + "&subSysCode=acctmanm&eparchyCode="
                + account.epachyId
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
			"Form0": account.resourceParam["Form0"],
			"cond_ID_TYPE": account.resourceParam["cond_ID_TYPE"],
			"cond_SERIAL_NUMBER": order.phone,
			"cond_NET_TYPE_CODE": "50",
			"bquerytop": " 查 询 ",
			"cond_X_USER_COUNT": account.resourceParam["cond_X_USER_COUNT"],
			"cond_DL_NAME": account.resourceParam["cond_DL_NAME"],
			"cond_DL_SNUMBER": account.resourceParam["cond_DL_SNUMBER"],
			"data_DL_ZJ": "",
			"cond_DL_NUMBER": "",
			"data_RESOURCE_TAG": order.product.resourceCode,// 流量包编码
			"data_RESOURCE_ZK": "",
			"data_PACKAGE_CODE": account.resourceParam["data_PACKAGE_CODE"],
			"data_RESOURCE_CODE": account.resourceParam["data_RESOURCE_CODE"],
			"data_ZK_NAME": account.resourceParam["data_ZK_NAME"],
			"data_RESOURCE_NAME": account.resourceParam["data_RESOURCE_NAME"],
			"data_LONG": account.resourceParam["data_LONG"],
			"data_MONEY": account.resourceParam["data_MONEY"],
			"data_RES_MONEY": account.resourceParam["data_RES_MONEY"],
			"data_UNIT": account.resourceParam["data_UNIT"],
			"data_VALID_TIME_UNIT": account.resourceParam["data_VALID_TIME_UNIT"],
			"data_VALID_TIME": account.resourceParam["data_VALID_TIME"],
			"data_RESOURCE_COUNT": account.resourceParam["data_RESOURCE_COUNT"],
			"cond_PRINT_FLAG": account.resourceParam["cond_PRINT_FLAG"],
			"cond_DL_ZJ_NAME": account.resourceParam["cond_DL_ZJ_NAME"],
			"bsubmit1": "提 交",
			"userinfoback_ACCT_ID": account.resourceParam["userinfoback_ACCT_ID"],
			"userinfoback_SERIAL_NUMBER": order.phone,
			"userinfoback_PAY_NAME": account.resourceParam["userinfoback_PAY_NAME"],
			"userinfoback_NET_TYPE_CODE": account.resourceParam["userinfoback_NET_TYPE_CODE"],
			"userinfoback_SERVICE_CLASS_CODE": account.resourceParam["userinfoback_SERVICE_CLASS_CODE"],
			"userinfoback_USER_ID": account.resourceParam["userinfoback_USER_ID"],
			"userinfoback_PAY_MODE_CODE": account.resourceParam["userinfoback_PAY_MODE_CODE"],
			"userinfoback_ROUTE_EPARCHY_CODE": account.resourceParam["userinfoback_ROUTE_EPARCHY_CODE"],
			"userinfoback_PREPAY_TAG": account.resourceParam["userinfoback_PREPAY_TAG"],
			"userinfoback_CITY_CODE": account.resourceParam["userinfoback_CITY_CODE"],
			"userinfoback_PRODUCT_ID": account.resourceParam["userinfoback_PRODUCT_ID"],
			"userinfoback_BRAND_CODE": account.resourceParam["userinfoback_BRAND_CODE"],
			"cond_CREDIT_VALUE": account.resourceParam["cond_CREDIT_VALUE"],
			"cond_DEPOSIT_MONEY": account.resourceParam["cond_DEPOSIT_MONEY"],
			"cond_TOTAL_FEE": account.resourceParam["cond_TOTAL_FEE"],
			"X_CODING_STR": account.xCodingString,
			"cond_DATE": account.resourceParam["cond_DATE"],
			"cond_DATE1": account.resourceParam["cond_DATE1"],
			"cond_DATE2": account.resourceParam["cond_DATE2"],
			"cond_DATE3": account.resourceParam["cond_DATE3"],
			"cond_STAFF_ID1": account.resourceParam["cond_STAFF_ID1"],
			"cond_STAFF_NAME1": account.resourceParam["cond_STAFF_NAME1"],
			"cond_DEPART_NAME1": account.resourceParam["cond_DEPART_NAME1"],
			"cond_ENDDATE": account.resourceParam["cond_ENDDATE"],
			"cond_CUST_NAME": account.resourceParam["cond_CUST_NAME"],
			"cond_PSPT_TYPE_CODE": account.resourceParam["cond_PSPT_TYPE_CODE"],
			"cond_PSPT_ID": account.resourceParam["cond_PSPT_ID"],
			"cond_PSPT_ADDR": account.resourceParam["cond_PSPT_ADDR"],
			"cond_POST_ADDRESS": account.resourceParam["cond_POST_ADDRESS"],
			"cond_CONTACT": account.resourceParam["cond_CONTACT"],
			"cond_CONTACT_PHONE": account.resourceParam["cond_CONTACT_PHONE"],
			"cond_EMAIL": account.resourceParam["cond_EMAIL"],
			"cond_SHOWLIST": account.resourceParam["cond_SHOWLIST"],
			"cond_PSPT_END_DATE": account.resourceParam["cond_PSPT_END_DATE"],
			"cond_NET_TYPE_CODE1": account.resourceParam["cond_NET_TYPE_CODE1"],
			"RESOURCE_TAG": order.product.resourceCode,
    	}
    });
});

casper.then(function(){
	var packageHtml = this.getHTML();
	var priceList = RegexUtils.queryPrice(packageHtml);
	if(!priceList.contain(order.price)){
		console.log('价格不对，不能订');
		response.status = '价格不对，不能订';
		casper.echo(JSON.stringify(response));
		casper.exit();
	}
});

casper.then(function(){
	var refreshMoneyUrl =
            "https://gz.cbss.10010.com/acctmanm?service=ajaxDirect/1/amcharge.ordergprsresource.OrderGprsRes/"
                + "amcharge.ordergprsresource.OrderGprsRes/javascript/refeshMoney&pagename="
                + "amcharge.ordergprsresource.OrderGprsRes"
                + "&eventname=getOrderResInfos&staffId="
                + account.staffId
                + "&departId="
                + account.deptId
                + "&subSysCode=acctmanm&eparchyCode="
                + account.epachyId
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
			"Form0": account.resourceParam["Form0"],
			"cond_ID_TYPE": account.resourceParam["cond_ID_TYPE"],
			"cond_SERIAL_NUMBER": order.phone,
			"cond_NET_TYPE_CODE": account.resourceParam["userinfoback_NET_TYPE_CODE"],
			"bquerytop": " 查 询 ",
			"cond_X_USER_COUNT": account.resourceParam["cond_X_USER_COUNT"],
			"cond_DL_NAME": account.resourceParam["cond_DL_NAME"],
			"cond_DL_SNUMBER": account.resourceParam["cond_DL_SNUMBER"],
			"data_DL_ZJ": "",
			"cond_DL_NUMBER": "",
			"data_RESOURCE_TAG": order.product.resourceCode,// 流量包编码
			"data_RESOURCE_ZK": order.price,
			"data_PACKAGE_CODE": account.resourceParam["data_PACKAGE_CODE"],
			"data_RESOURCE_CODE": account.resourceParam["data_RESOURCE_CODE"],
			"data_ZK_NAME": account.resourceParam["data_ZK_NAME"],
			"data_RESOURCE_NAME": account.resourceParam["data_RESOURCE_NAME"],
			"data_LONG": account.resourceParam["data_LONG"],
			"data_MONEY": account.resourceParam["data_MONEY"],
			"data_RES_MONEY": account.resourceParam["data_RES_MONEY"],
			"data_UNIT": account.resourceParam["data_UNIT"],
			"data_VALID_TIME_UNIT": account.resourceParam["data_VALID_TIME_UNIT"],
			"data_VALID_TIME": account.resourceParam["data_VALID_TIME"],
			"data_RESOURCE_COUNT": account.resourceParam["data_RESOURCE_COUNT"],
			"cond_PRINT_FLAG": account.resourceParam["cond_PRINT_FLAG"],
			"cond_DL_ZJ_NAME": account.resourceParam["cond_DL_ZJ_NAME"],
			"bsubmit1": "提 交",
			"userinfoback_ACCT_ID": account.resourceParam["userinfoback_ACCT_ID"],
			"userinfoback_SERIAL_NUMBER": order.phone,
			"userinfoback_PAY_NAME": account.resourceParam["userinfoback_PAY_NAME"],
			"userinfoback_NET_TYPE_CODE": account.resourceParam["userinfoback_NET_TYPE_CODE"],
			"userinfoback_SERVICE_CLASS_CODE": account.resourceParam["userinfoback_SERVICE_CLASS_CODE"],
			"userinfoback_USER_ID": account.resourceParam["userinfoback_USER_ID"],
			"userinfoback_PAY_MODE_CODE": account.resourceParam["userinfoback_PAY_MODE_CODE"],
			"userinfoback_ROUTE_EPARCHY_CODE": account.resourceParam["userinfoback_ROUTE_EPARCHY_CODE"],
			"userinfoback_PREPAY_TAG": account.resourceParam["userinfoback_PREPAY_TAG"],
			"userinfoback_CITY_CODE": account.resourceParam["userinfoback_CITY_CODE"],
			"userinfoback_PRODUCT_ID": account.resourceParam["userinfoback_PRODUCT_ID"],
			"userinfoback_BRAND_CODE": account.resourceParam["userinfoback_BRAND_CODE"],
			"cond_CREDIT_VALUE": account.resourceParam["cond_CREDIT_VALUE"],
			"cond_DEPOSIT_MONEY": account.resourceParam["cond_DEPOSIT_MONEY"],
			"cond_TOTAL_FEE": account.resourceParam["cond_TOTAL_FEE"],
			"X_CODING_STR": account.xCodingString,
			"cond_DATE": account.resourceParam["cond_DATE"],
			"cond_DATE1": account.resourceParam["cond_DATE1"],
			"cond_DATE2": account.resourceParam["cond_DATE2"],
			"cond_DATE3": account.resourceParam["cond_DATE3"],
			"cond_STAFF_ID1": account.resourceParam["cond_STAFF_ID1"],
			"cond_STAFF_NAME1": account.resourceParam["cond_STAFF_NAME1"],
			"cond_DEPART_NAME1": account.resourceParam["cond_DEPART_NAME1"],
			"cond_ENDDATE": account.resourceParam["cond_ENDDATE"],
			"cond_CUST_NAME": account.resourceParam["cond_CUST_NAME"],
			"cond_PSPT_TYPE_CODE": account.resourceParam["cond_PSPT_TYPE_CODE"],
			"cond_PSPT_ID": account.resourceParam["cond_PSPT_ID"],
			"cond_PSPT_ADDR": account.resourceParam["cond_PSPT_ADDR"],
			"cond_POST_ADDRESS": account.resourceParam["cond_POST_ADDRESS"],
			"cond_CONTACT": account.resourceParam["cond_CONTACT"],
			"cond_CONTACT_PHONE": account.resourceParam["cond_CONTACT_PHONE"],
			"cond_EMAIL": account.resourceParam["cond_EMAIL"],
			"cond_SHOWLIST": account.resourceParam["cond_SHOWLIST"],
			"cond_PSPT_END_DATE": account.resourceParam["cond_PSPT_END_DATE"],
			"cond_NET_TYPE_CODE1": account.resourceParam["cond_NET_TYPE_CODE1"],
			"RESOURCE_TAG": order.product.resourceCode,
			"ZK_CODE": order.price,
		}
	});
});

casper.then(function(){
	var chargeInfo = this.getHTML();
	var rMap = RegexUtils.getResourceParam(chargeInfo);
	account.resTableList.forEach(function(li){
		if(li.resourceCode == rMap.data_RESOURCE_CODE){
			rMap['data_RESOURCE_NAME'] = li.resourceName;
		}
	});
	console.log('rMap:' + JSON.stringify(rMap));
	account.rMap = rMap;
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
        "Form0": account.resourceParam["Form0"],
        "cond_ID_TYPE": account.resourceParam["cond_ID_TYPE"],
        "cond_SERIAL_NUMBER": order.phone,
        "cond_NET_TYPE_CODE": account.resourceParam["userinfoback_NET_TYPE_CODE"],
        "cond_X_USER_COUNT": "",
        "cond_DL_NAME": "",
        "cond_DL_SNUMBER": "",
        "data_DL_ZJ": "",
        "cond_DL_NUMBER": "",
        "data_RESOURCE_TAG": order.product.resourceCode,
        "data_RESOURCE_ZK": order.price,
        "data_PACKAGE_CODE": account.resourceParam["data_PACKAGE_CODE"],
        "data_RESOURCE_CODE": account.rMap["data_RESOURCE_CODE"],
        "data_ZK_NAME": account.rMap["data_ZK_NAME"],
        "data_RESOURCE_NAME": account.rMap["data_RESOURCE_NAME"],
        "data_LONG": account.rMap["data_LONG"],
        "data_MONEY": account.rMap["data_MONEY"],
        "data_RES_MONEY": account.rMap["data_RES_MONEY"],
        "data_UNIT": account.rMap["data_UNIT"],
        "data_VALID_TIME_UNIT": account.rMap["data_VALID_TIME_UNIT"],
        "data_VALID_TIME": account.rMap["data_VALID_TIME"],
        "data_RESOURCE_COUNT": account.rMap["data_RESOURCE_COUNT"],
        "cond_PRINT_FLAG": "",
        "cond_DL_ZJ_NAME": "",
        "bsubmit1": "提 交",
        "userinfoback_ACCT_ID": account.resourceParam["userinfoback_ACCT_ID"],
        "userinfoback_SERIAL_NUMBER": order.phone,
        "userinfoback_PAY_NAME": account.resourceParam["userinfoback_PAY_NAME"],
        "userinfoback_NET_TYPE_CODE": account.resourceParam["userinfoback_NET_TYPE_CODE"],
        "userinfoback_SERVICE_CLASS_CODE": account.resourceParam["userinfoback_SERVICE_CLASS_CODE"],
        "userinfoback_USER_ID": account.resourceParam["userinfoback_USER_ID"],
        "userinfoback_PAY_MODE_CODE": account.resourceParam["userinfoback_PAY_MODE_CODE"],
        "userinfoback_ROUTE_EPARCHY_CODE": account.resourceParam["userinfoback_ROUTE_EPARCHY_CODE"],
        "userinfoback_PREPAY_TAG": account.resourceParam["userinfoback_PREPAY_TAG"],
        "userinfoback_CITY_CODE": account.resourceParam["userinfoback_CITY_CODE"],
        "userinfoback_PRODUCT_ID": account.resourceParam["userinfoback_PRODUCT_ID"],
        "userinfoback_BRAND_CODE": account.resourceParam["userinfoback_BRAND_CODE"],
        "cond_CREDIT_VALUE": account.resourceParam["cond_CREDIT_VALUE"],
        "cond_DEPOSIT_MONEY": account.resourceParam["cond_DEPOSIT_MONEY"],
        "cond_TOTAL_FEE": "",
        "X_CODING_STR": account.xCodingString,
        "cond_DATE": account.resourceParam["cond_DATE"],
        "cond_DATE1": account.resourceParam["cond_DATE1"],
        "cond_DATE2": account.resourceParam["cond_DATE2"],
        "cond_DATE3": account.resourceParam["cond_DATE3"],
        "cond_STAFF_ID1": account.resourceParam["cond_STAFF_ID1"],
        "cond_STAFF_NAME1": account.resourceParam["cond_STAFF_NAME1"],
        "cond_DEPART_NAME1": account.resourceParam["cond_DEPART_NAME1"],
        "cond_ENDDATE": account.resourceParam["cond_ENDDATE"],
        "cond_CUST_NAME": account.resourceParam["cond_CUST_NAME"],
        "cond_PSPT_TYPE_CODE": account.resourceParam["cond_PSPT_TYPE_CODE"],
        "cond_PSPT_ID": account.resourceParam["cond_PSPT_ID"],
        "cond_PSPT_ADDR": account.resourceParam["cond_PSPT_ADDR"],
        "cond_POST_ADDRESS": account.resourceParam["cond_POST_ADDRESS"],
        "cond_CONTACT": account.resourceParam["cond_CONTACT"],
        "cond_CONTACT_PHONE": account.resourceParam["cond_CONTACT_PHONE"],
        "cond_EMAIL": account.resourceParam["cond_EMAIL"],
        "cond_SHOWLIST": account.resourceParam["cond_SHOWLIST"],
        "cond_PSPT_END_DATE": account.resourceParam["cond_PSPT_END_DATE"],
        "cond_NET_TYPE_CODE1": account.resourceParam["cond_NET_TYPE_CODE1"],
    }
});

casper.then(function(){
	var contentHtml = this.getHTML();
	var content = contentHtml.match(/.*<div class="content">(.+?)<\/div>.*/i);
	if(/成功/.test(content[1])){
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
	this.echo(JSON.stringify(response));
	casper.exit();
});

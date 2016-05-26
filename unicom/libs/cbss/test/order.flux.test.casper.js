/**
 * 订购流量包产品
 * 
 * > casperjs order.flux.test.casper.js --ignore-ssl-errors=true 
 */

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
//** load cookie
var data = fs.read('./_tmp/_cookie.txt') || "[]";

try {
	phantom.cookies = JSON.parse(data);
} catch (e) {
	console.error(e);
}
// console.log(JSON.stringify(phantom.cookies));

var account = {
	staffId: 'B90WZSLP',
	departId: '',
	subSysCode: '',
	epachyId: '',
};

var urls = {
	custUrl: '',
	resourceUrl: '',
};

var order = {
	phone: '',
	price: 0.0,

};

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
	ecoding: 'utf8',
});

casper.then(function checkLogin(){
	var homePageHtml = this.getHTML();
	var homePageMeta = RegexUtils.regexMatchOne(/<meta.*provinceId.*?>/i,homePageHtml);
	if(homePageMeta){
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
	var homePageHtml = this.getHTML();
	account.resourceUrl = RegexUtils.regexMatchOne(/clickMenuItem\(this\);openmenu\('(.+?OrderGprsRes.+?)'/i, homePageHtml);
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
	ecoding: 'utf8',
});

casper.then(function custUrl(){
	var sideBarHtml = this.getHTML();
	var custUrl = sideBarHtml.match(/menuaddr="(.+?)".*/i) || ['',''];
	if(custUrl[1] == ''){
		console.log('没取到url');
		response.status = '用户认证异常';
		this.echo(JSON.stringify(response));
		this.exit(1);
	}
	var loginRandomCode = sideBarHtml.match(/LOGIN_RANDOM_CODE=(\d+)/i) || ['',''];
	var loginCheckCode = sideBarHtml.match(/LOGIN_CHECK_CODE=(\d+)/i) || ['',''];
	custUrl = custUrl.replace('&amp', '&');
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
    	ecoding: 'utf8',
    });
    account.custUrl = custUrl;
});

//** 账务管理，流量包资源订购
casper.then(function getPackageUrl(){
	var packageUrl = account.resourceUrl + "&staffId="
                + account.staffId + "&departId="
                + account.deptId
                + "&subSysCode=BSS&eparchyCode="
                + account.epachyId;
    casper.open("https://gz.cbss.10010.com" + packageUrl,{
    	method: 'get',
    	headers: {
    		"Accept": "text/html, application/xhtml+xml, */*",
    		"Referer": account.custUrl,
    		"Accept-Language": "zh-CN",
    		"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
    		"Content-Type": "application/x-www-form-urlencoded",
    		"Host": "gz.cbss.10010.com",
    		"Connection": "Keep-Alive",
    		"Cache-Control": "no-cache",
    	},
    	ecoding: 'utf8',
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
	ecoding: 'gbk',
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
	var content = resourceHtml.match(/<div class="content">(.+?)<\/div>/i);
	if(content){
		response.status = '用户不能订购';
		response.content = content;
		casper.echo(JSON.stringify(response));
		casper.exit(1);
	}
	//** 获得已订购列表
	//TODO ?
	var resourceList = resourceHtml.match(/<>/ig);
	//** 是否有正在“处理中”的业务
	resourceList.forEach(function(resource){
		if(/'处理中'/test(resource)){
			console.log('用户有业务尚在处理中！');
			response.status = '用户有业务尚在处理中';
			response.content = JSON.stringify(resource);
			casper.echo(JSON.stringify(response));
			casper.exit();
		}
	});
	//** 可选择流量包
	//TODO ?
	var resTableList = resourceHtml.match(/<>/ig);
	//** form表单参数
	var resourceParam = resourceHtml.match(/<>/ig);
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
		ecoding: 'gbk',
		data: {
			"Form0": resourceParam.get("Form0"),
			"cond_ID_TYPE": resourceParam.get("cond_ID_TYPE"),
			"cond_SERIAL_NUMBER", phone,
			"cond_NET_TYPE_CODE": "50",
			"bquerytop": " 查 询 ",
			"cond_X_USER_COUNT": resourceParam.get("cond_X_USER_COUNT"),
			"cond_DL_NAME": resourceParam.get("cond_DL_NAME"),
			"cond_DL_SNUMBER": resourceParam.get("cond_DL_SNUMBER"),
			"data_DL_ZJ": "",
			"cond_DL_NUMBER": "",
			"data_RESOURCE_TAG": resourceCode,// 流量包编码
			"data_RESOURCE_ZK": "",
			"data_PACKAGE_CODE": resourceParam.get("data_PACKAGE_CODE"),
			"data_RESOURCE_CODE": resourceParam.get("data_RESOURCE_CODE"),
			"data_ZK_NAME": resourceParam.get("data_ZK_NAME"),
			"data_RESOURCE_NAME": resourceParam.get("data_RESOURCE_NAME"),
			"data_LONG": resourceParam.get("data_LONG"),
			"data_MONEY": resourceParam.get("data_MONEY"),
			"data_RES_MONEY": resourceParam.get("data_RES_MONEY"),
			"data_UNIT": resourceParam.get("data_UNIT"),
			"data_VALID_TIME_UNIT": resourceParam.get("data_VALID_TIME_UNIT"),
			"data_VALID_TIME": resourceParam.get("data_VALID_TIME"),
			"data_RESOURCE_COUNT": resourceParam.get("data_RESOURCE_COUNT"),
			"cond_PRINT_FLAG": resourceParam.get("cond_PRINT_FLAG"),
			"cond_DL_ZJ_NAME": resourceParam.get("cond_DL_ZJ_NAME"),
			"bsubmit1": "提 交",
			"userinfoback_ACCT_ID": resourceParam.get("userinfoback_ACCT_ID"),
			"userinfoback_SERIAL_NUMBER", phone,
			"userinfoback_PAY_NAME": resourceParam.get("userinfoback_PAY_NAME"),
			"userinfoback_NET_TYPE_CODE": resourceParam.get("userinfoback_NET_TYPE_CODE"),
			"userinfoback_SERVICE_CLASS_CODE": resourceParam.get("userinfoback_SERVICE_CLASS_CODE"),
			"userinfoback_USER_ID": resourceParam.get("userinfoback_USER_ID"),
			"userinfoback_PAY_MODE_CODE": resourceParam.get("userinfoback_PAY_MODE_CODE"),
			"userinfoback_ROUTE_EPARCHY_CODE": resourceParam.get("userinfoback_ROUTE_EPARCHY_CODE"),
			"userinfoback_PREPAY_TAG": resourceParam.get("userinfoback_PREPAY_TAG"),
			"userinfoback_CITY_CODE": resourceParam.get("userinfoback_CITY_CODE"),
			"userinfoback_PRODUCT_ID": resourceParam.get("userinfoback_PRODUCT_ID"),
			"userinfoback_BRAND_CODE": resourceParam.get("userinfoback_BRAND_CODE"),
			"cond_CREDIT_VALUE": resourceParam.get("cond_CREDIT_VALUE"),
			"cond_DEPOSIT_MONEY": resourceParam.get("cond_DEPOSIT_MONEY"),
			"cond_TOTAL_FEE": resourceParam.get("cond_TOTAL_FEE"),
			"X_CODING_STR", xCodingString,
			"cond_DATE": resourceParam.get("cond_DATE"),
			"cond_DATE1": resourceParam.get("cond_DATE1"),
			"cond_DATE2": resourceParam.get("cond_DATE2"),
			"cond_DATE3": resourceParam.get("cond_DATE3"),
			"cond_STAFF_ID1": resourceParam.get("cond_STAFF_ID1"),
			"cond_STAFF_NAME1": resourceParam.get("cond_STAFF_NAME1"),
			"cond_DEPART_NAME1": resourceParam.get("cond_DEPART_NAME1"),
			"cond_ENDDATE": resourceParam.get("cond_ENDDATE"),
			"cond_CUST_NAME": resourceParam.get("cond_CUST_NAME"),
			"cond_PSPT_TYPE_CODE": resourceParam.get("cond_PSPT_TYPE_CODE"),
			"cond_PSPT_ID": resourceParam.get("cond_PSPT_ID"),
			"cond_PSPT_ADDR": resourceParam.get("cond_PSPT_ADDR"),
			"cond_POST_ADDRESS": resourceParam.get("cond_POST_ADDRESS"),
			"cond_CONTACT": resourceParam.get("cond_CONTACT"),
			"cond_CONTACT_PHONE": resourceParam.get("cond_CONTACT_PHONE"),
			"cond_EMAIL": resourceParam.get("cond_EMAIL"),
			"cond_SHOWLIST": resourceParam.get("cond_SHOWLIST"),
			"cond_PSPT_END_DATE": resourceParam.get("cond_PSPT_END_DATE"),
			"cond_NET_TYPE_CODE1": resourceParam.get("cond_NET_TYPE_CODE1"),
			"RESOURCE_TAG": resourceCode,
    	}
    );
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
		ecoding: 'gbk',
		data: {
			"Form0": resourceParam.get("Form0"),
			"cond_ID_TYPE": resourceParam.get("cond_ID_TYPE"),
			"cond_SERIAL_NUMBER", phone,
			"cond_NET_TYPE_CODE": resourceParam.get("userinfoback_NET_TYPE_CODE"),
			"bquerytop": " 查 询 ",
			"cond_X_USER_COUNT": resourceParam.get("cond_X_USER_COUNT"),
			"cond_DL_NAME": resourceParam.get("cond_DL_NAME"),
			"cond_DL_SNUMBER": resourceParam.get("cond_DL_SNUMBER"),
			"data_DL_ZJ": "",
			"cond_DL_NUMBER": "",
			"data_RESOURCE_TAG": resourceCode,// 流量包编码
			"data_RESOURCE_ZK", order.price,
			"data_PACKAGE_CODE": resourceParam.get("data_PACKAGE_CODE"),
			"data_RESOURCE_CODE": resourceParam.get("data_RESOURCE_CODE"),
			"data_ZK_NAME": resourceParam.get("data_ZK_NAME"),
			"data_RESOURCE_NAME": resourceParam.get("data_RESOURCE_NAME"),
			"data_LONG": resourceParam.get("data_LONG"),
			"data_MONEY": resourceParam.get("data_MONEY"),
			"data_RES_MONEY": resourceParam.get("data_RES_MONEY"),
			"data_UNIT": resourceParam.get("data_UNIT"),
			"data_VALID_TIME_UNIT": resourceParam.get("data_VALID_TIME_UNIT"),
			"data_VALID_TIME": resourceParam.get("data_VALID_TIME"),
			"data_RESOURCE_COUNT": resourceParam.get("data_RESOURCE_COUNT"),
			"cond_PRINT_FLAG": resourceParam.get("cond_PRINT_FLAG"),
			"cond_DL_ZJ_NAME": resourceParam.get("cond_DL_ZJ_NAME"),
			"bsubmit1": "提 交",
			"userinfoback_ACCT_ID": resourceParam.get("userinfoback_ACCT_ID"),
			"userinfoback_SERIAL_NUMBER": order.phone,
			"userinfoback_PAY_NAME": resourceParam.get("userinfoback_PAY_NAME"),
			"userinfoback_NET_TYPE_CODE": resourceParam.get("userinfoback_NET_TYPE_CODE"),
			"userinfoback_SERVICE_CLASS_CODE": resourceParam.get("userinfoback_SERVICE_CLASS_CODE"),
			"userinfoback_USER_ID": resourceParam.get("userinfoback_USER_ID"),
			"userinfoback_PAY_MODE_CODE": resourceParam.get("userinfoback_PAY_MODE_CODE"),
			"userinfoback_ROUTE_EPARCHY_CODE": resourceParam.get("userinfoback_ROUTE_EPARCHY_CODE"),
			"userinfoback_PREPAY_TAG": resourceParam.get("userinfoback_PREPAY_TAG"),
			"userinfoback_CITY_CODE": resourceParam.get("userinfoback_CITY_CODE"),
			"userinfoback_PRODUCT_ID": resourceParam.get("userinfoback_PRODUCT_ID"),
			"userinfoback_BRAND_CODE": resourceParam.get("userinfoback_BRAND_CODE"),
			"cond_CREDIT_VALUE": resourceParam.get("cond_CREDIT_VALUE"),
			"cond_DEPOSIT_MONEY": resourceParam.get("cond_DEPOSIT_MONEY"),
			"cond_TOTAL_FEE": resourceParam.get("cond_TOTAL_FEE"),
			"X_CODING_STR": xCodingString,
			"cond_DATE": resourceParam.get("cond_DATE"),
			"cond_DATE1": resourceParam.get("cond_DATE1"),
			"cond_DATE2": resourceParam.get("cond_DATE2"),
			"cond_DATE3": resourceParam.get("cond_DATE3"),
			"cond_STAFF_ID1": resourceParam.get("cond_STAFF_ID1"),
			"cond_STAFF_NAME1": resourceParam.get("cond_STAFF_NAME1"),
			"cond_DEPART_NAME1": resourceParam.get("cond_DEPART_NAME1"),
			"cond_ENDDATE": resourceParam.get("cond_ENDDATE"),
			"cond_CUST_NAME": resourceParam.get("cond_CUST_NAME"),
			"cond_PSPT_TYPE_CODE": resourceParam.get("cond_PSPT_TYPE_CODE"),
			"cond_PSPT_ID": resourceParam.get("cond_PSPT_ID"),
			"cond_PSPT_ADDR": resourceParam.get("cond_PSPT_ADDR"),
			"cond_POST_ADDRESS": resourceParam.get("cond_POST_ADDRESS"),
			"cond_CONTACT": resourceParam.get("cond_CONTACT"),
			"cond_CONTACT_PHONE": resourceParam.get("cond_CONTACT_PHONE"),
			"cond_EMAIL": resourceParam.get("cond_EMAIL"),
			"cond_SHOWLIST": resourceParam.get("cond_SHOWLIST"),
			"cond_PSPT_END_DATE": resourceParam.get("cond_PSPT_END_DATE"),
			"cond_NET_TYPE_CODE1": resourceParam.get("cond_NET_TYPE_CODE1"),
			"RESOURCE_TAG": resourceCode,
			"ZK_CODE": order.price,
		}
	);
});

casper.then(function(){
	var chargeInfo = this.getHTML();
	var rMap = RegexUtils.getResourceParam(chargeInfo);
	forEach(resTableList, function(li){
		if(li.resourceCode == rMap.data_RESOURCE_CODE){
			rMap.data_RESOURCE_NAME = li.resourceName;
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
	ecoding: 'gbk',
	data: {
        "service": "direct/1/amcharge.ordergprsresource.OrderGprsRes/$Form",
        "sp": "S0",
        "Form0": resourceParam.get("Form0"),
        "cond_ID_TYPE": resourceParam.get("cond_ID_TYPE"),
        "cond_SERIAL_NUMBER", phone,
        "cond_NET_TYPE_CODE": resourceParam.get("userinfoback_NET_TYPE_CODE"),
        "cond_X_USER_COUNT": "",
        "cond_DL_NAME": "",
        "cond_DL_SNUMBER": "",
        "data_DL_ZJ": "",
        "cond_DL_NUMBER": "",
        "data_RESOURCE_TAG": resourceCode,
        "data_RESOURCE_ZK", order.price,
        "data_PACKAGE_CODE": resourceParam.get("data_PACKAGE_CODE"),
        "data_RESOURCE_CODE": rMap.get("data_RESOURCE_CODE"),
        "data_ZK_NAME": rMap.get("data_ZK_NAME"),
        "data_RESOURCE_NAME": rMap.get("data_RESOURCE_NAME"),
        "data_LONG": rMap.get("data_LONG"),
        "data_MONEY": rMap.get("data_MONEY"),
        "data_RES_MONEY": rMap.get("data_RES_MONEY"),
        "data_UNIT": rMap.get("data_UNIT"),
        "data_VALID_TIME_UNIT": rMap.get("data_VALID_TIME_UNIT"),
        "data_VALID_TIME": rMap.get("data_VALID_TIME"),
        "data_RESOURCE_COUNT": rMap.get("data_RESOURCE_COUNT"),
        "cond_PRINT_FLAG": "",
        "cond_DL_ZJ_NAME": "",
        "bsubmit1": "提 交",
        "userinfoback_ACCT_ID": resourceParam.get("userinfoback_ACCT_ID"),
        "userinfoback_SERIAL_NUMBER", phone,
        "userinfoback_PAY_NAME": resourceParam.get("userinfoback_PAY_NAME"),
        "userinfoback_NET_TYPE_CODE": resourceParam.get("userinfoback_NET_TYPE_CODE"),
        "userinfoback_SERVICE_CLASS_CODE": resourceParam.get("userinfoback_SERVICE_CLASS_CODE"),
        "userinfoback_USER_ID": resourceParam.get("userinfoback_USER_ID"),
        "userinfoback_PAY_MODE_CODE": resourceParam.get("userinfoback_PAY_MODE_CODE"),
        "userinfoback_ROUTE_EPARCHY_CODE": resourceParam.get("userinfoback_ROUTE_EPARCHY_CODE"),
        "userinfoback_PREPAY_TAG": resourceParam.get("userinfoback_PREPAY_TAG"),
        "userinfoback_CITY_CODE": resourceParam.get("userinfoback_CITY_CODE"),
        "userinfoback_PRODUCT_ID": resourceParam.get("userinfoback_PRODUCT_ID"),
        "userinfoback_BRAND_CODE": resourceParam.get("userinfoback_BRAND_CODE"),
        "cond_CREDIT_VALUE": resourceParam.get("cond_CREDIT_VALUE"),
        "cond_DEPOSIT_MONEY": resourceParam.get("cond_DEPOSIT_MONEY"),
        "cond_TOTAL_FEE": "",
        "X_CODING_STR", xCodingString,
        "cond_DATE": resourceParam.get("cond_DATE"),
        "cond_DATE1": resourceParam.get("cond_DATE1"),
        "cond_DATE2": resourceParam.get("cond_DATE2"),
        "cond_DATE3": resourceParam.get("cond_DATE3"),
        "cond_STAFF_ID1": resourceParam.get("cond_STAFF_ID1"),
        "cond_STAFF_NAME1": resourceParam.get("cond_STAFF_NAME1"),
        "cond_DEPART_NAME1": resourceParam.get("cond_DEPART_NAME1"),
        "cond_ENDDATE": resourceParam.get("cond_ENDDATE"),
        "cond_CUST_NAME": resourceParam.get("cond_CUST_NAME"),
        "cond_PSPT_TYPE_CODE": resourceParam.get("cond_PSPT_TYPE_CODE"),
        "cond_PSPT_ID": resourceParam.get("cond_PSPT_ID"),
        "cond_PSPT_ADDR": resourceParam.get("cond_PSPT_ADDR"),
        "cond_POST_ADDRESS": resourceParam.get("cond_POST_ADDRESS"),
        "cond_CONTACT": resourceParam.get("cond_CONTACT"),
        "cond_CONTACT_PHONE": resourceParam.get("cond_CONTACT_PHONE"),
        "cond_EMAIL": resourceParam.get("cond_EMAIL"),
        "cond_SHOWLIST": resourceParam.get("cond_SHOWLIST"),
        "cond_PSPT_END_DATE": resourceParam.get("cond_PSPT_END_DATE"),
        "cond_NET_TYPE_CODE1": resourceParam.get("cond_NET_TYPE_CODE1"),
});

casper.then(function(){
	var contentHtml = this.getHTML();
	var content = contentHtml.match(/<div class=\"content\">(.+?)</div>/i);
	if(/成功/.test(content)){
		response.status = '成功';
	}else{
		response.status = '失败';
		response.content = content;
	}
});

//** save cookies
casper.then(function saveCookie(){
	var cookies = JSON.stringify(phantom.cookies);
	// this.echo(JSON.stringify(phantom.cookies));
	fs.write('./_tmp/_cookie.txt', cookies, 644);
});

casper.run(function(){
	this.echo(JSON.stringify(response));
	casper.exit();
});

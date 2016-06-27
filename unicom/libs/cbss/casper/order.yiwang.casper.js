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

casper.on('resource.requested',function(resource){
	if(!/\.(css|gif|png|jpg)$/.test(resource.url)){
		if(false) fs.write(tempdir + '/' + staffId + '_yiwang_request.txt', '['+ resource.id + '] '+ resource.url + ': ' + JSON.stringify(resource) + '\n', 'a');
	}
});

casper.on('resource.error',function(resource){
	if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_remote_message.txt', 'resource.error: ' + resource.url + '\n','a');
});

casper.on('remote.message', function(message){
	if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_remote_message.txt', message,'a');
});

casper.on('remote.alert', function(message){
	if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_remote_message.txt', message,'a');
});

phantom.cookiesEnabled = true;

//** setup params
console.log(JSON.stringify(casper.cli.options));
var debug = casper.cli.options['debug'] || false;
var tempdir = casper.cli.options['tempdir'] || './_tmp';
//** 是否是开发模式
var devMode = (!!casper.cli.options['release'] || casper.cli.options['release'] == 'true') ? false : true; //** 是否是开发模式

var staffId = casper.cli.options['staffId'] || '';

var order = {
	phone: casper.cli.options['phone'] || '',
	product: {
		name: casper.cli.options['prod_name'] || '',
		price: casper.cli.options['prod_price'] || '',
		code: casper.cli.options['prod_code'] || '',
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
			response.status = 'login';
			response.message = '已登录';
		}else{
			//** 未登录
		    response.login = false;
			response.status = 'logout';
			response.message = '未登录';
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
		if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_frameNav.html', navHtml, 644);
		if(devMode) casper.capture(tempdir + '/' + staffId + '_yiwang_frameNav.jpg');
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
			if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_frameSidebar.html', sideBarHtml, 644);

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
    	if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_custAuthMain.html', custAuthMainHtml, 644);
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
	casper.then(function patchScipts(){
		casper.page.injectJs('../casper/js/patch/public.js');
		casper.page.injectJs('../casper/js/patch/ajax.js');
		casper.page.injectJs('../casper/js/patch/Cs.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/Win.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/TabSet.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/LookupCombo.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/tipster.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/Light.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/Trade.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/PageFlow.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/LayoutHelper.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/Product.js');
		casper.page.injectJs('../casper/js/patch/Product.js');
		casper.page.injectJs('../casper/js/app/popupdialog/PopMobileInfo.js');
		casper.page.injectJs('../casper/js/app/personalserv/changeelement/ChangeElement.js');
		casper.page.injectJs('../casper/js/app/personalserv/createuser/CreateUserOther.js');
		casper.page.injectJs('../casper/js/patch/debug.js');

		casper.then(function init(){
			casper.evaluate(function(){
				pagevisit = getPageVisit();
				codeBase = '/WebTools.CAB#version=1,4';
				_baudRate = 1200;
				nowTip = docTip;
				// completePageLoad();
				Cs.ctrl.Web.init();
				// Cs.ctrl.Web.dealTradeMsg();
				Cs.ctrl.Trade.init();
			});
		});
	});	
	casper.then(function parseYiwangHtml(){
		var yiwangHtml = this.getHTML();
		if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_pageForm.html', yiwangHtml, 644);
		if(devMode) casper.capture(tempdir + '/' + staffId + '_yiwang_pageForm.jpg');
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

	casper.wait(2000);

	casper.then(function patchScipts(){
		casper.page.injectJs('../casper/js/patch/public.js');
		casper.page.injectJs('../casper/js/patch/ajax.js');
		casper.page.injectJs('../casper/js/patch/Cs.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/Win.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/TabSet.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/LookupCombo.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/tipster.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/Light.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/Trade.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/PageFlow.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/LayoutHelper.js');
		casper.page.injectJs('../casper/js/scripts-custserv/core/Product.js');
		casper.page.injectJs('../casper/js/patch/Product.js');
		casper.page.injectJs('../casper/js/app/popupdialog/PopMobileInfo.js');
		casper.page.injectJs('../casper/js/app/personalserv/changeelement/ChangeElement.js');
		casper.page.injectJs('../casper/js/patch/ChangeElement.js');
		casper.page.injectJs('../casper/js/app/personalserv/createuser/CreateUserOther.js');
		casper.page.injectJs('../casper/js/patch/debug.js');

		casper.then(function init(){
			casper.evaluate(function(){
				pagevisit = getPageVisit();
				codeBase = '/WebTools.CAB#version=1,4';
				_baudRate = 1200;
				nowTip = docTip;
				// completePageLoad();
				Cs.ctrl.Web.init();
				// Cs.ctrl.Web.dealTradeMsg();
				Cs.ctrl.Trade.init();
				// Cs.ctrl.Trade.afterQuery();

			});
		});
	});	

	casper.then(function waitUser(){
		casper.waitFor(function processing(){
			return casper.evaluate(function(){
				var userNameNode = document.querySelector('#CUST_NAME');
				var userName = userNameNode && userNameNode.getAttribute('value') || '';
				return ((userName == '') ? false : true);
			});
		},null,function custNotFound(){
			var contentHtml = this.getHTML();
			if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_pageFormUpdatedTimeout.html', contentHtml, 644);
			if(devMode) casper.capture(tempdir + '/' + staffId + '_yiwang_pageFormUpdatedTimeout.jpg');
			response.code = 40130;
			response.status = 'judge';
			response.message = '失败: 该用户不能办理业务';
			casper.echo('<response>' + JSON.stringify(response) + '</response>');
			casper.exit(0);
			casper.bypass(99);	
		},10000);
	});

	casper.then(function parseUpdatedYiwangHtml(){
		var resourceHtml = this.getHTML();
		if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_pageFormUpdated.html', resourceHtml, 644);
		if(devMode) casper.capture(tempdir + '/' + staffId + '_yiwang_pageFormUpdated.jpg');
		var hasChecked = casper.evaluate(function(productCode){
			var kId = productCode.indexOf('k');
			var productId = productCode.slice(0,kId);
			var productNode = document.querySelector('input#_p' + productId);
			return (productNode && productNode.hasAttribute('checked')) || false;
		},order.product.code);
		//** 用户已经订购过
		if(hasChecked){
			response.code = 40160;
			response.status = 'judge';
			response.message = '失败: 该用户已经办理过该业务。';
			casper.echo('<response>' + JSON.stringify(response) + '</response>');
			casper.exit(0);
			casper.bypass(99);
		}
	});
});

casper.then(function expandPackageList(){
	casper.evaluate(function(productCode){
		var kId = productCode.indexOf('k');
		var productId = productCode.slice(0,kId);
		var productInputNode = document.querySelector('input#_p' + productId);
		console.log('productInputNode: ' + '\n\n');
		console.log(productInputNode.outerHTML + '\n\n');
		var productExpandNode = document.querySelector('img#closeopen' + productId);
		console.log('productExpandNode: ' + '\n\n');
		console.log(productExpandNode.outerHTML + '\n\n');
		//** 点击展开产品包
		__utils__.click('img#closeopen' + productId);
	},order.product.code);

});

casper.then(function expandProductList(){
	casper.evaluate(function(productCode){
		var kId = productCode.indexOf('k');
		var productId = productCode.slice(0,kId);
		var productExpand1 = document.querySelector('div#p' + productId);
		console.log('productExpand1: ' + '\n\n');
		console.log(productExpand1.outerHTML + '\n\n');
		var eId = productCode.indexOf('e');
		var packageId = productCode.slice(0,eId);
		//** 点击展开产品
		__utils__.click('img#closeopen' + packageId);
	},order.product.code);

});

casper.then(function setProduct(){
	casper.evaluate(function(productCode){
		var eId = productCode.indexOf('e');
		var packageId = productCode.slice(0,eId);
		var productExpand2 = document.querySelector('div#p' + packageId);
		console.log('productExpand2: ' + '\n\n');
		console.log(productExpand2.outerHTML + '\n\n');
		//** 点击产品包
		__utils__.click('input#_p' + productCode);
		var packageClicked = document.querySelector('div#p' + productCode);
		console.log('packageClicked: ' + '\n\n');
		console.log(packageClicked.outerHTML + '\n\n');
	},order.product.code);
});

casper.then(function submit(){
	var devServer = '';
	if(devMode){
		console.log('++++++++setDevelopmentUrl ++++++\n');
		//** 开发阶段，设置提交到测试地址。
		//注意：正式上线时，设置devMode = false
		devServer = 'http://localhost:9200/post';
	}
	casper.evaluate(function cutInAjax(devServer){
		//** 接管 ajax 后续请求处理
		Cs.Ajax._swallow =function(page, listener ,options, msg){
		    var g = Cs.ctrl.Web.getTradeGlobal();
		    servletPath = g.servletPath;   
		    
		    var pageName = page||"";
		    if (pageName.blank()){
		        pageName = g.pageName;
		    }
		    
		    Cs.ctrl.Web.showInfo(msg||"正在处理，请稍候...");
		    
		    var u = servletPath+"?service=swallow/"+pageName+"/"+listener+"/1";

		    console.log('--Cs.Ajax._swallow 请求url = ');
		    console.log(u + '\n\n');
		    u = devServer + u;
		    options.onComplete = function(transport){
		    		//<?xml version="1.0" encoding="UTF-8"?><root><message></message><TradeSubmitOk tradeId='8516062231226597' RIGHT_CODE='csChangeServiceTrade' subscribeId='8516062231226597' proviceOrderId='8516062231226597'><Fee feenum='0'></Fee><TradeData prepayTag="1" tradeTypeCode="0120" strisneedprint="1" serialNumber="15692740700" tradeReceiptInfo="[{&quot;RECEIPT_INFO5&quot;:&quot;&quot;,&quot;RECEIPT_INFO2&quot;:&quot;&quot;,&quot;RECEIPT_INFO1&quot;:&quot;&quot;,&quot;RECEIPT_INFO4&quot;:&quot;&quot;,&quot;RECEIPT_INFO3&quot;:&quot;&quot;}]" netTypeCode="0050"/></TradeSubmitOk></root>
		    	    console.log('==== doSubmitTrade 响应: ====\n');
		    	    console.log(transport.responseText);
		    	    var body = transport.responseText || '';
			    	//** for development
			    	//** 开发用假数据
			    	//** body = '<?xml version="1.0" encoding="UTF-8"?><root><message></message><TradeSubmitOk tradeId="8516062231226597" RIGHT_CODE="csChangeServiceTrade" subscribeId="8516062231226597" proviceOrderId="8516062231226597"><Fee feenum="0"></Fee><TradeData prepayTag="1" tradeTypeCode="0120" strisneedprint="1" serialNumber="15692740700" tradeReceiptInfo="[{&quot;RECEIPT_INFO5&quot;:&quot;&quot;,&quot;RECEIPT_INFO2&quot;:&quot;&quot;,&quot;RECEIPT_INFO1&quot;:&quot;&quot;,&quot;RECEIPT_INFO4&quot;:&quot;&quot;,&quot;RECEIPT_INFO3&quot;:&quot;&quot;}]" netTypeCode="0050"/></TradeSubmitOk></root>';
			    	var tradeId = (body.match(/tradeId=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
			    	console.log('\ntradeId: ' + tradeId);
			    	// if(tradeId == ''){
			    	// 	Cs.ctrl.Web.showInfo("处理失败: doSubmitTrade响应错误");
			    	// 	return;
			    	// }
			    	var serialNumber = (body.match(/serialNumber=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
			    	var netTypeCodeAll = (body.match(/netTypeCode=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
			    	var tradeTypeCode = (body.match(/tradeTypeCode=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
			    	var prepayTag = (body.match(/prepayTag=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
			    	var strisneedprint = (body.match(/strisneedprint=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
			    	var tradeReceiptInfo = ((body.match(/tradeReceiptInfo=(\'|\")(.*?)(\'|\")/i) || [])[2] || '').replace(/&quot;/ig,'"');
			    	var custNameNode = document.querySelector('#CUST_NAME');
			    	var custName = (custNameNode && custNameNode.getAttribute('value')) || '';
			    	var custIdNode = document.querySelector('#_CUST_ID');
			    	var custId = (custIdNode && custIdNode.getAttribute('value')) || '';
			    	var userIdNode = document.querySelector('#USER_ID_HIDEN');
			    	var userId = (userIdNode && userIdNode.getAttribute('value')) || '';
			    	var acctIdNode = document.querySelector('#ACCT_ID');
			    	var acctId = (acctIdNode && acctIdNode.getAttribute('value')) || '';
			    	var netTypeCodeNode = document.querySelector('#NET_TYPE_CODE');
			    	var netTypeCode = (netTypeCodeNode && netTypeCodeNode.getAttribute('value')) || '';

				    var params = '';
				    params += 'cancelTag=false' + '&';
				    params += 'funcType=0' + '&';
				    params += 'dataType=0' + '&';
				    var tradeMain =  {};
				    tradeMain.TRADE_ID = tradeId;
				    tradeMain.TRADE_TYPE = '移网产品/服务变更';
				    tradeMain.SERIAL_NUMBER = serialNumber;
				    tradeMain.TRADE_FEE = '0.00';
				    tradeMain.CUST_NAME = custName;
				    tradeMain.CUST_ID = custId;
		            tradeMain.USER_ID = userId;
		            tradeMain.ACCT_ID = acctId;
		            tradeMain.NET_TYPE_CODE = netTypeCode;
		            tradeMain.TRADE_TYPE_CODE = encodeURIComponent(tradeTypeCode || '');
		            params += 'tradeMain=' + encodeURIComponent('[' + JSON.stringify(tradeMain) + ']') + '&';
		            params += 'fees=' + encodeURIComponent('[]') + '&';
		            params += 'unChargedfees=' + encodeURIComponent('[]') + '&';
		            params += 'feePayMoney=' + encodeURIComponent('[]') + '&';
		            params += 'feeCheck=' + encodeURIComponent('[]') + '&';
		            params += 'feePos=' + encodeURIComponent('[]') + '&';
				    params += 'DerateFee=false' + '&';
		            var base = {};
		            base.preayTag = prepayTag;
		            base.tradeTypeCode = encodeURIComponent(tradeTypeCode || '');
		            base.strisneedprint = strisneedprint;
		            base.serialNumber = serialNumber;
		            base.tradeReceiptInfo = tradeReceiptInfo;
		            base.netTypeCode = netTypeCodeAll;
		            params += 'base=' + encodeURIComponent(JSON.stringify(base) || '') + '&';
		            params += 'CASH=' + encodeURIComponent('0.00') + '&'; 
		            params += 'SEND_TYPE=0' + '&';
		            params += 'TRADE_ID=' + tradeId + '&';
		            params += 'TRADE_ID_MORE_STR=' + tradeId + '&';
		            params += 'SERIAL_NUMBER_STR=' + serialNumber + '&';
		            params += 'TRADE_TYPE_CODE_STR=' + tradeTypeCode + '&';
		            params += 'NET_TYPE_CODE_STR=' + netTypeCode + '&';
		            params += 'DEBUTY_CODE='  + '&';
		            params += 'IS_NEED_WRITE_CARD=false' + '&';
		            params += 'WRAP_TRADE_TYPE=tradeType' + '&';
		            params += 'CUR_TRADE_IDS=' + '&';
		            params += 'CUR_TRADE_TYPE_CODES=' + '&';
		            params += 'CUR_SERIAL_NUMBERS=' + '&';
		            params += 'CUR_NET_TYPE_CODES=' + '&';
		            params += 'isAfterFee=' + '&';
		            params += 'globalPageName=personalserv.dealtradefee.DealTradeFee';
		            console.log('\n----continueTrade POST params:' + params);
		            var continueTradeUrl = devServer + '/custserv?service=swallow/personalserv.dealtradefee.DealTradeFee/continueTradeReg/1';
				    new Ajax.Request(continueTradeUrl,{
			            parameters: params,            
			            method: 'post',        
			            asynchronous: true,            
			            onComplete: function(transport){
			            	console.log('==== continueTrade 响应: ====\n');
			            	console.log(transport.responseText);
			            	//** <?xml version="1.0" encoding="UTF-8"?><root><continueOK SATISSURVFLAG="false" HAS_TERMINAL="false" HAS_GIF="false" ISCREATE_CUST="false" IS_NEED_OCCUPY="true" ISZHIFUPINGTAI="false" ISPAPERLESSSTATE="false" IS_NEED_WRITE_CARD="false" IS_NET_TYPE_CODE="50" strNetTypeFirst="0050" IS_DEAL_AFTER_ORDERSUB="true" TRADE_ID_ORDERSUB="8516062333053246" TRADE_TYPE_CODE_ORDERSUB="0120" IS_TAXPAYER="0" RSP_CODE_FORDZQ=" CALCULATE_ID="><data/></continueOK></root>
			            	var body = transport.responseText || '';
			            	var content = (body.match(/IS_NEED_OCCUPY=(\'|\")(.*?)(\'|\")/i) || [])[2] || false;
			            	if(/true/.test(content)){
				            	Cs.ctrl.Web.showInfo("处理成功");
			            	}else{
			            		Cs.ctrl.Web.showInfo("处理失败");
			            	}
			            	
			            }
			        });
			    };
		    new Ajax.Request(u,options);
		};
	},devServer);

	casper.then(function beforeSubmit(){
		var contentHtml = this.getHTML();
		if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_beforeSubmit.html', contentHtml, 644);
		if(devMode) casper.capture(tempdir + '/' + staffId + '_yiwang_beforeSubmit.jpg');
	});
	//** 提交表单
	casper.then(function clickSubmit(){
		casper.evaluate(function(){
			Cs.ctrl.Trade.doBeforeSubmitCheckHack();
			Cs.ctrl.Trade.doBeforeSubmitCheckCustId();
			Cs.ctrl.Trade.doBeforeSubmit('otherCheckCustId');
			Cs.ctrl.Trade.doSubmitTrade();
			// __utils__.click('input#submitTrade');
			// Cs.ctrl.Trade.doSubmitTrade();
		});
	});
	// casper.wait(10000);
});

casper.then(function waitSubmitProcessing(){
	casper.waitFor(function processing(){
		return casper.evaluate(function(){
			var waitNode = document.querySelector('#_waitInfoContent');
			return (!/请稍候/.test(waitNode.innerText || ''));
		});
	},null,function(){
		var contentHtml = this.getHTML();
		if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_SubmitTimeout.html', contentHtml, 644);
		if(devMode) casper.capture(tempdir + '/' + staffId + '_yiwang_SubmitTimeout.jpg');
		response.code = 40150;
		response.status = 'judge';
		response.message = '超时错误：正在处理，请稍候...';
		// casper.echo('<response>' + JSON.stringify(response) + '</response>');
		// casper.exit(0);
		// casper.bypass(99);	
	},10000);
});

casper.then(function getSubmitResult(){
	var contentHtml = this.getHTML();
	if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_SubmitResult.html', contentHtml, 644);
	if(devMode) casper.capture(tempdir + '/' + staffId + '_yiwang_SubmitResult.jpg');


	var statusText = casper.evaluate(function(){
		var resultNode = document.querySelector('#_waitInfoContent');
		return resultNode.innerText;
	});
	var resultText = casper.evaluate(function(){
		var resultNode = document.querySelector('#showTabIdRow');
		return resultNode.innerText;
	});
	if(/成功/.test(statusText || '')){
		response.code = 200;
		response.status = 'submit';
		response.message = '(成功) ' + (resultText || '');
	}else{
		response.code = 40500;
		response.status = 'submit';
		response.message = '(失败) ' + (resultText || '');
	}
});

casper.run(function(){
	casper.echo('<response>' + JSON.stringify(response) + '</response>');
	casper.exit(0);
	casper.bypass(99);
});



/**
 * 订购流量包产品
 * 
 * > casperjs order.flux.test.casper.js --ignore-ssl-errors=true 
 */
var RegexUtils = require('../lib/util.js');
var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
	// clientScripts: ['../casper/js/patch/public.js'],
	pageSettings: {
		XSSAuditingEnabled: false,
		webSecurityEnabled: false,
		javascriptEnabled: true,
		loadImages: true,
		loadPlugins: false,
	},
	timeout: 100000,
	logLevel: "debug",
	verbose: true,
});

casper.on('resource.requested',function(resource){
	if(!/\.(css|gif|png|jpg)$/.test(resource.url)){
		if(devMode) fs.write(tempdir + '/' + staffId + '_flux_request.txt', '['+ resource.id + '] '+ resource.url + ': ' + JSON.stringify(resource) + '\n', 'a');
	}
});

casper.on('resource.error',function(resource){
	if(devMode) fs.write(tempdir + '/' + staffId + '_flux_resource_error.txt', resource.url,'a');
});

casper.on('remote.message', function(message){
	if(devMode) fs.write(tempdir + '/' + staffId + '_flux_remote_message.txt', message,'a');
});
casper.on('remote.alert', function(message){
	if(deveMode) fs.write(tempdir + '/' + staffId + '_flux_remote_message.txt', message,'a');
	response.code = 40501;
	response.status = 'alert';
	response.message = message;
	casper.echo('<response>' + JSON.stringify(response) + '</response>');
	casper.exit(0);
	casper.bypass(99);
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
		resourceTag: casper.cli.options['prod_code'] || '',
		zk: casper.cli.options['prod_zk'] || 100,
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
		console.log(homePageMeta);
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
		var resourceUrlMatched = RegexUtils.regexMatch(/.*clickMenuItem\(this\);openmenu\('(.+?OrderGprsRes.+?)'\).*/i, navHtml) || [];
		var resourceUrl = resourceUrlMatched[1] || '';
		resourceUrl = resourceUrl.replace(/&amp;/g,'&');
		urls.resourceUrl = resourceUrl;
		if(devMode) fs.write(tempdir + '/' + staffId + '_flux_frameNav.html', navHtml, 644);
		if(devMode) casper.capture(tempdir + '/' + staffId + '_flux_frameNav.jpg');
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
			if(devMode) fs.write(tempdir + '/' + staffId + '_flux_frameSidebar.html', sideBarHtml, 644);
			var custUrlMatched = RegexUtils.regexMatch(/menuaddr="(.+?)"/i, sideBarHtml) || [];
			if(custUrlMatched[1] == undefined){
				response.code = 40100;
				response.status = 'error';
				response.message = '没取到url，用户认证异常';
				casper.echo('<response>' + JSON.stringify(response) + '</response>');
				casper.exit(0);
				casper.bypass(99);
				return;
			}

			var custUrl = custUrlMatched[1] || '';
			console.log('custUrl(raw): ' + custUrl);
			custUrl = custUrl.replace(/&amp;/g, '&');
			custUrl += "&staffId=" + homePageParams['staffid']
		            + "&departId=" + homePageParams['deptid']
		            + "&subSysCode=" + homePageParams['subsyscode']
		            + "&eparchyCode=" + homePageParams['epachyid'];
		    urls.custUrl = custUrl;
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
    	if(devMode) fs.write(tempdir + '/' + staffId + '_flux_custAuthMain.html', custAuthMainHtml, 644);
    });
});

//** 到达账务管理，流量包资源订购页面 模式一

casper.then(function acctmanm(){
	var packageUrl = urls.resourceUrl + "&staffId="
                + homePageParams['staffid'] + "&departId="
                + homePageParams['deptid']
                + "&subSysCode=BSS&eparchyCode="
                + homePageParams['epachyid'];
    urls.packageUrl = packageUrl;
	casper.then(function getAcctmanmHtml(){
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

	casper.then(function parseAcctmanmHtml(){
		var acctmanmHtml = this.getHTML();
		if(devMode) fs.write(tempdir + '/' + staffId + '_flux_acctmanm.html', acctmanmHtml, 644);
		if(devMode) casper.capture(tempdir + '/' + staffId + '_flux_acctmanm.jpg');
	});
});

//** 刷新流量包资源订购页面
casper.then(function updateAcctmanm(){
	var packageUrl = urls.resourceUrl + "&staffId="
                + homePageParams['staffid'] + "&departId="
                + homePageParams['deptid']
                + "&subSysCode=BSS&eparchyCode="
                + homePageParams['epachyid'];
	//** 通过号码获取用户已办理资源包和可办理资源包
	casper.then(function postAcctmanmForm(){
		casper.thenEvaluate(function(phone){
			document.querySelector('input[name=cond_SERIAL_NUMBER]').setAttribute('value', phone);
		},order.phone);

		casper.then(function(){
			casper.evaluate(function(){
				__utils__.click('input[name="bquerytop"]');
			});
		});
	});

	casper.then(function getAcctmanmSearch(){
		var resourceHtml = this.getHTML();
		//** 用户不能订购
		var content = RegexUtils.regexMatch(/<div class="content">(.+?)<\/div>/i, resourceHtml) || [];
		if(content[1] && content[1].length > 0){
			if(devMode) fs.write(tempdir + '/' + staffId + '_flux_acctmanmUpdatedError.html', resourceHtml, 644);
			if(devMode) casper.capture(tempdir + '/' + staffId + '_flux_acctmanmUpdatedError.jpg');
			response.code = 40400;
			response.status = 'error';
			response.message = '用户不存在或不能订购: ' + content[1];
			casper.echo('<response>' + JSON.stringify(response) + '</response>');
			casper.exit(0);
			casper.bypass(99);
			return;
		}
	});

	casper.then(function patchScipts(){
		casper.page.injectJs('../casper/js/patch/public.js');
		casper.page.injectJs('../casper/js/patch/ajax.js');
		casper.page.injectJs('../casper/js/patch/debug.js');

		casper.then(function init(){
			casper.evaluate(function(){
				init();
				pagevisit = getPageVisit();
				// completePageLoad();
				// initAcctInterface();
				// dealTradeMsg();
				// showAllUserForAcct();
			});
		});
	});

	casper.then(function parseUpdatedAcctmanmHtml(){
		var resourceHtml = this.getHTML();
		casper.then(function judge(){
			//** 获得已订购列表
			var resourceListTable = resourceHtml.match(/<table id="QryOrderGprsResTable">.*?<\/table>/i) || '';
			if(devMode) fs.write(tempdir + '/' + staffId + '_flux_resourceList.txt', JSON.stringify(resourceListTable), 644);
			//** 判断用户是否有正在处理的业务
			if(/处理中/.test(resourceListTable)){
				response.code = 40101;
				response.status = 'error';
				response.message = '用户有业务尚在处理中，稍后再尝试: ' + JSON.stringify(resource);
				casper.echo('<response>' + JSON.stringify(response) + '</response>');
				casper.exit(0);
				casper.bypass(99);
				return;
			}
							// //** 获得已订购列表
							// //TODO ?
							// var resourceList = RegexUtils.extractResourceInfo(resourceHtml) || [];
							// if(devMode) fs.write(tempdir + '/' + staffId + '_flux_resourceList.txt', JSON.stringify(resourceList), 644);
							// //** 是否有正在“处理中”的业务
							// resourceList.forEach(function(resource){
							// 	if(/处理中/.test(resource.dealTag)){
							// 		response.status = '用户有业务尚在处理中';
							// 		response.message = JSON.stringify(resource);
							// 		casper.echo('<response>' + JSON.stringify(response) + '</response>');
							// 		casper.exit(0);
							// 		casper.bypass(99);
							// 	}
							// });

			//** 分析可选择流量包，判断产品是否存在
			resTableList = RegexUtils.extractResTableInfo(resourceHtml) || [];
			if(devMode) fs.write(tempdir + '/' + staffId + '_flux_resourceTableList.txt', JSON.stringify(resTableList), 644);
			var product;
			resTableList.forEach(function(res){
				if(res.resourceTag == order.product.resourceTag 
					&& res.money == order.product.price) product = res; 
			});
			console.log(product);
			if(!(product 
					&& product.resourceTag == order.product.resourceTag 
					&& product.money == order.product.price)){
				response.code = 40102;
				response.status = 'error';
				response.message =  '产品不存在';
				casper.echo('<response>' + JSON.stringify(response) + '</response>');
				casper.exit(0);
				casper.bypass(99);
				return;
			}
			xCodingString = RegexUtils.getXcodingString(resTableList);
			if(devMode) fs.write(tempdir + '/' + staffId + '_flux_xcodingString.txt', JSON.stringify(xCodingString), 644);
			//** 分析表单参数，根据余额判断用户是否可以订购
			resourceParam = RegexUtils.getResourceParam(resourceHtml) || {};
			if(devMode) fs.write(tempdir + '/' + staffId + '_flux_resourceParam.txt', JSON.stringify(resourceParam), 644);
			//** 信用额度
			var creditMoney = parseFloat(resourceParam.cond_CREDIT_VALUE) || 0;
			//** 话费余额
			var dePostMoney = parseFloat(resourceParam.cond_DEPOSIT_MONEY) || 0;
			if( creditMoney + dePostMoney < parseFloat(order.product.price)){
				response.code = 40103;
				response.status = 'error';
				response.message = '用户余额不足';
				casper.echo('<response>' + JSON.stringify(response) + '</response>');
				casper.exit(0);
				casper.bypass(99);
				return;
			}

		});

		casper.then(function patch(){
			casper.evaluate(function patchXCodingStrId(){
				//** 设置 id=X_CODING_STR 补丁
				document.querySelector('input[name="X_CODING_STR"]').setAttribute('id','X_CODING_STR');
			});
		});

		casper.then(function selectResourceTAG(){
			casper.evaluate(function(resourceTag){
				var select = document.querySelector('select[name="data_RESOURCE_TAG"]');
				select.value = resourceTag;
				var event = document.createEvent("UIEvents"); 
				event.initUIEvent("change", true, true);      
				select.dispatchEvent(event);
			}, order.product.resourceTag);
		});

		// casper.then(function fillResourceTag() {
		// 	casper.fill('form[name=Form0]', {
		// 	   'data_RESOURCE_TAG': order.product.resourceTag,
		// 	});
		// });

		casper.waitFor(function checkResourceZKReady(){
			return casper.evaluate(function(){
				var select = document.querySelector('select[name="data_RESOURCE_ZK"]');
				var options = select.querySelectorAll('option');
				return (options.length > 1);
			});
		});

		casper.then(function selectResourceZK(){
			casper.evaluate(function(resourceZK){
				var select = document.querySelector('select[name="data_RESOURCE_ZK"]');
				select.value = resourceZK;
				var event = document.createEvent('UIEvents');
				event.initUIEvent('change',true,true);
				select.dispatchEvent(event);
			},order.product.zk);
		});

		// casper.then(function fillResourceZK() {
		//    casper.fill('form[name=Form0]', {
		//        'data_RESOURCE_ZK': '100',
		//    });
		// });

		casper.wait(5000);
		casper.then(function review(){
			var resourceHtml = this.getHTML();
			// console.log('+++++')
			// require('utils').dump(this.getElementInfo('#data_RESOURCE_ZK'));
			if(devMode) fs.write(tempdir + '/' + staffId + '_flux_acctmanmUpdated.html', resourceHtml, 644);
			if(devMode) casper.capture(tempdir + '/' + staffId + '_flux_acctmanmUpdated.jpg');
		});
	});
});

casper.then(function submit(){
	//** 开发阶段，设置提交到测试地址。
	//注意：正式上线时，注释掉该流程
	if(devMode){
		casper.evaluate(function setDevelopmentUrl(){
			document.querySelector('form[name="Form0"]').setAttribute('action','http://localhost:9200/post');
		});
	}
	//** 提交表单
	casper.then(function clickSubmit(){
		casper.evaluate(function(){
			__utils__.click('input[name="bsubmit1"]');
			//submitGenerals(this);
		});
	});
});

casper.then(function getSubmitResult(){
	var contentHtml = this.getHTML();
	if(devMode) fs.write(tempdir + '/' + staffId + '_flux_acctmanResult.html', contentHtml, 644);
	if(devMode) casper.capture(tempdir + '/' + staffId + '_flux_acctmanResult.jpg');

	var content = contentHtml.match(/.*<div class="content">(.+?)<\/div>.*/i) || [];
	if(/成功/.test(content[1] || '')){
		response.code = 200;
		response.status = 'ok';
		response.message = '成功: ' + (content[1] || '');
	}else{
		response.code = 40500;
		response.status = 'error';
		response.message = '失败: ' + (content[1] || '');
	}
});

casper.run(function(){
	casper.echo('<response>' + JSON.stringify(response) + '</response>');
	casper.exit(0);
	casper.bypass(99);
});


// //** save cookies
// casper.then(function saveCookie(){
// 	var cookies = JSON.stringify(phantom.cookies);
// 	// this.echo(JSON.stringify(phantom.cookies));
// 	if(devMode) fs.write(tempdir + '/_cookie.txt', cookies, 644);
// });

//** 到达账务管理，流量包资源订购页面 模式二

// casper.then(function acctmanm(){
// 	var packageUrl = urls.resourceUrl + "&staffId="
//                 + homePageParams['staffid'] + "&departId="
//                 + homePageParams['deptid']
//                 + "&subSysCode=BSS&eparchyCode="
//                 + homePageParams['epachyid'];
//     urls.packageUrl = packageUrl;
//     // var referer = 'https://gz.cbss.10010.com/essframe?service=page/component.Navigation&listener=init&needNotify=true' + "&staffId="
//     //             + homePageParams['staffid'] + "&departId="
//     //             + homePageParams['deptid']
//     //             + "&subSysCode=BSS&eparchyCode="
//     //             + homePageParams['epachyid'];
// 	casper.then(function getAcctmanmHtml(){

// 		casper.evaluate(function(packageUrl){
// 			document.querySelector('iframe#chkcustframe').setAttribute('src',"https://gz.cbss.10010.com" + packageUrl);
// 		},packageUrl);
// 	});
// 	casper.withFrame('chkcustframe', function parseAcctmanmHtml(){
// 		var acctmanmHtml = this.getHTML();
// 		if(devMode) fs.write(tempdir + '/' + staffId + '_flux_acctmanm.html', acctmanmHtml, 644);
// 		if(devMode) casper.capture(tempdir + '/' + staffId + '_acctmanm.jpg');
// 		console.log('+++++++')
// 		console.log('cookies: ' + JSON.stringify(phantom.cookies));
// 	});
// 	//** 刷新流量包资源订购页面
// 	casper.then(function updateAcctmanm(){
// 		var packageUrl = urls.resourceUrl + "&staffId="
// 	                + homePageParams['staffid'] + "&departId="
// 	                + homePageParams['deptid']
// 	                + "&subSysCode=BSS&eparchyCode="
// 	                + homePageParams['epachyid'];
// 	    console.log(packageUrl);
// 		//** 通过号码获取用户已办理资源包和可办理资源包
// 		casper.page.switchToChildFrame('chkcustframe');
// 		casper.then(function postAcctmanmForm(){
// 			casper.thenEvaluate(function(phone){
// 				// document.querySelector('form[name="Form0"]').setAttribute('action','http://localhost:9200');
// 				// document.querySelector('input[name=bquerytop]').setAttribute('value', ' 查询 ');
// 				document.querySelector('input[name=cond_SERIAL_NUMBER]').setAttribute('value', phone);
// 				// document.querySelector('select[name="cond_NET_TYPE_CODE"]').setAttribute('value','4G');
// 				// document.querySelector('input[name="bquerytop"]').setAttribute('onclick','');
// 				// __utils__.click('input[name="bquerytop"]');
// 			},order.phone);

// 			casper.then(function(){
// 				casper.evaluate(function(){
// 					__utils__.click('input[name="bquerytop"]');
// 				});
// 				// this.click('#bquerytop');
// 				casper.page.switchToParentFrame();
// 			});
// 		});


// 		casper.then(function parseUpdatedAcctmanmHtml(){
// 			casper.withFrame('chkcustframe',function(){
// 				var resourceHtml = this.getHTML();
// 				if(devMode) fs.write(tempdir + '/' + staffId + '_flux_acctmanm_updated.html', resourceHtml, 644);
// 				if(devMode) casper.capture(tempdir + '/' + staffId + '_acctmanm_updated.jpg');

// 				//** 用户不能订购
// 				//TODO ?
// 				var content = RegexUtils.regexMatch(/<div class="content">(.+?)<\/div>/i, resourceHtml) || [];
// 				if(content[1] && content[1].length > 0){
// 					response.status = '用户不能订购';
// 					response.message = content[1];
// 					casper.echo('<response>' + JSON.stringify(response) + '</response>');
// 					casper.exit(0);
// 					casper.bypass(99);
// 					return;
// 				}
// 				//** 获得已订购列表
// 				//TODO ?
// 				var resourceList = RegexUtils.extractResourceInfo(resourceHtml) || [];
// 				if(devMode) fs.write(tempdir + '/' + staffId + '_resource_list.txt', JSON.stringify(resourceList), 644);
// 				//** 是否有正在“处理中”的业务
// 				resourceList.forEach(function(resource){
// 					if(/处理中/.test(resource.dealTag)){
// 						response.status = '用户有业务尚在处理中';
// 						response.message = JSON.stringify(resource);
// 						casper.echo('<response>' + JSON.stringify(response) + '</response>');
// 						casper.exit(0);
// 						casper.bypass(99);
// 					}
// 				});
// 				//** 可选择流量包
// 				resTableList = RegexUtils.extractResTableInfo(resourceHtml) || [];
// 				if(devMode) fs.write(tempdir + '/' + staffId + '_resource_table_list.txt', JSON.stringify(resTableList), 644);
// 				//** form表单参数
// 				resourceParam = RegexUtils.getResourceParam(resourceHtml) || {};
// 				if(devMode) fs.write(tempdir + '/' + staffId + '_resource_param.txt', JSON.stringify(resourceParam), 644);
// 				xCodingString = RegexUtils.getXcodingString(resTableList);
// 				if(devMode) fs.write(tempdir + '/' + staffId + '_xcoding_string.txt', JSON.stringify(xCodingString), 644);
// 				//** 信用额度
// 				var creditMoney = parseFloat(resourceParam.cond_CREDIT_VALUE) || 0;
// 				//** 话费余额
// 				var dePostMoney = parseFloat(resourceParam.cond_DEPOSIT_MONEY) || 0;
// 				if( creditMoney + dePostMoney < parseFloat(order.product.price)){
// 					response.status = '用户余额不足';
// 					casper.echo('<response>' + JSON.stringify(response) + '</response>');
// 					casper.exit(0);
// 					casper.bypass(99);
// 					return;
// 				}				
// 			});
// 		});
// 	});
// 	casper.then(function(){
// 		casper.page.switchToParentFrame();
// 	});
// });






// casper.then(function header(){
// 	casper.then(function getNavHtml(){
// 		casper.open('https://gz.cbss.10010.com/essframe?service=page/Header&LOGIN_LOG_ID=null', {
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
// 		if(devMode) fs.write(tempdir + '/' + staffId + '_nav.html', navHtml, 644);
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
// 		if(devMode) fs.write(tempdir + '/' + staffId + '_flux_frameHeader.html', navHtml, 644);
// 		if(devMode) casper.capture(tempdir + '/' + staffId + '_flux_frameHeader.jpg');
// 	});
// });



	   //  casper.thenOpen("https://gz.cbss.10010.com" + urls.packageUrl,{
	   //  	method: 'get',
	   //  	headers: {
	   //  		"Accept": "text/html, application/xhtml+xml, */*",
				// "Referer": "https://gz.cbss.10010.com/essframe?service=page/Sidebar",
	   //  		// "Referer": urls.custUrl,
				// // "Referer": referer,
	   //  		"Accept-Language": "zh-CN",
	   //  		"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
	   //  		"Content-Type": "application/x-www-form-urlencoded",
	   //  		"Host": "gz.cbss.10010.com",
	   //  		"Connection": "Keep-Alive",
	   //  		"Cache-Control": "no-cache",
	   //  	},
	   //  	encoding: 'utf8',
	   //  });
		// casper.then(function(){
		// 	casper.page.switchToParentFrame();
		// });


		//** ???加了参数 ;BSS_ACCTMANM_JSESSIONID=
		// casper.then(function postAcctmanmForm(){
		// 	casper.open('https://gz.cbss.10010.com/acctmanm',{
		// 		method: 'post',
		// 		headers: {
		// 			"Accept": "text/html, application/xhtml+xml, */*",
		// 			"Referer": "https://gz.cbss.10010.com" + packageUrl,
		// 			"Accept-Language": "zh-CN",
		// 			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
		// 			"Content-Type": "application/x-www-form-urlencoded",
		// 			"Host": "gz.cbss.10010.com",
		// 			"Connection": "Keep-Alive",
		// 			"Cache-Control": "no-cache",
		// 		},
		// 		encoding: 'gbk',
		// 		data: {
		// 			"service": "direct/1/amcharge.ordergprsresource.OrderGprsRes/$Form",
		// 			"sp": "S0",
		// 			"Form0": "cond_SERIAL_NUMBER,cond_NET_TYPE_CODE,bquerytop,cond_DL_NAME,cond_DL_SNUMBER,data_DL_ZJ,cond_DL_NUMBER,data_RESOURCE_TAG,data_RESOURCE_ZK,data_PACKAGE_CODE,data_RESOURCE_CODE,data_ZK_NAME,data_RESOURCE_NAME,data_LONG,data_MONEY,data_RES_MONEY,data_UNIT,data_VALID_TIME_UNIT,data_VALID_TIME,data_RESOURCE_COUNT,bsubmit1,userinfoback_PREPAY_TAG",
		// 			"cond_ID_TYPE": "1",
		// 			"cond_SERIAL_NUMBER": order.phone,
		// 			"cond_NET_TYPE_CODE": "",
		// 			// "bquerytop": " 查 询 ",
		// 			"cond_X_USER_COUNT": "",
		// 			"cond_DL_NAME": "",
		// 			"cond_DL_SNUMBER": "",
		// 			"data_DL_ZJ": "",
		// 			"cond_DL_NUMBER": "",
		// 			"data_RESOURCE_TAG": "",
		// 			"data_RESOURCE_ZK": "",
		// 			"data_PACKAGE_CODE": "",
		// 			"data_RESOURCE_CODE": "",
		// 			"data_ZK_NAME": "",
		// 			"data_RESOURCE_NAME": "",
		// 			"data_LONG": "",
		// 			"data_MONEY": "",
		// 			"data_RES_MONEY": "",
		// 			"data_UNIT": "",
		// 			"data_VALID_TIME_UNIT": "",
		// 			"data_VALID_TIME": "",
		// 			"data_RESOURCE_COUNT": "",
		// 			"cond_PRINT_FLAG": "",
		// 			"cond_DL_ZJ_NAME": "",
		// 			"userinfoback_ACCT_ID": "",
		// 			"userinfoback_SERIAL_NUMBER": "",
		// 			"userinfoback_PAY_NAME": "",
		// 			"userinfoback_NET_TYPE_CODE": "",
		// 			"userinfoback_SERVICE_CLASS_CODE": "",
		// 			"userinfoback_USER_ID": "",
		// 			"userinfoback_PAY_MODE_CODE": "",
		// 			"userinfoback_ROUTE_EPARCHY_CODE": "",
		// 			"userinfoback_PREPAY_TAG": "",
		// 			"userinfoback_CITY_CODE": "",
		// 			"userinfoback_PRODUCT_ID": "",
		// 			"userinfoback_BRAND_CODE": "",
		// 			"cond_CREDIT_VALUE": "",
		// 			"cond_DEPOSIT_MONEY": "",
		// 			"cond_TOTAL_FEE": "",
		// 			"X_CODING_STR": "",
		// 			"cond_DATE": "",
		// 			"cond_DATE1": "",
		// 			"cond_DATE2": "",
		// 			"cond_DATE3": "",
		// 			"cond_STAFF_ID1": "",
		// 			"cond_STAFF_NAME1": "",
		// 			"cond_DEPART_NAME1": "",
		// 			"cond_ENDDATE": "",
		// 			"cond_CUST_NAME": "",
		// 			"cond_PSPT_TYPE_CODE": "",
		// 			"cond_PSPT_ID": "",
		// 			"cond_PSPT_ADDR": "",
		// 			"cond_POST_ADDRESS": "",
		// 			"cond_CONTACT": "",
		// 			"cond_CONTACT_PHONE": "",
		// 			"cond_EMAIL": "",
		// 			"cond_SHOWLIST": "",
		// 			"cond_PSPT_END_DATE": "",
		// 			"cond_NET_TYPE_CODE1": "",		
		// 		}
		// 	});
		// });


// casper.then(function ajaxAmcharge(){
// 	var amchargeUrl = "https://gz.cbss.10010.com/acctmanm?service=ajaxDirect/1/amcharge.ordergprsresource.OrderGprsRes"
//                 + "/amcharge.ordergprsresource.OrderGprsRes/javascript/refeshZK&pagename="
//                 + "amcharge.ordergprsresource.OrderGprsRes"
//                 + "&eventname=getResZKList&staffId="
//                 + homePageParams['staffid']
//                 + "&departId="
//                 + homePageParams['deptid']
//                 + "&subSysCode=acctmanm&eparchyCode="
//                 + homePageParams['epachyid']
//                 + "&partids=refeshZK&random="
//                 + RegexUtils.getRandomParam()
//                 + "&ajaxSubmitType=post";
//     var ajaxAmchargeResult = '';
//     casper.then(function(){
//     	ajaxAmchargeResult = casper.evaluate(function(url,data,headers){
//     		return __utils__.sendAJAX(url,'POST',{},false,headers);
//     	},
// 	    	amchargeUrl,
// 			{
// 				"Form0": resourceParam["Form0"],
// 				"cond_ID_TYPE": resourceParam["cond_ID_TYPE"],
// 				"cond_SERIAL_NUMBER": order.phone,
// 				"cond_NET_TYPE_CODE": "50",
// 				"bquerytop": " 查 询 ",
// 				"cond_X_USER_COUNT": resourceParam["cond_X_USER_COUNT"],
// 				"cond_DL_NAME": resourceParam["cond_DL_NAME"],
// 				"cond_DL_SNUMBER": resourceParam["cond_DL_SNUMBER"],
// 				"data_DL_ZJ": "",
// 				"cond_DL_NUMBER": "",
// 				"data_RESOURCE_TAG": order.product.resourceTag,// 流量包编码
// 				"data_RESOURCE_ZK": "",
// 				"data_PACKAGE_CODE": resourceParam["data_PACKAGE_CODE"],
// 				"data_RESOURCE_CODE": resourceParam["data_RESOURCE_CODE"],
// 				"data_ZK_NAME": resourceParam["data_ZK_NAME"],
// 				"data_RESOURCE_NAME": resourceParam["data_RESOURCE_NAME"],
// 				"data_LONG": resourceParam["data_LONG"],
// 				"data_MONEY": resourceParam["data_MONEY"],
// 				"data_RES_MONEY": resourceParam["data_RES_MONEY"],
// 				"data_UNIT": resourceParam["data_UNIT"],
// 				"data_VALID_TIME_UNIT": resourceParam["data_VALID_TIME_UNIT"],
// 				"data_VALID_TIME": resourceParam["data_VALID_TIME"],
// 				"data_RESOURCE_COUNT": resourceParam["data_RESOURCE_COUNT"],
// 				"cond_PRINT_FLAG": resourceParam["cond_PRINT_FLAG"],
// 				"cond_DL_ZJ_NAME": resourceParam["cond_DL_ZJ_NAME"],
// 				"bsubmit1": "提 交",
// 				"userinfoback_ACCT_ID": resourceParam["userinfoback_ACCT_ID"],
// 				"userinfoback_SERIAL_NUMBER": order.phone,
// 				"userinfoback_PAY_NAME": resourceParam["userinfoback_PAY_NAME"],
// 				"userinfoback_NET_TYPE_CODE": resourceParam["userinfoback_NET_TYPE_CODE"],
// 				"userinfoback_SERVICE_CLASS_CODE": resourceParam["userinfoback_SERVICE_CLASS_CODE"],
// 				"userinfoback_USER_ID": resourceParam["userinfoback_USER_ID"],
// 				"userinfoback_PAY_MODE_CODE": resourceParam["userinfoback_PAY_MODE_CODE"],
// 				"userinfoback_ROUTE_EPARCHY_CODE": resourceParam["userinfoback_ROUTE_EPARCHY_CODE"],
// 				"userinfoback_PREPAY_TAG": resourceParam["userinfoback_PREPAY_TAG"],
// 				"userinfoback_CITY_CODE": resourceParam["userinfoback_CITY_CODE"],
// 				"userinfoback_PRODUCT_ID": resourceParam["userinfoback_PRODUCT_ID"],
// 				"userinfoback_BRAND_CODE": resourceParam["userinfoback_BRAND_CODE"],
// 				"cond_CREDIT_VALUE": resourceParam["cond_CREDIT_VALUE"],
// 				"cond_DEPOSIT_MONEY": resourceParam["cond_DEPOSIT_MONEY"],
// 				"cond_TOTAL_FEE": resourceParam["cond_TOTAL_FEE"],
// 				"X_CODING_STR": xCodingString,
// 				"cond_DATE": resourceParam["cond_DATE"],
// 				"cond_DATE1": resourceParam["cond_DATE1"],
// 				"cond_DATE2": resourceParam["cond_DATE2"],
// 				"cond_DATE3": resourceParam["cond_DATE3"],
// 				"cond_STAFF_ID1": resourceParam["cond_STAFF_ID1"],
// 				"cond_STAFF_NAME1": resourceParam["cond_STAFF_NAME1"],
// 				"cond_DEPART_NAME1": resourceParam["cond_DEPART_NAME1"],
// 				"cond_ENDDATE": resourceParam["cond_ENDDATE"],
// 				"cond_CUST_NAME": resourceParam["cond_CUST_NAME"],
// 				"cond_PSPT_TYPE_CODE": resourceParam["cond_PSPT_TYPE_CODE"],
// 				"cond_PSPT_ID": resourceParam["cond_PSPT_ID"],
// 				"cond_PSPT_ADDR": resourceParam["cond_PSPT_ADDR"],
// 				"cond_POST_ADDRESS": resourceParam["cond_POST_ADDRESS"],
// 				"cond_CONTACT": resourceParam["cond_CONTACT"],
// 				"cond_CONTACT_PHONE": resourceParam["cond_CONTACT_PHONE"],
// 				"cond_EMAIL": resourceParam["cond_EMAIL"],
// 				"cond_SHOWLIST": resourceParam["cond_SHOWLIST"],
// 				"cond_PSPT_END_DATE": resourceParam["cond_PSPT_END_DATE"],
// 				"cond_NET_TYPE_CODE1": resourceParam["cond_NET_TYPE_CODE1"],
// 				"RESOURCE_TAG": order.product.resourceTag,
// 	    	},
// 	    	{
// 				"Accept": "text/html, application/xhtml+xml, */*",
// 				"Referer": 'https://gz.cbss.10010.com/acctmanm',
// 				"Accept-Language": "zh-CN",
// 				"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
// 				"Content-Type": "application/x-www-form-urlencoded",
// 				"x-requested-with": "XMLHttpRequest",
// 				"Host": "gz.cbss.10010.com",
// 				"Connection": "Keep-Alive",
// 				"Cache-Control": "no-cache",
// 			}
//     	);
//     });

// 	// casper.then(function postAmcharge(){
// 	//     casper.open(amchargeUrl, {
// 	// 		method: 'post',
// 	// 		headers: {
// 	// 			"Accept": "text/html, application/xhtml+xml, */*",
// 	// 			"Referer": 'https://gz.cbss.10010.com/acctmanm',
// 	// 			"Accept-Language": "zh-CN",
// 	// 			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
// 	// 			"Content-Type": "application/x-www-form-urlencoded",
// 	// 			"x-requested-with": "XMLHttpRequest",
// 	// 			"Host": "gz.cbss.10010.com",
// 	// 			"Connection": "Keep-Alive",
// 	// 			"Cache-Control": "no-cache",
// 	// 		},
// 	// 		encoding: 'gbk',
// 	// 		data: {
// 	// 			"Form0": resourceParam["Form0"],
// 	// 			"cond_ID_TYPE": resourceParam["cond_ID_TYPE"],
// 	// 			"cond_SERIAL_NUMBER": order.phone,
// 	// 			"cond_NET_TYPE_CODE": "50",
// 	// 			"bquerytop": " 查 询 ",
// 	// 			"cond_X_USER_COUNT": resourceParam["cond_X_USER_COUNT"],
// 	// 			"cond_DL_NAME": resourceParam["cond_DL_NAME"],
// 	// 			"cond_DL_SNUMBER": resourceParam["cond_DL_SNUMBER"],
// 	// 			"data_DL_ZJ": "",
// 	// 			"cond_DL_NUMBER": "",
// 	// 			"data_RESOURCE_TAG": order.product.resourceTag,// 流量包编码
// 	// 			"data_RESOURCE_ZK": "",
// 	// 			"data_PACKAGE_CODE": resourceParam["data_PACKAGE_CODE"],
// 	// 			"data_RESOURCE_CODE": resourceParam["data_RESOURCE_CODE"],
// 	// 			"data_ZK_NAME": resourceParam["data_ZK_NAME"],
// 	// 			"data_RESOURCE_NAME": resourceParam["data_RESOURCE_NAME"],
// 	// 			"data_LONG": resourceParam["data_LONG"],
// 	// 			"data_MONEY": resourceParam["data_MONEY"],
// 	// 			"data_RES_MONEY": resourceParam["data_RES_MONEY"],
// 	// 			"data_UNIT": resourceParam["data_UNIT"],
// 	// 			"data_VALID_TIME_UNIT": resourceParam["data_VALID_TIME_UNIT"],
// 	// 			"data_VALID_TIME": resourceParam["data_VALID_TIME"],
// 	// 			"data_RESOURCE_COUNT": resourceParam["data_RESOURCE_COUNT"],
// 	// 			"cond_PRINT_FLAG": resourceParam["cond_PRINT_FLAG"],
// 	// 			"cond_DL_ZJ_NAME": resourceParam["cond_DL_ZJ_NAME"],
// 	// 			"bsubmit1": "提 交",
// 	// 			"userinfoback_ACCT_ID": resourceParam["userinfoback_ACCT_ID"],
// 	// 			"userinfoback_SERIAL_NUMBER": order.phone,
// 	// 			"userinfoback_PAY_NAME": resourceParam["userinfoback_PAY_NAME"],
// 	// 			"userinfoback_NET_TYPE_CODE": resourceParam["userinfoback_NET_TYPE_CODE"],
// 	// 			"userinfoback_SERVICE_CLASS_CODE": resourceParam["userinfoback_SERVICE_CLASS_CODE"],
// 	// 			"userinfoback_USER_ID": resourceParam["userinfoback_USER_ID"],
// 	// 			"userinfoback_PAY_MODE_CODE": resourceParam["userinfoback_PAY_MODE_CODE"],
// 	// 			"userinfoback_ROUTE_EPARCHY_CODE": resourceParam["userinfoback_ROUTE_EPARCHY_CODE"],
// 	// 			"userinfoback_PREPAY_TAG": resourceParam["userinfoback_PREPAY_TAG"],
// 	// 			"userinfoback_CITY_CODE": resourceParam["userinfoback_CITY_CODE"],
// 	// 			"userinfoback_PRODUCT_ID": resourceParam["userinfoback_PRODUCT_ID"],
// 	// 			"userinfoback_BRAND_CODE": resourceParam["userinfoback_BRAND_CODE"],
// 	// 			"cond_CREDIT_VALUE": resourceParam["cond_CREDIT_VALUE"],
// 	// 			"cond_DEPOSIT_MONEY": resourceParam["cond_DEPOSIT_MONEY"],
// 	// 			"cond_TOTAL_FEE": resourceParam["cond_TOTAL_FEE"],
// 	// 			"X_CODING_STR": xCodingString,
// 	// 			"cond_DATE": resourceParam["cond_DATE"],
// 	// 			"cond_DATE1": resourceParam["cond_DATE1"],
// 	// 			"cond_DATE2": resourceParam["cond_DATE2"],
// 	// 			"cond_DATE3": resourceParam["cond_DATE3"],
// 	// 			"cond_STAFF_ID1": resourceParam["cond_STAFF_ID1"],
// 	// 			"cond_STAFF_NAME1": resourceParam["cond_STAFF_NAME1"],
// 	// 			"cond_DEPART_NAME1": resourceParam["cond_DEPART_NAME1"],
// 	// 			"cond_ENDDATE": resourceParam["cond_ENDDATE"],
// 	// 			"cond_CUST_NAME": resourceParam["cond_CUST_NAME"],
// 	// 			"cond_PSPT_TYPE_CODE": resourceParam["cond_PSPT_TYPE_CODE"],
// 	// 			"cond_PSPT_ID": resourceParam["cond_PSPT_ID"],
// 	// 			"cond_PSPT_ADDR": resourceParam["cond_PSPT_ADDR"],
// 	// 			"cond_POST_ADDRESS": resourceParam["cond_POST_ADDRESS"],
// 	// 			"cond_CONTACT": resourceParam["cond_CONTACT"],
// 	// 			"cond_CONTACT_PHONE": resourceParam["cond_CONTACT_PHONE"],
// 	// 			"cond_EMAIL": resourceParam["cond_EMAIL"],
// 	// 			"cond_SHOWLIST": resourceParam["cond_SHOWLIST"],
// 	// 			"cond_PSPT_END_DATE": resourceParam["cond_PSPT_END_DATE"],
// 	// 			"cond_NET_TYPE_CODE1": resourceParam["cond_NET_TYPE_CODE1"],
// 	// 			"RESOURCE_TAG": order.product.resourceTag,
// 	//     	}
// 	//     });
// 	// });
// 	casper.then(function parseAmchargeXml(){
// 		var packageHtml = ajaxAmchargeResult;
// 		if(devMode) fs.write(tempdir + '/' + staffId + '_amcharge.xml', packageHtml, 644);
// 		if(devMode) casper.capture(tempdir + '/' + staffId + '_amcharge.jpg');
// 		var priceList = RegexUtils.queryPrice(packageHtml) || [];
// 		// if(![].contain.call(priceList, order.product.price)){
// 			response.status = '价格不对，不能订';
// 			casper.echo('<response>' + JSON.stringify(response) + '</response>');
// 			casper.exit(0);
// 			casper.bypass(99);
// 		// }
// 	});
// });

// // casper.then(function ajaxRefreshMoney(){
// // 	var refreshMoneyUrl =
// //             "https://gz.cbss.10010.com/acctmanm?service=ajaxDirect/1/amcharge.ordergprsresource.OrderGprsRes/"
// //                 + "amcharge.ordergprsresource.OrderGprsRes/javascript/refeshMoney&pagename="
// //                 + "amcharge.ordergprsresource.OrderGprsRes"
// //                 + "&eventname=getOrderResInfos&staffId="
// //                 + homePageParams['staffid']
// //                 + "&departId="
// //                 + homePageParams['deptid']
// //                 + "&subSysCode=acctmanm&eparchyCode="
// //                 + homePageParams['epachyid']
// //                 + "&partids=refeshMoney&random="
// //                 + RegexUtils.getRandomParam()
// //                 + "&ajaxSubmitType=post";
// //     casper.then(function postRefreshMoney(){
// // 	    casper.open(refreshMoneyUrl,{
// // 			method: 'post',
// // 			headers: {
// // 				"Accept": "text/html, application/xhtml+xml, */*",
// // 				"Referer": 'https://gz.cbss.10010.com/acctmanm',
// // 				"Accept-Language": "zh-CN",
// // 				"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
// // 				"Content-Type": "application/x-www-form-urlencoded",
// // 				"x-requested-with": "XMLHttpRequest",
// // 				"Host": "gz.cbss.10010.com",
// // 				"Connection": "Keep-Alive",
// // 				"Cache-Control": "no-cache",
// // 			},
// // 			encoding: 'gbk',
// // 			data: {
// // 				"Form0": resourceParam["Form0"],
// // 				"cond_ID_TYPE": resourceParam["cond_ID_TYPE"],
// // 				"cond_SERIAL_NUMBER": order.phone,
// // 				"cond_NET_TYPE_CODE": resourceParam["userinfoback_NET_TYPE_CODE"],
// // 				"bquerytop": " 查 询 ",
// // 				"cond_X_USER_COUNT": resourceParam["cond_X_USER_COUNT"],
// // 				"cond_DL_NAME": resourceParam["cond_DL_NAME"],
// // 				"cond_DL_SNUMBER": resourceParam["cond_DL_SNUMBER"],
// // 				"data_DL_ZJ": "",
// // 				"cond_DL_NUMBER": "",
// // 				"data_RESOURCE_TAG": order.product.resourceTag,// 流量包编码
// // 				"data_RESOURCE_ZK": order.product.price,
// // 				"data_PACKAGE_CODE": resourceParam["data_PACKAGE_CODE"],
// // 				"data_RESOURCE_CODE": resourceParam["data_RESOURCE_CODE"],
// // 				"data_ZK_NAME": resourceParam["data_ZK_NAME"],
// // 				"data_RESOURCE_NAME": resourceParam["data_RESOURCE_NAME"],
// // 				"data_LONG": resourceParam["data_LONG"],
// // 				"data_MONEY": resourceParam["data_MONEY"],
// // 				"data_RES_MONEY": resourceParam["data_RES_MONEY"],
// // 				"data_UNIT": resourceParam["data_UNIT"],
// // 				"data_VALID_TIME_UNIT": resourceParam["data_VALID_TIME_UNIT"],
// // 				"data_VALID_TIME": resourceParam["data_VALID_TIME"],
// // 				"data_RESOURCE_COUNT": resourceParam["data_RESOURCE_COUNT"],
// // 				"cond_PRINT_FLAG": resourceParam["cond_PRINT_FLAG"],
// // 				"cond_DL_ZJ_NAME": resourceParam["cond_DL_ZJ_NAME"],
// // 				"bsubmit1": "提 交",
// // 				"userinfoback_ACCT_ID": resourceParam["userinfoback_ACCT_ID"],
// // 				"userinfoback_SERIAL_NUMBER": order.phone,
// // 				"userinfoback_PAY_NAME": resourceParam["userinfoback_PAY_NAME"],
// // 				"userinfoback_NET_TYPE_CODE": resourceParam["userinfoback_NET_TYPE_CODE"],
// // 				"userinfoback_SERVICE_CLASS_CODE": resourceParam["userinfoback_SERVICE_CLASS_CODE"],
// // 				"userinfoback_USER_ID": resourceParam["userinfoback_USER_ID"],
// // 				"userinfoback_PAY_MODE_CODE": resourceParam["userinfoback_PAY_MODE_CODE"],
// // 				"userinfoback_ROUTE_EPARCHY_CODE": resourceParam["userinfoback_ROUTE_EPARCHY_CODE"],
// // 				"userinfoback_PREPAY_TAG": resourceParam["userinfoback_PREPAY_TAG"],
// // 				"userinfoback_CITY_CODE": resourceParam["userinfoback_CITY_CODE"],
// // 				"userinfoback_PRODUCT_ID": resourceParam["userinfoback_PRODUCT_ID"],
// // 				"userinfoback_BRAND_CODE": resourceParam["userinfoback_BRAND_CODE"],
// // 				"cond_CREDIT_VALUE": resourceParam["cond_CREDIT_VALUE"],
// // 				"cond_DEPOSIT_MONEY": resourceParam["cond_DEPOSIT_MONEY"],
// // 				"cond_TOTAL_FEE": resourceParam["cond_TOTAL_FEE"],
// // 				"X_CODING_STR": xCodingString,
// // 				"cond_DATE": resourceParam["cond_DATE"],
// // 				"cond_DATE1": resourceParam["cond_DATE1"],
// // 				"cond_DATE2": resourceParam["cond_DATE2"],
// // 				"cond_DATE3": resourceParam["cond_DATE3"],
// // 				"cond_STAFF_ID1": resourceParam["cond_STAFF_ID1"],
// // 				"cond_STAFF_NAME1": resourceParam["cond_STAFF_NAME1"],
// // 				"cond_DEPART_NAME1": resourceParam["cond_DEPART_NAME1"],
// // 				"cond_ENDDATE": resourceParam["cond_ENDDATE"],
// // 				"cond_CUST_NAME": resourceParam["cond_CUST_NAME"],
// // 				"cond_PSPT_TYPE_CODE": resourceParam["cond_PSPT_TYPE_CODE"],
// // 				"cond_PSPT_ID": resourceParam["cond_PSPT_ID"],
// // 				"cond_PSPT_ADDR": resourceParam["cond_PSPT_ADDR"],
// // 				"cond_POST_ADDRESS": resourceParam["cond_POST_ADDRESS"],
// // 				"cond_CONTACT": resourceParam["cond_CONTACT"],
// // 				"cond_CONTACT_PHONE": resourceParam["cond_CONTACT_PHONE"],
// // 				"cond_EMAIL": resourceParam["cond_EMAIL"],
// // 				"cond_SHOWLIST": resourceParam["cond_SHOWLIST"],
// // 				"cond_PSPT_END_DATE": resourceParam["cond_PSPT_END_DATE"],
// // 				"cond_NET_TYPE_CODE1": resourceParam["cond_NET_TYPE_CODE1"],
// // 				"RESOURCE_TAG": order.product.resourceTag,
// // 				"ZK_CODE": order.product.price,
// // 			}
// // 		});
// //     });
// // 	casper.then(function parseRefreshMoneyXml(){
// // 		var chargeInfo = this.getHTML();
// // 		if(devMode) fs.write(tempdir + '/' + staffId + '_refresh_money.xml', chargeInfo, 644);
// // 		if(devMode) casper.capture(tempdir + '/' + staffId + '_refresh_money.jpg');
// // 		rMap = RegexUtils.getResourceParam(chargeInfo) || {};
		
// // 		resTableList.forEach(function(li){
// // 			if(li.resourceCode == rMap['data_RESOURCE_CODE']){
// // 				rMap['data_RESOURCE_NAME'] = li.resourceName;
// // 			}
// // 		});
// // 		if(devMode) fs.write(tempdir + '/' + staffId + '_rMap.txt', JSON.stringify(rMap), 644);
// // 	});
// // });


// // //** 订购提交
// // casper.thenOpen('https://gz.cbss.10010.com/acctmanm',{
// // 	method: 'post',
// // 	headers: {
// // 		"Accept": "text/html, application/xhtml+xml, */*",
// // 		"Referer": 'https://gz.cbss.10010.com/acctmanm',
// // 		"Accept-Language": "zh-CN",
// // 		"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
// // 		"Content-Type": "application/x-www-form-urlencoded",
// // 		"Host": "gz.cbss.10010.com",
// // 		"Connection": "Keep-Alive",
// // 		"Cache-Control": "no-cache",
// // 	},
// // 	encoding: 'gbk',
// // 	data: {
// //         "service": "direct/1/amcharge.ordergprsresource.OrderGprsRes/$Form",
// //         "sp": "S0",
// //         "Form0": resourceParam["Form0"],
// //         "cond_ID_TYPE": resourceParam["cond_ID_TYPE"],
// //         "cond_SERIAL_NUMBER": order.phone,
// //         "cond_NET_TYPE_CODE": resourceParam["userinfoback_NET_TYPE_CODE"],
// //         "cond_X_USER_COUNT": "",
// //         "cond_DL_NAME": "",
// //         "cond_DL_SNUMBER": "",
// //         "data_DL_ZJ": "",
// //         "cond_DL_NUMBER": "",
// //         "data_RESOURCE_TAG": order.product.resourceTag,
// //         "data_RESOURCE_ZK": order.product.price,
// //         "data_PACKAGE_CODE": resourceParam["data_PACKAGE_CODE"],
// //         "data_RESOURCE_CODE": rMap["data_RESOURCE_CODE"],
// //         "data_ZK_NAME": rMap["data_ZK_NAME"],
// //         "data_RESOURCE_NAME": rMap["data_RESOURCE_NAME"],
// //         "data_LONG": rMap["data_LONG"],
// //         "data_MONEY": rMap["data_MONEY"],
// //         "data_RES_MONEY": rMap["data_RES_MONEY"],
// //         "data_UNIT": rMap["data_UNIT"],
// //         "data_VALID_TIME_UNIT": rMap["data_VALID_TIME_UNIT"],
// //         "data_VALID_TIME": rMap["data_VALID_TIME"],
// //         "data_RESOURCE_COUNT": rMap["data_RESOURCE_COUNT"],
// //         "cond_PRINT_FLAG": "",
// //         "cond_DL_ZJ_NAME": "",
// //         "bsubmit1": "提 交",
// //         "userinfoback_ACCT_ID": resourceParam["userinfoback_ACCT_ID"],
// //         "userinfoback_SERIAL_NUMBER": order.phone,
// //         "userinfoback_PAY_NAME": resourceParam["userinfoback_PAY_NAME"],
// //         "userinfoback_NET_TYPE_CODE": resourceParam["userinfoback_NET_TYPE_CODE"],
// //         "userinfoback_SERVICE_CLASS_CODE": resourceParam["userinfoback_SERVICE_CLASS_CODE"],
// //         "userinfoback_USER_ID": resourceParam["userinfoback_USER_ID"],
// //         "userinfoback_PAY_MODE_CODE": resourceParam["userinfoback_PAY_MODE_CODE"],
// //         "userinfoback_ROUTE_EPARCHY_CODE": resourceParam["userinfoback_ROUTE_EPARCHY_CODE"],
// //         "userinfoback_PREPAY_TAG": resourceParam["userinfoback_PREPAY_TAG"],
// //         "userinfoback_CITY_CODE": resourceParam["userinfoback_CITY_CODE"],
// //         "userinfoback_PRODUCT_ID": resourceParam["userinfoback_PRODUCT_ID"],
// //         "userinfoback_BRAND_CODE": resourceParam["userinfoback_BRAND_CODE"],
// //         "cond_CREDIT_VALUE": resourceParam["cond_CREDIT_VALUE"],
// //         "cond_DEPOSIT_MONEY": resourceParam["cond_DEPOSIT_MONEY"],
// //         "cond_TOTAL_FEE": "",
// //         "X_CODING_STR": xCodingString,
// //         "cond_DATE": resourceParam["cond_DATE"],
// //         "cond_DATE1": resourceParam["cond_DATE1"],
// //         "cond_DATE2": resourceParam["cond_DATE2"],
// //         "cond_DATE3": resourceParam["cond_DATE3"],
// //         "cond_STAFF_ID1": resourceParam["cond_STAFF_ID1"],
// //         "cond_STAFF_NAME1": resourceParam["cond_STAFF_NAME1"],
// //         "cond_DEPART_NAME1": resourceParam["cond_DEPART_NAME1"],
// //         "cond_ENDDATE": resourceParam["cond_ENDDATE"],
// //         "cond_CUST_NAME": resourceParam["cond_CUST_NAME"],
// //         "cond_PSPT_TYPE_CODE": resourceParam["cond_PSPT_TYPE_CODE"],
// //         "cond_PSPT_ID": resourceParam["cond_PSPT_ID"],
// //         "cond_PSPT_ADDR": resourceParam["cond_PSPT_ADDR"],
// //         "cond_POST_ADDRESS": resourceParam["cond_POST_ADDRESS"],
// //         "cond_CONTACT": resourceParam["cond_CONTACT"],
// //         "cond_CONTACT_PHONE": resourceParam["cond_CONTACT_PHONE"],
// //         "cond_EMAIL": resourceParam["cond_EMAIL"],
// //         "cond_SHOWLIST": resourceParam["cond_SHOWLIST"],
// //         "cond_PSPT_END_DATE": resourceParam["cond_PSPT_END_DATE"],
// //         "cond_NET_TYPE_CODE1": resourceParam["cond_NET_TYPE_CODE1"],
// //     }
// // });
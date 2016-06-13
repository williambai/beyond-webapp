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

casper.on('resource.requested',function(resource){
	if(!/\.(css|gif|png|jpg)$/.test(resource.url)){
		if(true) fs.write(tempdir + '/' + staffId + '_yiwang_request.txt', '['+ resource.id + '] '+ resource.url + ': ' + JSON.stringify(resource) + '\n', 'a');
	}
});

casper.on('resource.error',function(resource){
	if(true) fs.write(tempdir + '/' + staffId + '_yiwang_remote_message.txt', 'resource.error: ' + resource.url + '\n','a');
});

casper.on('remote.message', function(message){
	if(true) fs.write(tempdir + '/' + staffId + '_yiwang_remote_message.txt', message,'a');
});

casper.on('remote.alert', function(message){
	if(true) fs.write(tempdir + '/' + staffId + '_yiwang_remote_message.txt', message,'a');
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
				// Cs.ctrl.Trade.afterQuery();

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

casper.then(function setProduct(){

});

casper.then(function submit(){
	//** 开发阶段，设置提交到测试地址。
	//注意：正式上线时，注释掉该流程
	casper.evaluate(function setDevelopmentUrl(){
		// document.querySelector('form[name="Form0"]').setAttribute('action','http://localhost:9200/post');
		Cs.ctrl.BatTrade.doSubmitBatTrade = function(){
			console.log('-----submit begin------\n')
	        var pagename = $('pagecontext').pagename;    
	        
		    try{
		        Cs.ctrl.Trade.clearInfo();
		        //子类业务界面其他操作
		        if (typeof finishBatChildSave != 'undefined' && finishBatChildSave instanceof Function){ 
		            if(finishBatChildSave()===false){
		            	throw $TradeExit;
		            }
				}
			}catch(ex){if (ex!=$TradeExit)win.alert(ex.message);Cs.ctrl.Web.hideInfo();return}
			
			var str ="_batTradeBase="+encodeURIComponent($F("_batTradeBase"))+Form.serialize("workarea");
					
			if(Cs.ctrl.Trade._tradeInfo!='undefined' && Cs.ctrl.Trade._tradeInfo!=null)
			{
				str+="&_tradeInfo="+encodeURIComponent(Object.toJSON(Cs.ctrl.Trade._tradeInfo));					                       
			}
			
			//数据从前台WEB端获取	
			if($F("_batTradeBase").evalJSON()["MODE"]=="1"||$F("_saveData")!=''){
				str +="&Ext="+$F("_saveData");
			}
			console.log(pagename)
			console.log(str);			
	        // Cs.Ajax.swallowXml(pagename, "submitTrade", str);		
			console.log('-----submit end------\n')
		};

	});
	//** 提交表单
	casper.then(function clickSubmit(){
		casper.evaluate(function(){
			__utils__.click('input#submitTrade');
		});
	});
	casper.wait(3000);
});

casper.then(function getSubmitResult(){
	var contentHtml = this.getHTML();
	if(outputDebug) fs.write(tempdir + '/' + staffId + '_yiwang_SubmitResult.html', contentHtml, 644);
	if(outputDebug) casper.capture(tempdir + '/' + staffId + '_yiwang_SubmitResult.jpg');

	var content = contentHtml.match(/.*<div class="content">(.+?)<\/div>.*/i) || [];
	if(outputDebug) fs.write(tempdir + '/' + staffId + '_submit_result.html', contentHtml, 644);
	if(/成功/.test(content[1] || '')){
		response.status = '成功';
		response.content = content[1] || '';
	}else{
		response.status = '失败';
		response.content = content[1] || '';
	}
});

casper.run(function(){
	casper.echo('<response>' + JSON.stringify(response) + '</response>');
	casper.exit(0);
	casper.bypass(99);
});



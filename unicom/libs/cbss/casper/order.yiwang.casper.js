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
		if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_request.txt', '['+ resource.id + '] '+ resource.url + ': ' + JSON.stringify(resource) + '\n', 'a');
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

	casper.wait(2000);

	casper.then(function parseUpdatedYiwangHtml(){
		casper.then(function(){
			var resourceHtml = this.getHTML();
			if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_pageFormUpdated.html', resourceHtml, 644);
			if(devMode) casper.capture(tempdir + '/' + staffId + '_yiwang_pageFormUpdated.jpg');
		});
	});

});

casper.then(function expandPackageList(){
	casper.evaluate(function(productCode){
		var productInputNode = document.querySelector('input#_p' + productCode);
		console.log('productInputNode: ' + '\n\n');
		console.log(productInputNode.outerHTML + '\n\n');
		var productExpandNode = document.querySelector('img#closeopen' + productCode);
		console.log('productExpandNode: ' + '\n\n');
		console.log(productExpandNode.outerHTML + '\n\n');
		//** 点击展开产品包
		__utils__.click('img#closeopen' + productCode);
	},order.product.code);

});

casper.then(function expandProductList(){
	casper.evaluate(function(productCode){
		var productExpand1 = document.querySelector('div#p' + productCode);
		console.log('productExpand1: ' + '\n\n');
		console.log(productExpand1.outerHTML + '\n\n');
		//** 点击展开产品
		__utils__.click('img#closeopen' + productCode + 'k' + '51708887');
	},order.product.code);

});

casper.then(function setProduct(){
	casper.evaluate(function(productCode){
		var productExpand2 = document.querySelector('div#p' + productCode + 'k' + '51708887');
		console.log('productExpand2: ' + '\n\n');
		console.log(productExpand2.outerHTML + '\n\n');
		//** 点击产品包
		__utils__.click('input#_p' + productCode + 'k' + '51708887' + 'e' + '8101109' + 'TD');
		var packageClicked = document.querySelector('div#p' + productCode);
		console.log('packageClicked: ' + '\n\n');
		console.log(packageClicked.outerHTML + '\n\n');
	},order.product.code);
});

casper.then(function submit(){
	if(devMode){
		//** 开发阶段，设置提交到测试地址。
		//注意：正式上线时，注释掉该流程
		casper.evaluate(function setDevelopmentUrl(){
			console.log('++++++++setDevelopmentUrl ++++++\n');
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
			    u = 'http://localhost:9200/post' + u;
			    new Ajax.Request(u,options);
			};
		});
	}
	if(devMode){
		casper.evaluate(function submitDebug(){
			console.log('++++++++submitDebug ++++++\n');

			Cs.ctrl.Trade.doSubmitTrade= function(){
			    console.log('++++++++555555++++++\n');			    
		        var pagename = $('pagecontext').pagename;
			    console.log('++++++++555555 -a ++++++\n');			    
		        try{
		            this.clearInfo();
				    console.log('++++++++555555 -b ++++++\n');			    
		            var info = Cs.ctrl.Trade.createObject("ACTOR_NAME","ACTOR_PHONE","ACTOR_CERTTYPEID","ACTOR_CERTNUM","REMARK");
		            
		            // QC:15329 BEGIN开户业务备注被mobtrade里的覆盖  统一版本合并
		            if($("UREMARK")){
		         	   if($F("UREMARK")!=""){
		         		   info.REMARK=$F("UREMARK");
		         	   }
		            }
		            // QC:15329 END 统一版本合并
		    	    Cs.ctrl.Trade.saveObject("Common", info);
		            
		        	// qc 81558 begin      
		    	    if($("DEVELOP_DEPART_ID_W") && $F("DEVELOP_DEPART_ID_W") && $("DEVELOP_STAFF_ID_W") && $F("DEVELOP_STAFF_ID_W")){
	   	          
	    	            Cs.ctrl.Trade.saveObject("TRADE_ITEM",{DEVELOP_DEPART_ID:$F('DEVELOP_DEPART_ID_W'),DEVELOP_STAFF_ID:$F('DEVELOP_STAFF_ID_W')});
	    	         }
		    	    
		        	
		                   
		        	// qc 81558 end     
				    console.log('++++++++555555 -c ++++++\n');			    
		            //子类业务界面其他操作


		            // if (typeof finishChildSave != 'undefined' && finishChildSave instanceof Function)
		            //     if(finishChildSave()===false)
		            //         throw $TradeExit;
		            
		         	// 业务须知    
		            var b_HintFlag = true;
		            if (typeof specSaveFlag != 'undefined' && specSaveFlag instanceof Function)
		                b_HintFlag = false;
		            
		            if($("COMM_SHARE_NBR_STRING")&&!$F("COMM_SHARE_NBR_STRING").blank()){
		            	var textInfo  = "【提醒】"+$F("COMM_SHARE_NBR_STRING")+",是否一起受理";
		            	 //if(window.confirm(textInfo)){
		            	 //alert("b_HintFlag="+b_HintFlag);
		            	 if(b_HintFlag &&  window.confirm(textInfo)){
						    
						    	Cs.ctrl.Trade.saveObject("COMM_MOVE_Z_ITEM", {"COMM_MOVE_Z":"1"});
						    }					    		
		            }
		            var info =   Cs.ctrl.Trade.getObject("Common")||{};
		            
				    console.log('++++++++555555 -d++++++\n');			    
		           
		            if($P("RES_PRE_ORDER")&&$P("RES_PRE_ORDER").value=="1"){
		            	info.RES_PRE_ORDER = "1";
		            }
		             Cs.ctrl.Trade.saveObject("Common", info);
		            //生成other表的数据        
		            var okeys = Object.keys(_otherInfos);
		            for(i=0;i<okeys.length;++i)
		            {
		                if(okeys[i]!="toJSONString"&&_otherInfos[okeys[i]]!="")
		                {
		                    var ja = _otherInfos[okeys[i]].split ("~~"); //rsult为返回的串
		                    Cs.ctrl.Trade.appendItemArry("TF_B_TRADE_OTHER",ja);           
		                }
		            }
				    console.log('++++++++555555 -e ++++++\n');			    
		            //用于特殊批量业务
		            var okeys = Object.keys(_otherInfosNew);
		            for(i=0;i<okeys.length;++i)
		            {
		                if(okeys[i]!="toJSONString"&&_otherInfosNew[okeys[i]]!="")
		                {
		                    var ja = _otherInfosNew[okeys[i]].split ("~~"); //rsult为返回的串
		                    Cs.ctrl.Trade.appendItemArry("TF_B_TRADE_OTHER_NEW",ja);           
		                }
		            }
		           
				    console.log('++++++++555555 -f ++++++\n');			    
		            //生成purchase表的数据        
		            var purchasekeys = Object.keys(_purchaseInfos);
		            for(i=0;i<purchasekeys.length;++i)
		            {
		                if(purchasekeys[i]!="toJSONString"&&_purchaseInfos[purchasekeys[i]]!="")
		                {
		                    var ja = _purchaseInfos[purchasekeys[i]].split ("~~"); //rsult为返回的串
		                    Cs.ctrl.Trade.appendItemArry("TF_B_TRADE_PURCHASE",ja);           
		                }
		            } 
				    console.log('++++++++555555 -g ++++++\n');			    
		            //生成purchase的属性表数据
		            var purchaseitemkeys = Object.keys(_purchaseItemInfos);
		            for(i=0;i<purchaseitemkeys.length;++i)
		            {
		                if(purchaseitemkeys[i]!="toJSONString"&&_purchaseItemInfos[purchaseitemkeys[i]]!="")
		                {
		                    var ja = _purchaseItemInfos[purchaseitemkeys[i]].split ("~~"); //rsult为返回的串
		                    Cs.ctrl.Trade.appendItemArry("TF_B_TRADE_SUB_ITEM",ja);       
		                }
		            }
				    console.log('++++++++555555 - h ++++++\n');			    
		            //生成purchase的tradefee_sub表的数据        
		            var purchasefeekeys = Object.keys(_purchaseFeeInfos);
		            for(i=0;i<purchasefeekeys.length;++i)
		            {
		                if(purchasefeekeys[i]!="toJSONString"&&_purchaseFeeInfos[purchasefeekeys[i]]!="")
		                {
		                    var ja = _purchaseFeeInfos[purchasefeekeys[i]].split ("~~"); //rsult为返回的串
		                    Cs.ctrl.Trade.appendItemArry("TF_B_TRADEFEE_SUB",ja);           
		                }
		            }          
		            
				    console.log('++++++++555555 - i ++++++\n');			    
		            var uuKeys = Object.keys(_uuInfos);
		            var uArray = new Array;
		            for(i=0;i<uuKeys.length;++i)
		            {            	
		                if (uuKeys[i]=="GRP_ITEMS"&&$notBlank(_uuInfos[uuKeys[i]])) 
		                {   
		                	var ugrpInfo = _uuInfos[uuKeys[i]].evalJSON(true);                	
		                	Cs.ctrl.Trade.saveObject("TTRADE_GROUP", {INFOS:ugrpInfo});
		                } 
		                else if(uuKeys[i]!="toJSONString" &&$notBlank(_uuInfos[uuKeys[i]]))
		                {           
		                    uArray = uArray.concat(_uuInfos[uuKeys[i]].evalJSON());  
		                }             
		                
		            }

		            if(uArray.length>0)
		            {
		            	Cs.ctrl.Trade.saveObject("GTRADE_GROUP", {INFOS:uArray});
		            }       
		              
				    console.log('++++++++555555 -j ++++++\n');			    
		            //保存台帐数据
		            if($("baseItems")!=null)
		            {
		                _light.parent = $("baseItems");
		            	var items = _light.getValue("0");
		            	if(Object.toJSON(items)!="{}")
		            	{
			            	var old = Cs.ctrl.Trade.getObject("TRADE_ITEM");            	
			            	if(old!=null)
			            	{
			            		Object.extend(old,items);
			            		Cs.ctrl.Trade.saveObject("TRADE_ITEM",old);
			            	}
			            	else
			            	{
			            		Cs.ctrl.Trade.saveObject("TRADE_ITEM",items);
			            	}
		            	}
		            	
		            	var mainT = _light.getValue("1");//台账主表
		            	if(Object.toJSON(mainT)!="{}")
		            	{
		            		Cs.ctrl.Trade.saveObject("MAIN_TREADE",mainT);
		            	}
						
						var subItems = _light.getValue("2");
						if(Object.toJSON(subItems)!="{}")
		            	{
			            	var oldSub = Cs.ctrl.Trade.getObject("TRADE_SUB_ITEM");            	
			            	if(oldSub!=null)
			            	{
			            		Object.extend(oldSub,subItems);
			            		Cs.ctrl.Trade.saveObject("TRADE_SUB_ITEM",oldSub);
			            	}
			            	else
			            	{
			            		Cs.ctrl.Trade.saveObject("TRADE_SUB_ITEM",subItems);
			            	}
		            	}
		            }
		                
		        }catch(ex){
		        	if (ex!=$TradeExit){
		        		var win = new Cs.flower.Win();
		                win.alert(ex.message);
		        	}
		        	Cs.ctrl.Web.hideInfo();
			        console.log('++++++++555555 -exception ++++++\n');			    
		        	return
		        }
		        
		        console.log('++++++++6666666++++++\n');			    
		        Cs.ctrl.Trade.preSubmitOk=false;
		        
			         // MANYOUMODIFY
				 var cache = new Cs.flower.DataCache();
			     if (cache)
			       { 
			    	  var custInfo = cache.get("custInfo");
			    	  var isBlackCust=cache.get("isBlackCust");
					//    	  alert("isBlackCust="+Object.toJSON(isBlackCust));
					    if(custInfo)
					    {  
					//       if(custInfo.checkMode != 'G')
					//    	{
					        	if( custInfo !='undefined' && custInfo != undefined )
					    	  {
					    	     if(custInfo.checkMode)
					    	    	 {
					    	           if(custInfo.checkMode !='undefined' && custInfo.checkMode != undefined )
					    	           {
							             	  var info4 = {};	
								              info4.CHECK_TYPE = custInfo.checkMode;
								              info4.BLACK_CUST=isBlackCust;//add by iwil
								              Cs.ctrl.Trade.saveObject("TRADE_OTHER_INFO", {ITEM: info4});
					                  }
					    	         }
					    	     }
					//    	 }
					     }
			    	 
			        }
			       
			     //业务须知
			     if($("NOTE") && $F("NOTE")){
			 	 	var old = Cs.ctrl.Trade.getObject("TRADE_ITEM"); 
			 	 	if(old!=null)
			 	 	{
					    	var tradeItemInfoTmp = {};
					    	tradeItemInfoTmp.ATTR_CODE = "NOTE";
					    	tradeItemInfoTmp.ATTR_VALUE = $F("NOTE");// 发展人编码
					    	Cs.ctrl.Trade.appendObject("TF_B_TRADE_ITEM", {ITEM: tradeItemInfoTmp});
			 	 	}
			 	 	else
			 	 	{
			 	 		var items = {NOTE: $F("NOTE")};
			         	Cs.ctrl.Trade.saveObject("TRADE_ITEM",items);
			 	 	}
			  }

			  console.log('++++++++7777777++++++\n');			    
			     
		        var str ="Base="+encodeURIComponent($F("_tradeBase"))+"&Ext="+encodeURIComponent(Object.toJSON(this._tradeInfo));
		        // console.log(str);
		        Cs.Ajax.swallowXml(pagename, "submitMobTrade", str);
		        console.log('++++++++8888888+++++\n');			    
		    };
		});
	}
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
	casper.wait(10000);
});

casper.then(function getSubmitResult(){
	var contentHtml = this.getHTML();
	fs.write(tempdir + '/' + staffId + '_yiwang_SubmitResult.html', contentHtml, 644);
	casper.capture(tempdir + '/' + staffId + '_yiwang_SubmitResult.jpg');

	var content = contentHtml.match(/.*<div class="content">(.+?)<\/div>.*/i) || [];
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



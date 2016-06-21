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

	casper.wait(2000);

	casper.then(function parseUpdatedYiwangHtml(){
		casper.then(function(){
			var resourceHtml = this.getHTML();
			if(devMode) fs.write(tempdir + '/' + staffId + '_yiwang_pageFormUpdated.html', resourceHtml, 644);
			if(devMode) casper.capture(tempdir + '/' + staffId + '_yiwang_pageFormUpdated.jpg');
		});
	});

});


// casper.then(function clickProduct(){
// 	casper.evaluate(function(productCode){
// 		//** 点击展开产品包
// 		__utils__.click('input#_p' + productCode);
// 	},order.product.code);

// });



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
	if(false){
		casper.evaluate(function injectFinishChildSave(){
			console.log('++++++++finishChildSave() ++++++\n');
			//组织提交到后台的数据
			finishChildSave = function(){
				console.log('++++++++finishChildSave() 1++++++\n');
				//add by wanggang 主副卡短信校验、服务密码校验
				
				if($F("CheckNumber")!=""&&$F("CheckNumber")!="验证通过"){ //增加安全性，再进行一次校验  
					//itpengb7 258274 begin
					throw new Error("号码"+$('SERIAL_NUMBER').value+"未实名制或者未进行实名制校验，需要实名制校验或者输入短信验证码、服务密码才能继续办理业务！");
					//itpengb7 258274 end
				}	
				
				//wanggang end 
				
				//itjc-sunjw begin  选中副卡复选框 必须输入主卡号码
				if($F("DeputyCard")=="DeputyCard"&&$('MainCardSerialNumber').value==""&&$('MAIN_DEPUTY_TAG').value!="2"){
					throw new Error('办理副卡业务，请输入主卡号码！');
				}
			 	var myParams="";
			 	var node =zfInfo.jsNode;
				console.log('++++++++finishChildSave() 2 ++++++\n');
			 		if(node=="MainCard"){
						myParams='NODE='+node+'&SERIALNUMBER='+zfInfo.serialnumberZhu+'&EPARCHY_CODE='+zfInfo.eparchyCode;
					}else if(node=="DeputyCard"){
						//副卡操作 生成预提交之前再校验一遍主卡	
			  			
						 var cache = new Cs.flower.DataCache();
						    if (cache){
						    	var custInfo = cache.get("custInfo");
						    	if (!custInfo){
						    		win.error("请先创建客户或者对已有客户进行认证后<br>再办理副卡业务！", function(){
						    		closeNavFrameByLocation();
						    		if (parent.menuframe.HOLD_FIRST_PAGE)
						    			switchNavFrame(parent, "navmenu_0");
						    		});
						    		return;
						    	}else{
					 	        	 myStr2="&custName_c="+custInfo.custName+"&psptId_c="+custInfo.psptId+"&psptTypeCode_c="+custInfo.psptTypeCode;  
					 	        	// alert(myStr2);
						    	}
						    }
			        	myParams='NODE='+node+'&SERIALNUMBER_B='+zfInfo.serialnumberB+'&SERIALNUMBER_A='+
			        	zhuSInfo.serialnumberA+'&ID_A='+zhuSInfo.idA;
			        	myParams=myParams+"&ACCT_ID_M="+zfInfo.acctIdM+"&PSPT_ID="+zfInfo.psptId+"&CUST_NAME="+zfInfo.custName+
			       	    "&PSPT_TYPE_CODE="+zfInfo.psptTypeCode+"&SERIAL_NUMBER_ZF="+zfInfo.serialNmuerZf+"&EPARCHY_CODE_ZF="+zfInfo.eparchyCodeZf+
			       	    "&serialNumber_f="+$('SERIAL_NUMBER').value+"&serialNumber_z="+$('MainCardSerialNumber').value+myStr2; 
			        	if(zhuSInfo.startDate!=null&&zhuSInfo.startDate!=""&&zhuSInfo.endDate!=null&&zhuSInfo.endDate!=""){
			        		myParams=myParams+'&START_DATE='+zhuSInfo.startDate+'&END_DATE='+zhuSInfo.endDate;
			        	}
					}
					if(zfTag=="YES"){
						myParams=myParams+'NODE='+'csDestroyZFCard';
			        }
			 
			 	if(myParams!=""){
					myParams = myParams.toQueryParams();
					Cs.ctrl.Trade.saveObject("MY_ZFINFO", myParams);		
				}
				console.log('++++++++finishChildSave() 3 ++++++\n');
				// itjc-sunjw end 
				try {
					geneTradeInfo();
				}
				catch(e) {
					win.alert(e.message);
					return false;
				}
				console.log('++++++++finishChildSave() 4 ++++++\n');

			    //2G OCS用户变更套餐必需进行实名制验证
				//qc95538 begin
				var inModeCode =$("inModeCode")? $getV("inModeCode"):"-1";
			    if (inModeCode==null||inModeCode!=1){
			    if(newProdId != curProductId && '|16|'.indexOf($F('NET_TYPE_CODE')) != -1){
			        var cache = new Cs.flower.DataCache();
			        if (cache){
			            custInfo = cache.get("custInfo");
			            if(custInfo&&$("SERIAL_NUMBER")){
			                var custId1=custInfo.custId;
			                if( custId1!=$F('_CUST_ID') && $F('_CUST_ID')!="" ){
			                    win.error("认证的客户不是此号码的客户<br>请重新认证！", 
			                        function(){
			                            closeNavFrameByLocation();
			                            if (parent.menuframe.HOLD_FIRST_PAGE)
			                                switchNavFrame(parent, "navmenu_0");
			                        });
			                    return false;
			                }
			            }
			            else{
			                win.error("请先对已有客户进行认证后<br>再办理此业务！", 
			                    function(){
			                        closeNavFrameByLocation();
			                        if (parent.menuframe.HOLD_FIRST_PAGE)
			                            switchNavFrame(parent, "navmenu_0");
			                        });
			                return false;
			            }
			        }
			    }
			  }//qc95538 end
				
				console.log('++++++++finishChildSave() 5 ++++++\n');
			  //qc  33729 begin
				   
			    if ($("ASSURE_SERIAL_NUMBER_PRODUCTASSURE")&&$("ASSURE_TYPE")&&$F("ASSURE_TYPE")=="W")
			    {
			    	var tradeItemInfoTmp = {};
			    	tradeItemInfoTmp.ATTR_CODE = "YUE";
			    	tradeItemInfoTmp.ATTR_VALUE = "" + $('ASSURE_SERIAL_NUMBER_PRODUCTASSURE').yue;
			    	Cs.ctrl.Trade.appendObject("TF_B_TRADE_ITEM", {ITEM: tradeItemInfoTmp});
			    }
			    //qc 33729 end
				//iptv账号和密码.wangwy.start
				if( typeof(Cs.ctrl.Trade.getObject("TF_B_TRADE_SUB_ITEM"))!= 'undefined' ){
			        var subItem = Cs.ctrl.Trade.getObject("TF_B_TRADE_SUB_ITEM")["ITEM"];
			        if(typeof(subItem) != 'undefined' && subItem && subItem != ''){
			            subItem.each(function(s) {
			                if(s.ATTR_CODE == 'iptvPassword'){
			                    var snlength = $("SERIAL_NUMBER").value.length;
			                    s.ATTR_VALUE = $F('SERIAL_NUMBER').substring(snlength-6, snlength);
			                }
			                if(s.ATTR_CODE == 'iptvNo'){
			                    s.ATTR_VALUE = $F("SERIAL_NUMBER")+"@TV";
			                }
			            });
			        }
			    }
				//end
				console.log('++++++++finishChildSave() 5-1 ++++++\n');
				var netTypeCode = $("NET_TYPE_CODE").value;
			 	var toTradeTag =$F("TO_TRADE_TAG") ;
				if(Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_SVC) == undefined
					&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_DISCNT) == undefined
					&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_PRODUCT) == undefined
					&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_OTHER) == undefined
					&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_PURCHASE) == undefined
					&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_SP) == undefined
					&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_SUB_ITEM) == undefined
					&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_ELEMENT) == undefined
					&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_RELATION) == undefined
					//itjc-sunjw begin 
					&& Object.toJSON(Cs.ctrl.Trade.getUuInfos()) == "{}"&&toTradeTag=="0"){
						//itjc-sunjw end
						throw new Error('请变更服务或优惠！');
				}	
				if(newProdId != curProductId ||tradeTypeCode=='124') {
					
					
					//生成修改TF_F_USER表台帐
					if(newNetCode=="")
					{
						newNetCode = $("NET_TYPE_CODE").value;
					}
				
					var params = 'PRODUCT_ID='+newProdId + '&BRAND_CODE='+newBrandCode +  '&USER_ID='+userId +  '&NET_TYPE_CODE='+newNetCode;
					params = params.toQueryParams();
					//		//QC:2706 begin
					//		if($getV("N3_2706_TAG_CODE")=="1"){
					   if($("IsBook").value=="true" && Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_PRODUCT) == undefined){
					   }
					   else{
					   		Cs.ctrl.Trade.saveObject("TF_B_TRADE_USER", {ITEM: params});
					   }
					//		}
					//		else{
					//			Cs.ctrl.Trade.saveObject("TF_B_TRADE_USER", {ITEM: params});
					//		}
					//QC:2706 end
				
					//修改TF_B_TRADE
					var execTime = mProdStartDate>Cs.ctrl.Trade.getSysDate()?mProdStartDate:Cs.ctrl.Trade.getSysDate();
					params = 'PRODUCT_ID='+newProdId + '&BRAND_CODE='+newBrandCode + '&EXEC_TIME='+ execTime+'&NEW_PREPAY_TAG='+ newPrepayTag;
					params = params.toQueryParams();
					Cs.ctrl.Trade.saveObject("TF_B_TRADE", params);		
				}
				console.log('++++++++finishChildSave() 5-3 ++++++\n');
				
				if($('PROP_NAME_PRODID')){
					Cs.ctrl.Trade.saveObject("TRADE_SUB_ITEM", Cs.ctrl.Web.encodeExtraProperty($('PROP_NAME_PRODID').value,"1"));
				}
				
				if($('PROP_NAME')){
					Cs.ctrl.Trade.appendObject("TRADE_SUB_ITEM", Cs.ctrl.Web.encodeExtraProperty($('PROP_NAME').value,"1"));
				}
				//TFS:526 begin
				var temp = {};
				if ($getV('XIEYIENDTIME'))
				{
				    temp.XIEYIENDTIME = $getV('XIEYIENDTIME');
				    temp.XN_NUM = $getV('SERIAL_NUMBER');
					Cs.ctrl.Trade.saveObject("TRADE_ITEM", temp);
				}
				//TFS:526 end
				console.log('++++++++finishChildSave() 6 ++++++\n');

				//added by zhoubl WOX
				//加入沃享
				
				var _all_infos = $F('_all_infos').evalJSON(true);
				if(_all_infos.RIGHT_CODE == "csExistUserJoinWO" && tradeTypeCode=='120'){
					var uu={};
					var _infos = $F('_infos').evalJSON(true);	
					var serialNumberB=_infos.serialnumber;
					var userIdB = _infos.userId;
					var curProductIdB = _infos.productId;
					var acctIdB = _infos.acctId;
					var custIdb = _infos.custId;
					
					uu.WOXINFO = "WOX_B"; 
					uu.MODIFY_TAG="0";
					uu.SERIAL_NUMBER_B=serialNumberB;
					uu.ID_B= userIdB;
					uu.ID_A= _all_infos.USER_ID_A_WO;
					uu.SERIAL_NUMBER_A=_all_infos.SERIAL_NUMBER_A_WO;
					uu.ROLE_CODE_A="0";
					uu.ROLE_CODE_B="1";//提交时候替换成td_b_compprod_memrule配置的
					uu.RELATION_TYPE_CODE=_all_infos.RELATION_TYPE_CODE_WO;
					uu.RELATION_ATTR = "9";			
					//		uu.START_DATE = Cs.ctrl.Trade.getSysDate();//产品服务变更生效时间下月
					uu.END_DATE = "2050-12-31 23:59:59";
					if( (typeof Cs.ctrl.Trade.getObject("TF_B_TRADE_RELATION")) != 'undefined' )
					{
						Cs.ctrl.Trade.appendObject("TF_B_TRADE_RELATION", {ITEM: uu});
					}
					else
					{
						Cs.ctrl.Trade.saveObject("TF_B_TRADE_RELATION", {ITEM: uu});
					}
					var tempIsWoMainNum = {};
					tempIsWoMainNum.IS_WO_MAIN_NUM = Cs.flower.LookupCombo.getValue($(Cs.ctrl.Web.$P("isMainSerialNumber")));
					
					if(Cs.ctrl.Trade.getObject("TRADE_SUB_ITEM")){
						Object.extend(Cs.ctrl.Trade.getObject("TRADE_SUB_ITEM"),tempIsWoMainNum);//非初始密码
					}else{
						Cs.ctrl.Trade.saveObject("TRADE_SUB_ITEM", tempIsWoMainNum);
					}
				}
				//added by zhoubl  end
				//add by wangwf 2013-11-05 begin
				var specflaginfo = {};
				if(_all_infos.RIGHT_CODE == "csChangeServiceTradeWo")
				{
					specflaginfo.SPEC_FLAG = "1";
					Cs.ctrl.Trade.appendObject("TRADE_ITEM", specflaginfo);
				}
				//add by wangwf 2013-11-05 end
				
				console.log('++++++++finishChildSave() 7 ++++++\n');
				//吉林一机双号拼接字符串
				var svcObj = Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_SVC;
				if(svcObj!=undefined && svcObj!=null){
						var itemObj = svcObj.ITEM;
						for (var i = 0; i < itemObj.length; i++) {
							if(itemObj[i].SERVICE_ID=="33039"){//33039
								if(($("HEAD_NUMBER_HIDEN").value=="") && (itemObj[i].MODIFY_TAG=="0")){
									win.alert("一机双号属性值不能为空！");
									return false;
								}				
								createTradeItem();
							}
						}
				}
				

				
			    if(caiNumberInfo.caiNumber!="" && caiNumberInfo.simCard!="" && $("OLD_Number").value!="" && $("OLD_IMSI").value !="")
			   //记录资源信息
			    {
			      
				   var res = recordResInfo();
				   var res= recordResInfoOld();
				   Cs.ctrl.Trade.saveObject("TF_B_TRADE_RES", {ITEM:res});
				
			    }
			    if(wlanNumberInfo.wlanNumber!=""  && $("OLD_WlanNumber").value!="")
			        //记录WLAN资源信息
			        {
			          
			    	   var res = recordWlanResInfo();
			    	   var res= recordWlanResInfoOld();
			    	   Cs.ctrl.Trade.saveObject("TF_B_TRADE_RES", {ITEM:res});
			    	
			        }
			    
			    if(wlanNumberInfo.wlanNumber!=""  && $("OLD_WlanNumber").value=="")
			        //记录WLAN资源信息
			        {
				        var snwlan={};
				    	snwlan.RES_TYPE_CODE=$F("WLAN_RES_TYPE_CODE");  //标识wlan号码
				    	snwlan.RES_CODE=wlanNumberInfo.wlanNumber;
				    	snwlan.MODIFY_TAG="0";
				        snwlan.X_DATATYPE="NULL";
				        snwlan.START_DATE = Cs.ctrl.Trade.getSysDate();
				        snwlan.END_DATE = "2050-12-31 23:59:59";
				    	res.push(snwlan);
				    	Cs.ctrl.Trade.saveObject("TF_B_TRADE_RES", {ITEM:res});
			    	 }
			    if($("OLD_Number").value=="" && $("OLD_IMSI").value =="" && caiNumberInfo.caiNumber!="" && caiNumberInfo.simCard!="")
			    {
			        var res=[];
					var sn={};
					sn.RES_TYPE_CODE="8";  //标识彩号号码
					sn.RES_CODE=caiNumberInfo.caiNumber;
					sn.MODIFY_TAG="0";
				    sn.X_DATATYPE="NULL";
				    sn.START_DATE = Cs.ctrl.Trade.getSysDate();
				    sn.END_DATE = "2050-12-31 23:59:59";
					res.push(sn);
					//if ($("SIM_CARD_SX")){
					var card={};
					card.RES_TYPE_CODE="9";
					card.RES_CODE=caiNumberInfo.simCard;
					card.RES_INFO1=caiNumberInfo.cardInfo.imsi;
					card.RES_INFO4=caiNumberInfo.cardInfo.feeCodePayFlag;  //卡容量 tf_r_simcard_idle.CAPACITY_TYPE_CODE
					card.RES_INFO5=caiNumberInfo.cardInfo.codeTypeCode;	  //卡类型 tf_r_simcard_idle.
					card.MODIFY_TAG="0";
					card.X_DATATYPE="NULL";
					card.START_DATE = Cs.ctrl.Trade.getSysDate();
				    card.END_DATE = "2050-12-31 23:59:59";
					res.push(card);
				    Cs.ctrl.Trade.saveObject("TF_B_TRADE_RES", {ITEM:res});
			    }	
			    
				console.log('++++++++finishChildSave() end ++++++\n');
			    /*var user = {};
				
				if($("ghDevelopStaffId").value == "" && $("ghCityCode").valueCode == ""){
				    user.DEVELOP_STAFF_ID = $('pagecontext').staffId;
					user.DEVELOP_EPARCHY_CODE = $('pagecontext').epachyId;
					user.DEVELOP_CITY_CODE = $('pagecontext').cityId;
					user.DEVELOP_DEPART_ID = $('pagecontext').deptId;
				}else if($("ghDevelopStaffId").value == ""){
					user.DEVELOP_DEPART_ID = $("ghCityCode").valueCode;
					user.DEVELOP_EPARCHY_CODE = $('pagecontext').epachyId;
				}else{
				    user.DEVELOP_STAFF_ID = $('ghDevelopStaffId').valueCode;
					user.DEVELOP_EPARCHY_CODE = $('pagecontext').epachyId;
					user.DEVELOP_CITY_CODE = $('pagecontext').cityId;
					user.DEVELOP_DEPART_ID = $("ghCityCode").valueCode;		
				}
				
				//发展部门,发展员工信息
				if($('pagecontext').provinceId!="NMCU"&& $('pagecontext').provinceId!="SXCU" ) {
					Cs.ctrl.Trade.saveObject("TF_B_TRADE_USER", {ITEM:user});
				}*/
			}
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

		            if (typeof finishChildSave != 'undefined' && finishChildSave instanceof Function)
		                if(finishChildSave()===false)
		                    throw $TradeExit;
		            
				    console.log('++++++++555555 -c2 ++++++\n');			    
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
		        // console.log($F("_tradeBase"));
				console.log('++++++++7777777 1 ++++++\n');			    
		        console.log(Object.toJSON(this._tradeInfo));
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

	var content = contentHtml.match(/.?IS_NEED_OCCUPY=\'(.+?)\'.*/i) || [];
	if(/true/.test(content[1] || '')){
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



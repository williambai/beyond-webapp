/**
 * 订购流量包产品
 * 
 * > casperjs order.flux.test.casper.js --ignore-ssl-errors=true 
 */
var outputDebug = true;
var RegexUtils = require('../lib/util.js');
var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
	// clientScripts: ['../casper/js/component/public.js'],
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
		if(true) fs.write(tempdir + '/' + staffId + '_flux_request.txt', '['+ resource.id + '] '+ resource.url + ': ' + JSON.stringify(resource) + '\n', 'a');
	}
});

casper.on('resource.error',function(resource){
	if(true) fs.write(tempdir + '/' + staffId + '_flux_resource_error.txt', resource.url,'a');
});

casper.on('remote.message', function(message){
	if(true) fs.write(tempdir + '/' + staffId + '_flux_remote_message.txt', message,'a');
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
		resourceTag: casper.cli.options['prod_code'] || '',
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
		var resourceUrlMatched = RegexUtils.regexMatch(/.*clickMenuItem\(this\);openmenu\('(.+?OrderGprsRes.+?)'\).*/i, navHtml) || [];
		var resourceUrl = resourceUrlMatched[1] || '';
		resourceUrl = resourceUrl.replace(/&amp;/g,'&');
		urls.resourceUrl = resourceUrl;
		if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_frameNav.html', navHtml, 644);
		if(outputDebug) casper.capture(tempdir + '/' + staffId + '_flux_frameNav.jpg');
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
			if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_frameSidebar.html', sideBarHtml, 644);
			var custUrlMatched = RegexUtils.regexMatch(/menuaddr="(.+?)"/i, sideBarHtml) || [];
			if(custUrlMatched[1] == undefined){
				rspcasper.status = '没取到url，用户认证异常';		
				this.exit(0);
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
    	if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_custAuthMain.html', custAuthMainHtml, 644);
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
		if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_acctmanm.html', acctmanmHtml, 644);
		if(outputDebug) casper.capture(tempdir + '/' + staffId + '_flux_acctmanm.jpg');
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
			// document.querySelector('form[name="Form0"]').setAttribute('action','http://localhost:9200');
			// document.querySelector('input[name=bquerytop]').setAttribute('value', ' 查询 ');
			document.querySelector('input[name=cond_SERIAL_NUMBER]').setAttribute('value', phone);
			// document.querySelector('select[name="cond_NET_TYPE_CODE"]').setAttribute('value','4G');
			// document.querySelector('input[name="bquerytop"]').setAttribute('onclick','');
			// __utils__.click('input[name="bquerytop"]');
		},order.phone);

		casper.then(function(){
			casper.evaluate(function(){
				__utils__.click('input[name="bquerytop"]');
			});
		});
	});

	// casper.then(function addScipts(){
	// 	casper.evaluate(function(){
	// 		var ajaxScript = document.createElement('script');
	// 		ajaxScript.setAttribute('src',"https://gz.cbss.10010.com/component/scripts/public.js");
	// 		ajaxScript.setAttribute('language','JavaScript');
	// 		document.head.appendChild(ajaxScript);
	// 	});
	// });

	casper.then(function parseUpdatedAcctmanmHtml(){
		var resourceHtml = this.getHTML();
		casper.then(function judge(){
			//** 用户不能订购
			var content = RegexUtils.regexMatch(/<div class="content">(.+?)<\/div>/i, resourceHtml) || [];
			if(content[1] && content[1].length > 0){
				response.status = '用户不能订购';
				response.content = content[1];
				casper.echo('<response>' + JSON.stringify(response) + '</response>');
				casper.exit(0);
				casper.bypass(99);
				return;
			}
			//** 获得已订购列表
			var resourceListTable = resourceHtml.match(/<table id="QryOrderGprsResTable">.*?<\/table>/i) || '';
			if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_resourceList.txt', JSON.stringify(resourceListTable), 644);
			//** 判断用户是否有正在处理的业务
			if(/处理中/.test(resourceListTable)){
				response.status = '用户有业务尚在处理中';
				response.content = JSON.stringify(resource);
				casper.echo('<response>' + JSON.stringify(response) + '</response>');
				casper.exit(0);
				casper.bypass(99);
				return;
			}
							// //** 获得已订购列表
							// //TODO ?
							// var resourceList = RegexUtils.extractResourceInfo(resourceHtml) || [];
							// if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_resourceList.txt', JSON.stringify(resourceList), 644);
							// //** 是否有正在“处理中”的业务
							// resourceList.forEach(function(resource){
							// 	if(/处理中/.test(resource.dealTag)){
							// 		response.status = '用户有业务尚在处理中';
							// 		response.content = JSON.stringify(resource);
							// 		casper.echo('<response>' + JSON.stringify(response) + '</response>');
							// 		casper.exit(0);
							// 		casper.bypass(99);
							// 	}
							// });

			//** 分析可选择流量包，判断产品是否存在
			resTableList = RegexUtils.extractResTableInfo(resourceHtml) || [];
			if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_resourceTableList.txt', JSON.stringify(resTableList), 644);
			var product;
			resTableList.forEach(function(res){
				if(res.resourceTag == order.product.resourceTag 
					&& res.money == order.product.price) product = res; 
			});
			console.log(product);
			if(!(product 
					&& product.resourceTag == order.product.resourceTag 
					&& product.money == order.product.price)){
				response.status = '产品不存在';
				casper.echo('<response>' + JSON.stringify(response) + '</response>');
				casper.exit(0);
				casper.bypass(99);
				return;
			}
			xCodingString = RegexUtils.getXcodingString(resTableList);
			if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_xcodingString.txt', JSON.stringify(xCodingString), 644);
			//** 分析表单参数，根据余额判断用户是否可以订购
			resourceParam = RegexUtils.getResourceParam(resourceHtml) || {};
			if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_resourceParam.txt', JSON.stringify(resourceParam), 644);
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

		// casper.then(function(){
		// 	casper.evaluate(function(resourceTag){
		// 		var input = document.querySelector('select[name="data_RESOURCE_TAG"]');
		// 		input.value = resourceTag;
		// 		var event = document.createEvent("UIEvents"); // See update below
		// 		event.initUIEvent("change", true, true);      // See update below
		// 		input.dispatchEvent(event);
		// 	}, order.product.resourceTag);
		// });

		casper.then(function fillResourceTag() {
			// casper.page.injectJs('../casper/js/component/public.js');
			casper.fill('form[name=Form0]', {
			   'data_RESOURCE_TAG': order.product.resourceTag,
			});
		});

		casper.then(function injectJS(){
			casper.evaluate(function(){
			});
		});

		casper.wait(2000);
		
		casper.then(function(){
			var ttt = casper.evaluate(function(){
				console.log('+++++++\n');
				// console.log(changeResource.toString() + '\n');
				// console.log(ajaxSubmit.toString() + '\n');
				// console.log(ajaxRequest.toString() + '\n');
				// console.log(Ajax.Request.toString() + '\n');
				// console.log(Ajax.Request.prototype.setOptions.toString() + '\n');
				// console.log(getContextName)
				// console.log(getElement)
				// console.log(changeResource)
				// console.log(getPageVisit);

				console.log('-----')

				Ajax.Request.prototype.setRequestHeaders = function() {
				  	console.log('------1------')
				  var headers = {
				    'X-Requested-With': 'XMLHttpRequest',
				    'X-Prototype-Version': Prototype.Version,
				    'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'


					// "Accept": "text/html, application/xhtml+xml, */*",
					// "Referer": 'https://gz.cbss.10010.com/acctmanm',
	    			// "x-prototype-version": "1.5.1",
					// "Accept-Language": "zh-CN",
					// "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
					// "Content-Type": "application/x-www-form-urlencoded",
					// "x-requested-with": "XMLHttpRequest",
					// "Host": "gz.cbss.10010.com",
					// "Connection": "Keep-Alive",
					// "Cache-Control": "no-cache",
					// "Cookie": cookieString,
				  };

				  	console.log('------2------')
				  if (this.method == 'post') {
				    headers['Content-type'] = this.options.contentType +
				      (this.options.encoding ? '; charset=' + this.options.encoding : '');

				  	console.log('------3------')
				    /* Force "Connection: close" for older Mozilla browsers to work
				     * around a bug where XMLHttpRequest sends an incorrect
				     * Content-length header. See Mozilla Bugzilla #246651.
				     */
				    if (this.transport.overrideMimeType &&
				        (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
				          headers['Connection'] = 'close';
				  }
				  	console.log('------4------')

				  // user-defined headers
				  if (typeof this.options.requestHeaders == 'object') {
				    var extras = this.options.requestHeaders;
				  	console.log('------5------')

				    if (typeof extras.push == 'function')
				      for (var i = 0, length = extras.length; i < length; i += 2)
				        headers[extras[i]] = extras[i+1];
				    else
				      $H(extras).each(function(pair) { headers[pair.key] = pair.value });

				  }
				  	console.log('------6------')
				  for (var name in headers){
				    if(!/toJSONString/i.test(name)) this.transport.setRequestHeader(name, headers[name]);
				  }
				  	console.log('------7------')

				};

				// Ajax.Request.prototype.request = function(url) {
				//   	console.log('*******')
				//   this.url = url;
				//   this.method = this.options.method;
				//   var params = Object.clone(this.options.parameters);

				//   if (!['get', 'post'].include(this.method)) {
				//     // simulate other verbs over post
				//     params['_method'] = this.method;
				//     this.method = 'post';
				//   }
				//   	console.log('***2****')

				//   this.parameters = params;

				//   if (params = Hash.toQueryString(params)) {
				//     // when GET, append parameters to URL
				//     if (this.method == 'get')
				//       this.url += (this.url.include('?') ? '&' : '?') + params;
				//     else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
				//       params += '&_=';
				//   }
				//   	console.log('***3****')

				//   try {
				//     if (this.options.onCreate) this.options.onCreate(this.transport);
				//     Ajax.Responders.dispatch('onCreate', this, this.transport);
				//   	console.log('***4****')

				//     this.transport.open(this.method.toUpperCase(), this.url,
				//       this.options.asynchronous);
				//   	console.log('***5****')

				//     if (this.options.asynchronous)
				//       setTimeout(function() { this.respondToReadyState(1) }.bind(this), 10);
				//   	console.log('***6****')

				//     this.transport.onreadystatechange = this.onStateChange.bind(this);

				//     this.setRequestHeaders();
				//   	console.log('***7****')

				//     this.body = this.method == 'post' ? (this.options.postBody || params) : null;
				//     this.transport.send(this.body);
				//   	console.log('***8****')

				//     /* Force Firefox to handle ready state 4 for synchronous requests */
				//     if (!this.options.asynchronous && this.transport.overrideMimeType)
				//       this.onStateChange();
				//   }
				//   catch (e) {
				//     this.dispatchException(e);
				//   }
				// };

				// var request = new Ajax.Request('http://localhost:9200',{
				// 	method: 'get',
				// 	// parameters: {},
				// 	asynchronous: true,
				// 	onComplete: function(res){
				// 		console.log('-----')
				// 		console.log(res.responseText);
				// 	},
				// 	onException: function(exception){
				// 		console.log('11111111111');
				// 	}
				// });

				function showResponse(response) {
					console.log('=======1=======')
					console.log(response.responseText);
					var scripts = "";
					var root;
					if (Browser.isFF) { 
						var parser = new DOMParser();
						var xml = parser.parseFromString(response.responseText, "text/xml");
						var root = xml.documentElement;
					}
					else{
						root = response.responseXML.documentElement;
					}
					if (root == null || root.nodeName!='parts') {
						if (wade_sbtframe != null) {
							document.getElementById("wade_sbtframe").setAttribute("simplePage", "true");
							wade_sbtframe.document.write(response.responseText);
						} else {
							w = window.open("", null, "status=yes,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no");
							w.document.write(response.responseText);
						}
						this.afterAction = "";
					} else {
						var partNodes = root.childNodes;
						for (var i = 0; i < partNodes.length; i++) {
							var part = partNodes.item(i);
							if (part.nodeName == 'JSONDATA' && part.childNodes[0]!=null){
								this.ajaxData=part.childNodes[0].nodeValue.parseJSON();
							}
							if (part.attributes) {
								var partId = part.attributes[0].value;
								var partElement = document.getElementById(partId);
								if (partElement) {
									if (part.childNodes != null && part.childNodes.length > 0) {
										var content = "";
										for (var ii = 0; ii < part.childNodes.length; ii++) {
											content += part.childNodes[ii].nodeValue;
										}
										if (partElement.innerHTML != content) {
											partElement.innerHTML = content;
											scripts += content.extractScripts().join(";") + ";";
										}
									} else {
										//modi by zhujm 20070720
										//不应该将part删除
										//partElement.parentNode.removeChild(partElement);
										partElement.innerHTML='';
									}
								}
							}
						}
					}
					this.afterAction = scripts + (this.afterAction ? this.afterAction : "");
				};

					/** get random param */
					function getRandomParam() {
						var date = new Date();
						return "" + date.getYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
					}

					/** get element */
					function getElement(name) {
						return document.getElementById(name);
					}
					/** get page visit */
					function getPageVisit() {
						console.log('====222222==')
						var pagevisit = getElement("pagecontext");
						if (pagevisit == null) {
							alert("component Head not exist!");
						}
						console.log('====222222==')
						return pagevisit;
					};
					/** get elementBySrc */
					function getElementBySrc() {
						return window.event == null ? null : window.event.srcElement;
					}

				var pagevisit = getPageVisit();

					function getContextName() {
						var contextName = pagevisit.getAttribute("contextName");
						if (contextName == null) {
							contextName = "app";
						}
						var obj = getElementBySrc();
						if (obj != null && obj.getAttribute("subsys") != null && obj.getAttribute("subsys") != "") {
							return contextName;
						}
						for (var i=0; i<document.forms.length; i++) {
							var action = document.forms[i].action;
							if (action != null && action != "") {
								return action.substr(action.lastIndexOf("/") + 1);
							}
						}
						return contextName;
					}

					/** get sys addr */
					function getSysAddr(url, subsyscode, subsysaddr) {
						var addr = subsysaddr == null ? "" : subsysaddr;
						addr += url;

						var staffId = pagevisit.getAttribute("staffId");
						var departId = pagevisit.getAttribute("deptId");
						var subSysCode = subsyscode != null ? subsyscode : pagevisit.getAttribute("subSysCode");
						var epachyId = pagevisit.getAttribute("loginEpachyId");
						
						if (staffId != null && addr.indexOf("&%73taffId=") == -1) addr += "&staffId=" + staffId;
						if (departId != null && addr.indexOf("&%64epartId") == -1) addr += "&departId=" + departId;
						if (subSysCode != null && addr.indexOf("&%73ubSysCode=") == -1) addr += "&subSysCode=" + subSysCode;
						if (epachyId != null && addr.indexOf("&%65parchyCode=") == -1) addr += "&eparchyCode=" + epachyId;
						
						return addr;
					}



				function ajaxSubmit(page,listener,params,partids,formIds,israw){
					console.log('+++-------1------+++')
					if (document.forms.length == 0) {
						alert('form tag not exist');
						return;
					}
					console.log('+++-------2------+++')
					if (page == null || page != null && typeof(page) != "string") {
						page = pagevisit.getAttribute("pagename");
					}
					console.log('+++-------3------+++')
					console.log(page)
					var obj = getElementBySrc();
					console.log('+++-------3--1----+++')

					//var url = window.location.protocol + '//' + window.location.host + '/' + getContextName() +
					// zhangqing modify by 20071113
					var url = getContextName() +
					// var url = 'https://gz.cbss.10010.com/acctmanm' +
					 "?service=ajaxDirect/1/" + page + '/' + page + '/javascript/' + partids;
					console.log('+++-------3-2-----+++')
					// console.log(url)
					if (page != null) url += "&pagename=" + page;
					if (listener != null) url += "&eventname=" + listener;
					if (israw == null || !israw) url = getSysAddr(url,obj == null ? null : obj.subsys);
					console.log('+++-------4------+++')
					
					var ele='';
					
					console.log('+++-------5------+++')
					if (formIds) {
						formIds = formIds.split(",");
						for(i=0;i<formIds.length;i++){
							if (!$(formIds[i])){
								alert("can't get form (" + formIds[i] + ")");
								continue;
							}
							ele += Form.serialize(formIds[i]) + '&';
							ele = delElement(ele, "service");
							ele = delElement(ele, "sp");
						}
					} else {
						//formId为空默认为链接所在表单
						formNode = getParentForm(obj);
						if (formNode=='null'){
							formNode = document.forms[0];
						}
						ele = Form.serialize(formNode);
						ele = delElement(ele, "service");
						ele = delElement(ele, "sp");
					}
					
					console.log('+++-------6------+++')
					if (params != null) ele += params;
					
					url = url + '&partids=' + partids;
					url += "&random=" + getRandomParam();
					console.log('+++-------7------+++\n')
					console.log(url)
					console.log('+++-------8------+++\n')
					console.log(ele)
					ajaxRequest(url,ele,'post');
					console.log('+++-------9------+++\n')
				};

				function ajaxRequest(reqUrl,params,method){
					console.log('--------a-------')
					// console.log(reqUrl);
					// console.log(params);
					if (method==null || !method) method='get';
					if (method=='get'){
						reqUrl = reqUrl+'&ajaxSubmitType=get';
						var myAjax = new Ajax.Request(reqUrl, {
							method:"get", 
							parameters:params,
							onComplete: showResponse
						});
					}
					else if (method=='post'){
						reqUrl = encodeURI(reqUrl+'&ajaxSubmitType=post');
						var myAjax = new Ajax.Request(reqUrl, {method:"post", parameters:params,onComplete:showResponse});
					}
					else{
					console.log('--------b-------')
						alert('错误的提交方式'+method);
						return false;
					}
					console.log(reqUrl);
					console.log('--------c-------')
				}
				// ajaxRequest('https://gz.cbss.10010.com/scripts-custserv/core/Cs.js?',{},'get');
				// ajaxRequest('http://localhost:9200?',{asynchronous: true},'get');


				// var request = new XMLHttpRequest();
				// request.open('GET','http://localhost:9200',false);
				// request.send(null);
				// console.log(request.responseText);


				function changeResource(){ 
					console.log('=-------1------=')
					// console.log(TableEdit)
					// tableedit = new TableEdit("QryOrderGprsResTable");
					// console.log('=-------2------=')
					// var rows = tableedit.table.rows;
			  //  		var boxList = getElements("sches"); 
					// for(var i = 0;i < boxList.length;i++){
					// 	var dealTag = tableedit.getCell(rows[i+1], "DEAL_TAG").innerText.strip();
					// 	if(dealTag == "0"){
					// 		alert("用户有正在处理中的资源包订单，不能再次订购！");
					// 		return false;
					// 	}			
					// }
					console.log('=-------3------=')
					var restag = $("data_RESOURCE_TAG").value;	 
					if($('data_RESOURCE_TAG').value.trim() == "") {
						alert("请选择需要办理的资源包！");
						return false;
					}
					var param = "&RESOURCE_TAG="+restag;
					console.log('=-------3-2-----=')
					console.log(param)
					console.log('=-------3-3-----=')
					// console.log(tableedit1)					
					// getElement("X_CODING_STR").value = tableedit1.myEncodeTable("X_TAG,RESOURCE_TAG,PACKAGE_CODE,RESOURCE_CODE,RESOURCE_COUNT,MONEY,UNIT,VALID_TIME,VALID_TIME_UNIT,DEPOSIT_RATE,RESOURCE_NAME");
					
					console.log('=-------4------=')
					ajaxSubmit('amcharge.ordergprsresource.OrderGprsRes', 'getResZKList', param, 'refeshZK');
				
					console.log('=-------5------=')
					//ajaxSubmit(this, 'getOrderResInfos', param, 'refeshMoney');
				}


				changeResource(this);
				console.log(']]]]]]]]]]]]]]');
			});
		});

		casper.then(function(){
			casper.evaluate(function(){
				var select = document.querySelector('select[name="data_RESOURCE_ZK"]');
				select.value = '100';
				var event = document.createEvent('UIEvents');
				event.initUIEvent('change',true,true);
				input.dispatchEvent(event);
			});
		});
		// casper.then(function fillResourceZK() {
		//    casper.fill('form[name=Form0]', {
		//        'data_RESOURCE_ZK': '原价',
		//    });
		// });

		casper.wait(5000);
		casper.then(function review(){
			// console.log('+++++')
			// require('utils').dump(this.getElementInfo('#data_RESOURCE_ZK'));
			if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_acctmanmUpdated.html', resourceHtml, 644);
			if(outputDebug) casper.capture(tempdir + '/' + staffId + '_flux_acctmanmUpdated.jpg');
		});
	});
});

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

//     var cookieString = '';
// 	phantom.cookies.forEach(function(cookie){
// 		cookieString += cookie.name + '=' + cookie.value + ';';
// 	});
// 	console.log('++++++')
// 	console.log(cookieString);
//     var ajaxAmchargeResult = '';
//     casper.then(function(){
//     	ajaxAmchargeResult = casper.evaluate(function(url,data,headers){
//     		url = url + '&' + data;
//     		return __utils__.sendAJAX(url,'POST',false, headers);
//     	},
//     		// 'http://localhost:9200/abcd',
// 	    	amchargeUrl,
// 			"Form0=" + encodeURIComponent(resourceParam["Form0"]) + '&'
// 				+ "cond_ID_TYPE=" + encodeURIComponent(resourceParam["cond_ID_TYPE"]) + '&'
// 				+ "cond_SERIAL_NUMBER=" + encodeURIComponent(order.phone) + '&'
// 				+ "cond_NET_TYPE_CODE=" + encodeURIComponent("50") + '&'
// 				+ "bquerytop=" + encodeURIComponent(" 查 询 ") + '&'
// 				+ "cond_X_USER_COUNT=" + encodeURIComponent(resourceParam["cond_X_USER_COUNT"]) + '&'
// 				+ "cond_DL_NAME=" + encodeURIComponent(resourceParam["cond_DL_NAME"]) + '&'
// 				+ "cond_DL_SNUMBER=" + encodeURIComponent(resourceParam["cond_DL_SNUMBER"]) + '&'
// 				+ "data_DL_ZJ=" + '&'
// 				+ "cond_DL_NUMBER=" + '&'
// 				+ "data_RESOURCE_TAG=" + encodeURIComponent(order.product.resourceTag) + '&' // 流量包编码
// 				+ "data_RESOURCE_ZK=" + '&'
// 				+ "data_PACKAGE_CODE=" + encodeURIComponent(resourceParam["data_PACKAGE_CODE"]) + '&'
// 				+ "data_RESOURCE_CODE=" + encodeURIComponent(resourceParam["data_RESOURCE_CODE"]) + '&'
// 				+ "data_ZK_NAME=" + encodeURIComponent(resourceParam["data_ZK_NAME"]) + '&'
// 				+ "data_RESOURCE_NAME=" + encodeURIComponent(resourceParam["data_RESOURCE_NAME"]) + '&'
// 				+ "data_LONG=" + encodeURIComponent(resourceParam["data_LONG"]) + '&'
// 				+ "data_MONEY=" + encodeURIComponent(resourceParam["data_MONEY"]) + '&'
// 				+ "data_RES_MONEY=" + encodeURIComponent(resourceParam["data_RES_MONEY"]) + '&'
// 				+ "data_UNIT=" + encodeURIComponent(resourceParam["data_UNIT"]) + '&'
// 				+ "data_VALID_TIME_UNIT=" + encodeURIComponent(resourceParam["data_VALID_TIME_UNIT"]) + '&'
// 				+ "data_VALID_TIME=" + encodeURIComponent(resourceParam["data_VALID_TIME"]) + '&'
// 				+ "data_RESOURCE_COUNT=" + encodeURIComponent(resourceParam["data_RESOURCE_COUNT"]) + '&'
// 				+ "cond_PRINT_FLAG=" + encodeURIComponent(resourceParam["cond_PRINT_FLAG"]) + '&'
// 				+ "cond_DL_ZJ_NAME=" + encodeURIComponent(resourceParam["cond_DL_ZJ_NAME"]) + '&'
// 				+ "bsubmit1=" + encodeURIComponent("提 交") + '&'
// 				+ "userinfoback_ACCT_ID=" + encodeURIComponent(resourceParam["userinfoback_ACCT_ID"]) + '&'
// 				+ "userinfoback_SERIAL_NUMBER=" + encodeURIComponent(order.phone) + '&'
// 				+ "userinfoback_PAY_NAME=" + encodeURIComponent(resourceParam["userinfoback_PAY_NAME"]) + '&'
// 				+ "userinfoback_NET_TYPE_CODE=" + encodeURIComponent(resourceParam["userinfoback_NET_TYPE_CODE"]) + '&'
// 				+ "userinfoback_SERVICE_CLASS_CODE=" + encodeURIComponent(resourceParam["userinfoback_SERVICE_CLASS_CODE"]) + '&'
// 				+ "userinfoback_USER_ID=" + encodeURIComponent(resourceParam["userinfoback_USER_ID"]) + '&'
// 				+ "userinfoback_PAY_MODE_CODE=" + encodeURIComponent(resourceParam["userinfoback_PAY_MODE_CODE"]) + '&'
// 				+ "userinfoback_ROUTE_EPARCHY_CODE=" + encodeURIComponent(resourceParam["userinfoback_ROUTE_EPARCHY_CODE"]) + '&'
// 				+ "userinfoback_PREPAY_TAG=" + encodeURIComponent(resourceParam["userinfoback_PREPAY_TAG"]) + '&'
// 				+ "userinfoback_CITY_CODE=" + encodeURIComponent(resourceParam["userinfoback_CITY_CODE"]) + '&'
// 				+ "userinfoback_PRODUCT_ID=" + encodeURIComponent(resourceParam["userinfoback_PRODUCT_ID"]) + '&'
// 				+ "userinfoback_BRAND_CODE=" + encodeURIComponent(resourceParam["userinfoback_BRAND_CODE"]) + '&'
// 				+ "cond_CREDIT_VALUE=" + encodeURIComponent(resourceParam["cond_CREDIT_VALUE"]) + '&'
// 				+ "cond_DEPOSIT_MONEY=" + encodeURIComponent(resourceParam["cond_DEPOSIT_MONEY"]) + '&'
// 				+ "cond_TOTAL_FEE=" + encodeURIComponent(resourceParam["cond_TOTAL_FEE"]) + '&'
// 				+ "X_CODING_STR=" + encodeURIComponent(xCodingString) + '&'
// 				// + 'X_CODING_STR=001100070001%2000163001_100_1024_0%20000000053001%2000051024%200004100%2000020%2000026%2000020%200004100%200015%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8C%85(100%E5%85%83%2F1G)%200001%2000163001_100_1024_0%20000000053001%2000051024%200004100%2000020%2000026%2000020%20000360%200017%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8D%8A%E5%B9%B4%E5%8C%85(100%E5%85%83%2F1G)%200001%2000163001_200_3072_0%20000000053001%2000053072%200004200%2000020%2000026%2000020%200004100%200017%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8D%8A%E5%B9%B4%E5%8C%85(200%E5%85%83%2F3G)%200001%2000163001_200_3072_0%20000000053001%2000053072%200004200%2000020%2000026%2000020%200004100%200015%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8C%85(200%E5%85%83%2F3G)%200001%2000143001_50_500_0%20000000053001%200004500%20000350%2000020%2000026%2000020%200004100%200016%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8C%85(50%E5%85%83%2F500M)%200001%2000143001_50_500_0%20000000053001%200004500%20000350%2000020%2000026%2000020%20000350%200018%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8D%8A%E5%B9%B4%E5%8C%85(50%E5%85%83%2F500M)%200001%2000163002_100_1536_0%20000000053002%2000051536%200004100%2000020%2000026%2000020%200004100%200017%E7%9C%81%E5%86%85%E6%B5%81%E9%87%8F%E5%8C%85(100%E5%85%83%2F1.5G)%20&'
// 				// + 'cond_INFORMATION=1.%E6%9C%AC%E4%B8%9A%E5%8A%A1%E9%80%9A%E8%BF%87%E6%9C%8D%E5%8A%A1%E5%AF%86%E7%A0%81%E8%AE%A4%E8%AF%81%2C%E6%88%96%E5%AE%A2%E6%88%B7%E4%BF%A1%E6%81%AF%E5%B7%B2%E9%80%9A%E8%BF%87%E5%85%AC%E5%AE%89%E9%83%A8%E5%85%AC%E6%B0%91%E8%BA%AB%E4%BB%BD%E4%BF%A1%E6%81%AF%E5%BA%93%E6%A0%B8%E6%9F%A5%E3%80%82%3Cbr%20%2F%3E2.%E6%B5%81%E9%87%8F%E5%8D%8A%E5%B9%B4%E5%8C%85%E8%AE%A2%E8%B4%AD%E6%88%90%E5%8A%9F%E5%90%8E%E7%AB%8B%E5%8D%B3%E7%94%9F%E6%95%88%EF%BC%8C%E7%94%9F%E6%95%88%E5%90%8E%E4%B8%8D%E5%8F%AF%E9%80%80%E3%80%82&userinfoback_ROUTE_PROVINCE_CODE=85&cond_IS_USE_DATARIGHT=0&X_CODING_STR=001100070001%2000163001_100_1024_0%20000000053001%2000051024%200004100%2000020%2000026%2000020%200004100%200015%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8C%85(100%E5%85%83%2F1G)%200001%2000163001_100_1024_0%20000000053001%2000051024%200004100%2000020%2000026%2000020%20000360%200017%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8D%8A%E5%B9%B4%E5%8C%85(100%E5%85%83%2F1G)%200001%2000163001_200_3072_0%20000000053001%2000053072%200004200%2000020%2000026%2000020%200004100%200017%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8D%8A%E5%B9%B4%E5%8C%85(200%E5%85%83%2F3G)%200001%2000163001_200_3072_0%20000000053001%2000053072%200004200%2000020%2000026%2000020%200004100%200015%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8C%85(200%E5%85%83%2F3G)%200001%2000143001_50_500_0%20000000053001%200004500%20000350%2000020%2000026%2000020%200004100%200016%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8C%85(50%E5%85%83%2F500M)%200001%2000143001_50_500_0%20000000053001%200004500%20000350%2000020%2000026%2000020%20000350%200018%E5%85%A8%E5%9B%BD%E6%B5%81%E9%87%8F%E5%8D%8A%E5%B9%B4%E5%8C%85(50%E5%85%83%2F500M)%200001%2000163002_100_1536_0%20000000053002%2000051536%200004100%2000020%2000026%2000020%200004100%200017%E7%9C%81%E5%86%85%E6%B5%81%E9%87%8F%E5%8C%85(100%E5%85%83%2F1.5G)%20&cond_INFORMATION=1.%E6%9C%AC%E4%B8%9A%E5%8A%A1%E9%80%9A%E8%BF%87%E6%9C%8D%E5%8A%A1%E5%AF%86%E7%A0%81%E8%AE%A4%E8%AF%81%2C%E6%88%96%E5%AE%A2%E6%88%B7%E4%BF%A1%E6%81%AF%E5%B7%B2%E9%80%9A%E8%BF%87%E5%85%AC%E5%AE%89%E9%83%A8%E5%85%AC%E6%B0%91%E8%BA%AB%E4%BB%BD%E4%BF%A1%E6%81%AF%E5%BA%93%E6%A0%B8%E6%9F%A5%E3%80%82%3Cbr%20%2F%3E2.%E6%B5%81%E9%87%8F%E5%8D%8A%E5%B9%B4%E5%8C%85%E8%AE%A2%E8%B4%AD%E6%88%90%E5%8A%9F%E5%90%8E%E7%AB%8B%E5%8D%B3%E7%94%9F%E6%95%88%EF%BC%8C%E7%94%9F%E6%95%88%E5%90%8E%E4%B8%8D%E5%8F%AF%E9%80%80%E3%80%82&'
// 				+ "cond_DATE=" + encodeURIComponent(resourceParam["cond_DATE"]) + '&'
// 				+ "cond_DATE1=" + encodeURIComponent(resourceParam["cond_DATE1"]) + '&'
// 				+ "cond_DATE2=" + encodeURIComponent(resourceParam["cond_DATE2"]) + '&'
// 				+ "cond_DATE3=" + encodeURIComponent(resourceParam["cond_DATE3"]) + '&'
// 				+ "cond_STAFF_ID1=" + encodeURIComponent(resourceParam["cond_STAFF_ID1"]) + '&'
// 				+ "cond_STAFF_NAME1=" + encodeURIComponent(resourceParam["cond_STAFF_NAME1"]) + '&'
// 				+ "cond_DEPART_NAME1=" + encodeURIComponent(resourceParam["cond_DEPART_NAME1"]) + '&'
// 				+ "cond_ENDDATE=" + encodeURIComponent(resourceParam["cond_ENDDATE"]) + '&'
// 				+ "cond_CUST_NAME=" + encodeURIComponent(resourceParam["cond_CUST_NAME"]) + '&'
// 				+ "cond_PSPT_TYPE_CODE=" + encodeURIComponent(resourceParam["cond_PSPT_TYPE_CODE"]) + '&'
// 				+ "cond_PSPT_ID=" + encodeURIComponent(resourceParam["cond_PSPT_ID"]) + '&'
// 				+ "cond_PSPT_ADDR=" + encodeURIComponent(resourceParam["cond_PSPT_ADDR"]) + '&'
// 				+ "cond_POST_ADDRESS=" + encodeURIComponent(resourceParam["cond_POST_ADDRESS"]) + '&'
// 				+ "cond_CONTACT=" + encodeURIComponent(resourceParam["cond_CONTACT"]) + '&'
// 				+ "cond_CONTACT_PHONE=" + encodeURIComponent(resourceParam["cond_CONTACT_PHONE"]) + '&'
// 				+ "cond_EMAIL=" + encodeURIComponent(resourceParam["cond_EMAIL"]) + '&'
// 				+ "cond_SHOWLIST=" + encodeURIComponent(resourceParam["cond_SHOWLIST"]) + '&'
// 				+ "cond_PSPT_END_DATE=" + encodeURIComponent(resourceParam["cond_PSPT_END_DATE"]) + '&'
// 				+ "cond_NET_TYPE_CODE1=" + encodeURIComponent(resourceParam["cond_NET_TYPE_CODE1"]) + '&'
// 				+ "RESOURCE_TAG=" + encodeURIComponent(order.product.resourceTag),

// 	    	{
// 				"Accept": "text/html, application/xhtml+xml, */*",
// 				"Referer": 'https://gz.cbss.10010.com/acctmanm',
//                 "x-prototype-version": "1.5.1",
// 				"Accept-Language": "zh-CN",
// 				"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
// 				"Content-Type": "application/x-www-form-urlencoded",
// 				"x-requested-with": "XMLHttpRequest",
// 				"Host": "gz.cbss.10010.com",
// 				"Connection": "Keep-Alive",
// 				"Cache-Control": "no-cache",
// 				// "Cookie": cookieString,
// 			}
//     	);
//     });
// 	casper.then(function parseAmchargeXml(){
// 		var packageHtml = ajaxAmchargeResult;
// 		if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_amcharge.xml', packageHtml, 644);
// 		var priceList = RegexUtils.queryPrice(packageHtml) || [];
// 		// if(![].contain.call(priceList, order.product.price)){
// 			response.status = '价格不对，不能订';
// 			casper.echo('<response>' + JSON.stringify(response) + '</response>');
// 			casper.exit(0);
// 			casper.bypass(99);
// 		// }
// 	});
// });

// casper.then(function submit(){
// 	casper.evaluate(function development(){
// 		document.querySelector('form[name="Form0"]').setAttribute('action','http://localhost:9200');
// 	});
// 	casper.then(function(){
// 		casper.evaluate(function(){
// 			__utils__.click('input[name="bsubmit1"]');
// 		});
// 	});
// });

casper.then(function getSubmitResult(){
	var contentHtml = this.getHTML();
	if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_acctmanResult.html', contentHtml, 644);
	if(outputDebug) casper.capture(tempdir + '/' + staffId + '_flux_acctmanResult.jpg');

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



// //** save cookies
// casper.then(function saveCookie(){
// 	var cookies = JSON.stringify(phantom.cookies);
// 	// this.echo(JSON.stringify(phantom.cookies));
// 	if(outputDebug) fs.write(tempdir + '/_cookie.txt', cookies, 644);
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
// 		if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_acctmanm.html', acctmanmHtml, 644);
// 		if(outputDebug) casper.capture(tempdir + '/' + staffId + '_acctmanm.jpg');
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
// 				if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_acctmanm_updated.html', resourceHtml, 644);
// 				if(outputDebug) casper.capture(tempdir + '/' + staffId + '_acctmanm_updated.jpg');

// 				//** 用户不能订购
// 				//TODO ?
// 				var content = RegexUtils.regexMatch(/<div class="content">(.+?)<\/div>/i, resourceHtml) || [];
// 				if(content[1] && content[1].length > 0){
// 					response.status = '用户不能订购';
// 					response.content = content[1];
// 					casper.echo('<response>' + JSON.stringify(response) + '</response>');
// 					casper.exit(0);
// 					casper.bypass(99);
// 					return;
// 				}
// 				//** 获得已订购列表
// 				//TODO ?
// 				var resourceList = RegexUtils.extractResourceInfo(resourceHtml) || [];
// 				if(outputDebug) fs.write(tempdir + '/' + staffId + '_resource_list.txt', JSON.stringify(resourceList), 644);
// 				//** 是否有正在“处理中”的业务
// 				resourceList.forEach(function(resource){
// 					if(/处理中/.test(resource.dealTag)){
// 						response.status = '用户有业务尚在处理中';
// 						response.content = JSON.stringify(resource);
// 						casper.echo('<response>' + JSON.stringify(response) + '</response>');
// 						casper.exit(0);
// 						casper.bypass(99);
// 					}
// 				});
// 				//** 可选择流量包
// 				resTableList = RegexUtils.extractResTableInfo(resourceHtml) || [];
// 				if(outputDebug) fs.write(tempdir + '/' + staffId + '_resource_table_list.txt', JSON.stringify(resTableList), 644);
// 				//** form表单参数
// 				resourceParam = RegexUtils.getResourceParam(resourceHtml) || {};
// 				if(outputDebug) fs.write(tempdir + '/' + staffId + '_resource_param.txt', JSON.stringify(resourceParam), 644);
// 				xCodingString = RegexUtils.getXcodingString(resTableList);
// 				if(outputDebug) fs.write(tempdir + '/' + staffId + '_xcoding_string.txt', JSON.stringify(xCodingString), 644);
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
// 		if(outputDebug) fs.write(tempdir + '/' + staffId + '_nav.html', navHtml, 644);
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
// 		if(outputDebug) fs.write(tempdir + '/' + staffId + '_flux_frameHeader.html', navHtml, 644);
// 		if(outputDebug) casper.capture(tempdir + '/' + staffId + '_flux_frameHeader.jpg');
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
// 		if(outputDebug) fs.write(tempdir + '/' + staffId + '_amcharge.xml', packageHtml, 644);
// 		if(outputDebug) casper.capture(tempdir + '/' + staffId + '_amcharge.jpg');
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
// // 		if(outputDebug) fs.write(tempdir + '/' + staffId + '_refresh_money.xml', chargeInfo, 644);
// // 		if(outputDebug) casper.capture(tempdir + '/' + staffId + '_refresh_money.jpg');
// // 		rMap = RegexUtils.getResourceParam(chargeInfo) || {};
		
// // 		resTableList.forEach(function(li){
// // 			if(li.resourceCode == rMap['data_RESOURCE_CODE']){
// // 				rMap['data_RESOURCE_NAME'] = li.resourceName;
// // 			}
// // 		});
// // 		if(outputDebug) fs.write(tempdir + '/' + staffId + '_rMap.txt', JSON.stringify(rMap), 644);
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
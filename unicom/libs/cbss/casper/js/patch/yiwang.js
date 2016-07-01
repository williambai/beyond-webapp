var yiwang = {};

yiwang.process = function(options, done){
	yiwang.getInterfaceElement_first(options,function(err, result1){
		if(err) return done(err);
		var options1 = {};
		yiwang.getProductInfoByTypeTrans(options1,function(err,result2){
			if(err) return done(err);
			var options2 = {};
			yiwang.getPackageByPId(options2, function(err, result3){
				if(err) return done(err);
				var options3 = {};
				yiwang.getElementByPkgId(options3, function(err,result4){
					if(err) return done(err);
					var options4 = {};
					yiwang.submitMobTrade(options4, function(err, result5){
						if(err) return done(err);
						var options5 = {};
						yiwang.continueTradeReg(options5, function(err, result6){
							if(err) return done(err);
							done(null);
						});
					});
				});
			})
		});
	});
};

yiwang.custserv = function(options,done){

	var params = '';
	params += 'service=' + encodeURIComponent('direct/1/personalserv.changeelement.ChangeElement/$MobTrade.$Form$0') + '&';
	params += 'sp=S0' + '&';
	params += 'Form0=' + encodeURIComponent('ORDER_MGR,RElA_TRADE_ID,ORDER_TYPE,SUPPORT_TAG,COMM_SHARE_NBR_STRING,AC_INFOS,FORGIFT_USER_ID,QUERY_ACCOUNT_ID,_rightCode,inModeCode,NET_TYPE_CODE,SERIAL_NUMBER,subQueryTrade') + '&';
	params += 'SUPPORT_TAG=' + '&';
	params += 'COMM_SHARE_NBR_STRING=' + '&';
	params += 'AC_INFOS=' + '&';
	params += 'FORGIFT_USER_ID=' + '&';
	params += 'QUERY_ACCOUNT_ID=' + '&';
	params += '_rightCode=csChangeServiceTrade' + '&';
	params += '_tradeBase=' + encodeURIComponent(options.tradeBase || '') + '&';
	params += 'inModeCode=1' + '&';
	params += 'ORDER_MGR=' + '&';
	params += 'RElA_TRADE_ID=' + '&';
	params += 'ORDER_TYPE=' + '&';
	params += 'NET_TYPE_CODE=' + encodeURIComponent(options.netTypeCode || '') + '&';
	params += 'SERIAL_NUMBER=' + encodeURIComponent(options.serialNumber || '') + '&';
	params += 'subQueryTrade=' + encodeURIComponent('查询');
	new Ajax.Request('/custserv',{
		method: 'post',
		parameters: params,
		onComplete: function(transport){
			console.log('==== queryCustAuth 响应: ====\n');
			console.log(transport.responseText);
			var body = transport.responseText || '<root></root>';
			try{
				var xmlDoc = (new DOMParser()).parseFromString(body,'text/xml');
				var xmlDocString = (xmlDoc.children[0]).outerHTML;
				var jsonDoc = {};

				done(null,jsonDoc);
			}catch(e){
				done(e);
			}
		},
	});
};

yiwang.queryCustAuth = function(options,done){
	var params = '';
	params += 'touchId=' + '&';
	params += 'serialNumber=' + encodeURIComponent(options.serialNumber || '') + '&';
	params += 'netTypeCode=' + encodeURIComponent(options.netTypeCode || '') + '&';
	params += 'rightCode=csChangeServiceTrade' + '&';
	params += 'globalPageName=personalserv.changeelement.ChangeElement';
	new Ajax.Request('/custserv?service=swallow/pub.chkcust.MainChkCust/queryCustAuth/1',{
		method: 'post',
		parameters: params,
		onComplete: function(transport){
			console.log('==== queryCustAuth 响应: ====\n');
			console.log(transport.responseText);
			var body = transport.responseText || '';
			done(null);
		},
	});
};


yiwang.getInterfaceElement_first = function(options,done){
	var params = '';
	params += 'contextCode=' + encodeURIComponent(options.contextCode || '') + '&';
	params += 'globalPageName=personalserv.changeelement.ChangeElement';
	new Ajax.Request('/custserv?service=swallow/common.UtilityPage/getInterfaceElement_first/1',{
		method: 'post',
		parameters: params,
		onComplete: function(transport){
			console.log('==== getInterfaceElement_first 响应: ====\n');
			console.log(transport.responseText);
			var body = transport.responseText || '';
			done(null);
		},
	});
};

yiwang.getProductInfoByTypeTrans = function(options,done){
	var params = '';
	params += 'userId=' + encodeURIComponent(options.userId || '') + '&';
	params += 'productTypeCodeA=' + encodeURIComponent(options.productTypeCodeA || '') + '&';
	params += 'productTypeCodeB=' + encodeURIComponent(options.productTypeCodeB || '') +  '&';
	params += 'groupUserId=' + encodeURIComponent(options.groupUserId || '') + '&';
	params += 'CallingAreaInfo=' + encodeURIComponent('{}') + '&';
	params += 'productId=' + encodeURIComponent(options.productId || '') + '&';
	params += 'groupId=';
	new Ajax.Request('/custserv?service=swallow/common.product.ProductHelper/getProductInfoByTypeTrans/1',{
		method: 'post',
		parameters: params,
		onComplete: function(transport){
			console.log('==== getProductInfoByTypeTrans 响应: ====\n');
			console.log(transport.responseText);
			var body = transport.responseText || '';
			done(null);
		},
	});
};

yiwang.getPackageByPId = function(options,done){
	var infosNode = document.querySelector('input[name="_infos"]');
	var infosString = infosNode.getAttribute('value') || '';
	//** {"custId":"8514110612355020","groupUserId":"","productTypeCode":"4G000001","acctId":"8514110651776507","userId":"8514110668072670","productChgFlg":"-2","serialnumber":"15599220698","grpId":"","productId":"89002148"}
	var infos = {};
	try{
		infos = JSON.parse(infoString);
	}catch(e){
		infos = {};
	}
	var tradeTypeCodeNode = document.querySelector('input[name="_TRADE_TYPE_CODE"]');
	var tradeTypeCode = tradeTypeCodeNode.getAttribute('value') || '';
	var params = '';
	params += 'productId=' + encodeURIComponent(options.productId || '') + '&';
	params += 'modifyTag=9' + '&';
	params += 'userId=' + encodeURIComponent(infos.userId || '') +  '&';
	params += 'productMode=00' + '&';
	params += 'curProductId=' + encodeURIComponent(infos.productId || '') + '&';
	params += 'onlyUserInfos=0' + '&';
	params += 'productInvalid=0' + '&';
	params += 'tradeTypeCode=' + encodeURIComponent(tradeTypeCode || '');
	new Ajax.Request('/custserv?service=swallow/common.product.ProductHelper/getPackageByPId/1',{
		method: 'post',
		parameters: params,
		onComplete: function(transport){
			console.log('==== getPackageByPId 响应: ====\n');
			console.log(transport.responseText);
			var body = transport.responseText || '<root></root>';
			var data = body.match(/<data.+?\/(>|data>)/gi) || [];
			var jsonDoc = {};
			data.forEach(function(item){
		    	var packageId = (body.match(/packageId=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
		    	//** 找到本次要变更的packageId
		    	if(packageId == options.packageId){
		    		jsonDoc.productId = (body.match(/productId=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
		    		jsonDoc.packageId = (body.match(/packageId=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
		    		jsonDoc.startDate = (body.match(/startDate=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
		    		jsonDoc.endDate = (body.match(/endDate=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
		    		jsonDoc.eparchyCode = (body.match(/eparchyCode=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
		    		jsonDoc.modifyTag = (body.match(/modifyTag=(\'|\")(.*?)(\'|\")/i) || [])[2] || '';
		    	}
			});
			done(null,jsonDoc);
			// try{
			// 	var xmlDoc = (new DOMParser()).parseFromString(body,'text/xml');
			// 	var xmlDocString = (xmlDoc.children[0]).outerHTML;

			// 	done(null,jsonDoc);
			// }catch(e){
			// 	done(e);
			// }

	});
};

yiwang.getElementByPkgId = function(options, done){

	var params = '';
	params += 'packageId=' + encodeURIComponent(options.packageId || '') + '&';
	params += 'packageTrans=' + encodeURIComponent(options.packageTrans || '') + '&';
	params += 'productId=' + encodeURIComponent(options.productId || '') +  '&';
	params += 'userId=' + encodeURIComponent(options.userId || '') +  '&';
	params += 'prodModifyTag=' +  '&';
	params += 'packModifyTag=' +  '&';
	params += 'curProductId=' + encodeURIComponent(options.curProductId || '') + '&';
	params += 'onlyUserInfos=0' + '&';
	params += 'packageInvalid=' + '&';
	params += 'userEparchyCode=' + encodeURIComponent(options.userEparchyCode || '') + '&';
	params += 'userCityCode=' + encodeURIComponent(options.userCityCode || '') + '&';
	params += 'userCallingArea=' + encodeURIComponent(options.userCallingArea || '') + '&';
	params += 'CallingAreaInfo=' + encodeURIComponent(options.CallingAreaInfo || '') + '&';
	params += 'tradeTypeCode=' + '&';
	params += 'discntItem=';
	new Ajax.Request('/custserv?service=swallow/common.product.ProductHelper/getElementByPkgId/1',{
		method: 'post',
		parameters: params,
		onComplete: function(transport){
			console.log('==== getElementByPkgId 响应: ====\n');
			console.log(transport.responseText);
			var body = transport.responseText || '';



			done(null);
		},
	});
};

yiwang.submitMobTrade = function(options, done){
	var baseInput = document.querySelector('input[name="_tradeBase"]');
	var base = baseInput && baseInput.getAttribute('value') || '';
	var brandCodeInput = document.querySelector('input[name="_BRAND_CODE"]');
	var brandCode = brandCodeInput && brandCodeInput.getAttribute('value') || '';
	var ext = {
	    "Common": {
	        "ACTOR_NAME": "",
	        "ACTOR_PHONE": "",
	        "ACTOR_CERTTYPEID": "",
	        "ACTOR_CERTNUM": "",
	        "REMARK": ""
	    },
	    "TF_B_TRADE_PRODUCT": {
	        "ITEM": [{
	            "PRODUCT_ID": options.productId,
	            "PRODUCT_MODE": "01",
	            "START_DATE": options.startDate,
	            "END_DATE": options.endDate,
	            "MODIFY_TAG": "0",
	            "USER_ID_A": "-1",
	            "ITEM_ID": "",
	            "BRAND_CODE": brandCode,
	            "X_DATATYPE": "NULL"
	        }]
	    },
	    "TF_B_TRADE_DISCNT": {
	        "ITEM": [{
	            "ID": "8516030122584995",
	            "ID_TYPE": "1",
	            "PRODUCT_ID": "89992192",
	            "PACKAGE_ID": "51708887",
	            "DISCNT_CODE": "8101109",
	            "SPEC_TAG": "0",
	            "MODIFY_TAG": "0",
	            "START_DATE": "2016-07-01 00:00:00",
	            "END_DATE": "2050-12-31 23:59:59",
	            "RELATION_TYPE_CODE": "",
	            "USER_ID_A": "-1",
	            "ITEM_ID": "",
	            "X_DATATYPE": "NULL"
	        }]
	    },
	    "TF_B_TRADE_PRODUCT_TYPE": {
	        "ITEM": [{
	            "PRODUCT_ID": "89992192",
	            "PRODUCT_MODE": "01",
	            "START_DATE": "2016-07-01 00:00:00",
	            "END_DATE": "2050-12-31 00:00:00",
	            "MODIFY_TAG": "0",
	            "X_DATATYPE": "NULL",
	            "USER_ID": "8516030122584995",
	            "PRODUCT_TYPE_CODE": "null"
	        }]
	    },
	    "TRADE_SUB_ITEM": {}
	};
	var params = '';	
	params += 'Base=' + encodeURIComponent(base || '') + '&';
	params += 'Ext=' + encodeURIComponent(JSON.stringify(ext || '')) + '&';
	params += 'globalPageName=personalserv.changeelement.ChangeElement';
	new Ajax.Request('http://localhost:9200/post/custserv?service=swallow/personalserv.changeelement.ChangeElement/submitMobTrade/1',{
		method: 'post',
		parameters: params,
		onComplete: function(transport){
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
			done(null,{
				tradeId: tradeId,
				serialNumber: serialNumber,
				netTypeCodeAll: netTypeCodeAll,
				tradeTypeCode: tradeTypeCode,
				prepayTag: prepayTag,
				strisneedprint: strisneedprint,
				tradeReceiptInfo: tradeReceiptInfo,
			});
		},
	});
};

yiwang.continueTradeReg = function(options, done){
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
	tradeMain.TRADE_ID = options.tradeId;
	tradeMain.TRADE_TYPE = '移网产品/服务变更';
	tradeMain.SERIAL_NUMBER = options.serialNumber;
	tradeMain.TRADE_FEE = '0.00';
	tradeMain.CUST_NAME = custName;
	tradeMain.CUST_ID = custId;
	tradeMain.USER_ID = userId;
	tradeMain.ACCT_ID = acctId;
	tradeMain.NET_TYPE_CODE = netTypeCode;
	tradeMain.TRADE_TYPE_CODE = encodeURIComponent(options.tradeTypeCode || '');
	params += 'tradeMain=' + encodeURIComponent('[' + JSON.stringify(tradeMain) + ']') + '&';
	params += 'fees=' + encodeURIComponent('[]') + '&';
	params += 'unChargedfees=' + encodeURIComponent('[]') + '&';
	params += 'feePayMoney=' + encodeURIComponent('[]') + '&';
	params += 'feeCheck=' + encodeURIComponent('[]') + '&';
	params += 'feePos=' + encodeURIComponent('[]') + '&';
	params += 'DerateFee=false' + '&';
	var base = {};
	base.preayTag = prepayTag;
	base.tradeTypeCode = encodeURIComponent(options.tradeTypeCode || '');
	base.strisneedprint = options.strisneedprint;
	base.serialNumber = options.serialNumber;
	base.tradeReceiptInfo = options.tradeReceiptInfo;
	base.netTypeCode = options.netTypeCodeAll;
	params += 'base=' + encodeURIComponent(JSON.stringify(base) || '') + '&';
	params += 'CASH=' + encodeURIComponent('0.00') + '&'; 
	params += 'SEND_TYPE=0' + '&';
	params += 'TRADE_ID=' + options.tradeId + '&';
	params += 'TRADE_ID_MORE_STR=' + options.tradeId + '&';
	params += 'SERIAL_NUMBER_STR=' + options.serialNumber + '&';
	params += 'TRADE_TYPE_CODE_STR=' + options.tradeTypeCode + '&';
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
	var continueTradeUrl = 'http://localhost:9200/post' + '/custserv?service=swallow/personalserv.dealtradefee.DealTradeFee/continueTradeReg/1';
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
	    	done && done(null);
	    }
	});
};


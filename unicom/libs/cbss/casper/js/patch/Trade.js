// Cs.ctrl.Trade.doSubmitTrade= function(){
//     console.log('++++++++555555++++++\n');			    
//     var pagename = $('pagecontext').pagename;
//     console.log('++++++++555555 -a ++++++\n');			    
//     try{
//         this.clearInfo();
// 	    console.log('++++++++555555 -b ++++++\n');			    
//         var info = Cs.ctrl.Trade.createObject("ACTOR_NAME","ACTOR_PHONE","ACTOR_CERTTYPEID","ACTOR_CERTNUM","REMARK");
        
//         // QC:15329 BEGIN开户业务备注被mobtrade里的覆盖  统一版本合并
//         if($("UREMARK")){
//      	   if($F("UREMARK")!=""){
//      		   info.REMARK=$F("UREMARK");
//      	   }
//         }
//         // QC:15329 END 统一版本合并
// 	    Cs.ctrl.Trade.saveObject("Common", info);
        
//     	// qc 81558 begin      
// 	    if($("DEVELOP_DEPART_ID_W") && $F("DEVELOP_DEPART_ID_W") && $("DEVELOP_STAFF_ID_W") && $F("DEVELOP_STAFF_ID_W")){
          
//             Cs.ctrl.Trade.saveObject("TRADE_ITEM",{DEVELOP_DEPART_ID:$F('DEVELOP_DEPART_ID_W'),DEVELOP_STAFF_ID:$F('DEVELOP_STAFF_ID_W')});
//          }
	    
    	
               
//     	// qc 81558 end     
// 	    console.log('++++++++555555 -c ++++++\n');			    
//         //子类业务界面其他操作

//         if (typeof finishChildSave != 'undefined' && finishChildSave instanceof Function)
//             if(finishChildSave()===false)
//                 throw $TradeExit;
        
// 	    console.log('++++++++555555 -c2 ++++++\n');			    
//      	// 业务须知    
//         var b_HintFlag = true;
//         if (typeof specSaveFlag != 'undefined' && specSaveFlag instanceof Function)
//             b_HintFlag = false;
        
//         if($("COMM_SHARE_NBR_STRING")&&!$F("COMM_SHARE_NBR_STRING").blank()){
//         	var textInfo  = "【提醒】"+$F("COMM_SHARE_NBR_STRING")+",是否一起受理";
//         	 //if(window.confirm(textInfo)){
//         	 //alert("b_HintFlag="+b_HintFlag);
//         	 if(b_HintFlag &&  window.confirm(textInfo)){
			    
// 			    	Cs.ctrl.Trade.saveObject("COMM_MOVE_Z_ITEM", {"COMM_MOVE_Z":"1"});
// 			    }					    		
//         }
//         var info =   Cs.ctrl.Trade.getObject("Common")||{};
        
// 	    console.log('++++++++555555 -d++++++\n');			    
       
//         if($P("RES_PRE_ORDER")&&$P("RES_PRE_ORDER").value=="1"){
//         	info.RES_PRE_ORDER = "1";
//         }
//          Cs.ctrl.Trade.saveObject("Common", info);
//         //生成other表的数据        
//         var okeys = Object.keys(_otherInfos);
//         for(i=0;i<okeys.length;++i)
//         {
//             if(okeys[i]!="toJSONString"&&_otherInfos[okeys[i]]!="")
//             {
//                 var ja = _otherInfos[okeys[i]].split ("~~"); //rsult为返回的串
//                 Cs.ctrl.Trade.appendItemArry("TF_B_TRADE_OTHER",ja);           
//             }
//         }
// 	    console.log('++++++++555555 -e ++++++\n');			    
//         //用于特殊批量业务
//         var okeys = Object.keys(_otherInfosNew);
//         for(i=0;i<okeys.length;++i)
//         {
//             if(okeys[i]!="toJSONString"&&_otherInfosNew[okeys[i]]!="")
//             {
//                 var ja = _otherInfosNew[okeys[i]].split ("~~"); //rsult为返回的串
//                 Cs.ctrl.Trade.appendItemArry("TF_B_TRADE_OTHER_NEW",ja);           
//             }
//         }
       
// 	    console.log('++++++++555555 -f ++++++\n');			    
//         //生成purchase表的数据        
//         var purchasekeys = Object.keys(_purchaseInfos);
//         for(i=0;i<purchasekeys.length;++i)
//         {
//             if(purchasekeys[i]!="toJSONString"&&_purchaseInfos[purchasekeys[i]]!="")
//             {
//                 var ja = _purchaseInfos[purchasekeys[i]].split ("~~"); //rsult为返回的串
//                 Cs.ctrl.Trade.appendItemArry("TF_B_TRADE_PURCHASE",ja);           
//             }
//         } 
// 	    console.log('++++++++555555 -g ++++++\n');			    
//         //生成purchase的属性表数据
//         var purchaseitemkeys = Object.keys(_purchaseItemInfos);
//         for(i=0;i<purchaseitemkeys.length;++i)
//         {
//             if(purchaseitemkeys[i]!="toJSONString"&&_purchaseItemInfos[purchaseitemkeys[i]]!="")
//             {
//                 var ja = _purchaseItemInfos[purchaseitemkeys[i]].split ("~~"); //rsult为返回的串
//                 Cs.ctrl.Trade.appendItemArry("TF_B_TRADE_SUB_ITEM",ja);       
//             }
//         }
// 	    console.log('++++++++555555 - h ++++++\n');			    
//         //生成purchase的tradefee_sub表的数据        
//         var purchasefeekeys = Object.keys(_purchaseFeeInfos);
//         for(i=0;i<purchasefeekeys.length;++i)
//         {
//             if(purchasefeekeys[i]!="toJSONString"&&_purchaseFeeInfos[purchasefeekeys[i]]!="")
//             {
//                 var ja = _purchaseFeeInfos[purchasefeekeys[i]].split ("~~"); //rsult为返回的串
//                 Cs.ctrl.Trade.appendItemArry("TF_B_TRADEFEE_SUB",ja);           
//             }
//         }          
        
// 	    console.log('++++++++555555 - i ++++++\n');			    
//         var uuKeys = Object.keys(_uuInfos);
//         var uArray = new Array;
//         for(i=0;i<uuKeys.length;++i)
//         {            	
//             if (uuKeys[i]=="GRP_ITEMS"&&$notBlank(_uuInfos[uuKeys[i]])) 
//             {   
//             	var ugrpInfo = _uuInfos[uuKeys[i]].evalJSON(true);                	
//             	Cs.ctrl.Trade.saveObject("TTRADE_GROUP", {INFOS:ugrpInfo});
//             } 
//             else if(uuKeys[i]!="toJSONString" &&$notBlank(_uuInfos[uuKeys[i]]))
//             {           
//                 uArray = uArray.concat(_uuInfos[uuKeys[i]].evalJSON());  
//             }             
            
//         }

//         if(uArray.length>0)
//         {
//         	Cs.ctrl.Trade.saveObject("GTRADE_GROUP", {INFOS:uArray});
//         }       
          
// 	    console.log('++++++++555555 -j ++++++\n');			    
//         //保存台帐数据
//         if($("baseItems")!=null)
//         {
//             _light.parent = $("baseItems");
//         	var items = _light.getValue("0");
//         	if(Object.toJSON(items)!="{}")
//         	{
//             	var old = Cs.ctrl.Trade.getObject("TRADE_ITEM");            	
//             	if(old!=null)
//             	{
//             		Object.extend(old,items);
//             		Cs.ctrl.Trade.saveObject("TRADE_ITEM",old);
//             	}
//             	else
//             	{
//             		Cs.ctrl.Trade.saveObject("TRADE_ITEM",items);
//             	}
//         	}
        	
//         	var mainT = _light.getValue("1");//台账主表
//         	if(Object.toJSON(mainT)!="{}")
//         	{
//         		Cs.ctrl.Trade.saveObject("MAIN_TREADE",mainT);
//         	}
			
// 			var subItems = _light.getValue("2");
// 			if(Object.toJSON(subItems)!="{}")
//         	{
//             	var oldSub = Cs.ctrl.Trade.getObject("TRADE_SUB_ITEM");            	
//             	if(oldSub!=null)
//             	{
//             		Object.extend(oldSub,subItems);
//             		Cs.ctrl.Trade.saveObject("TRADE_SUB_ITEM",oldSub);
//             	}
//             	else
//             	{
//             		Cs.ctrl.Trade.saveObject("TRADE_SUB_ITEM",subItems);
//             	}
//         	}
//         }
            
//     }catch(ex){
//     	if (ex!=$TradeExit){
//     		var win = new Cs.flower.Win();
//             win.alert(ex.message);
//     	}
//     	Cs.ctrl.Web.hideInfo();
//         console.log('++++++++555555 -exception ++++++\n');			    
//     	return
//     }
    
//     console.log('++++++++6666666++++++\n');			    
//     Cs.ctrl.Trade.preSubmitOk=false;
    
//          // MANYOUMODIFY
// 	 var cache = new Cs.flower.DataCache();
//      if (cache)
//        { 
//     	  var custInfo = cache.get("custInfo");
//     	  var isBlackCust=cache.get("isBlackCust");
// 		//    	  alert("isBlackCust="+Object.toJSON(isBlackCust));
// 		    if(custInfo)
// 		    {  
// 		//       if(custInfo.checkMode != 'G')
// 		//    	{
// 		        	if( custInfo !='undefined' && custInfo != undefined )
// 		    	  {
// 		    	     if(custInfo.checkMode)
// 		    	    	 {
// 		    	           if(custInfo.checkMode !='undefined' && custInfo.checkMode != undefined )
// 		    	           {
// 				             	  var info4 = {};	
// 					              info4.CHECK_TYPE = custInfo.checkMode;
// 					              info4.BLACK_CUST=isBlackCust;//add by iwil
// 					              Cs.ctrl.Trade.saveObject("TRADE_OTHER_INFO", {ITEM: info4});
// 		                  }
// 		    	         }
// 		    	     }
// 		//    	 }
// 		     }
    	 
//         }
       
//      //业务须知
//      if($("NOTE") && $F("NOTE")){
//  	 	var old = Cs.ctrl.Trade.getObject("TRADE_ITEM"); 
//  	 	if(old!=null)
//  	 	{
// 		    	var tradeItemInfoTmp = {};
// 		    	tradeItemInfoTmp.ATTR_CODE = "NOTE";
// 		    	tradeItemInfoTmp.ATTR_VALUE = $F("NOTE");// 发展人编码
// 		    	Cs.ctrl.Trade.appendObject("TF_B_TRADE_ITEM", {ITEM: tradeItemInfoTmp});
//  	 	}
//  	 	else
//  	 	{
//  	 		var items = {NOTE: $F("NOTE")};
//          	Cs.ctrl.Trade.saveObject("TRADE_ITEM",items);
//  	 	}
// 	}

// 	console.log('++++++++7777777++++++\n');			    
     
//     var str ="Base="+encodeURIComponent($F("_tradeBase"))+"&Ext="+encodeURIComponent(Object.toJSON(this._tradeInfo));
//     // console.log($F("_tradeBase"));
// 	console.log('++++++++7777777 1 ++++++\n');			    
//     console.log(Object.toJSON(this._tradeInfo));
//     Cs.Ajax.swallowXml(pagename, "submitMobTrade", str);
//     console.log('++++++++8888888+++++\n');			    
// };


// Cs.Ajax.unregister("TradeSubmitOk");
// Cs.Ajax.register("TradeSubmitOk", function(node){
	
//         var iTag = 0;
//         if(node.firstChild!=null){
//             for(var i=0;i<node.childNodes.length;i++){
//                 if(node.childNodes[i].nodeName=="checkAfterData"){
//                     checkNode=node.childNodes[i].childNodes;
//                     var checkInfo = "";
//                     var checkFlag = 0;
//                     for(var j=0;j<checkNode.length;j++){
//                         var checkData={};
//                         checkData = Cs.util.Utility.node2JSON(checkNode[j]);
                
//                         if(checkData.checkType == "1"){
//                             var win = new Cs.flower.Win();
//                            // win.alert(checkData.checkData,function(){afterTradeSubmitOk(node)});
//                             iTag = 1;
//                            // break;
//                            checkInfo += checkData.checkData+"<br>";
//                            checkFlag = 1;
//                         } 
//                     }
//                     if(checkFlag==1){//多条提示 add by zhangyangshuo 
//                      win.alert(checkInfo,function(){afterTradeSubmitOk(node)});
//                     }
//                 }
//             }
//         }
//         if(iTag == 0){afterTradeSubmitOk(node)};
//  		console.log('+++++ TradeSubmitOk end +++++\n')   
//     });

// function afterTradeSubmitOk(node){		
//  		console.log('+++++ afterTradeSubmitOk +++++\n')   
	    
//     Cs.ctrl.Trade.preSubmitOk=true; //预登记成功
    										
// 	Cs.ctrl.Trade.tradeId=node.getAttribute("tradeId");
// 	//alert(node.getAttribute("RIGHT_CODE"));
	
// 	try{
// 		if((typeof $P("RES_PRE_ORDER") != 'undefined' )&& ($P("RES_PRE_ORDER").value=="1")||(typeof $P("RES_PRE_ORDER_CP") != 'undefined' )&& ($P("RES_PRE_ORDER_CP").value=="1")){
// 		var win = new Cs.flower.Win();
// 		win.alert("订单["+Cs.ctrl.Trade.tradeId+"]已送资源预配，请核查！",function(){
// 	            Cs.ctrl.Trade.resetTrade();
	     
// 	    });
// 			return;
// 		}
// 	}catch(ex){
// 	        	if (ex!=$TradeExit){
// 	        		var win = new Cs.flower.Win();
// 	                win.alert(ex.message);
// 	        	}
// 	        	Cs.ctrl.Web.hideInfo();
// 	        	return
// 	 }
	
// 	console.log('+++++ afterTradeSubmitOk 1 +++++\n')   
					
// 	//回执单,免填单...
// 	var receipt={};
// 	var receiptNode;
// 	//费用票据...
// 	var fee = [];
// 	var feenum = 0;
	
// 	var feeNode;
// 	var feeInfo = {};
// 	var feeInfos = [];
// 	var feeObj = {};
// 	var noBack = "";
// 	//预受理订单信息
// 	var preOrderInfo={};
// 	if(node.firstChild!=null){
// 		for(var i=0;i<node.childNodes.length;i++){
// 			if(node.childNodes[i].nodeName=="Fee"){
				
// 				//feenum = node.childNodes[i].getAttribute("feenum");
// 				feeNode=node.childNodes[i].childNodes;
// 				for(var k=0;k<feeNode.length;k++)
// 				{						
// 					feeInfo=Cs.util.Utility.node2JSON(feeNode[k]);
// 					feeInfos.push(feeInfo);             //多条费用处理
// 				}
// 				if(feeInfos!=[])feeObj["fee"]= feeInfos;
// 				feenum=node.childNodes[i].childNodes.length;
// 				//alert("feeObj---"+Object.toJSON(feeObj));
// 				//alert("===="+encodeURIComponent(Object.toJSON(feeObj)));
// 				//alert("feenum--"+feenum);
// 			}else if(node.childNodes[i].nodeName=="Receipt"){				
// 				receiptNode=node.childNodes[i].childNodes;
// 			}else if(node.childNodes[i].nodeName=="TradeData"){				
// 				Cs.ctrl.Trade.TradeData=Cs.util.Utility.node2JSON(node.childNodes[i]);
// 			}else if(node.childNodes[i].nodeName=="TradeNoBack"){				
// 				var tradeNoBack = Cs.util.Utility.node2JSON(node.childNodes[i]);
// 				noBack = tradeNoBack.noRollback;
// 			}if(node.childNodes[i].nodeName=="PreOrderData"){				
// 				preOrderInfo = Cs.util.Utility.node2JSON(node.childNodes[i]);
// 			}							
// 		}
// 	}
// 	if(typeof receiptNode != 'undefined'){
// 		for(var i=0;i<receiptNode.length;i++){
// 			receipt["DETAIL"+i]=Cs.util.Utility.node2JSON(receiptNode[i]);										
// 		}	
// 		pdata=receipt;		
// 	}						
// 	console.log('+++++ afterTradeSubmitOk 2 +++++\n')   

// 	//客户开户处理
// 	if(typeof(Cs.ctrl.Trade._tradeInfo.TRADE_ITEM)!='undefined'
// 		&&Cs.ctrl.Trade._tradeInfo.TRADE_ITEM.SUB_TYPE=='5')
// 	{
// 		Cs.ctrl.Trade.continueMobTrade();
// 	}else if(feenum == 0 && typeof(Cs.ctrl.Trade.TradeData.tradeTypeCode) !='undefined' && (Cs.ctrl.Trade.TradeData.tradeTypeCode == "0020" || Cs.ctrl.Trade.TradeData.tradeTypeCode == "20" || Cs.ctrl.Trade.TradeData.tradeTypeCode == "0030" || Cs.ctrl.Trade.TradeData.tradeTypeCode == "30")){
// 		if(typeof receiptNode != 'undefined'){
// 			Cs.ctrl.Print.dealPrintData(receipt,false,true);
// 		}
// 		else
// 			Cs.ctrl.Trade.continueMobTrade();
// 	}
// 	else{
// 		var params = "SUBSCRIBE_ID="+node.getAttribute("subscribeId")+"&TRADE_ID="+node.getAttribute("tradeId")+"&PROVINCE_ORDER_ID="+node.getAttribute("proviceOrderId");
// 		//处理预受理参数 start
// 		for(var key in preOrderInfo){
// 			if(preOrderInfo.hasOwnProperty(key)){
// 				params = params+"&"+key+"="+preOrderInfo[key];
// 			}
// 		}
// 		//end
// 		params=params.toQueryParams();	
// 		//alert(node.getAttribute("RIGHT_CODE"));
// 		if(feenum ==0)
// 			$("feeArea").onshow=redirectTo('personalserv.dealtradefee.DealTradeFee','init', "&RIGHT_CODE="+node.getAttribute("RIGHT_CODE")+"&TRADE_TYPE_CODE=tradeType&param="+encodeURIComponent(Object.toJSON(params))+"&fee="+"&noBack="+noBack, 'feeframe');//by guanhl								
// 		else 
// 		{
// 			if(Cs.ctrl.Trade._tradeInfo && Cs.ctrl.Trade._tradeInfo.ITEM_INFOA && Cs.ctrl.Trade._tradeInfo.ITEM_INFOA.ORDER_TYPE=='2')
// 			{
// 				console.log('+++++ afterTradeSubmitOk 2-1-2 +++++\n')   
// 				//改单不传费用,server端会重拿一次，解决页面挂死的问题，modify by liuminglu 20111110
// 				$("feeArea").onshow=redirectTo('personalserv.dealtradefee.DealTradeFee','init', "&RIGHT_CODE="+node.getAttribute("RIGHT_CODE")+"&TRADE_TYPE_CODE=tradeType&param="+encodeURIComponent(Object.toJSON(params))+"&fee="+"&noBack="+noBack, 'feeframe', false, "POST");//by guanhl
// 			}
// 			else
// 			{
// 				console.log('+++++ afterTradeSubmitOk 2-1-3 +++++\n')   
// 				window._FEE_INFOS = "&RIGHT_CODE="+node.getAttribute("RIGHT_CODE")+"&TRADE_TYPE_CODE=tradeType&param="+encodeURIComponent(Object.toJSON(params))+"&fee="+encodeURI(encodeURI(Object.toJSON(feeObj)))+"&noBack="+noBack;//by guanhl
// 				$("feeArea").onshow=redirectTo('personalserv.dealtradefee.DealTradeFee','initRightCodeNew',"&RIGHT_CODE="+node.getAttribute("RIGHT_CODE"), 'feeframe', false, "POST");//by guanhl
// 			}
			
// 		}
											
// 		console.log('+++++ afterTradeSubmitOk 3 +++++\n')   
// 		Cs.ctrl.Trade.tradeFlow.next();
		
// 		console.log('+++++ afterTradeSubmitOk 4 +++++\n')   
// 		showFlowImage(3);
// 		if (Cs.ctrl.Trade.tradeFlow.previousBtn)
// 		   Cs.ctrl.Trade.tradeFlow.previousBtn.hide();  
// 		console.log('+++++ afterTradeSubmitOk end +++++\n')   
		   
// 	}
// }

// Cs.ctrl.Trade.doBeforeSubmitCheckHack = function(){
//     //特殊判断固网移机、移机改号，跳过错误信息，直接提交
//     if( $("_rightCode") && ($F("_rightCode")=="csMove" || $F("_rightCode")=="csModifyMphonecodeGWTrade" || $F("_rightCode")=="csChangeUserItem")){
// 		if($('_locker') && $('_locker').style && $('_locker').style.display!="none"){
// 			alert("请先关闭提示窗口，再提交！");
// 			return false;
// 		}

// 		if(!Cs.ctrl.Web.needChkCustAfter()){
// 			return false;
// 		}
//     }
// console.log('++++++++1111111++++++\n');
//     return true;
// };
// Cs.ctrl.Trade.doBeforeSubmitCheckCustId = function(){  //处理win.confirm的js事件不停止
//     var cache = new Cs.flower.DataCache();
//     if (cache){
//         var custInfo = cache.get("custInfo");
//         if (!custInfo){
//         }else{
//             if($("_CUST_ID")!=null && $("_CUST_ID").value!="" && custInfo.custId!=$("_CUST_ID").value)
//             {
//                 return false;
//             }
//         }
//     }
// 	console.log('++++++++22222++++++\n');
//     return true;
// };
// Cs.ctrl.Trade.doBeforeSubmit= function(param){
//  	//add by taomunan TFS:284955         
//     if($("hasActorArea")!=null && $("actorArea")!=null)	
//     {
//       if($("hasActorArea").style.display =="none")
//       {
   	   
//       }
//       else 
//    	   {
//    	if($("jbrId")!=null && $("jbrId").checked==true){
//    		if(($("ACTOR_NAME")!=null && $F("ACTOR_NAME").blank())||($("ACTOR_PHONE")!=null && $F("ACTOR_PHONE").blank())||
//    				($("ACTOR_CERTTYPEID")!=null && $F("ACTOR_CERTTYPEID").blank())||($("ACTOR_CERTNUM")!=null && $F("ACTOR_CERTNUM").blank()))
//    		  {
//    			alert("请展开并完善经办人信息");
//    			return;
//    		  }
//    	   }
//    	}
//     }
//     console.log('++++++++3333333++++++\n');
	
//     if (param!='otherCheckCustId'){
//         var cache = new Cs.flower.DataCache();
//         if (cache){
//             var custInfo = cache.get("custInfo");
//             if (!custInfo){
//             }else{
//                 if($("_CUST_ID")!=null && $("_CUST_ID").value!="" && custInfo.custId!=$("_CUST_ID").value)
//                 {
//                     if(!window.confirm("提示：办理此业务的客户不是首页认证的客户!是否继续受理业务？"))
//                     {
//                         return false;
//                     }
//                 }
//             }
//         }
//     }
    
//     Cs.ctrl.Web.showInfo('提交业务数据，请稍候......');
    
//     try {
//         //子类业务界面其他操作
//         if (typeof doChildValidate != 'undefined' && doChildValidate instanceof Function) 
//             if(doChildValidate()===false) {
//                 Cs.ctrl.Web.hideInfo();
//             return false;
//         }        	
    	
//         if (!Cs.ctrl.Validate.verifyData("workarea")){//此处请不要乱改.
//             Cs.ctrl.Web.hideInfo();
//             return false;
//         }
        
//          if (typeof doChildAfterValidate != 'undefined' && doChildAfterValidate instanceof Function) 
//             if(doChildAfterValidate()===false) {
//                 Cs.ctrl.Web.hideInfo();
//             return false;
//         }        	
//     }catch(e) {        

//         Cs.ctrl.Web.hideInfo();
        
//         if (e != $TradeExit)
//         {
//             var win = new Cs.flower.Win();
//             win.alert(e.message);
//         }
        
//         return false;
//     }
//     console.log('++++++++444444++++++\n');			    
//     return true;
// };
// 
// Cs.ctrl.BatTrade.doSubmitBatTrade = function(){
// 	console.log('-----submit begin------\n')
//        var pagename = $('pagecontext').pagename;    
    
//     try{
//         Cs.ctrl.Trade.clearInfo();
//         //子类业务界面其他操作
//         if (typeof finishBatChildSave != 'undefined' && finishBatChildSave instanceof Function){ 
//             if(finishBatChildSave()===false){
//             	throw $TradeExit;
//             }
// 		}
// 	}catch(ex){if (ex!=$TradeExit)win.alert(ex.message);Cs.ctrl.Web.hideInfo();return}
	
// 	var str ="_batTradeBase="+encodeURIComponent($F("_batTradeBase"))+Form.serialize("workarea");
			
// 	if(Cs.ctrl.Trade._tradeInfo!='undefined' && Cs.ctrl.Trade._tradeInfo!=null)
// 	{
// 		str+="&_tradeInfo="+encodeURIComponent(Object.toJSON(Cs.ctrl.Trade._tradeInfo));					                       
// 	}
	
// 	//数据从前台WEB端获取	
// 	if($F("_batTradeBase").evalJSON()["MODE"]=="1"||$F("_saveData")!=''){
// 		str +="&Ext="+$F("_saveData");
// 	}
// 	console.log(pagename)
// 	console.log(str);			
//        // Cs.Ajax.swallowXml(pagename, "submitTrade", str);		
// 	console.log('-----submit end------\n')
// };



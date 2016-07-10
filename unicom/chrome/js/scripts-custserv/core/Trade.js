function onKeyPressEvent(){};//移除长沙中心的回车事件
var otherPage = "common.other.OtherHelper";
var _light;
var _otherInfos = {};
var _otherInfosNew = {};
var _purchaseInfos = {};
var _purchaseFeeInfos = {};
var _purchaseItemInfos = {};
var _uuInfos = {};
var win = new Cs.flower.Win();
try{
	_light=new Cs.flower.Light();  
}catch(e){};
/**
 * 业务控制
 */
var $TradeExit = new Error("trade abort!");
Cs.ctrl.Trade = {
    
    custCheckInfo:"",
    _tradeInfo:null,
    tradeFlow:null,
    tradeId:"",
    preSubmitOk:false,//预登记是否成功
    
    getSysDate:function(){
        return $F("_sysDate");
    },
    
    getUuInfos:function(){
        return _uuInfos;
    },    
    
    afterQueryCustAuth:function(node){
        var win = new Cs.flower.Win();
        var authData = Cs.util.Utility.node2JSON(node.firstChild);
        if(authData.isAuth == "true"  && authData.paraCode5 == "1")
        {
            if(authData.hasTouch == "false")
            {
    	        win.alert("请先到首页进行认证！", function(){
    	            if (parent.menuframe.HOLD_FIRST_PAGE){
    	                switchNavFrame(parent, "navmenu_0");
    	                }
    	        });
    	        //Event.stop(event);
    	        Cs.ctrl.Web.hideInfo();
    	        return false;                   
            }
            else if(authData.paraCode4 == "1" && authData.chkTag != "1")
            {
                //强制用户认证，要求输入密码
    		    if (!Cs.ctrl.Trade.promptUserPwd(authData.userId)) {
    				//Event.stop(event);
    				Cs.ctrl.Web.hideInfo();
    		        return false;
    			}
            }
        }
    	$('subQueryTrade').click();
    },
    
    QueryTrade:function(event){
        var netTypeCode ="";
        var win = new Cs.flower.Win();
        if ($("SERIAL_NUMBER")!=null && $F("SERIAL_NUMBER").blank()){
            
            win.alert("请输入号码！", function(){$("SERIAL_NUMBER").focus();});
            Event.stop(event);
            Cs.ctrl.Web.hideInfo();
            return false;
        }
        if($("NET_TYPE_CODE")!=null && !$F("NET_TYPE_CODE").blank()){
            netTypeCode = $F("NET_TYPE_CODE");
        }
        
    	var cache = new Cs.flower.DataCache();
    	var touchId = cache.get("touchId");
    	if(typeof touchId == "undefined"){
    	    touchId="";
    	}
    	rightCode = $F("_rightCode");
    	if(trim(rightCode)=="") rightCode = "null";
    	Cs.Ajax.register("touchData",this.afterQueryCustAuth);
		Cs.Ajax.swallowXml("pub.chkcust.MainChkCust","queryCustAuth","&touchId="+touchId+"&serialNumber="+$F("SERIAL_NUMBER")+"&netTypeCode="+netTypeCode+"&rightCode="+rightCode," 正在查询，请稍候...");
    },
    
    verifyConditionArea:function(event){
    	var win = new Cs.flower.Win();
        if ($("SERIAL_NUMBER")!=null && $F("SERIAL_NUMBER").blank()){
        	if($("SIMCARD_NO")!=null){
             if($F("SIMCARD_NO").blank()){
            
            win.alert("请输入号码！", function(){$("SERIAL_NUMBER").focus();});
            Event.stop(event);
            Cs.ctrl.Web.hideInfo();
            return false;
             }
        	}else{
        	   win.alert("请输入号码！", function(){$("SERIAL_NUMBER").focus();});
               Event.stop(event);
               Cs.ctrl.Web.hideInfo();
               return false;
        	}
        }
        return true;
    },
    
    promptUserPwd:function(userId)
    {
        var result =  popupDialog("pub.chkcust.CheckUserPwd", "init", '&userId='+userId , "用户认证", "370", "90", "");
        if(result=="1")
            return true;
        else
            return false;
    },
    
    afterGetCustSession:function() {
	    //需要客户认证未进行客户认证
    	if ($F('tradeNeedCustCheck') == '1' && $F('custChecked') == "0") {
    		this.custCheckInfo = '1';
    		return;
    	}
    	
    	//需要用户认证
    	if ($F('tradeNeedUserCheck') == '1') {
    		this.custCheckInfo = '2'
    		return;
    	}
    	
    	this.custCheckInfo = '0';
    	return;
    },
    
    init:function(){
        
        $("workarea").disable();
        
        try{
            $A($("workarea").getElementsByTagName('img')).each(function(element){
                element.disabled = true;
                })
        }catch(ex){win.alert(ex.message)}
        
        if ($("SERIAL_NUMBER")!=null && ($("_locker")==null || $("_locker").style.display == "none")){
        	if($("SERIAL_NUMBER").style.display==''){
           		try {
                    $("SERIAL_NUMBER").focus();
                } catch (ex) {}
            }
        }
        
        Cs.ctrl.Trade.initCondition();
    },
    
    //初始化受理页面的查询区域
    initCondition:function(){
        var cache = new Cs.flower.DataCache();
        if (cache){
            var custInfo = cache.get("custInfo");
            if (!custInfo) return;
            if ($("SERIAL_NUMBER")&&custInfo.serialNumber&&$F("SERIAL_NUMBER").blank()){
                $("SERIAL_NUMBER").value=custInfo.serialNumber;
            }
            
            if ($("NET_TYPE_CODE")&&custInfo.netTypeCode&&$F("NET_TYPE_CODE").blank()){
                Cs.flower.LookupCombo.setValue($("NET_TYPE_CODE"), custInfo.netTypeCode);
            }
        }
    },
	
	popupDialogForCust:function (page, listener, params, title, width, height, subsyscode, subsysaddr) {
		if (title == null) title = "弹出窗口";
		if (width == null) width = 400;
		if (height == null) height = 300;
		
		var contextname = null;
		if (subsysaddr != null && !subsysaddr.endsWith("/")) {
				contextname = subsysaddr.substring(subsysaddr.lastIndexOf("/") + 1);
				subsysaddr = subsysaddr.substring(0, subsysaddr.lastIndexOf("/") + 1);
		}
		if (contextname == null)
			contextname = getContextName();
		var url = contextname + "?service=page/" + page;
		if (listener != null) url += "&listener=" + listener;
		if (params != null) url += params;
		url = getSysAddr(url, subsyscode, subsysaddr);
		if (url.indexOf("&%72andom=") == -1) url += "&random=" + getRandomParam();
		var obj = new Object();
		obj.title = title;
		obj.width = width;
		obj.height = height;
		obj.url = url;
		obj.parentwindow = window;
		var returnValue = openDialog(getSysAddr(getContextName() + "?service=page/component.Agent&random=" + getRandomParam()), width, height, obj);
		if (returnValue != null) {
			var pageName = returnValue.$pageName;
			if (pageName != null) {
				redirectTo(pageName, returnValue.$listener, returnValue.$parameters, returnValue.$target);
			}
		}
		return returnValue;
	},
	
	afterQuery:function(){
	    Cs.ctrl.Trade.tradeFlow = new Cs.flower.PageFlow();
		Cs.ctrl.Trade.tradeFlow.addPage("mobarea");
		Cs.ctrl.Trade.tradeFlow.addPage("feeArea");
		Cs.ctrl.Trade.tradeFlow.draw(); 
	    if (typeof afeterChildQuery != 'undefined' && afeterChildQuery instanceof Function) 
            	afeterChildQuery();		
        //台帐属性信息
        if($("baseItems")!=null)
        {
        	_light.parent = $("baseItems");
			var net = $F("_NET_TYPE_CODE");
			var brand = $F("_BRAND_CODE");
			var tradeT = $F("_TRADE_TYPE_CODE");
			var prop = "TRADE_ITEM";
			
			//tfs:49099 add by zyj
			_light.callback = function(){
			    var infolink = $F("_all_infos").evalJSON();
				if(Cs.ctrl.Web.$P("LINK_NAME")){
					if(typeof infolink.ALL_INFO.LINK_NAME == "undefined"){
						Cs.ctrl.Web.$P('LINK_NAME').value = infolink.CUST_NAME;
					}else{
					Cs.ctrl.Web.$P('LINK_NAME').value = infolink.ALL_INFO.LINK_NAME;
					}
				}
					if(Cs.ctrl.Web.$P("LINK_PHONE")){
					if(typeof infolink.ALL_INFO.LINK_PHONE == "undefined"){
						Cs.ctrl.Web.$P('LINK_PHONE').value = infolink.SERIAL_NUMBER;
						
					}else{
					Cs.ctrl.Web.$P('LINK_PHONE').value = infolink.ALL_INFO.LINK_PHONE;
					}
				}
		    }
			//tfs:49099 add by zyj
			
			_light.lighting_first(prop+"_"+tradeT+"_"+net+"_"+brand+"|ShowTradeItem",
			    prop+"_"+tradeT+"_"+net+"|ShowTradeItem",
			    prop+"_"+tradeT+"|ShowTradeItem",
				prop+"_"+net+"_"+brand+"|ShowTradeItem",
				prop+"_"+net+"|ShowTradeItem",prop+"|ShowTradeItem");
        }
		//营销活动推荐
		if($("SUPPORT_TAG")&& $F("SUPPORT_TAG") !=""){
			var tagArr = $F("SUPPORT_TAG").split("|");
			
			if(tagArr[0] > 0){
			
				//20111007
				var ret;
				if($('custCommendUrl').subsysaddr != null && $('custCommendUrl').subsysaddr != 'undefined' && $('custCommendUrl').subsysaddr != '') {
					if($('custCommendUrl').subsysaddr==getContextName()){
						ret =  Cs.ctrl.Trade.popupDialogForCust('ncampaign.commend.CustCommendList', 'queryCustCommends', '&USER_ID='+tagArr[1]+'&ACCEPT_SYSTEM=CUSTSERV', '活动受理列表', 600, 400,null,$('custCommendUrl').subsysaddr);
					}else{
						ret =  Cs.ctrl.Trade.popupDialogForCust('ncampaign.commend.CustCommendList', 'queryCustCommends', '&USER_ID='+tagArr[1]+'&ACCEPT_SYSTEM=CUSTSERV&LOGIN_CHECK_CODE=' + getLoginCheckCode(), '活动受理列表', 600, 400,null,$('custCommendUrl').subsysaddr);
					}
				}else{
					ret =  Cs.ctrl.Trade.popupDialogForCust('ncampaign.commend.CustCommendList', 'queryCustCommends', '&USER_ID='+tagArr[1]+'&ACCEPT_SYSTEM=CUSTSERV', '活动受理列表', 600, 400,null,$('custCommendUrl').subsysaddr);
				}
				//var ret =  Cs.ctrl.Trade.popupDialogForCust('ncampaign.commend.CustCommendList', 'queryCustCommends', '&USER_ID='+tagArr[1]+'&ACCEPT_SYSTEM=CUSTSERV', '活动受理列表', 600, 400,null,$('custCommendUrl').subsysaddr);
		
				if(ret != null && ret != 'undefined' && ret != '') {
					
					var retArr = ret.value.split(";");					
					
					$("campainID").onclick = function(){ 
							openmenu(retArr[1] + "&SERIAL_NUMBER=" + tagArr[3] + "&CAMPAIGN_ID=" + retArr[0] + "&CAMPAIGN_TYPE="  + retArr[2]);
						};
					$("campainID").click();					
				}
			} 
		}
		//~end 营销活动推荐
		if($("AC_INFOS")&& $("AC_INFOS").value !=""){
		acWindow = window.open('/app/pub/chkcust/index.html', 'newwindow', 'height=768, width=1024, top=0,left=1024, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no');
        while(true)
        {
            if(acWindow&&acWindow.document.getElementById("brand")!=null)
            break;
        }
        var acInfos = $F("AC_INFOS").split("|");
        //设置助销窗口
        acWindow.document.getElementById("brand").value = acInfos[0];
        acWindow.document.getElementById("city").value = acInfos[1];
        acWindow.document.getElementById("depart").value = acInfos[2];
        acWindow.document.getElementById("tradeType").value = acInfos[3];
        acWindow.document.getElementById("serialNumber").value = acInfos[4];
        acWindow.document.getElementById("productName").value = acInfos[5];
        acWindow.document.getElementById("fee1").value = acInfos[6];
        acWindow.document.getElementById("fee2").value = acInfos[7];
        acWindow.document.getElementById("score").value = acInfos[8];
        }       
        // 存储用户片区 tangsz 20100511
		try{
			if ($("_OTHER_INFO"))Cs.ctrl.Trade.CallingAreaInfo = $F("_OTHER_INFO").evalJSON();
		}catch(e){;}
		
		try{
			tradeTypeCode = $F("_TRADE_TYPE_CODE");
		}catch(e){;}
	},
	
	resetTrade:function(){
	    Cs.ctrl.Web.showInfo('重置界面，请稍候......');
	    Cs.ctrl.Web.clear(document);
	    _uuInfos = {};//add by zhangyangshuo
	    if($("userStatusInfo")) $("userStatusInfo").hide();
	    if ($("workarea")) Cs.ctrl.Trade.init();
	    if (typeof clearChildInterface != 'undefined' && clearChildInterface instanceof Function) 
            clearChildInterface();
        if(Cs.ctrl.Trade.tradeFlow){
	    Cs.ctrl.Trade.tradeFlow.switchPage(0);
	    if (Cs.ctrl.Trade.tradeFlow.previousBtn)
		    Cs.ctrl.Trade.tradeFlow.previousBtn.hide();
	    if (Cs.ctrl.Trade.tradeFlow.nextBtn)
		    Cs.ctrl.Trade.tradeFlow.nextBtn.show();
		}
	    Cs.ctrl.Web.hideInfo();
	},
	
	resetTradeGroup:function(){
	    Cs.ctrl.Web.showInfo('重置界面，请稍候......');
	    Cs.ctrl.Web.clear(document);
	  
	    $("productArea").innerHTML="";
	    
	  $("memberInfo").innerHTML="";
	    Cs.ctrl.Web.hideInfo();
	},

	doBeforeSubmitCheckHack:function(){
        //特殊判断固网移机、移机改号，跳过错误信息，直接提交
        if( $("_rightCode") && ($F("_rightCode")=="csMove" || $F("_rightCode")=="csModifyMphonecodeGWTrade" || $F("_rightCode")=="csChangeUserItem")){
			if($('_locker') && $('_locker').style && $('_locker').style.display!="none"){
				alert("请先关闭提示窗口，再提交！");
				return false;
			}

			if(!Cs.ctrl.Web.needChkCustAfter()){
				return false;
			}
        }
        return true;
	},
	
    doBeforeSubmitCheckCustId:function(){  //处理win.confirm的js事件不停止
        var cache = new Cs.flower.DataCache();
        if (cache){
            var custInfo = cache.get("custInfo");
            if (!custInfo){
            }else{
                if($("_CUST_ID")!=null && $("_CUST_ID").value!="" && custInfo.custId!=$("_CUST_ID").value)
                {
                    return false;
                }
            }
        }
        return true;
    },

    doBeforeSubmit:function(param){
     	//add by taomunan TFS:284955         
        if($("hasActorArea")!=null && $("actorArea")!=null)	
        {
          if($("hasActorArea").style.display =="none")
          {
       	   
          }
          else 
       	   {
       	if($("jbrId")!=null && $("jbrId").checked==true){
       		if(($("ACTOR_NAME")!=null && $F("ACTOR_NAME").blank())||($("ACTOR_PHONE")!=null && $F("ACTOR_PHONE").blank())||
       				($("ACTOR_CERTTYPEID")!=null && $F("ACTOR_CERTTYPEID").blank())||($("ACTOR_CERTNUM")!=null && $F("ACTOR_CERTNUM").blank()))
       		  {
       			alert("请展开并完善经办人信息");
       			return;
       		  }
       	   }
       	}
        }
    	
        if (param!='otherCheckCustId'){
            var cache = new Cs.flower.DataCache();
            if (cache){
                var custInfo = cache.get("custInfo");
                if (!custInfo){
                }else{
                    if($("_CUST_ID")!=null && $("_CUST_ID").value!="" && custInfo.custId!=$("_CUST_ID").value)
                    {
                        if(!window.confirm("提示：办理此业务的客户不是首页认证的客户!是否继续受理业务？"))
                        {
                            return false;
                        }
                    }
                }
            }
        }
        
        Cs.ctrl.Web.showInfo('提交业务数据，请稍候......');
        
        try {
            //子类业务界面其他操作
            if (typeof doChildValidate != 'undefined' && doChildValidate instanceof Function) 
                if(doChildValidate()===false) {
                    Cs.ctrl.Web.hideInfo();
                return false;
            }        	
        	
            if (!Cs.ctrl.Validate.verifyData("workarea")){//此处请不要乱改.
                Cs.ctrl.Web.hideInfo();
                return false;
            }
            
             if (typeof doChildAfterValidate != 'undefined' && doChildAfterValidate instanceof Function) 
                if(doChildAfterValidate()===false) {
                    Cs.ctrl.Web.hideInfo();
                return false;
            }        	
        }catch(e) {        

            Cs.ctrl.Web.hideInfo();
            
            if (e != $TradeExit)
            {
                var win = new Cs.flower.Win();
                win.alert(e.message);
            }
            
            return false;
        }
        
        return true;
    },
	
     //客户满意度调查
	custSatisfySurvey:function(params){
		
		popupDialog("popupdialog.CustSatisfactionSurvey","init",params,"客户满意度调查","500","250","");
	}, 
	
	
    //example:createObject("code", "code1", "code2|alias2");
    createObject:function(){
        var o={};
        for(var i = 0, length = arguments.length; i < length; i++) {
            var code=arguments[i];
            var alias=arguments[i];
            if (arguments[i].split("|").length>1){
			    code = arguments[i].split("|")[0];
			    alias = arguments[i].split("|")[1];
			}
            o[alias]=$(code)?$F(code):"";
        }
        return o;
    },
    
    getObject:function(name){
        return this._tradeInfo[name];
    },
    
    saveObject:function(name, obj){
        if (obj && obj != {})
            this._tradeInfo[name]=obj;
    },
    
    //追加 added by tangz@2008-12-31 0:24
    appendObject:function(name, obj){
        if (obj && obj != {}){
            if(!this._tradeInfo[name])
                this._tradeInfo[name]=obj;
            else{
                var ins = this._tradeInfo[name];
                for(var p in obj){
                    if (obj[p] instanceof Function) continue;
                    if (ins[p]){
                        //if (ins[p].constructor != Array) ins[p]=[ins[p]];
						if (!(ins[p] instanceof Array))   //modify by wangdp zhouf:此处判断有时候有问题
							ins[p]=[ins[p]];
                        ins[p].push(obj[p]);
                    }else{
                        ;//数据有问题不处理
                    }
                        
                }
            }
        }
    },
    
    extendObject:function(name, obj){
    	if (obj && obj != {})
    	{
    		if(Cs.ctrl.Trade.getObject(name))
    		{
    			var t = Cs.ctrl.Trade.getObject("ITEM_INFO");
    			Object.extend(t, obj);
    			Cs.ctrl.Trade.saveObject(name,t);
    		}
    		else
    		{
    			Cs.ctrl.Trade.saveObject(name,obj);
    		}
    	}    
    },
    
    appendItemArry:function(name, al){
        if (al && al instanceof Array){
        	var dest = this;
        	al.each(function(obj1){
        		obj = {"ITEM":obj1.evalJSON()};        		
		        if (obj && obj != {})
		        {
		            if(!dest._tradeInfo[name])
		                dest._tradeInfo[name]=obj;
		            else
		            {
		                var ins = dest._tradeInfo[name];
		                for(var p in obj)
		                {
		                    if (obj[p] instanceof Function) continue;
		                    if (ins[p]){
		                        if (ins[p].constructor != Array) ins[p]=[ins[p]];
		                        ins[p].push(obj[p]);
		                    }else{
		                        ;//数据有问题不处理
		                    }
		                        
		                }
		            }        		
		        }
        	})
        	
        }
		else
			appendObject(name, al);
    },
    
    replaceObject:function(name, obj){
        if (obj && obj != {}){
            if(!this._tradeInfo[name])
                this._tradeInfo[name]=obj;
            else{
                var ins = this._tradeInfo[name];
                
                for(var p in obj){
                    if (obj[p] instanceof Function) continue;
   
                    ins[p] = obj[p];
                }
            }
        }
    },    
    
    clearInfo:function(){
    	this._tradeInfo = {};
    },
    
    saveCommInfo:function(){
        var comm = Cs.ctrl.Trade.getObject("Common")||{};
        
        for (var i = 0, length = arguments.length; i < length; ++i) {
            Object.extend(comm, arguments[i]);
        }
        
        if (comm!={})
            Cs.ctrl.Trade.saveObject("Common", comm);
    },
    
    doSubmitTrade:function(){
        var pagename = $('pagecontext').pagename;
        try{
            this.clearInfo();
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
            //子类业务界面其他操作
            if (typeof finishChildSave != 'undefined' && finishChildSave instanceof Function)
                if(finishChildSave()===false)
                    throw $TradeExit;
            
         // 业务须知    
    	 /*   if($("NOTE") && $F("NOTE")){
            	var items = {NOTE: $F('NOTE')};
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
    	    	var tradeItemInfoTmp = {};
    	    	tradeItemInfoTmp.ATTR_CODE = "NOTE";
    	    	tradeItemInfoTmp.ATTR_VALUE = $F("NOTE");// 发展人编码
    	    	Cs.ctrl.Trade.appendObject("TF_B_TRADE_ITEM", {ITEM: tradeItemInfoTmp});
            }  */
            //Add By Zhu_ZhiMin On : 2011-11-25
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
        	return
        }
        
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

     
        var str ="Base="+encodeURIComponent($F("_tradeBase"))+"&Ext="+encodeURIComponent(Object.toJSON(this._tradeInfo));
        Cs.Ajax.swallowXml(pagename, "submitMobTrade", str);
    },
	
	continueMobTrade:function(){
		var pagename = $('pagecontext').pagename;
		Cs.Ajax.register("continueTradeOk",function(node){	
									var win = new Cs.flower.Win();							
									win.alert("业务办理成功！",function(){
									    //var params = "tradeType="+Cs.ctrl.Trade.TradeData.tradeType+"&serialNumber="+Cs.ctrl.Trade.TradeData.serialNumber;
									    //params=params.toQueryParams();
										//Cs.ctrl.Trade.custSatisfySurvey("&tradeId="+Cs.ctrl.Trade.tradeId+"&param="+Object.toJSON(params));
									
										Cs.ctrl.Trade.regTradeLast();
										
										if(Cs.ctrl.PageData.getProvinceCode()=="SXCU")
										 {
											win.alert("请先到首页重新进行认证,做下一个业务！", function(){
										    var cache = new Cs.flower.DataCache();
										        cache.remove("custInfo");
										    if (parent.menuframe.HOLD_FIRST_PAGE){
    	                                        switchNavFrame(parent, "navmenu_0");
    	                                    }
    	                                 });
    	                                 }

									});									
									Cs.ctrl.Trade.resetTrade();
								}								
					);
		
	    var win = new Cs.flower.Win();
	    win.confirm("是否确认提交业务？",{
	    	ok: function(){
	    	    var pagename = $('pagecontext').pagename;
	    		Cs.Ajax.swallowXml(pagename,"continueTradeReg","&TRADE_ID="+Cs.ctrl.Trade.tradeId);
	    	},
	    	cancel:function(){
	    	    Cs.Ajax.register("rollBackOk",function(){
	    	            Cs.ctrl.Trade.preSubmitOk = false;
					    //Cs.ctrl.Trade.tradeFlow.previous();
					    //$("printData").value="{}";
				    }
				);
                Cs.Ajax.swallowXml("personalserv.dealtradefee.DealTradeFee","rollbackTradeReg","TRADE_ID="+Cs.ctrl.Trade.tradeId);

	        }
	    });
	},	
	commonQueryRedirectTo:function(tradeTypeCode,refreshs,modes,proSetNames,querySheets,queryParam,queryEparchyCode,queryCityCode){//queryEparchyCode,queryCityCode 跨本地网查询使用 modify by zhangyangshuo

		queryParam = queryParam || "";	
		queryEparchyCode = queryEparchyCode ||"";
		var listener="";
		if(queryParam!="" && typeof queryParam!= 'undefined'){
			
			listener="query";
			if(queryParam.indexOf('&')!=0)
				queryParam='&'+$H(queryParam).toQueryString();
		}
		else{
			listener="init";
		}
		
		var clientWidth = document.documentElement.clientWidth;

		var refresh=refreshs.split(',');
		var mode=modes.split(',');
		var proSetName=proSetNames.split(',');
		var querySheet=querySheets.split(',');
		for(var i=0;i<refresh.length;i++){	
			
			redirectTo('common.query.CommonQuery',listener, '&CLIENT_WIDTH='+clientWidth + '&PRO_SET_NAME='+proSetName[i]+'&MODE='+mode[i]+'&TRADE_TYPE_CODE='+tradeTypeCode+'&QUERY_SHEET='+querySheet[i]+queryParam+(queryEparchyCode&&queryEparchyCode!=""?('&QUERY_EPARCHY_CODE='+queryEparchyCode):'')+(queryCityCode&&queryCityCode!=""?('&QUERY_CITY_CODE='+queryCityCode):''), refresh[i]);
		}	
	},
	commonQueryRedirectToPage:function(tradeTypeCode,refreshs,modes,proSetNames,querySheets,queryParam,rowCount,page,queryEparchyCode,queryCityCode){//queryEparchyCode,queryCityCode 跨本地网查询使用 modify by zhangyangshuo
//alert("-------"+rowCount+"------"+page);
		queryParam = queryParam || "";	
		var listener="";
		if(queryParam!="" && typeof queryParam!= 'undefined'){
			
			listener="query";
			if(queryParam.indexOf('&')!=0)
				queryParam='&'+$H(queryParam).toQueryString();
		}
		else{
			listener="init";
		}
		
		var clientWidth = document.documentElement.clientWidth;

		var refresh=refreshs.split(',');
		var mode=modes.split(',');
		var proSetName=proSetNames.split(',');
		var querySheet=querySheets.split(',');
		for(var i=0;i<refresh.length;i++){	
			
			redirectTo('common.query.CommonQuery',listener, '&CLIENT_WIDTH='+clientWidth + '&PRO_SET_NAME='+proSetName[i]+'&MODE='+mode[i]+'&TRADE_TYPE_CODE='+tradeTypeCode+'&QUERY_SHEET='+querySheet[i]+queryParam+'&RowCount='+rowCount+'&Page='+page+(queryEparchyCode&&queryEparchyCode!=""?('&QUERY_EPARCHY_CODE='+queryEparchyCode):'')+(queryCityCode&&queryCityCode!=""?('&QUERY_CITY_CODE='+queryCityCode):''), refresh[i]);
		}	
	},
	//身份证自动获取性别
	obtainSex:function(psptTypeCode, psptId, sex){
	
		if(psptTypeCode >= "0" && psptTypeCode <= "9"){
			if(psptId.length == 15){
				lengths = 14;
			}
			else{
				lengths = 16;
			}
			sex = sex||"SEX";
			if(parseInt(psptId.substr(lengths, 1)) % 2 == 0){
				if($(sex)){
					$(sex).value = "女";	
				}
				else if(Cs.ctrl.Web.$P(sex)){
					Cs.ctrl.Web.$P(sex).value = "女";
				}
			}
			else{
				if($(sex)){
					$(sex).value = "男";	
				}
				else if(Cs.ctrl.Web.$P(sex)){
					Cs.ctrl.Web.$P(sex).value = "男";
				}
			}
	
		}
	},
	//tfs:81995-jc-yueyh  begin
	//身份证自动获取性别
	obtainSex2:function(psptTypeCode, psptId, sex){
	
		if(psptTypeCode >= "0" && psptTypeCode <= "9"){
			if(psptId.length == 15){
				lengths = 14;
			}
			else{
				lengths = 16;
			}
			sex = sex||"SEX";
			if(parseInt(psptId.substr(lengths, 1)) % 2 == 0){
				if($(sex)){
					$(sex).value = "F";	
				}
				else if(Cs.ctrl.Web.$P(sex)){
					Cs.ctrl.Web.$P(sex).value = "F";
				}
			}
			else{
				if($(sex)){
					$(sex).value = "M";	
				}
				else if(Cs.ctrl.Web.$P(sex)){
					Cs.ctrl.Web.$P(sex).value = "M";
				}
			}
	
		}
	},
	//tfs:81995-jc-yueyh  end
	//证件类型选择后设置证件号码校验规则
	setRulePsptId:function(psptTypeCode, psptId){
	    var psptTypeCode = psptTypeCode||"PSPT_TYPE_CODE";
	    var psptId = psptId||"PSPT_ID";
	    var eltType = $(Cs.ctrl.Web.$P(psptTypeCode).valueId)||$(psptTypeCode);
	  	var eltId = Cs.ctrl.Web.$P(psptId)||$(psptId);
		
	    if (eltId){
	        eltId.value="";
	        eltId.lastvalue="";
	        var psptTypeCodeValue = eltType.value;
	        if (psptTypeCodeValue >= "0" && psptTypeCodeValue <= "9") {
	            if (! eltId.checkdata.include("ispsptid0")){
	                eltId.checkdata += ",ispsptid0";
	                
	            }
	        }
	        else{
	            if (eltId.checkdata.include("ispsptid0")){
	                eltId.checkdata = eltId.checkdata.replace(/ispsptid0(,)?/g,"");
	            }
	        }
	    }

	},
	//------------------------------------------------------------------------------------------------------------------

	oneCust:function(node) {
	    $('psptQuery').custId = node.getAttribute("CUST_ID");
	    $('CUST_ID').value = $('psptQuery').custId;
	    $('psptQuery').click();
	},
	
	manyCust:function(node) {  
	    var param = "&PSPT_TYPE_CODE="+$F('PSPT_TYPE_CODE') + "&PSPT_ID=" + $F('PSPT_ID');
		var rtnValue = popupDialog("popupdialog.ShowCustList","showAllCustList", param ,"客户列表","650",500, "CSM");
		var win = new Cs.flower.Win();
		if(!rtnValue){
			win.alert("您必须选择一位客户才能进行后面的操作！");
			return;
		}
		if(rtnValue != null && Object.toJSON(rtnValue) != 'undefined' && Object.toJSON(rtnValue) != '') {
			$('psptQuery').custId = rtnValue.custId;
			$('CUST_ID').value = $('psptQuery').custId;
			$('psptQuery').click();		
		}	
	},
	
	getCustInfo:function(){
	    if ($('psptQuery').custId!= null) return true;
	    if ($("PSPT_TYPE_CODE")!=null && $F("PSPT_TYPE_CODE").blank()){
            var win = new Cs.flower.Win();
            win.alert("请输选择证件类型！", function(){$("PSPT_TYPE_CODE$dspl").focus();});
            Event.stop(event);
            Cs.ctrl.Web.hideInfo();
            return false;
        }
        if ($("PSPT_ID")!=null && $F("PSPT_ID").blank()){
            var win = new Cs.flower.Win();
            win.alert("请输入证件号码！", function(){$("PSPT_ID").focus();});
            Event.stop(event);
            Cs.ctrl.Web.hideInfo();
            return false;
        }  
		var param = "PSPT_TYPE_CODE="+$F('PSPT_TYPE_CODE') + "&PSPT_ID=" + $F('PSPT_ID');
		Cs.Ajax.register("oneCust",this.oneCust);
		Cs.Ajax.register("manyCust",this.manyCust);	
		Cs.Ajax.swallowXml("popupdialog.ShowCustList","showAllCustList",param," 正在查询，请稍候...");
		return false;
	},
	
	//改变证件类型
    //typeCode :证件类型编码  idCheck:绑定的证件号码输入框的id
    chgPsptType:function(typeCode, idCheck){
		$(idCheck).value = "";
		/*
		 * by liujun 20110901 
		 * 
    	if (!isNaN(typeCode)){  //证件类型编码是数字表示是身份证
            $(idCheck).checkdata = "ispsptid0";
    	}//add by jiwg
    	* */
		/**
		 * add by liujun 20110901,只判断身份证
		 */
		if(typeCode == "0" || typeCode == "1" ){
			$(idCheck).checkdata = "ispsptid0";
		}
		else if(typeCode == "C" ){
			$(idCheck).checkdata = "minlength=1,islncreatecust";
		}
		else{
//    	    $(idCheck).checkdata = "isalnumchina,maxlength=20" ;
            $(idCheck).checkdata = "";
    	}
	},
	
	regTradeLast:function() {
	    if (typeof regTradeLastChild != 'undefined' && regTradeLastChild instanceof Function) 
            regTradeLastChild();
	},
	
	restTradeNew:function() {//页面重置的控制，add by zhangyangshuo
	    if (typeof restTradeChildNew != 'undefined' && restTradeChildNew instanceof Function) {
            restTradeChildNew();
            return true;
         }else{
        	return false;
    }	
    },
    showTableInfo:function(frame1,param,title,rows,cols,leftEdge,widthEdge){//在新的见面获取table里的元素 add by zhangyangshuo
    	title = title||'获取信息';
    	rows = rows||'5';
    	cols = cols||'50';
    	leftEdge = leftEdge||'300';
    	widthEdge = widthEdge||'400';
    	var win = new Cs.flower.Win();
    	var iframe = document.frames[frame1];
		var ret = iframe.getCheckRowValue();
		if (ret.X_TAG == undefined) {
				win.alert("请选择记录");
				return;
		}
		var str  = "";
		if(param!=null&&param!=""){
			var paramA = param.split(",");
			for(var i = 0;i<paramA.length;i++){
				var v = paramA[i];
				if(v.indexOf(":")>=0){
					var vv  = v.split(":");
					str += vv[1]+":"+ret[vv[0]];
				}else{
					str += v+":"+ret[v];
				}
				if(i<paramA.length-1){
					str +=",";
				}
			}
		}
		
		var str = "<textarea rows=\""+rows+"\" name=\"PhotoBuffer\" cols=\""+cols+"\">"+str+"</textarea>";
		var option = {};
		option.leftEdge=leftEdge;
		option.widthEdge=widthEdge;
		
		win.confirmHTML(title,option,str);
    
    }
}



Cs.Ajax.register("TradeSubmitOk", function(node){
	
        var iTag = 0;
        if(node.firstChild!=null){
            for(var i=0;i<node.childNodes.length;i++){
                if(node.childNodes[i].nodeName=="checkAfterData"){
                    checkNode=node.childNodes[i].childNodes;
                    var checkInfo = "";
                    var checkFlag = 0;
                    for(var j=0;j<checkNode.length;j++){
                        var checkData={};
                        checkData = Cs.util.Utility.node2JSON(checkNode[j]);
                
                        if(checkData.checkType == "1"){
                            var win = new Cs.flower.Win();
                           // win.alert(checkData.checkData,function(){afterTradeSubmitOk(node)});
                            iTag = 1;
                           // break;
                           checkInfo += checkData.checkData+"<br>";
                           checkFlag = 1;
                        } 
                    }
                    if(checkFlag==1){//多条提示 add by zhangyangshuo 
                     win.alert(checkInfo,function(){afterTradeSubmitOk(node)});
                    }
                }
            }
        }
        if(iTag == 0){afterTradeSubmitOk(node)};
    
    });
    
Cs.Ajax.register("TradePPScheck", function(node){
		win.alert("业务办理成功！ 本次业务订单号:<br>"+node.firstChild.xml);									
		Cs.ctrl.Trade.resetTrade();
    });      

function afterTradeSubmitOk(node){		
	    
    Cs.ctrl.Trade.preSubmitOk=true; //预登记成功
    										
	Cs.ctrl.Trade.tradeId=node.getAttribute("tradeId");
	//alert(node.getAttribute("RIGHT_CODE"));
	
	try{
		if((typeof $P("RES_PRE_ORDER") != 'undefined' )&& ($P("RES_PRE_ORDER").value=="1")||(typeof $P("RES_PRE_ORDER_CP") != 'undefined' )&& ($P("RES_PRE_ORDER_CP").value=="1")){
		var win = new Cs.flower.Win();
		win.alert("订单["+Cs.ctrl.Trade.tradeId+"]已送资源预配，请核查！",function(){
	            Cs.ctrl.Trade.resetTrade();
	     
	    });
			return;
		}
	}catch(ex){
	        	if (ex!=$TradeExit){
	        		var win = new Cs.flower.Win();
	                win.alert(ex.message);
	        	}
	        	Cs.ctrl.Web.hideInfo();
	        	return
	 }
	
					
	//回执单,免填单...
	var receipt={};
	var receiptNode;
	//费用票据...
	var fee = [];
	var feenum = 0;
	
	var feeNode;
	var feeInfo = {};
	var feeInfos = [];
	var feeObj = {};
	var noBack = "";
	//预受理订单信息
	var preOrderInfo={};
	if(node.firstChild!=null){
		for(var i=0;i<node.childNodes.length;i++){
			if(node.childNodes[i].nodeName=="Fee"){
				
				//feenum = node.childNodes[i].getAttribute("feenum");
				feeNode=node.childNodes[i].childNodes;
				for(var k=0;k<feeNode.length;k++)
				{						
					feeInfo=Cs.util.Utility.node2JSON(feeNode[k]);
					feeInfos.push(feeInfo);             //多条费用处理
				}
				if(feeInfos!=[])feeObj["fee"]= feeInfos;
				feenum=node.childNodes[i].childNodes.length;
				//alert("feeObj---"+Object.toJSON(feeObj));
				//alert("===="+encodeURIComponent(Object.toJSON(feeObj)));
				//alert("feenum--"+feenum);
			}else if(node.childNodes[i].nodeName=="Receipt"){				
				receiptNode=node.childNodes[i].childNodes;
			}else if(node.childNodes[i].nodeName=="TradeData"){				
				Cs.ctrl.Trade.TradeData=Cs.util.Utility.node2JSON(node.childNodes[i]);
			}else if(node.childNodes[i].nodeName=="TradeNoBack"){				
				var tradeNoBack = Cs.util.Utility.node2JSON(node.childNodes[i]);
				noBack = tradeNoBack.noRollback;
			}if(node.childNodes[i].nodeName=="PreOrderData"){				
				preOrderInfo = Cs.util.Utility.node2JSON(node.childNodes[i]);
			}							
		}
	}
	if(typeof receiptNode != 'undefined'){
		for(var i=0;i<receiptNode.length;i++){
			receipt["DETAIL"+i]=Cs.util.Utility.node2JSON(receiptNode[i]);										
		}	
		pdata=receipt;		
	}						
 
	//客户开户处理
	if(typeof(Cs.ctrl.Trade._tradeInfo.TRADE_ITEM)!='undefined'
		&&Cs.ctrl.Trade._tradeInfo.TRADE_ITEM.SUB_TYPE=='5')
	{
		Cs.ctrl.Trade.continueMobTrade();
	}else if(feenum == 0 && typeof(Cs.ctrl.Trade.TradeData.tradeTypeCode) !='undefined' && (Cs.ctrl.Trade.TradeData.tradeTypeCode == "0020" || Cs.ctrl.Trade.TradeData.tradeTypeCode == "20" || Cs.ctrl.Trade.TradeData.tradeTypeCode == "0030" || Cs.ctrl.Trade.TradeData.tradeTypeCode == "30")){
		if(typeof receiptNode != 'undefined'){
			Cs.ctrl.Print.dealPrintData(receipt,false,true);
		}
		else
			Cs.ctrl.Trade.continueMobTrade();
	}
	else{
		var params = "SUBSCRIBE_ID="+node.getAttribute("subscribeId")+"&TRADE_ID="+node.getAttribute("tradeId")+"&PROVINCE_ORDER_ID="+node.getAttribute("proviceOrderId");
		//处理预受理参数 start
		for(var key in preOrderInfo){
			if(preOrderInfo.hasOwnProperty(key)){
				params = params+"&"+key+"="+preOrderInfo[key];
			}
		}
		//end
		params=params.toQueryParams();	
		//alert(node.getAttribute("RIGHT_CODE"));
		if(feenum ==0)
			$("feeArea").onshow=redirectTo('personalserv.dealtradefee.DealTradeFee','init', "&RIGHT_CODE="+node.getAttribute("RIGHT_CODE")+"&TRADE_TYPE_CODE=tradeType&param="+encodeURIComponent(Object.toJSON(params))+"&fee="+"&noBack="+noBack, 'feeframe');//by guanhl								
		else 
		{
			if(Cs.ctrl.Trade._tradeInfo && Cs.ctrl.Trade._tradeInfo.ITEM_INFOA && Cs.ctrl.Trade._tradeInfo.ITEM_INFOA.ORDER_TYPE=='2')
			{
				//改单不传费用,server端会重拿一次，解决页面挂死的问题，modify by liuminglu 20111110
				$("feeArea").onshow=redirectTo('personalserv.dealtradefee.DealTradeFee','init', "&RIGHT_CODE="+node.getAttribute("RIGHT_CODE")+"&TRADE_TYPE_CODE=tradeType&param="+encodeURIComponent(Object.toJSON(params))+"&fee="+"&noBack="+noBack, 'feeframe', false, "POST");//by guanhl
			}
			else
			{
				window._FEE_INFOS = "&RIGHT_CODE="+node.getAttribute("RIGHT_CODE")+"&TRADE_TYPE_CODE=tradeType&param="+encodeURIComponent(Object.toJSON(params))+"&fee="+encodeURI(encodeURI(Object.toJSON(feeObj)))+"&noBack="+noBack;//by guanhl
				$("feeArea").onshow=redirectTo('personalserv.dealtradefee.DealTradeFee','initRightCodeNew',"&RIGHT_CODE="+node.getAttribute("RIGHT_CODE"), 'feeframe', false, "POST");//by guanhl
			}
			
		}
											
		Cs.ctrl.Trade.tradeFlow.next();
		
		showFlowImage(3);
		if (Cs.ctrl.Trade.tradeFlow.previousBtn)
		   Cs.ctrl.Trade.tradeFlow.previousBtn.hide();  
		   
	}
}
				
//批量业务控制				
Cs.ctrl.BatTrade = {	
    doBeforeSubmitForBatTrade:function(){
		 
        Cs.ctrl.Web.showInfo('提交业务数据，请稍候......');
        
        try {
            if (!Cs.ctrl.Validate.verifyTradeData()){
                Cs.ctrl.Web.hideInfo();
                return false;
            }
            
            //子类业务界面其他操作
            if (typeof doChildValidate != 'undefined' && doChildValidate instanceof Function)
                if(doChildValidate()===false) {
                    Cs.ctrl.Web.hideInfo();
                    return false;
                }
            
        }catch(e) {        
            Cs.ctrl.Web.hideInfo();
            
            if (e != $TradeExit)
            {
                var win = new Cs.flower.Win();
                win.alert(e.message);
            }
            
            return false;
        }
        
        return true;
    },
	

 	doBeforeImportForBatTrade:function(){

		if (typeof doBeforeImport != 'undefined' && doBeforeImport instanceof Function){
			if (!doBeforeImport())
				return false;
		} 
	},
	
	doSubmitBatTrade:function(){
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
		
        Cs.Ajax.swallowXml(pagename, "submitTrade", str);		
	},
	
	
	tradeBatInit:function(){

	}
}	

Cs.Ajax.register("BatTradeSubmitOk", 
				function(node){		
					var win = new Cs.flower.Win();					
					win.alert("提交成功！",function(){$("resetTrade").click();});	
				}
);		

//打印控制				
Cs.ctrl.Print = {	

	pdata : {},
	pdatas : {},
	//打印数据更新
	beforePrintContent:function(){	
		var pwin = top.printframe;
		
		for (var pro in  this.pdata){
			if (pwin.document.getElementById(pro)){
				
				pwin.document.getElementById(pro).innerHTML = this.pdata[pro].replace(/<br>/g, '~');
				
			}
		}
	},
	//flag:true  格式{key:value,key:value}
	//flag:false 格式{key:{key:value},key:{key:value}}
	dealPrintData:function(json,flag,contiuneTrade,callback){
		
		var key =Object.keys(json);
		
		var len =key.length;	
		var i=0;
		var reset;
		if(len>1||flag){		
			
			if(!flag){
				if(key[i] == "toJSONString"){			
					this.pdata=json[key[i+1]];
					delete json[key[i+1]];	
					this.pdatas = json;		
				}
				else{	
					this.pdata=json[key[i]];	
					delete json[key[i]];	
					this.pdatas = json;		
				}				
				i++;
			}
			
					
			var win = new Cs.flower.Win();
			//....
			
			if (WebPrinter){
				var printer = new WebPrinter(top.printframe,'0');
				//printer.preview("/print-templet/custserv/ReturnReceipt.html");
				if(typeof this.pdata.invoice!="undefined"){
					if(this.pdata.previewSwitch=="0"||this.pdata.previewSwitch==" "){
					    if(this.pdata.tradeAttr!=null&&this.pdata.tradeAttr!=""){
					 	  printer.preview("/print-templet/custserv/invoice"+this.pdata.tradeAttr+".html");
					    }else{
						  printer.preview("/print-templet/custserv/invoice.html");
						}
					 }else
					 {
					    if(this.pdata.tradeAttr!=null&&this.pdata.tradeAttr!=""){
					 	  printer.print("/print-templet/custserv/invoice"+this.pdata.tradeAttr+".html");
					    }else{
						  printer.print("/print-templet/custserv/invoice.html");	
						}
					 }
					reset=true;
				}
				else{
					if(this.pdata.eparchyCode=="ZZZZ"){
						if(this.pdata.previewSwitch=="0"||this.pdata.previewSwitch==" ")
							printer.preview("/print-templet/custserv/ReturnReceipt_"+this.pdata.tradeAttr+".html");
						else
							printer.print("/print-templet/custserv/ReturnReceipt_"+this.pdata.tradeAttr+".html");
					}						
					else{
						if(this.pdata.previewSwitch=="0"||this.pdata.previewSwitch==" ")
							printer.preview("/print-templet/custserv/ReturnReceipt_"+this.pdata.eparchyCode+"_"+this.pdata.tradeAttr+".html");
						else					
							printer.print("/print-templet/custserv/ReturnReceipt_"+this.pdata.eparchyCode+"_"+this.pdata.tradeAttr+".html");
					}	
				}
				
					
			
				
				win.confirm("是否重新打印"+this.pdata.hintInfo+"？",{
					ok: function(){
						Cs.ctrl.Print.dealPrintData(json,true,contiuneTrade,callback);		
					},
					cancel:function(){ 
						//注销以下原因是因为开户时如果取消，没有完成提交就回到初始化界面，出现了循环调用情况
						Cs.ctrl.Print.dealPrintData(json,false,contiuneTrade,callback);
						//界面重置
						/**if(reset){
						    var params = "tradeType="+parent.Cs.ctrl.Trade.TradeData.tradeType+"&serialNumber="+parent.Cs.ctrl.Trade.TradeData.serialNumber;
							params=params.toQueryParams();
							Cs.ctrl.Trade.custSatisfySurvey("&tradeId="+parent.Cs.ctrl.Trade.tradeId+"&param="+Object.toJSON(params));
							parent.Cs.ctrl.Trade.resetTrade();					
						}**/
		            }
				});
			}
		}
		else{
				if(!reset&&contiuneTrade)
					Cs.ctrl.Trade.continueMobTrade();
				
			    if (callback&&callback instanceof Function)
					callback();
		}

	},
	
	//flag:true  格式{key:value,key:value}
	//flag:false 格式{key:{key:value},key:{key:value}}
	dealPrintInvoice:function(json,flag){
		
		var key =Object.keys(json);
		var len =key.length;	
		var i=0;
		var reset;
		if(len>1||flag){		
			
			if(!flag){
				if(key[i] == "toJSONString"){			
					this.pdata=json[key[i+1]];
					delete json[key[i+1]];	
					this.pdatas = json;		
				}
				else{	
					this.pdata=json[key[i]];	
					delete json[key[i]];	
					this.pdatas = json;		
				}				
				i++;
			}
			else
			{
				this.pdata=json;
			}
			var win = new Cs.flower.Win();
			if (WebPrinter){
				var printer = new WebPrinter(top.printframe,'0');
				//printer.preview("/print-templet/custserv/ReturnReceipt.html");
				if(typeof this.pdata.invoice!="undefined"){	
					if(this.pdata.previewSwitch=="0"||this.pdata.previewSwitch==" "){
					    if(this.pdata.tradeAttr!=null&&this.pdata.tradeAttr!=""){
					 	  printer.preview("/print-templet/custserv/invoice"+this.pdata.tradeAttr+".html");
					    }else{
						  printer.preview("/print-templet/custserv/invoice.html");
						}
					 }else
					 {
					    if(this.pdata.tradeAttr!=null&&this.pdata.tradeAttr!=""){
					 	  printer.print("/print-templet/custserv/invoice"+this.pdata.tradeAttr+".html");
					    }else{
						  printer.print("/print-templet/custserv/invoice.html");	
						}
					 }
					reset=true;
					 
				}
			}
		}
	}		
	,
		dealPrintDataNew:function(json,flag,contiuneTrade,callback){//用于新打印模版调用 add by zhangyangshuo
		
			var key =Object.keys(json);
		
		var len =key.length;	
		var i=0;
		var reset;
		if(flag){		
			
			/*if(!flag){
				if(key[i] == "toJSONString"){			
					this.pdata=json[key[i+1]];
					delete json[key[i+1]];	
					this.pdatas = json;		
				}
				else{	
					this.pdata=json[key[i]];	
					delete json[key[i]];	
					this.pdatas = json;		
				}				
				i++;*/
			
			
					
			
			//....
			
			if (LodopTool){
				var printer = new LodopTool(top.printframe,'0');		
				if(typeof this.pdata.invoice!="undefined"){//发票、收据	
				 	printer.preview("/print-templet/custserv/new/PrintHtml.html",json,900,480);
				 	reset=true;
				 }else{//免签单
				 	json.printType = 1;
				 	printer.preview("/print-templet/custserv/new/PrintHtml.html",json);
				 }
				win.confirm("是否重新打印？",{
					ok: function(){
						Cs.ctrl.Print.dealPrintDataNew(json,true,contiuneTrade,callback);		
					},
					cancel:function(){
						Cs.ctrl.Print.dealPrintDataNew(json,false,contiuneTrade,callback);
		            }
				});
				}
				
			
		}
		else
			{
				if(!reset&&contiuneTrade)
					Cs.ctrl.Trade.continueMobTrade();
				
			    if (callback&&callback instanceof Function)
					callback();
		}
		
	},
	
	dealPrintDataShow:function(json){//用于打印模版显示 add by zhangyangshuo
		if (LodopTool){
			var printer = new LodopTool(top.printframe,'0');
			 json.printType = 1;
			 printer.preview("/print-templet/custserv/new/PrintHtml.html",json);
					
		}
		
	},
	dealPrintDataInvoiceNew:function(json,flag,contiuneTrade){//用于新打印模版调用 add by zhangyangshuo
		
		
		if(flag){		
			if (LodopTool){
				var printer = new LodopTool(top.printframe,'0');	
				 printer.preview("/print-templet/custserv/new/PrintHtml.html",json,900,480);
			}
		}
		
		
	}
}					

//获取页面基本信息
Cs.ctrl.PageData = {
	getPageName:function() {
		return $("pagecontext").pagename;
	},
	
	getStaffId:function() {
		return $("pagecontext").staffId;
	},
	
	getDeptId:function() {
		return $("pagecontext").deptId;
	},
	
	getDeptCode:function() {
		return $("pagecontext").deptCode;
	},
	
	getCityCode:function() {
		return $("pagecontext").cityId;
	},
	
	getEparchyCode:function() {
		return $("pagecontext").epachyId;
	},
	
	getProvinceCode:function() {
		return $("pagecontext").provinceId;
	}
}
//JS String replaceAll add by zhangyangshuo
String.prototype.replaceAll  = function(s1,s2){    
return this.replace(new RegExp(s1,"gm"),s2);    
} 
//替换字符串第id位为s  add by zhangyangshuo
String.prototype.replaceChar  = function(id,s){ 
if(id>this.length)return this;
else return (this.substring(0,id)+s+this.substring(id+1));
} 
/**
*	场景属性控制
*	add by caihy
*/
Cs.ctrl.PropCtrl = {
	
	initPropCtrl:function(obj) {
		var params = "&SUBSYS_CODE=CSM&PARAM_ATTR=1912&PARAM_CODE=PROPCTRL&PARA_CODE1=" + obj;
		
		Cs.Ajax.register("PROP_CTRL_INFO", Cs.ctrl.PropCtrl.afterDealProp);	
		Cs.Ajax.swallowXml(otherPage, "getPropCtrl", params);	
	},
	
	afterDealProp:function(node) {
		var rtnInfo = Cs.util.Utility.node2JSON(node.firstChild);
		
		if(rtnInfo != "{}") {
			Cs.ctrl.PropCtrl.dealProp(rtnInfo);
		}
	},
	
	dealProp:function(rtnInfo) {
		if(rtnInfo != "{}") {
			var arrStyle = rtnInfo.paraCode2.split("|");
			var v = $($(rtnInfo.paraCode3).valueId).value;
			var re1 = /{/g, re2 = /}/g;
			
			
			for(var m = 0; m < arrStyle.length; m ++) {
				if(arrStyle[m] == "disabled") {
					var str = rtnInfo.paraCode23;
					var arrStr = str.split("|");
	
					for(var i = 0; i < arrStr.length; i ++) {
						var arrTmp1 = arrStr[i].split("=");
						var arrTmp2 = arrTmp1[1].replace(re1, "").replace(re2, "").split(";");
						
						if(arrTmp1[0] == "default") {
							for(var j = 0; j < arrTmp2.length; j ++) {
								var arrTmp3 = arrTmp2[j].split(":");
								var flag = arrTmp3[0];
								var arrTmp4 = arrTmp3[1].split(",");
								
								for(var k = 0; k < arrTmp4.length; k ++) {
									var s = arrTmp4[k];
									if(s.indexOf("$dspl")  < 0) {
										$(s).value = "";
										$(s).disabled = eval(flag);
									}else {
										Cs.flower.LookupCombo.setValue($(s.substring(0, s.indexOf("$dspl"))),"");
										Cs.flower.LookupCombo.disabled($(s), eval(flag));
									}
								}
							}
							
							continue;
						}
						
						switch(v){
							case arrTmp1[0]:
								for(var j = 0; j < arrTmp2.length; j ++) {
									var arrTmp3 = arrTmp2[j].split(":");
									var flag = arrTmp3[0];
									var arrTmp4 = arrTmp3[1].split(",");
									
									for(var k = 0; k < arrTmp4.length; k ++) {
										var s = arrTmp4[k];
										if(s.indexOf("$dspl")  < 0) {
											if(($(s).type).toLowerCase() != "button")
												$(s).value = "";
												
											$(s).disabled = eval(flag);
										}else {
											Cs.flower.LookupCombo.setValue($(s.substring(0, s.indexOf("$dspl"))),"");
											Cs.flower.LookupCombo.disabled($(s), eval(flag));
										}
									}
								}
								
								break;
						}
					}
				}else if(arrStyle[m] == "required") {
					var str = rtnInfo.paraCode24;
					var arrStr = str.split("|");
	
					for(var i = 0; i < arrStr.length; i ++) {
						var arrTmp1 = arrStr[i].split("=");
						var arrTmp2 = arrTmp1[1].replace(re1, "").replace(re2, "").split(";");
						
						if(arrTmp1[0] == "default") {
							for(var j = 0; j < arrTmp2.length; j ++) {
								var arrTmp3 = arrTmp2[j].split(":");
								var flag = arrTmp3[0];
								var arrTmp4 = arrTmp3[1].split(",");
								
								for(var k = 0; k < arrTmp4.length; k ++) {
									$(arrTmp4[k]).required = eval(flag);
								}
							}
							
							continue;
						}
						
						switch(v){
							case arrTmp1[0]:
								for(var j = 0; j < arrTmp2.length; j ++) {
									var arrTmp3 = arrTmp2[j].split(":");
									var flag = arrTmp3[0];
									var arrTmp4 = arrTmp3[1].split(",");
									
									for(var k = 0; k < arrTmp4.length; k ++) {
										$(arrTmp4[k]).required = eval(flag);
									}
								}
								
								break;
						}
					}
				}else if(arrStyle[m] == "refresh") {
					var str = rtnInfo.paraCode25;
					var arrStr = str.split("|");
					
					for(var i = 0; i < arrStr.length; i ++) {
						var arrTmp1 = arrStr[i].split("=");
						var arrTmp2 = arrTmp1[1].replace(re1, "").replace(re2, "").split(";");
						
						if(arrTmp1[0] == "default") {
							for(var j = 0; j < arrTmp2.length; j ++) {
								var arrTmp3 = arrTmp2[j].split(":");
								var flag = arrTmp3[0];
								var arrTmp4 = arrTmp3[1].split(",");
								
								for(var k = 0; k < arrTmp4.length; k ++) {
									Cs.ctrl.PropCtrl.refreshProp(v, arrTmp4[k]);
								}
							}
							
							continue;
						}
						
						switch(v){
							case arrTmp1[0]:
								for(var j = 0; j < arrTmp2.length; j ++) {
									var arrTmp3 = arrTmp2[j].split(":");
									var flag = arrTmp3[0];
									var arrTmp4 = arrTmp3[1].split(",");
									
									for(var k = 0; k < arrTmp4.length; k ++) {
										Cs.ctrl.PropCtrl.refreshProp(v, arrTmp4[k]);
									}
								}
								
								break;
						}
					}
				}
			}
		}
	},
	
	refreshProp:function(obj1, obj2) {
		var rtnXml = obj2 + "_rtnXml";
		var params = "&parentFieldCode=" + obj1 + 
					 "&rtnXml=" + rtnXml + "&enumCode=" + obj2;
					 
	    Cs.Ajax.register(rtnXml, Cs.ctrl.PropCtrl.afterRefreshProp);		
		Cs.Ajax.swallowXml(otherPage, "refreshLookupCombo", params);	
	},
	
	afterRefreshProp:function(node) {
		var re = /_rtnXml/g;
		var obj = node.nodeName.replace(re, "");

		$(obj + "$lst").value = node.xml;
        Cs.flower.LookupCombo.setValue($(obj),"");
		Cs.flower.LookupCombo.update($(obj)); 	
	}
}

//-----------------------------------------------------
var popMap = new Map();

/**
*	弹出场景 展现及设置
*	@author by caihy 2009,8,19
*/
function fnShowPopEps(obj) {
	var length = 800;	//弹出框长度
	var width = 600;	//弹出框宽度
	
	if(obj.popLength != undefined && obj.popLength != '') {
		length = obj.popLength;
	}
	if(obj.popWidth != undefined && obj.popWidth != '') {
		width = obj.popWidth;
	}
	
	var pv = obj.popvalue;	//需返回父页面值 SEND_MAIL_FLAG@4|SEND_MAIL_FLAG
	var arr_pv = []; 	//返回父页面数组值
	var arr_pv_e = [];	//更新父页面对应ID数组值
	var robject, rvalue;
	var elementTypeCode; //场景TYPE
	var elementCode; 	//场景CODE
	
	var title = obj.value;
	var sourceData;
	
	if(!popMap.isEmpty() && popMap.isExist(obj.zbtablename)) {
		sourceData = popMap.get(obj.zbtablename);
	}
	
	var param = "&extraPropertyName=" + obj.zbtablename + "&title=" + title + "&sourceData=" + Object.toJSON(sourceData);
	
	var resultPopEps = popupDialog("popupdialog.PopShowEps", "init", param, title, length, width);
	
	if(resultPopEps != null && resultPopEps != "undefined" && undefined != "") {
		popMap.put(obj.zbtablename, resultPopEps);
		
		if(pv != null && pv != "undefined" && pv != "") {
			arr_pv = pv.split(",");
			
			for(var i = 0; i < arr_pv.length; i ++) {
				arr_pv_e = pv.split("|");
				
				for(var j = 0; j < arr_pv_e.length; j ++) {
					robject = arr_pv_e[0];
					rvalue = eval("resultPopEps." + arr_pv_e[1]);
					
					if(rvalue != null && rvalue != "undefined" && rvalue != "") {
			 			elementCode = robject.substring(0, robject.indexOf('@'));
						elementTypeCode = robject.substring(robject.indexOf('@') + 1);
					
						if(elementTypeCode == "4") {
							Cs.flower.LookupCombo.setValue($(elementCode), rvalue);
							Cs.flower.LookupCombo.update($(elementCode));
						}else {
							Cs.ctrl.Web.$P(elementCode).value = rvalue;
						}	
					}
				}
			}
		}
	}
}


/**
*	保存数据
*	@author by caihy 2009,8,21
*/
function popEpsFinishChildSave(modifyTag, startDate, endDate) {
	
	var re1 = /{/g, re2 = /}/g, re3 = /"/g;
	var arr = (popMap.toString().replace(re1, "").replace(re2, "")).split(",");
	var ii = 0;
	
	for(var i = 0; i < arr.length; i ++) {
		var epsInfo = {};
		var ztkey = (arr[i].split("="))[0];
		
		if(ztkey != null && ztkey != "undefined" && ztkey != "") {
		
			if(popMap.isExist(ztkey)) {
				ii ++;
				var str_v = Object.toJSON(popMap.get(ztkey)).toString();
				
				var arr_v = str_v.replace(re1, "").replace(re2, "").split(",");
				
				for(var j = 0; j < arr_v.length; j ++) {
					var arr_pro = arr_v[j].split(":");
					var str1 = arr_pro[0].replace(re3, "");
					
					var str2 = arr_pro[1];
					eval("epsInfo." + arr_pro[0].replace(re3, "") + '= arr_pro[1].replace(re3, "")');
				}
					
				epsInfo.RSRV_VALUE_CODE = "IOIO";	
				epsInfo.PARAM_NAME = ztkey;
				epsInfo.MODIFY_TAG = modifyTag;
				epsInfo.START_DATE = startDate;
				epsInfo.END_DATE = endDate;
				epsInfo.X_DATATYPE = "NULL";
				
				Cs.ctrl.Trade.appendObject("TRADE_OTHER_EXT", {ITEM: epsInfo});
			}
		}
		
	}
	
	if(ii == 1) {
		epsInfo.RSRV_VALUE_CODE = "PASS";
		
		Cs.ctrl.Trade.appendObject("TRADE_OTHER_EXT", {ITEM: epsInfo});
	}
}

/**  
 * 创建map
 * author cai.hy 2009,8,22
 */  
function Map() {
	
	/**  
     * 创建键值对
     * @param {key}  
     * @param {value}   
     */  
	var struct = function (key, value) {
		this.key = key;
		this.value = value;
	};
	
	/**  
     * 放入键值对
     * @param {key}  
     * @param {value}   
     */
	var put = function (key, value) {
		for (var i = 0; i < this.arr.length; i++) {
			if (this.arr[i].key === key) {
				this.arr[i].value = value;
				return;
			}
		}
		this.arr[this.arr.length] = new struct(key, value);
	};
	
	/**  
     * 获取对应值
     * @param {key}  
     */
	var get = function (key) {
		for (var i = 0; i < this.arr.length; i++) {
			if (this.arr[i].key === key) {
				return this.arr[i].value;
			}
		}
		return null;
	};
	
	/**  
     * 删除
     * @param {key}  
     */
	var remove = function (key) {
		var v;
		for (var i = 0; i < this.arr.length; i++) {
			v = this.arr.pop();
			if (v.key === key) {
				continue;
			}
			this.arr.unshift(v);
		}
	};
	
	/**  
     * 获取map数
     */
	var size = function () {
		return this.arr.length;
	};
	
	/**  
     * 判断map是否为空
     */
	var isEmpty = function () {
		return this.arr.length <= 0;
	};
	
	/**  
     * 是否已存在该key
     * @param {key}
     */  
    var isExist = function(key) {   
    	if(this.get(key) == null) {
    		return false;
    	}else {
    		return true;
    	}
    };
	
	/**  
     * 转化字符串
     */
	var toString = function () {
		var s = "{";
		for (var i = 0; i < this.arr.length; i++, s += ",") {
			var k = this.arr[i].key;
			s += k + "=" + this.arr[i].value;
		}
		s += "}";
		return s;
	};
	
	this.arr = new Array();
	this.get = get;
	this.put = put;
	this.remove = remove;
	this.size = size;
	this.isEmpty = isEmpty;
	this.isExist = isExist;
	this.toString = toString;
}

/**
	调用通用判重js 
	repeatStr 为判重串  格式： 判重场景1:参数1=值1~参数2=值2|判重场景2:参数3=值3~参数4=值4
	func为解析返回函数 ，入参为判重返回值 1为有重复，0 为没用重复
	registerName 注册事件
	例如：
	$("XSTN_ACCT").observe("change",function(){
		var param = "XSTN_ACCT";
		if(!$F(param).blank()){
		var par = "DECIDE_USER_ITEM:ATTR_CODE="+param+"~ATTR_VALUE="+$F(param)+"|DECIDE_TRADE_SUB_ITEM:ATTR_CODE="+param+"~ATTR_VALUE="+$F(param);
			getCommQueryRepeat(par,function(ret){         
		if(ret=="1"){
	   		var win = new Cs.flower.Win();
	   		win.alert("宽带账号已经存在，请重新输入！");
                   $(param).value = "";
		}
	});
	}
	});
	@author zhangyangshuo
	增加judgeFuncName参数，用于指定调用方法 add by zhangyangshuo 2011-9-16
**/
function getCommQueryRepeat(repeatStr,func,registerName,judgeFuncName){
	var judgeFuncNameW = judgeFuncName||"getCommQueryRepeat";
	registerName = registerName||'CommQueryRepeatRegister';
	Cs.Ajax.register(registerName, function(node){
  
    
  
    if(typeof func != 'undefined' && func instanceof Function){
	  func(node.getAttribute('decide'));
	}
 	});
   Cs.Ajax.swallowXml("common.UtilityPage",judgeFuncNameW, "contextCode="+repeatStr+"&registerName="+registerName, "");

}

//业务群设置方法
function configTGroup(func)
{
    var userId = "";
    var serialNumber = "";
    var brandCode = "";
    var netTypeCode = "";
    if($("_all_infos"))//非开户类
    {
        var info = $F("_all_infos").evalJSON();
        userId = info.USER_ID;
        serialNumber = info.SERIAL_NUMBER;
        brandCode = info.BRAND_CODE;
        netTypeCode = info.NET_TYPE_CODE;
    }    
    else	//开户
    {
        win.alert("开户相关业务,请在群信息中设置!");
        return;
    }
    if(_uuInfos.SVC_IPGROUP==undefined)
        _uuInfos.SVC_IPGROUP = "";
    var param = "&FUNCTION="+func+"&USER_ID="+userId+"&SERIAL_NUMBER="+serialNumber+"&BRAND_CODE="+brandCode+"&NET_TYPE_CODE="+netTypeCode;
    param += "&GROUP_INFOS="+_uuInfos.SVC_IPGROUP;
    var a = popupDialog("popupdialog.group.ModifyRelationUUs","init",param ,"群组变动","700","470");
	if(a==undefined)
		a = "";
	_uuInfos.SVC_IPGROUP = a;
}

//业务群设置方法 用于产品变更
function configTGroupByEle(func,minMember,maxMember)
{
    var userId = "";
    var serialNumber = "";
    var brandCode = "";
    var netTypeCode = "";
    if($("_all_infos"))//非开户类
    {
        var info = $F("_all_infos").evalJSON();
        userId = info.USER_ID;
        serialNumber = info.SERIAL_NUMBER;
        brandCode = info.BRAND_CODE;
        netTypeCode = info.NET_TYPE_CODE;
    }else if (typeof getModfiyRelationParam != 'undefined' && getModfiyRelationParam instanceof Function) {
            var info=getModfiyRelationParam();
            if(info===false) return;
            if(info ==null){win.alert("获取用户资料失败！！！"); return;}	
            userId = info.USER_ID;
        serialNumber = info.SERIAL_NUMBER;
        brandCode = info.BRAND_CODE;
        netTypeCode = info.NET_TYPE_CODE;
    }
    else//开户
    {
        win.alert("开户相关业务,请在群信息中设置!");
        return;
    }
    if(_uuInfos.SVC_IPGROUP==undefined)
        _uuInfos.SVC_IPGROUP = "";
    var param = "&FUNCTION="+func+"&USER_ID="+userId+"&SERIAL_NUMBER="+serialNumber+"&BRAND_CODE="+brandCode+"&NET_TYPE_CODE="+netTypeCode;
    param += "&GROUP_INFOS="+_uuInfos.SVC_IPGROUP;
    
   
    //add by zhangyangshuo 增加群组格式限制
    if(minMember!=null){
    	param+="&MIN_MEMBER="+minMember;
    }
    
    if(maxMember!=null){
    	param+="&MAX_MEMBER="+maxMember;
    }
    
    var a = popupDialog("popupdialog.group.ModifyRelationUUs","init",param ,"群组变动","700","470");
		if(a==undefined)
			a = "";
		
		var uinfo = a.split("@@");
		_uuInfos.SVC_IPGROUP = uinfo[0];
		_uuInfos.GRP_ITEMS = uinfo[1];
}

//弹出基本信息页面
function popBasicInfo(){
	if($("SERIAL_NUMBER") && $("NET_TYPE_CODE")){
		var param = "&SERIAL_NUMBER="+$F("SERIAL_NUMBER")+"&NET_TYPE_CODE="+$F("NET_TYPE_CODE");
		popupDialog("popupdialog.querybasicinfo.QueryBasicInfo","init",param,"查询基本信息","800","350");
	}

}

function  changeBankAcctNo(payModeCode,brankAcctNo,paramValue,acctModeP,valueMode){
 brankAcctNo.observe("change",function changeValue(){
		getAgreementNoInfo(payModeCode,brankAcctNo,paramValue,acctModeP,valueMode);
	});
}

function showFlowImage(index)
{	
	
	if($("flowImage"+index))		
	{			
		for(var i=0;i<4;i++)
		{
			if(index==i)
			{
				$("flowImage"+i).className="currPro";
			}
			else
				$("flowImage"+i).className="";
		}
	}
}
//切换展开和隐藏代办人信息，因为不存在mobTrade.js,所以将该方法放在此处。
function toggleOperateInfo(obj) {
    $('actorArea').toggle();
    if($('opreateHref').innerHTML == "展开代办人信息") {
        $('opreateHref').innerHTML = "隐藏代办人信息";
     	obj.className = "unexpand";
    } else {
        $('opreateHref').innerHTML  = "展开代办人信息";
      	obj.className = "expand";
    }
}
 // qc 81558 begin 
function fnGetGhStaffInfo1(){
    var para;
    // QC:95811 begin
    var result =  popupDialog("popupdialog.ChoiceStaff","init",para,"发展人名称","900","500");
  // QC:95811 end
    if(result && result!=null && typeof result != 'undefined' ){
	$("DEVELOP_DEPART_NAME_W").value = result.DEPART_NAME;
	$("DEVELOP_DEPART_ID_W").value= result.DEPART_ID;
	$("DEVELOP_STAFF_NAME_W").value = result.STAFF_NAME;
	$("DEVELOP_STAFF_ID_W").value = result.STAFF_ID;
  }
} 
 // qc 81558 end 
Cs.Ajax.register("intfElms_ShowTradeItem", function(node){_light.draw.bind(_light)(node);});	//显示个性化信息
if($("SERIAL_NUMBER")){
try{
	setTimeout(function(){$("SERIAL_NUMBER").focus();},1000);  
}catch(e){};
}

//tfs 81994 begin
var personInfo ={} ;
var custInfo ={} ;

// custInfo 存量客户
// personInfo二代证获取
var covercustinfo = {};
var tipsinfo = "";
function iscovercustcheck(personInfo, custInfo) {
	if (custInfo && personInfo) {
		/*if (personInfo.Name != null && custInfo.custName != personInfo.Name) {
			covercustinfo.custname = personInfo.Name;
			tipsinfo = "姓名";
		} else {
			covercustinfo.custname = "";
		}*/
		tipsinfo = "";
		covercustinfo.custname = "";
		if (personInfo.Sex != null && personInfo.Sex != "" && custInfo.xSex != personInfo.Sex) {
			covercustinfo.sex = personInfo.Sex;
			tipsinfo = tipsinfo + "性别、";
		} else {
			covercustinfo.sex = "";
		}
		if (personInfo.Nation != null && personInfo.Nation != "" && custInfo.folkCode != personInfo.Nation) {
			covercustinfo.folkcode = personInfo.Nation;
			tipsinfo = tipsinfo + "民族、";
		} else {
			covercustinfo.folkcode = "";
		}

		if (personInfo.Born != null &&  personInfo.Born != "" &&  custInfo.birthday != personInfo.Born) {
			covercustinfo.birthday = personInfo.Born;
			tipsinfo = tipsinfo + "生日、";
		} else {
			covercustinfo.birthday = "";
		}
		/*if (personInfo.CardNo != null &&  personInfo.CardNo != "" &&  custInfo.psptId != personInfo.CardNo) {
			covercustinfo.certcode = personInfo.CardNo;
			tipsinfo = tipsinfo + "证件号、";
		} else {
			covercustinfo.certcode = "";
		}*/

		if (personInfo.ActivityLTo != null 
				&&  personInfo.ActivityLTo != "" &&  custInfo.psptEndDate != personInfo.ActivityLTo) {
			covercustinfo.certenddate = personInfo.ActivityLTo;
			tipsinfo = tipsinfo + "证件到期时间、";
		} else {
			covercustinfo.certenddate = "";
		}

		if (personInfo.Address != null
				&&  personInfo.Address != "" &&  custInfo.psptAddr != personInfo.Address) {
			covercustinfo.certaddr = personInfo.Address;
			tipsinfo = tipsinfo + "证件地址";
		} else {
			covercustinfo.certaddr = "";
		}

	}
}

//tfs 81994 end
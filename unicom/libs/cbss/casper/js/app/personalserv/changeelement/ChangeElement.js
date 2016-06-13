//页面加载时会自动调用该方法
var caiNumberInfo={};  //彩号信息
var res=[];
caiNumberInfo.caiNumber="";
caiNumberInfo.simCard="";
caiNumberInfo.cardInfo="";

var wlanNumberInfo={};  //wlan信息
var res=[];
wlanNumberInfo.wlanNumber="";
wlanNumberInfo.cardInfo="";
var win = new Cs.flower.Win();
//qc 12527 begin
var userGrpId ="";
//qc 12527 end
//itjc-sunjw  begin
var zfInfo={};
var zhuSInfo={};
var zfTag="";
//itjc-sunjw  end 

function initChildInterface(){
	//产品预约生效时间，变量定义在Product.js中
	preStartDate = '';
	curProductId = '';
	userId = '';
	productTypeCode = '';
	cancelBooking = '0';
	var productChgFlg = '-2';
	
	//add by jc-tengdl 200385 begin 
	_userEparchyCode = $('pagecontext').loginEpachyId;
	//jc-tengdl 200385 end
	
	//add by wangwf 2015-10-13 begin
	var _all_infos = $F('_all_infos').evalJSON(true);
	var cache = new Cs.flower.DataCache();
    if (cache){
    	 custInfo = cache.get("custInfo");
    	if (!custInfo && (_all_infos.RIGHT_CODE == "csExistUserJoinWO" || _all_infos.RIGHT_CODE == "csChangeProductWO"))
    	{
    		win.error("请先创建客户或者对已有客户进行认证后<br>再办理此业务！", function(){
    		closeNavFrameByLocation();
    		if (parent.menuframe.HOLD_FIRST_PAGE)
    			switchNavFrame(parent, "navmenu_0");
    		});
    		return;
    	}
    }
	//add by wangwf 2015-10-13 end
	var _infos = $F('_infos').evalJSON(true);	
	
	if(_infos.userId != undefined) userId = _infos.userId;
	if(_infos.productId != undefined) curProductId = _infos.productId;
	if(_infos.productTypeCode != undefined) productTypeCode = _infos.productTypeCode;
	if(_infos.cancelBooking != undefined) cancelBooking = _infos.cancelBooking;
	if(_infos.productChgFlg != undefined) productChgFlg = _infos.productChgFlg;
	//tfs 5162 begin
	if(_infos.groupUserId != undefined) groupUserId = _infos.groupUserId;
	//tfs 5162 end
	
	//qc 12527 begin
	if(_infos.grpId != undefined) userGrpId = _infos.grpId;
	$("GROUP_ID_ESS").value= userGrpId;
	//qc 12527 end
	if(userId != '') {
		
		//added by zhoubl
		var _all_infos = $F('_all_infos').evalJSON(true);
		
		if(_all_infos.RIGHT_CODE == "csExistUserJoinWO"){
			productChgFlg='-1';
			getProductInfoByTypeTrans(productTypeCode, productChgFlg,curProductId,userGrpId);

		}
		//产品服务变更不刷沃享产品
		else if(_all_infos.RIGHT_CODE == "csChangeServiceTrade"){
			if ($F("NET_TYPE_CODE") == "WV"){productChgFlg='-1';}
			else{
			productChgFlg='-51';}
			getProductInfoByTypeTrans(productTypeCode, productChgFlg,curProductId,userGrpId);

		}
		else{
			getProductInfoByTypeTrans(productTypeCode, productChgFlg,curProductId,userGrpId);
		}
		//added by zhoubl end
		serialNumber = $F('SERIAL_NUMBER');
		//控制群信息
		var netTypeCode = $("NET_TYPE_CODE").value;

        if($("installGroupInfo"))
		    $("installGroupInfo").style.display="none";
		if(_all_infos.RIGHT_CODE == "csChangeServiceTradeWo" && $F('SERIAL_NUMBER_A') != "")
		{
		   Cs.ctrl.Web.$P("SERIAL_NUMBER").value = $F('SERIAL_NUMBER_A');
        }
	}
	//itjc-sunjw  begin  
	//点击查询按钮后  符合条件  将主副卡区域灰死  主卡复选框选中
	 
	if($F("SERIAL_NUMBER_ZFA")!="0"){
		$('MainCardSerialNumber').value=$F("SERIAL_NUMBER_ZFA");
	}
	if(!$F("MAIN_DEPUTY_TAG")==""&&$F("MAIN_DEPUTY_TAG")=="1"){
		 $("MainCard").checked=true;
		 $('MainCard').disabled=true; 
		 $('DeputyCard').disabled=true;
		 $('MainCardSerialNumber').disabled=true; 

	}
	//副卡复选框选中
	if(!$F("MAIN_DEPUTY_TAG")==""&&$F("MAIN_DEPUTY_TAG")=="2"){
		 $('DeputyCard').checked=true;
		 $('MainCard').disabled=true; 
		 $('DeputyCard').disabled=true;
		 $('MainCardSerialNumber').disabled=true; 
		 
	}
	//存在主主 UU 关系 主卡选中
	//存在主主 UU 关系 存在300返回产品  有权限   主卡选中 ，，不灰死
	if(!$F("MAIN_DEPUTY_TAG")==""&&$F("MAIN_DEPUTY_TAG")=="3"){
		 $("MainCard").checked=true;
	}
	//存在主主 UU 关系 存在300返回产品 主卡选中 ，，灰死
	if(!$F("MAIN_DEPUTY_TAG")==""&&$F("MAIN_DEPUTY_TAG")=="4"){
		 $('MainCard').checked=true;
		 $('MainCard').disabled=true; 
		 $('DeputyCard').disabled=true;
		 $('MainCardSerialNumber').disabled=true; 
	} 
	//存在取消副卡业务 再校验不允许操作 该区域
	if(!$F("MAIN_DEPUTY_TAG")==""&&$F("MAIN_DEPUTY_TAG")=="6"){
		 $('MainCard').disabled=true; 
		 $('DeputyCard').disabled=true;
		 $('MainCardSerialNumber').disabled=true; 
	} 
//	//点击查询按钮后 显示主副卡区域
//	if(!$F("MAIN_DEPUTY_TAG")==""){
//		 $('MainDeputyT').style.display="block";
//	}
	//绕过 什么都不变更的标记
	$("TO_TRADE_TAG").value="0";
	//隐藏主副卡 框
	$("TO_DISABLED").value="1";
	//itjc-sunjw  end 
	
	//add by wanggang begin 副卡实名办理验证码\服务密码验证初始化 

	 Cs.flower.LookupCombo.disabled($('CHECK_TYPE'),true);
     $("CheckNumber").disabled=true;
     $("CheckNumber").value ="";    
     //$("second").hide();
     $('second').disabled=true;	 
     //wanggang end 
     //jipc
     if($("GROUP_ACTIVITY").value=="WV00"){
    	 $("fGroupUser").style.display='block';
     }
     if ($F("NET_TYPE_CODE") == "WV")
			allDisabled = true ;
     
	  if($F("PRO_HEYUE_TAG") != "1"){
	    $("HeYueProduct").style.display='none';
	    }
     
}
function changeTualGroupId(){
	$("shortGroupNumber").value="";
}
function checkTualGroupId(){
	if($("TUAL_GROUP_ID").value==""){
		win.alert("请选择要加入的群！",function(){$("shortGroupNumber").value="";$("TUAL_GROUP_ID$dspl").focus()});	
		return ;
	}
	if($("USER_ID_A_HIDEN").value!="" && typeof ($("TUAL_GROUP_ID$dspl").rowselected) =="undefined"){
		var userIdA = $("USER_ID_A_HIDEN").value;
		var headNumber = $("HEAD_NUMBER_HIDEN").value;
    	var lenLimit = $("LEN_LIMIT_HIDEN").value;
	}else{
		var fmprod = $("TUAL_GROUP_ID$dspl").rowselected.cells;
	    var titleCode = split2Json($('TUAL_GROUP_ID$dspl').titleCodes);
	    var userIdA = fmprod[titleCode.USER_ID].innerText;
	    var headNumber = fmprod[titleCode.HEAD_NUMBER].innerText;
    	var lenLimit = fmprod[titleCode.LEN_LIMIT].innerText;
	}
	if(lenLimit!=-1 && trim($("shortGroupNumber").value).length!=lenLimit){
		win.alert("短号位数必须为"+lenLimit+"位！",function(){$("shortGroupNumber").value="";});
		return;
	}
	if(headNumber!=-1 && trim($("shortGroupNumber").value).substr(0,headNumber.length)!=headNumber){
		win.alert("短号请以["+headNumber+"]前缀开头！",function(){$("shortGroupNumber").value="";});
		return;
	}
	//对短号的检验
	Cs.Ajax.register("checkShortNumber", obtCheckShortNumber);	
	var params = "USER_ID_A="+userIdA+"&relationTypeCode=67&shortCode="+$("shortGroupNumber").value;
	Cs.Ajax.swallowXml("", "checkShortNumber",params,"正在对短号进行检验，请稍候...");
}
function checkCaiNumber()
{ 
    //var number =$("SERIAL_NUMBER_SX").value;
    //caiNumberInfo.caiNumber=number;
	var tagcaihao = $F('OLD_Number');
	if(tagcaihao != '') 
	{
		//$('CAI_BUTTON').disabled=true;
		win.alert('修改彩号信息请先中止彩号服务，再次开通选号！');
		return false;
	}	    
    var netypecode = $("NET_TYPE_CODE").value;
    var brandCode = $("BRAND_CODE").value;
    var params = "&NetTypeCode=" + netypecode + "&BRAND_CODE=" + brandCode;
    Cs.Ajax.register('caiNumInfo',afterCaiNumber);
	Cs.Ajax.swallowXml('','afterCaiNumber',params,'正在校验，请稍候...');
}	
function afterCaiNumber(node){
    var cardInfo = Cs.util.Utility.node2JSON(node);
	caiNumberInfo.cardInfo=cardInfo;

    $("SIM_CARD_SX").readOnly = false; 
    $("SERIAL_NUMBER_SX").readOnly = false; 
    $("SIM_CARD_SX").value=node.getAttribute("simCardNo");
    $("SERIAL_NUMBER_SX").value=node.getAttribute("serialNumber");
    caiNumberInfo.simCard=$("SIM_CARD_SX").value;
    caiNumberInfo.caiNumber = $("SERIAL_NUMBER_SX").value; 
    
    $("SIM_CARD_SX").readOnly = true;  
    $("SERIAL_NUMBER_SX").readOnly = true;    
}    
/*
function choiceWlanSN(){
	  
	   var tagwlanhao = $F('OLD_WlanNumber');
		if(tagwlanhao != '') 
		{
			alert('修改WLAN帐号信息请先中止WLAN服务，再次开通选号！');
			return false;
		}
		

		var netTypeCode = $F('NET_TYPE_CODE');
	    var brandCode =$F('BRAND_CODE');
	    var result =  popupDialog("popupdialog.ChoiceWlanSN","init","&NET_TYPE_CODE="+netTypeCode+"&BRAND_CODE="+brandCode,"宽带选号屏","600","380");
	    if( result&& !result.blank()){
	       $('SERIAL_NUMBER_WLAN').value = result;
	       
	       wlanNumberInfo.wlanNumber = $("SERIAL_NUMBER_WLAN").value;
	     
	       newSerialNumberExit($('SERIAL_NUMBER_WLAN'));
	     }
}
*/
function newSerialNumberExit(obj){
	
	var params = "&SerialNumber=" +$('SERIAL_NUMBER_WLAN').value+"&NetTypeCode="+$F('NET_TYPE_CODE')+"&BrandCode="+$("BRAND_CODE").value;
    Cs.Ajax.swallowXml('','afterWlanNumber',params,'正在校验，请稍候...');
   }
function checkDoubleNumber()
{ 
    var params = "&phone=" + $("BIND_SERIAL_NUMBER").value;
    Cs.Ajax.register('result',parseResultXml1);
    Cs.Ajax.swallowXml('','checkDoubleNumber',"Base="+encodeURIComponent($F("_tradeBase"))+params,'正在校验，请稍候...');
}

function parseResultXml1(node){
    if(node.childNodes.length==1)
    {
		if(node.childNodes[0].getAttribute("state")== "1" ) 
		{
			win.alert("该号码已被绑定！",function(){$("BIND_SERIAL_NUMBER").value=""});
			return ;
		}else if(node.childNodes[0].getAttribute("state")== "2"){
			win.alert("该号码被预占用，请稍后再试！",function(){$("BIND_SERIAL_NUMBER").value=""});
			return ;
		}
	}else if(node.childNodes.length==0){
		$("BIND_SERIAL_NUMBER").value="";
   		win.alert("此号码在数据库当中不存在，请联系数据库管理员！");
   		return ;
	}else if(node.childNodes.length==2){
		$("BIND_SERIAL_NUMBER").value="";
   		win.alert("此号码在数据库当中存在多个，请联系数据库管理员！");
   		return ;
	}
}
	
function split2Json(titles,separator)
{
    var sep = separator||','
    var json = {};
    var titlearr = titles.split(sep);
    for(i=0;i<titlearr.length;++i)
    {
        json[titlearr[i]] = i;
    }
    return json;
}
function obtCheckShortNumber(node) {
	if( node.getAttribute("num") != "0" ) 
	{
		win.alert("该短号已经存在！",function(){$("shortGroupNumber").value=""});
		return ;
	}
}
function checkVpnGroupInfo(){
	var svcTag = false;
	var groupServiceId = "30076";
	$A($(productArea).all).each(function(prod) {
		if(prod.tagName.toUpperCase() == 'INPUT' && prod.type.toUpperCase() == 'CHECKBOX'
			&& prod._thisType != 'undefined' && prod._thisType.toUpperCase() == 'PRODUCT') {			
			//获取已选元素信息
			$A($('p'+prod.productId).all).each(function(elem) {
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
					&& elem._thisType != 'undefined' && elem._thisType.toUpperCase() == 'ELEMENT'
					&& elem.checked) {
					if (elem.elementTypeCode.toUpperCase() == "S") {
						if(elem.elementId==groupServiceId){
							svcTag = true;
						}
						if(elem.elementId=="30076" && $("shortGroupNumber").value==""){
							throw new Error("当前服务为【虚拟VPN】，请检查群信息内容是否完整！");
						}
					}
				}
			});
		}
	});
	
    if($("shortGroupNumber").value!="" && !svcTag){
    	if(groupServiceId=="30076"){
    		throw new Error("请选择相应的VPN群！");
    	}
    }
}

function doChildValidate() {
	var netTypeCode = $("NET_TYPE_CODE").value;
}

//组织提交到后台的数据
function finishChildSave(){
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
	//itjc-sunjw end 
	try {
		geneTradeInfo();
	}
	catch(e) {
		win.alert(e.message);
		return false;
	}

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

function createTradeItem(){
		var tempItemArray =[];
			var info1 = {};
			info1.ATTR_CODE = "ID_A";
			info1.ATTR_VALUE = $("USER_ID_HIDEN").value;
			info1.X_DATATYPE = "NULL";
			tempItemArray.push(info1);
			
			var info2 = {};	
			info2.ATTR_CODE = "ID_B";
			info2.ATTR_VALUE = $("USER_ID_A_HIDEN").value;
			info2.X_DATATYPE = "NULL";
			tempItemArray.push(info2);
			
			var info3 = {};	
			info3.ATTR_CODE = "SERIAL_NUMBER_A";
			info3.ATTR_VALUE = $("SERIAL_NUMBER").value;
			info3.X_DATATYPE = "NULL";
			tempItemArray.push(info3);
			
			var info4 = {};	
			info4.ATTR_CODE = "SERIAL_NUMBER_B";
			info4.ATTR_VALUE = $("HEAD_NUMBER_HIDEN").value;
			info4.X_DATATYPE = "NULL";
			tempItemArray.push(info4);
			
			Cs.ctrl.Trade.saveObject("TF_B_TRADE_ITEM", {ITEM: tempItemArray});
}
//记录副卡号码、卡号信息

function recordResInfo(){
	
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
	return res;
}

function recordResInfoOld(){
	
	var snOld={};
	snOld.RES_TYPE_CODE="8";  //标识彩号号码
	snOld.RES_CODE=$("OLD_Number").value;
	snOld.MODIFY_TAG="1";
    snOld.X_DATATYPE="NULL";
    snOld.START_DATE =$("START_DATE").value;
    snOld.END_DATE = Cs.ctrl.Trade.getSysDate();
	res.push(snOld);
	//if ($("SIM_CARD_SX")){
	var cardOld={};
	cardOld.RES_TYPE_CODE="9";
	cardOld.RES_CODE=$("OLD_IMSI").value;
	cardOld.RES_INFO1=caiNumberInfo.cardInfo.imsi;
	cardOld.RES_INFO4=caiNumberInfo.cardInfo.feeCodePayFlag;  //卡容量 tf_r_simcard_idle.CAPACITY_TYPE_CODE
	cardOld.RES_INFO5=caiNumberInfo.cardInfo.codeTypeCode;	  //卡类型 tf_r_simcard_idle.
	cardOld.MODIFY_TAG="1";
	cardOld.X_DATATYPE="NULL";
	cardOld.START_DATE = $("START_DATE").value;
    cardOld.END_DATE = Cs.ctrl.Trade.getSysDate();
	res.push(cardOld);
	//}
	return res;
}
function recordWlanResInfo(){
	
	
	var snwlan={};
	snwlan.RES_TYPE_CODE=$F("WLAN_RES_TYPE_CODE");  //标识wlan号码
	snwlan.RES_CODE=wlanNumberInfo.wlanNumber;
	snwlan.MODIFY_TAG="0";
    snwlan.X_DATATYPE="NULL";
    snwlan.START_DATE = Cs.ctrl.Trade.getSysDate();
    snwlan.END_DATE = "2050-12-31 23:59:59";
	res.push(snwlan);
	
	return res;
}

function recordWlanResInfoOld(){
	
	var snwlanOld={};
	snwlanOld.RES_TYPE_CODE=$F("WLAN_RES_TYPE_CODE");  //标识WLAN号码
	snwlanOld.RES_CODE=$("OLD_WlanNumber").value;
	snwlanOld.MODIFY_TAG="1";
    snwlanOld.X_DATATYPE="NULL";
    snwlanOld.START_DATE ="2004-12-31 23:59:59";
    snwlanOld.END_DATE = Cs.ctrl.Trade.getSysDate();
	res.push(snwlanOld);

	//}
	return res;
}
function regTradeLastChild() {
	if(cancelBooking > 0) {
		win.confirm("当前用户办理了活动变更或产品/服务变更取消业务,是否进行恢复受理？",{
			ok: function(){
			    redirectToNav('personalserv.changeproduct.ChangeProduct','initMobTrade', '','contentframe');
			},
			cancel:function(){
		    }
		});
	}
}

/**
**校验小灵通号码是否是在网用户
*@serivalNumber 输入号
*@author xuf
*/
function checkSerialNumber(serivalNumber){

	if(serivalNumber==""){
		win.alert("请输入小灵通号码！");
	}else{
	    win.confirm("小灵通增值业务只能办理彩铃和短信业务？",{
			ok: function(){
			    var user_id = $("USER_ID_HIDEN").value;
				Cs.Ajax.register("result", parseResultXml);	
				Cs.Ajax.swallowXml("","checkPHSNumber", "SERIAL_NUMBER2="+serivalNumber+"&USER_ID="+user_id,"正在对号码进行检验，请稍候...");
			},
			cancel:function(){
				$("serialnumber2").value="";
				return false;
		    }
		});
	}
    
}
function parseResultXml(node){
	var retInfo = Cs.util.Utility.node2JSON(node.firstChild);
	//alert(retInfo.serialNumber);
	if(retInfo.serialNumber =="undefined" || retInfo.serialNumber == null){
		$("serialnumber2").value="";
	}else{
		$("HEAD_NUMBER_HIDEN").value = retInfo.serialNumber;
		$("USER_ID_A_HIDEN").value = retInfo.userId;
	}
}
/**
 * 生成台帐信息前检查
 * @param 无
 * @return 抛出提示信息
 * @author zhoush
 */
function checkBeforeGeneTrade() {
	
	//added by zhoubl
	var _all_infos = $F('_all_infos').evalJSON(true);
	if(_all_infos.RIGHT_CODE == "csExistUserJoinWO" && newProdId == curProductId){
		throw new Error('请选择一个新基本产品！');
	}
	//added by zhoubl end
	
    if($("IsBook").value!="true")
    {
	    if(mProdCount == 0) throw new Error('请选择一个基本产品！');
	    if(mProdCount > 1) throw new Error('只能选择一个基本产品！');
    }
    
    var agreeVaule ="";
    if ($("deviceAgreeArea")){
	    if ($("deviceAgreeArea").innerHTML !=""){
			var x=document.getElementsByName("agreeType");
			for (var i=0;i<x.length;i++){
				if(x[i].checked == true){
					agreeVaule = x[i].value;
					break;
				}
			}
	    }
	}
    if (agreeVaule == "0"){
	    	var deviceProductCount=0;
			$A(document.getElementsByName('_productinfos')).each(function(prod) {
			  if(prod.checked && prod.productMode == '50'&&prod.parentArea == "deviceProdutArea") {
				    //循环累积基础产品
				     deviceProductCount++
				 }
		     }); 
		     if(deviceProductCount==0)
		     {
		     	throw new Error('请选择营销产品！');
		     }else if(deviceProductCount>1)
		     {
		     	throw new Error('营销产品只能选择一个！');
		     }  
    }
	/*是否需要展开产品、包判断*/
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
		if(prod.checked) {
			if((prod.needExp == '1') && $("p"+prod.productId).first.toUpperCase() == 'TRUE') {
				throw new Error('请展开产品：\"' + prod.productName + '\"进行选择操作！');
			}
			
			$A($('p'+prod.productId).all).each(function(elem) {
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
					&& elem._thisType != 'undefined' && elem._thisType.toUpperCase() == 'PACKAGE' && elem.needExp == '1'
					&& elem.checked && $("p"+elem.productId+"k"+elem.packageId).first.toUpperCase() == 'TRUE') {
						throw new Error('请展开产品：\"' + prod.productName + '\"的业务包：\"' + elem.packageName + '\"进行选择操作！');
				}
			});
		}
	});
}
//网别发生变化后事后校验担保号码 20111220
function checkAssureNumberNetNew(){
	if($P('ASSURE_SERIAL_NUMBER_PRODUCTASSURE').value==""){
		return false;
	}
	checkAssureNumberNew();
}


//对担保号码的查询操作 20111220

function checkAssureNumberNew()
{

	if($P('ASSURE_SERIAL_NUMBER_PRODUCTASSURE').value=="")
	{
		win.alert('请输入担保号码');
		return;
	}
	else
	{
	     Cs.Ajax.register("getAcctOk", checkAssureNumberAfter);
	     Cs.Ajax.register("getAcctFail", checkAssureNumberAfterFail);
	     var assureTypeCode = $P('ASSURE_TYPE_CODE_PRODUCTASSURE').value;
	     //qc:29539 begin
	     Cs.Ajax.swallowXml("", "checkAssureNumber", "AssureNumber="+$P('ASSURE_SERIAL_NUMBER_PRODUCTASSURE').value+"&NetTypeCode="+$P('ASSURE_NET_TYPE_CODE').value+"&acctId="+$F("ACCT_ID")+"&custId="+$F("_CUST_ID")+"&assureTypeCode="+assureTypeCode, "正在检查担保用户是否合法,请稍候...");
	     //qc:29539 end
	}
}
//查询担保号码后的处理 20111220
function checkAssureNumberAfter(node)
{
	if($P('ASSURE_TYPE_CODE_PRODUCTASSURE').value!="K"){
    	var assureAccountInfo = Cs.util.Utility.node2JSON(node);
  		var assureAcctId = $F("ACCT_ID");
  		if(assureAcctId!=assureAccountInfo.acctId)
	    { 
  			//  qc 33729 begin
  			if ($P('ASSURE_TYPE_CODE_PRODUCTASSURE').value=="W")
  			{
  				$('ASSURE_SERIAL_NUMBER_PRODUCTASSURE').value="";
  			  	win.alert("担保号码必须和当前用户号码同账户，请提同账户的号码不可做过户");
  			}
  			else{
		  	$('ASSURE_SERIAL_NUMBER_PRODUCTASSURE').value="";
		  	win.alert("担保号码必须和当前用户号码同账户，请提同账户的号码或者做过户业务");
  			}
  			//qc 33729 end
	    }else{
	  		win.alert("担保号码验证通过");
	    }
	}
	//qc:33729 begin
	var assureAccountInfo = Cs.util.Utility.node2JSON(node);
	$('ASSURE_SERIAL_NUMBER_PRODUCTASSURE').yue=assureAccountInfo.acctYue;
	//qc:33729 end
	//qc 33729 begin
	if($P('ASSURE_TYPE_CODE_PRODUCTASSURE').value=="W")
	{
     $('ASSURE_USER_ID_PRODUCTASSURE').value=assureAccountInfo.userId;
	}
	//qc 33729 end
}
function checkAssureNumberAfterFail(node)
{
	$('ASSURE_SERIAL_NUMBER_PRODUCTASSURE').value="";
}


/////////////////


//广东一卡两号选号 add by bais
function chooseSn_YKLH(){
	var destination_code = '';
    var accessorynum = '';
    var netTypeCode = '';  
    destination_code = $F("destination_code");
    if(destination_code == ""){ 
    	alert("请先选择出访地再选择号码！");
    	return;
    }
    accessorynum = $F("accessorynum"); 
//    netTypeCode = $F("NET_TYPE_CODE");
    var result =  popupDialog("popupdialog.choicesSecondN","init","&NET_TYPE_CODE="+netTypeCode+"&AREA_CODE="+destination_code,"港澳台 选号屏 ","780","400",null,null,true);
    if( result&& !result.blank()){
    	$('accessorynum').value = result;  
    	newSerialNumberExit($('accessorynum'));
    } 
}

//广东一卡两号  输入新号码后事件  add by bais 
function newSerialNumberExit(obj){
	var areaCode='';
	var serialNumber='';
	var netTypeCode='';
	var openPage='';
	areaCode = $F("destination_code");
	serialNumber = $F("SERIAL_NUMBER");
	netTypeCode = '50';    
	Cs.Ajax.swallowXml(openPage, "checkSubNumber", "&serialNumber="+serialNumber+"&subSerialNumber="+obj.value+"&AREA_CODE="+areaCode+"&netTypeCode="+netTypeCode, "正在校验号码信息，请稍候...");
}
//end 一卡两号

//主副卡业务   复选框限制  itjc-sunjw  2015/3/9    begin 
//itpengb7 258274 begin
var shiming={};
function MainDeputyCardLimit(node){
	var mainDeputyTag=$('MAIN_DEPUTY_TAG').value;
	if(mainDeputyTag=="5"){
		$("TO_TRADE_TAG").value="1";
	}
	else if (mainDeputyTag=="3"){
		$("TO_TRADE_TAG").value="0";
	}
 //node 等于MainCard 为主卡校验
  if(node=="MainCard"){
		 if($F("MainCard")=="MainCard"&&$F("DeputyCard")=="DeputyCard")
		 {
			  win.alert("主卡复选框和副卡复选框互斥，不能同时选择！！"); 
			  $("MainCard").checked=false;
		  }
		 //走主卡校验
		 else if($F("MainCard")=="MainCard"){ 
 			 var serial_number=$('SERIAL_NUMBER').value;
			 var mainDeputyTag=$('MAIN_DEPUTY_TAG').value;
			 Cs.Ajax.register("data", showMainDeputy);
			 Cs.Ajax.swallowXml("","showMainDeputy","&serialNumber="+serial_number+"&node="+node+"&strTag="+mainDeputyTag,"正在查询，请稍候...");
		 //勾选掉主卡复选框  清楚掉数据 
		 }else{
 			 zfInfo={};
 			 toClear();
 		 } 
  }
 //node 等于DeputyCard为副卡校验
  if(node=="DeputyCard"){
	  if($F("MainCard")=="MainCard"&&$F("DeputyCard")=="DeputyCard"){
		  win.alert("主卡复选框和副卡复选框互斥，不能同时选择！！");
		  $("DeputyCard").checked=false;
	  } 
	  // 如果是勾选上副卡复选框    
	  else if($F("DeputyCard")=="DeputyCard"){
		  //先走副卡校验
 		  var serial_number=$('SERIAL_NUMBER').value;
		  Cs.Ajax.register("data", showMainDeputy);
		  Cs.Ajax.swallowXml("","showMainDeputy","&serialNumber="+serial_number+"&node="+node,"正在查询，请稍候...");
		  //将主卡号码  文本框置成可填写
		  $('MainCardSerialNumber').disabled=false;
		 }
	  // 如果勾选掉  将主卡号码 文本框置成 灰死  内容置空
		 else{
		  $('MainCardSerialNumber').value="";
		  $('MainCardSerialNumber').disabled=true;
		  zfInfo={};
		  zhuSInfo={};
		  toClear();
		 } 
  }
//node 等于MainCardSerialNumber为主卡号码校验
  if(node=="MainCardSerialNumber"){
	  
	    var nodeD =zfInfo.jsNode;
	    var myStr="";
 	    if(nodeD=="DeputyCard"){
 	        	 myStr="&ACCT_ID_M="+zfInfo.acctIdM+"&PSPT_ID="+zfInfo.psptId+"&CUST_NAME="+zfInfo.custName+
 	        	 "&PSPT_TYPE_CODE="+zfInfo.psptTypeCode+"&SERIAL_NUMBER_ZF="+zfInfo.serialNmuerZf+"&EPARCHY_CODE_ZF="+zfInfo.eparchyCodeZf;  	 
 	        	// alert(myStr+"is myStr");
		} 
 	var MainCardSerialNumber=$('MainCardSerialNumber').value;
	if(MainCardSerialNumber.length==11){
		 var isPass = "0" ; //未校验 0  
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
		    //alert("&serialNumber="+MainCardSerialNumber+"&node="+node+myStr+myStr2);
		Cs.Ajax.register("data", showMainDeputy);
	  	Cs.Ajax.swallowXml("","showMainDeputy","serialNumber="+MainCardSerialNumber+"&serialNumber_f="+$('SERIAL_NUMBER').value+"&isPass="+isPass+"&node="+node+myStr+myStr2,"正在查询，请稍候...");
	}
	else 
	{
		win.alert("输入的号码位数不正确，请核实后再次输入！！");
	}
 	
  }
  
  //add by wanggang being 短信验证码及服务密码验证,传参到java验证数字是否正确
  //选择验证方式 {"0":"服务密码","1":"短信验证码"}
  if(node=="CHECK_TYPE"){
	  //alert($F("CHECK_TYPE"));
		 if($F("CHECK_TYPE")=="1" )
		 { 
			    $("second").show(); 
	 		    $('second').disabled=false;	 	
	 		    $("CheckNumber").value ="6位数字"; 
	 		    if($("second").value =="重新获取")
	 		    {
	 		    	$("CheckNumber").disabled=false;	
	 		    }
	 		    else
	 		    {
	 		    	$("CheckNumber").disabled=true;	
	 		    }
		 }//itpengb7 258274 begin
		 else if($F("CHECK_TYPE")=="2"){
			 $("second").hide(); 
			 $("CheckNumber").disabled=true;
		     $("CheckNumber").value ="";    
		     $("second").hide();
		     $('second').disabled=true;
		     if(shiming=="27"){
		    	 win.alert("号码"+$('SERIAL_NUMBER').value+"未实名制，需要输入短信验证码或服务密码才能继续办理业务！");
		    	 Cs.flower.LookupCombo.setValue($("CHECK_TYPE"), "2");
		    	 Cs.flower.LookupCombo.setValue($("CHECK_TYPE"), "1");
		    	 Cs.flower.LookupCombo.setValue($("CHECK_TYPE"), "0");
		    	 Cs.flower.LookupCombo.update($("CHECK_TYPE"));
		    	 return false;
		     }else if(shiming=="shiming"){
		    	 win.alert("号码"+$('SERIAL_NUMBER').value+"通过实名制校验！");
		    	 Cs.flower.LookupCombo.disabled($('CHECK_TYPE'),true);
		    	 $("CheckNumber").value = "验证通过";
		         $("CheckNumber").disabled=true; 
		         $("second").hide();
		         $('second').disabled=true;
		         
		     }
		 }//itpengb7 258274 end
		 else 
		 {
			 $("second").hide(); 
             $("CheckNumber").value ="6位数字"; 	
             $("CheckNumber").disabled=false;	 
		 }
  	} 
  //
  if(node=="CheckNumber"){
	  
  	  var password = $("CheckNumber").value;
 
	   if(password.length !=6){
			win.alert("必须是6位数字,请重新输入!");
			$('CheckNumber').value= "6位数字";
	    	return;
		}
	    if(password.length ==6){    
	        var reg = /^[0-9]\d*$/ ;     
	        var r = password.match(reg);
	        if(r==null){
	        	win.alert('您输入的格式不正确，请重新输入!!'); //校验输入的是否为数字!   
	        	$('CheckNumber').value= "6位数字";
	        	return;
	        }
	    }    
	  //服务密码方式
	  if($F("CHECK_TYPE")=="0" )
		  {		
		  //是否为初始密码校验 add by wanggang 2016-3-21 tfs 258275 begin
	          serial_number = $('SERIAL_NUMBER').value ;
	          if($("CheckNumber").value ==serial_number.substring(serial_number.length-6, serial_number.length))
	           {
	            win.alert("初始密码，不允许办理此业务！");
	            return false;
	           }  
	      //tfs 258275 end   
		        //win.alert($F("CheckNumber") +"=password");		        
		        //win.alert($F("MainCardSerialNumber")+"=MainCardSerialNumber"); 
		        var params = "password=" + $F("CheckNumber") +"&SerialNumber=" + $('SERIAL_NUMBER').value  ;		  
		        params = params.toQueryParams();		       
		        //alert(Object.toJSON(params));
		        Cs.Ajax.register("checkPassWDOk", checkPassWDOk);
		        Cs.Ajax.register("checkPassWDWrong", checkPassWDWrong);
		        Cs.Ajax.swallowXml("", "checkOldPasswd", "param=" + encodeURIComponent(Object.toJSON(params)), "正在校验，请稍候...");					  
		  }
	  //短信验证码方式
	  if($F("CHECK_TYPE")=="1" )
	  {
 	 
	        var params = "sms=" + $F("CheckNumber") +"&SerialNumber=" + $('SERIAL_NUMBER').value+"&UserId=" + $('USER_ID_A_HIDEN').value  ;		  
	        params = params.toQueryParams();
	        //alert(Object.toJSON(params));
	        Cs.Ajax.register("checkPassWDOk", checkPassWDOk);
	        Cs.Ajax.register("checkSmsWDWrong", checkSmsWDWrong);
	        Cs.Ajax.swallowXml("", "checkSms", "param=" + encodeURIComponent(Object.toJSON(params)), "正在校验，请稍候...");		
		  
	  }	  
	  
  }
  
  //wanggang end
  
}


//add by wanggang begin 服务密码验证结果返回

//服务密码、验证码验证通过
function checkPassWDOk(node){
       // alert(Object.toJSON("checkPassWDOk"));
	 
         win.alert("验证通过！");
         $("CheckNumber").value = "验证通过";
		 Cs.flower.LookupCombo.disabled($('CHECK_TYPE'),true); 
         $("CheckNumber").disabled=true;	
         $("second").hide();
         $('second').disabled=true;	 
  
}
//服务密码错误
function checkPassWDWrong(node){

     // alert(Object.toJSON("checkPassWDWrong"));
			win.alert("服务密码验证错误，请重新输入！");
			$("CheckNumber").value = "6位数字"; 
            return false;
}

//验证码错误（失效）
function checkSmsWDWrong(node){

	  // alert(Object.toJSON("checkPassWDWrong"));
				win.alert("验证码错误（或失效），请重新输入！（验证码有效期为15分钟）");
				$("CheckNumber").value = "6位数字"; 
		  	    $("second").value ="重新获取";
	         return false;
	}


//wanggang end

function toClear(){
 	var mainDeputyTag=$F("MAIN_DEPUTY_TAG");
	if(mainDeputyTag=="3"){
		$("TO_TRADE_TAG").value="1";
		zfTag="YES";
	}
	else if (mainDeputyTag=="5"){
		$("TO_TRADE_TAG").value="0";
	}
 }
function showMainDeputy(node)
{       
        var obj = Cs.util.Utility.node2JSON(node);  
        var win = new Cs.flower.Win();
        var SYS_CSM_ZF_RESULT=obj.sysCrmZfResult;
        //itpengb7 258274 begin
        shiming="";
        //itpengb7 258274 end
        if(SYS_CSM_ZF_RESULT=="0"){
        	 zfInfo=obj;
             return;
        }else if (SYS_CSM_ZF_RESULT=="zhu"){
        	 zhuSInfo=obj;
             return;
        }
		else if (SYS_CSM_ZF_RESULT=="28"){
    		win.error("主卡("+$('MainCardSerialNumber').value+")的客户与首页认证客户不相同<br>不能办理副卡业务！", function(){
	    		closeNavFrameByLocation();
	    		if (parent.menuframe.HOLD_FIRST_PAGE)
	    			switchNavFrame(parent, "navmenu_0");
	    		});
	    		return;     
	    
          }
        
        else if(SYS_CSM_ZF_RESULT=="1"){
        var SYS_CRM_GEAR=obj.sysCrmGear;
        	win.alert("用户当前主产品不在该省允许受理主卡的主产品范围内，不允许受理主卡业务！");
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
        }else if (SYS_CSM_ZF_RESULT=="2"){
        	win.alert("用户在网时间小于6个月，不允许受理主副卡业务！");
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
        }
		//新需求，智慧我家可以办理主卡，只限制沃享
        // xuwanlong
		else if (SYS_CSM_ZF_RESULT=="3"||SYS_CSM_ZF_RESULT=="6"){
        	win.alert("用户存在沃享业务或(部分)融合业务，不允许受理主副卡业务！");
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
		        }
		
		else if (SYS_CSM_ZF_RESULT=="5"){
        	win.alert("此号码有未生效的合约计划，不允许作为副卡！");
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
          }
		else if (SYS_CSM_ZF_RESULT=="7"){
		    win.alert("此号码有在用非最后一个月的合约，不允许作为副卡！");
		    $("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
          }
		else if (SYS_CSM_ZF_RESULT=="9"){
        	win.alert("该号码为靓号用户，不允许作为副卡！");
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
          }
		else if (SYS_CSM_ZF_RESULT=="10"){
        	win.alert("此号码有在途合约计划续约，不允许作为副卡！");
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
          }
		else if (SYS_CSM_ZF_RESULT=="22"){
	        win.alert("用户存在预约预约拆机工单，请取消后操作主副卡业务！");
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
          }
		else if (SYS_CSM_ZF_RESULT=="21"){
        	win.alert("用户合约计划续约主产品不在该省允许受理主卡的主产品范围内，不允许受理主卡！");
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
          }
		else if (SYS_CSM_ZF_RESULT=="23"){
        	win.alert("该号码已经存在生效的主卡号码关系，不允许重复操作！");
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
          }
		else if (SYS_CSM_ZF_RESULT=="24"){
		    win.alert("此号码存在生效的主卡关系，不允许进行主副卡操作！");
		    $("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
          }
        //主卡号码文本框 校验
		else if (SYS_CSM_ZF_RESULT=="8"){
			win.alert("用户存在沃享、融合业务，不允许作为主卡！");
        	$('MainCardSerialNumber').value="";
         } 
		else if (SYS_CSM_ZF_RESULT=="11"){
        	win.alert("主卡号码与副卡号码不同账户，请操作付费关系变更！");
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
  		    return;
          }
		else if (SYS_CSM_ZF_RESULT=="12"){
        	win.alert("此号码非正常在用状态，不允许作为主卡号码！");
        	$('MainCardSerialNumber').value="";
          }
		else if (SYS_CSM_ZF_RESULT=="13"){
			win.alert("此号码不存在主卡号码的主副关系，不允许作为主卡号码！");
        	$('MainCardSerialNumber').value="";
          }
		else if (SYS_CSM_ZF_RESULT=="14"){
        	win.alert("主卡号码与副卡号码不是同客户，请先操作过户！");
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
          }
		else if (SYS_CSM_ZF_RESULT=="15"){
        	win.alert("副卡号码账户、客户状态不正确，请核查！");
        	$('MainCardSerialNumber').value="";
          }
		else if (SYS_CSM_ZF_RESULT=="16"){
        	win.alert("此号码已经存在四个副卡，不允许受理主副卡业务！");
        	$('MainCardSerialNumber').value="";
          }
		else if (SYS_CSM_ZF_RESULT=="17"){
        	win.alert("副卡号码与主卡号码相同，不允许受理！");
        	$('MainCardSerialNumber').value="";
          }
		else if (SYS_CSM_ZF_RESULT=="18"){
			var SYS_CRM_GEAR=obj.sysCrmGear;
        	win.alert("用户当前主产品不在该省允许受理主卡的主产品范围内，不允许作为主卡！");
        	$('MainCardSerialNumber').value="";
          }
		else if (SYS_CSM_ZF_RESULT=="19"){
         	win.alert("副卡号码同主卡号码非同一个本地网，不允许受理主副卡业务！");
        	$('MainCardSerialNumber').value="";
          }
		else if (SYS_CSM_ZF_RESULT=="20"){
        	win.alert("用户存在预约预约拆机工单，请取消后操作主副卡业务！");
        	$('MainCardSerialNumber').value="";
          }
		else if (SYS_CSM_ZF_RESULT=="4"){
			var SYS_CRM_GEAR=obj.sysCrmGear;
        	win.alert("用户合约续约的主产品不在该省允许受理主卡的主产品范围内，不允许受理主卡！");
        	$('MainCardSerialNumber').value="";
          }
		else if (SYS_CSM_ZF_RESULT=="no"){
			var SYS_CRM_ZF_NUMBER=obj.sysCrmZfNumber;
        	win.alert("此主卡号码已经存在【"+SYS_CRM_ZF_NUMBER+"】个在用的主副关系，达到该省份限制副卡数量，不允许再加入副卡！");
        	$('MainCardSerialNumber').value="";
          }
		else if (SYS_CSM_ZF_RESULT=="error"){
			var ZF_EXCEPTION=obj.zfException;
        	win.alert("特殊限制判断："+ZF_EXCEPTION);
        	$("MainCard").checked=false;
        	$("DeputyCard").checked=false;
        	$('MainCardSerialNumber').value="";
  		    $('MainCardSerialNumber').disabled=true;
          }
        //add by wanggang  	如果主卡已实名制，待办副卡没有实名制需采用两种验证方式（副卡用户服务密码或给副卡发验证码）通过认证才可以继续办理业务；否则不允许办理业务；副卡已有实名制标签可以办理业务
		else if (SYS_CSM_ZF_RESULT=="27" || SYS_CSM_ZF_RESULT=="shiming"){
			shiming=SYS_CSM_ZF_RESULT;
 		    $('MainCardSerialNumber').disabled=true;
        	$("DeputyCard").disabled=true;
        	$("MainCard").disabled=true;   	
			Cs.flower.LookupCombo.disabled($('CHECK_TYPE'),false); 
			$("CheckNumber").value = "6位数字"; 
        	$("CheckNumber").disabled=false;	     
        	zhuSInfo=obj;
          }
        //end
        
		//add by wanggang begin	办理副卡录入主卡号码时，需判断主卡客户与首页认证客户是否相同（相同条件：名称+证据类型+证据号码），相同才能继续办理业务。

     //wanggang end        
        
}
function  toDisabled(){
	if($("TO_DISABLED").value=="1"){
		$('MainDeputyT').style.display="block";
		$("TO_DISABLED").value="0";
	}
	else if ($("TO_DISABLED").value=="0"){
		$('MainDeputyT').style.display="none";
		$("TO_DISABLED").value="1";
	}	
}
//主副卡业务   复选框限制  itjc-sunjw  2015/3/9    end

//短信验证 add by wanggang
 
//发送验证码
function sendCode(obj){

	  if($('SERIAL_NUMBER').value !="" )
	  {		  

			$("CheckNumber").value = "6位数字"; 
	        //win.alert($F("CheckNumber") +"=password");		        
	        //win.alert($F("MainCardSerialNumber")+"=MainCardSerialNumber"); 
	        var params = "SerialNumber=" + $('SERIAL_NUMBER').value+"&UserId=" + $('USER_ID_A_HIDEN').value  ;	  
	        params = params.toQueryParams();		       
	        //alert(Object.toJSON(params));
	        Cs.Ajax.register("sendCodeOk", sendCodeOk);
	        Cs.Ajax.register("sendCodeWrong", sendCodeWrong);
	        Cs.Ajax.register("timeErro", sendtimeErro);	        
	        Cs.Ajax.swallowXml("", "sendCode", "param=" + encodeURIComponent(Object.toJSON(params)), "验证码正在派送中，亲莫着急...");					  
	  }
	
	
	  else{

			$("CheckNumber").value = "6位数字"; 
 	       	$("CheckNumber").disabled=true;	 
			win.alert('获取号码信息失败，无法发送验证码！');
			return false;
	  }
}
//发送成功，验证码校验时有效期15分钟 
function sendCodeOk(node){
    // alert(Object.toJSON("checkPassWDOk")); 
	    	  win.alert("发送成功，验证码校验时有效期15分钟，请及时输入！");
	         // $('second').disabled=true; 	  	    
	 		  $("second").value ="重新获取";
		  	   $("CheckNumber").disabled=false;
	    	 
}
//发送验证码失败
function sendCodeWrong(node){

  // alert(Object.toJSON("checkPassWDWrong"));
			win.alert("验证码发送失败！");
			$("CheckNumber").value = "6位数字"; 
	  	    $("second").value ="重新获取"; 
 	       	$("CheckNumber").disabled=true;	
         return false;
}
//距离上次发送验证码未满15分钟，不可以再次发送
function sendtimeErro(node){

  // alert(Object.toJSON("checkPassWDWrong"));
			win.alert("距离上次发送验证码时间不足15分钟，不可以再次发送！！");
			$("CheckNumber").value = "6位数字"; 
	  	    $("second").value ="重新获取"; 
		    $("CheckNumber").disabled=false;
         return false;
}


function queryGroupUser(obj){
    var result = popupDialog("popupdialog.QryVpnUserInfo", "init", null, "查询集团用户编号", "700", "370", obj.subsys);
    if (result && result != null && result.serialNumber) {
        $("SERIAL_NUMBER").value = result.serialNumber;
        Cs.flower.LookupCombo.setValue($("NET_TYPE_CODE"), "WV");
      //$("NET_TYPE_CODE").value = "WV";
      //  $("queryButton").click();
    }
    return false;
    
}


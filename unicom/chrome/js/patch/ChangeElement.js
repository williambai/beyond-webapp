/**
 * 生成台帐信息前检查
 * @param 无
 * @return 抛出提示信息
 * @author zhoush
 */
function checkBeforeGeneTrade() {
	console.log('++++ checkBeforeGeneTrade ++++\n')	
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
			  if(prod.checked && prod.getAttribute('productMode') == '50'&&prod.getAttribute('parentArea') == "deviceProdutArea") {
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
			if((prod.getAttribute('needExp') == '1') && $("p"+prod.getAttribute('productId')).getAttribute('first').toUpperCase() == 'TRUE') {
				throw new Error('请展开产品：\"' + prod.getAttribute('productName') + '\"进行选择操作！');
			}
			
			$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
					&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'PACKAGE' && elem.needExp == '1'
					&& elem.checked && $("p"+elem.getAttribute('productId')+"k"+elem.getAttribute('packageId')).getAttribute('first').toUpperCase() == 'TRUE') {
						throw new Error('请展开产品：\"' + prod.getAttribute('productName') + '\"的业务包：\"' + elem.getAttribute('packageName') + '\"进行选择操作！');
				}
			});
		}
	});
};

// //组织提交到后台的数据
// finishChildSave = function(){
// 	console.log('++++++++finishChildSave() 1++++++\n');
// 	//add by wanggang 主副卡短信校验、服务密码校验
	
// 	if($F("CheckNumber")!=""&&$F("CheckNumber")!="验证通过"){ //增加安全性，再进行一次校验  
// 		//itpengb7 258274 begin
// 		throw new Error("号码"+$('SERIAL_NUMBER').value+"未实名制或者未进行实名制校验，需要实名制校验或者输入短信验证码、服务密码才能继续办理业务！");
// 		//itpengb7 258274 end
// 	}	
	
// 	//wanggang end 
	
// 	//itjc-sunjw begin  选中副卡复选框 必须输入主卡号码
// 	if($F("DeputyCard")=="DeputyCard"&&$('MainCardSerialNumber').value==""&&$('MAIN_DEPUTY_TAG').value!="2"){
// 		throw new Error('办理副卡业务，请输入主卡号码！');
// 	}
//  	var myParams="";
//  	var node =zfInfo.jsNode;
// 	console.log('++++++++finishChildSave() 2 ++++++\n');
//  		if(node=="MainCard"){
// 			myParams='NODE='+node+'&SERIALNUMBER='+zfInfo.serialnumberZhu+'&EPARCHY_CODE='+zfInfo.eparchyCode;
// 		}else if(node=="DeputyCard"){
// 			//副卡操作 生成预提交之前再校验一遍主卡	
  			
// 			 var cache = new Cs.flower.DataCache();
// 			    if (cache){
// 			    	var custInfo = cache.get("custInfo");
// 			    	if (!custInfo){
// 			    		win.error("请先创建客户或者对已有客户进行认证后<br>再办理副卡业务！", function(){
// 			    		closeNavFrameByLocation();
// 			    		if (parent.menuframe.HOLD_FIRST_PAGE)
// 			    			switchNavFrame(parent, "navmenu_0");
// 			    		});
// 			    		return;
// 			    	}else{
// 		 	        	 myStr2="&custName_c="+custInfo.custName+"&psptId_c="+custInfo.psptId+"&psptTypeCode_c="+custInfo.psptTypeCode;  
// 		 	        	// alert(myStr2);
// 			    	}
// 			    }
//         	myParams='NODE='+node+'&SERIALNUMBER_B='+zfInfo.serialnumberB+'&SERIALNUMBER_A='+
//         	zhuSInfo.serialnumberA+'&ID_A='+zhuSInfo.idA;
//         	myParams=myParams+"&ACCT_ID_M="+zfInfo.acctIdM+"&PSPT_ID="+zfInfo.psptId+"&CUST_NAME="+zfInfo.custName+
//        	    "&PSPT_TYPE_CODE="+zfInfo.psptTypeCode+"&SERIAL_NUMBER_ZF="+zfInfo.serialNmuerZf+"&EPARCHY_CODE_ZF="+zfInfo.eparchyCodeZf+
//        	    "&serialNumber_f="+$('SERIAL_NUMBER').value+"&serialNumber_z="+$('MainCardSerialNumber').value+myStr2; 
//         	if(zhuSInfo.startDate!=null&&zhuSInfo.startDate!=""&&zhuSInfo.endDate!=null&&zhuSInfo.endDate!=""){
//         		myParams=myParams+'&START_DATE='+zhuSInfo.startDate+'&END_DATE='+zhuSInfo.endDate;
//         	}
// 		}
// 		if(zfTag=="YES"){
// 			myParams=myParams+'NODE='+'csDestroyZFCard';
//         }
 
//  	if(myParams!=""){
// 		myParams = myParams.toQueryParams();
// 		Cs.ctrl.Trade.saveObject("MY_ZFINFO", myParams);		
// 	}
// 	console.log('++++++++finishChildSave() 3 ++++++\n');
// 	// itjc-sunjw end 
// 	try {
// 		geneTradeInfo();
// 	}
// 	catch(e) {
// 		win.alert(e.message);
// 		return false;
// 	}
// 	console.log('++++++++finishChildSave() 4 ++++++\n');

//     //2G OCS用户变更套餐必需进行实名制验证
// 	//qc95538 begin
// 	var inModeCode =$("inModeCode")? $getV("inModeCode"):"-1";
//     if (inModeCode==null||inModeCode!=1){
//     if(newProdId != curProductId && '|16|'.indexOf($F('NET_TYPE_CODE')) != -1){
//         var cache = new Cs.flower.DataCache();
//         if (cache){
//             custInfo = cache.get("custInfo");
//             if(custInfo&&$("SERIAL_NUMBER")){
//                 var custId1=custInfo.custId;
//                 if( custId1!=$F('_CUST_ID') && $F('_CUST_ID')!="" ){
//                     win.error("认证的客户不是此号码的客户<br>请重新认证！", 
//                         function(){
//                             closeNavFrameByLocation();
//                             if (parent.menuframe.HOLD_FIRST_PAGE)
//                                 switchNavFrame(parent, "navmenu_0");
//                         });
//                     return false;
//                 }
//             }
//             else{
//                 win.error("请先对已有客户进行认证后<br>再办理此业务！", 
//                     function(){
//                         closeNavFrameByLocation();
//                         if (parent.menuframe.HOLD_FIRST_PAGE)
//                             switchNavFrame(parent, "navmenu_0");
//                         });
//                 return false;
//             }
//         }
//     }
//   }//qc95538 end
	
// 	console.log('++++++++finishChildSave() 5 ++++++\n');
//   //qc  33729 begin
	   
//     if ($("ASSURE_SERIAL_NUMBER_PRODUCTASSURE")&&$("ASSURE_TYPE")&&$F("ASSURE_TYPE")=="W")
//     {
//     	var tradeItemInfoTmp = {};
//     	tradeItemInfoTmp.ATTR_CODE = "YUE";
//     	tradeItemInfoTmp.ATTR_VALUE = "" + $('ASSURE_SERIAL_NUMBER_PRODUCTASSURE').yue;
//     	Cs.ctrl.Trade.appendObject("TF_B_TRADE_ITEM", {ITEM: tradeItemInfoTmp});
//     }
//     //qc 33729 end
// 	//iptv账号和密码.wangwy.start
// 	if( typeof(Cs.ctrl.Trade.getObject("TF_B_TRADE_SUB_ITEM"))!= 'undefined' ){
//         var subItem = Cs.ctrl.Trade.getObject("TF_B_TRADE_SUB_ITEM")["ITEM"];
//         if(typeof(subItem) != 'undefined' && subItem && subItem != ''){
//             subItem.each(function(s) {
//                 if(s.ATTR_CODE == 'iptvPassword'){
//                     var snlength = $("SERIAL_NUMBER").value.length;
//                     s.ATTR_VALUE = $F('SERIAL_NUMBER').substring(snlength-6, snlength);
//                 }
//                 if(s.ATTR_CODE == 'iptvNo'){
//                     s.ATTR_VALUE = $F("SERIAL_NUMBER")+"@TV";
//                 }
//             });
//         }
//     }
// 	//end
// 	console.log('++++++++finishChildSave() 5-1 ++++++\n');
// 	var netTypeCode = $("NET_TYPE_CODE").value;
//  	var toTradeTag =$F("TO_TRADE_TAG") ;
// 	if(Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_SVC) == undefined
// 		&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_DISCNT) == undefined
// 		&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_PRODUCT) == undefined
// 		&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_OTHER) == undefined
// 		&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_PURCHASE) == undefined
// 		&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_SP) == undefined
// 		&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_SUB_ITEM) == undefined
// 		&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_ELEMENT) == undefined
// 		&& Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_RELATION) == undefined
// 		//itjc-sunjw begin 
// 		&& Object.toJSON(Cs.ctrl.Trade.getUuInfos()) == "{}"&&toTradeTag=="0"){
// 			//itjc-sunjw end
// 			throw new Error('请变更服务或优惠！');
// 	}	
// 	if(newProdId != curProductId ||tradeTypeCode=='124') {
		
		
// 		//生成修改TF_F_USER表台帐
// 		if(newNetCode=="")
// 		{
// 			newNetCode = $("NET_TYPE_CODE").value;
// 		}
	
// 		var params = 'PRODUCT_ID='+newProdId + '&BRAND_CODE='+newBrandCode +  '&USER_ID='+userId +  '&NET_TYPE_CODE='+newNetCode;
// 		params = params.toQueryParams();
// 		//		//QC:2706 begin
// 		//		if($getV("N3_2706_TAG_CODE")=="1"){
// 		   if($("IsBook").value=="true" && Object.toJSON(Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_PRODUCT) == undefined){
// 		   }
// 		   else{
// 		   		Cs.ctrl.Trade.saveObject("TF_B_TRADE_USER", {ITEM: params});
// 		   }
// 		//		}
// 		//		else{
// 		//			Cs.ctrl.Trade.saveObject("TF_B_TRADE_USER", {ITEM: params});
// 		//		}
// 		//QC:2706 end
	
// 		//修改TF_B_TRADE
// 		var execTime = mProdStartDate>Cs.ctrl.Trade.getSysDate()?mProdStartDate:Cs.ctrl.Trade.getSysDate();
// 		params = 'PRODUCT_ID='+newProdId + '&BRAND_CODE='+newBrandCode + '&EXEC_TIME='+ execTime+'&NEW_PREPAY_TAG='+ newPrepayTag;
// 		params = params.toQueryParams();
// 		Cs.ctrl.Trade.saveObject("TF_B_TRADE", params);		
// 	}
// 	console.log('++++++++finishChildSave() 5-3 ++++++\n');
	
// 	if($('PROP_NAME_PRODID')){
// 		Cs.ctrl.Trade.saveObject("TRADE_SUB_ITEM", Cs.ctrl.Web.encodeExtraProperty($('PROP_NAME_PRODID').value,"1"));
// 	}
	
// 	if($('PROP_NAME')){
// 		Cs.ctrl.Trade.appendObject("TRADE_SUB_ITEM", Cs.ctrl.Web.encodeExtraProperty($('PROP_NAME').value,"1"));
// 	}
// 	//TFS:526 begin
// 	var temp = {};
// 	if ($getV('XIEYIENDTIME'))
// 	{
// 	    temp.XIEYIENDTIME = $getV('XIEYIENDTIME');
// 	    temp.XN_NUM = $getV('SERIAL_NUMBER');
// 		Cs.ctrl.Trade.saveObject("TRADE_ITEM", temp);
// 	}
// 	//TFS:526 end
// 	console.log('++++++++finishChildSave() 6 ++++++\n');

// 	//added by zhoubl WOX
// 	//加入沃享
	
// 	var _all_infos = $F('_all_infos').evalJSON(true);
// 	if(_all_infos.RIGHT_CODE == "csExistUserJoinWO" && tradeTypeCode=='120'){
// 		var uu={};
// 		var _infos = $F('_infos').evalJSON(true);	
// 		var serialNumberB=_infos.serialnumber;
// 		var userIdB = _infos.userId;
// 		var curProductIdB = _infos.productId;
// 		var acctIdB = _infos.acctId;
// 		var custIdb = _infos.custId;
		
// 		uu.WOXINFO = "WOX_B"; 
// 		uu.MODIFY_TAG="0";
// 		uu.SERIAL_NUMBER_B=serialNumberB;
// 		uu.ID_B= userIdB;
// 		uu.ID_A= _all_infos.USER_ID_A_WO;
// 		uu.SERIAL_NUMBER_A=_all_infos.SERIAL_NUMBER_A_WO;
// 		uu.ROLE_CODE_A="0";
// 		uu.ROLE_CODE_B="1";//提交时候替换成td_b_compprod_memrule配置的
// 		uu.RELATION_TYPE_CODE=_all_infos.RELATION_TYPE_CODE_WO;
// 		uu.RELATION_ATTR = "9";			
// 		//		uu.START_DATE = Cs.ctrl.Trade.getSysDate();//产品服务变更生效时间下月
// 		uu.END_DATE = "2050-12-31 23:59:59";
// 		if( (typeof Cs.ctrl.Trade.getObject("TF_B_TRADE_RELATION")) != 'undefined' )
// 		{
// 			Cs.ctrl.Trade.appendObject("TF_B_TRADE_RELATION", {ITEM: uu});
// 		}
// 		else
// 		{
// 			Cs.ctrl.Trade.saveObject("TF_B_TRADE_RELATION", {ITEM: uu});
// 		}
// 		var tempIsWoMainNum = {};
// 		tempIsWoMainNum.IS_WO_MAIN_NUM = Cs.flower.LookupCombo.getValue($(Cs.ctrl.Web.$P("isMainSerialNumber")));
		
// 		if(Cs.ctrl.Trade.getObject("TRADE_SUB_ITEM")){
// 			Object.extend(Cs.ctrl.Trade.getObject("TRADE_SUB_ITEM"),tempIsWoMainNum);//非初始密码
// 		}else{
// 			Cs.ctrl.Trade.saveObject("TRADE_SUB_ITEM", tempIsWoMainNum);
// 		}
// 	}
// 	//added by zhoubl  end
// 	//add by wangwf 2013-11-05 begin
// 	var specflaginfo = {};
// 	if(_all_infos.RIGHT_CODE == "csChangeServiceTradeWo")
// 	{
// 		specflaginfo.SPEC_FLAG = "1";
// 		Cs.ctrl.Trade.appendObject("TRADE_ITEM", specflaginfo);
// 	}
// 	//add by wangwf 2013-11-05 end
	
// 	console.log('++++++++finishChildSave() 7 ++++++\n');
// 	//吉林一机双号拼接字符串
// 	var svcObj = Cs.ctrl.Trade._tradeInfo.TF_B_TRADE_SVC;
// 	if(svcObj!=undefined && svcObj!=null){
// 			var itemObj = svcObj.ITEM;
// 			for (var i = 0; i < itemObj.length; i++) {
// 				if(itemObj[i].SERVICE_ID=="33039"){//33039
// 					if(($("HEAD_NUMBER_HIDEN").value=="") && (itemObj[i].MODIFY_TAG=="0")){
// 						win.alert("一机双号属性值不能为空！");
// 						return false;
// 					}				
// 					createTradeItem();
// 				}
// 			}
// 	}
	

	
//     if(caiNumberInfo.caiNumber!="" && caiNumberInfo.simCard!="" && $("OLD_Number").value!="" && $("OLD_IMSI").value !="")
//    //记录资源信息
//     {
      
// 	   var res = recordResInfo();
// 	   var res= recordResInfoOld();
// 	   Cs.ctrl.Trade.saveObject("TF_B_TRADE_RES", {ITEM:res});
	
//     }
//     if(wlanNumberInfo.wlanNumber!=""  && $("OLD_WlanNumber").value!="")
//         //记录WLAN资源信息
//         {
          
//     	   var res = recordWlanResInfo();
//     	   var res= recordWlanResInfoOld();
//     	   Cs.ctrl.Trade.saveObject("TF_B_TRADE_RES", {ITEM:res});
    	
//         }
    
//     if(wlanNumberInfo.wlanNumber!=""  && $("OLD_WlanNumber").value=="")
//         //记录WLAN资源信息
//         {
// 	        var snwlan={};
// 	    	snwlan.RES_TYPE_CODE=$F("WLAN_RES_TYPE_CODE");  //标识wlan号码
// 	    	snwlan.RES_CODE=wlanNumberInfo.wlanNumber;
// 	    	snwlan.MODIFY_TAG="0";
// 	        snwlan.X_DATATYPE="NULL";
// 	        snwlan.START_DATE = Cs.ctrl.Trade.getSysDate();
// 	        snwlan.END_DATE = "2050-12-31 23:59:59";
// 	    	res.push(snwlan);
// 	    	Cs.ctrl.Trade.saveObject("TF_B_TRADE_RES", {ITEM:res});
//     	 }
//     if($("OLD_Number").value=="" && $("OLD_IMSI").value =="" && caiNumberInfo.caiNumber!="" && caiNumberInfo.simCard!="")
//     {
//         var res=[];
// 		var sn={};
// 		sn.RES_TYPE_CODE="8";  //标识彩号号码
// 		sn.RES_CODE=caiNumberInfo.caiNumber;
// 		sn.MODIFY_TAG="0";
// 	    sn.X_DATATYPE="NULL";
// 	    sn.START_DATE = Cs.ctrl.Trade.getSysDate();
// 	    sn.END_DATE = "2050-12-31 23:59:59";
// 		res.push(sn);
// 		//if ($("SIM_CARD_SX")){
// 		var card={};
// 		card.RES_TYPE_CODE="9";
// 		card.RES_CODE=caiNumberInfo.simCard;
// 		card.RES_INFO1=caiNumberInfo.cardInfo.imsi;
// 		card.RES_INFO4=caiNumberInfo.cardInfo.feeCodePayFlag;  //卡容量 tf_r_simcard_idle.CAPACITY_TYPE_CODE
// 		card.RES_INFO5=caiNumberInfo.cardInfo.codeTypeCode;	  //卡类型 tf_r_simcard_idle.
// 		card.MODIFY_TAG="0";
// 		card.X_DATATYPE="NULL";
// 		card.START_DATE = Cs.ctrl.Trade.getSysDate();
// 	    card.END_DATE = "2050-12-31 23:59:59";
// 		res.push(card);
// 	    Cs.ctrl.Trade.saveObject("TF_B_TRADE_RES", {ITEM:res});
//     }	
    
// 	console.log('++++++++finishChildSave() end ++++++\n');
//     /*var user = {};
	
// 	if($("ghDevelopStaffId").value == "" && $("ghCityCode").valueCode == ""){
// 	    user.DEVELOP_STAFF_ID = $('pagecontext').staffId;
// 		user.DEVELOP_EPARCHY_CODE = $('pagecontext').epachyId;
// 		user.DEVELOP_CITY_CODE = $('pagecontext').cityId;
// 		user.DEVELOP_DEPART_ID = $('pagecontext').deptId;
// 	}else if($("ghDevelopStaffId").value == ""){
// 		user.DEVELOP_DEPART_ID = $("ghCityCode").valueCode;
// 		user.DEVELOP_EPARCHY_CODE = $('pagecontext').epachyId;
// 	}else{
// 	    user.DEVELOP_STAFF_ID = $('ghDevelopStaffId').valueCode;
// 		user.DEVELOP_EPARCHY_CODE = $('pagecontext').epachyId;
// 		user.DEVELOP_CITY_CODE = $('pagecontext').cityId;
// 		user.DEVELOP_DEPART_ID = $("ghCityCode").valueCode;		
// 	}
	
// 	//发展部门,发展员工信息
// 	if($('pagecontext').provinceId!="NMCU"&& $('pagecontext').provinceId!="SXCU" ) {
// 		Cs.ctrl.Trade.saveObject("TF_B_TRADE_USER", {ITEM:user});
// 	}*/
// }

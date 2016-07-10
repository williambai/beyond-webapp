//** fix bugs
//点击产品查明细
queryPackageInfo = function(productId){
    closeOpen($("p"+productId),$("closeopen"+productId));    
	if($("p"+productId).getAttribute('first').toUpperCase() == 'FALSE') {
		$("p"+productId).toggle();	 
        closeOpen($("p"+productId),$("closeopen"+productId));   
		return;
	}

	/**
	 * 根据产品标识获取包信息 返回 pkgByPId 节点(modify_tag='0')
	 * 根据用户标识+产品标识获取包信息 返回 pkgByPId 节点(modify_tag='1')
	 * 根据用户标识+产品标识获取包(用户信息与参数信息整合)信息 返回 pkgByPId 节点(modify_tag='2')
	 */
	//QC:96235 BEGIN
	//Cs.Ajax.swallowXmlCache("pkgByPId:"+productId, prodPage, "getPackageByPId", "productId="+productId+"&modifyTag="+$('_p'+productId).modifyTag+"&userId="+userId+"&productMode="+$('_p'+productId).productMode+"&curProductId="+curProductId+"&onlyUserInfos="+onlyUserInfos+"&productInvalid="+$('_p'+productId).productInvalid, "正在查询产品信息，请稍候......", '', noCache);
    Cs.Ajax.swallowXmlCache("pkgByPId:"+productId, prodPage, "getPackageByPId", "productId="+productId+"&modifyTag="+$('_p'+productId).modifyTag+"&userId="+userId+"&productMode="+$('_p'+productId).productMode+"&curProductId="+curProductId+"&onlyUserInfos="+onlyUserInfos+"&productInvalid="+$('_p'+productId).productInvalid+"&tradeTypeCode="+tradeTypeCode, "正在查询产品信息，请稍候......", '', noCache);
    //QC:96235 END
};
//查询元素信息
queryElementByPkgId = function(packageId, productId){
    closeOpen($("p"+productId+"k"+packageId),$("closeopen"+productId+"k"+packageId));
	if($("p"+productId+"k"+packageId).getAttribute('first').toUpperCase() == 'FALSE') {
        $("p"+productId+"k"+packageId).toggle(); 
        closeOpen($("p"+productId+"k"+packageId),$("closeopen"+productId+"k"+packageId));
		     
		return;
	}
	$productIdOfPkg=productId;  //保存产品信息，展现时需要

	//根据包标识获取元素信息 返回 eleByPkgId 节点
	Cs.Ajax.swallowXmlCache("eleByPkgId:"+packageId, prodPage, "getElementByPkgId", "packageId="+packageId+"&packageTrans="+$('_p'+productId+'k'+packageId).packageTrans+"&productId="+productId+"&userId="+userId+"&prodModifyTag="+$('_p'+productId).modifyTag+"&packModifyTag="+$('_p'+productId+'k'+packageId).modifyTag+"&curProductId="+curProductId+"&onlyUserInfos="+onlyUserInfos+"&packageInvalid="+$('_p'+productId+'k'+packageId).packageInvalid+"&userEparchyCode="+_userEparchyCode+"&userCityCode="+_userCityCode+"&userCallingArea="+_userCallingArea+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo)+"&tradeTypeCode="+tradeTypeCode+"&discntItem="+lightDiscntItemValue, "正在查询包信息，请稍候......", '' , noCache);
}



/**
 * fixed by williambai :product 属性改为小写
 * 
 * 计算元素生效失效时间
 * @param product 产品对象
 * @param element 元素对象
 * @return 元素生效失效时间
 * @author zhoush
 */
compElemDate = function(product, element) {
	//** add by williambai
	var product =  Cs.util.Utility.node2JSON(product);

	
	var dtElem = {};
	var sysDate = Cs.ctrl.Trade.getSysDate();
	var allElem = ["X","A","K","M","C","B"];
	//新增元素使用参数计算生效失效时间
	if(element.modifyTag == '0' || element.modifyTag == '9' && product.modifytag == '0') {
		//服务，生效失效时间取产品时间
		if(element.elementTypeCode.toUpperCase() == "S") {			
			if(tradeTypeCode=="12"){
				//用户资料反档生失效时间：取页面中产品时间 add by xuyh@20090604
				dtElem._startDate = product._startdate;
				dtElem._endDate = product.endDate;			
			}
			else if(tradeTypeCode=="124"){
				dtElem._startDate = product._startdate;
				dtElem._endDate = "2050-12-31 23:59:59";
			}
			else{
				//tfs:151580 begin 由于开户，服务元素默认为立即开户，现在需要对漏话提醒进行下月生效的特殊处理
				//52017   
				
				  if(( tradeTypeCode == "10" 
			    	  ||tradeTypeCode == "120"
			    	  ||tradeTypeCode == "440") &&  element.elementId=="52017"  ){
					  dtElem._startDate = Cs.util.Utility.computeDate(sysDate,'3',1).substring(0,10);
					  if(specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&tradeTypeCode == "120" )
						{
						   dtElem._startDate = product._startdate;
						}
				  }
			     //tfs:151580  guagua end
			      else 
			    	  {
			    	  dtElem._startDate = product._startdate;
			    	  }
				//如果是原有产品中增加服务，生效时间取主产品生效时间	
				//因为支持活动中多个基本产品，所元素计算时主产品生效时间尚未确定
				//原有产品中增加服务的生效时间在生成服务台帐时处理(product.modifytag == '9'的服务)
				
				dtElem._endDate = product._enddate;
				
				
			
			}
			
		
		      
		}
		//优惠
		else if(element.elementTypeCode.toUpperCase() == "D") 
		{
			console.log('------dtElem ---1---\n');
			console.log(tradeTypeCode)
			console.log(element.startAbsoluteDate);
			console.log(Cs.ctrl.Trade.getSysDate())
			console.log(Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), element.startUnit, element.startOffset));
			//开户,优惠默认为立即
			//qc 33688 begin	网龄开户也是下月生效
            var isNetAge=false;
            if($('CS_NET_AGE') && $F('CS_NET_AGE')!=''){
                var elmtId="|"+element.elementId+"|";
                if($F('CS_NET_AGE').indexOf(elmtId)>-1){	
                    isNetAge = true;
                }
            }
            
			if((tradeTypeCode == "1060"||tradeTypeCode == "10"||tradeTypeCode == "500"||tradeTypeCode == "503")&&product.productmode=="00" && !isNetAge){
				dtElem._startDate = Cs.ctrl.Trade.getSysDate();
			}
			//qc 33688 end
			//资料返档选择产品的特殊处理
			else if(recordOpenUserChgPro=="true" && tradeTypeCode == "12"){				
				dtElem._startDate = firstCallTime;			
			}
			/*else if(preStartDate!=''){
				//优惠预约生效时间
				dtElem._startDate = preStartDate;
			}*/
			//优惠绝对生效时间
			else if(element.enableTag == '0')
				dtElem._startDate = element.startAbsoluteDate>Cs.ctrl.Trade.getSysDate() ? element.startAbsoluteDate : Cs.ctrl.Trade.getSysDate();
			//优惠相对生效时间
			else
				dtElem._startDate = Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), element.startUnit, element.startOffset);
			console.log('------dtElem ---2---\n');
			console.log(dtElem._startDate)
			
			//取产品与优惠生效时间的大值
			dtElem._startDate = dtElem._startDate>product._startdate ? dtElem._startDate : product._startdate;
			console.log(product._startdate)
			console.log(dtElem._startDate)
			
			//QC:98214 begin 由于开户，元素默认为立即开户，现在需要对两个特定元素进行下月生效的特殊处理
      if(tradeTypeCode == "10" && product.productmode=="00" && (element.elementId=="20010609" || element.elementId=="20010608")){				
			dtElem._startDate = Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), element.startUnit, element.startOffset);
			}
      //QC:98214 end
      
			//优惠的失效时间以优惠的生效时间为计算起点
			//优惠绝对失效时间
			if(element.endEnableTag == '0'){
				dtElem._endDate = element.endAbsoluteDate>dtElem._startDate ? element.endAbsoluteDate : dtElem._startDate;
				console.log('------dtElem ---3---\n');
				console.log(element.endAbsoluteDate)
				console.log(element.endAbsoluteDate>dtElem._startDate)
				console.log(dtElem._endDate);
			}//优惠相对失效时间
			else {
				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._startDate, element.endUnit, element.endOffset);
				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._endDate, '6', -1);
			}
			console.log('------dtElem ---4---\n');
			console.log(dtElem._endDate);
			
			 //guagua tfs  166678
			//guagua
   			//tfs:167334 
   			//漏话提醒需求。资费的结束时间，根据合约时间进行偏移   
	           if(tradeTypeCode == "10" && (element.elementId=="5990350" || element.elementId=="5990360")){				
				dtElem._startDate = Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), element.startUnit, element.startOffset);
				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._startDate, element.endUnit, element.endOffset);
				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._endDate, '6', -1);
				}
	           if(specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&tradeTypeCode == "120")
	        	   {
	        	 
	   			     if(element.elementId=='5990350'||element.elementId=='5990360'  )
	   			     {
	   			    	 
	   			    	dtElem._endDate = Cs.util.Utility.computeDate(specialTimeStr, element.endUnit, element.endOffset);
	   					dtElem._endDate = Cs.util.Utility.computeDate(dtElem._endDate, '6', -1);
	   			    }
	        	   }
	         //guagua end: tfs  166678
			
			
			//取产品与优惠失效时间的小值
			if(tradeTypeCode != "12"&&tradeTypeCode != "124"){
				dtElem._endDate = dtElem._endDate>product._enddate ? product._enddate : dtElem._endDate;	
			}	

			console.log('------dtElem ---6---');
			console.log(JSON.stringify(dtElem));
			dtElem._endDate = dtElem._endDate.substring(0,10)+" 23:59:59";
		}
		//SP服务
		else if(element.elementTypeCode.toUpperCase() == "X") 
		{
			//开户,优惠默认为立即
			if(tradeTypeCode == "10"||tradeTypeCode == "500"||tradeTypeCode == "503")
			{
				dtElem._startDate = Cs.ctrl.Trade.getSysDate();
			}
			//资料返档选择产品的特殊处理
			else if(recordOpenUserChgPro=="true" && tradeTypeCode == "12")
			{				
				dtElem._startDate = firstCallTime;			
			}
			//优惠绝对生效时间
			else if(element.enableTag == '0')
				dtElem._startDate = element.startAbsoluteDate>Cs.ctrl.Trade.getSysDate() ? element.startAbsoluteDate : Cs.ctrl.Trade.getSysDate();
			//优惠相对生效时间
			else
				dtElem._startDate = Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), element.startUnit, element.startOffset);
			
			//取产品与优惠生效时间的大值
			dtElem._startDate = dtElem._startDate>product._startdate ? dtElem._startDate : product._startdate;
			
			
			//优惠的失效时间以优惠的生效时间为计算起点
			//优惠绝对失效时间
			if(element.endEnableTag == '0')
				dtElem._endDate = element.endAbsoluteDate>dtElem._startDate ? element.endAbsoluteDate : dtElem._startDate;
			//优惠相对失效时间
			else 
			{
				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._startDate, element.endUnit, element.endOffset);
				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._endDate, '6', -1);
			}

			if(element.endEnableTag == '')	
				dtElem._endDate = "2050-12-31 23:59:59";		
			
			//取产品与优惠失效时间的小值
			if(tradeTypeCode != "12"&&tradeTypeCode != "124")
			{
				dtElem._endDate = dtElem._endDate>product._enddate ? product._enddate : dtElem._endDate;	
			}	
		}				
		//实物,礼品包,话费
		else if(allElem.include(element.elementTypeCode.toUpperCase())) 
		{
    		dtElem._startDate = product._startdate;
    		dtElem._endDate = product._enddate;				
		}
		
		if(element.modifyTag == '9' && product.modifytag == '0') 
		{
			//预约的生效时间
			if(dtElem._startDate < element.startDate) dtElem._startDate = element.startDate;
			//预约的失效时间
			//if(dtElem._endDate > element.startDate) dtElem._endDate = element.endDate;//辽宁老数据迁移导致资费不连续注释
			
			//qc:96011 begin老元素带过来保留老的结束时间
			if(dtElem._endDate > element.endDate && element.endDate > dtElem._startDate) dtElem._endDate = element.endDate;
			//qc:96011 end
		}
	}
	//用户原有元素使用原生效失效时间
	else {
		dtElem._startDate = element.startDate;
		//tfs:151580 begin 由于开户，服务元素默认为立即开户，现在需要对漏话提醒进行下月生效的特殊处理
//	      if(( tradeTypeCode == "10" ||tradeTypeCode == "120"||tradeTypeCode == "440") &&  element.elementId=="52017"  ){				
//				dtElem._startDate = Cs.util.Utility.computeDate(product._startdate, 3, 1).substring(0,10);
//		  }
		 //tfs:151580  
		if(element.elementId=="52017" &&tradeTypeCode == "10" )
			{
			dtElem._startDate =Cs.util.Utility.computeDate(sysDate, '3', 1).substring(0,10)  ;
			}
		
		 //tfs:151580  guagua end
		if(recordOpenUserChgPro=="true" && tradeTypeCode == "12"&&element.modifyTag=="9"){
			//资料返档老产品的特殊处理
			dtElem._endDate = Cs.util.Utility.computeDate(firstCallTime, '6', -1);
		}
		else{
			dtElem._endDate = element.endDate;		
		}
		 //tfs:151580  
		if((element.elementId=="5990350" || element.elementId=="5990360")&&tradeTypeCode == "10" )
		{
		   dtElem._startDate =Cs.util.Utility.computeDate(sysDate, '3', 1).substring(0,10)  ;
		   dtElem._endDate = Cs.util.Utility.computeDate(dtElem._startDate, element.endUnit, element.endOffset);
		   dtElem._endDate = Cs.util.Utility.computeDate(dtElem._endDate, '6', -1);
		}
		 //tfs:151580  guagua end
			
	}
	return dtElem;
}

/**
 * 选择产品的onclick事件
 * @param productId 触发事件的产品编码
 * @param checked 是否选中
 * @param bubble 冒泡 true-由包触发 false-由界面选择
 * @return 无
 * @author zhoush
 */
onProductClick = function(productId, checked, bubble) { 
	//tfs:208234 Begin
	//产品服务变更优化，增加产品模糊查询按钮快速筛选产品
	//此处用于记录是否已经选择产品
	//nodeForSearch 全局变量，用于产品模糊查询
	if(tradeTypeCode == '120' && forSearchOpen == '1'){
		if(checked == true){
		  for(var index=0; index<nodeForSearch.childNodes.length; index++){
		  	if(nodeForSearch.childNodes[index].getAttribute("productId") == productId){
		  		nodeForSearch.childNodes[index].setAttribute("ifChick","1");
		  		break;
		  	}	 		
		  } 
		 } else{
			for(var index=0; index<nodeForSearch.childNodes.length; index++){
				if(nodeForSearch.childNodes[index].getAttribute("productId") == productId){
					//nodeForSearch.childNodes[index].getAttribute("modifyTag") = "0";	
					nodeForSearch.childNodes[index].setAttribute("ifChick","0");
					break;
		  	    }
			}
		 }
	}
	//tfs:208234 End
	
	//qc:10981 Begin
	//营销活动中由于一次操作选择了不同的营销活动导致购机款的不同，加上处理，使营销活动只能选择一个
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
		  if(prod.getAttribute('productMode') == '50'&&prod.getAttribute('parentArea') == "deviceProdutArea") {
			  	//查看营销活动中是否存在多个
			  	if(productId != prod.getAttribute('productId') && $('_p'+prod.getAttribute('productId')).checked) {
			  		$('_p'+prod.getAttribute('productId')).checked = false;
			  		//当选择第二个营销产品时，取消掉上一个营销产品，并取消其包元素
			  		$A($('p'+prod.getAttribute('productId')).all).each(function (s) {
			  			if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
			  				&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'PACKAGE') {
			  					//触发包的onclick事件
			  					s.checked = false;
			  					onPackageClick(prod.getAttribute('productId'), s.packageId, false, false);
			  			}
			  		});
			  	}
			 }
	}); 
	//qc:10981 End
	
	//qc:96196 begin 有营销产品选中时担保类型不可再修改，否则可修改
	var deviceCheckedProductCount=0;
		$A(document.getElementsByName('_productinfos')).each(function(prod) {
		  if(prod.checked && prod.getAttribute('productMode') == '50'&&prod.getAttribute('parentArea') == "deviceProdutArea") {
			    //循环累积基础产品
			     deviceCheckedProductCount++;
			 }
	     }); 
	     if( $("ASSURE_TYPE$lst") ){
		     if(deviceCheckedProductCount==0){
		     	Cs.flower.LookupCombo.disabled($('ASSURE_TYPE'),false);
		     }else if(deviceCheckedProductCount>0){
		     	Cs.flower.LookupCombo.disabled($('ASSURE_TYPE'),true);
		     } 
	     }
	//qc:96196 end
	
	//tfs:177905 begin 
 	if(checked && $('_p'+productId).getAttribute('modifyTag') == '0' && $('_p'+productId).getAttribute('productMode') == '00' && $('_p'+productId).getAttribute('netTypeCode') == '40') {
 		if(typeof(aLinsTag)!='undefined'){
 			aLinsTag = "B";
 		}
 	}
 	//tfs:177905 end 
	
	//if(getRightCode()=='csCreateWileProvYUserTrade') //省份预付费是否绑定终端改为根据包类型来
	//	drawTerminalCtrlByPro(productId);
	if(getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() == "csCreateWilePerUserTrade" || getRightCode() == "csCreateWileGrpUserTrade4G" || getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO"){
	//  后付费无线上网卡 参加活动查询活动费用
		if($("join") && $("join").checked && $("join").value == "0"){
			getFeeInfoIfJoinPlan(productId);
		}
	
	}
	if(getRightCode() == "csCreatePrePagUserTrade"){//手机预付费套包 获取res_rel费用信息
		getFeeInfoIfJoinPlan(productId);
	}
	//事件自下而上，由包触发而来
	if(bubble) {
		//包被选择
		if(checked) {
			//判断产品是否已被选择，未被选择则触发产品的选择事件(checked=true)
			//QC:97384 自下而上选择产品后需要重新算时间及终端款 Begin
			if(!$('_p'+productId).checked) 
			{
				$('_p'+productId).checked = checked = true;
				initPtypeArea(productId);
			}
			else return;
			//QC:97384 End
		}
		//包被取消
		else {
			//判断产品下是否所有包已被取消
			var allCancel = true;
			$A($('p'+productId).all).each(function (s) {
				if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
					&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'PACKAGE'
					&& s.checked) {
					allCancel = false;
				}
			});
			
			//所有包已被取消，则触发产品的选择事件(checked=false)
			if(allCancel) $('_p'+productId).checked = checked = false;
			else return;
		}
	}
	
	showColor('_p'+productId,'showcolor'+productId); 
 
		
	//新增产选中时自动展开
	if(checked && $('_p'+productId).getAttribute('modifyTag') == '0' && $('_p'+productId).getAttribute('needExp') == '1') {
		queryPackageInfo(productId);
		$('p'+productId).show();
		closeOpen($("p"+productId),$("closeopen" + productId));

	}  
			
	$A($('p'+productId).all).each(function (s) {
		if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
			&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'PACKAGE') {
				
				if(checked) {
					if(s.getAttribute('forceTag') == '1' || (s.getAttribute('defaultTag') == '1' && curProductId != productId ) || s.getAttribute('modifyTag') == '9') s.checked = checked;

					if(s.getAttribute('forceTag') == '1') s.disabled = true;
				}
				else {
					s.checked = s.disabled = checked;
				}
				
				console.log('++++ onProductClick() 10 +++\n');	
				//触发包的onclick事件
				onPackageClick(productId, s.packageId, s.checked, false);
		}
	});
	//QC:32878 Begin
	if($("QC_TAG_32878") && $("QC_TAG_32878").value == '0')ifShowAcctInfo(checked);
	//QC:32878 End
	
	//tfs：88873 begin
	if($("contractInfoArea")){
		$("contractInfoArea").innerHTML ="";
	}
	if(typeof drawContractInfoArea != 'undefined' && drawContractInfoArea instanceof Function && typeof sfUserInfo != 'undefined'  &&  null != sfUserInfo
						&& sfUserInfo.BSS_TAG != 'undefined' && sfUserInfo.BSS_TAG == "TRUE" 
						&& sfUserInfo.CONTRACT_INFO != 'undefined' && sfUserInfo.CONTRACT_INFO != null){
		$A(document.getElementsByName('_productinfos')).each(function(prod) {
			   if (prod.getAttribute('netTypeCode') == '50' && $('_p'+prod.getAttribute('productId')).checked && prod.getAttribute('productMode') == '00') {
					   $("contractInfoArea").innerHTML ="";
					   //tfs:249355  只有点击主产品的时候才会重新刷新原合约信息,当点击促销类的附加产品等的时候不会重新刷新该区域,否则可能导致赠款规则不正确
		               drawContractInfoArea(prod);
		               $("contractInfoArea").pid = prod.getAttribute('productId');
		       }
		});
	}
	//tfs：88873 end
	console.log('++++ onProductClick() end +++\n');	
}

/**
 * 选择包的onclick事件
 * @param packageId 触发事件的包编码
 * @param checked 是否选中
 * @param bubble 冒泡 true-由元素触发 false-由界面选择
 * @return 无
 * @author zhoush
 */
function onPackageClick(productId, packageId, checked, bubble) {

	//if(getRightCode()=='csCreateWileProvYUserTrade')
	//	drawTerminalCtrlByPro(productId);
	if(getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() == "csCreateWilePerUserTrade" || getRightCode() == "csCreateWileGrpUserTrade4G" || getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO"){
	//  后付费无线上网卡 参加活动查询活动费用
		if($("join") && $("join").checked && $("join").value == "0"){
			getFeeInfoIfJoinPlan(productId);
		}
	
	}
	
	if(getRightCode() == "csCreatePrePagUserTrade"){//手机预付费套包 获取res_rel费用信息
		getFeeInfoIfJoinPlan(productId);
	}
	
	//事件自下而上，由元素触发而来
	if(bubble) {
		//元素被选择
		if(checked) {
			//判断包是否已被选择，未被选择则触发包的选择事件(checked=true)
			if(!$('_p'+productId+'k'+packageId).checked) $('_p'+productId+'k'+packageId).checked = checked = true;
			else return;
		}
		//元素被取消
		else {
			//判断包下是否所有元素已被取消
			var allCancel = true;
			$A($('p'+productId+'k'+packageId).all).each(function (s) {
				if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
					&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
					&& s.checked) {
					allCancel = false;
				}
			});
			
			//所有元素已被取消，则触发包的选择事件(checked=false)
			if(allCancel && $('_p'+productId+'k'+packageId).getAttribute('forceTag') != '1')
				$('_p'+productId+'k'+packageId).checked = checked = false;
			else return;
		}
	}
	
	showColor('_p'+productId+'k'+packageId,'showcolor'+productId+'k'+packageId);
	
	//新增包选中时自动展开
	if(checked && ($('_p'+productId+'k'+packageId).getAttribute('modifyTag') == '0'||$('_p'+productId+'k'+packageId).getAttribute('modifyTag')=='9') && $('_p'+productId+'k'+packageId).getAttribute('needExp') == '1') {  //modify by tz@2009-11-8 02:58下午 增加 modify_tag='9'
		queryElementByPkgId(packageId,productId);
		$('p'+productId+'k'+packageId).show();
		closeOpen($("p"+productId+"k"+packageId),$("closeopen"+productId+"k"+packageId));
		
	}
	
	//qc:3803 用于固网产品及属性变更页面 add by xiexc begin
	var tempFlag=false;
	var changeEleProtTag=false;
	if($("changeEleProtTag")&&$F("changeEleProtTag")=="1"){
	    changeEleProtTag=true;
	}
	if(changeEleProtTag){
	    $A($('p'+productId+'k'+packageId).all).each(function (s) {
			    if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
				    && s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
				    && s.checked) {
				    if(tempFlag==false)
				    tempFlag=true;
			}
	    });
	}
	//qc:3803 用于固网产品及属性变更页面 add by xiexc  end
	
	$A($('p'+productId+'k'+packageId).all).each(function (s) {
		if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
			&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT') {
				
				if(checked) {
					if(s.getAttribute('forceTag') == '1' || (s.getAttribute('defaultTag') == '1'&&curProductId != productId) || s.getAttribute('modifyTag') == '9') 
					//qc:3803 用于固网产品及属性变更页面 add by xiexc begin
					{
					  var pkgTemp = $('_p'+productId+'k'+packageId);
					  if(pkgTemp && pkgTemp.maxNumber == "1"&&tempFlag){
					    
					  }
					  //qc 98337 start
                      else if(s.endDate == Cs.util.Utility.getLastDay(Cs.ctrl.Trade.getSysDate())&& $('_p'+productId).getAttribute('modifyTag') =='0'){
                      }
                      //qc 98337 end
					  else{
					//qc:3803 用于固网产品及属性变更页面 add by xiexc  end
					
					      s.checked = checked;
					      
					//qc:3803 用于固网产品及属性变更页面 add by xiexc begin
					  }
					}
				    //qc:3803 用于固网产品及属性变更页面 add by xiexc  end
						
					if(s.getAttribute('forceTag') == '1') s.disabled = true;
				}
				else {
					s.checked = s.disabled = checked;
				}
				console.log('++++ onPackageClick() 10 +++\n');	
				//触发元素的onclick事件
				onElementClick(productId, packageId, s.value,s.getAttribute('elementTypeCode'),s.checked, false);
		}
	});
	
		
	//触发自下而上事件
	if(bubble != false) onProductClick(productId, checked, true);
	
	console.log('++++ onPackageClick() end +++\n');	
	
	/*//Added by tangz@2009-2-4 1:53
	if (bubble===undefined) {
	    if (!checkOperator(productId, packageId)){
	        var elm = Event.element(event);
	        elm.checked = !checked;
	        onPackageClick(productId, packageId, !checked, false);
	    }
	}*/
}


/**
 * 选择包的onclick事件(用于自下而上点击element时触发，解决默认元素被自动带出问题)
 * @param packageId 触发事件的包编码
 * @param checked 是否选中
 * @param bubble 冒泡 true-由元素触发 false-由界面选择
 * @return 无
 * @author zhoush
 */
onPackageClickFromEle = function(productId, packageId, checked, bubble) {
	//if(getRightCode()=='csCreateWileProvYUserTrade')
	//	drawTerminalCtrlByPro(productId);
	if(getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() == "csCreateWilePerUserTrade" || getRightCode() == "csCreateWileGrpUserTrade4G" || getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO"){
	//  后付费无线上网卡 参加活动查询活动费用
		if($("join") && $("join").checked && $("join").value == "0"){
			getFeeInfoIfJoinPlan(productId);
		}
	
	}
	
	if(getRightCode() == "csCreatePrePagUserTrade"){//手机预付费套包 获取res_rel费用信息
		getFeeInfoIfJoinPlan(productId);
	}
	
	//事件自下而上，由元素触发而来
	if(bubble) {
		//元素被选择
		if(checked) {
			//判断包是否已被选择，未被选择则触发包的选择事件(checked=true)
			if(!$('_p'+productId+'k'+packageId).checked) $('_p'+productId+'k'+packageId).checked = checked = true;
			else return;
		}
		//元素被取消
		else {
			//判断包下是否所有元素已被取消
			var allCancel = true;
			$A($('p'+productId+'k'+packageId).all).each(function (s) {
				if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
					&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
					&& s.checked) {
					allCancel = false;
				}
			});
			
			//所有元素已被取消，则触发包的选择事件(checked=false)
			if(allCancel && $('_p'+productId+'k'+packageId).getAttribute('forceTag') != '1')
				$('_p'+productId+'k'+packageId).checked = checked = false;
			else return;
		}
	}
	
	// showColor('_p'+productId+'k'+packageId,'showcolor'+productId+'k'+packageId);
	
	//新增包选中时自动展开
	if(checked && ($('_p'+productId+'k'+packageId).getAttribute('modifyTag') == '0'||$('_p'+productId+'k'+packageId).getAttribute('modifyTag')=='9') && $('_p'+productId+'k'+packageId).getAttribute('needExp') == '1') {  //modify by tz@2009-11-8 02:58下午 增加 modify_tag='9'
		queryElementByPkgId(packageId,productId);
		$('p'+productId+'k'+packageId).show();
		closeOpen($("p"+productId+"k"+packageId),$("closeopen"+productId+"k"+packageId));

	}
	
	//qc:3803 用于固网产品及属性变更页面 add by xiexc begin
	var tempFlag=false;
	var changeEleProtTag=false;
	if($("changeEleProtTag")&&$F("changeEleProtTag")=="1"){
	    changeEleProtTag=true;
	}
	if(changeEleProtTag){
	    $A($('p'+productId+'k'+packageId).all).each(function (s) {
			    if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
				    && s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
				    && s.checked) {
				    if(tempFlag==false)
				    tempFlag=true;
			}
	    });
	}
	//qc:3803 用于固网产品及属性变更页面 add by xiexc  end
	
	$A($('p'+productId+'k'+packageId).all).each(function (s) {
		if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
			&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT') {
	
				if(checked) {
					if(s.getAttribute('forceTag') == '1' || (s.getAttribute('defaultTag') == '1'&&curProductId != productId) || s.getAttribute('modifyTag') == '9') 
					//qc:3803 用于固网产品及属性变更页面 add by xiexc begin
					{
					  var pkgTemp = $('_p'+productId+'k'+packageId);
					  if(pkgTemp && pkgTemp.maxNumber == "1"&&tempFlag){
					  }
					  //qc 98337 start
                      else if(s.getAttribute('endDate') == Cs.util.Utility.getLastDay(Cs.ctrl.Trade.getSysDate())&& $('_p'+productId).getAttribute('modifyTag') =='0'){
                      
                      }
                      //qc 98337 end				  
					  else if(getRightCode()=='csChangeServiceTrade'){
					  	//移网不需要自动带出元素
					  	
					  }
					  else{				  	
					//qc:3803 用于固网产品及属性变更页面 add by xiexc  end
					      s.checked = checked;
					//qc:3803 用于固网产品及属性变更页面 add by xiexc begin
					  }
					}
				    //qc:3803 用于固网产品及属性变更页面 add by xiexc  end
						
					if(s.getAttribute('forceTag') == '1') s.disabled = true;
				}
				else {
					s.checked = s.disabled = checked;
				}
				
				console.log('++++ onPackageClickFromEle() 9 +++\n');
				//触发元素的onclick事件
				onElementClick(productId, packageId, s.value,s.getAttribute('elementTypeCode'),s.checked, false);
		}
	});	
	console.log('++++ onPackageClickFromEle() 10 +++\n');
	//触发自下而上事件
	if(bubble != false) onProductClick(productId, checked, true);
	/*//Added by tangz@2009-2-4 1:53
	if (bubble===undefined) {
	    if (!checkOperator(productId, packageId)){
	        var elm = Event.element(event);
	        elm.checked = !checked;
	        onPackageClick(productId, packageId, !checked, false);
	    }
	}*/
	console.log('++++ onPackageClickFromEle() end +++\n');
}

/**
 * 选择元素的onclick事件
 * @param elementId 触发事件的元素编码
 * @param checked 是否选中
 * @param bubble 控制重复冒泡 false-由包触发
 * @return 无
 * @author zhoush
 */
onElementClick = function(productId, packageId, elementId,elementType, checked, bubble, passed, isEleClick) {
    var eId = "_p"+productId+"k"+packageId+"e"+elementId+"T"+elementType;
    if(checked && isEleClick && (tradeTypeCode == '110' || tradeTypeCode == '120' || tradeTypeCode == '440'
        || tradeTypeCode == '340' || tradeTypeCode == '448')) {
        //如果是33、50、CP的主产品则限制
        var pId = "_p"+productId;
        var ntc = $(pId).netTypeCode;
        var pMode = $(pId).productMode;
        if(pMode == "00" && elementType == "D" && (ntc == "33" || ntc == "50" || ntc == "CP")){
            var elem = $(eId);
            if(elem.firstmonthpaytype == '01' || elem.firstmonthpaytype == '03'){
                elem.checked = false;
                win.alert("在网用户转套餐时不允许选择半月或套外套餐只能选择全月套餐！");
                checked = false;
            }
        }
    }
    if(!passed && isEleClick){	//add by scocape	当包最大数为1时，在选择元素时，自动取消其他被选元素
		autoCancelClick(productId, packageId, elementId,elementType, checked, bubble);
	}
	// QC 96686 begin 移网产品/服务变更判断是否免国际长途预付款
	if(getRightCode() == "csChangeServiceTrade"){//移网产品/服务变更
		 
	 	if(checked&&isEleClick&&$("N6_96686_TAG_CODE")){
	 	
	 	     if($F("N6_96686_TAG_CODE").indexOf(elementId)!=-1)
	        	{
                   Cs.Ajax.register("getManyouFlagOk", checkManyouFee);
                   Cs.Ajax.register("getManyouFlagFail", checkManyouFeeFail);

	  			   Cs.Ajax.swallowXml("", "checkManyouFee", "serilNumber="+$("SERIAL_NUMBER").value+"&netTypeCode="+$("NET_TYPE_CODE").value+"&acctId="+$F("ACCT_ID")+"&userId="+$F("USER_ID_HIDEN")+"&productID="+productId, "正在检查是否免预存开通国际长途,请稍候...");
	 			 }
	  	}
		
	}
	// QC 96686 end

	//tfs 91183 begin
	var eIdTmp = "";
	var eId42m3G = "_p"+productId+"k"+packageId+"e33105"+"T"+elementType; //3g的42M
	var eId42m4G = "_p"+productId+"k"+packageId+"e50105"+"T"+elementType; //4g的42M
	//tfs 91183 end
	
	var canNStep = false;	
	
	showColor(eId,'showcolor'+productId+'k'+packageId + 'e'+elementId,'showcolor_'+productId+'k'+packageId + 'e'+elementId);
	
	//TFS 77190 BEGIN
	if (checked){
		
		if ($("ISNEED_LET_CHECK") && $("ISNEED_LET_CHECK").value =="1"){ //总开关
			if ($("IS_LTE_SERVICE") && $("IS_LTE_SERVICE").value == elementId){ //判断是否是LTE服务
			    eIdTmp = eId;
			                                         
			    //判断是否号段为空
			    if ($("LTE_SER_BEGIN") && $("LTE_SER_BEGIN").value !=""){
			       //判断结束号段是否未配置
			       if ($("LTE_SER_END") && $("LTE_SER_END").value =="")
			           win.alert("没有配置可办理LTE服务结束号段，不可办理LTE4G上网服务!");
			       
			       var serBegin  = $("LTE_SER_BEGIN").value ; // 开始号段
			       var serEnd = $("LTE_SER_END").value;       // 结束号段
			       
			       var serBegList = serBegin.split("|"); 
			       var serEndList = serEnd.split("|");
			       
			       
			       if (serBegList.length != serEndList.length){
			           win.alert("配置的开始号段与结束号段不能一一对应，请检查配置参数!");
			           $(eId).checked = false;
			       }
			       var lteFlag = true;
			       //在融合新装和融合变更中4g号码不允许选择LTE服务,取消lte权限判断  modify by 109898 
			       if( getRightCode() == "csCreatecompuser" || getRightCode() =="csChangecompuser" || getRightCode() =="csChangecompuserOrderBack" ){
			    	  lteFlag = false;
			       }else{
			    	   //如果不为空则判断号码是否在号段之内
			    	   if(($("serialNumber") && $F("serialNumber")!="") || ($("SERIAL_NUMBER") && $F("SERIAL_NUMBER")!="")){
					       if ($("serialNumber")){
					           var serNum = parseInt($F("serialNumber"));
					           for (var i=0;i<serBegList.length;i++){
					              var b = parseInt(serBegList[i]);
					              var e = parseInt(serEndList[i]);
					              if (b <= serNum && serNum <= e){
					                 lteFlag = false;
					                 continue;
					              }
					           }      
						   }
						    
						   if ($("SERIAL_NUMBER")){
						       var serNum = parseInt($F("SERIAL_NUMBER"));
					           for (var i=0;i<serBegList.length;i++){
					              var b = parseInt(serBegList[i]);
					              var e = parseInt(serEndList[i]);
					              if (b <= serNum && serNum <= e){
					                 lteFlag = false;
					                 continue;
					              }
					           }  
						   }
				       }else{
				    	   lteFlag = false;
				       }
			       }
			      
				   
				   if(lteFlag){
			          win.alert("用户号码不在配置的开始号段:"+serBegList+"到结束号段"+serEndList+"之内，不能办理LTE4G上网服务！");
			          $(eId).checked = false;
			       }
			    } else {
			       win.alert("没有配置可办理LTE服务号段，不可办理LTE4G上网服务!");
			       $(eId).checked = false;
			    }	   
			    
			    //tfs 91183 begin
			    if ($(eId).checked ==false){
			      if ($(eId42m4G)){
			         $(eId42m4G).checked = true;
			      }else if($(eId42m3G)) {
			         $(eId42m3G).checked = true;
			      } 		      
			    }
			    
			}
		}
	}
	
	if ($("ISNEED_LET_CHECK") && $("ISNEED_LET_CHECK").value =="1"){	
	   if (elementId == "50105" || elementId == "33105" ){
	         if ($(eIdTmp) && $(eIdTmp).checked == false){
	            $(eId).checked = true;
	         }
	   }
	}
	//tfs 91183 end
	if ($("ISNEED_LET_CHECK") && $("ISNEED_LET_CHECK").value =="1" && $("IS_LTE_SERVICE") && $("IS_LTE_SERVICE").value == elementId){
	// 无奈的选择 只能这么干了
	}
	//TFS 77190 END 
	
	//元素互斥
	//qc 097956 add by zhoucs begin
	//** fix by williambai
	else if(checked&&$(eId).getAttribute('mutexStr')!="")
	//qc 097956 add by zhoucs end
	{
		canNStep = checkMutexElements($(eId), isEleClick);
	}
	else
	{
		canNStep = true;
	}
	
	//元素依赖
	//qc 097956 add by zhoucs begin
	//** fix by williambai
	if(canNStep&&checked&&$(eId).getAttribute('relyStr') !=""&&$("_TRADE_TYPE_CODE")&&$("_TRADE_TYPE_CODE").value =='10')
	//qc 097956 add by zhoucs end
	{
		checkRelyElements($(eId));
	}
	console.log('++++++++ onElementClick() 10 +++++\n');
	//触发自下而上事件
	if(bubble != false&&canNStep) onPackageClickFromEle(productId, packageId, checked, true);
	
	/*//Added by tangz@2009-2-4 1:53
	if (bubble===undefined) {
	    if (!checkOperator(productId, packageId)){
	        var elm = Event.element(event);
	        elm.checked = !checked;
	        if(bubble != false) onPackageClick(productId, packageId, !checked, true);
	    }
	}*/
	console.log('++++++++ onElementClick() end +++++\n');
}




// //展现包中元素信息
// showElementInfo = function(node) {
//     if("HBCU" == provinceCode && node.childNodes.length==0 ) return ;
// 	if (node.childNodes.length==0){
// 		win.alert("没有查询到元素信息!");
// 		return;
// 	}
	
// 	var packageId = node.childNodes[0].getAttribute("packageId");
// 	var productId = $productIdOfPkg;
	
// 	var eleLayout = new Cs.flower.LayoutHelper("p"+productId+"k"+packageId, 3); //三列显示
		
//     eleLayout.cellClass=function(idx){return (idx%2==0)?"row_odd":"row_even";}; //设置式样	
    
// 	eleLayout.draw(node.childNodes, function(item){
// 		var elementInfo = Cs.util.Utility.node2JSON(item);
		
// 		var a = new Array;
		
// 		a.push('<input type="checkbox" class="radio" value="');
// 		a.push(elementInfo.elementId);
// 		a.push("\" onclick='onElementClick(\"");
// 		a.push(productId);
// 		a.push ("\",\"");
// 		a.push(packageId);
// 		a.push ("\",\"");
// 		a.push(elementInfo.elementId);
// 		a.push ("\",\"");
// 		a.push(elementInfo.elementTypeCode);
// 		a.push ("\",");
// 		a.push("this.checked");
// 		a.push ("\,\"");
// 		a.push(true);
// 		a.push ("\",\"");
// 		//a.push(7);
// 		a.push ("\",");
// 		a.push(true);
// 		a.push(")' ");
// 		a.push(geneAttrString(elementInfo, 'packageId,elementId,elementName,modifyTag,_submitStartDate,_submitEndDate,itemId,itemIdOld,forceTag,defaultTag,elementTypeCode,elementDesc,enableTag,startAbsoluteDate,startOffset,startUnit,endEnableTag,endAbsoluteDate,endOffset,endUnit,startDate,endDate,score,rewardLimit,hasAttr,spProductId,partyId,spId,paramvalue,hasEnd,mutexStr,relyStr,svcEndMode,firstmonthpaytype'));
// 		//alert('1'+elementInfo.packageId);
// 		//alert('2'+elementInfo.hasEnd);
// 		//_startDate：元素生效时间, _endDate：元素结束时间

// 		//** fixed by williambai
// 		var product =  Cs.util.Utility.node2JSON($('_p'+productId));
// 		console.log('-----compElemDate product: \n');
// 		console.log(JSON.stringify(product));
// 		console.log('------compElemDate element: \n')
// 		console.log(JSON.stringify(elementInfo));
// 		var elemDate = compElemDate(product, elementInfo);
		
// 		if(specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&elementInfo.modifyTag == '0'){//特殊指定时间 add by zhangyangshuo
// 			a.push(" _startDate=\"" + specialTimeStr + "\"");
// 				a.push(" _endDate=\"" + elemDate._endDate + "\"");
// 		}else{
// 			a.push(" _startDate=\"" + elemDate._startDate + "\"");
// 			a.push(" _endDate=\"" + elemDate._endDate + "\"");
// 		}
		
// 		a.push(" productId=\"" + productId + "\"");
// 		if(elementInfo.modifyTag == '1' || allDisabled) a.push(" disabled");
// 		if(elementInfo.modifyTag == '9' && $('_p'+productId).getAttribute('modifyTag') == '9') a.push(" checked");
// 		a.push(" id='_p"+productId+'k'+packageId+"e"+elementInfo.elementId+"T"+ elementInfo.elementTypeCode +"'");
// 		a.push(" _thisType=\"element\"");
		
// 		a.push('/>');
		
		
// 		var elclass = 'black';
// 		if(elementInfo.modifyTag == '1') elclass = 'red';
// 		else if(elementInfo.modifyTag == '9') 
// 		    {
// 		        if(elementInfo.hasEnd=="3")//下月生效的元素
// 		            elclass = '#F75000';
// 		        else    
// 		            elclass = 'black';
// 		    }
// 		else elclass = 'black';

		
		
// 		if (elementInfo.elementDesc){
// 		    a.push("<span");
// 		    a.push(" id='showcolor"+productId+'k'+packageId+"e"+elementInfo.elementId+"'");
// 		    a.push(" style='color:" + elclass + "' explain='"+elementInfo.elementDesc+"' ");
// 		    }
// 		else{
// 		    a.push("<span");
// 		    a.push(" id='showcolor"+productId+'k'+packageId+"e"+elementInfo.elementId+"'");		    
// 		    a.push(" style='color:" + elclass + "'");
// 		}   
		
// 		a.push("  ondblclick='copyToClip(\"");
// 		a.push(elementInfo.elementName+"("+elementInfo.elementId+")("+elementInfo.elementTypeCode+")");
// 		a.push("\",true)' >");
		
// 		if (elementInfo.hasAttr&&!elementInfo.hasAttr.blank()&&elementInfo.hasAttr!="0"){
// 	        a.push("<a href='javascript:void(0)'"+" id='showcolor_"+productId+'k'+packageId+"e"+elementInfo.elementId+"'"+" style='color:" + elclass + "' onclick='setAttr(\"");
// 	        a.push(elementInfo.elementName+"("+elementInfo.elementId+")("+elementInfo.elementTypeCode+")");
// 	        a.push("\" )'>");
// 	       }
// 		a.push(elementInfo.elementName);
// 		if (elementInfo.hasAttr&&!elementInfo.hasAttr.blank()&&elementInfo.hasAttr!="0")
// 		    a.push("</a>");
// 		a.push("</span>");
// 		a.push("<span>");
		    
// 		if(elementInfo.elementTypeCode=="D"||elementInfo.elementTypeCode=="S" || elementInfo.elementTypeCode=="X")
// 		{
//     		a.push("<img ");
//     		a.push(" src='/images-custserv/win/q2.gif' style='cursor:hand' onclick='setDateAttr(this)'");
//     		a.push(">");
//     	}
// 		a.push("</span>");
		
		
		
// 		return a.join("");
// 	});
	
// 	if (typeof explainToTips != 'undefined' && explainToTips instanceof Function)
// 	    explainToTips("docTip", 300, $("p"+productId+"k"+packageId));
	
// 	$("p"+productId+"k"+packageId).toggle();
// 	$("p"+productId+"k"+packageId).first = 'FALSE';
// 	closeOpen($("p"+productId+"k"+packageId),$("closeopen" + productId+"k"+packageId));
	
// 	//展开包时，如果包已选择，则触发包onclick事件
// 	if($("_p"+productId+"k"+packageId).checked) onPackageClick(productId, packageId, true); 
// }

// Cs.Ajax.unregister("eleByPkgId");  //注销原函数
// Cs.Ajax.register("eleByPkgId", showElementInfo);  //包中元素信息



// /**
//  * 计算元素生效失效时间
//  * @param product 产品对象
//  * @param element 元素对象
//  * @return 元素生效失效时间
//  * @author zhoush
//  */
// function compElemDate(product, element) {
// 	var dtElem = {};
// 	var sysDate = Cs.ctrl.Trade.getSysDate();
// 	var allElem = ["X","A","K","M","C","B"];
// 	//新增元素使用参数计算生效失效时间
// 	if(element.modifyTag == '0' || element.modifyTag == '9' && product.getAttribute('modifyTag') == '0') {
// 		//服务，生效失效时间取产品时间
// 		if(element.elementTypeCode.toUpperCase() == "S") {			
// 			if(tradeTypeCode=="12"){
// 				//用户资料反档生失效时间：取页面中产品时间 add by xuyh@20090604
// 				dtElem._startDate = product.getAttribute('_startDate');
// 				dtElem._endDate = product.getAttribute('endDate');			
// 			}
// 			else if(tradeTypeCode=="124"){
// 				dtElem._startDate = product.getAttribute('_startDate');
// 				dtElem._endDate = "2050-12-31 23:59:59";
// 			}
// 			else{
// 				//tfs:151580 begin 由于开户，服务元素默认为立即开户，现在需要对漏话提醒进行下月生效的特殊处理
// 				//52017   
				
// 				  if(( tradeTypeCode == "10" 
// 			    	  ||tradeTypeCode == "120"
// 			    	  ||tradeTypeCode == "440") &&  element.elementId=="52017"  ){
// 					  dtElem._startDate = Cs.util.Utility.computeDate(sysDate,'3',1).substring(0,10);
// 					  if(specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&tradeTypeCode == "120" )
// 						{
// 						   dtElem._startDate = product.getAttribute('_startDate');
// 						}
// 				  }
// 			     //tfs:151580  guagua end
// 			      else 
// 			    	  {
// 			    	  dtElem._startDate = product.getAttribute('_startDate');
// 			    	  }
// 				//如果是原有产品中增加服务，生效时间取主产品生效时间	
// 				//因为支持活动中多个基本产品，所元素计算时主产品生效时间尚未确定
// 				//原有产品中增加服务的生效时间在生成服务台帐时处理(product.getAttribute('modifyTag') == '9'的服务)
				
// 				dtElem._endDate = product.getAttribute('_endDate');
				
				
			
// 			}
			
		
		      
// 		}
// 		//优惠
// 		else if(element.elementTypeCode.toUpperCase() == "D") 
// 		{
// 			//开户,优惠默认为立即
// 			//qc 33688 begin	网龄开户也是下月生效
//             var isNetAge=false;
//             if($('CS_NET_AGE') && $F('CS_NET_AGE')!=''){
//                 var elmtId="|"+element.elementId+"|";
//                 if($F('CS_NET_AGE').indexOf(elmtId)>-1){	
//                     isNetAge = true;
//                 }
//             }
            
// 			if((tradeTypeCode == "1060"||tradeTypeCode == "10"||tradeTypeCode == "500"||tradeTypeCode == "503")&&product.getAttribute('productMode')=="00" && !isNetAge){
// 				dtElem._startDate = Cs.ctrl.Trade.getSysDate();
// 			}
// 			//qc 33688 end
// 			//资料返档选择产品的特殊处理
// 			else if(recordOpenUserChgPro=="true" && tradeTypeCode == "12"){				
// 				dtElem._startDate = firstCallTime;			
// 			}
// 			/*else if(preStartDate!=''){
// 				//优惠预约生效时间
// 				dtElem._startDate = preStartDate;
// 			}*/
// 			//优惠绝对生效时间
// 			else if(element.enableTag == '0')
// 				dtElem._startDate = element.startAbsoluteDate>Cs.ctrl.Trade.getSysDate() ? element.startAbsoluteDate : Cs.ctrl.Trade.getSysDate();
// 			//优惠相对生效时间
// 			else
// 				dtElem._startDate = Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), element.startUnit, element.startOffset);
			
// 			//取产品与优惠生效时间的大值
// 			dtElem._startDate = dtElem._startDate>product.getAttribute('_startDate') ? dtElem._startDate : product.getAttribute('_startDate');
			
// 			//QC:98214 begin 由于开户，元素默认为立即开户，现在需要对两个特定元素进行下月生效的特殊处理
//       if(tradeTypeCode == "10" && product.getAttribute('productMode')=="00" && (element.elementId=="20010609" || element.elementId=="20010608")){				
// 			dtElem._startDate = Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), element.startUnit, element.startOffset);
// 			}
//       //QC:98214 end
      
// 			//优惠的失效时间以优惠的生效时间为计算起点
// 			//优惠绝对失效时间
// 			if(element.endEnableTag == '0'){
// 				dtElem._endDate = element.endAbsoluteDate>dtElem._startDate ? element.endAbsoluteDate : dtElem._startDate;
// 			}//优惠相对失效时间
// 			else {
// 				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._startDate, element.endUnit, element.endOffset);
// 				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._endDate, '6', -1);
// 			}
			
// 			 //guagua tfs  166678
// 			//guagua
//    			//tfs:167334 
//    			//漏话提醒需求。资费的结束时间，根据合约时间进行偏移   
// 	           if(tradeTypeCode == "10" && (element.elementId=="5990350" || element.elementId=="5990360")){				
// 				dtElem._startDate = Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), element.startUnit, element.startOffset);
// 				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._startDate, element.endUnit, element.endOffset);
// 				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._endDate, '6', -1);
// 				}
// 	           if(specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&tradeTypeCode == "120")
// 	        	   {
	        	 
// 	   			     if(element.elementId=='5990350'||element.elementId=='5990360'  )
// 	   			     {
	   			    	 
// 	   			    	dtElem._endDate = Cs.util.Utility.computeDate(specialTimeStr, element.endUnit, element.endOffset);
// 	   					dtElem._endDate = Cs.util.Utility.computeDate(dtElem._endDate, '6', -1);
// 	   			    }
// 	        	   }
// 	         //guagua end: tfs  166678
			
			
// 			//取产品与优惠失效时间的小值
// 			if(tradeTypeCode != "12"&&tradeTypeCode != "124"){
// 				dtElem._endDate = dtElem._endDate>product.getAttribute('_endDate') ? product.getAttribute('_endDate') : dtElem._endDate;	
// 			}	

// 			dtElem._endDate = dtElem._endDate.substring(0,10)+" 23:59:59";
// 		}
// 		//SP服务
// 		else if(element.elementTypeCode.toUpperCase() == "X") 
// 		{
// 			//开户,优惠默认为立即
// 			if(tradeTypeCode == "10"||tradeTypeCode == "500"||tradeTypeCode == "503")
// 			{
// 				dtElem._startDate = Cs.ctrl.Trade.getSysDate();
// 			}
// 			//资料返档选择产品的特殊处理
// 			else if(recordOpenUserChgPro=="true" && tradeTypeCode == "12")
// 			{				
// 				dtElem._startDate = firstCallTime;			
// 			}
// 			//优惠绝对生效时间
// 			else if(element.enableTag == '0')
// 				dtElem._startDate = element.startAbsoluteDate>Cs.ctrl.Trade.getSysDate() ? element.startAbsoluteDate : Cs.ctrl.Trade.getSysDate();
// 			//优惠相对生效时间
// 			else
// 				dtElem._startDate = Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), element.startUnit, element.startOffset);
			
// 			//取产品与优惠生效时间的大值
// 			dtElem._startDate = dtElem._startDate>product.getAttribute('_startDate') ? dtElem._startDate : product.getAttribute('_startDate');
			
			
// 			//优惠的失效时间以优惠的生效时间为计算起点
// 			//优惠绝对失效时间
// 			if(element.endEnableTag == '0')
// 				dtElem._endDate = element.endAbsoluteDate>dtElem._startDate ? element.endAbsoluteDate : dtElem._startDate;
// 			//优惠相对失效时间
// 			else 
// 			{
// 				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._startDate, element.endUnit, element.endOffset);
// 				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._endDate, '6', -1);
// 			}

// 			if(element.endEnableTag == '')	
// 				dtElem._endDate = "2050-12-31 23:59:59";		
			
// 			//取产品与优惠失效时间的小值
// 			if(tradeTypeCode != "12"&&tradeTypeCode != "124")
// 			{
// 				dtElem._endDate = dtElem._endDate>product.getAttribute('_endDate') ? product.getAttribute('_endDate') : dtElem._endDate;	
// 			}	
// 		}				
// 		//实物,礼品包,话费
// 		else if(allElem.include(element.elementTypeCode.toUpperCase())) 
// 		{
//     		dtElem._startDate = product.getAttribute('_startDate');
//     		dtElem._endDate = product.getAttribute('_endDate');				
// 		}
		
// 		if(element.modifyTag == '9' && product.getAttribute('modifyTag') == '0') 
// 		{
// 			//预约的生效时间
// 			if(dtElem._startDate < element.startDate) dtElem._startDate = element.startDate;
// 			//预约的失效时间
// 			//if(dtElem._endDate > element.startDate) dtElem._endDate = element.endDate;//辽宁老数据迁移导致资费不连续注释
			
// 			//qc:96011 begin老元素带过来保留老的结束时间
// 			if(dtElem._endDate > element.endDate && element.endDate > dtElem._startDate) dtElem._endDate = element.endDate;
// 			//qc:96011 end
// 		}
// 	}
// 	//用户原有元素使用原生效失效时间
// 	else {
// 		dtElem._startDate = element.startDate;
// 		//tfs:151580 begin 由于开户，服务元素默认为立即开户，现在需要对漏话提醒进行下月生效的特殊处理
// //	      if(( tradeTypeCode == "10" ||tradeTypeCode == "120"||tradeTypeCode == "440") &&  element.elementId=="52017"  ){				
// //				dtElem._startDate = Cs.util.Utility.computeDate(product.getAttribute('_startDate'), 3, 1).substring(0,10);
// //		  }
// 		 //tfs:151580  
// 		if(element.elementId=="52017" &&tradeTypeCode == "10" )
// 			{
// 			dtElem._startDate =Cs.util.Utility.computeDate(sysDate, '3', 1).substring(0,10)  ;
// 			}
		
// 		 //tfs:151580  guagua end
// 		if(recordOpenUserChgPro=="true" && tradeTypeCode == "12"&&element.modifyTag=="9"){
// 			//资料返档老产品的特殊处理
// 			dtElem._endDate = Cs.util.Utility.computeDate(firstCallTime, '6', -1);
// 		}
// 		else{
// 			dtElem._endDate = element.endDate;		
// 		}
// 		 //tfs:151580  
// 		if((element.elementId=="5990350" || element.elementId=="5990360")&&tradeTypeCode == "10" )
// 		{
// 		   dtElem._startDate =Cs.util.Utility.computeDate(sysDate, '3', 1).substring(0,10)  ;
// 		   dtElem._endDate = Cs.util.Utility.computeDate(dtElem._startDate, element.endUnit, element.endOffset);
// 		   dtElem._endDate = Cs.util.Utility.computeDate(dtElem._endDate, '6', -1);
// 		}
// 		 //tfs:151580  guagua end
			
// 	}
// 	return dtElem;
// }

// //控制产品展示 ‘+’ ‘-’ 号--miyro_lan
// closeOpen = function(elementId,closeOpeneId){
// 	console.log('+++++closeOpen+++++\n');
// 		if(elementId.visible()== true) {
//         	closeOpeneId.className = "expand";
//         	closeOpeneId.src='/images-custserv/win/open.gif';
// 	    }else {
// 	        closeOpeneId.className = "unexpand";
// 	        closeOpeneId.src='/images-custserv/win/close.gif';
// 	    } 
// 	console.log('+++++closeOpen end +++++\n');
// };
// //点击产品查明细
// queryPackageInfo = function(productId){
// 	console.log('+++++queryPackageInfo+++++\n');
//     closeOpen($("p"+productId),$("closeopen"+productId));    
// 	console.log($("p"+productId).getAttribute('first').toUpperCase());
// 	console.log('+++++queryPackageInfo -- 0 +++++\n');
// 	if($("p"+productId).getAttribute('first').toUpperCase() == 'FALSE') {
// 		$("p"+productId).toggle();	 
//         closeOpen($("p"+productId),$("closeopen"+productId));   
// 		return;
// 	}
// 	console.log('+++++queryPackageInfo -- 1 +++++\n');

// 	/**
// 	 * 根据产品标识获取包信息 返回 pkgByPId 节点(modify_tag='0')
// 	 * 根据用户标识+产品标识获取包信息 返回 pkgByPId 节点(modify_tag='1')
// 	 * 根据用户标识+产品标识获取包(用户信息与参数信息整合)信息 返回 pkgByPId 节点(modify_tag='2')
// 	 */
// 	//QC:96235 BEGIN
// 	//Cs.Ajax.swallowXmlCache("pkgByPId:"+productId, prodPage, "getPackageByPId", "productId="+productId+"&modifyTag="+$('_p'+productId).modifyTag+"&userId="+userId+"&productMode="+$('_p'+productId).productMode+"&curProductId="+curProductId+"&onlyUserInfos="+onlyUserInfos+"&productInvalid="+$('_p'+productId).productInvalid, "正在查询产品信息，请稍候......", '', noCache);
//     Cs.Ajax.swallowXmlCache("pkgByPId:"+productId, prodPage, "getPackageByPId", "productId="+productId+"&modifyTag="+$('_p'+productId).modifyTag+"&userId="+userId+"&productMode="+$('_p'+productId).productMode+"&curProductId="+curProductId+"&onlyUserInfos="+onlyUserInfos+"&productInvalid="+$('_p'+productId).productInvalid+"&tradeTypeCode="+tradeTypeCode, "正在查询产品信息，请稍候......", '', noCache);
//     //QC:96235 END
// 	console.log('+++++queryPackageInfo end+++++\n');
// };

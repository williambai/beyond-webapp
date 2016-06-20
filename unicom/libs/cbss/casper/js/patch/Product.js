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
// 		if(elementInfo.modifyTag == '9' && $('_p'+productId).modifyTag == '9') a.push(" checked");
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

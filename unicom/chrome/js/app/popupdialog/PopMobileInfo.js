var mode='-1';
var zbtablename='';
var win = new Cs.flower.Win();
//imei校验
function checkImeiInfo(obj){   	

	if(obj.value == "" || obj.lastValue == obj.value) return;
	
	mode=($("SALETYPE").parentNode.style.display=='none')?'0':'1';	
	if(mode==1)
		Cs.Ajax.register("tradeFee", dealTradeFee);			
	
	Cs.Ajax.register("tradeInfo", dealTradeInfo);
	Cs.Ajax.register("imeiFailed", dealImeiFail);
	Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","dealAfterInputImei","IMEI="+$F("IMEI")+"&CANCELIMEI="+$("IMEI").lastValue +"&PARAM="+Object.toJSON(lightAttr.getValue(null,true)));
}

function changeMonth(){
	if($F("MYTRADEINFO") =="") return;
	var info=$F("MYTRADEINFO").evalJSON();
	if(!$F("MONTHS").blank()){
		info.months=$F("MONTHS");
		$("MYTRADEINFO").value=Object.toJSON(info);
	}
	
	if(!$F("MINFEE").blank()){
		info.months=$F("MONTHS");
		$("MYTRADEINFO").value=Object.toJSON(info);		
	}
	
    if($F("MONTHS").blank()||$F("MINFEE").blank()) return;
	
    var iMonths= $F("MONTHS");
	
	info=$F("MYTRADEINFO").evalJSON();
	var fees;

    var o={};
	if(!$F("MINFEE").blank()&&$F("MINFEE").length>8){
		var len=$F("MINFEE").length;
		var minfee=$F("MINFEE").substring(8,len);
//		if(info.saletype!="0")	
			$("SALEDEPOSIT").value=iMonths*minfee;	
		info.saledeposit=$F("SALEDEPOSIT");  
		if($F("MINFEE").substring(0,8)!='00000000'){
			info.discntcode=$F("MINFEE").substring(0,8);
		}
		info.minfee=$F("MINFEE").substring(8);
	}
	if($F("FEELISTS")!=""){
    	fees = $F("FEELISTS").evalJSON();
	    for (var i=0;i<fees.length;i++)	{				
			
			//信用租机
			if(info.saletype=="0"){
//				if(!$F("MINFEE").blank()&&$F("MINFEE").length>8){							 
//					var fee=$F("MOBILESALEPRICE")-iMonths*minfee/2;				
//					$("EXTRAFEE").value=((parseFloat(fee)>0)?parseFloat(fee):0);
//					info.extrafee=$F("EXTRAFEE"); 				
//				}
				if(fees[i].FEE_MODE==1){
					fees[i].DPST_RTN_DATE=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",iMonths).substring(0,10),"1",-1).substring(0,10)+" 23:59:59"
					fees[i].MONTHS=iMonths;
				}

			}
			//预存租机
			if(info.saletype=="1"){
                //Modified by wangwy for NinXia start
                if(info.extrafeenx == "0"){
    				if(!$F("MINFEE").blank()&&$F("MINFEE").length>8){							 
    					var fee=$F("MOBILESALEPRICE")-iMonths*minfee;				
    					$("EXTRAFEE").value=((parseFloat(fee)>0)?parseFloat(fee):0);
    					info.extrafee=$F("EXTRAFEE"); 				
    				}
                }
			    //Modified by wangwy for NinXia end
				if(fees[i].FEE_MODE==2){
					fees[i].FEE =$F("SALEDEPOSIT")*100;
					fees[i].OLDFEE =$F("SALEDEPOSIT")*100;
//					fees[i].DPST_RTN_DATE=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(fees[i].START_DATE,"3",iMonths).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";
					fees[i].MONTHS=iMonths;	
				}

			}	
			//押金定制终端
			if(info.saletype=="4"){
				if(!$F("MINFEE").blank()&&$F("MINFEE").length>8){							 
					var fee=$F("MOBILESALEPRICE")-iMonths*minfee/2;				
					$("EXTRAFEE").value=((parseFloat(fee)>0)?parseFloat(fee):0);
					info.extrafee=$F("EXTRAFEE"); 				
				}
				if(fees[i].FEE_MODE==1){
					fees[i].DPST_RTN_DATE=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",iMonths).substring(0,10),"1",-1).substring(0,10)+" 23:59:59"
					fees[i].MONTHS=iMonths;
				}
				else if(fees[i].FEE_MODE==0){
					fees[i].FEE =$F("EXTRAFEE")*100;
			        fees[i].OLDFEE =$F("EXTRAFEE")*100;              
		       	}
			}
			//预存定制终端
			if(info.saletype=="5"){
				if(!$F("MINFEE").blank()&&$F("MINFEE").length>8){							 
					var fee=$F("MOBILESALEPRICE")-iMonths*minfee;				
					$("EXTRAFEE").value=((parseFloat(fee)>0)?parseFloat(fee):0);
					info.extrafee=$F("EXTRAFEE"); 				
				}				
				if(fees[i].FEE_MODE==2){
					fees[i].FEE =$F("SALEDEPOSIT")*100;
					fees[i].OLDFEE =$F("SALEDEPOSIT")*100;
//					fees[i].DPST_RTN_DATE=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(fees[i].START_DATE,"3",iMonths).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";
					fees[i].MONTHS=iMonths;	
				}
		       	else if(fees[i].FEE_MODE==0){
					if(!$F("MINFEE").blank()&&$F("MINFEE").length>8){	
						if((minfee-info.param1/100)>0)
							$("EXTRAFEE").value=$F("MOBILESALEPRICE")-(minfee-info.param1/100)*iMonths*info.param2/100;	
						else			
							$("EXTRAFEE").value=$F("MOBILESALEPRICE");
						if($("EXTRAFEE").value<0)
							$("EXTRAFEE").value=0;
						info.extrafee=$F("EXTRAFEE"); 	
						fees[i].FEE =$F("EXTRAFEE")*100;
						fees[i].OLDFEE =$F("EXTRAFEE")*100;			
					} 					             
		       	}
			}	
		}
		$("FEELISTS").value=fees.toJSON();	
	}
		
	info.months=iMonths;
	
    $("MYTRADEINFO").value=Object.toJSON(info);
    
}

//费用处理
function dealTradeFee(node){ 
	var nodes = node.childNodes;
	var fees=[];	
    for(var i=0; i<nodes.length; i++){		
        var fee = Cs.util.Utility.node2JSON(nodes[i]);
		fees.push(fee);		
    }
	$("FEELISTS").value=Cs.util.Utility.unCamelize(fees.toJSON());
}

//费用处理
function afterDealTradeFee(node){ 
	var nodes = node.childNodes;
	var fees=[];	
    for(var i=0; i<nodes.length; i++){		
        var fee = Cs.util.Utility.node2JSON(nodes[i]);
		fees.push(fee);		
    }
    myDeviceFeeList = fees.toJSON();
}

function dealImeiFail(node){
	if(mode==1){
	    Cs.flower.LookupCombo.disabled($("MINFEE"),true);
		Cs.flower.LookupCombo.disabled($("MONTHS"),true);
		//信用租机
//		if($F("SALETYPE")!="0")		
//			$("SALEDEPOSIT").disabled=true;		
	}
	$("IMEI").lastValue="";
    $A($("attrTable").getElementsByTagName("INPUT")).each(function(el){

        if (el.id!="SALETYPE"&&el.id&&el.parentNode.style.display!='none'&&!el.id.endsWith("$dspl")&&!el.id.endsWith("$lst")&&el.type!="button"){
            
            if (el.lookupComboValue=="true")
                Cs.flower.LookupCombo.setValue(el, "");
			else
				el.value="";
        }
    });	
}

function changeYuCun(){
	var info=$F("MYTRADEINFO").evalJSON();
	if(info.saletype=="2"){		
		var fees = $F("FEELISTS").evalJSON();
		info.yucunfee=$F("YUCUNFEE");
		if(fees[0].FEE_MODE==2)
		{
			fees[0].FEE=info.yucunfee*100;
			fees[0].OLDFEE =info.yucunfee*100;
		}
		$("FEELISTS").value=fees.toJSON();
	    $("MYTRADEINFO").value=Object.toJSON(info);	
	}
}
function changeSaleDeposit(){
	var info=$F("MYTRADEINFO").evalJSON();
	info.saledeposit=$F("SALEDEPOSIT");
    $("MYTRADEINFO").value=Object.toJSON(info);
	if($F("FEELISTS")!=""){
    	fees = $F("FEELISTS").evalJSON();
	    for (var i=0;i<fees.length;i++)	{			
			
			//信用租机
			if(info.saletype=="0"){
				var fee=$F("MOBILESALEPRICE")-$F("SALEDEPOSIT")/2;				
				$("EXTRAFEE").value=((parseFloat(fee)>0)?parseFloat(fee):0);
				info.extrafee=$F("EXTRAFEE"); 	
				if(fees[i].FEE_MODE==1){
//					fees[i].DPST_RTN_DATE=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",$F("MONTHS")).substring(0,10),"1",-1).substring(0,10)+" 23:59:59"
				}
				else if(fees[i].FEE_MODE==0){
					fees[i].FEE =$F("EXTRAFEE")*100;
			        fees[i].OLDFEE =$F("EXTRAFEE")*100;              
		       	}
			}
			//预存租机,积分租机
			if(info.saletype=="1"){
										 
				var fee=$F("MOBILESALEPRICE")-$F("SALEDEPOSIT");				
				$("EXTRAFEE").value=((parseFloat(fee)>0)?parseFloat(fee):0);
				info.extrafee=$F("EXTRAFEE"); 				
								
				if(fees[i].FEE_MODE==2){
					fees[i].FEE =$F("SALEDEPOSIT")*100;
					fees[i].OLDFEE =$F("SALEDEPOSIT")*100;
//					fees[i].DPST_RTN_DATE=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(fees[i].START_DATE,"3",$F("MONTHS")).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";
					fees[i].MONTHS=$F("MONTHS");	
				}
		       	else if(fees[i].FEE_MODE==0){
					fees[i].FEE =$F("EXTRAFEE")*100;
			        fees[i].OLDFEE =$F("EXTRAFEE")*100;            
		       	}
			}	
			
			//山西积分租机
			if(info.saletype=="10"){						 
				var fee=$F("MOBILESALEPRICE");			
				$("EXTRAFEE").value=((parseFloat(fee)>0)?parseFloat(fee):0);
				info.extrafee=$F("EXTRAFEE"); 				
		       	if(fees[i].FEE_MODE==0){
					fees[i].FEE =$F("EXTRAFEE")*100;
			        fees[i].OLDFEE =$F("EXTRAFEE")*100;            
		       	}
			}			
		}
		$("FEELISTS").value=fees.toJSON();	
	}
}
function dealTradeInfo(node){
	//if(mode==1){
	   // Cs.flower.LookupCombo.disabled($("MINFEE"),false);
	//	Cs.flower.LookupCombo.disabled($("MONTHS"),false);
		//信用租机
//		if($F("SALETYPE")!="0")		
//		$("SALEDEPOSIT").disabled=false;		
	//}
	//else if(mode==0)
	//	Cs.flower.LookupCombo.setValue($("MONTHS"),'24');	
	
	var other = Cs.util.Utility.node2JSON(node);
	if(lightAttr.parent !=null)
		lightAttr.setValue(other);  
	//信用租机
//	if($F("SALETYPE")=="0")		
//		$("SALEDEPOSIT").value=(other.mobilecost==undefined)?"":other.mobilecost*2;
	//if($F("AVAILSCORE")!="0"&&$F("SALETYPE")=="3")
	//	$("SCORE").disabled=false;	
  //  if($F("AVAILSCORE")!="0"&&$F("SALETYPE")=="10")
	//	$("SCORE").disabled=false;	
	if ($("MYTRADEINFO"))
		$("MYTRADEINFO").value= Object.toJSON(other);
		
	//myDeviceTradeInfo = Object.toJSON(other);
	zbtablename=other.context;
	if ($("IMEI")){
		$("IMEI").zbtablename=other.context;
		//$("SCORE").zbtablename=other.context;	
		$("IMEI").lastValue=$F("IMEI");
	}else{
		
		$("DEVICE_IMEI").zbtablename=other.context;
		//$("SCORE").zbtablename=other.context;	
		$("DEVICE_IMEI").lastValue=$F("DEVICE_IMEI");
	}
	
	//山西预存定制终端 add by xuyh@20090514 start
	/*if($F("SALETYPE")=="9"){
	   Cs.flower.LookupCombo.setValue($("MINFEE"),$F('MINFEE_DE'));
	   Cs.flower.LookupCombo.setValue($("MONTHS"),$F('MONTHS_DE'));
	   Cs.flower.LookupCombo.disabled($("SALETYPE"),true);
	   Cs.flower.LookupCombo.disabled($("MONTHS"),true);
	   Cs.flower.LookupCombo.disabled($("MINFEE"),true);
	   var factFee=parseFloat($F('ALLOWANCE_DE'))-parseFloat($F("MOBILESALEPRICE"));
	   if(factFee<0){
			$('FACT_DE').value=$F('ALLOWANCE_DE');	   		
	   }else{
	   		$('FACT_DE').value=$F("MOBILESALEPRICE");	
	   } 
	   var info=$F("MYTRADEINFO").evalJSON();
	   info.factde=$F('FACT_DE');
	   $("MYTRADEINFO").value=Object.toJSON(info);
	}	*/
	//add by xuyh@20090514  end
	
	//山西积分定制终端 add by xuyh@20090519 start
	/*if($F("SALETYPE")=="10"){
	   Cs.flower.LookupCombo.setValue($("MINFEE"),$F('MINFEE_DE'));
	   Cs.flower.LookupCombo.setValue($("MONTHS"),$F('MONTHS_DE'));
	   Cs.flower.LookupCombo.disabled($("SALETYPE"),true);
	   Cs.flower.LookupCombo.disabled($("MONTHS"),true);
	   Cs.flower.LookupCombo.disabled($("MINFEE"),true);
	}	*/
	//add by xuyh@20090519  end
}

function dealAllInfo(node){
	var other = Cs.util.Utility.node2JSON(node);
	if ($("ASSURE_FROGITFEE") && typeof(other.frogitfee) != 'undefined')
		$("ASSURE_FROGITFEE").value =other.frogitfee;
			
	myDeviceAllInfo = Object.toJSON(other);
	
}

function scoreChg(obj){	
	var availScore=parseInt(lightAttr.getElementById("AVAILSCORE").value);
	var fees = lightAttr.getElementById("FEELISTS").value.evalJSON();
	var info = lightAttr.getElementById("MYTRADEINFO").value.evalJSON();
	var rule = info.intscore/info.rewardlimit/100;//积分与现金折算比列
	if($F('SALETYPE')=='10'){
		if(availScore<$F('SCORE_LIMIT')){
			var win = new Cs.flower.Win();
			win.alert($F('SCORE_LIMIT')+"起兑！");
			obj.value=obj.lastValue;
			return ;
		}
		if((parseInt(obj.value))%1000!=0){
			var win = new Cs.flower.Win();
			win.alert("积分购机积分必须为1000的倍数！");
			obj.value=obj.lastValue;
			return ;
		}
		if((parseInt(obj.value))>(($F('MOBILESALEPRICE'))/rule)){
			var win = new Cs.flower.Win();
			win.alert("兑换积分不能超过手机销售价格！");
			obj.value=obj.lastValue;
			return ;
		}
		if(parseInt(obj.value)>availScore){
		var win = new Cs.flower.Win();
		win.alert("兑换积分不能超过"+availScore+"分！",function(){
			obj.value=obj.lastValue;		
		});		
	}
	else{
		var money = (parseInt(obj.value==""?0:obj.value) - parseInt((obj.lastValue=="")?0:obj.lastValue))*rule;
		obj.lastValue=obj.value;
		info.extrafee-=money;	
		info.scorechg=obj.value;
		info.availscore=availScore;
		//积分兑换金额
		info.scoremoney=money;
		lightAttr.getElementById("MYTRADEINFO").value=Object.toJSON(info);	
		lightAttr.getElementById("EXTRAFEE").value=info.extrafee;		
	}	
	}else{
		if(parseInt(obj.value)>availScore){
		var win = new Cs.flower.Win();
		win.alert("兑换积分不能超过"+availScore+"分！",function(){
			obj.focus();
			obj.value="";			
			var money = (parseInt(obj.value==""?0:obj.value) - parseInt((obj.lastValue=="")?0:obj.lastValue))*rule;			
			for (var i=0;i<fees.length;i++){				
				if(fees[i].FEE_MODE==0)	{
					fees[i].FEE -=money*100;
					fees[i].OLDFEE -=money*100;
				}
			}
			obj.lastValue=obj.value;
			lightAttr.getElementById("FEELISTS").value=Object.toJSON(fees);	
	
			info.salempfee-=money;
			info.scorechg=obj.value;
			info.availscore=availScore;
			//积分兑换金额
			info.scoremoney=money*100;
			lightAttr.getElementById("MYTRADEINFO").value=Object.toJSON(info);	
			lightAttr.getElementById("EXTRAFEE").value-=money;				
		});		
	}
	else{
		var money = (parseInt(obj.value==""?0:obj.value) - parseInt((obj.lastValue=="")?0:obj.lastValue))*rule;
		for (var i=0;i<fees.length;i++)	{
			if(fees[i].FEE_MODE==0)	{
				fees[i].FEE -=money*100;
				fees[i].OLDFEE -=money*100;
			}
		}
		obj.lastValue=obj.value;
		lightAttr.getElementById("FEELISTS").value=Object.toJSON(fees);	
		
		info.extrafee-=money;	
		info.scorechg=obj.value;
		info.availscore=availScore;
		//积分兑换金额
		info.scoremoney=money*100;
		lightAttr.getElementById("MYTRADEINFO").value=Object.toJSON(info);	
		lightAttr.getElementById("EXTRAFEE").value=info.extrafee;		
	}
	}		
}

function changeSaleType(){	
  
	$("IMEI").disabled=false;
		
	if($F("SALETYPE")=="3"||$F("SALETYPE")=="4"||$F("SALETYPE")=="5"||$F("SALETYPE")=="1"){
		$("MINFEE$dspl").required = 'true';
		$("SALEDEPOSIT").disabled= true;
		Cs.ctrl.Validate.showMustFillTag($('attrTable'));
	}
	else{
		$("MINFEE$dspl").required = 'false';
		$("SALEDEPOSIT").disabled= false;
		Cs.ctrl.Validate.showMustFillTag($('attrTable'));
	}
    $A($("attrTable").getElementsByTagName("INPUT")).each(function(el){

        if (el.id!="SALETYPE"&&el.id&&el.parentNode.style.display!='none'&&!el.id.endsWith("$dspl")&&!el.id.endsWith("$lst")&&el.type!="button"){
            
            if (el.lookupComboValue=="true")
                Cs.flower.LookupCombo.setValue(el, "");
			else
				el.value="";
        }
    });	
	
}

function validImei(obj){
	Cs.Ajax.swallowXml("",cancelquery,"myTradeInfo="+$F("myTradeInfo"));
	return false;
}

function doAttrValidate(){
	if(!$("IMEI")) return;
	$("IMEI").zbtablename=zbtablename;
		$A(document.getElementsByName('_productinfos')).each(function(prod) {
		if(prod.checked) {				
			$A($('p'+prod.productId).all).each(function(elem) {
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
							&& elem._thisType != 'undefined' && elem._thisType.toUpperCase() == 'ELEMENT'&&elem.elementTypeCode.toUpperCase() == 'C'){
					//if($("MOBILESALEPRICE").value=="")	
						//throw new Error("imei号未检验前，不能点击确定按钮！");
						
					/*if($("MINFEE").value==""&&$("SALEDEPOSIT").value=="")
						throw new Error("月最低消费或消费总额不能同时为空！");
					
				    //add by xuyh@20090519 start  山西判断规则
					if ($('SX_RULE_TAG')&&$F('SX_RULE_TAG') != '1') {
						if(parseInt($("SALEDEPOSIT").value)<parseInt($("MOBILECOST").value))
						throw new Error("消费总额不能小于手机成本！");
					}*/
					//add by xuyh@20090519 end
					
					/*if($("MINFEE").value!=""){
						var len=$F("MINFEE").length;
						var minfee=$F("MINFEE").substring(8,len);
						if(parseInt($F("MONTHS"))*parseInt(minfee)!=parseInt($("SALEDEPOSIT").value))
							throw new Error("请输入正确的协议消费金额！");
					}	*/
					
					/*if (myDeviceTradeInfo !=""){
						Cs.Ajax.register("tradeFee", afterDealTradeFee);		
						myDeviceFeeList ="";	
						Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","dealTradeFee","&PARAM="+Object.toJSON(lightAttr.getValue(null,true)));
					}	*/				

				}
			});
			
		}
	});
}

function doAttrCancel(){	
	
	$A(document.getElementsByName('_productinfos')).each(function(prod) {					
		$A($('p'+prod.productId).all).each(function(elem) {
			if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
						&& elem._thisType != 'undefined' && elem._thisType.toUpperCase() == 'ELEMENT'&&elem.elementTypeCode.toUpperCase() == 'C'){
				    
					if (elem.itemObjNew != 'undefined' && elem.itemObjNew != null) {
						elem.itemObj.mytradeinfo = $("MYTRADEINFO").value;
					}
					
			}
		});		
	});	
}

function doAttrOK(){
	if($("MYTRADEINFO")){
	$A(document.getElementsByName('_productinfos')).each(function(prod) {					
		$A($('p'+prod.productId).all).each(function(elem) {
			if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
						&& elem._thisType != 'undefined' && elem._thisType.toUpperCase() == 'ELEMENT'&&elem.elementTypeCode.toUpperCase() == 'C'){
				    
					if (elem.itemObjNew != 'undefined' && elem.itemObjNew != null) {
						elem.itemObj.mytradeinfo = $("MYTRADEINFO").value;
						elem.itemObjNew.mytradeinfo = $("MYTRADEINFO").value;
					}
					
			}
		});		
	});	
	}
}

function initAttrInfo(elm){
     if($("GIFT_CODE"))
     	$("GIFT_CODE").value = elm.spId;
}

function checkEssGiftCode(giftCode,giftNum){
	
	Cs.Ajax.register("giftCheckTradeInfo", afterCheckGiftInfo);
	Cs.Ajax.register("giftCheckFailed",failCheckGiftInfo);
	var params = "giftCode="+giftCode+"&giftNum="+giftNum+"&selectTypeStr="+selectTypeStr;
	Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","checkEssGiftCode",params);
}

function afterCheckGiftInfo(node){
	var other = Cs.util.Utility.node2JSON(node);    
	lightAttr.setValue(other);
}
function failCheckGiftInfo(node){
	if($("GIFT_NUM"))
     	$("GIFT_NUM").value ="";
}

var prodSpecId;
var anTypeCd;
var l3address = "";//L3地址
var v5id = "" ;//V5ID
var moduleNo = "";//模块号
var deviceNo = "";//设备号
var onuPortId = "";//接入点端子号
var onuUserKind ;//是否为V5用户
var tabsetGroup ;
var tabGType;//群类型
var tabGInfo;//群组
var tabGMemb;//群组成员 
var membBInfo;//保存群组信息
var lightGItem = new Cs.flower.Light(); 
var resNbr = "-1" ;//逻辑号码

//added by zhoubl
//查询主号码或虚拟号码信息成功
function afterQueryMainSerialNumber(node)
{
   if (node.nodeName == "checkOK") {
    var obj = Cs.util.Utility.node2JSON(node.firstChild);
    if(obj.iswomainnumber=='1'){
      Cs.flower.LookupCombo.setValue($(Cs.ctrl.Web.$P("isMainSerialNumber").valueId), "1");
    }
    else if(obj.iswomainnumber=='0'){
      Cs.flower.LookupCombo.setValue($(Cs.ctrl.Web.$P("isMainSerialNumber").valueId), "0");
    }
    else{
      Cs.flower.LookupCombo.setValue($(Cs.ctrl.Web.$P("isMainSerialNumber").valueId), "2");
    }
    Cs.ctrl.Web.$P("PRODUCT_NAME_WO").value=obj.productnamewo;

    var productIdWo=obj.productidwo;
    callBackWOX(node);
  }
}
//查询主号码或虚拟号码信息失败
function afterQueryFailed(node)
{
   $("MAIN_NBR").value = '';
}
//沃享查询回调
function callBackWOX(node)
{
	
  var obj = Cs.util.Utility.node2JSON(node.firstChild);
  
  var serialNumberAWo=obj.serialnumberawo; 
  var userIdAWo=obj.useridawo; 
  var relationTypeCodeWo=obj.relationtypecodewo;
  var acctidawo=obj.acctidawo;
  var custidawo=obj.custidawo;
  var flagChgCust=obj.flagchgcust;
  var flagChgAcct=obj.flagchgacct;
  var roleCodeAWo=obj.rolecodeawo;
  var roleCodeBWo=obj.rolecodebwo;

  var producttypecodewo=obj.producttypecodewo;
  var nettypecodewo=obj.nettypecodewo;
  var prepaytagwo=obj.prepaytagwo;
  


  //所有能查产品的地方都disabled掉
  var _all_infos = $F('_all_infos').evalJSON(true);
  _all_infos.USER_ID_A_WO=userIdAWo;  
  _all_infos.SERIAL_NUMBER_A_WO=serialNumberAWo;  
  _all_infos.RELATION_TYPE_CODE_WO=relationTypeCodeWo;  
  _all_infos.ACCT_ID_WO=acctidawo;  
  _all_infos.CUST_ID_WO=custidawo; 
  _all_infos.flagChgCust=flagChgCust;  
  _all_infos.flagChgAcct=flagChgAcct;  
  _all_infos.roleCodeAWo=roleCodeAWo;  
  _all_infos.roleCodeBWo=roleCodeBWo;  
  
  _all_infos.PRODUCT_TYPE_CODE_WO=producttypecodewo;  
  _all_infos.NET_TYPE_CODE_WO=nettypecodewo;  
  _all_infos.PREPAY_TAG_WO=prepaytagwo;  
  
  
  $('_all_infos').value=Object.toJSON(_all_infos);

  if(getRightCode() == "csCreateUserJoinWO" || "csCreateWilePerUserTrade4G"==getRightCode()|| "csCreateWilePerUserJoinWO"==getRightCode()){
  	ShowWOXProduct(node);    	
  	changeAcctInfo(node);
  }
  if(getRightCode() == "csExistUserJoinWO"){
		var _infos = $F('_infos').evalJSON(true);	
		if(_infos.userId != undefined) userId = _infos.userId;
		if(_infos.productId != undefined) curProductId = _infos.productId;
		if(_infos.productTypeCode != undefined) productTypeCode = _infos.productTypeCode;
		if(_infos.productChgFlg != undefined) productChgFlg = _infos.productChgFlg;
		if(_infos.grpId != undefined) userGrpId = _infos.grpId;
		//传过来沃享的产品ID,可以通过node结点取
		var obj = Cs.util.Utility.node2JSON(node.firstChild);
		var WOXproductId=obj.productidwo; 

		var productChgFlg='-50';
		getProductInfoByTypeTransWO(productTypeCode, productChgFlg,curProductId,userGrpId,WOXproductId);
  }	
  if(getRightCode() == "csChangeProductWO"){
	  	var _infos = $F('_infos').evalJSON(true);	
		if(_infos.userId != undefined) userId = _infos.userId;
		if(_infos.productId != undefined) curProductId = _infos.productId;
		if(_infos.productTypeCode != undefined) productTypeCode = _infos.productTypeCode;
		if(_infos.productChgFlg != undefined) productChgFlg = _infos.productChgFlg;
		if(_infos.grpId != undefined) userGrpId = _infos.grpId;
		//传过来沃享的产品ID,可以通过node结点取
		var obj = Cs.util.Utility.node2JSON(node.firstChild);
		var WOXproductId=obj.productidwo; 
		
		//多一步回写活动选择，电信类型选择，付费类型选择的过程。
		var productTypeCodeWo=obj.producttypecodewo; 
		var netTypeCodeWo=obj.nettypecodewo; 
		var prepayTagWo=obj.prepaytagwo; 		
		
//		$Z('PRODUCT_TYPE_CODE',9,'PRODUCT_TYPE_NAME:PRODUCT_TYPE_CODE|PRODUCT_TYPE_CODE:'+productTypeCodeWo,'PRODUCT_TYPE_NAME|PRODUCT_TYPE_CODE|PRODUCT_TYPE_NAME,PRODUCT_TYPE_CODE','','',false,null,true);
//		$Z('PRODUCT_TYPE_CODE',9,'PRODUCT_TYPE_NAME:PRODUCT_TYPE_CODE|沃享活动:'+productTypeCodeWo,'PRODUCT_TYPE_NAME|PRODUCT_TYPE_CODE|PRODUCT_TYPE_NAME,PRODUCT_TYPE_CODE');		
		$Z('PRODUCT_TYPE_CODE',9,'PRODUCT_TYPE_NAME:PRODUCT_TYPE_CODE|沃享活动:'+productTypeCodeWo,'PRODUCT_TYPE_NAME|PRODUCT_TYPE_CODE|PRODUCT_TYPE_NAME,PRODUCT_TYPE_CODE','','',false,null,true);		
		Cs.flower.LookupCombo.setValue($('PRODUCT_TYPE_CODE'),productTypeCodeWo);
		Cs.flower.LookupCombo.setValue($('F_NET_TYPE_CODE'),netTypeCodeWo);
		Cs.flower.LookupCombo.setValue($('F_PREPAY_TAG'),prepayTagWo);
//	    Cs.flower.LookupCombo.setValue($(Cs.ctrl.Web.$P("isMainSerialNumber").valueId), "1");
		allDisabled = false;
		onlyUserInfos = '0';
		var productChgFlg='-52';
		getProductInfoByTypeTransWO(productTypeCodeWo, productChgFlg,curProductId,userGrpId,WOXproductId);
		
  }
  
}
function getProductInfoByTypeTransWO(prodTypeA, prodTypeB,productId,groupId,woProductId){ 
	//返回prodInfoByType节点
	Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, "common.product.ProductHelper", "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo)+"&productId="+productId+"&woProductId="+woProductId, '','', noCache);
}
//刷沃享产品
function ShowWOXProduct(node){
    var obj = Cs.util.Utility.node2JSON(node.firstChild);
	var WOXproductId=obj.productidwo; 
	//所有能查产品的地方都disabled掉
	var _all_infos = $F('_all_infos').evalJSON(true);
	_all_infos.PRODUCT_ID_WO=WOXproductId;  
	$('_all_infos').value=Object.toJSON(_all_infos);
	WOXproductId = $F("_all_infos").evalJSON().PRODUCT_ID_WO;
	$A(document.getElementsByName("prodType")).find(function(element){
		element.checked=false;
	});
	$A(document.getElementsByName("brand")).find(function(element){
		element.checked=false;
	});
	var params = "&productIdWo="+WOXproductId;
	
	Cs.Ajax.direct("getProductInfoByIdWOX",params,"ProductListTable", "", "");
}
//added by zhoubl end
//----------------------------------------------------------贵州固网(sunjl)--------------------------------------------------------------
function showInfoByEmailType(){
	var a = $("EMAIL_TYPE").value;
	if(a=="2"){
		$("FLOWER_NUMBER").disabled=false;
		$("USER_NUMBER").disabled=false;
		$("FLOWER_NUMBER").required="true";
		$("USER_NUMBER").required="true";
	}else{
		$("FLOWER_NUMBER").disabled=true;
		$("USER_NUMBER").disabled=true;
		$("FLOWER_NUMBER").required="false";
		$("USER_NUMBER").required="false";
	}
	Cs.ctrl.Validate.showMustFillTag();
}
function showPrePayTag(obj){
	var netTypeCode = $F("NET_TYPE_CODE");
	//获取不同网别,活动下对应的预付/后付类型
	if($F("FIXED_NET_CODE_GZ").indexOf(netTypeCode)!=-1){	
		$("USER_KIND$dspl").required="true";
		$("DEPART_ID$dspl").required="true";
		Cs.ctrl.Validate.showMustFillTag();	
		$("prePayTagInfo").style.display="";
		Cs.Ajax.register("prepayTagByNetType", obtPrepayTag);	
		var params = "netTypeCode="+netTypeCode+"&productTypeCode="+obj.value;
		Cs.Ajax.swallowXml("", "getPrePayTagInfoByType",params);
	}else{
		$("USER_KIND$dspl").required="false";
		$("DEPART_ID$dspl").required="false";
		Cs.flower.LookupCombo.setValue($("USER_KIND"), '');
		Cs.flower.LookupCombo.setValue($("DEPART_ID"), '');
		Cs.ctrl.Validate.showMustFillTag();
		$("prePayTagInfo").style.display="none";
	}
}
function obtPrepayTag(node){
	$("USER_KIND$lst").value = node.xml;
	$("USER_KIND$dspl").valueCode = 'PARACODE';
	$("USER_KIND$dspl").labelCode = 'PARANAME';
	$("USER_KIND$dspl").titleCodes = 'PARANAME,PARACODE';
	Cs.flower.LookupCombo.update($("USER_KIND"));
	Cs.flower.LookupCombo.setValue($("USER_KIND"), '');
}
function initPreCreateDate(){
	if($("PRECREATE_DATE"))
		$("PRECREATE_DATE").value=Cs.ctrl.Trade.getSysDate();   //设定服务开通的预约时间为当前
	if($("START_DATE"))
		$("START_DATE").value=Cs.ctrl.Trade.getSysDate().substr(0,10);   //设定服务开通的预约时间为当前
    if($("CONTRACT_START_DATE"))
        $("CONTRACT_START_DATE").value=Cs.ctrl.Trade.getSysDate().substr(0,10);    
}
function checkpreDate(){
	if($("PRECREATE_DATE").value.substr(0,10)<Cs.ctrl.Trade.getSysDate().substr(0,10)){
		win.alert("预约服务时间不能小于当前系统时间！");
		$("PRECREATE_DATE").value=Cs.ctrl.Trade.getSysDate();
	}
}
function checkStartDate(){
	if($("START_DATE").value.substr(0,10)<Cs.ctrl.Trade.getSysDate().substr(0,10)){
		win.alert("开通日期不能小于当前系统日期！");
		$("START_DATE").value=Cs.ctrl.Trade.getSysDate().substr(0,10);
	}
}
function showInstallInfoByInsType(){
	var a = $("INSTALL_TYPE").value;
	if(a=="1"){
		if($("DATE_TYPE")){
			Cs.flower.LookupCombo.disabled( Cs.ctrl.Web.$P('DATE_TYPE'),false);
		}
		if($("DATE_SERIAL_NUMBER")){
			Cs.ctrl.Web.$P("DATE_SERIAL_NUMBER").disabled=false;
		}
	}else{
		if($("DATE_TYPE")){
			Cs.flower.LookupCombo.disabled( Cs.ctrl.Web.$P('DATE_TYPE'),true);
		}
		if($("DATE_SERIAL_NUMBER")){
			Cs.ctrl.Web.$P("DATE_SERIAL_NUMBER").disabled=true;
		}
	}
}
function checkTualGroupId(){
	if($("TUAL_GROUP_ID").value==""){
		win.alert("请选择要加入的群！",function(){$("shortGroupNumber").value="";$("TUAL_GROUP_ID$dspl").focus()});	
		return ;
	}
	var svcTag = false;
	var netTypeCode = baseProduct.netTypeCode;
	var groupServiceId = "";
	if(netTypeCode=="30"){
		groupServiceId = "30076";
	}
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
					}
				}
			});
		}
	});
    if(!svcTag){
   		win.alert("请选择相应的附加服务包下的VPN！",function(){$("shortGroupNumber").value="";$("Previous").click();});
   		return false;
    }
	/*
	if(netTypeCode=="30"){
		if(trim($("shortGroupNumber").value).substr(0,1)!="9"){
			win.alert("请以[9]前缀开头！",function(){$("shortGroupNumber").value="9"+$('serialNumber').value.slice(-3);checkVpn();});
			return;
		}
	}
	*/
	var fmprod = $("TUAL_GROUP_ID$dspl").rowselected.cells;
    var titleCode = split2Json($('TUAL_GROUP_ID$dspl').titleCodes);
    var userId = fmprod[titleCode.USER_ID].innerText;
    var headNumber = fmprod[titleCode.HEAD_NUMBER].innerText;
    var lenLimit = fmprod[titleCode.LEN_LIMIT].innerText;
    if(lenLimit!=-1 && trim($("shortGroupNumber").value).length!=lenLimit){
		win.alert("短号位数必须为"+lenLimit+"位！",function(){$("shortGroupNumber").value="";});
		return;
	}
	if(headNumber!=-1 && trim($("shortGroupNumber").value).substr(0,headNumber.length)!=headNumber){
		win.alert("短号请以["+headNumber+"]前缀开头！",function(){$("shortGroupNumber").value="";});
		return;
	}
	checkVpn();
}
function checkVpn(){
	//对短号的检验
	Cs.Ajax.register("checkShortNumber", obtCheckShortNumber);	
	var params = "USER_ID_A="+userId+"&relationTypeCode=67&shortCode="+$("shortGroupNumber").value;
	Cs.Ajax.swallowXml("", "checkShortNumber",params,"正在对短号进行检验，请稍候...");
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
function changeGroup(){
	//获取不同的群内容
	Cs.Ajax.register("changeGroupInfo", obtChangeGroupInfo);	
	var params = "relationTypeCode=67";
	Cs.Ajax.swallowXml("", "getChangeGroupInfo",params);	
}

function obtChangeGroupInfo(node){
	$("shortGroupNumber").value="";
	$("TUAL_GROUP_ID$lst").value = node.xml;
	$("TUAL_GROUP_ID$dspl").valueCode = 'SERIAL_NUMBER';
	$("TUAL_GROUP_ID$dspl").labelCode = 'GROUP_NAME';
	$("TUAL_GROUP_ID$dspl").titleCodes = 'GROUP_NAME,SERIAL_NUMBER,USER_ID,HEAD_NUMBER,LEN_LIMIT';
	Cs.flower.LookupCombo.update($("TUAL_GROUP_ID"));
	Cs.flower.LookupCombo.setValue($("TUAL_GROUP_ID"), '');
}
function changeTualGroupId(){
	$("shortGroupNumber").value="";
}	
//选号
function getSn() {
	if($("INTERFACE_ID") && $("INTERFACE_ID").value ==""){
		win.alert("请先选择对应的接入点！");
		return;
	}
	if($("MOFFICE_ID") && $("MOFFICE_ID").value ==""){
		win.alert("请先选择局向！");
		return;
	}
	var netTypeCode = baseProduct.netTypeCode;
	var onuId = "";
	var mofficeId = "";
	if($("INTERFACE_ID")){
		var array = (Cs.ctrl.Web.$P("INTERFACE_ID").value).split("|");
		onuId = array[1];
	}
	openInfo.netTypeCode = netTypeCode ;
	if($("MOFFICE_ID")){
		mofficeId = $("MOFFICE_ID").value;
	}
	
	var result =  popupDialog("popupdialog.ChoiceProjectSN","init","&INTERFACE_ID="+onuId+"&MOFFICE_ID="+mofficeId+"&NET_TYPE_CODE="+netTypeCode+"&ONU_USER_KIND="+onuUserKind,"选号屏","650","395");
    if(result && result.serialNumber && !result.serialNumber.blank()){
        $('serialNumber').value = result.serialNumber;
        onuPortId = result.onuPortId;
        $('switchId').value = result.switchId;
        if(result.subscribeId != undefined && result.subscribeId !=""){
        	$("subForBat").value=result.subscribeId;
        	if(netTypeCode=="30"){
        		moduleNo = result.moduleNo;
				deviceNo = result.deviceNo;
				v5id = result.v5id;
				l3address = result.l3address;
        	}
	        $("serialNumber").insertAdjacentHTML("afterEnd","如果批量开户此处只显示列表选中的第一个号码！");
	        openInfo.snInfo = {};
			openInfo.cardInfo = {};
        }else{
			if(netTypeCode=="30"){
				Cs.Ajax.register("getOnuPortInfo", getOnuPortInfo);
				Cs.Ajax.swallowXml("","getOnuPortInfo", "serialNumber="+result.serialNumber+"&OnuId="+onuId);
			}
        	if($("subForBat")) $("subForBat").value="";
	        newSerialNumberExit_GZ($('serialNumber'));
        }
    }
}
//甘肃选号
function getSnGS() {
	
	var netTypeCode = baseProduct.netTypeCode;
	var	onuId = "";
	var mofficeId = "";

	openInfo.netTypeCode = netTypeCode ;
	if($("MOFFICE_ID") && $("MOFFICE_ID").value ==""){
		win.alert("请先选择局向！");
		return;
	}
	if($("MOFFICE_ID")){
		mofficeId = $("MOFFICE_ID").value;
	}

	var result =  popupDialog("popupdialog.ChoiceProjectSN","init","&INTERFACE_ID="+onuId+"&MOFFICE_ID="+$("MOFFICE_ID").value+"&NET_TYPE_CODE="+netTypeCode,"选号屏","650","395");
    if(result && result.serialNumber && !result.serialNumber.blank()){
        $('serialNumber').value = result.serialNumber;
        onuPortId = result.onuPortId;
        if(result.subscribeId != undefined && result.subscribeId !=""){
        	$("subForBat").value=result.subscribeId;
	        $("serialNumber").insertAdjacentHTML("afterEnd","如果批量开户此处只显示列表选中的第一个号码！");
        }else{
			if(netTypeCode=="30"){
				Cs.Ajax.register("getOnuPortInfo", getOnuPortInfo);
				Cs.Ajax.swallowXml("","getOnuPortInfo", "serialNumber="+result.serialNumber+"&OnuId="+onuId);
			}
        	$("subForBat").value="";
			newSerialNumberExit_GZ($('serialNumber'));
        }
    }
}

function getOnuPortInfo(node){
	if(!node.hasChildNodes()){
		win.alert("获取接入点端子号信息无记录！");
		return;
	}
	var retInfo = Cs.util.Utility.node2JSON(node.firstChild);
	l3address = retInfo.l3address;
	v5id = retInfo.v5id ;
	moduleNo = retInfo.moduleNo;
	deviceNo = retInfo.deviceNo;
}
//获取接入点
function getOnuInfo(){
	var netTypeCode = baseProduct.netTypeCode;
	var result =  popupDialog("popupdialog.ChoiceOnu","init","&NET_TYPE_CODE="+netTypeCode,"接入点信息","650","350");
    if(result && result.onuName && !result.onuName.blank())
    {
        Cs.ctrl.Web.$P("INTERFACE_ID").value = result.onuName+"|"+result.onuId;
        onuUserKind = result.onuUserKind;
    }
}
//获取智能网卡号
function getCardInfo(){
 	Cs.Ajax.register("afterCardSn", afterCardSn);
	Cs.Ajax.register("getCardInfo", doCardInfo);
	Cs.Ajax.swallowXml("","getCardInfo", "netTypeCode="+baseProduct.netTypeCode+"&brandCode="+baseProduct.brandCode,"正在获取智能网卡号，请稍候...");
}
function doCardInfo(node){
	var retInfo = Cs.util.Utility.node2JSON(node.firstChild);
	Cs.ctrl.Web.$P('CARD_NUMBER').value = retInfo.serialNumber;
}
function afterCardSn(node){
	Cs.ctrl.Web.$P('CARD_NUMBER').value = "";
}
//获取物理号码(NGN)
function getPhysicalNumber(){
	if($("INTERFACE_ID") && $("INTERFACE_ID").value ==""){
		win.alert("请先选择对应的接入点！");
		return;
	}
	if($('serialNumber').value==""){
		win.alert("请先选择对应的业务号码！");
		return;
	}
	var array = (Cs.ctrl.Web.$P("INTERFACE_ID").value).split("|");
	var	onuId = array[1];
 	Cs.Ajax.register("afterPhysicalNumber", afterPhysicalNumber);
	Cs.Ajax.register("getPhysicalNumber", doPhysicalNumber);
	Cs.Ajax.swallowXml("","getPhysicalNumber", "netTypeCode="+baseProduct.netTypeCode+"&INTERFACE_ID="+onuId+"&serial_number="+$('serialNumber').value,"正在获取物理号码，请稍候...");
}
function doPhysicalNumber(node){
	var retInfo = Cs.util.Utility.node2JSON(node.firstChild);
	if($('serialNumber').value != retInfo.serialNumber){
		win.alert("注意：获取的物理号码与业务号码不一致！");
	}
	Cs.ctrl.Web.$P('PHYSICAL_NUMBER').value = retInfo.serialNumber;
}
function afterPhysicalNumber(node){
	Cs.ctrl.Web.$P('PHYSICAL_NUMBER').value = "";
}
//自动生产业务标识号
/*
function getBusinessNumber() {
	var productTypeCode = $('guideArea').prodType;
	openInfo.netTypeCode = baseProduct.netTypeCode;
	var netTypeCode = openInfo.netTypeCode;
	var o={};//没具体用处，为后面登记发展人相关信息用
	o.netTypeCode =  openInfo.netTypeCode ;
	o.serialNumber = $("serialNumber").value;
	openInfo.snInfo = o;
	openInfo.cardInfo = {};
	
	var pstnSerNumber = "";
	if(netTypeCode=="83"){
		var installType = $("INSTALL_TYPE_2").value; 
		if(installType=="1"){
			$('PSTN_SERIAL_NUMBER').required="true";
			Cs.ctrl.Validate.showMustFillTag();
			if($("PSTN_SERIAL_NUMBER").value==""){
				win.alert("请输入加装到PSTN的电话号码！",function(){$("PSTN_SERIAL_NUMBER").focus()});
				return;
			}else{
				pstnSerNumber = $("PSTN_SERIAL_NUMBER").value;
			}
		}else{
			$('PSTN_SERIAL_NUMBER').required="false";
			pstnSerNumber = "";
			$("PSTN_SERIAL_NUMBER").value = pstnSerNumber;
			Cs.ctrl.Validate.showMustFillTag();
		}
	}
	Cs.Ajax.register("getBusinessNumber", obtGetBusinessNumber);	
	var params = "netTypeCode=" + netTypeCode+"&productTypeCode="+productTypeCode+"&pstnSerNumber="+pstnSerNumber;
	Cs.Ajax.swallowXml("", "getBusinessNumber",params);
}

function obtGetBusinessNumber(node){
	var retInfo = Cs.util.Utility.node2JSON(node);
	var editRule = retInfo.editRule; //检验规则   A为手工不带地州带值  C为手工带地州的值 D为空 B为（区号+数字）序列
	var editValue = retInfo.editValue; //返回值
	//var lenLimit = retInfo.lenLimit||"-1"; //返回长度 
	if(editRule=="A" || editRule=="C"){
		$("serialNumber").value=editValue;	
		$("serialNumber").disabled=false;
		$("chosenum").disabled=true;
	}else{
		if($("chosenum")){
			$("chosenum").disabled=false;
		}
		$("serialNumber").value=editValue;	
	}
}*/
function showFixtureInfo(obj){
	if(obj=="0"){
		if($("FIXTURE")){
			Cs.flower.LookupCombo.setValue($("FIXTURE"), '0');
			Cs.flower.LookupCombo.disabled( Cs.ctrl.Web.$P('FIXTURE'),true);
		}
	}else{
		Cs.flower.LookupCombo.disabled( Cs.ctrl.Web.$P('FIXTURE'),false);
	}
}

//号码不正确时处理
function dealWhenPhoneImeiErr(){
	$("IMEI").clear();
}
function checkTelecom(obj){
	//所属运营商
	var telecom = $("TELECOM_CARRIER").value;
	//设备类型
	var fixture = $("FIXTURE").value;
	var serialNumber = $("serialNumber").value;
	if(telecom ==""){
		win.alert("请先选择所属运营商！");
		$("serialNumber").value = "";
		return false;
	}
	if(fixture ==""){
		win.alert("请先选择设备类型！");
		$("serialNumber").value = "";
		return false;
	}
	if(serialNumber.length!=11){
		win.alert("业务号码必须为11位！");
		$("serialNumber").value = "";
		return false;
	}
	if(telecom=="0"){//中国联通
		if(serialNumber.substr(0,4) != $('pagecontext').epachyId){
			win.alert("业务号码请以["+$('pagecontext').epachyId+"]前缀开头！",function(){$("serialNumber").value=$('pagecontext').epachyId});
			return false;
		}
	}else{//中国移动、中国电信
		if(fixture =="0"){//固定电话
			if(serialNumber.substr(0,4) != $('pagecontext').epachyId){
				win.alert("业务号码请以["+$('pagecontext').epachyId+"]前缀开头！",function(){$("serialNumber").value=$('pagecontext').epachyId});
				return false;
			}
		}else{
			if(serialNumber.substr(0,2) != "13" && serialNumber.substr(0,2) != "15"){
				win.alert("请输入正确的手机号码！",function(){$("serialNumber").value=""});
				return false;
			}
		}
	}
	newSerialNumberExit_GZ(obj);
}
//输入新号码后事件(固网)
function newSerialNumberExit_GZ(obj){
	if (obj.value.blank()||obj.value==obj.lastvalue) return;
	if(obj.checkResType == "1" ){//只校验号码是否在主表有正常在用用户,主要针对(A为手工不带地州带值,C为手工带地州的值)
		//返回afterSn
		onlyCheckNumberTag = true;
		if(openInfo.netTypeCode=="80"){//个人导航
			var serialNumber = obj.value;
			if(serialNumber.length!=11){
				win.alert("业务标识号必须为11位！",function(){$("serialNumber").value=$('pagecontext').epachyId});
				return false;
			}
			if(serialNumber.substr(0,4) != $('pagecontext').epachyId){
				win.alert("业务标识号请以["+$('pagecontext').epachyId+"]前缀开头！",function(){$("serialNumber").value=$('pagecontext').epachyId});
				return false;
			}			
		}
		Cs.Ajax.swallowXml(openPage, "checkNewSerailNumberNoRes_GZ", "serialNumber="+obj.value+"&netTypeCode="+openInfo.netTypeCode, "正在校验号码信息，请稍候...");
	}else if(obj.checkResType == "2"){//判断号码是否存在，不存在报错
		if($("INSTALL_TYPE_2").value=="1"){
			Cs.Ajax.swallowXml(openPage, "checkNewSerailNumberRes_GZ", "serialNumber="+obj.value+"&netTypeCode=30", "正在校验号码信息，请稍候...");
		}
	}else{
		onlyCheckNumberTag = false;
		Cs.Ajax.swallowXml(openPage, "checkNewSerailNumber_GZ", "serialNumber="+obj.value+"&netTypeCode="+openInfo.netTypeCode+"&psptId="+$("psptId").innerHTML+"&psptType="+$("psptType").innerHTML, "正在校验号码信息，请稍候...");
	}
}
function dealWhenNoRes(){
	$("PSTN_SERIAL_NUMBER").value="";
}
//--------------------------------------------193,IP注册业务---------------------------------------------
var prefix="";
var mode = []; //匹配模式数组
var oktag = false;
var needCheckSn = true;
var snLength = 0;
var anid = "";  //固网的一个流水号,记录给继承订单使用
function dealAfterShowInstance193P(){
	openInfo.resCheck = false;
	var netType = baseProduct.netTypeCode;
	var ruleGrp = $F("USER_IN_MODE");
	Cs.Ajax.register("numberInfo",dealAfterNumberInfo);  
	Cs.Ajax.swallowXml(openPage, "getNumberInfo", "netType="+netType+"&ruleGrp="+ruleGrp, "正在获取193,IP相关号码信息，请稍候...");
}
function dealAfterNumberInfo(node){
	if(!node.hasChildNodes()){
		alert("获取号码规则无数据");
		$("serialNumber").disable();
		$("productArea").lastvalue = "";    //以便"上一步"操作以后,该区域可以重新刷新
		return;
	}
	$("serialNumber").disabled = false;
	$("ip193SnInfo").disabled = false;
	var numberInfo = Cs.util.Utility.node2JSON(node.firstChild);
	openInfo.numberInfo = numberInfo;
	prefix = numberInfo.paraCode2;  //号码前缀
	if(numberInfo.paraCode20.strip() != ""){
		mode = numberInfo.paraCode20.strip().split(',');  //号码规则
	}else
		mode =[];
	if(numberInfo.paraCode3 != ""){
		if(numberInfo.paraCode3 == "Z"){
			needCheckSn = false;
		}
		else{
			snLength = parseInt(numberInfo.paraCode3,10);   //号码长度不包括前缀
		}
	}
	$("serialNumber").onblur=ip193SerialNumberExit;
}
function ip193SerialNumberExit(){
	var serialNumber = $F("serialNumber");
	if(serialNumber == "" ) return;
	if($("serialNumber").lastvalue && serialNumber == $("serialNumber").lastvalue.sn){
		return;
	}
	
	if(needCheckSn){
		if(serialNumber.indexOf(prefix) != 0){
			alert("请以["+prefix+"]前缀开头!");
			$("serialNumber").value = "";
			return;
		}
		var prifixlength = prefix.length;
		var tempSerialNumber = serialNumber.substr(prifixlength);
		if(tempSerialNumber.length != snLength){
			alert("号码长度与规则不符合,请修改!");
			$("serialNumber").value = "";
			anid = "";
			openInfo.resCheck = false;
			return;
		}
		//号码前缀匹配,判断号码是否以模式数组中的数字开头
		if(mode.length > 0){
			mode.each(function(element){
				if(tempSerialNumber.indexOf(element) == 0){
					oktag = true;
					throw $break;
				}
			})
		}
		else{
			oktag = true;
		}
		if(!oktag){
			alert("您输入的号码和模式不匹配,请重新输入号码!")
			$("serialNumber").value = "";
			return;
		}
	}
	//调接口进行正式校验
	var param = {};
	param.NUMBER = serialNumber;
	param.AN_TYPE_CD = openInfo.numberInfo.paraCode6;
	param.WSDL = openInfo.numberInfo.paraCode17;
	//资源校验的时候,用户重新输入新的号码,需要最占用过的旧号码进行释放
	if($("serialNumber").lastvalue && $("serialNumber").lastvalue != "{}" && openInfo.resCheck){
		param.OLD_NUMBER = $("serialNumber").lastvalue.sn;
		param.RELE_OLDONE = "1"; //需要释放旧的占用号码
		param.ANID = $("serialNumber").lastvalue.anid;
	}
	else{
		param.OLD_NUMBER = "";
		param.RELE_OLDONE = "0"; 
	}
	Cs.Ajax.register("ip193Info", dealAfterIpInfo);
	Cs.Ajax.swallowXml("", "checkIp193Number", "param="+encodeURIComponent(Object.toJSON(param)), "正在校验193,IP相关号码信息，请稍候...");
}
function dealAfterIpInfo(node){
	var info = Cs.util.Utility.node2JSON(node);
	if(info.result == "-1"){
		alert(info.cause);
		$("serialNumber").value = "";
		anid = "";
		openInfo.resCheck = false;
		return;
	}
	var temp = {};
	temp.sn = $F("serialNumber");
	temp.anid = info.anid;
	anid = info.anid
	$("serialNumber").lastvalue = temp;
	//alert(Object.toJSON($("serialNumber").lastvalue))
	openInfo.resCheck = true;
}
function lookSnInfo(){
	var win = new Cs.flower.Win();
	if (needCheckSn) {
		//号码长度
		//var leg = parseInt(openInfo.numberInfo.paraCode3,10) + parseInt(prefix.length,10);
		var leg = parseInt(openInfo.numberInfo.paraCode3,10);
		//号码规则处理
		var data = new Array();
		data.push("<table border=2 width='300'>");
		data.push("<thead><tr><td><strong>名称</strong></td><td><strong>取值</strong></td></tr>");
		data.push("<tbody><tr><td>号码前缀:</td><td>");
		data.push(openInfo.numberInfo.paraCode2);
		data.push("</td></tr>");
		data.push("<tr><td>号码长度:</td><td>");
		data.push(leg);
		data.push("</td></tr>");
		if(mode.length > 0){
			data.push("<tr><td border=1><strong>匹配模式:</strong></td><td>&nbsp</td></tr>");
			var index = 1;
			mode.each(function(element){
				if (index % 2 == 1) {
					data.push("<tr><td>")
					data.push(getMode(element, leg));
					data.push("</td>");
				}
				else {
					data.push("<td>")
					data.push(getMode(element, leg));
					data.push("</td></tr>");
				}
				index++;
			});
			if (index % 2 == 0) {
				data.push("<td></td></tr>");
			}
			data.push("<tr><td border=1>&nbsp</td><td>&nbsp</td></tr>");
			data.push("<tr><td border=1>号码需要包括前缀</td><td><font color='red'><strong>也需要包括匹配模式部分!<strong></td></tr>");
		}
		else {
			data.push("<tr><td border=1>号码需要包括前缀</td><td>&nbsp</td></tr>");
		}
		data.push("</tbody></table>");
		win.alert(data.join(''), "");
	}
	else{
		win.alert("该号码没有前缀和模式限制,请随便输入!","");
	}
}
function getMode(value,leg){
	var result = value;
	var size = leg - value.length;
	for(var i=0; i <size; i++){
		result += "X";
	}
	return result;
}
//-------------------------------------------------校验函数-------------------------------------------------
//校验对象的值是否为整数
function checkNumber(obj){
	if(obj.value.blank()){
	    obj.value = "";
	    return;
	}
	var parten =/^[0-9]\d*$/;
	if(!parten.exec(obj.value)){
		alert("请输入正整数!");
		obj.value = "";
	}
}
//ip地址校验
function isIP(obj) { 
	strIP = trim(obj.value);
	if(strIP.blank()){
		obj.value = "";
	    return;
	}
	var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g 
	if(re.test(strIP)) 
	{ 
	  if( RegExp.$1 <256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256) return true; 
	} 
	alert("您输入的不是有效IP地址");
	obj.value = "";
}
//校验为2的整数倍
function isDouble(obj){
	if(obj.value.blank()){
		obj.value = "";
	    return;
	}
	if(trim(obj.value)/2 != 0){
		alert("请输入2的整数倍!");
		obj.value = "";
	}
}

//--------------------------------------------193,IP注册业务---------------------------------------------
var prefix="";
var mode = []; //匹配模式数组
var oktag = false;
var needCheckSn = true;
var snLength = 0;
var anid = "";  //固网的一个流水号,记录给继承订单使用
function dealAfterShowInstance193P(){
	openInfo.resCheck = false;
	var netType = baseProduct.netTypeCode;
	var ruleGrp = $F("USER_IN_MODE");
	Cs.Ajax.register("numberInfo",dealAfterNumberInfo);  
	Cs.Ajax.swallowXml(openPage, "getNumberInfo", "netType="+netType+"&ruleGrp="+ruleGrp, "正在获取193,IP相关号码信息，请稍候...");
}
function dealAfterNumberInfo(node){
	if(!node.hasChildNodes()){
		alert("获取号码规则无数据");
		$("serialNumber").disable();
		$("productArea").lastvalue = "";    //以便"上一步"操作以后,该区域可以重新刷新
		return;
	}
	$("serialNumber").disabled = false;
	$("ip193SnInfo").disabled = false;
	var numberInfo = Cs.util.Utility.node2JSON(node.firstChild);
	openInfo.numberInfo = numberInfo;
	prefix = numberInfo.paraCode2;  //号码前缀
	if(numberInfo.paraCode20.strip() != ""){
		mode = numberInfo.paraCode20.strip().split(',');  //号码规则
	}else
		mode =[];
	if(numberInfo.paraCode3 != ""){
		if(numberInfo.paraCode3 == "Z"){
			needCheckSn = false;
		}
		else{
			snLength = parseInt(numberInfo.paraCode3,10);   //号码长度不包括前缀
		}
	}
	$("serialNumber").onblur=ip193SerialNumberExit;
}
function ip193SerialNumberExit(){
	var serialNumber = $F("serialNumber");
	if(serialNumber == "" ) return;
	if($("serialNumber").lastvalue && serialNumber == $("serialNumber").lastvalue.sn){
		return;
	}
	
	if(needCheckSn){
		if(serialNumber.indexOf(prefix) != 0){
			alert("请以["+prefix+"]前缀开头!");
			$("serialNumber").value = "";
			return;
		}
		var prifixlength = prefix.length;
		var tempSerialNumber = serialNumber.substr(prifixlength);
		if(tempSerialNumber.length != snLength){
			alert("号码长度与规则不符合,请修改!");
			$("serialNumber").value = "";
			anid = "";
			openInfo.resCheck = false;
			return;
		}
		//号码前缀匹配,判断号码是否以模式数组中的数字开头
		if(mode.length > 0){
			mode.each(function(element){
				if(tempSerialNumber.indexOf(element) == 0){
					oktag = true;
					throw $break;
				}
			})
		}
		else{
			oktag = true;
		}
		if(!oktag){
			alert("您输入的号码和模式不匹配,请重新输入号码!")
			$("serialNumber").value = "";
			return;
		}
	}
	//调接口进行正式校验
	var param = {};
	param.NUMBER = serialNumber;
	param.AN_TYPE_CD = openInfo.numberInfo.paraCode6;
	param.WSDL = openInfo.numberInfo.paraCode17;
	//资源校验的时候,用户重新输入新的号码,需要最占用过的旧号码进行释放
	if($("serialNumber").lastvalue && $("serialNumber").lastvalue != "{}" && openInfo.resCheck){
		param.OLD_NUMBER = $("serialNumber").lastvalue.sn;
		param.RELE_OLDONE = "1"; //需要释放旧的占用号码
		param.ANID = $("serialNumber").lastvalue.anid;
	}
	else{
		param.OLD_NUMBER = "";
		param.RELE_OLDONE = "0"; 
	}
	Cs.Ajax.register("ip193Info", dealAfterIpInfo);
	Cs.Ajax.swallowXml("", "checkIp193Number", "param="+encodeURIComponent(Object.toJSON(param)), "正在校验193,IP相关号码信息，请稍候...");
}
function dealAfterIpInfo(node){
	var info = Cs.util.Utility.node2JSON(node);
	if(info.result == "-1"){
		alert(info.cause);
		$("serialNumber").value = "";
		anid = "";
		openInfo.resCheck = false;
		return;
	}
	var temp = {};
	temp.sn = $F("serialNumber");
	temp.anid = info.anid;
	anid = info.anid
	$("serialNumber").lastvalue = temp;
	//alert(Object.toJSON($("serialNumber").lastvalue))
	openInfo.resCheck = true;
}
function lookSnInfo(){
	var win = new Cs.flower.Win();
	if (needCheckSn) {
		//号码长度
		//var leg = parseInt(openInfo.numberInfo.paraCode3,10) + parseInt(prefix.length,10);
		var leg = parseInt(openInfo.numberInfo.paraCode3,10);
		//号码规则处理
		var data = new Array();
		data.push("<table border=2 width='300'>");
		data.push("<thead><tr><td><strong>名称</strong></td><td><strong>取值</strong></td></tr>");
		data.push("<tbody><tr><td>号码前缀:</td><td>");
		data.push(openInfo.numberInfo.paraCode2);
		data.push("</td></tr>");
		data.push("<tr><td>号码长度:</td><td>");
		data.push(leg);
		data.push("</td></tr>");
		if(mode.length > 0){
			data.push("<tr><td border=1><strong>匹配模式:</strong></td><td>&nbsp</td></tr>");
			var index = 1;
			mode.each(function(element){
				if (index % 2 == 1) {
					data.push("<tr><td>")
					data.push(getMode(element, leg));
					data.push("</td>");
				}
				else {
					data.push("<td>")
					data.push(getMode(element, leg));
					data.push("</td></tr>");
				}
				index++;
			});
			if (index % 2 == 0) {
				data.push("<td></td></tr>");
			}
			data.push("<tr><td border=1>&nbsp</td><td>&nbsp</td></tr>");
			data.push("<tr><td border=1>号码需要包括前缀</td><td><font color='red'><strong>也需要包括匹配模式部分!<strong></td></tr>");
		}
		else {
			data.push("<tr><td border=1>号码需要包括前缀</td><td>&nbsp</td></tr>");
		}
		data.push("</tbody></table>");
		win.alert(data.join(''), "");
	}
	else{
		win.alert("该号码没有前缀和模式限制,请随便输入!","");
	}
}
function getMode(value,leg){
	var result = value;
	var size = leg - value.length;
	for(var i=0; i <size; i++){
		result += "X";
	}
	return result;
}
//-------------------------------------------------校验函数-------------------------------------------------
//校验对象的值是否为整数
function checkNumber(obj){
	if(obj.value.blank()){
	    obj.value = "";
	    return;
	}
	var parten =/^[0-9]\d*$/;
	if(!parten.exec(obj.value)){
		alert("请输入正整数!");
		obj.value = "";
	}
}
//ip地址校验
function isIP(obj) { 
	strIP = trim(obj.value);
	if(strIP.blank()){
		obj.value = "";
	    return;
	}
	var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g 
	if(re.test(strIP)) 
	{ 
	  if( RegExp.$1 <256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256) return true; 
	} 
	alert("您输入的不是有效IP地址");
	obj.value = "";
}
//校验为2的整数倍
function isDouble(obj){
	if(obj.value.blank()){
		obj.value = "";
	    return;
	}
	if(trim(obj.value)/2 != 0){
		alert("请输入2的整数倍!");
		obj.value = "";
	}
}

// 专线编号校验
function checkSpecLineCode(obj){
	$("serialNumber").value = obj.value;
	
	var brandCode = baseProduct.brandCode;
	var value = obj.value;
	Cs.Ajax.register("IMEICONFIRM", callBackSpecLineCode);
	Cs.Ajax.swallowXml("","checkProptyByBrandCode", "value=" + value + "&brandCode=" + brandCode + "&attrCode=SPEC_LINE_CODE", "正在校验专线编号，请稍等……");
}

function callBackSpecLineCode(node){
	var info = node.getAttribute("imei");
	if(info == "Y"){
		alert("已存在此专线编号！");
		$("SPEC_LINE_CODE").value = "";
	}
}

// 小灵通机身码校验
function checkPhsImei(){
	// 判断前后两次输入是否相同
	var imei = $F("IMEI");
	var imeiconfirm = $F("IMEICONFIRM");
	var netTypeCode = baseProduct.netTypeCode;
	if(imei != imeiconfirm){
		alert("先后输入的机身码不一致!");
		$("IMEICONFIRM").value = "";
		return;
	}else{
		Cs.Ajax.register("IMEICONFIRM", callBackPhsImei);
		Cs.Ajax.swallowXml("","checkProptyByNetTypeCode", "value=" + imei + "&netTypeCode=" + netTypeCode + "&attrCode=IMEI", "正在校验小灵通机身号码，请稍等……");
	}
}

function callBackPhsImei(node){
	var imei = node.getAttribute("imei");
	if(imei == "Y"){
		alert("已存在此机身码！");
		$("IMEICONFIRM").value = "";
	}
}




//-------------------------------------------------初始化ngn密码-------------------------------------------------
function initNgnSipPwd(){
	Cs.Ajax.register("SIP_PRE_PASSWD", callBackNgnSipPwd);
	Cs.Ajax.swallowXml("","getNgnSipPwd", "param=", "");
}
function callBackNgnSipPwd(node){
	var pwd = node.getAttribute("pwd");
	$("SIP_PRE_PASSWD").value = pwd;
}

//-------------------------------------------------adsl帐号校验-------------------------------------------------
var testRegExp = "";
function dealAfterShowInstanceXDSL(ruleGrp){
	//alert("enter dealAfterShowInstanceXDSL: " + ruleGrp);
	openInfo.resCheck = false;
	var netType = baseProduct.netTypeCode;
	Cs.Ajax.register("numberInfo",dealAfterNumberInfoXDSL);  
	Cs.Ajax.swallowXml(openPage, "getNumberInfo", "netType="+netType+"&ruleGrp="+ruleGrp, "正在获取XDSL相关号码信息，请稍候...");
}

function dealAfterNumberInfoXDSL(node){
	//alert("enter dealAfterNumberInfoXDSL: " + node.xml);
	if(!node.hasChildNodes()){
		alert("获取号码规则无数据");
		$("NET_ACCOUNT").disable();
		$("productArea").lastvalue = "";    //以便"上一步"操作以后,该区域可以重新刷新
		return;
	}
	$("NET_ACCOUNT").disabled = false;
	$("NET_ACCOUNT_SN_INFO").disabled = false;
	var numberInfo = Cs.util.Utility.node2JSON(node.firstChild);
	openInfo.numberInfo = numberInfo;
	prefix = numberInfo.paraCode2;  //号码前缀
	testRegExp = numberInfo.paraCode20;	//  正则表达式  /^[A-Za-z0-9]{2,20}$/i;
	snLength = parseInt(numberInfo.paraCode3,10);   //号码长度不包括前缀
	$("NET_ACCOUNT").onblur=adslAccountExit;

	//alert("enter dealAfterNumberInfoXDSL: end");
}

function adslAccountExit(){
	//alert("enter adslAccountExit");
	var accountVal = $F("NET_ACCOUNT");
	if(accountVal == "" ) return;
	if($("NET_ACCOUNT").lastvalue && accountVal == $("NET_ACCOUNT").lastvalue.sn){
		return;
	}

	if(accountVal.indexOf(prefix) != 0){
		alert("请以["+prefix+"]前缀开头!");
		$("NET_ACCOUNT").value = "";
		return;
	}
	var prifixlength = prefix.length;
	var tempAccountVal = accountVal.substr(prifixlength);
	if(tempAccountVal.length>snLength || accountVal.length<1){
		alert("号码长度与规则不符合,请修改!");
		$("NET_ACCOUNT").value = "";
		anid = "";
		openInfo.resCheck = false;
		return;
	}
	
	   var str = "cdb21AAbsb-";
	//帐号规则校验
	if(testRegExp!=""){
		var re = new RegExp(testRegExp,"i");
		var arr = re.exec(accountVal);
		if(arr==null || arr==""){
			alert("您输入的帐号和模式不匹配,请重新输入!")
			$("NET_ACCOUNT").value = "";
			anid = "";
			openInfo.resCheck = false;
			return;
		}
	}
	
	//调接口进行正式校验
	var param = {};
	param.NUMBER = accountVal;
	param.AN_TYPE_CD = openInfo.numberInfo.paraCode6;
	param.WSDL = openInfo.numberInfo.paraCode17;
	//资源校验的时候,用户重新输入新的号码,需要最占用过的旧号码进行释放
	if($("NET_ACCOUNT").lastvalue && $("NET_ACCOUNT").lastvalue != "{}" && openInfo.resCheck){
		param.OLD_NUMBER = $("NET_ACCOUNT").lastvalue.sn;
		param.RELE_OLDONE = "1"; //需要释放旧的占用号码
		param.ANID = $("NET_ACCOUNT").lastvalue.anid;
	}
	else{
		param.OLD_NUMBER = "";
		param.RELE_OLDONE = "0"; 
	}
	Cs.Ajax.register("adslAcount", dealAfterAdslAccount);
	Cs.Ajax.swallowXml("", "checkAdslAccount", "param="+encodeURIComponent(Object.toJSON(param)), "正在校验XDSL帐号相关号码信息，请稍候...");
}
function dealAfterAdslAccount(node){
	//alert("enter dealAfterAdslAccount");
	var info = Cs.util.Utility.node2JSON(node);
	if(info.result == "-1"){
		alert(info.cause);
		$("NET_ACCOUNT").value = "";
		anid = "";
		openInfo.resCheck = false;
		return;
	}
	var temp = {};
	temp.sn = $F("NET_ACCOUNT");
	temp.anid = info.anid;
	anid = info.anid;
	$("NET_ACCOUNT").lastvalue = temp;
	//alert(Object.toJSON($("serialNumber").lastvalue))
	openInfo.resCheck = true;
	$("serialNumber").value = $("NET_ACCOUNT").value;
	$("SERIAL_ID").value = info.anid;
}
//-------------------------------------------------adsl帐号校验-----------END

//切换公众客户和集团客户
function switchType(obj){
	var isGroup = obj.value ==1?true:false;
	
	if(obj.name == "radioT"){
		$("groupAera").style.display =isGroup?"":"none";
		$("GRP_ATTR_TR").style.display =(isGroup&&$("grpRadio").checked)?"":"none";
		//QC:96543 BEGIN 行业应用信息
		if(obj.value==1){
			//QC:98355 BEGIN
			//$("GRP_ATTR_DIV").style.display ="none";
			if(typeof $("grpRadio") != undefined && $("grpRadio").checked){
				if(typeof grpAttrItem != undefined && grpAttrItem.length>0){
				showGrpAttr();
				}
			}
			
		}else{
			//当选择为公众用户时  隐藏行业应用选择信息
			if( typeof $("GRP_ATTR_DIV").style.display != undefined){
				$("GRP_ATTR_DIV").style.display ="none";
			}
			
		}
		//QC:98355 END
		//QC:96543 END 行业应用信息
		$("groupName").style.display =isGroup?"":"none";
		if($("groupName1"))$("groupName1").style.display =isGroup?"":"none";
		if($("groupName2"))$("groupName2").style.display =isGroup?"":"none";
		//$("GROUP_NAME_ESS").required = isGroup?"true":"false";
		if(!isGroup){
			$("GROUP_NAME_ESS").value="";
			$("GROUP_ID_ESS").value="";
		}
		Cs.ctrl.Validate.showMustFillTag();		
	}
	 //QC:98355 BEGIN
	if(obj.name == "radioG"){
		$("GRP_ATTR_TR").style.display =obj.value ==0?"":"none";
	   
	    $("GRP_ATTR_DIV").style.display=obj.value ==0?"":"none";
	}
	    //QC:98355 END
	
	    
}

function filterByNetcode(){
	if($F("NET_TYPE_CODE")=='') return;
	var allCode = ["10","15","16","17","33","50"];
	if($("rhyw").checked){ 
		win.alert("业务类型 请选择固网业务或移网业务");
	    return false;
	}
	if($("gwyw")&&$("gwyw").checked)
	{
		if(allCode.include($F("NET_TYPE_CODE")))
		{
			win.alert("固网业务不能选择此网别");
			Cs.flower.LookupCombo.setValue($("NET_TYPE_CODE"), '');
			return;
		}
	}
	
	if($("ydwye")&&$("ydwye").checked)
	{
		if(!allCode.include($F("NET_TYPE_CODE")))
		{
			win.alert("移动网业务不能选择此网别");
			Cs.flower.LookupCombo.setValue($("NET_TYPE_CODE"), '');			
			return;
		}
	}
	// 3G 开户
	if(Code3g.include($F("NET_TYPE_CODE")))
		$("GRP_ATTR_AREA").style.display = "";
	else
	    //tfs 108056 begin
	    $("GRP_ATTR_AREA").style.display = "none";		
       //tfs 108056 end	

	Cs.Ajax.register("guideBrandByNetcode", showBrand);     //推荐品牌
	//获取推荐的品牌 返回 guideBrand 节点
	if ($F("NET_TYPE_CODE").blank()){	
		Cs.Ajax.swallowXmlCache("guideBrand", prodPage, "getGuideBrand"); 
    }else{
    	Cs.Ajax.swallowXml(prodPage, "guideBrandByNetcode","netTypeCode="+$F("NET_TYPE_CODE"));   
    }
	$("brandProdArea").innerHTML="";// 清空 品牌下可办理的活动 区域
	
	// 网别转换，清空 产品别名查询区域
	if(allCode.include($F("NET_TYPE_CODE"))&&$('tbProductListTable'))
		$('tbProductListTable').remove();
	//产品属性过滤
	if($('NET_TYPE_CODE') && $F('NET_TYPE_CODE')!=""){
		lightProductItem.parent= $("productItemArea");
		Cs.Ajax.register("intfElms_ProductItems", function(node){lightProductItem.draw.bind(lightProductItem)(node);});	//显示
		lightProductItem.lighting("OPEN_PRODUCT_ITEM_"+$F('NET_TYPE_CODE')+"|ProductItems");
	}

}

function fnGetGhDepartInfo(){
	var sql = " AND depart_kind_code NOT BETWEEN 442 AND 449 AND validflag='0'";
	var para = "&SQL_PLUS="+sql;
	para += "&TAB_NAME=td_m_depart";
	para += "&CODE=depart_id";
	para += "&NAME=depart_name";
	para += "&isStaff=0";
	// QC:95811 begin
	var result =  popupDialog("popupdialog.ChoiceGHNormalInfo","init",para,"渠道名称","600","360");
	// QC:95811 end
	if( result&& !result.blank()){
		var ret = result.toQueryParams();
		$("cityCode").value = ret.PARANAME;
		$("cityCode").lastValueCode = $("cityCode").valueCode;
		$("cityCode").valueCode = ret.PARACODE;
		$("ghCityCode").value = ret.PARANAME;
		$("ghCityCode").lastValueCode = $("cityCode").valueCode;
		$("ghCityCode").valueCode = ret.PARACODE;
		if($("ghCityCode").valueCode != $("ghCityCode").lastValueCode){
			Cs.flower.LookupCombo.setValue($('developStaffId'),"");
			ghDevelopStaffId="";
		}
		getGhStaffInfo();
    }
}
//根据选择的营业厅获取该营业厅下所有操作员信息
function getGhStaffInfo(){
	var departId = $('ghCityCode').valueCode;
	if(departId.blank()){
		$('ghDevelopStaffId$lst').value = "";
		Cs.flower.LookupCombo.setValue($('ghDevelopStaffId'),"");
		Cs.flower.LookupCombo.update($('ghDevelopStaffId'));
		openInfo.developInfoxml = "";
		return;
	}
	Cs.flower.LookupCombo.setValue($('ghDevelopStaffId'),"");
	Cs.Ajax.swallowXml(openPage, "getStaffInfoByDepartId", "DEPART_ID="+departId, "正在获取改营业厅操作员信息，请稍候...");
}
Cs.Ajax.register("staffInfo", dealAfterStaffInfo);
function dealAfterStaffInfo(node){
	$('ghDevelopStaffId$lst').value = node.xml;
	openInfo.developInfoxml = node;
	Cs.flower.LookupCombo.update($('ghDevelopStaffId'));
	
	$('developStaffId$lst').value = node.xml;
	openInfo.developInfoxml = node;
	Cs.flower.LookupCombo.update($('developStaffId'));
}

/***
 * 增加项目名称 pangys
 */
function queryProject(){
	
	var CITY_NAME = $F('AREA_CODE$dspl');
	var CITY_CODE = $('AREA_CODE$dspl').preValue;
	var result = popupDialog("popupdialog.QueryProject","queryProjectList","&CITY_CODE="+CITY_CODE+"&CITY_NAME="+CITY_NAME,"项目名称","900","500");
	if(result){
		if($("projectId")){
		    $("projectId").value = result.ProjectCode;
		}
		if($("ghProject")){
		    $("ghProject").value = result.ProjectName;
		}
		
		if($("PROJECGT_ID")){
			$("PROJECGT_ID").value = result.ProjectCode;
		}
		if($("PROJECGT_NAME")){
			$("PROJECGT_NAME").value = result.ProjectName;
		}
	}
}

//发展人 pangys
function fnGetDeveloper(){
	var para;
	var result =  popupDialog("popupdialog.ChoiceStaff","init",para,"发展人名称","900","500");
	if(result){
		$("getDeveloperId").value = result.DEPART_NAME;
		$("getDeveloperId").valueCode = result.DEPART_ID;
		$("getDevelopStaffId").value = result.STAFF_NAME;
		$("getDevelopStaffId").valueCode = result.STAFF_ID;
	}
}

//update by zhengzhichao
function fnGetGhStaffInfo(){
	var para;
	// QC:95811 begin
	var result =  popupDialog("popupdialog.ChoiceStaff","init",para,"发展人名称","900","500");
	// QC:95811 end
	if(result){
		
		$("cityCode").value = result.DEPART_NAME;
		$("cityCode").lastValueCode = $("cityCode").valueCode;
		$("cityCode").valueCode = result.DEPART_ID;
		$("ghCityCode").value = result.DEPART_NAME;
		$("ghCityCode").lastValueCode = $("cityCode").valueCode;
		$("ghCityCode").valueCode = result.DEPART_ID;
		if($("ghDevelopStaffId_new")!=null){
			$("ghDevelopStaffId_new").value = result.STAFF_NAME;
			$("ghDevelopStaffId_new").lastValueCode = $("cityCode").valueCode;
			$("ghDevelopStaffId_new").valueCode = result.STAFF_ID;
		}
		$("ghDevelopStaffId").value = result.STAFF_NAME;
		$("ghDevelopStaffId").lastValueCode = $("cityCode").valueCode;
		$("ghDevelopStaffId").valueCode = result.STAFF_ID;
		//188355
		$("newStaffId").value = result.STAFF_ID;	
		$("newDeveloperId").value = result.DEPART_ID;
    }
}
//选择局向
function getMoffice() {
    var result =  popupDialog("popupdialog.ChooseMoffice","init",null,"选择局向","650","395");
   
    if(result && result.bureauId && !result.bureauId.blank()){
        $('MOFFICE_ID').value = result.bureauId;
        $('MOFFICE_NAME').value = result.bureauName;
    } 
}

//-----------------------------宁夏------------------------------
//生成业务标识号
function getBusinessNumber_NX() {
	var productTypeCode = $('guideArea').prodType;
	openInfo.netTypeCode = baseProduct.netTypeCode;
	var netTypeCode = openInfo.netTypeCode;
	var o={};//没具体用处，为后面登记发展人相关信息用
	o.netTypeCode =  openInfo.netTypeCode ;
	o.serialNumber = $("serialNumber").value;
	openInfo.snInfo = o;
	openInfo.cardInfo = {};
	var pstnSerNumber = "";
	if(netTypeCode=="85"){
		var installType = $("INSTALL_TYPE_2").value; 
		if(installType=="1"){//加装到PSTN
			if($("PSTN_SERIAL_NUMBER").value==""){
				win.alert("请输入加装到PSTN的业务号码！",function(){$("PSTN_SERIAL_NUMBER").focus()});
				return;
			}else{
				pstnSerNumber = $("PSTN_SERIAL_NUMBER").value;
			}
		}else{//单装ADSL
			pstnSerNumber = "";
			$("PSTN_SERIAL_NUMBER").value = pstnSerNumber;
		}
	}
	Cs.Ajax.register("getBusinessNumber_NX", obtGetBusinessNumber_NX);	
	var params = "netTypeCode=" + netTypeCode+"&productTypeCode="+productTypeCode+"&pstnSerNumber="+pstnSerNumber;
	Cs.Ajax.swallowXml("", "getBusinessNumber_NX",params);
}
function obtGetBusinessNumber_NX(node){
	var retInfo = Cs.util.Utility.node2JSON(node);
	var editRule = retInfo.editRule; //检验规则
	var editValue = retInfo.editValue; //返回值
	if(editRule=="A" || editRule=="C" || editRule=="D"){
		$("serialNumber").value=editValue;	
		$("serialNumber").disabled=false;
		$("chosenum").disabled=true;
	}else{
		if($("chosenum")){
			$("chosenum").disabled=false;
		}
		$("serialNumber").value=editValue;	
	}
	//宁夏 XDSL绑定智能卡卡号
	if(baseProduct.netTypeCode=='85'&&(baseProduct.brandCode=='XDSY'||baseProduct.brandCode=='XDSH'||baseProduct.brandCode=='LANH'||baseProduct.brandCode=='LANY')){
		getCardInfo();
	}
}
//XDSL安装类型选择
function xdslInstallTypeChg(){
	if($('PSTN_SERIAL_NUMBER')&&$('INSTALL_TYPE_2')&&$('INSTALL_TYPE_2').value=='1'){//加装到PSTN
		$('PSTN_SERIAL_NUMBER').disabled=false;
	}else if ($('PSTN_SERIAL_NUMBER')&&$('INSTALL_TYPE_2')&&$('INSTALL_TYPE_2').value=='2'){//单装XDSL
		$('PSTN_SERIAL_NUMBER').value='';
		$('PSTN_SERIAL_NUMBER').disabled=true;
	}
}
//正常在网号码校验
function IsSerialNumberExit(){
	var net;
    var serNum;
    if(($('PSTN_SERIAL_NUMBER')&&$('PSTN_SERIAL_NUMBER').value=='') 
        || ($('DATE_SERIAL_NUMBER')&&$('DATE_SERIAL_NUMBER').value==''))
        return;
    if($('PSTN_SERIAL_NUMBER')) {
        net = '30';
        serNum = $F('PSTN_SERIAL_NUMBER');
    }    
    else if($('DATE_SERIAL_NUMBER')) {
       net = '85';
       serNum = $F('DATE_SERIAL_NUMBER');
    }
	Cs.Ajax.swallowXml(openPage, "isSerialNumberExit", "serialNumber="+serNum+"&netTypeCode=" + net, "正在校验号码信息，请稍候...");
}
//输入新号码后事件
function newSerialNumberExit_NX(obj){
	if (obj.value.blank()||obj.value==obj.lastvalue) return;
	var serialNumber=obj.value;
	if(obj.checkResType == "1" ){
		onlyCheckNumberTag = true;
		Cs.Ajax.swallowXml(openPage, "checkNewSerailNumberNoRes_GZ", "serialNumber="+serialNumber+"&netTypeCode="+baseProduct.netTypeCode, "正在校验号码信息，请稍候...");
	}
	else
	{
		onlyCheckNumberTag = false;
		Cs.Ajax.swallowXml(openPage, "checkNewSerailNumber_GZ", "serialNumber="+obj.value+"&netTypeCode="+openInfo.netTypeCode+"&psptId="+$("psptId").innerHTML+"&psptType="+$("psptType").innerHTML, "正在校验号码信息，请稍候...");
	}
}
//196 179校验电话号码
function checkTelecom_NX(obj){
	var telecom = $("TELECOM_CARRIER").value;//所属运营商
	var fixture = $("FIXTURE").value;//设备类型
	var serialNumber = $("serialNumber").value;
	if(serialNumber.length!=11){
		win.alert("业务号码必须为11位！");
		$("serialNumber").value = "";
		return false;
	}
	if(fixture=='0'){
		if(serialNumber.substr(0,4) != $('pagecontext').epachyId){
			win.alert("业务号码请以["+$('pagecontext').epachyId+"]前缀开头！",function(){$("serialNumber").value=""});
			return false;
		}
	}
	newSerialNumberExit_NX(obj);
}
function checkNumKey()
{
    var key = event.keyCode;
    if(key < 48||key > 57)
    {       
       event.keyCode = 0;
    }
}

//模拟中继入网,连选引示号校验
function IsContinueSnExit(){
	var net;
    var serNum;
    if(($('CONTINUE_SERIAL_NUMBER')&&$('CONTINUE_SERIAL_NUMBER').value==''))
        return;
    if($('CONTINUE_SERIAL_NUMBER')) {
        net = '30';
        serNum = $F('CONTINUE_SERIAL_NUMBER');
    }    
	Cs.Ajax.swallowXml(openPage, "isContinueSnExit", "serialNumber="+serNum+"&netTypeCode=" + net, "正在校验连选引示号信息，请稍候...");
}

function AddMonths(){
    if($F("CONTRACT_MONTHS") != '')
        $("CONTRACT_END_DATE").value = Cs.util.Utility.computeDate($F("CONTRACT_START_DATE"),"2",$F("CONTRACT_MONTHS")).substr(0,10);  
}

//获取代维代理
function fnGetMaDepartInfo(){
    var sql = " AND depart_kind_code NOT BETWEEN 442 AND 449 AND validflag='0'";
    var para = "&SQL_PLUS="+sql;
    para += "&TAB_NAME=td_m_depart";
    para += "&CODE=depart_id";
    para += "&NAME=depart_name";
    para += "&isStaff=0";
    // QC:95811 begin
    var result =  popupDialog("popupdialog.ChoiceGHNormalInfo","init",para,"渠道名称","600","360");
    // QC:95811 end
    if( result&& !result.blank()){
        var ret = result.toQueryParams();
        $("MAINTEN_AGENT").value = ret.PARANAME;
        $("MAINTEN_AGENT").valueCode = ret.PARACODE;  
    }
}
//获取代服务代理
function fnGetSaDepartInfo(){
    var sql = " AND depart_kind_code NOT BETWEEN 442 AND 449 AND validflag='0'";
    var para = "&SQL_PLUS="+sql;
    para += "&TAB_NAME=td_m_depart";
    para += "&CODE=depart_id";
    para += "&NAME=depart_name";
    para += "&isStaff=0";
    // QC:95811 begin
    var result =  popupDialog("popupdialog.ChoiceGHNormalInfo","init",para,"渠道名称","600","360");
    // QC:95811 end
    if( result&& !result.blank()){
        var ret = result.toQueryParams();
        $("SERVEICE_AGENT").value = ret.PARANAME;
        $("SERVEICE_AGENT").valueCode = ret.PARACODE;
    }
}


//------------------------甘肃-------------------------
// 甘肃校验 ADSL LAN开户 业务标识号
function newSerialNumberExit_GS(obj) {

	if (obj.value.blank()||obj.value==obj.lastvalue) return;
	var serialNumber=obj.value;
	obj.checkResType ="1";
	if (baseProduct.netTypeCode=='83') //甘肃宽带业务账号特殊处理
	{
		serialNumber = serialNumber.toLowerCase();
		if(serialNumber.indexOf('@')>0)
	  	serialNumber = serialNumber.substring(0,serialNumber.indexOf('@'));
		var win = new Cs.flower.Win();
        if (!/^\w+$/.test(serialNumber)){
           win.alert("请输入正确格式的数据！字母数字或下划线！", function(){
	           obj.focus();
	           obj.select();
	          }); 
            return false;
        }
        serialNumber = serialNumber+"@gslt.com";
        obj.value = serialNumber;
	}
	onlyCheckNumberTag = true;
	Cs.Ajax.swallowXml("personalserv.createuser.CreateUser", "checkNewSerailNumberNoRes_GS", "serialNumber="+serialNumber+"&netTypeCode="+baseProduct.netTypeCode, "正在校验号码信息，请稍候...");
}

//甘肃 获取  代发展   PROXY_DEVELOP 代维护  PROXY_PRESERVE 代服务   PROXY_SERVICE
function fnGetGSDepartInfo(obj){
    var sql = " AND depart_kind_code NOT BETWEEN 442 AND 449 AND validflag='0'";
    var para = "&SQL_PLUS="+sql;
    para += "&TAB_NAME=td_m_depart";
    para += "&CODE=depart_id";
    para += "&NAME=depart_name";
    para += "&isStaff=0";
    // QC:95811 begin
    var result =  popupDialog("popupdialog.ChoiceGHNormalInfo","init",para,"渠道名称","600","360");
    // QC:95811 end
    if( result&& !result.blank()){
        var ret = result.toQueryParams();
        if(obj.id=="btndvdepartid")
        {
            $("PROXY_DEVELOP").value = ret.PARANAME;
        	$("PROXY_DEVELOP").valueCode = ret.PARACODE;
        }else if(obj.id=="btnpsdepartid"){
        	$("PROXY_PRESERVE").value = ret.PARANAME;
        	$("PROXY_PRESERVE").valueCode = ret.PARACODE;
        }else if(obj.id=="btnsvdepartid")
        {
            $("PROXY_SERVICE").value = ret.PARANAME;
        	$("PROXY_SERVICE").valueCode = ret.PARACODE;
        }
    }
}


//-------------wangwy-附加费用-------------
function changeFeeType(){
    if($("CHANGE_FEE_TYPE").value=="1"){//营业费用
        $("feeName1").style.display="";
        $("feeName2").style.display="none";
    }else if($("CHANGE_FEE_TYPE").value=="2"){
        $("feeName2").style.display="";
        $("feeName1").style.display="none";
    }
    //获取不同的费用
  //  var netTypeCode = $(Cs.ctrl.Web.$P("snNetTypeCode").valueId).value;
    var netTypeCode = $F("NET_TYPE_CODE");
    Cs.Ajax.register("changeFeeType", obtchangeFeeTypeInfo);    
    var params = "FEE_TYPE=" + $F("CHANGE_FEE_TYPE")+"&NET_TYPE_CODE="+netTypeCode;
    Cs.Ajax.swallowXml("", "changeFeeType",params,"正在获取费用信息，请稍候...");   
}

function obtchangeFeeTypeInfo(node){
    $("FEE_TYPE$lst").value = node.xml;
    $("FEE_TYPE$dspl").valueCode = 'PARACODE';
    $("FEE_TYPE$dspl").labelCode = 'PARANAME';
    $("FEE_TYPE$dspl").titleCodes = 'PARANAME,PARACODE';
    Cs.flower.LookupCombo.update($("FEE_TYPE"));
    Cs.flower.LookupCombo.setValue($("FEE_TYPE"), '');

}
//增加费用
function chkInstallFee(){
    if ($F("CHANGE_FEE_TYPE").empty()){
        win.alert("请选择费用类型！",function(){$("CHANGE_FEE_TYPE$dspl").focus()});
        return;
    }
    if ($F("FEE_TYPE").empty()){
        win.alert("请选择费用项！",function(){$("FEE_TYPE$dspl").focus()});
        return;
    }
    if ($F("installProFee").empty()){
        win.alert("请输入相应的费用！",function(){$("installProFee").focus()});
        return;
    }
    var row = installFeeTabEdit.findRow("INSTALL_FEE_CODE", $F("FEE_TYPE"));
    if (row!=null){
        win.alert("同一费用项【"+$F("FEE_TYPE$dspl")+"】不能重复加入！");
        return;
    }
    installFeeTabEdit.myInsertRow();
    installFeeTabEdit.selectRow(installFeeTabEdit.table.rows[1]);
}

//删除费用
function deleteInstallFee(){
    var theRow = installFeeTabEdit.table.rows[installFeeTabEdit.rowIndex];
    if(installFeeTabEdit.table.rows.length<2 || installFeeTabEdit.rowIndex == 0 || !theRow){
        return;
    }
    installFeeTabEdit.deleteRow();
}

function showGroupPage()
{
    if(Cs.ctrl.Trade.tradeFlow.move=="next")
    {
    	if($("groupArea").getAttribute("showed")=="false")
    	{
//	        tabsetGroup = new Cs.flower.TabSet("tsgroup");	         
//	        tabsetGroup.addTab("成员信息", $("gmembInfo")); 
//	        tabsetGroup.addTab("群组属性", $("gitemInfo"));
//	        tabsetGroup.draw();
//	        $("groupArea").setAttribute("showed","true");
//	        
//	        //创建群组界面相关tabedit对象
//	        tabGType = new TableEdit("t_gtype");
//	        tabGInfo = new TableEdit("t_ginfo");
//	        tabGMemb = new TableEdit("t_gmemb");
//	        
//	        //查询可受理的业务类型
//		    Cs.Ajax.register("gtypeinfo", showGroupType);    
//		    var params = "TRADE_TYPE_CODE=10"+"&NET_TYPE_CODE="+baseProduct.netTypeCode;
//		    params += "&BRAND_CODE="+baseProduct.brandCode;
//		    Cs.Ajax.swallowXml("common.UtilityPage", "getGroupType",params,"正在获取群信息，请稍候...");  	        
			displayWhat = "ADD";

			redirectTo('groupserv.dealgrouprelation.DealGroupRelation','init', '', 'grpframe');		
			
    	}
    }
    else
    {
        
    }
}

function showGroupType(node)
{
	tabGType.insertXml(node);
}

function getGTypeInfo(r)
{
	var hstr = "PARAM_NAME,PARA_CODE1,PARA_CODE2,PARA_CODE3,PARA_CODE4,PARA_CODE5,";
	hstr += "PARA_CODE6,PARA_CODE7,PARA_CODE8,PARA_CODE9,PARA_CODE10,PARA_CODE11,";
	hstr += "PARA_CODE12,PARA_CODE13,PARA_CODE14,PARA_CODE15,PARA_CODE16";
	var row;
	if(typeof(r)=='undefined')
	{
		row = tabGType.table.rows[tabGType.rowIndex];		
	}
	else
	{
		row = r;
	}
	return tabGType.rowToJSON(row,hstr);
}

function tabGTypeClick()
{
	tabGType.clickRow();
	$("btGTypeCreate").disabled = true;
	$("btGTypeJoin").disabled = true;
	if(tabGType.rowIndex==0) 
	{
		return;
	}
	else
	{
		//控制引入和创建按钮
		var info = getGTypeInfo();
		var paraCode6 = info.PARA_CODE6;//新建网别
		var paraCode7 = info.PARA_CODE7;//新建品牌
		var paraCode3 = info.PARA_CODE3;//集团产品
		if(tabGInfo.findRow("PRODUCT_ID",paraCode3)==null)//存在,禁用掉按钮
		{
			if((paraCode6=="ZZ"&&paraCode7=="ZZZZ")
				||(paraCode6=="ZZ"&&paraCode7==baseProduct.brandCode)
				||(paraCode6==baseProduct.netTypeCode&&paraCode7==baseProduct.brandCode))
			{
				$("btGTypeCreate").disabled = false;
			}
			
			var paraCode8 = info.PARA_CODE8;//引入网别
			var paraCode9 = info.PARA_CODE9;//引入品牌		
			if((paraCode8=="ZZ"&&paraCode9=="ZZZZ")
				||(paraCode8=="ZZ"&&paraCode9==baseProduct.brandCode)
				||(paraCode8==baseProduct.netTypeCode&&paraCode9==baseProduct.brandCode))
			{
				$("btGTypeJoin").disabled = false;
			}
		}
	}	
}

//创建群组
function createGroup(btn)
{
	chooseJoinRole(insertGInfo);
}

//选择当前用户加入群组的角色
function chooseJoinRole(func)
{
    //选择创建角色    
    var roles = eval(getGTypeInfo().PARA_CODE11);    
    var infos = new Array;
	for(i=0;i<roles.length;++i)
	{
		var role = roles[i];
		if(i==0)
		{
			infos.push("成员角色:<select id='gselRolCode'><option  selected ");
			infos.push("value='"+role.ROLE_CODE+"'>");
			infos.push(role.ROLE);
		}
		else
		{
			infos.push("<option value='"+role.ROLE_CODE+"'>");
			infos.push(role.ROLE);			
		}
	}

	if(infos.length>0) infos.push("</select>")
	else
	{
		alert("群组成员角色配置错误!");
		return;
	}
	
	if(!win)
		win = new Cs.flower.Win();
	win.chooseGRole(infos.join(''),func);	
}
 
//新建群生成群和成员信息
function insertGInfo(roleCode)
{
	var roleCode = $("gselRolCode").value
	var role = $("gselRolCode").options[$("gselRolCode").selectedIndex].text;	
	Cs.flower.TradeWinGlobal.close();//关闭选择窗口
	
	//创建虚拟用户
	var param = "&PRODUCT_ID="+getGTypeInfo().PARA_CODE3+"&USER_ID=&INFOS=";
	var rInfo = popupDialog("popupdialog.group.ModifyGroupInfo","init",param,"创建群信息","600","400");
	if(rInfo == undefined)
		return;
	
	//插入成员表和群组表
	insertGAndMem(rInfo,roleCode,role);
}

function insertGAndMem(rInfo,roleCode,role)
{	
	//增加新成员	
	var mInfo = {};
	mInfo.SERIAL_NUMBER_B = $F("serialNumber");
	mInfo.USER_ID_B = '';
	mInfo.ROLE_B = role;
	mInfo.USER_ID_A = rInfo.G_INFO.USER_ID;
	mInfo.ROLE_CODE_B = roleCode;
	mInfo.RELATION_TYPE_CODE = rInfo.G_INFO.RELATION_TYPE_CODE;
	mInfo.MODIFY_TAG = '0';	
	mInfo.MODIFY = '新增';
	var uus = new Array;
	uus[0] = mInfo;
	
	//插入群组表
	var ggInfo = {};
	ggInfo.PRODUCT_NAME = rInfo.G_INFO.PRODUCT_NAME;
	ggInfo.RELATION_TYPE_CODE = rInfo.G_INFO.RELATION_TYPE_CODE;
	ggInfo.PRODUCT_ID = rInfo.G_INFO.PRODUCT_ID;
	ggInfo.SERIAL_NUMBER = typeof(rInfo.G_INFO.SERIAL_NUMBER)=="undefined"?
		rInfo.G_INFO.RELATION_TYPE_CODE+$F("serialNumber"):rInfo.G_INFO.SERIAL_NUMBER;
	ggInfo.USER_ID = rInfo.G_INFO.USER_ID;
	ggInfo.USER_A_ITEMS = Object.toJSON(rInfo.A_ITEMS);	
	
	//插入原成员表	
	if(typeof(rInfo.UU)!="undefined")
	{
		var rus = rInfo.UU;
		for(i=0;i<rus.length;++i)
		{
			uus[uus.length] = rus[i];
		}
	}
	var mInfos = {};
	mInfos.UU = uus;
	ggInfo.UU_INFOS = Object.toJSON(mInfos);
	
	tabGInfo.insertJson([ggInfo],true);	 
	//选中最后一条记录
	tabGInfo.rowIndex = tabGInfo.table.rows.length-1;
	tabGInfo.table.rows[tabGInfo.rowIndex].click();
	
	//禁用引入,创建按钮
	$("btGTypeCreate").disable();
	$("btGTypeJoin").disable();
}

function tabGInfoClick()
{
	$("btnInGroup").disabled = true;
	tabGInfo.clickRow();
	if(tabGInfo.rowIndex<1)
		return;
	$("btnInGroup").disabled = false;
	var rowInfo = getGInfoRow();
	controlGInfoBtn(rowInfo);	
	if($("gItemArea").productId==getGInfoRow().PRODUCT_ID)	return;
	$("gItemArea").productId = rowInfo.PRODUCT_ID;
	
	//刷新群组属性
	lightGItem.parent= $("gItemArea");
	lightGItem.callback = function()
	{
		var items = getGInfoRow().USER_A_ITEMS;
		lightGItem.setValue(items.evalJSON(),true);
		Cs.ctrl.Web.disableArea("gItemArea");//禁用属性信息
	}
	Cs.Ajax.register("intfElms_GGItems", function(node){lightGItem.draw.bind(lightGItem)(node);});	//显示个性化信息
	lightGItem.lighting("GITEM_"+rowInfo.PRODUCT_ID+"|GGItems");
	
	//插入成员列表
	tabGMemb.clear();
	var uus = rowInfo.UU_INFOS.evalJSON();
	tabGMemb.insertJson(uus.UU,true);	
}

//控制群组的两个按钮
function controlGInfoBtn(rowInfo,disabled)
{
	if(disabled)
	{
		$("btnModGInf").disabled = true;
		$("btnDelGInf").disabled = true;
	}
	else
	{
		var gId = rowInfo.USER_ID;
		//新增的才放开两个按钮,否则禁用
		if(gId.blank())
		{
			$("btnModGInf").disabled = false;
			$("btnDelGInf").disabled = false;			
		}
		else
		{
			$("btnModGInf").disabled = true;
			$("btnDelGInf").disabled = true;			
		}
	}
	
	//始终禁用掉退出群
	$("btnOutGroup").disabled = true;
}

function modifyGInfo()
{
	//弹出窗口,返回群组属性信息
	var gInfo = getGInfoRow();
	var param = "&PRODUCT_ID="+gInfo.PRODUCT_ID+"&USER_ID=&INFOS=" + gInfo.USER_A_ITEMS;
	var rInfo = popupDialog("popupdialog.group.ModifyGroupInfo","init",param,"修改群组信息","600","400");
	if(rInfo == undefined)
		return;	
		
	//更新群组列表属性列	
	tabGInfo.getCell(tabGInfo.table.rows[tabGInfo.rowIndex],"USER_A_ITEMS").innerText = Object.toJSON(rInfo.A_ITEMS);
	
	//刷新属性展现区域
	if(gInfo.PRODUCT_ID.strip() == $("gItemArea").productId.strip())
	{
		lightGItem.parent= $("gItemArea");
		lightGItem.setValue(rInfo.A_ITEMS,true);		
	}
}

function deleteGInfo(flag)
{
	if(flag||confirm("删除群组,其成员也将一起删除.是否继续?"))
	{
		//先删成员,再删群组
		var gInfo = getGInfoRow();
		if(gInfo.PRODUCT_ID.strip() == $("gItemArea").productId.strip())
		{
			tabGMemb.clear();//清除成员
			$("gItemArea").innerHTML = "";//清除群组属性
			$("gItemArea").productId = "-1";//重置区域产品标示
		}
		
		//删除群记录
		tabGInfo.deleteRow();	
		tabGInfo.rowIndex = 0;
		tabGInfo.clickF();
		$("btnModGInf").disabled = true;
		$("btnDelGInf").disabled = true;			
	}
}

//取群组行信息
function getGInfoRow()
{	
	var hstr = "PRODUCT_NAME,SERIAL_NUMBER,USER_ID,PRODUCT_ID,RELATION_TYPE_CODE," +
			"USER_A_ITEMS,UU_INFOS";
	var row = tabGInfo.table.rows[tabGInfo.rowIndex];
	return tabGInfo.rowToJSON(row,hstr);
}

//取成员行数据
function getMemebInfo()
{
	var hstr = "SERIAL_NUMBER_B,USER_ID_B,ROLE_B,USER_ID_A,ROLE_CODE_B,RELATION_TYPE_CODE,MODIFY_TAG,MODIFY";
	var row = tabGMemb.table.rows[tabGMemb.rowIndex];
	return tabGMemb.rowToJSON(row,hstr);		
}

//成员表单击
function tabMembClick()
{	
	$("btnOutGroup").disabled = true;//禁用删除按钮
	tabGMemb.clickRow();
	if(tabGMemb.rowIndex<1)
		return;	
			
	var mInfo = getMemebInfo();
	if(mInfo.MODIFY_TAG.strip()=="0")//只有增加的才允许做退出操作.
	{
		$("btnOutGroup").disabled = false;
	}	
	
}

//成员加入群组
function membInGroup()
{
	if(tabGInfo.rowIndex<1)
	{
		alert("请选择要加入的群组!");
		return;
	}
	
	//查找群组类型信息
	var r = tabGType.findRow("PARA_CODE3",$("gItemArea").productId);
	if(r==null)
	{
		alert("获取群类型信息失败,!");
		return;
	}
	
	//获取成员当前各个角色的数量
	var membRs = {};
	for(i=1;i<tabGMemb.table.rows.length;++i)
	{
		var row = tabGMemb.table.rows[i];
		var roleCode = tabGMemb.rowToJSON(row,"ROLE_CODE_B").ROLE_CODE_B;
		if(typeof(membRs[roleCode])=="undefined")
		{
			membRs[roleCode] = 1;
		}
		else
		{
			membRs[roleCode]++
		}
	}
		
	var gTInfo = getGTypeInfo(r);
	var gInfo = getGInfoRow();
	var param = "&ROLES=" + gTInfo.PARA_CODE12+"&DEFAULT_ROLE=" + gTInfo.PARA_CODE2;
	param += "&SN_TYPES=" + gTInfo.PARA_CODE10+"&BRANDS=" + gTInfo.PARA_CODE13;
	param += "&QUERY_TYPES=" + gTInfo.PARA_CODE14+"&SELF_JS=" + gTInfo.PARA_CODE15;
	param += "&RELATION_TYPE_CODE=" + gInfo.RELATION_TYPE_CODE;
	param += "&ROLE_MEMBS=" + Object.toJSON(membRs);
	
	var rInfo = popupDialog("popupdialog.group.QueryMembInfos","init",param,"添加成员信息","600","400");
	
	if(typeof(rInfo)=="undefined")
		return;	

	var membInfo = rInfo.UU;
	membBInfo = rInfo.UU;			
	Cs.Ajax.register("checkNewMemSn", aftCheckNewMemSn);    
	Cs.Ajax.swallowXml("popupdialog.group.ModifyRelationUUs", "checkNewMemSn","SN="+membInfo.SERIAL_NUMBER_B,"正在获取群信息，请稍候...");  		
}

//成员加入群组
function membOutGroup()
{
	if(tabGMemb.rowIndex<1)
		return;	
	tabGMemb.clickF();
	var mInfo = getMemebInfo();
	if(mInfo.MODIFY_TAG.strip()=="0")//只有增加的才允许做退出操作.
	{
		if(tabGMemb.table.rows.length-1>1)//多余一条,删除成员的同时删除群组
		{	
			if(tabGMemb.getCell(tabGMemb.table.rows[tabGMemb.rowIndex],"SERIAL_NUMBER_B").innerHTML.strip()==$F("serialNumber"))
			{
				if(confirm("该成员为本次业务受理号码,如果删除将其他受理信息同时删除,确认继续?"))
				{
					deleteGInfo(true);//不提示,删除
				}
			}
			else
			{				
				tabGMemb.table.deleteRow(tabGMemb.rowIndex);
				tabGMemb.rowIndex = 0;
				tabGMemb.clickF();	
				
				//更新群资料的成员列
				var uus = genMemeInfos();				
				var mems = {};
				mems.UU = uus;
				tabGInfo.getCell(tabGInfo.table.rows[tabGInfo.rowIndex],"UU_INFOS").innerText = Object.toJSON(mems);				
			}
		}
		else
		{
			if(confirm("该成员为最后一条记录,删除该成员群组也同时删除,确认继续?"))//删除群组的意思是,不在本次业务受理
			{
				//找到成员对应的群组,直接对群组做删除的操作
				var r = tabGInfo.findRow("PRODUCT_ID",$("gItemArea").productId);
				if(r)
				{
					if(r.rowIndex != tabGMemb.rowIndex)
					{
						tabGMemb.rowIndex = r.rowIndex;
						$("t_gmemb").click();//选中关联的群组行
					}
					deleteGInfo(true);//不提示,删除
				}	
			}			
		}
	}
	
	$("btnOutGroup").disabled = true;//禁用删除按钮	
}

//根据列表生成群成员信息
function genMemeInfos()
{
	var mts = "SERIAL_NUMBER_B,USER_ID_B,ROLE_B,USER_ID_A,ROLE_CODE_B,RELATION_TYPE_CODE,MODIFY_TAG,MODIFY";
	return tabGMemb.toJSON(mts);
}

//引入群
function joinGroup(btn)
{
    chooseJoinRole(joinGroupCheck);	
}

function joinGroupCheck()
{
	var roleCode = $("gselRolCode").value
	var role = $("gselRolCode").options[$("gselRolCode").selectedIndex].text;	
	Cs.flower.TradeWinGlobal.close();
	var gtInfo = getGTypeInfo();
	var param = "&PRODUCT_ID="+gtInfo.PARA_CODE3+"&PRODUCT_NAME="+gtInfo.PARAM_NAME;
	param += "&ROLE_CODE="+roleCode;
	var rInfo = popupDialog("popupdialog.group.QueryGroupInfo","init",param,"查询群组信息","600","400");
	if(rInfo == undefined)
		return;	
		
	//插入成员表和群组表
	insertGAndMem(rInfo,roleCode,role);	
}

//选择建群角色
Object.extend(Cs.flower.Win.prototype , {
	chooseGRole:function(infos,func)
	{
	    this.build(this.left, document.documentElement.scrollTop + this.top, this.width, this.height,"选择成员角色");
        this.setNoClose();        
        this.img.innerHTML = "<img src=\"/images-custserv/win/helpico.gif\" />";        
        this.info.innerHTML = infos;
        this.title.style.width = this.body.offsetWidth;
        
        this.button.innerHTML = "";
        btn = this.addButton({value:" 确定 ",onclick:function()
                        {
                        	func();							
                        }})
        
        this.addButton({ value:" 取消 ",onclick:function(){
							Cs.flower.TradeWinGlobal.close();
                        }})                         
        btn.focus();
	}
});

function clearGroupTabs()
{
    tabGType = new TableEdit("t_gtype");
    tabGInfo = new TableEdit("t_ginfo");
    tabGMemb = new TableEdit("t_gmemb");
    tabGType.clear();
    tabGInfo.clear();
    tabGMemb.clear();
	$("gItemArea").innerHTML = "";
	$("gItemArea").productId = "-1";
}

/**
*	校验群组信息
* 	应该控制群内至少要有1个手机号码，
**/
function checkGroupInfo(){
	if (Cs.ctrl.Trade.tradeFlow.move=="previous") return true; //点击 上一步 不检查必输项
	
//	if(typeof($("t_gmemb")) != 'undefined' && $("t_gmemb") != null) {
//		var len = $("t_gmemb").rows.length - 1;	//一条冗余数据
//		
//		if(len == 1) {
//			win.alert("请选择号码加入本群！");
//			return false;
//		}else {
//			return true;
//		}
//	}
	//tfs113951 begin
	if($F("RIGHT_CODE") == "csCreateUserJoinWO" && $F("IS_GROUP_STAFF")=="1")
	{
		var custName = document.frames["grpframe"].document.getElementById("CUST_NAME");
		if(custName.value=='' || custName.value==null)
		{
			win.alert("该工号具有集客权限,必须加入收入归集集团!");
			return false;
		}
	}
	//tfs113951 end
	if($('grpframe'))
	{
		var iframeTest = document.frames["grpframe"];
		return iframeTest.checkValid();
	}
}

function getStaffDutyType(staffId,departId){
	Cs.Ajax.register("staffType", showStaffDutyType); 
	Cs.Ajax.swallowXml("personalserv.createuser.CreateUser", "getStaffDutyType", "&STAFF_ID="+staffId +"&DEPART_ID="+departId, "正在获取发展人类型信息，请稍候...");
}

function showStaffDutyType(node){
	Cs.flower.LookupCombo.setValue($("DEVELOP_SUB_TYPE"), node.firstChild.getAttribute("jobClass"));
	Cs.flower.LookupCombo.update($("DEVELOP_SUB_TYPE"));
}

function aftCheckNewMemSn(node)
{
	if ("1" == node.firstChild.xml) 
	{
		alert("该号码已存在群组关系,添加失败!");
		return;		 	
	}
	
	if(tabGMemb.findRow("SERIAL_NUMBER_B",membBInfo.SERIAL_NUMBER_B)!=null)//检查是否在列表中
	{
		alert("该号码已经在列表中,不能再次添加!");
		return;
	}	
	//生成群组表中的成员信息
	var rowInfo = getGInfoRow();		
	membBInfo.USER_ID_A = rowInfo.USER_ID;
	var uus = rowInfo.UU_INFOS.evalJSON().UU;
	uus[uus.length] = membBInfo;
	var mems = {};
	mems.UU = uus;
	tabGInfo.getCell(tabGInfo.table.rows[tabGInfo.rowIndex],"UU_INFOS").innerText = Object.toJSON(mems);
	
	//插入成员信息
	tabGMemb.insertJson([membBInfo],true);				
}

/*
 * 保存群组信息 并清空 _uuInfos
 */
function saveGroup(){
	var uuKeys = Object.keys(_uuInfos);
    var uArray = new Array;
    for(i=0;i<uuKeys.length;++i)
    {            	
        if (uuKeys[i]=="GRP_ITEMS") 
        {   
        	var ugrpInfo = _uuInfos[uuKeys[i]].evalJSON(true);                	
        	Cs.ctrl.Trade.saveObject("TTRADE_GROUP", {INFOS:ugrpInfo});
        } 
        else if(uuKeys[i]!="toJSONString" &&_uuInfos[uuKeys[i]]!="")
        {           
            uArray = uArray.concat(_uuInfos[uuKeys[i]].evalJSON());  
        }             
        
    }
    if(uArray.length>0)
    {
    	Cs.ctrl.Trade.saveObject("GTRADE_GROUP", {INFOS:uArray});
    }   
    
    _uuInfos={};    
}
//QC:96543 BEGIN 行业应用修改
var grpAttrItem = [];
function changeGrpAttr(){
	var grpAttr = $F("GRP_ATTR");
	$Z("GRP_ATTR_MINI","5","SEL_COMMPARA_BY_CODE1|SUBSYS_CODE=CSM~PARAM_ATTR=2669~PARA_CODE1="+grpAttr,"PARAM_NAME|PARAM_CODE|PARAM_NAME,PARAM_CODE");
//	if($("GRP_ATTR_MINI$lst").value!=""){
//		var node = Cs.util.XML();
//		node.async = "false";
//		node.loadXML($("GRP_ATTR_MINI$lst").value);
//		var rootNode = node.documentElement;
//		var node = rootNode.childNodes[0];
//		var value = node.getAttribute("paramCode");
//		$("GRP_ATTR_MINI").value=value;
//		//$setV("GRP_ATTR_MINI", value);
//		//window.setTimeout('$setV("GRP_ATTR_MINI$dspl", value);', 500);
//	}
}
//tfs 108056 begin
function addGrpAttr(){
   var addGrpAttrMini=$F("GRP_ATTR_MINI");
   var addGrpAttr= $F("GRP_ATTR_MINI");
   var addGrpAttrMiniName=$("GRP_ATTR_MINI$dspl").value;
   var addGrpAttrName=$("GRP_ATTR_MINI$dspl").value;
   if(addGrpAttrMini=='')
   {
	   var win = new Cs.flower.Win();
	   win.alert("请选择行业应用类别！", function(){$("GRP_ATTR_MINI$dspl").focus()});
	   return;
   }
   if(grpAttrItem.length>=5)
   {
	   alert("最多只能选择5个行业应用信息！");
	   return;
   }
   var isAdd =false;
   if (typeof grpAttrItem != undefined && grpAttrItem && grpAttrItem!=""){
//	   grpAttrItem.each(
//		   function (s){
//			   var tempGrpAttr = s.grpAttr;
//			   var tempGrpAttrMini = s.grpAttrMini;
//			   
//			   if(s.grpAttr ==addGrpAttrMini && addGrpAttr ){
//				   
//			   }
//		   }	   
//	   );
	   for(var i =0 ;i<grpAttrItem.length;i++){
		   if(grpAttrItem[i].grpAttrMini==addGrpAttrMini ){
			   isAdd = true;
    		   break;
		   }
	   }
   }
   if(isAdd){
	  alert("您已选择了该行业应用，不允许重复选择！"); 
	  return;
   }
   var item ={};
   item.grpAttrMini=$F("GRP_ATTR_MINI");
   item.grpAttrMniName=addGrpAttrMiniName;
   item.grpAttrName=addGrpAttrName;
   item.grpAttr=$F("GRP_ATTR_MINI");
   
   grpAttrItem.push(item);
   
   showGrpAttr();
}

function showGrpAttr(){
	var length=grpAttrItem.length;
	var str="";
	if(length<=0){
		str="当前没有已选择的行业应用！";
	}else {
		str="<div class='c_content' id='scene' > <table cellpadding='0' cellspacing='0' class='threeCol'>";
		var r= length;
		for(var i=0;i<length;i++){
			if(i%3==0 ){
				str=str+"<tr align='left'>";
				str=str+"<td class='label'>"+grpAttrItem[i].grpAttrMniName+"</td>";
				str=str+"<td><input type='button' class='btnInside' value='删除' ";
				str= str+"onclick='delGrpAttr(\""+grpAttrItem[i].grpAttrMini+"\");'></td>";
				if(r==1){
					str=str+"<td class='label></td><td></td><td class='label></td><td></td></tr>";
				}
//				}else if(r==2){
//					str=str+"<td class='label></td><td class='label></td></tr>";
//				}
			}else {
			   if(i%3==1){
				   str=str+"<td class='label'>"+grpAttrItem[i].grpAttrMniName+"</td>";
					str=str+"<td><input type='button' class='btnInside' value='删除' ";
					str= str+"onclick='delGrpAttr(\""+grpAttrItem[i].grpAttrMini+"\");' ></td>";
					if(i==length-1){
						str=str+"<td class='label></td><td class='label></td></tr>";
					}
			   }else if(i%3==2){
				    str=str+"<td class='label'>"+grpAttrItem[i].grpAttrMniName+"</td>";
					str=str+"<td><input type='button' class='btnInside' value='删除' ";
					str= str+"onclick='delGrpAttr(\""+grpAttrItem[i].grpAttrMini+"\");'></td>";
					if(i==length-1){
						str=str+"<td class='label></td><td class='label></td></tr>";
					}else {
						str=str+"</tr><tr>";
					}
			   }	   
			}
		}
		str=str+"</table></div>"
	}
	$("GRP_ATTR_DIV").style.display="";
	$("GRP_ATTR_DIS").style.display="";
	$("GRP_ATTR_DIS").innerHTML="";
	$("GRP_ATTR_DIS").innerHTML=str;
}

function delGrpAttr(grpAttrMini){
	  var lenght = grpAttrItem.length;
	  if(length<=0){
		  alert("当前没有选择的行业应用，不允许删除");
		  return;
	  }
	  var tempGrpAttrItem=[];
	  for (var i =0,n=0;i<lenght;i++){
		  if(grpAttrItem[i].grpAttrMini!=grpAttrMini){
			  tempGrpAttrItem[n++]=grpAttrItem[i];
		  }
	  }	 
	  grpAttrItem=[];
	  
	  for(var i=0;i<tempGrpAttrItem.length;i++){
		  grpAttrItem[i]=tempGrpAttrItem[i];
	  }
	  showGrpAttr();
	  
}
//tfs 108056 end
//QC:96543 END
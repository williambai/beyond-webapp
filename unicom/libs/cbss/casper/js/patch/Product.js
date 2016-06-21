var win = new Cs.flower.Win();
var $productIdOfPkg;
var productArea="productArea";//默认"productArea",可以定义自己的显示区域
var prodPage="common.product.ProductHelper";

var userId = '';
var userIdA = '-1';
var idType = '1';
var relationTypeCode = '';
var specTag = '0';
var tradeTypeCode = '';
var score = '0';
var serialNumber = '';
var serialNumberInput = '';
var allNeedExp = '0';
var sumcount = 10;
var deviceNameTmp="";
var startDateTmp="";
var endDateTmp="";
var compBrand ="";
var showProductIdTemp = "";
var nodetemp;
var forSearchOpen = '0'; //产品模糊查询开关0关闭,1打开
var nodeForSearch = "";
if (!Cs.flower.Light)
    alert("请在页面中添加 Light.js 文件!");

var lightAttr = new Cs.flower.Light(undefined,3); //一列显示
var lightPtype = new Cs.flower.Light(undefined,3); //一列显示
var lightAssure = new Cs.flower.Light(undefined,3); //一列显示
var lightDevice = new Cs.flower.Light(undefined,3); //一列显示
var lightNetCardPtype= new Cs.flower.Light(undefined,3); //一列显示

var saleProductNode = "" ;
var dPackageType ="";
var myDeviceTradeInfo ="";
var myDeviceAllInfo ="";
var myDeviceFeeList ="";

var drawprov = "";// 省份预付费 存放刷新的场景 
var checkThi = "0";//总部预付费存放 场景判断 0 输入串号  1 输入iccid 不绑定终端
var checkThiPro = "1" //省份预付费是否绑定终端 1 绑定
var lastResNo = ""; //取消预占时用 终端编码
var lastResType = "";//取消预占时用 终端类型
var wxskProductId=""; //套包上网卡绑定的主产品
var wxskSubProductId=""; //套包上网卡绑定的附加产品

//TFS 108056 BEGIN
var groupUserId = "";
//TFS 108056 END

//是否缓存
var noCache = true;

//用户原基本产品编码
var curProductId = '';

//产品预约生效时间
var preStartDate = '';

//基本产品复选框  added by tangz@2009-1-1 0:33
var baseProduct=null;

//新基本产品编码
var newProdId = '';

//新品牌编码
var newBrandCode = '';

//新网别编码
var newNetCode = '';

//新预付后付标识
var newPrepayTag = '';

//基本产品生效时间
var mProdStartDate = '';

//原基本产品终止时间(基本产品生效时间减1秒)
var mOldProdEndDate = '';

//产品查询框
var searchProd = '';

//基本产品失效时间
var mProdEndDate = '';

//置灰的主产品数量
var memDisProdCount = 0;

//用户原活动类型编码
var productTypeCode = '';

//用户新活动类型编码
var newProductTypeCode = '';

//主产品数量
var mProdCount = 0;

//成员产品数量（针对集团业务）
var memProdCount = 0;

//所有产品、元素不可以选择，用于展示用户原有产品、元素信息(true)
var allDisabled = false;

//是否只获取用户包、元素信息
var onlyUserInfos = '0';

//开户时基本产品生效时间设置.
var openBaseProdDate = '';

//用户资料返档变产品标示
var recordOpenUserChgPro =false;

var provinceCode = Cs.ctrl.PageData.getProvinceCode() ;

var _userEparchyCode = "";
var _userCityCode = "";
var _userCallingArea = "";

var specialTimeStr = "";

var spePurchaseTimeStr = "";  // 指定购机生效时间，续约使用

var lightDiscntItemValue ="";

Cs.ctrl.Trade.CallingAreaInfo ={};

var tradeAssure =[];
var tradeAttr = [];
var selectTypeStr ="";
var tradeNeedAssure ="";
var isPartActive ="";
var isOtherExchange = "0";
//qc:4673 begin
var cfsfPtypeTag ="0";
//qc:4673 end
//by 271612 begin
var termcalFlag = "0";   //标识终端设备是否校验
//by 271612 end
//根据号码获取用户编码
function getUserId(serialNumberInput){
	$("USER_ID_OUTPUT").value="";
	Cs.Ajax.swallowXml(prodPage, "getUserId","&serialNumberInput="+serialNumberInput);
}
//获取的用户编码赋值
function evaluateUserId(node){
	if(node.childNodes.length<1){
		win.alert("该号码没有获取到有效用户编码，请确认该号码是否正确");
		return;
	}else{
		var userIdOutput = node.childNodes[0].getAttribute("userId");
		$("USER_ID_OUTPUT").value=userIdOutput;
		
	}
}

//48563 begin 增加一个全角输入的判断限制
function quanjiao(obj)
{
    var str=obj.value;
    if (str.length>0)
    {
        for (var i = str.length-1; i >= 0; i--)
        {
            unicode=str.charCodeAt(i);
            if (unicode>65280 && unicode<65375)
            {
                alert("不能输入全角字符，请输入半角字符");
                obj.value=str.substr(0,i);
            }
        }
    }
}
//48563 end 增加一个全角输入的判断限制

//根据活动获取活动下面产品列表
function getProductInfoByType(prodType,brandCode,newProductId){

	//返回prodInfoByType节点
	var strNewProductId="";
	if(typeof(newProductId)!='undefined') strNewProductId = newProductId;
	Cs.Ajax.swallowXmlCache("prodInfoByTypeBand:"+prodType+brandCode, prodPage, "getProductInfoByType", "productTypeCode="+prodType+"&brandCode="+brandCode+"&root=1000"+"&productId="+strNewProductId+"&userEparchyCode="+_userEparchyCode+"&userCityCode="+_userCityCode+"&userCallingArea="+_userCallingArea, '', '', noCache);
}


function getProductInfoByType1(prodType,brandCode,newProductId,groupId){
	
	//返回prodInfoByType节点
	var strNewProductId="";
	if(typeof(newProductId)!='undefined') strNewProductId = newProductId;
	Cs.Ajax.swallowXmlCache("prodInfoByTypeBand:"+prodType+brandCode, prodPage, "getProductInfoByType1", "productTypeCode="+prodType+"&brandCode="+brandCode+"&groupId="+groupId+"&root=1000"+"&productId="+strNewProductId+"&userEparchyCode="+_userEparchyCode+"&userCityCode="+_userCityCode+"&userCallingArea="+_userCallingArea, '', '', noCache);
}
//根据活动获取活动下面产品列表+产品属性
function getProductInfoByTypeAndItem(prodType,brandCode,newProductId,productItem,groupId){
	//返回prodInfoByType节点
	var strNewProductId="";
	if(typeof(newProductId)!='undefined') strNewProductId = newProductId;
	var params = "productItem="+productItem+"&productTypeCode="+prodType+"&brandCode="+brandCode+"&root=1000"+"&productId="+strNewProductId+"&userEparchyCode="+_userEparchyCode+"&userCityCode="+_userCityCode+"&userCallingArea="+_userCallingArea+"&tradeTypeCode="+tradeTypeCode;
	params+="&groupId="+groupId;
	//tfs 108056 begin
	params+="&groupUserId="+groupUserId; 
	//tfs 108056 end
	if(getRightCode() == "csChangeUser"){
		if(oldUserGroupInfo&&oldUserGroupInfo.IS_IVPN_USER&&oldUserGroupInfo.IS_IVPN_USER=="yes"){
			params+="&isIvpnUser="+oldUserGroupInfo.IS_IVPN_USER;
			params+="&ivpnCbssUserId="+oldUserGroupInfo.CBSS_USER_ID;
			params+="&relationTypeCode="+oldUserGroupInfo.RELATION_TYPE_CODE;
		}
	}
	Cs.Ajax.swallowXmlCache("prodInfoByTypeBand:"+prodType+brandCode, prodPage, "getProductInfoByType", params, '', '', noCache);
}

//主副卡 begin
function getProductInfoByTypeAndItem1(prodType,brandCode,newProductId,productItem,groupId,productTag){
	//返回prodInfoByType节点
	var strNewProductId="";
	if(typeof(newProductId)!='undefined') strNewProductId = newProductId;
	var params = "productItem="+productItem+"&productTypeCode="+prodType+"&brandCode="+brandCode+"&root=1000"+"&productId="+strNewProductId+"&userEparchyCode="+_userEparchyCode+"&userCityCode="+_userCityCode+"&userCallingArea="+_userCallingArea+"&tradeTypeCode="+tradeTypeCode;
	params+="&groupId="+groupId;
	params+="&groupUserId="+groupUserId; 
	params+="&productTag="+productTag;
	if(getRightCode() == "csChangeUser"){
		if(oldUserGroupInfo&&oldUserGroupInfo.IS_IVPN_USER&&oldUserGroupInfo.IS_IVPN_USER=="yes"){
			params+="&isIvpnUser="+oldUserGroupInfo.IS_IVPN_USER;
			params+="&ivpnCbssUserId="+oldUserGroupInfo.CBSS_USER_ID;
			params+="&relationTypeCode="+oldUserGroupInfo.RELATION_TYPE_CODE;
		}
	}
	Cs.Ajax.swallowXmlCache("prodInfoByTypeBand:"+prodType+brandCode, prodPage, "getProductInfoByType", params, '', '', noCache);
}
//主副卡 end

//集团批量预开户根据活动获取活动下面产品列表+产品属性
function getProductInfoByTypeAndItem2(prodType,brandCode,newProductId,productItem,groupId,createMode){
	//返回prodInfoByType节点
	var strNewProductId="";
	if(typeof(newProductId)!='undefined') strNewProductId = newProductId;
	var params = "productItem="+productItem+"&productTypeCode="+prodType+"&brandCode="+brandCode+"&root=1000"+"&productId="+strNewProductId+"&userEparchyCode="+_userEparchyCode+"&userCityCode="+_userCityCode+"&userCallingArea="+_userCallingArea+"&tradeTypeCode="+tradeTypeCode;
	params+="&groupId="+groupId;
	//tfs 108056 begin
	params+="&groupUserId="+groupUserId; 
	//tfs 108056 end
	params+="&createMode="+createMode;
	
	Cs.Ajax.swallowXmlCache("prodInfoByTypeBand:"+prodType+brandCode, prodPage, "getProductInfoByType", params, '', '', noCache);
}

//根据产品编码获取产品信息
function getPagProInfoByProductId(brandCode,newProductId,subProductId){
	//返回prodInfoByType节点
	if(typeof(newProductId)!='undefined') wxskProductId = newProductId;
	if(typeof(subProductId)!='undefined') wxskSubProductId = subProductId;
	var params = "&brandCode="+brandCode+"&productId="+wxskProductId+"&subProductId="+wxskSubProductId+"&userEparchyCode="+_userEparchyCode+"&userCityCode="+_userCityCode+"&userCallingArea="+_userCallingArea+"&tradeTypeCode="+tradeTypeCode;
	Cs.Ajax.swallowXmlCache("prodInfoByBand:"+brandCode, prodPage, "getPagProInfoByProductId", params, '', '', noCache);
}
//获取无线上网卡主产品
function getWileLessProductInfo(prodType,brandCode,newProductId,groupId,parentPtypeCode){
	//返回prodInfoByType节点
	var strNewProductId="";
	if(typeof(newProductId)!='undefined') strNewProductId = newProductId;
	var params = "&productTypeCode="+prodType+"&brandCode="+brandCode+"&root=3G01"+"&productId="+strNewProductId+"&userEparchyCode="+_userEparchyCode+"&userCityCode="+_userCityCode+"&userCallingArea="+_userCallingArea+"&tradeTypeCode="+tradeTypeCode;
	params+="&groupId="+groupId +"&productTag=" + "WILE"+"&parentPtypeCode="+parentPtypeCode;
	Cs.Ajax.swallowXmlCache("prodInfoByTypeBand:"+prodType+brandCode, prodPage, "getProductInfoByType", params, '', '', noCache);
}

//获取无线上网卡4G主产品
function getWileLessProductInfo4G(prodType,brandCode,newProductId,groupId,parentPtypeCode,root){
	//返回prodInfoByType节点
	var strNewProductId="";
	if(typeof(newProductId)!='undefined') strNewProductId = newProductId;
	var params = "&productTypeCode="+prodType+"&brandCode="+brandCode+"&root="+root+"&productId="+strNewProductId+"&userEparchyCode="+_userEparchyCode+"&userCityCode="+_userCityCode+"&userCallingArea="+_userCallingArea+"&tradeTypeCode="+tradeTypeCode;
	params+="&groupId="+groupId +"&productTag=" + "WILE"+"&parentPtypeCode="+parentPtypeCode+"&groupUserId="+groupUserId;
	Cs.Ajax.swallowXmlCache("prodInfoByTypeBand:"+prodType+brandCode, prodPage, "getProductInfoByType", params, '', '', noCache);
}

//获取无线上网卡主产品 和getWileLessProductInfo  一致，输入的参数多了个createType
function getWileLessProductInfo1(prodType,brandCode,newProductId,groupId,parentPtypeCode){
	//返回prodInfoByType节点
	var strNewProductId="";
	if(typeof(newProductId)!='undefined') strNewProductId = newProductId;
	var params = "&productTypeCode="+prodType+"&brandCode="+brandCode+"&root=3G01"+"&productId="+strNewProductId+"&userEparchyCode="+_userEparchyCode+"&userCityCode="+_userCityCode+"&userCallingArea="+_userCallingArea+"&tradeTypeCode="+tradeTypeCode;
	params+="&groupId="+groupId +"&productTag=" + "WILE"+"&parentPtypeCode="+parentPtypeCode + "&createType=BATWILE";
	Cs.Ajax.swallowXmlCache("prodInfoByTypeBand:"+prodType+brandCode, prodPage, "getProductInfoByType", params, '', '', noCache);
}
//根据网别获取产品【甘肃】
function getProductInfoByTypeNetcode(prodType,brandCode,netTypeCode){
	//返回prodInfoByType节点
	Cs.Ajax.swallowXmlCache("prodInfoByTypeBand:"+prodType+brandCode+netTypeCode, prodPage, "getProductInfoByTypeNetcode", "productTypeCode="+prodType+"&brandCode="+brandCode+"&root=1000"+"&netTypeCode="+netTypeCode, '', '', noCache);
}

//根据活动获取活动下面产品列表(贵州固网特殊处理)
function getProductInfoByType_GZGW(prodType,brandCode,userKind,netTypeCode){
	//返回prodInfoByType节点
	Cs.Ajax.swallowXmlCache("prodInfoByTypeBand:"+prodType+brandCode+userKind+netTypeCode, prodPage, "getProductInfoByType_GZGW", "productTypeCode="+prodType+"&brandCode="+brandCode+"&root=1000"+"&userKind="+userKind+"&netTypeCode="+netTypeCode, '', '', noCache);
}
/**
 * 根据活动获取活动下面产品列表(用于产品变更)
 * @param prodTypeA 用户源活动类型编码
 * @param prodTypeB 变更活动类型编码
 * @return
 * @author zhoush
 */
 //qc 12527 begin
function getProductInfoByTypeTrans(prodTypeA, prodTypeB,productId,groupId){ 
	//返回prodInfoByType节点
	
	if (productId == undefined)
		Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&groupUserId="+groupUserId+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo), '','', noCache);
	else{
		if (groupId == undefined)
			Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&groupUserId="+groupUserId+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo)+"&productId="+productId, '','', noCache);
		else
			Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&groupUserId="+groupUserId+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo)+"&productId="+productId+"&groupId="+groupId, '','', noCache);
	}
	//qc 12527 end
}

/**
 *
 * @param prodTypeA
 * @param prodTypeB
 * @param productId
 * @param groupId
 */
function getProductInfoByTypeTransForRelationType(prodTypeA, prodTypeB, relationType){
    Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&groupUserId="+groupUserId+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo)+"&relationType="+relationType, '','', noCache);
}

//TFS 26315 begin
function getProductInfoByTypeTransFor4G(prodTypeA,prodTypeB,productId,rightCode,groupId){ 
	//返回prodInfoByType节点
	
	if (productId == undefined)
		Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&groupUserId="+groupUserId+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo), '','', noCache);
	else{
		if (groupId == undefined)
			Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&groupUserId="+groupUserId+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo)+"&productId="+productId+"&rightCode="+rightCode, '','', noCache);
		else
			Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&groupUserId="+groupUserId+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo)+"&productId="+productId+"&groupId="+groupId+"&rightCode="+rightCode, '','', noCache);
	}	
}
//TFS 26315 end
//qc 98518 begin
//TODO ? CallingAreaInfo={"CITY_CODE": "852001", "USER_CALLING_AREA": "", "EPARCHY_CODE": "0851"}
function getProductInfoByTypeTransTradeType(prodTypeA, prodTypeB,tradeTypeCode,productId,groupId){ 
	tradeTypeCode= tradeTypeCode||'';
	if (productId == undefined)
		Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo)+"&tradeTypeCode="+tradeTypeCode, '','', noCache);
	else{
		if (groupId == undefined)
			Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo)+"&productId="+productId+"&tradeTypeCode="+tradeTypeCode, '','', noCache);
		else
			Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo)+"&productId="+productId+"&groupId="+groupId+"&tradeTypeCode="+tradeTypeCode, '','', noCache);
	}
}
//qc 98518 end
/**
 * 根据活动获取活动下面产品列表(传入trade_type_code和net_type_code暂时为活动变更使用) 20110730
 * @param prodTypeA 用户源活动类型编码
 * @param prodTypeB 变更活动类型编码
 * @param prodTypeB 变更活动类型编码
 * @param prodTypeB 变更活动类型编码
 * @return
 * @author wuxg
 */
function getProductInfoByTypeTransWithFilter(prodTypeA, prodTypeB,tradeTypeCode,netTypeCode,prepayTag,productId,groupId)
{
	//返回prodInfoByType节点	
	//change by wangwf 2014-03-11 begin 输入参数增加权限编码
	//var params = "tradeTypeCode="+tradeTypeCode+"&prepayTag="+prepayTag+"&netTypeCode="+netTypeCode+"&userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo);	
	var params = "tradeTypeCode="+tradeTypeCode+"&rightCode="+getRightCode()+"&prepayTag="+prepayTag+"&netTypeCode="+netTypeCode+"&userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo);	
	//change by wangwf 2014-03-11 end	
	if (productId != undefined)
		params+= "&productId="+productId;
	params+="&groupId="+groupId;
	Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans",params, '','', noCache);
}

/**
 * 根据活动获取活动下面产品列表(用于产品变更)
 * @param prodTypeA 用户源活动类型编码
 * @param prodTypeB 变更活动类型编码
 * curProductId 用户当前产品ID  全局变量
 * @return
 */
function getProductInfoByTypeTransOld(prodTypeA, prodTypeB){
		//返回prodInfoByType节点
	Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo)+"&curProductId=" + curProductId, '','', noCache);
}


/**
 * 根据活动获取活动下面产品列表(用于产品变更)【内蒙】
 * @param prodTypeA 用户源活动类型编码
 * @param prodTypeB 变更活动类型编码
 * @return
 * @author zhoush
 */
function getProductInfoByTypeTransNM(prodTypeA, prodTypeB, tempTag, cuTag){
	
	//返回prodInfoByType节点
	Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&tempTag="+tempTag+"&cuTag="+cuTag+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo), '','', noCache);
}
//baoqgle@20100908 为了组合拆分是能结束附件产品增加了关系类型
function getProductInfoByTypeTransNMComp(prodTypeA, prodTypeB, productId,relationType){
    //返回prodInfoByType节点
    Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTrans", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&compTag=1" + "&productId="+productId+"&relationType="+relationType+"&CallingAreaInfo="+Object.toJSON(Cs.ctrl.Trade.CallingAreaInfo), '','', noCache);
}

/**
 * 根据活动获取活动下面产品列表(用于产品变更)
 * @param prodTypeA 用户源活动类型编码
 * @param prodTypeB 变更活动类型编码
 * @return
 * @author zhoush
 */
//qc:32630 begin
//qc:10235 begin
function getProductInfoByTypeTransRela(prodTypeA, prodTypeB,relyCode,netCode,productIdA,newRoleCode){
	
	//返回prodInfoByType节点
	Cs.Ajax.swallowXmlCache("prodInfoByTypeTrans:"+prodTypeB, prodPage, "getProductInfoByTypeTransRela", "userId="+userId+"&productTypeCodeA="+prodTypeA+"&productTypeCodeB="+prodTypeB+"&relationTypeCode="+relyCode+"&netTypeCode="+netCode+"&productIdA="+productIdA+"&roleCode="+newRoleCode, '','', noCache);
}
//qc:10235 end
//qc:32630 end
function showProductInfoByArea(showArea,node)
{
	var prodLayout = new Cs.flower.LayoutHelper(showArea, 1); 
	prodLayout.cellClass=function(){return ""}; //设置为无式样 
	var showPlusProduct = node.showPlusProduct;
	var icount = 0;
  
    var baseProductNodeXml = new Cs.util.XML();
	 baseProductNodeXml.loadXML(node.xml);	
	 baseProductNode = baseProductNodeXml.documentElement; 
    for(var i=0; i<baseProductNode.childNodes.length; i++)
	 {
   	if(baseProductNode.childNodes[i].getAttribute("root")){
			if(baseProductNode.childNodes[i].getAttribute("root") =="SALE")
			{
			    baseProductNode.removeChild(baseProductNode.childNodes[i]);
			    i--;
			}
	 	}
	 } 
	
	
	prodLayout.drawNewAddFieldset("产品选择列表",baseProductNode.childNodes, function(nodes,item){//changed by zhangxiaoping for fieldset style
		var product = Cs.util.Utility.node2JSON(item); 
	
		if (typeof(product.deviceName)!='undefined')
		{
			deviceNameTmp=product.deviceName;
		}
		if (typeof(product.bindStartDate)!='undefined' || typeof(product.bindEndDate)!='undefined' ){		
			startDateTmp=product.bindStartDate;
			endDateTmp=product.bindEndDate;
		}
		var a = new Array;
		var bflag = false;
		if((","+showProductIdTemp+",").indexOf(","+product.productId+",")>=0)bflag = true;
		
		if((tradeTypeCode=='10'||tradeTypeCode == '110'||tradeTypeCode=='340'||tradeTypeCode == '120'||tradeTypeCode=='127')&&product.productMode == '00'&&product.modifyTag=='0'&&((","+showProductIdTemp+",").indexOf(","+product.productId+",")<0)){

				     if(++icount>sumcount)return a.join("");
		}
		a.push("<div class='e_title'><input type='checkbox' name='_productinfos' class='radio' onclick='onProductClick(\"");
		a.push(product.productId);
		a.push ("\",");
		a.push("this.checked");
		a.push(");");
		a.push("initPtypeArea(\"");
		a.push(product.productId);
		a.push ("\")'");
		// tfs:82468 无线上网卡4G MiFi终端 begin
		// 增加产品属性，限制用户必选购买终端，已经可购买终端的类型
		// TFS 121862 增加 itemItmPrdResponsible itemItmPrdGroupType
		a.push(geneAttrString(product, 'productId,productName,productMode,_submitStartDate,_submitEndDate,brandCode,modifyTag,itemId,maxNumber,minNumber,enableTag,startAbsoluteDate,startOffset,startUnit,endEnableTag,endAbsoluteDate,endOffset,endUnit,startDate,endDate,netTypeCode,prepayTag,hasAttr,needExp,productInvalid,hideButton,itemSaleLimitTradetype,itemSaleLimitTradetypeExc,prodLowCost,rsrvValue2'
				+ ',itemWirelessNetworkCardType,itemIsMustBuyTerminal,itemItmPrdResponsible,itemItmPrdGroupType'));
		// tfs:82468 无线上网卡4G MiFi终端 end
		if(product.productTypeCode){
		
			a.push(geneAttrString(product, 'productTypeCode'));
		}
		a.push(" elementTypeCode='P'");
		a.push(" parentArea=\"" + showArea + "\"");
		//_startDate：产品生效时间, _endDate：产品结束时间
		var prodDate = compProdDate(product);
		
		
		if(specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&product.modifyTag == '0'){//特殊指定时间 add by zhangyangshuo
			a.push(" _startDate=\"" + specialTimeStr + "\"");
			a.push(" _endDate=\"" + prodDate._endDate + "\"");	
		}else{
			a.push(" _startDate=\"" + prodDate._startDate + "\"");
			a.push(" _endDate=\"" + prodDate._endDate + "\"");		
		}
		if (product.useTag=="1") //必选
			a.push(" checked disabled");
		if (product.useTag=="2") //默认
			a.push(" checked");
		if(product.modifyTag == '1') a.push(" disabled");
		else if(product.modifyTag == '9'){ 
			if(product.productMode=='60'){ 
				a.push(" checked");
				
			}else{
				a.push(" checked");
			}
			
		}
		
		 
		
		if(product.hideButton=='1') a.push(" disabled");
		
		if ($("GROUP_ACTAG") && $F("GROUP_ACTAG") == "GROUP_ACTAG" && product.productMode=='50' && product.modifyTag =="0")
			allDisabled = false;
		
		if(allDisabled) a.push(" disabled");
				
		a.push(" _thisType=\"product\"");
		a.push(' id="_p');
		a.push(product.productId);
		a.push('"/>');

		var prclass = 'black';
		if(product.modifyTag == '1') {
			//内蒙未生效产品 设为蓝色 
			if("NMCU"==$('pagecontext').provinceId){
				if(prodDate._startDate>Cs.ctrl.Trade.getSysDate())
					prclass = 'black';
				else
					prclass = 'red';
			}else
				prclass = 'red';
			
		}
		
		
		
		else if(product.modifyTag == '9')
		    { 
		        if(prodDate._startDate.substring(0,10)==Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), "3", 1).substring(0,10))
		            prclass = '#F75000';
		        else
		            //prclass = '#F75000';//prclass = 'black';  QC需求ESS_DQ_20110727_024 默认产品颜色为橙色  
		            prclass = 'red';
		    }
		else prclass = 'black';  
		
		if (product.productExplain){
		    a.push("<span");
		    a.push(" id='showcolor" + product.productId +"'");
		    a.push(" style='color:" + prclass + "' explain='"+product.productExplain+"'>");
		}
	    else{
		    a.push("<span");
		    a.push(" id='showcolor"+product.productId+"'");		    		
		    a.push(" style='color:" + prclass + "'>");
		}
		var prodModeName = '';
		if(product.productMode == '00') prodModeName = '  [基本产品]';
		else if(product.productMode == '01') prodModeName = '  [附加产品]';
		else if(product.productMode == '60') prodModeName = '  [附加产品]';
		else if(product.productMode == '20') prodModeName = '  [成员可选产品]';
		else if(product.productMode == '50') prodModeName = '  [营销产品]';
		
		if(product.brandCodeTag&&product.brandCodeTag=="1"&&product.brandName){
			prodModeName+='[品牌：'+product.brandName+']';
		}
		
		var needExp = '';
		if(allNeedExp == '1') product.needExp = '1';
		if(product.modifyTag == '0' && product.needExp == '1') needExp = "<span style='color:red'> * </span>";
		a.push("<span onclick='queryPackageInfo(\"");
		a.push(product.productId);
		a.push("\")' ondblclick='copyToClip(\"");
		a.push(product.productName+prodModeName+"("+product.productId+")");
		a.push("\",true)' />");
		if (product.hasAttr&&!product.hasAttr.blank()&&product.hasAttr!="0"){
	        a.push("<a href='javascript:void(0)' style='color:" + prclass + "' onclick='setAttr1(\"");
	        a.push(product.productName+prodModeName+"("+product.productId+")");
	        a.push("\" )'>");
		}
		a.push(product.productName+prodModeName);
		if (product.hasAttr&&!product.hasAttr.blank()&&product.hasAttr!="0")
	        a.push("</a>");
		a.push("</span>");
		a.push(needExp)
		a.push("</span>");
		
		
	    if(!product.hideButton||product.hideButton!="1"){
		a.push("<span>");
		a.push(' <img class="unexpand" id="closeopen');
		a.push(product.productId);
		a.push('"');
		//if(product.productMode == '20'&&(tradeTypeCode!="1025"&&tradeTypeCode!="1080")) a.push('style="display:none"');
		a.push(" src='/images-custserv/win/close.gif' style='cursor:hand' onclick='queryPackageInfo(\"");	
		
		a.push(product.productId);
		a.push("\")' />");
		a.push("</span>");
		a.push("<span>");
		a.push(" <img ");
		a.push(" src='/images-custserv/win/q2.gif' style='cursor:hand' onclick='setDateAttr(this)'");
		a.push("/>");
		a.push("</span>");
		}
		a.push('</div>');
		a.push('<div id="p');
		a.push(product.productId);
		if(product.productMode == '20'&&(tradeTypeCode!="1025"&&tradeTypeCode!="1080"))
			a.push('" style="display:none" first="true"></div>');
		else
			a.push('" style="display:none" first="true"></div>');
		return a.join("");
	
	},function(){
		var a = new Array;
	if((tradeTypeCode=='10'||tradeTypeCode == '110'||tradeTypeCode=='340'||tradeTypeCode == '120'||tradeTypeCode=='127') &&icount>sumcount){

		     nodetemp = node;
			a.push("<div class='e_title' style='cursor:hand' ");

			a.push(" onclick=moreProduct(nodetemp,");
			var productIdTemp = "";
			for(var t =sumcount;t<node.childNodes.length;t++){
				var prodTemp = Cs.util.Utility.node2JSON(node.childNodes[t]);
				if(prodTemp.productMode == '00'&&(","+showProductIdTemp+",").indexOf(","+prodTemp.productId+",")<0) {
					productIdTemp = productIdTemp+","+prodTemp.productId;
					compBrand = prodTemp.brandCode;
				}
			}
			productIdTemp = productIdTemp.substring(1);
			a.push("\"");
			a.push(productIdTemp);
			a.push("\",\"");
			a.push(showArea);
			a.push("\") ");
			a.push(">");
			a.push("<a href='javascript:void(0)'>更多基本产品</a></div>");//changed by zhangxiaoping  for link style change
			}
		return a.join("");
	});		
	//by xuwanlong 产品模糊查询 begin
	if(tradeTypeCode == '120' && showArea == 'productArea'){
		var baseProductNodeXml123 = new Cs.util.XML();
	    baseProductNodeXml123.loadXML(baseProductNode.xml);	
	    nodeForSearch = baseProductNodeXml123.documentElement;
	    forSearchOpen = '1';
	    var rt = "\r\n";
	    searchProd = "<div class=\"c_search\"  style=\"margin-right:0px;\">" + rt +
	        "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"twoCol containBtn\">" + rt +
	            "<tr>" + rt +
	                 "<td class=\"label\">产品别名：</td>" + rt +
	                 "<td><input id=\"queryProductName\" class=\"txt\" style=\"margin-right:5px;\"/>" + rt +                             
	                 "<input type=\"button\" id=\"productNameQuery\" class=\"btnInside\" value=\"查询\" onclick=\"queryProductInfoByName();\" onmouseover=\"this.className='btnInside btnInsideOver'\" onmouseout=\"this.className='btnInside btnInsideOff'\"></td>" + rt +                            
	            "</tr>" + rt +
	       "</table>" + rt +                                                                                                    
	       "</div> ";	   
	    $(showArea).innerHTML = searchProd + $(showArea).innerHTML;		
	}	
	//by xuwanlong 产品模糊查询 end
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
		 //qc:51882 begin
		  if(prod.checked && (prod.getAttribute('productMode') == '60'||( prod.getAttribute('productMode')=='00'  && tradeTypeCode==796))&&prod.getAttribute('parentArea') == productArea) {
		//qc:51882 end	
			  //循环累积基础产品
			  queryPackageInfo(prod.getAttribute('productId'));
			  			
			 }
	     }); 
	
	 try{
	if (typeof explainToTips != 'undefined' && explainToTips instanceof Function)
	    explainToTips("docTip", 300, $(showArea));
	   }catch(e){}
}

/**
 * 根据产品名称模糊查询，过滤产品列表
 * 
 * @author xuwanlong
 */
function queryProductInfoByName(){
	//取全局变量nodeForSearch
	var baseProductNodeXml1 = new Cs.util.XML();
	baseProductNodeXml1.loadXML(nodeForSearch.xml);	
	var nodeTempForSearch = baseProductNodeXml1.documentElement;
	//判断输入框是否输入，没有输入不刷新产品列表
	if($F("queryProductName") != ""){
	  for(var index=0; index<nodeTempForSearch.childNodes.length; index++){
	  	//ifChick 标记页面是否选中此产品，如果选中，就不过滤
	  	if(nodeTempForSearch.childNodes[index].getAttribute("ifChick") == "1"){
	  		continue;
	  	}
	  	if(nodeTempForSearch.childNodes[index].getAttribute("modifyTag") == "0"){
	  		var queryProductName = $F("queryProductName");
	 	    var sourceStr = nodeTempForSearch.childNodes[index].getAttribute("productName");
	 	    if(KMP(sourceStr,queryProductName) == -1){	 		
	 		    nodeTempForSearch.removeChild(nodeTempForSearch.childNodes[index]);
	 		    index--;
	 	 }
	  	}	 		
	  } 
	}
	//win.alert("modifyTag"+text);
	showQueryProductInfoByName(nodeTempForSearch);
}
/**
 * KMP算法，用于产品列表模糊查询,生成匹配表
 * 
 * 
 * @author xuwanlong
 */
function kmpGetStrPartMatchValue(str) {
      var prefix = [];
      var suffix = [];
      var partMatch = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var newStr = str.substring(0, i + 1);
        if (newStr.length == 1) {
          partMatch[i] = 0;
        } else {
          for (var k = 0; k < i; k++) {
            prefix[k] = newStr.slice(0, k + 1);
            suffix[k] = newStr.slice(-k - 1);
            if (prefix[k] == suffix[k]) {
              partMatch[i] = prefix[k].length;
            }
          }
          if (!partMatch[i]) {
            partMatch[i] = 0;
          }
        }
      }
      return partMatch;
}

/**
 * KMP算法，用于产品列表模糊查询
 * @param sourceStr 原字符串
 * @param targetStr 目标串
 * @author xuwanlong
 */
function KMP(sourceStr, searchStr) {
    //生成匹配表
    var part = kmpGetStrPartMatchValue(searchStr);
    var sourceLength = sourceStr.length;
    var searchLength = searchStr.length;
    var result; //返回匹配到的位置
    var i = 0;
    var j = 0;

   for (; i < sourceStr.length; i++) { //最外层循环，主串

        //子循环
        for (var j = 0; j < searchLength; j++) {
            //如果与主串匹配
            if (searchStr.charAt(j) == sourceStr.charAt(i)) {
                //如果是匹配完成
                if (j == searchLength - 1) {
                  result = i - j;
                  break;
                } else {
                  //如果匹配到了，就继续循环，i++是用来增加主串的下标位
                  i++;
                }
            } else {
              //在子串的匹配中i是被叠加了
              if (j > 1 && part[j - 1] > 0) {
                i += (i - j - part[j - 1]);
              } else {
                //移动一位
                i = (i - j)
              }
              break;
            }
        }

        if (result || result == 0) {
          break;
        }
    }


    if (result || result == 0) {
      return result
    } else {
    	//没有匹配到返回-1
      return -1;
    }
}

/**
 * 根据产品名称模糊查询，过滤产品列表,重绘产品列表
 * @param node 模糊查询得到的产品node
 * 
 * @author xuwanlong
 */
function showQueryProductInfoByName(node){
	var showArea = "productArea";
	var prodLayout = new Cs.flower.LayoutHelper(showArea, 1); 
	prodLayout.cellClass=function(){return ""}; //设置为无式样 
	var showPlusProduct = node.showPlusProduct;
	var icount = 0;
  
    var baseProductNodeXml = new Cs.util.XML();
	 baseProductNodeXml.loadXML(node.xml);	
	 baseProductNode = baseProductNodeXml.documentElement; 
	 
    for(var i=0; i<baseProductNode.childNodes.length; i++){
   	    if(baseProductNode.childNodes[i].getAttribute("root")){
			if(baseProductNode.childNodes[i].getAttribute("root") =="SALE")
			{
			    baseProductNode.removeChild(baseProductNode.childNodes[i]);
			    i--;
			}
	 	}
	 } 
    
	prodLayout.drawNewAddFieldset("产品选择列表",baseProductNode.childNodes, function(nodes,item){//changed by zhangxiaoping for fieldset style
		var product = Cs.util.Utility.node2JSON(item); 
	
		if (typeof(product.deviceName)!='undefined')
		{
			deviceNameTmp=product.deviceName;
		}
		if (typeof(product.bindStartDate)!='undefined' || typeof(product.bindEndDate)!='undefined' ){		
			startDateTmp=product.bindStartDate;
			endDateTmp=product.bindEndDate;
		}
		var a = new Array;
		var bflag = false;
		if((","+showProductIdTemp+",").indexOf(","+product.productId+",")>=0)bflag = true;
		
		if((tradeTypeCode=='10'||tradeTypeCode == '110'||tradeTypeCode=='340'||tradeTypeCode == '120'||tradeTypeCode=='127')&&product.productMode == '00'&&product.modifyTag=='0'&&((","+showProductIdTemp+",").indexOf(","+product.productId+",")<0)){

				     if(++icount>sumcount)return a.join("");
		}
		a.push("<div class='e_title'><input type='checkbox' name='_productinfos' class='radio' onclick='onProductClick(\"");
		a.push(product.productId);
		a.push ("\",");
		a.push("this.checked");
		a.push(");");
		a.push("initPtypeArea(\"");
		a.push(product.productId);
		a.push ("\")'");
		// tfs:82468 无线上网卡4G MiFi终端 begin
		// 增加产品属性，限制用户必选购买终端，已经可购买终端的类型
		a.push(geneAttrString(product, 'productId,productName,productMode,_submitStartDate,_submitEndDate,brandCode,modifyTag,itemId,maxNumber,minNumber,enableTag,startAbsoluteDate,startOffset,startUnit,endEnableTag,endAbsoluteDate,endOffset,endUnit,startDate,endDate,netTypeCode,prepayTag,hasAttr,needExp,productInvalid,hideButton,itemSaleLimitTradetype,itemSaleLimitTradetypeExc,prodLowCost,rsrvValue2'
				+ ',itemWirelessNetworkCardType,itemIsMustBuyTerminal'));
		// tfs:82468 无线上网卡4G MiFi终端 end
		if(product.productTypeCode){
		
			a.push(geneAttrString(product, 'productTypeCode'));
		}
		a.push(" elementTypeCode='P'");
		a.push(" parentArea=\"" + showArea + "\"");
		//_startDate：产品生效时间, _endDate：产品结束时间
		var prodDate = compProdDate(product);
		
		
		if(specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&product.modifyTag == '0'){//特殊指定时间 add by zhangyangshuo
			a.push(" _startDate=\"" + specialTimeStr + "\"");
			a.push(" _endDate=\"" + prodDate._endDate + "\"");	
		}else{
			a.push(" _startDate=\"" + prodDate._startDate + "\"");
			a.push(" _endDate=\"" + prodDate._endDate + "\"");		
		}
		if (product.useTag=="1") //必选
			a.push(" checked disabled");
		if (product.useTag=="2") //默认
			a.push(" checked");
		if(product.modifyTag == '1') a.push(" disabled");
		else if(product.modifyTag == '9'){ 
			if(product.productMode=='60'){ 
				a.push(" checked");
				
			}else{
				a.push(" checked");
			}
			
		}
		//ifChick == '1' 为标志已经选择产品不过滤
		if(product.ifChick == '1')
		  a.push(" checked");
		 
		
		if(product.hideButton=='1') a.push(" disabled");
		
		if(allDisabled) a.push(" disabled");
				
		a.push(" _thisType=\"product\"");
		a.push(' id="_p');
		a.push(product.productId);
		a.push('"/>');

		var prclass = 'black';
		if(product.modifyTag == '1') {
			//内蒙未生效产品 设为蓝色 
			if("NMCU"==$('pagecontext').provinceId){
				if(prodDate._startDate>Cs.ctrl.Trade.getSysDate())
					prclass = 'black';
				else
					prclass = 'red';
			}else
				prclass = 'red';
			
		}
		
		
		
		else if(product.modifyTag == '9')
		    { 
		        if(prodDate._startDate.substring(0,10)==Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), "3", 1).substring(0,10))
		            prclass = '#F75000';
		        else
		            //prclass = '#F75000';//prclass = 'black';  QC需求ESS_DQ_20110727_024 默认产品颜色为橙色  
		            prclass = 'red';
		    }
		else prclass = 'black';  
		
		if (product.productExplain){
		    a.push("<span");
		    a.push(" id='showcolor" + product.productId +"'");
		    a.push(" style='color:" + prclass + "' explain='"+product.productExplain+"'>");
		}
	    else{
		    a.push("<span");
		    a.push(" id='showcolor"+product.productId+"'");		    		
		    a.push(" style='color:" + prclass + "'>");
		}
		var prodModeName = '';
		if(product.productMode == '00') prodModeName = '  [基本产品]';
		else if(product.productMode == '01') prodModeName = '  [附加产品]';
		else if(product.productMode == '60') prodModeName = '  [附加产品]';
		else if(product.productMode == '20') prodModeName = '  [成员可选产品]';
		else if(product.productMode == '50') prodModeName = '  [营销产品]';
		
		if(product.brandCodeTag&&product.brandCodeTag=="1"&&product.brandName){
			prodModeName+='[品牌：'+product.brandName+']';
		}
		
		var needExp = '';
		if(allNeedExp == '1') product.needExp = '1';
		if(product.modifyTag == '0' && product.needExp == '1') needExp = "<span style='color:red'> * </span>";
		a.push("<span onclick='queryPackageInfo(\"");
		a.push(product.productId);
		a.push("\")' ondblclick='copyToClip(\"");
		a.push(product.productName+prodModeName+"("+product.productId+")");
		a.push("\",true)' />");
		if (product.hasAttr&&!product.hasAttr.blank()&&product.hasAttr!="0"){
	        a.push("<a href='javascript:void(0)' style='color:" + prclass + "' onclick='setAttr1(\"");
	        a.push(product.productName+prodModeName+"("+product.productId+")");
	        a.push("\" )'>");
		}
		a.push(product.productName+prodModeName);
		if (product.hasAttr&&!product.hasAttr.blank()&&product.hasAttr!="0")
	        a.push("</a>");
		a.push("</span>");
		a.push(needExp)
		a.push("</span>");
		
		
	    if(!product.hideButton||product.hideButton!="1"){
		a.push("<span>");
		a.push(' <img class="unexpand" id="closeopen');
		a.push(product.productId);
		a.push('"');
		if(product.productMode == '20'&&(tradeTypeCode!="1025"&&tradeTypeCode!="1080")) a.push('style="display:none"');
		a.push(" src='/images-custserv/win/close.gif' style='cursor:hand' onclick='queryPackageInfo(\"");	
		
		a.push(product.productId);
		a.push("\")' />");
		a.push("</span>");
		a.push("<span>");
		a.push(" <img ");
		a.push(" src='/images-custserv/win/q2.gif' style='cursor:hand' onclick='setDateAttr(this)'");
		a.push("/>");
		a.push("</span>");
		}
		a.push('</div>');
		a.push('<div id="p');
		a.push(product.productId);
		if(product.productMode == '20'&&(tradeTypeCode!="1025"&&tradeTypeCode!="1080"))
			a.push('" style="display:none" first="false"></div>');
		else
			a.push('" style="display:none" first="true"></div>');
		return a.join("");
	
	},function(){
		var a = new Array;
	if((tradeTypeCode=='10'||tradeTypeCode == '110'||tradeTypeCode=='340'||tradeTypeCode == '120'||tradeTypeCode=='127') &&icount>sumcount){

		     nodetemp = node;
			a.push("<div class='e_title' style='cursor:hand' ");

			a.push(" onclick=moreProduct(nodetemp,");
			var productIdTemp = "";
			for(var t =sumcount;t<node.childNodes.length;t++){
				var prodTemp = Cs.util.Utility.node2JSON(node.childNodes[t]);
				
				if(prodTemp.productMode == '00'&&(","+showProductIdTemp+",").indexOf(","+prodTemp.productId+",")<0) {
					productIdTemp = productIdTemp+","+prodTemp.productId;
					compBrand = prodTemp.brandCode;
				}
			}
			productIdTemp = productIdTemp.substring(1);
			a.push("\"");
			a.push(productIdTemp);
			a.push("\",\"");
			a.push(showArea);
			a.push("\") ");
			a.push(">");
			a.push("<a href='javascript:void(0)'>更多基本产品</a></div>");//changed by zhangxiaoping  for link style change
			}
		return a.join("");
	});	
	
	$(showArea).innerHTML = searchProd + $(showArea).innerHTML;
	
}
function moreProduct(nodes,productIdTemp,showArea){
	if(compBrand!='COMP'){
		var retInfo = popupDialog("popupdialog.ShowMoreProduct", "init", "&productIdTemp="+productIdTemp+"&curProductId="+curProductId,"更多基本产品","800", "500", "CSM");
	if(typeof retInfo == 'undefined'){
		return;
	}
	showProductIdTemp+=","+retInfo.retInfo; 
	showProductInfoByArea(showArea,nodes);
		}else{
				var retInfo = popupDialog("popupdialog.ShowMoreProduct","init",
			"&productIdTemp="+ productIdTemp+"&isComp="+isComp+"&userEparchyCode="+_userEparchyCode+"&userCityCode="+_userCityCode+"&userCallingArea="+_userCallingArea
			+"&userId="+userId+"&productTypeCode="+productTypeCode+"&curProductId="+curProductId,"更多基本产品","800","500","CSM");
				if(typeof retInfo == 'undefined'){
					return;
				}
				showProductIdTemp+=","+retInfo.retInfo; 
				showProductInfoByArea(showArea,nodes);
		}
}

function drawAgreeArea(){
	  var str = new Array;
	  str.push("<table><tr><td class=\"label\">");
	  str.push("<input type='radio' class='radio' id='join' name='agreeType' onclick='afterSelectAgreeMent(this)' value='"+"0"+"'/>"+"参加活动");
	  str.push("</td>");
	  str.push("<td id = 'nojoinTd' class=\"label\">");
	  str.push("<input type='radio' class='radio' id='nojoin' name='agreeType' onclick='afterSelectAgreeMent(this)' value='"+"1"+"'/>"+"不参加活动");
	  str.push("</td>");
	  //后付费无线上网卡个人开户
	  if(getRightCode() =="csCreateWilePerUserTrade" || getRightCode() =="csCreateWilePerUserTrade4G"|| getRightCode() =="csCreateWilePerUserJoinWO"){
		  str.push("<td id = 'ekjoinTd' class=\"label\">");
		  str.push("<input type='radio' class='radio' id='ekjoin' name='agreeType' onclick='afterSelectAgreeMent(this)' value='"+"2"+"'/>"+"微卡");
		  str.push("</td>");  
	  }	  
	  str.push("</tr>");
	  str.push("</table>");
	  if(getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() == "csCreateWilePerUserTrade" || getRightCode() == "csCreateWileGrpUserTrade4G"|| getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO"){//无线上网卡集团开户
	    str.push("<div id='netCardPtypeArea' style='display:none'>");
	  	//str.push("<tr class='label'><td>可选活动: </td>");
	  	//str.push("<td><select class='txt' jwcid='NETCARD_PTYPE@flower:LookupCombo' source='ognl:util.getCommParam('CSM','2647','','PARAM_CODE','PARAM_NAME')' value='KB10' />");
	  	//str.push("</td>");
	  	//str.push("</tr>");
	  	str.push("</div>");
	  }

	  $("deviceAgreeArea").innerHTML = str.join("");  
	
}

function drawDevicePtypeArea(saleProductNode){

      if(getRightCode() == "csCreateWileBossYUserTrade" || getRightCode() == "csCreateWileBossYUserTrade4G" || getRightCode() == "csCreateWileProvYUserTrade") {
      	if($("deviceAgreeAreaParent1"))$("deviceAgreeAreaParent1").style.display = "none";
      	if($("deviceAgreeAreaParent2"))$("deviceAgreeAreaParent2").style.display = "none"; 	
      }
	  if(getRightCode() == "csCreateWileGrpUserTrade"|| getRightCode() == "csCreateWilePerUserTrade"|| getRightCode() == "csCreateWileGrpUserTrade4G" || getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO"){ //无线上网卡集团开户 刷是否购买终端场景
	  	  var str = new Array;
		  str.push("<table><tr><td class=\"label\">");
		  str.push("<input type='radio' class='radio' id = 'buy' name='terminalType' onclick='afterSelectTerminal(this)' value='"+"0"+"'/>"+"购买终端");
		  str.push("</td>");
		  str.push("<td class=\"label\">");
		  str.push("<input type='radio' class='radio' id='nobuy' name='terminalType' checked = 'true' onclick='afterSelectTerminal(this)' value='"+"1"+"'/>"+"不购买终端");
		  str.push("</td>");
		  str.push("</tr>");
		  str.push("</table>");
	  	  $("devicePtypeArea").innerHTML = str.join("");  
	  }else if(getRightCode() == "csCreateWileBossYUserTrade" || getRightCode() == "csCreateWileBossYUserTrade4G" || getRightCode() == "csCreateWileProvYUserTrade"){
	  	  lightPtype.parent=$("devicePtypeArea");
	  	  if(getRightCode() == "csCreateWileProvYUserTrade"){
	  	  	 //lightPtype.lighting_first("PROV_SERIAL_CTRL"+"|provArea"); //省份预付费 套包终端场景
	  	  	 //drawprov = "PROV_SERIAL_CTRL";//默认刷无终端的那个,是否有终端根据 选择的产品来  改为： 根据包类型来
	  	  	 
	  	  	 checkThiPro = $("PRODUCT_TYPE_CODE_BOSS$dspl").rowselected.cells[2].innerHTML; //是否绑定终端
	  	  	
	  	  	 if(checkThiPro == "1") lightPtype.lighting_first("PROV_TERMINAL_CTRL"+"|provArea"); //根据选择的产品类型来
	  	  	 if(checkThiPro == "0") lightPtype.lighting_first("PROV_SERIAL_CTRL"+"|provArea");	  
	  	  	 lightPtype.callback=function(){
	  	  	 	if($("DEVICE_TYPE"))Cs.flower.LookupCombo.setValue($("DEVICE_TYPE"), "05");
	  	  	 }	  	 
	  	  	 
	  	  }else{
	  	  	 checkThi = $("PRODUCT_TYPE_CODE_BOSS$dspl").rowselected.cells[2].innerHTML;//允许输入校验的内容 0：imei 1：iccid
	  	  	 if(checkThi == "1") lightPtype.lighting_first("BOSS_ICCID_CTRL"+"|bossArea"); //根据选择的产品类型来
	  	  	 if(checkThi == "0") lightPtype.lighting_first("BOSS_TERMINAL_CTRL"+"|bossArea");
	  	  	 lightPtype.callback=function(){
	  	  	 	if($("DEVICE_TYPE"))Cs.flower.LookupCombo.setValue($("DEVICE_TYPE"), "05");
	  	  	 }
	  	  }
	  	  if($("deviceArea"))$("deviceArea").innerHTML ="";
	  	  if($("deviceAgreeArea"))$("deviceAgreeArea").innerHTML ="";
	  	  if($("deviceProdutArea"))$("deviceProdutArea").innerHTML ="";
	  
	  }else{
	  	 lightPtype.parent=$("devicePtypeArea");
		 lightPtype.lighting_first("SALE_PTYPE"+"|ptypeArea");  //购机  场景
		// if(!(tradeTypeCode == '120' && $F('_NET_TYPE_CODE') == 'WV')){
	     lightPtype.callback=function(){
			 if( $("SALE_PRODUCT_LIST$lst") ){
				
				
			//-----------    -wangl
				//TFS:276005 增加批量预开户 wangy3 start
				 if((getRightCode() == "csBatCreateGroupUser")||(getRightCode() == "csBatCreateUserTrade")||(getRightCode() == "csBatCreateGroupTrade")||(getRightCode() == "csBatWoEGoTrade")||(getRightCode() == "csBatPreCreateUserTrade")){
					for(var i=0; i<saleProductNode.childNodes.length; i++)
				 	 {
				    	 if((saleProductNode.childNodes[i].getAttribute("enumFieldCode").search('CFSF') == -1)
				    	 &&(saleProductNode.childNodes[i].getAttribute("enumFieldCode").search('ZSYW') == -1)
				    	 ){
				    	  saleProductNode.removeChild(saleProductNode.childNodes[i]);
				    	  i--;
				 	 	  }
				 	}

				 }//endif
				//------------wangl		
				$("SALE_PRODUCT_LIST$lst").value =saleProductNode.xml;
				Cs.flower.LookupCombo.update($('SALE_PRODUCT_LIST'));
				
			// 展现购机场景以后 各业务的处理
			if (typeof(afterdrawDevicePtypeArea) != 'undefined') 
		         afterdrawDevicePtypeArea();					
			}
	  	 }
	     
	  //} 
	     drawCurrentSaleProductInfo();
	  }

	  if(getRightCode() == "csCreateWilePerUserJoinWO"){
		  $("nobuy").checked = true;
	  }
	  
	
}

function drawCurrentSaleProductInfo(){
	if(getRightCode() == "csPurchaseTrans" && userId != ""){
		Cs.Ajax.register("currentSaleProductInfo", afterGetCurrentSaleProductInfo);
   	 	var params={
   	 		'userId': userId 
   	 	};
   	 	Cs.Ajax.swallowXml(prodPage,"getCurrentSaleProduct",params);	    	 
    }
}

function afterGetCurrentSaleProductInfo(node){
	var nodeXml = new Cs.util.XML();
	nodeXml.loadXML(node.xml);
	var xmlDoc = nodeXml.documentElement;
	showProductInfoByArea("currentSaleProductArea",xmlDoc);
}

function changePtype(){
	
	if ($F('SALE_PRODUCT_LIST') == ""){
		$("deviceProdutArea").innerHTML = "";
		return;
	}
	var prodInfo={};
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
	  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
		    //循环累积基础产品
		    prodInfo=prod;
		 }
     }); 
     
    isOtherExchange = "0";
    myDeviceAllInfo ="";
    //qc:4673 begin
    cfsfPtypeTag ="0"
    //qc:4673 end
    for(var i=0; i<saleProductNode.childNodes.length; i++)
 	{
    	if(saleProductNode.childNodes[i].getAttribute("enumFieldCode") == $F('SALE_PRODUCT_LIST'))
    	{
    		var obj ={};
    		dPackageType = saleProductNode.childNodes[i].getAttribute("paraCode2");
    		if (saleProductNode.childNodes[i].getAttribute("paraCode1") =="noProvideDevice"){//非自备机
    			$("deviceSelectArea").innerHTML ="";
    			$("deviceArea").innerHTML ="";
    			obj.value ="0";selectTypeStr ="0";$("deviceProdutArea").innerHTML = "";		
    			
    		}else if (saleProductNode.childNodes[i].getAttribute("paraCode1") =="provideDevice"){//自备机
    			$("deviceSelectArea").innerHTML ="";
    			$("deviceArea").innerHTML ="";
    			obj.value ="1";selectTypeStr ="1";$("deviceProdutArea").innerHTML = "";
    		}else if (saleProductNode.childNodes[i].getAttribute("paraCode1") =="giftExchange"){//礼品促销
    			$("deviceSelectArea").innerHTML ="";
    			$("deviceArea").innerHTML ="";
    			obj.value ="2";selectTypeStr ="2";$("deviceProdutArea").innerHTML = "";
    			
    		}else if (saleProductNode.childNodes[i].getAttribute("paraCode1") =="otherExchange"){//其他
    			$("deviceSelectArea").innerHTML ="";
    			$("deviceArea").innerHTML ="";
    			//qc:4673 begin
    			obj.value ="3";selectTypeStr ="3";$("deviceProdutArea").innerHTML = ""; cfsfPtypeTag ="3";
    			//qc:4673 end
    		}else{		
    			win.alert("活动参数配置有误，请检查9888参数配置！");	
    			return;
    		}
    		
    		if (saleProductNode.childNodes[i].getAttribute("paraCode5") =="needAssure"){//必须担保
    			if( $("ASSURE_TYPE$lst") ){
    				Cs.flower.LookupCombo.disabled($('ASSURE_TYPE'),false);
    				$("ASSURE_TYPE$dspl").required = true;
    				obj.needAssure ="1";	
    				tradeNeedAssure ="1";		
    			}
    		}else{//不需要担保
    			if( $("ASSURE_TYPE$lst") ){
    				$("ASSURE_TYPE$dspl").required = false;
    				Cs.flower.LookupCombo.disabled($('ASSURE_TYPE'),true);
    				Cs.flower.LookupCombo.setValue($("ASSURE_TYPE"), "");
    				obj.needAssure ="0";
    				tradeNeedAssure ="0";
    			}
    		}
    		
    		if (saleProductNode.childNodes[i].getAttribute("paraCode4") =="needRight"){//判断权限
				obj.needRight ="1";		
				isCheckRight  = "1";
    		}else{
    			obj.needRight ="0";		
				isCheckRight  = "0";
    		}
    		
    		afterSelectDevice(obj);
    		
    	}
	}	
	
}

function afterSelectTerminal(obj){
		// tfs:82468 无线上网卡4G MiFi终端 begin 
		var selectedProduct = {};
		// tfs:82468 无线上网卡4G MiFi终端 end
    	var productBaseCount=0;
		$A(document.getElementsByName('_productinfos')).each(function(prod) {
		  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
		        productBaseCount++;
		        // tfs:82468 无线上网卡4G MiFi终端 begin
		        selectedProduct = prod;
		        // tfs:82468 无线上网卡4G MiFi终端 end 
			 }
	     });
	     if(productBaseCount==0)
	     {
	     	win.alert('请选择基础产品！');
	     	if($("buy"))$("buy").checked = false;
	     	return false;
	     }else if(productBaseCount>1)
	     {
	     	win.alert('基础产品只能选择一个！');
	     	if($("buy"))$("buy").checked = false;
	     	return false;
	     }
	     
//	    if(getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() == "csCreateWileGrpUserTrade4G"){//无线上网卡集团开户
//		  	if($("pRadio") && $("pRadio").checked &&　obj.value == "1"){
//		  		win.alert("无线上网卡集团开户-公众客户-  必须购买终端");	
//		  		$("nobuy").checked = false;
//		  		$("buy").click();
//		  		return false;	
//		  	}
//		}else if(getRightCode() == "csCreateWilePerUserTrade" || getRightCode() == "csCreateWilePerUserTrade4G"){//无线上网卡个人开户
//		  	if(obj.value == "1"){
//		  		//微卡 可以不购买需要购买终端
//		  		if($("ekjoin")&&(!$("ekjoin").checked)){
//			  		win.alert("无线上网卡个人开户  必须购买终端");	
//			  		$("nobuy").checked = false;
//			  		$("buy").click();
//			  		return false;	
//		  		}
//		  	}	
//		}
	if(obj.value == '0'){//购买终端
   		lightDevice.parent=$("deviceArea");
   		lightDevice.lighting_first("DEVICE_SELELCT_TYPE_0"+"|deviceArea");  
   		lightDevice.callback=function(){
   			// tfs:82468 无线上网卡4G MiFi终端 begin
   			// 05：3G上网终端(卡)、06：3G上网终端(本)
   			// 16：4G上网终端(卡)、17：4G上网终端(卡)
   			// 不能再设置为05了，
	  	  	//if($("DEVICE_TYPE")) Cs.flower.LookupCombo.setValue($("DEVICE_TYPE"), "05");
   			if($("DEVICE_TYPE")) Cs.flower.LookupCombo.setValue($("DEVICE_TYPE"), "16");
	  	  	// 如果是赠送4G MiFi终端，设置成4G MiFi终端且不能修改，如果以后产品可以选择终端了，就把这个属性去掉
	  	  	if($("DEVICE_TYPE") && selectedProduct.itemWirelessNetworkCardType) {
	  	  		// 这里就不能禁用终端类型，也不能指定终端类型。就得和以前一样在场景的js里限制用户能选择哪些终端，场景元素id：91101159。
	  	  		// 如果一个终端可以选择多个终端类型，产品属性中用“|”分割
	  	  		if (selectedProduct.itemWirelessNetworkCardType.indexOf("|") != -1) {
	  	  			// 多个属性到后台重新组织一下无线上网卡终端类型，先不写成通用的js了
	  	  			var registerName = "wireleeNetworkCard";
	  	  			Cs.Ajax.register(registerName, function(node){
	  	  				$('DEVICE_TYPE$lst').value = node.xml;
	  	  				Cs.flower.LookupCombo.update($('DEVICE_TYPE'));
	  	  			});
		  	  		var params = "enumCode=TERMINAL_RES_TYPE&filterValues=" + selectedProduct.itemWirelessNetworkCardType + "&registerName=" + registerName;
	  	  			Cs.Ajax.swallowXml("common.product.ProductHelper", "filterEnumerate", params, "");
	  	  		} else {
		  	  		Cs.flower.LookupCombo.setValue($("DEVICE_TYPE"), selectedProduct.itemWirelessNetworkCardType);
		  	  		Cs.flower.LookupCombo.disabled($("DEVICE_TYPE"), true);
	  	  		}
	  	  	}
	  	  	// tfs:82468 无线上网卡4G MiFi终端 end 
	  	}
	}else if(obj.value == '1'){//不购买终端
    	$("deviceArea").innerHTML ="";	
    }
    if(getRightCode() == "csCreateWileBossYUserTrade" || getRightCode() == "csCreateWileBossYUserTrade4G") $("deviceArea").innerHTML ="";	
    if(getRightCode() == "csCreateWileProvYUserTrade") $("deviceArea").innerHTML ="";

}

function queryProductinfo(){
	
	
	if( $("ASSURE_TYPE$lst") ){
    	if (tradeNeedAssure=="1" && $F("ASSURE_TYPE") ==""){
    		win.alert("请选择担保类型！");	
	  		return;
    	}
    }
	if (!Cs.ctrl.Validate.verifyData("devicePtypeArea")){
           return false;
    }
    
    if (!Cs.ctrl.Validate.verifyTradeData("deviceAssureArea")){
           return false;
    }
    
    if (!Cs.ctrl.Validate.verifyTradeData("deviceArea")){
           return false;
    }
    //QC:11311 BEGIN by zhanght@20120714
    if($("QC_TAG_11311")!='undefined' && $("QC_TAG_11311")!=null){
	    if($("QC_TAG_11311") && $("QC_TAG_11311").value=="1"){
	    	if ($("ASSURE_NO_PRODUCTASSURE") && $F("ASSURE_NO_PRODUCTASSURE").empty()){
	        	win.alert("协议： 请输入内容");	
	        	return;
	        }    	
	    }
    }
    //QC:11311 END
    if ($("DEVICE_IMEI") && $F("DEVICE_IMEI").empty()){
    	win.alert("请先校验串号！");	
    	return;
    }
			
   
   
   /* var Ischecked  = false;
    if ($("deviceSelectArea").innerHTML !=""){
    	var x=document.getElementsByName("selectType");
		for (var i=0;i<x.length;i++){
			if(x[i].checked == true){
				Ischecked = true;
				break;
			}
		}
		if (!Ischecked){
	    	win.alert("请选择购机类型！");
	    	return;
		}
    }*/
     
    var prodInfo={};
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
	  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
		    //循环累积基础产品
		    prodInfo=prod;
		 }
     }); 
    
    var deviceType = "";
    var deviceBrand = "";
    var productTypeCodePara ="";
    var deviceNumber ="";
    var groupIdEss ="";
    var orgDeviceBrandCode ="";
    myDeviceAllInfo ="";
    
    if (myDeviceTradeInfo != ""){
    	 var deviceInfo = myDeviceTradeInfo.evalJSON();
    	 if(typeof(deviceInfo.orgDeviceBrandCode)!='undefined' && deviceInfo.orgDeviceBrandCode != "")
    	 	orgDeviceBrandCode = deviceInfo.orgDeviceBrandCode;
    	 else
    	 	orgDeviceBrandCode ="";
    }
   
    if ($("RESOURCES_MODEL_CODE"))
    	deviceType = $F("RESOURCES_MODEL_CODE");
    if ($("RESOURCES_BRAND_CODE"))
    	deviceBrand = $F("RESOURCES_BRAND_CODE");
    if ($("deviceno"))
    	deviceNumber = $F("deviceno");
    if (selectTypeStr =="2" && $("GIFT_PRODUCT_TYPE_LIST"))
    	productTypeCodePara = $F('GIFT_PRODUCT_TYPE_LIST');
    else
    	productTypeCodePara = $F('SALE_PRODUCT_LIST');
    
    try{
     if ($("GROUP_ID_ESS"))
    	groupIdEss = $F("GROUP_ID_ESS");
    }catch(e){
    	groupIdEss ="";
    }
    	 
	//QC:96653 BEGIN
	var tradeTypeCode ="";
	if($("_TRADE_TYPE_CODE")!=null){
		tradeTypeCode=$F("_TRADE_TYPE_CODE");
	}
	
	var serialNumber=Try.these(
			function(){return $F('SERIAL_NUMBER')},
			function(){return $F('serialNumber')}
		)||'';
	var psptId=Try.these(
			function(){return $F('PSPT_ID')},
			function(){return $F('psptIdS')}
		)||'';
	
	// tfs:129141 begin 
	if($("GROUP_USER_ID") && (getRightCode() == "csChangecompuser" || getRightCode() == "csCreatecompuser"|| getRightCode() == "csChangecompuserOrderBack") ) {
		groupUserId = $("GROUP_USER_ID").value;
	}
	// tfs:129141 end 
	
	var params={
			'productTypeCode': productTypeCodePara,
			'assureType': $F("ASSURE_TYPE"),
			'deviceType': deviceType,
			'deviceBrand': deviceBrand,
			'deviceNumber': deviceNumber,
			'baseSaleProductId': prodInfo.productId,
			'root': 'SALE',
			'isCheckRight': isCheckRight,
			'isOtherExchange': isOtherExchange,
			'groupIdEss': groupIdEss,
			'orgDeviceBrandCode': orgDeviceBrandCode,
			'userEparchyCode': _userEparchyCode,
			'userCityCode': _userCityCode,
			'userCallingArea': _userCallingArea,
			'tradeTypeCode': tradeTypeCode,
			'groupUserId': groupUserId,
			'serialNumber': serialNumber,
			'psptId': psptId,
			'rightCode': getRightCode(),
			'userId': userId||''
		};
	
	Cs.Ajax.swallowXmlCache("prodInfoByTypeBand1:"+$F('SALE_PRODUCT_LIST'), prodPage, "getProductInfoByType", $H(params).toQueryString(), '', '', noCache);
	//QC:96653 END
}

/**
 * 串号失去焦点后,对串号的校验函数
 */
function checkDeviceImeiInfo(obj){
	var cache = new Cs.flower.DataCache();
	//请相关人员把这些RightCode 为什么放在这解释一下 addby qiulh 
    if(getRightCode() == "csCreateWileBossYUserTrade" 
    	|| getRightCode() == "csCreateWileBossYUserTrade4G"
    	|| getRightCode()=='csCreateWileProvYUserTrade' 
    	|| getRightCode() == "csCreateWileGrpUserTrade" 
    	|| getRightCode() == "csCreateWilePerUserTrade"
        || getRightCode() == "csCreateWileGrpUserTrade4G"
        || getRightCode() == "csCreateWilePerUserTrade4G" 
        || getRightCode() == "csCreateWilePerUserJoinWO"){
    	var productBaseCount=0;
		var prodInfo={};
		//依次循环界面上的产品
		$A(document.getElementsByName('_productinfos')).each(function(prod) {
		  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
			    //循环累积基础产品
			    prodInfo=prod;
		        productBaseCount++
			 }
	     });
	     if(productBaseCount==0)
	     {
	    	//12467begin 不把串号清空，竟然不校验 伤不起  QC_TAG_12467 
	    	//因为12467不仅仅只用于北京，这个单子还要适配到其余5个省，故将之前打得tag部分注释掉 
	    	/*if($("QC_TAG_12467")!=undefined && $("QC_TAG_12467")!=null){
		    	  if($F("QC_TAG_12467")=="12467" &&getRightCode()=="csCreateWileProvYUserTrade"){
		    */
		    			if(getRightCode()=="csCreateWileProvYUserTrade"){
		    	    	$("DEVICE_IMEI").value="";
		    	    	$("DEVICE_IMEI").lastvalue="";
		    	    }
		    // }
		   //12467end
	     	win.alert('请选择基础产品！');
	     	return false;
	     }else if(productBaseCount>1)
	     {
	     	win.alert('基础产品只能选择一个！');
	     	return false;
	     }
	     geneBaseProductInfo();
	}else{
		if(obj.value == "" || obj.lastValue == obj.value) return;
	}
    var checkMod  ="";
    $("deviceProdutArea").innerHTML = "";
			
	Cs.Ajax.register("emeiCheckTradeInfo", dealDeviceTradeInfo);
	Cs.Ajax.register("imeiCheckFailed", dealDeviceImeiFail);
	Cs.Ajax.register("imeiFailed", dealDeviceImeiFail);
	Cs.Ajax.register("imeiCheckFail", dealDeviceImeiFail);
	
	var tradeIdCheck = "";
	if($("tradeIdCheck")) tradeIdCheck = $F("tradeIdCheck");
	else if($("_all_infos"))  tradeIdCheck = $F("_all_infos").evalJSON().TRADE_ID;

	var lastInfo = "";
	myDeviceTradeInfo ="";
	myDeviceFeeList ="";
	if(!lastResNo.blank() && !lastResType.blank()) lastInfo = "&LAST_NO=" + lastResNo +"&LAST_TYPE=" +lastResType;
	
	if((getRightCode()=="csCreateWileBossYUserTrade" || getRightCode() == "csCreateWileBossYUserTrade4G")&& checkThi == "1"){//总部预付费，输入iccid 调用总部终端校验 返回串号，号码
		var terminalType = "";
		if ($("DEVICE_TYPE")){
			if ($F("DEVICE_TYPE").empty()){
				win.alert("请先选择终端类型！");
				   $("simCardNo").lastValue="89860";
			       $("simCardNo").value ="89860";
				return;
			}
			if($("simCardNo").value == "89860") return;
			terminalType = $F("DEVICE_TYPE");
			dPackageType = '10';//   把simCardNo传入 调用总部终端校验 返回串号，号码
			if(terminalType == "06") dPackageType = "21"; // 套包上网本
			if($("PRODUCT_TYPE_CODE_BOSS")) dPackageType = $F("PRODUCT_TYPE_CODE_BOSS");
			Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","dealAfterInputEssImei","ICCID="+$F("simCardNo")+"&CANCELICCID="+$F("simCardNo").lastValue+"&TERMINAL_TYPE=" + terminalType+"&TRADE_TYPE_CODE="+tradeTypeCode+"&PRODUCT_ID="+""+"&dPackageType="+dPackageType + "&createUserType=boss" + "&TRADE_ID=" + tradeIdCheck + lastInfo);
		}
	}else{
		if ($F("DEVICE_IMEI").empty())
			return;
		var terminalType = "";
		if ($("DEVICE_TYPE")){
			if ($F("DEVICE_TYPE").empty()){
				win.alert("请先选择终端类型！");
				   $("DEVICE_IMEI").lastValue="";
			       $("DEVICE_IMEI").value ="";
				return;
			}
			terminalType = $F("DEVICE_TYPE");
		}
		if($("PRODUCT_TYPE_CODE_BOSS")) dPackageType = $F("PRODUCT_TYPE_CODE_BOSS");
		
		if(getRightCode() == "csCreateWileBossYUserTrade" || getRightCode() == "csCreateWileBossYUserTrade4G"){
			if(terminalType == "06") dPackageType = "21"; // 套包上网本
			Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","dealAfterInputEssImei","IMEI="+$F("DEVICE_IMEI")+"&CANCELIMEI="+$("DEVICE_IMEI").lastValue+"&TERMINAL_TYPE=" + terminalType+"&TRADE_TYPE_CODE="+tradeTypeCode+"&PRODUCT_ID="+""+"&dPackageType="+dPackageType+ "&TRADE_ID=" + tradeIdCheck+ lastInfo);
		}else if(getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() =="csCreateWilePerUserTrade" || getRightCode()=="csCreateWileProvYUserTrade" || getRightCode() =="csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWileGrpUserTrade4G" || getRightCode() =="csCreateWilePerUserJoinWO" ){
				dPackageType = '10';//非总部预付费套包的 此值固定为 10 裸终端
				if(terminalType == "06") dPackageType = "20";
				if(getRightCode()=="csCreateWileProvYUserTrade" && terminalType == "06") dPackageType = "21"; // 套包上网本
			Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","dealAfterInputEssImei","IMEI="+$F("DEVICE_IMEI")+"&CANCELIMEI="+$("DEVICE_IMEI").lastValue+"&TERMINAL_TYPE=" + terminalType+"&TRADE_TYPE_CODE="+tradeTypeCode+"&PRODUCT_ID="+""+"&dPackageType="+dPackageType+ "&TRADE_ID=" + tradeIdCheck+ lastInfo);
		}else{	
				/*var selectTypeStr ="";
 			    if ($("deviceSelectArea")){
					if ($("deviceSelectArea").innerHTML !=""){
				    	var x=document.getElementsByName("selectType");
						for (var i=0;i<x.length;i++){
							if(x[i].checked == true){
								 selectTypeStr= x[i].value;
								 break;
							}
						}
			    	}
			    }*/
			var activeType = $("SALE_PRODUCT_LIST").value;
			var params = "IMEI="+$F("DEVICE_IMEI")+"&CANCELIMEI="+$("DEVICE_IMEI").lastValue+"&TERMINAL_TYPE=" + terminalType+"&TRADE_TYPE_CODE="+tradeTypeCode+"&PRODUCT_ID="+""+"&dPackageType="+dPackageType+ "&TRADE_ID=" + tradeIdCheck+ lastInfo+"&selectTypeStr="+selectTypeStr+"&ACTIVE_TYPE="+activeType+"&PARAM="+Object.toJSON(lightDevice.getValue(null,true));
		
			if(typeof(changeElementPurchaseFlag)!='undefined'&& changeElementPurchaseFlag=="1")
				params += "&checkChgElementPur=1+&oldDeviceType="+oldDeviceType; 
			//增加预受理员工判断 传参增加预受理员工号。预占员工实际为此员工		 addby qiulh
			if(cache.get("preStaffId")!=undefined&&cache.get("preStaffId")!=null)
			   params += "&preStaffId="+cache.get("preStaffId")+"&preDepartId="+cache.get("preDepartId")+"&isPreOrder=1"; 	
			Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","dealAfterInputEssImei",params);
		}
	}
	//tfs:213896 特殊限制判断:终端已经被使用，不允许再次受理该终端业务 这代码有问题，应该放在终端校验成功结束后再用。 add by qiulh
	var para = "IMEI=" + $("DEVICE_IMEI").value;
	Cs.Ajax.swallowXml("personalserv.changeelement.ChangeElement","checkImeiLimit","param=" + encodeURIComponent(Object.toJSON(para.toQueryParams())),"正在校验,请稍候...");
	//tfs:213896 end
}

//tfs:213896 特殊限制判断:终端已经被使用，不允许再次受理该终端业务 这代码有问题，应该放在终端校验成功结束后再用。add by qiulh
function checkImei(obj){
	if ($F("DEVICE_IMEI").empty()){
		return;
	}else{
	var params = "IMEI=" + $("DEVICE_IMEI").value;	  
    params = params.toQueryParams();		       
	Cs.Ajax.swallowXml("personalserv.changeelement.ChangeElement", "checkImeiLimit", "param=" + encodeURIComponent(Object.toJSON(params)),"正在校验,请稍候...");
	}
}
//tfs:213896 end

/**
 * 串号校验成功的回调函数
 */
function dealDeviceTradeInfo(node){
	var other = Cs.util.Utility.node2JSON(node);    
	//串号可能返回多机型 begin
	var count = other.COUNT;
	if(count > 1){
		other = popupDialog("popupdialog.terminaldeal.ShowTerminalInfo", "initpage", "", "终端信息列表", "750",
				"400", "CSM");
		if(other == undefined || other.ok == undefined || !other.ok){
			$("DEVICE_IMEI").value ="" ;
			return;
		}
	}
	//串号可能返回多机型 end
	if(getRightCode() == "csCreateWileBossYUserTrade" || getRightCode() == "csCreateWileBossYUserTrade4G" ){
	  	lightPtype.setValue(other);//先显示场景信息，再校验号码
	  	$('serialNumber').value = node.getAttribute("serialNumber");
	  	$('simCardNo').value = node.getAttribute("simCardNo");
	  	//newSerialNumberExit($('serialNumber'));//号码资源不在省份管理，不需要校验
	  	//处理必要的号码，卡号信息用于台帐
	  	dealBossYUserNumInfo();
	}else if(getRightCode() == "csCreateWileProvYUserTrade"){
		lightPtype.setValue(other);
	}else if(getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() == "csCreateWilePerUserTrade" || getRightCode() == "csCreateWileGrpUserTrade4G" || getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO"){
		lightDevice.setValue(other);		
		if($("join") && $("join").checked && $("join").value == "0"){ //参加合约计划
			//刷 无线上网卡附加产品信息
			getWileSubProInfo(node.getAttribute("deviceno"));
		}
	}else{
		if (selectTypeStr !="2" && selectTypeStr !="3")//非礼品
    		lightDevice.setValue(other);  
    	else{
    		$("MYTRADEINFO").value= Object.toJSON(other);
    		lightAttr.setValue(other); 
    	} 	
	}
	
	if (selectTypeStr !="2" && selectTypeStr !="3"){
		myDeviceTradeInfo = Object.toJSON(other);
				
		if(lightAttr.parent !=null)
			lightAttr.setValue(other);
		myDeviceFeeList ="";	
		$("DEVICE_IMEI").lastValue=$F("DEVICE_IMEI");
	}
	
	if($("DEVICE_IMEI")) lastResNo = $F("DEVICE_IMEI");
	if($("DEVICE_TYPE")) lastResType = $F("DEVICE_TYPE");
}

/**
 * 串号校验失败的回调函数
 */
function dealDeviceImeiFail(node){
	if((getRightCode()=="csCreateWileBossYUserTrade" || getRightCode() == "csCreateWileBossYUserTrade4G") && checkThi == "1"){
		$("simCardNo").lastValue="89860";
		$("simCardNo").value ="89860";
	}
	if($("DEVICE_IMEI")){
		$("DEVICE_IMEI").lastValue="";
		$("DEVICE_IMEI").value ="";
	}
	myDeviceTradeInfo = "";
	myDeviceFeeList ="";
	if($("DEVICE_IMEI"))
		lastResNo = $F("DEVICE_IMEI");
	if($("DEVICE_TYPE"))	
		lastResType = $F("DEVICE_TYPE");
}

function getWileSubProInfo(deviceno){
	var zProductId = "";
	if (baseProduct!=null)
	{
		zProductId=baseProduct.productId;
	}else{
	    var productBaseCount=0;
		var prodInfo={};
		//依次循环界面上的产品
		$A(document.getElementsByName('_productinfos')).each(function(prod) {
		  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
			    //循环累积基础产品
			    prodInfo=prod;
		        productBaseCount++
			 }
	     });
	     if(productBaseCount==0)
	     {
	     	win.alert('请选择基础产品！');
	     	return false;
	     }else if(productBaseCount>1)
	     {
	     	win.alert('基础产品只能选择一个！');
	     	return false;
	     }
	     geneBaseProductInfo();
	     zProductId=baseProduct.productId;
	}
	if(zProductId.blank()) {win.alert("请选择刷新附加产品列表需要的主产品"); return false;}
	if($F("NETCARD_PTYPE").blank()){win.alert("请选择刷新附加产品列表需要的活动类型"); return false;}
	if(deviceno.blank()){
		win.alert("终端校验没有返回终端型号编码，请重新校验"); 
		lastResNo = $F("DEVICE_IMEI");
		lastResType = $F("DEVICE_TYPE");
		$("DEVICE_IMEI").value = "";
		return false;
	}
	var params = '&productType=' +$F("NETCARD_PTYPE") + "&mainProductId=" +zProductId + "&MachineTypeCode=" +deviceno
	             +'&parentPtypeCode=WXSK' + '&root=SALE';
	params=params.toQueryParams();  
	Cs.Ajax.register("prodInfoByTypeWILESUB", dealAfterGetSubProInfo);
	Cs.Ajax.swallowXml(prodPage,"getSubProductInfos",params);
}
function dealAfterGetSubProInfo(node){
	var productNodeXml = new Cs.util.XML(); 
	var productNode = "" ;
	productNodeXml.loadXML(node.xml);	
	productNode = productNodeXml.documentElement; 
	showProductInfoByArea("deviceProdutArea",productNode);
}
function showProductInfoBat(node){
	var productNodeXml = new Cs.util.XML(); 
	var productNode = "" ;
	productNodeXml.loadXML(node.xml);	
	productNode = productNodeXml.documentElement; 
	showProductInfoByArea("productArea",productNode);
}
function dealAfterGetPrePagProInfo(node){
	var productNodeXml = new Cs.util.XML(); 
	var productNode = "" ;
	productNodeXml.loadXML(node.xml);	
	productNode = productNodeXml.documentElement; 
	showProductInfoByArea("productArea",productNode);
	//3G预付费套包 获取产品后 产品唯一 默认勾选。
	//依次循环界面上的产品，主产品和参加合约计划的附加产品 都要默认必须
	
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
		if(prod.getAttribute('parentArea') == productArea) { 
		        if(prod.getAttribute('productMode')=="00"){
		  			$("_p"+prod.getAttribute('productId')).checked = true;
		  			//queryPackageInfo(prod.getAttribute('productId'));
		  			onProductClick(prod.getAttribute('productId'),true);
		        }
		        if(prod.getAttribute('productMode')=="50"){
		        	$("_p"+prod.getAttribute('productId')).checked = true;
		        } 
		 }
	});
}

function drawDeviceSelectArea(){
	  var str = new Array;
	  str.push("<table align =\"center\"><tr><td  class=\"label\">");
	  str.push("<input type='radio' class='radio' name='selectType' onclick='afterSelectDevice(this)' value='"+"0"+"'/>"+"非自备机入网");
	  str.push("</td>");
	  str.push("<td class=\"label\">");
	  str.push("<input type='radio' class='radio' name='selectType' onclick='afterSelectDevice(this)' value='"+"1"+"'/>"+"自备机入网");
	  str.push("</td>");
	  str.push("</tr>");
	  str.push("</table>");
	  $("deviceSelectArea").innerHTML = str.join("");  
	
}

function changeAssureType(){
   
   if( $("ASSURE_TYPE$lst") ){
	   $("deviceProdutArea").innerHTML = "";
	  lightAssure.parent=$("deviceAssureArea");
	  // qc 33729 begin
	   var cache = new Cs.flower.DataCache();
	   var custInfo = cache.get("custInfo"); 
	   var psptType=$("PSPT_TYPE_CODE") ? $("PSPT_TYPE_CODE").value:null;
	   var custType=$("CUST_TYPE") ? $("CUST_TYPE").value:null;
	  lightAssure.callback = function (){			 		  
			   if(((custInfo&&(custInfo.custType!='1'||custInfo.psptTypeCode!='4'))||((custType!=null&&custType!=1)||(psptType!=null&&psptType!="4")))&&$F("ASSURE_TYPE")=='W')
			   {
				   var win = new Cs.flower.Win();
				   win.alert('客户不是集团客户不能用这个担保类型，请修改!');
				   Cs.flower.LookupCombo.setValue($("ASSURE_TYPE"), "");
				   $("deviceAssureArea").innerHTML="";
				   return ;
			   }
		}	 
	  lightAssure.lighting_first("ASSURE_CHANGE_PTYPE_"+$F("ASSURE_TYPE")+"|assureArea");  
   }
     //qc 33729 end
}

function afterSelectDevice(obj){//自备机 非自备机选择

  var pTdeviceTag = true;
  myDeviceTradeInfo = "";
  myDeviceFeeList ="";
  $("deviceArea").innerHTML ="";
  $("iphoneDeviceArea").innerHTML ="";
  //qc:4673 begin
  isOtherExchange = "0";
  //qc:4673 end
  if(obj.value =="4"){	
  	 isOtherExchange = "1";
  	 lightDevice.parent=$("iphoneDeviceArea");
	 lightDevice.lighting_first("DEVICE_SELELCT_TYPE_"+obj.value+"|deviceArea");
  }else if(obj.value =="3"){
  	var prodInfo={};
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
	  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
		    //循环累积基础产品
		    prodInfo=prod;
		 }
     });
  	 Cs.Ajax.register("IphoneFormulaTag", afterCheckIphoneFormula);
	 Cs.Ajax.swallowXml(prodPage,"getIphoneFormula","selBaseProductId="+prodInfo.productId);
  }
  else{			
	  lightDevice.parent=$("deviceArea");
	  lightDevice.lighting_first("DEVICE_SELELCT_TYPE_"+obj.value+"|deviceArea");  
  }
   //自备机 非自备机选择以后 ,不同业务进行js处理
   lightDevice.callback = function()
   {
	  if (typeof(selectDeviceDealLight) != 'undefined') 
         selectDeviceDealLight();	
      
      if (typeof(obj.needAssure) != 'undefined' && obj.needAssure =="1"){
      	if (typeof(obj.needRight) != 'undefined' && obj.needRight =="1")
      		$Z('ASSURE_TYPE',5,'SEL_ASSURETYPE_BY_PTYPE|PRODUCT_TYPE_CODE='+$F('SALE_PRODUCT_LIST')+'~TRADE_EPARCHY_CODE='+$("pagecontext").epachyId+'~DEPART_ID='+$("pagecontext").deptId,'PARAM_NAME|PARAM_CODE|PARAM_NAME,PARAM_CODE','');
      	else
      		$Z('ASSURE_TYPE',5,'SEL_NORIGHT_ASSURE_TYPE|PRODUCT_TYPE_CODE='+$F('SALE_PRODUCT_LIST')+'~TRADE_EPARCHY_CODE='+$("pagecontext").epachyId,'PARAM_NAME|PARAM_CODE|PARAM_NAME,PARAM_CODE','');
      }
   }
 
}

function afterSelectAgreeMent(obj){

		var selBaseProductId ="";	
		myDeviceAllInfo ="";	
		$("iphoneDeviceArea").innerHTML ="";
		//tfs:291254  begin  add by monk  清除缓存，防止选择的产品混乱
		if ($("deviceProdutArea")){
			$("deviceProdutArea").innerHTML ="";
		}
		//tfs:291254  end
	    if(obj.value == '0' && (getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() == "csCreateWilePerUserTrade" || getRightCode() == "csCreateWileGrpUserTrade4G" || getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO")){ //无线上网卡集团开户 参加合约计划
	    	if($("netCardPtypeArea")) $("netCardPtypeArea").style.display = '';
	    	lightNetCardPtype.parent=$("netCardPtypeArea");
	   		lightNetCardPtype.lighting_first("NETCARD_SELECT_PTYPE"+"|netCardPtypeArea");  
	   		lightNetCardPtype.callback=function(){
	   			$Z("NETCARD_PTYPE",5,'SEL_PTYPE_WXSK|EPARCHY_CODE='+$("pagecontext").epachyId+'~TRADE_STAFF_ID='+$('pagecontext').staffId,"PARAM_NAME|PARAM_CODE|PARAM_NAME,PARAM_CODE","","",false);
	   			if($("NETCARD_PTYPE")){
					$("NETCARD_PTYPE$dspl").onrealvaluechange =function(){
						//QC:14853 Begin 统一版本合并--上网卡必须购买终端，默认为非自备 modified by jiaxl@2012-09-22
						if(selectTypeStr=="")selectTypeStr="0";
						//QC:14853 End 统一版本合并
						if(myDeviceTradeInfo != ""){
						    var purInfo = myDeviceTradeInfo.evalJSON();
							getWileSubProInfo(purInfo.deviceno);
						}
					}
			   }
		   }
	   		//默认需要购买终端
	   	 	$("buy").checked=true;
	    	afterSelectTerminal($("buy"));
	    }else if (obj.value == '1' && (getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() == "csCreateWilePerUserTrade" || getRightCode() == "csCreateWileGrpUserTrade4G" || getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO")){
	    	if($("netCardPtypeArea")) $("netCardPtypeArea").style.display = 'none';
	    	if($("deviceProdutArea")) $("deviceProdutArea").innerHTML = "";
	   		//默认需要购买终端
	   	 	$("buy").checked=true;
	    	afterSelectTerminal($("buy"));
	    }
	    else if (obj.value == '2' && (getRightCode() == "csCreateWilePerUserTrade" || getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO")){
	    	if($("netCardPtypeArea")) $("netCardPtypeArea").style.display = 'none';
	    	if($("deviceProdutArea")) $("deviceProdutArea").innerHTML = "";
	    	//默认不需要购买终端
	    	$("nobuy").checked=true;
	    	afterSelectTerminal($("nobuy"));
	    	//$A(document.getElementsByName("compShareRadio")).each(function(compSR){ if(compSR.value=="1")compSR.checked=true;});
	    }
	try{
		var productBaseCount=0;
		var prodInfo={};
		//依次循环界面上的产品
		$A(document.getElementsByName('_productinfos')).each(function(prod) {
		  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
			    //循环累积基础产品
			    prodInfo=prod;
		        productBaseCount++
			 }
	     });
	     if(productBaseCount==0)
	     {
	     	throw new Error('请选择基础产品！');
	     }else if(productBaseCount>1)
	     {
	     	throw new Error('基础产品只能选择一个！');
	     }
	     selBaseProductId = prodInfo.productId;
	     newProdId = prodInfo.productId;
	}catch(e){
	    if(getRightCode() != "csCreateWileGrpUserTrade" && getRightCode() != "csCreateWilePerUserTrade"
	     && getRightCode() != "csCreateWileBossYUserTrade" && getRightCode() != "csCreateWileBossYUserTrade4G" 
	     && getRightCode() != "csCreateWileProvYUserTrade" && getRightCode() != "csCreateWileGrpUserTrade4G" 
	     && getRightCode() != "csCreateWilePerUserTrade4G" && getRightCode() != "csCreateWilePerUserJoinWO")
	    {
			if( $("ASSURE_TYPE$lst") ){
				Cs.flower.LookupCombo.setValue($("ASSURE_TYPE"), "4");
				Cs.flower.LookupCombo.disabled($('ASSURE_TYPE'),true);
			}
			if( $("SALE_PRODUCT_LIST$lst") ){
				Cs.flower.LookupCombo.setValue($("SALE_PRODUCT_LIST"), "");
				Cs.flower.LookupCombo.disabled($('SALE_PRODUCT_LIST'),true);
			}
			if ($("QUERY_PRODUCT_BTN"))
				$("QUERY_PRODUCT_BTN").disabled =true;
		}
		win.alert(e.message);
		obj.checked =false;
		return;
		
	}
	if(getRightCode() != "csCreateWileGrpUserTrade" && getRightCode() != "csCreateWilePerUserTrade"
		&& getRightCode() != "csCreateWileBossYUserTrade" && getRightCode() != "csCreateWileBossYUserTrade4G" 
		&& getRightCode() != "csCreateWileProvYUserTrade" && getRightCode() != "csCreateWileGrpUserTrade4G" 
		&& getRightCode() !="csCreateWilePerUserTrade4G" && getRightCode() !="csCreateWilePerUserJoinWO")
	{
	if (obj.value =='1'){
		if( $("ASSURE_TYPE$lst") ){
			Cs.flower.LookupCombo.setValue($("ASSURE_TYPE"), "4");
			Cs.flower.LookupCombo.disabled($('ASSURE_TYPE'),true);
		}
		if( $("SALE_PRODUCT_LIST$lst") ){
			Cs.flower.LookupCombo.setValue($("SALE_PRODUCT_LIST"), "");
			Cs.flower.LookupCombo.disabled($('SALE_PRODUCT_LIST'),true);
		}
		myDeviceTradeInfo ="";
    	myDeviceFeeList ="";
    	isPartActive ="1";

	     assureInofo9=false;  //担保类型变成失效
    	 assureAccountInfoAll={}; //清空担保信息全局变量 
		
		$("deviceSelectArea").innerHTML ="";
		$("deviceArea").innerHTML ="";
		if ($("QUERY_PRODUCT_BTN"))
			$("QUERY_PRODUCT_BTN").disabled =true;
		//QC:05317 Begin
		var tmpNetTypeCode = $("_p"+curProductId) && $("_p"+curProductId).netTypeCode? $("_p"+curProductId).netTypeCode: "";
		Cs.Ajax.register("IphoneFormulaTag", afterCheckIphoneFormula);
		Cs.Ajax.swallowXml(prodPage,"getIphoneFormula","selBaseProductId="+selBaseProductId+"&curProductId="+curProductId
				+"&userId="+userId+"&tradeTypeCode="+tradeTypeCode+"&netTypeCode="+tmpNetTypeCode);
		//QC:05317 End
	}
	else if (obj.value =='0'){
		$("deviceArea").innerHTML ="";
		isPartActive ="0";
		if( $("ASSURE_TYPE$lst") ){
			Cs.flower.LookupCombo.disabled($('ASSURE_TYPE'),false);
		}
		if( $("SALE_PRODUCT_LIST$lst") ){
			Cs.flower.LookupCombo.disabled($('SALE_PRODUCT_LIST'),false);
			Cs.flower.LookupCombo.setValue($("SALE_PRODUCT_LIST"), "");
		}
		if ($("QUERY_PRODUCT_BTN"))
			$("QUERY_PRODUCT_BTN").disabled =false;
		
		}
	}
	
	if(obj.value=="1" && getRightCode() != "csCreateWileGrpUserTrade" && getRightCode() != "csCreateWilePerUserTrade" &&
	                  getRightCode() != "csCreateWileBossYUserTrade" && getRightCode() != "csCreateWileBossYUserTrade4G"
	                   && getRightCode() !='csCreateWileProvYUserTrade'
	                	  && getRightCode() != "csCreateWileGrpUserTrade4G" && getRightCode() != "csCreateWilePerUserTrade4G" && getRightCode() != "csCreateWilePerUserJoinWO"){
		$displayV("shAgreeDiv",false);
	}else{
		$displayV("shAgreeDiv",true);
	}
	
}

function afterCheckIphoneFormula(node){
	if(tradeTypeCode == "10"){
		var obj ={};obj.value ="4";obj.needAssure="0";obj.needRight ="1";selectTypeStr ="1";$("deviceProdutArea").innerHTML = "";//iphone套餐自备机场景为DEVICE_SELELCT_TYPE_4
		afterSelectDevice(obj);	
	}else{
		if(newProdId != curProductId){
			var obj ={};obj.value ="4";obj.needAssure="0";obj.needRight ="1";selectTypeStr ="1";$("deviceProdutArea").innerHTML = "";//iphone套餐自备机场景为DEVICE_SELELCT_TYPE_4
			afterSelectDevice(obj);	
		}	
	}
}


function initPtypeArea(productId){
	
	var pId = $('_p'+productId);
	if (pId.productMode =="00"){
		//qc:4673 begin
  		isOtherExchange = "0";
  		//qc:4673 end
		if( $("ASSURE_TYPE$lst") ){
				Cs.flower.LookupCombo.setValue($("ASSURE_TYPE"), "4");
				Cs.flower.LookupCombo.disabled($('ASSURE_TYPE'),true);
		}
		if( $("SALE_PRODUCT_LIST$lst") ){
			Cs.flower.LookupCombo.setValue($("SALE_PRODUCT_LIST"), "");
			Cs.flower.LookupCombo.disabled($('SALE_PRODUCT_LIST'),true);
		}
		//$("agreeType").checked = false;
		if($("deviceSelectArea")){
			$("deviceSelectArea").innerHTML ="";
				var x=document.getElementsByName("agreeType");
				for (var i=0;i<x.length;i++){
					x[i].checked = false;
					if(x[i].value =="1")
						x[i].click();
				}
			$("deviceArea").innerHTML ="";
		}
		
		//某些产品必须参加营销活动,再刷回来
		if ($('deviceAgreeArea') && pId.modifyTag =='0') {
			if($('nojoin'))
			$('nojoin').enable();
			var isMustJoinSale = false;
			if (pId.checked && pId.itemSaleLimitTradetype) {
				var tradeTypeCode = '';
				try {
					tradeTypeCode = $F('_TRADE_TYPE_CODE');
				} catch (e) {
				}
				if (pId.itemSaleLimitTradetype && tradeTypeCode != '') {
					if (pId.itemSaleLimitTradetype.indexOf('|' + tradeTypeCode + '|') > -1) {
						isMustJoinSale = true;
					}
					//tfs 241827 begin 山东允许全国套餐开户不选合约-开户/集客开户/验证移网产品服务变更/验证23转4
					// 0 可以不参加 
					if(pId.itemSaleLimitTradetypeExc && pId.itemSaleLimitTradetypeExc=='0')
					{
						isMustJoinSale = false;
						$('join').click();
					}
					//tfs 241827 end 山东允许全国套餐开户不选合约-开户/集客开户/验证移网产品服务变更/验证23转4
				}
			}
			if (isMustJoinSale) {
				$('join').click();
				$('nojoin').disable();
			}
		}
		// tfs:232032  add by zyj begin 
		if ($("devicePtypeArea") && pId.modifyTag == "0" && getRightCode() == "csCreateWilePerUserTrade4G"){
			  var cache = new Cs.flower.DataCache();
			  if(cache){
			      var custInfo = cache.get("custInfo");
			       if(custInfo != null ){
			    	 if(custInfo.psptTypeCode == "J"){  //测试卡开户只能订购单卡,即不能购买终端
			    		 $('nobuy').enable();
			             $('nobuy').click();
			             $('buy').disable(); 
			    	 }
			         if (custInfo.psptTypeCode != "J" && pId.itemIsMustBuyTerminal && pId.itemIsMustBuyTerminal == "1" && ($("_TRADE_TYPE_CODE") && $F('_TRADE_TYPE_CODE') == "10")){
			        	 $('buy').enable();
			        	 $("buy").click();
						 $("nobuy").disable();
                     }
			     }
		      }
        }
	  //tfs:232032 add by zyj end 
		
	
	}else if (pId.productMode =="50" && pId.checked &&(selectTypeStr=="0"||selectTypeStr=="1"||selectTypeStr=="3")){	
		myDeviceAllInfo ="";	
		Cs.Ajax.register("tradeInfo", dealAllInfo);
		Cs.Ajax.register("tradeFee", afterDealTradeFee);
		myDeviceFeeList ="";
		var prodInfo={};
		$A(document.getElementsByName('_productinfos')).each(function(prod) {
		  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
			    //循环累积基础产品
			    prodInfo=prod;
			 }
	     }); 

		if (deviceNameTmp!="" && endDateTmp!="" )
		{					
			Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","init","&score="+""+"&rewardLimit="+""+"&userId="+userId+"&context="+""+"&paramvalue="+""+"&deviceName="+deviceNameTmp+"&endDate="+endDateTmp+"&myTradeInfo="+myDeviceTradeInfo+"&baseProductId="+prodInfo.productId+"&purchaseProductId="+productId+"&selectTypeStr="+selectTypeStr);
		}
		else
		{
			Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","init","&score="+""+"&rewardLimit="+""+"&userId="+userId+"&context="+""+"&paramvalue="+""+"&myTradeInfo="+myDeviceTradeInfo+"&baseProductId="+prodInfo.productId+"&purchaseProductId="+productId+"&selectTypeStr="+selectTypeStr);
		}	
	}
	
	if (typeof afterInitPtypeArea != 'undefined' && afterInitPtypeArea instanceof Function){
		afterInitPtypeArea(pId);
	}
}

function showSaleProductInfo(node){

     var baseProductNodeXml = new Cs.util.XML();
	 baseProductNodeXml.loadXML(node.xml);	
	 baseProductNode = baseProductNodeXml.documentElement; 
     for(var i=0; i<baseProductNode.childNodes.length; i++)
 	 {
    	if(baseProductNode.childNodes[i].getAttribute("root")){
			if(baseProductNode.childNodes[i].getAttribute("root") =="SALE")
			{
			    baseProductNode.removeChild(baseProductNode.childNodes[i]);
			    i--;
			}
	 	}
 	 } 
 	 if (baseProductNode.childNodes.length >0) 
	 	showProductInfoByArea("deviceProdutArea",baseProductNode);
	 else
	 	$("deviceProdutArea").innerHTML = "";
}

function getRightCode(){
    var rightCode = "";
	if($("_rightCode")) rightCode =  $F("_rightCode");
	else if($("RIGHT_CODE")) rightCode = $F("RIGHT_CODE");
	return rightCode;
	
}
//展现产品信息
function showProductInfo(node){

   showProductIdTemp ="";
	var plusProductNode = "" ;
    var saleProductNodeXml = "";
    var plusProductNodeXml = "" 
	var saleProductNodeXml = new Cs.util.XML();
	saleProductNodeXml.loadXML(node.xml);	
	saleProductNode = saleProductNodeXml.documentElement;  

	var plusProductNodeXml = new Cs.util.XML(); 
	plusProductNodeXml.loadXML(node.xml);	
	plusProductNode = plusProductNodeXml.documentElement; 
	
	for(var i=0; i<plusProductNode.childNodes.length; i++)
 	{
 		if(plusProductNode.childNodes[i].getAttribute("root")){
	    	if(plusProductNode.childNodes[i].getAttribute("root") =="SALE")
	    	{
	    	    plusProductNode.removeChild(plusProductNode.childNodes[i]);
	    	    i--;
	    	}
 		}
	}
	
	for(var i=0; i<saleProductNode.childNodes.length; i++)
 	{
    	if(!saleProductNode.childNodes[i].getAttribute("root"))//没有包含root 的部分 刷新活动下拉框
    	{
    	    saleProductNode.removeChild(saleProductNode.childNodes[i]);
    	    i--;
    	}
	} 
	

	for(var i=0; i<saleProductNode.childNodes.length; i++)
	{
		var ts = saleProductNode.childNodes[i].getAttribute("paraCode7");
 		if (ts!= null && ts != "-1"){
	    	if (ts.indexOf("|"+tradeTypeCode+"|")==-1 )//不可以办理的业务删掉
	    	{
	    	    saleProductNode.removeChild(saleProductNode.childNodes[i]);
	    	    i--;
	    	}
 		}
 	} 
	//added by zhoubl WOX清营销产品
	if(getRightCode() == "csExistUserJoinWO" ||  getRightCode()=='csCreateUserJoinWO' ||  getRightCode()=='csChangeProductWO'){
		
		for(var i=0; i<saleProductNode.childNodes.length; i++)
	 	{

	    	 saleProductNode.removeChild(saleProductNode.childNodes[i]);
	    	 i--;
		} 
		
	}
	//added by zhoubl end 
	
	var productAreaStr  = "<div id=\""+productArea+"\"><\/div>";
	if(getRightCode() == "csPurchaseTrans"){
		productAreaStr+="<div id=\"agreeAreaParent1\" class=\"feldsetCont noPadding\"><div class=\"e_title\">已生效活动信息<\/div><\/div>";
		productAreaStr+="<div class=\"c_search\">";
		productAreaStr+="<div id=\"currentSaleProductArea\"><\/div>";
		productAreaStr+="<\/div>";
	}
	if(getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() == "csCreateWilePerUserTrade" || getRightCode() == "csCreateWileGrpUserTrade4G" || getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO")
		productAreaStr+="<div id=\"deviceAgreeAreaParent1\" class=\"feldsetCont noPadding\"><div class=\"e_title\">活动信息<\/div><\/div>";
	else
		productAreaStr+="<div id=\"deviceAgreeAreaParent2\" class=\"feldsetCont noPadding\"><div class=\"e_title\">是否参加活动<\/div><\/div>";
	productAreaStr+="<div class=\"c_search\">";
	productAreaStr+="<div id=\"deviceAgreeArea\" class=\"feldsetCont\"><\/div>";
	
	productAreaStr+="<div class=\"feldsetCont noPadding\" id =\"shAgreeDiv\">";
	if(getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() == "csCreateWilePerUserTrade"|| getRightCode() == "csCreateWileBossYUserTrade" || getRightCode() == "csCreateWileBossYUserTrade4G" || getRightCode()=="csCreateWileProvYUserTrade" || getRightCode() == "csCreateWileGrpUserTrade4G" || getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO")
		productAreaStr+="<div class=\"e_title\">终端信息<\/div>";
	else
		productAreaStr+="<div class=\"e_title\">活动信息<\/div>";
	productAreaStr+="<div id=\"devicePtypeArea\"><\/div>";
	productAreaStr+="<div id=\"deviceAssureArea\"><\/div>";
	productAreaStr+="<div id=\"deviceSelectArea\" class=\"feldsetCont\"><\/div>";
	productAreaStr+="<div id=\"deviceArea\"><\/div>";
	productAreaStr+="<\/div>";
	productAreaStr+="<div id=\"iphoneDeviceArea\"><\/div>";
	productAreaStr+="<div id=\"deviceProdutArea\"><\/div>";
	productAreaStr+="<\/div>";
	//var productAreaStr  = "<div id=\""+productArea+"\"></div><div class=\"feldsetCont noPadding\"><div class=\"e_title\">活动信息</div></div><div class=\"c_search\"><div id=\"deviceAgreeArea\" class=\"feldsetCont\"></div><div class=\"feldsetCont noPadding\"><div class=\"e_title\">活动列表</div> <div id=\"devicePtypeArea\"></div><div id=\"deviceAssureArea\"></div><div id=\"deviceSelectArea\" class=\"feldsetCont\"></div><div id=\"deviceArea\"></div></div><div id=\"deviceProdutArea\"></div></div>";
	//tradeTypeCode = $F('_TRADE_TYPE_CODE');

	
	if (saleProductNode.childNodes.length>0){
		//主副卡 begin
		if (($("isJoinWo") && $("isJoinWo").checked ) || ($("isMain") && $("isMain").checked)) {
		//主副卡 end
			// 如果加入沃享，就不显示营销活动
			$(productArea).parentNode.innerHTML = "<div id=\""+productArea+"\"><\/div>";
		} else {
			$(productArea).parentNode.innerHTML = productAreaStr;
			drawAgreeArea();
		}
	}
//	else if (tradeTypeCode == '120' && $F('_NET_TYPE_CODE') == 'WV'){
//		//allDisabled = true;
//		$(productArea).parentNode.innerHTML = productAreaStr;
//		drawAgreeArea();
//		drawDevicePtypeArea(saleProductNode);
//	}
	else{
		$(productArea).parentNode.innerHTML = "<div id=\""+productArea+"\"><\/div>";
	}
	if(getRightCode() == "csCreateWileBossYUserTrade" || getRightCode() == "csCreateWileBossYUserTrade4G" ||  getRightCode()=='csCreateWileProvYUserTrade'){
		$(productArea).parentNode.innerHTML = productAreaStr;
		$("deviceAgreeArea").innerHTML = "";
	}else if(getRightCode() =="csCreateWileGrpUserTrade" || getRightCode() =="csCreateWilePerUserTrade" || getRightCode() =="csCreateWileGrpUserTrade4G" || getRightCode() =="csCreateWilePerUserTrade4G" || getRightCode() =="csCreateWilePerUserJoinWO"){
		$(productArea).parentNode.innerHTML = productAreaStr;
		//drawAgreeArea();
	}
	// 23转4，418升级。如果用户在省分是合约用户，展示原合约信息 begin
	if (getRightCode() == "csChangeUser") {
		if (oldUserInfo && oldUserInfo.CONTRACT_INFO) {
			$(productArea).parentNode.innerHTML = "<div id=\""+productArea+"\"><\/div><div id=\"contractInfoArea\"></div>";
			drawContractInfoArea();
		}
		if (($("isJoinWo") && $("isJoinWo").checed) || ($("isMain") && $("isMain").checked) || (oldUserInfo && oldUserInfo.CONTRACT_INFO)) {
			// 加沃享、继承省分合约清理营销产品 
			for(var i=0; i<saleProductNode.childNodes.length; i++) {
		    	 saleProductNode.removeChild(saleProductNode.childNodes[i]);
		    	 i--;
			} 
		}
	}
	// 23转4，418升级。如果用户在省分是合约用户，展示原合约信息 end
	showProductInfoByArea(productArea,plusProductNode);
	checkedMustProduct();//总部预付费和省份预付费只刷出一个主产品 要默认勾必须。
	
	if (saleProductNode.childNodes.length>0)
		drawDevicePtypeArea(saleProductNode);
	if(getRightCode() == "csCreateWileBossYUserTrade"|| getRightCode() == "csCreateWileBossYUserTrade4G" || getRightCode()=="csCreateWileProvYUserTrade"
	  || getRightCode() =="csCreateWileGrpUserTrade" || getRightCode() =="csCreateWilePerUserTrade"
	  || getRightCode() =="csCreateWileGrpUserTrade4G" || getRightCode() =="csCreateWilePerUserTrade4G" || getRightCode() =="csCreateWilePerUserJoinWO")
		drawDevicePtypeArea(saleProductNode);	 
	
	if (typeof afterShowProduct != 'undefined' && afterShowProduct instanceof Function){
		afterShowProduct();
	}

}

//展现产品信息
function showProductInfoWV(node){
	
	showProductIdTemp ="";
	if( $("baseProductList") )//湖北主产品展示用下拉框展示 
	{   
		 
		var baseProductNode = "" ;
		var plusProductNode = "" ;
	    var baseProductNodeXml = "";
	    var plusProductNodeXml = ""
		
		var baseProductNodeXml = new Cs.util.XML();
		baseProductNodeXml.loadXML(node.xml);	
		baseProductNode = baseProductNodeXml.documentElement; 
		
		var plusProductNodeXml = new Cs.util.XML();
		plusProductNodeXml.loadXML(node.xml);	
		plusProductNode = plusProductNodeXml.documentElement; 
		
		for(var i=0; i<baseProductNode.childNodes.length; i++)
	 	{
	    	if(baseProductNode.childNodes[i].getAttribute("productMode") !="00")
	    	{
	    	    baseProductNode.removeChild(baseProductNode.childNodes[i]);
	    	    i--;
	    	}
		}
		//var basePrdAreaId = Cs.ctrl.Web.$P("BASE_PRODUCT_ID").valueId; 
		$("baseProductList$lst").value = baseProductNode.xml;
		
		for(var i=0; i<plusProductNode.childNodes.length; i++)
	 	{
	    	if(plusProductNode.childNodes[i].getAttribute("productMode") =="00")
	    	{
	    	    plusProductNode.removeChild(plusProductNode.childNodes[i]);
	    	    i--;
	    	}
		}
		
		showProductInfoByArea("plusProductArea",plusProductNode);
		
	}
	else
		showProductInfoByArea(productArea,node);
	
	
	
}

function checkedMustProduct(){
	if(getRightCode() == "csCreateWileBossYUserTrade" ||  getRightCode()=='csCreateWileProvYUserTrade' || getRightCode() == "csCreateWileBossYUserTrade4G"){
		var productSelf = "";
		var productCountSelf = 0;
		$A(document.getElementsByName('_productinfos')).each(function(prod) {
			if(prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
				  //循环累积基础产品
				  productSelf=prod;
			      productCountSelf++
			}
		});
		if(productCountSelf == 1){//如果只有一个基础产品 默认勾选上，不允许删除
			$("_p"+productSelf.productId).checked = true;
			$("_p"+productSelf.productId).disabled = true;
			queryPackageInfo(productSelf.productId);
		}
	}
}
function showBasePrdList(obj)
{
	var productListXml = new Cs.util.XML();
	var xmlValue = $F("baseProductList$lst");  
	productListXml.loadXML(xmlValue);	
	var node = productListXml.documentElement; 
	
	var curSeledPrdNode = "" 
	if(!$F(obj.valueId).blank())
    {
	    for(var i=0; i<node.childNodes.length; i++)
	    {
	    	if(node.childNodes[i].getAttribute("productId") == $F(obj.valueId))
	    	{  
	    	   
	    	   curSeledPrdNode = node.childNodes[i] ;
	    	   break;
	    	}
	    }
    }
    curSeledPrdNode = "<root>"+ curSeledPrdNode.xml+"</root>";
    var curSeledPrdNodeXml = new Cs.util.XML();
    curSeledPrdNodeXml.loadXML(curSeledPrdNode);	
    curSeledPrdNode = curSeledPrdNodeXml.documentElement;
   
    showProductInfoByArea("baseProductArea",curSeledPrdNode);
     
    queryPackageInfo( $F(obj.valueId) );
}

//点击产品查明细
function queryPackageInfo(productId){   
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
}

//控制产品展示 ‘+’ ‘-’ 号--miyro_lan
function closeOpen(elementId,closeOpeneId){
		if(elementId.visible()== true) {
        	closeOpeneId.className = "expand";
        	closeOpeneId.src='/images-custserv/win/open.gif';
	    }else {
	        closeOpeneId.className = "unexpand";
	        closeOpeneId.src='/images-custserv/win/close.gif';
	    } 
}

//控制新增被选择的产品显示为 blue 蓝--miyro_lan
function showColor(elemCheckId,showId,show_Id){
	if($(elemCheckId).checked && $(elemCheckId).modifyTag == "0"){   
		$(showId).style.color="blue";
		if($(show_Id))
			$(show_Id).style.color="blue";
	}else if(!$(elemCheckId).checked && $(elemCheckId).modifyTag == "0"){
		$(showId).style.color="black";
		if($(show_Id))
			$(show_Id).style.color="black";
	}
}
//展现包信息
function showPackageInfo(node){
		if (node.childNodes.length==0){
			win.alert("没有查询到包信息!");
			return;
		}
	
	var productId = node.childNodes[0].getAttribute("productId");

	var pkgLayout = new Cs.flower.LayoutHelper("p"+productId, 1); //一列显示
	
	pkgLayout.cellClass=function(){return ""}; //设置为无式样
	
	pkgLayout.draw(node.childNodes, function(item){
		var packageInfo = Cs.util.Utility.node2JSON(item);
		var a = new Array;
		
		a.push('<fieldset class="fieldset"><legend><input type="checkbox" class="radio" value="');
		a.push(packageInfo.packageId);
		a.push("\" onclick='onPackageClick(\"");
		a.push(packageInfo.productId);
		a.push ("\",\"");
		a.push(packageInfo.packageId);
		a.push ("\",");
		a.push("this.checked");
		a.push(")' ");
		//_startDate：包生效时间, _endDate：包结束时间，暂不使用
		a.push(geneAttrString(packageInfo, '_startDate,_endDate,startDate,endDate,productId,packageId,packageName,packageTrans,modifyTag,forceTag,defaultTag,maxNumber,minNumber,needExp,packageInvalid'));
		
		if(packageInfo.modifyTag == '1'|| allDisabled) a.push(" disabled");
		if(packageInfo.modifyTag == '9' && $('_p'+productId).modifyTag == '9') a.push(" checked");
		
		a.push(" _thisType=\"package\"");
		a.push(' id="_p'+productId+'k'+packageInfo.packageId);
		a.push('"/>');
		
		var pkclass = 'black';
		if(packageInfo.modifyTag == '1') pkclass = 'red';
		else if(packageInfo.modifyTag == '9')
		    { 
		        if($('_p'+productId)._startDate.substring(0,10)==Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), "3", 1).substring(0,10))
		            pkclass = '#F75000';
		        else
		            pkclass = 'black';    
		    }
		else pkclass = 'black';
		a.push("<span");
		a.push(" id='showcolor"+productId+'k'+packageInfo.packageId+"'");		    		
		a.push(" style='color:" + pkclass + "'>");
		
		var needExp = '';
		if(allNeedExp == '1') packageInfo.needExp = '1';
		if(($('_p'+productId).modifyTag == '0' || ($('_p'+productId).modifyTag == '9' && packageInfo.modifyTag == '0'))
			&& packageInfo.needExp == '1')
			needExp = "<span style='color:red'> * </span>";
		
		//增加双击捕获产品、包、元素ID、名称 modify by zhangyangshuo
		a.push('<span onclick="queryElementByPkgId(\'');
		a.push(packageInfo.packageId);
		a.push('\',\''+productId+'\')" ');
		a.push("  ondblclick='copyToClip(\"");
		a.push(packageInfo.packageName+"("+packageInfo.packageId+")");
		a.push("\",true)' >");
		a.push(packageInfo.packageName);
		a.push("</span>");
		a.push(needExp);
		a.push("</span>");

		a.push(' <img class="unexpand" id="closeopen'+productId+'k');
		a.push(packageInfo.packageId);
		a.push('"');		
		a.push(' src="/images-custserv/win/close.gif" style="cursor:hand" onclick="queryElementByPkgId(\'');
		a.push(packageInfo.packageId);
		a.push('\',\''+productId+'\')"/>');
		
		//弹出add by scocape
		if(packageInfo.modifyTag == '1'||allDisabled){
		}else{
	        a.push('&nbsp;&nbsp;&nbsp;&nbsp;<img src="/images-custserv/win/gif-0662.gif" style="cursor:hand" onclick="onPackageClick('+productId+', '+packageInfo.packageId+', true);var qrtn = popupDialog(\'');
	        a.push('popupdialog.ChoicePackageEle\'')
			a.push(',\'init\'');
			a.push(',\'&productId='+ packageInfo.productId +'&packageId='+ packageInfo.packageId +'\'');
			a.push(',\'元素查询\'');
	        a.push(',\'600\'');
			a.push(',\'300\'');
			a.push(');if(qrtn&&qrtn.productId){onElementClickExt(qrtn.productId,qrtn.packageId,qrtn.elementId,qrtn.elementType,true,null,true)}"/>');
        }
        //~end
		
		a.push('</legend><div first="true" id="p'+productId+'k');
		a.push(packageInfo.packageId);
		a.push('" style="display:none"></div></fieldset>');
		return a.join("");
	});
	
	$("p"+productId).toggle();
	$("p"+productId).setAttribute('first','FALSE');
	closeOpen($("p"+productId),$("closeopen" + productId));
		
	//展开产品时，如果产品已选择，则触发产品onclick事件
	if($("_p"+productId).checked) onProductClick(productId, true);
	
	if("HBCU" == provinceCode)
	{
		for(var i=0;i<node.childNodes.length;i++)
		{
			var packageId = node.childNodes[i].getAttribute("packageId");
			queryElementByPkgId(packageId,productId);
		}
	}
	
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
	//qc:51882 begin
		  if(prod.checked && (prod.getAttribute('productMode') == '60'||(tradeTypeCode==796||tradeTypeCode==196))&&prod.getAttribute('parentArea') == productArea) {
	//qc:51882 end
			  //黑莓产品默认展开
			  
				$A($('p'+prod.getAttribute('productId')).all).each(function (s) {
					if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
						&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'PACKAGE'
						&& s.checked) {
						queryElementByPkgId(s.packageId,prod.getAttribute('productId'));
					}
				});
			 }
	});

	
}

//查询元素信息
function queryElementByPkgId(packageId, productId){
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

//展现包中元素信息
function showElementInfo(node) {
    if("HBCU" == provinceCode && node.childNodes.length==0 ) return ;
	if (node.childNodes.length==0){
		win.alert("没有查询到元素信息!");
		return;
	}
	
	var packageId = node.childNodes[0].getAttribute("packageId");
	var productId = $productIdOfPkg;
	
	var eleLayout = new Cs.flower.LayoutHelper("p"+productId+"k"+packageId, 3); //三列显示
		
    eleLayout.cellClass=function(idx){return (idx%2==0)?"row_odd":"row_even";}; //设置式样	
    
	eleLayout.draw(node.childNodes, function(item){
		var elementInfo = Cs.util.Utility.node2JSON(item);
		
		var a = new Array;
		
		a.push('<input type="checkbox" class="radio" value="');
		a.push(elementInfo.elementId);
		a.push("\" onclick='onElementClick(\"");
		a.push(productId);
		a.push ("\",\"");
		a.push(packageId);
		a.push ("\",\"");
		a.push(elementInfo.elementId);
		a.push ("\",\"");
		a.push(elementInfo.elementTypeCode);
		a.push ("\",");
		a.push("this.checked");
		a.push ("\,\"");
		a.push(true);
		a.push ("\",\"");
		//a.push(7);
		a.push ("\",");
		a.push(true);
		a.push(")' ");
		a.push(geneAttrString(elementInfo, 'packageId,elementId,elementName,modifyTag,_submitStartDate,_submitEndDate,itemId,itemIdOld,forceTag,defaultTag,elementTypeCode,elementDesc,enableTag,startAbsoluteDate,startOffset,startUnit,endEnableTag,endAbsoluteDate,endOffset,endUnit,startDate,endDate,score,rewardLimit,hasAttr,spProductId,partyId,spId,paramvalue,hasEnd,mutexStr,relyStr,svcEndMode,firstmonthpaytype'));
		//alert('1'+elementInfo.packageId);
		//alert('2'+elementInfo.hasEnd);
		//_startDate：元素生效时间, _endDate：元素结束时间
		var elemDate = compElemDate($('_p'+productId), elementInfo);
		
		if(specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&elementInfo.modifyTag == '0'){//特殊指定时间 add by zhangyangshuo
			a.push(" _startDate=\"" + specialTimeStr + "\"");
				a.push(" _endDate=\"" + elemDate._endDate + "\"");
		}else{
			a.push(" _startDate=\"" + elemDate._startDate + "\"");
			a.push(" _endDate=\"" + elemDate._endDate + "\"");
		}
		
		a.push(" productId=\"" + productId + "\"");
		if(elementInfo.modifyTag == '1' || allDisabled) a.push(" disabled");
		if(elementInfo.modifyTag == '9' && $('_p'+productId).modifyTag == '9') a.push(" checked");
		a.push(" id='_p"+productId+'k'+packageId+"e"+elementInfo.elementId+"T"+ elementInfo.elementTypeCode +"'");
		a.push(" _thisType=\"element\"");
		
		a.push('/>');
		
		
		var elclass = 'black';
		if(elementInfo.modifyTag == '1') elclass = 'red';
		else if(elementInfo.modifyTag == '9') 
		    {
		        if(elementInfo.hasEnd=="3")//下月生效的元素
		            elclass = '#F75000';
		        else    
		            elclass = 'black';
		    }
		else elclass = 'black';

		
		
		if (elementInfo.elementDesc){
		    a.push("<span");
		    a.push(" id='showcolor"+productId+'k'+packageId+"e"+elementInfo.elementId+"'");
		    a.push(" style='color:" + elclass + "' explain='"+elementInfo.elementDesc+"' ");
		    }
		else{
		    a.push("<span");
		    a.push(" id='showcolor"+productId+'k'+packageId+"e"+elementInfo.elementId+"'");		    
		    a.push(" style='color:" + elclass + "'");
		}   
		
		a.push("  ondblclick='copyToClip(\"");
		a.push(elementInfo.elementName+"("+elementInfo.elementId+")("+elementInfo.elementTypeCode+")");
		a.push("\",true)' >");
		
		if (elementInfo.hasAttr&&!elementInfo.hasAttr.blank()&&elementInfo.hasAttr!="0"){
	        a.push("<a href='javascript:void(0)'"+" id='showcolor_"+productId+'k'+packageId+"e"+elementInfo.elementId+"'"+" style='color:" + elclass + "' onclick='setAttr(\"");
	        a.push(elementInfo.elementName+"("+elementInfo.elementId+")("+elementInfo.elementTypeCode+")");
	        a.push("\" )'>");
	       }
		a.push(elementInfo.elementName);
		if (elementInfo.hasAttr&&!elementInfo.hasAttr.blank()&&elementInfo.hasAttr!="0")
		    a.push("</a>");
		a.push("</span>");
		a.push("<span>");
		    
		if(elementInfo.elementTypeCode=="D"||elementInfo.elementTypeCode=="S" || elementInfo.elementTypeCode=="X")
		{
    		a.push("<img ");
    		a.push(" src='/images-custserv/win/q2.gif' style='cursor:hand' onclick='setDateAttr(this)'");
    		a.push(">");
    	}
		a.push("</span>");
		
		
		
		return a.join("");
	});
	
	if (typeof explainToTips != 'undefined' && explainToTips instanceof Function)
	    explainToTips("docTip", 300, $("p"+productId+"k"+packageId));
	
	$("p"+productId+"k"+packageId).toggle();
	$("p"+productId+"k"+packageId).setAttribute('first','FALSE');
	closeOpen($("p"+productId+"k"+packageId),$("closeopen" + productId+"k"+packageId));
	
	//展开包时，如果包已选择，则触发包onclick事件
	if($("_p"+productId+"k"+packageId).checked) onPackageClick(productId, packageId, true); 
}

/**
 * 通过JSON对象生成HTML属性字符串
 * @param src JSON对象
 * @param attrs 需生成属性名称列表，以逗号分隔
 * @return HTML属性格式字符串
 * @author zhoush
 */
function geneAttrString(src, attrs) {
	var _attrs = '';
	
	$A(attrs.split(',')).each(function (s) {
		if(s == 'needExp' && allNeedExp == '1') {
			_attrs += s+'="'+"1"+'" ';
		}
		else {
			_attrs += s+'="'+src[s]+'" ';
		}
	});
	return _attrs.replace(/undefined/g, '');
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
			  					onPackageClick(prod.getAttribute('productId'), s.getAttribute('packageId'), false, false);
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
				onPackageClick(productId, s.getAttribute('packageId'), s.checked, false);
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
//QC:32878 Begin 判断如果是后付费用户转预付费，并且该用户为合帐用户，转预付费时必须建立新账户
function ifShowAcctInfo(checked){
	var curPrepayTag = $("PREPAY_TAG")== null? "":$("PREPAY_TAG").value
//	合帐用户tag 0合帐1否
	var hzyhTag = $("HZYH")== null? "":$("HZYH").value
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
			if(prod.checked)
				newPrepayTag = prod.getAttribute('prepayTag');
	});
	if(checked){
		if($("chgProdAcctDiv")){
			if(hzyhTag=="0" && (curPrepayTag == '0'|| curPrepayTag == '1') && newPrepayTag == '2'){
				$("chgProdAcctDiv").style.display = "";
			}else{
				$("chgProdAcctDiv").style.display = "none";
			}
		}
	}else{
		if(hzyhTag=="0" && (curPrepayTag == '0'|| curPrepayTag == '1') && newPrepayTag == '2' && $("chgProdAcctDiv")){
			$("chgProdAcctDiv").style.display = "none";
		}
	}
}
//QC:32878 End
//获取无线上网卡附加产品的费用信息
function getFeeInfoIfJoinPlan(productId){
	var pId = $('_p'+productId);
	if (pId.productMode =="50"){
		var subProductId = productId;//活动产品编码
		var mainProdId = "";//主产品编码
		var productCount=0;
		var mainProdInfo = {};
		$A(document.getElementsByName('_productinfos')).each(function(prod) {
		  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
		  		mainProdInfo=prod;
		  		productCount++;
			 }
	     });
	     if(productCount==1) //如果界面只选择了一个主产品，就刷此产品的终端场景
	     {
	     	mainProdId = mainProdInfo.productId;
	     }
	     if(productCount > 1) throw new Error('只能选择一个基本产品！');

	    Cs.Ajax.register('hasFee', dealFeeInfoJoinPlan);
	 	var params = "&subProductId="+subProductId +"&mainProdId=" + mainProdId+"&myTradeInfo="+myDeviceTradeInfo;
		Cs.Ajax.swallowXml(prodPage,"getFeeInfoIfJoinPlan",params,"正在获取附加产品费用信息,正在处理,请稍候...");
	}	     
}

function dealFeeInfoJoinPlan(node){
	var other = Cs.util.Utility.node2JSON(node);    
	myDeviceTradeInfo = Object.toJSON(other);
}
/*
* 省份预付费无线上网卡 根据产品编码刷新是否购买终端
*/
function drawTerminalCtrlByPro(productId){
    var productIdIn = productId;
	var productCount=0;
	var prodInfos = {};
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
	  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
	  		prodInfos=prod;
	        productCount++
		 }
     });
     if(productCount==1) //如果界面只选择了一个主产品，就刷此产品的终端场景
     {
     	productIdIn = prodInfos.productId;
     }
    Cs.Ajax.register('hasTerminal', drawTerminalCtrl);
 	var params = "&productId="+productIdIn;
	params=params.toQueryParams();   
	Cs.Ajax.swallowXml(prodPage,"checkNeedTerminal",params,"您选的产品需要购买终端,正在处理,请稍候...");										
}

function drawTerminalCtrl(node){
	var drawctrl = node.getAttribute("paraCode1");
	if(drawctrl != drawprov){
	    if(drawctrl == "" || drawctrl == null)//没有配置，刷无终端场景。
	    	drawctrl= "PROV_SERIAL_CTRL";
	    drawprov = drawctrl;
		lightPtype.parent=$("devicePtypeArea");
		lightPtype.lighting_first(drawctrl+"|provArea"); //COMMPARA：5130 配置了为需要购买终端的
		
	  	lightPtype.callback=function(){
	  	  	if($("DEVICE_TYPE")) Cs.flower.LookupCombo.setValue($("DEVICE_TYPE"), "05");
	  	}		
	}
	
	
}


/**
 * 选择包的onclick事件(用于自下而上点击element时触发，解决默认元素被自动带出问题)
 * @param packageId 触发事件的包编码
 * @param checked 是否选中
 * @param bubble 冒泡 true-由元素触发 false-由界面选择
 * @return 无
 * @author zhoush
 */
var onPackageClickFromEle = function(productId, packageId, checked, bubble) {
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
	console.log('++++ onPackageClick() 3 +++\n');
	
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
					  if(pkgTemp && pkgTemp.getAttribute('maxNumber') == "1"&&tempFlag){
					    
					  }
					  //qc 98337 start
                      else if(s.getAttribute('endDate') == Cs.util.Utility.getLastDay(Cs.ctrl.Trade.getSysDate())&& $('_p'+productId).getAttribute('modifyTag') =='0'){
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
*	针对包最大数为1：元素触发自动取消及选择
*	add by scocape@20091204
**/
function autoCancelClick(productId, packageId, elementId,elementType, checked, bubble) {
	var pkg = $('_p'+productId+'k'+packageId);
    if (pkg && pkg.maxNumber == "1") {
    	//判断包下是否所有元素被选中
		var allCancel = false;
		$A($('p'+productId+'k'+packageId).all).each(function (s) {
			//qc 12739 begin
			if($('pagecontext').provinceId=='0011'){
				if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
					&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
					&& s.checked && s.forceTag!='1') {
					s.checked = false;
					allCancel = true;
				}
			}else{
			if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
				&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
				&& s.checked) {
				//QC: 5410 begin
				if (checked)
				{
					s.checked = false;
					allCancel = true;
				}else{
					if (elementId == s.elementId){
						s.checked = false;
					    allCancel = true;
					}
				}
				//QC: 5410 end
			}
			}
			//qc 12739 end	
		});
		
		var eId = $("_p"+productId+"k"+packageId+"e"+elementId+"T"+elementType);
		if(allCancel) {
			eId.checked=checked;
			onElementClick(productId, packageId, elementId,elementType, checked, bubble,true)
		}
    }
}


/**
 * 选择元素的onclick事件 弹出界面回调
 * @param elementId 触发事件的元素编码
 * @param checked 是否选中
 * @param bubble 控制重复冒泡 false-由包触发
 * @return 无
 */
function onElementClickExt(productId, packageId, elementId,elementType, checked, bubble, isEleClick) {
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
	
	if(isEleClick){	//add by scocape	当包最大数为1时，在选择元素时，自动取消其他被选元素
		autoCancelClick(productId, packageId, elementId,elementType, checked, bubble);
	}
	
	var eId = "_p"+productId+"k"+packageId+"e"+elementId+"T"+elementType;
	var canNStep = false;	
	
	//元素互斥
	//qc 097956 add by zhoucs begin
	if(checked&&$(eId).mutexStr!="" )
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
	if(canNStep&&checked&&$(eId).relyStr!=""&&$("_TRADE_TYPE_CODE")&&$("_TRADE_TYPE_CODE").value =='10')
	//qc 097956 add by zhoucs end
	{
		checkRelyElements($(eId));
	}

    //触发自下而上事件
	if(bubble != false&&canNStep) {
        $(eId).checked=true;
        onPackageClick(productId, packageId, checked, true);
    }
	
	/*//Added by tangz@2009-2-4 1:53
	if (bubble===undefined) {
	    if (!checkOperator(productId, packageId)){
	        var elm = Event.element(event);
	        elm.checked = !checked;
	        if(bubble != false) onPackageClick(productId, packageId, !checked, true);
	    }
	}*/
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

// QC 96686 begin
function checkManyouFee(node){
	
	var resultInfo = Cs.util.Utility.node2JSON(node);
  		var ROAM_FLAG = resultInfo.roamFlag;
  		 
  		if(ROAM_FLAG=='1'){
  			win.alert("该用户符合免国际业务预存款开通国际长途、漫游的条件，国际业务预存款可以减免。");
  		}else if(ROAM_FLAG=='0'){
  			win.alert("该用户未达到免收国际业务预存款的条件，需到营业厅交纳预存款办理开通该业务。");
  		}else {
  			win.alert("获取免国际业务预存款标识失败，请重新选择。");
  		}
}
function checkManyouFeeFail(node){
	 
   win.alert("获取免国际业务预存款标识异常，请重新选择。");
}

// QC 96686 end
/*
 * 校验同产品下元素互斥,存在不继续
 */
function checkMutexElements(o, isEleClick)
{
	var productId = o.id.split("k")[0].substr(2);
	var mutexEles = o.mutexStr.split("~");
	var result = true;
    $A($("p"+productId).all).each(function (s) {
        if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
		    && s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
		    && s.checked) 
		{
			var ret1 = true
			mutexEles.each(function(xe){
				var sstart = s._startDate;
				var send = s._endDate;
				var ostart = o._startDate;
				var oend = o._endDate;				
				if(s.id.split("e")[1]==xe&&((sstart <= ostart && ostart < send)
						||(oend > sstart && send >= oend)))
				{
					var productName = $(s.id.split("k")[0]).productName;					
					var packageName = $(s.id.split("e")[0]).packageName;					
					//qc:97823 Modify by ruanyr Begin
					if((o.modifyTag == '9') && (s.modifyTag == '0' && s.forceTag != '1')){//如果用户原有服务和新产品中的默认选中服务互斥，则新产品中对应的服务处理成不默认选中
						s.checked = false;
					}else if((s.modifyTag == '9') && (o.modifyTag == '0' && o.forceTag != '1')){
						//alert("11--"+isEleClick);
						if(isEleClick===true && s.forceTag != '1'){
							//alert(22);
							s.checked = false;
						}else{
							//alert(33);
							o.checked = false;
						}
					}else if(s.modifyTag == '0' && s.forceTag == '1'){//如果用户原有服务和新产品中的必选服务互斥，则用户原有服务自动取消，保留新产品中的必选内容
					o.checked = false;
					}else if(o.modifyTag == '0' && o.forceTag == '1'){
						s.checked = false;
					}else if(s.modifyTag == '0' && o.modifyTag == '0'){
						if(s.forceTag == '1') {
					o.checked = false;
						}else if(o.forceTag == '1'){
							s.checked = false;
						}else if(s.forceTag == '1' && o.forceTag == '1'){
							win.alert("产品配置有问题：两个必选元素互斥！");
						}else{
							s.checked = false;
						}
					}//qc:97823 End
					
					var info = productName + "中"+packageName+"内"+s.elementName+"与"+o.elementName+"互斥！";
					win.alert("<b style='color:red'>温馨提醒!</b><br>"+info+"已按照如果用户原有服务和新产品中的默认选中服务互斥，则选中原有服务；如果用户原有服务和新产品中的必选服务互斥，则选中新产品必选服务的规则进行了自动处理，<b style='color:blue'>您也可以根据用户需求手动勾选！</b>");
					//o.checked = false;
					ret1 = false;
					return;
				}
			});
			if(!ret1)
			{
				result = false;
				return;
			}   		    
		}
    });	
	return result;
}

/*
 * 检验元素依赖,存在则选中
 */
function checkRelyElements(o)
{
	var prodId = o.id.split("k")[0].substr(2);
	var relyEles = o.relyStr.split("~");
    $A($("p"+prodId).all).each(function (s) {
        if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
		    && s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
		    && !s.checked) 
		{
			relyEles.each(function(xe){
				var sstart = s._startDate;
				var send = s._endDate;
				var ostart = o._startDate;
				var oend = o._endDate;				
				if(s.id.split("e")[1]==xe&&((sstart>=ostart&&sstart<=oend)
					||(send<=oend&&send>ostart)))
				{
					s.checked = true;
					var eId = s.id;
					onElementClick(eId.split("k")[0].substr(2), s.getAttribute('packageId'), s.elementId,eId.split("T")[1], true, true);
					return;
				}
			});    		    
		}
    });	
}

/**
 * 检查操作的合法性
 * @param productId 
 * @param packageId 
 * @return boolean 是否合法
 * @author tangz
 * @date 2009-2-4 1:30
 */
function checkOperator(productId, packageId) {
    
    var pdt = $('_p'+productId);
    var pkg = $('_p'+productId+'k'+packageId);
    var needCheckPdt,needCheckPkg;
    needCheckPdt=needCheckPkg=false;
    if (pdt.maxNumber!="-1"||pdt.minNumber!="-1")
        needCheckPdt=true;
    if ($('p'+productId+'k'+packageId).getAttribute('first').toUpperCase()=="FALSE"||(pkg.maxNumber!="-1"||pkg.minNumber!="-1"))
        needCheckPkg=true;
        
    if (!needCheckPdt&&!needCheckPkg) return true;   
    
    //考虑执行效率，分两种情况检查
    //1.不需要检查产品,只需要检查包
    if (!needCheckPdt&&needCheckPkg){
        var cnt=0;
        $A($('p'+productId+'k'+packageId).all).each(function (s) {
            if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
			    && s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT') {
			    
			    if (s.checked) ++cnt;
			}
        });
        
        if (pkg.maxNumber!="-1"&&parseInt(pkg.maxNumber,10)<cnt){
            win.alert("<b style='color:red'>不能做此操作!</b>此操作将导致，<br>选择的元素总数超过包内最大选择数:"+pkg.maxNumber);
            return false;
        }else if (pkg.minNumber!="-1"&&parseInt(pkg.minNumber,10)>cnt){
            win.alert("<b style='color:red'>不能做此操作!</b>此操作将导致，<br>选择的元素总数少于包内最小选择数:"+pkg.minNumber);
            return false;
        }
    }
    
    //2.需要检查产品.顺便检查包
    if(needCheckPdt){
        var cntPkg=0;
        var cntElm=0;
        $A($('p'+productId).all).each(function (s) {
            
            //统计包数量
            if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
	    		&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'PACKAGE') {
	    		    if (s.checked) ++cntPkg;
	        }
	    		
	    	if(needCheckPkg){
	    	    if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
	    	        && s.getAttribute('packageId') == packageId
			        && s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'ELEMENT') {
			        if (s.checked) ++cntElm;
			    }
	    	}
	    		
        });
        
        if (needCheckPkg&&pkg.maxNumber!="-1"&&parseInt(pkg.maxNumber,10)<cntElm){
            win.alert("<b style='color:red'>不能做此操作!</b>此操作将导致，<br>选择的元素总数超过包内最大选择数:"+pkg.maxNumber);
            return false;
        }else if (needCheckPkg&&pkg.minNumber!="-1"&&parseInt(pkg.minNumber,10)>cntElm){
            win.alert("<b style='color:red'>不能做此操作!</b>此操作将导致，<br>选择的元素总数少于包内最小选择数:"+pkg.minNumber);
            return false;
        }else if (pdt.maxNumber!="-1"&&parseInt(pdt.maxNumber,10)<cntPkg){
            win.alert("<b style='color:red'>不能做此操作!</b>此操作将导致，<br>选择的包总数超过产品内包的最大选择数:"+pdt.maxNumber);
            return false;
        }else if (pdt.minNumber!="-1"&&parseInt(pdt.minNumber,10)>cntPkg){
            win.alert("<b style='color:red'>不能做此操作!</b>此操作将导致，<br>选择的包总数少于产品内包的最小选择数:"+pdt.minNumber);
            return false;
        }
    }
    
    return true;
}

/**
 * 计算产品生效失效时间
 * @param product 产品对象
 * @return 产品生效失效时间
 * @author zhoush
 */
function compProdDate(product) {
	var dtProd = {};

	//新增产品使用参数表计算生效失效时间
	if(product.modifyTag == '0') {
		if((tradeTypeCode == "10"||tradeTypeCode == "1060"||tradeTypeCode == "500"||tradeTypeCode == "503")&&product.productMode == '00'){
			dtProd._startDate = Cs.ctrl.Trade.getSysDate();
		}
		else if(openBaseProdDate != '' && product.productMode == '00'){
			//开户基本产品的特殊处理
			dtProd._startDate = openBaseProdDate;
		}else if(recordOpenUserChgPro=="true" && tradeTypeCode == "12"){
			//资料返档选择产品的特殊处理
			dtProd._startDate = firstCallTime;			
		/*}else if(preStartDate!=''){
			//产品预约生效时间
			dtProd._startDate = preStartDate;	*/		
		}else{
			
			//产品绝对生效时间
			if(product.enableTag == '0')
				dtProd._startDate = product.startAbsoluteDate>Cs.ctrl.Trade.getSysDate() ? product.startAbsoluteDate : Cs.ctrl.Trade.getSysDate();
			//产品相对生效时间
			else
				dtProd._startDate = Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), product.startUnit, product.startOffset);
		}
		
		//产品的失效时间以产品的生效时间为计算起点
		//产品绝对失效时间
		if(product.endEnableTag == '0')
			dtProd._endDate = product.endAbsoluteDate>dtProd._startDate ? product.endAbsoluteDate : dtProd._startDate;
		//产品相对失效时间
		else {
		//--------------------wanglu
			if(specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&tradeTypeCode == "120"){
				
				
				dtProd._endDate = Cs.util.Utility.computeDate(specialTimeStr, product.endUnit, product.endOffset);
				dtProd._endDate = Cs.util.Utility.computeDate(dtProd._endDate, '6', -1);
			}else{
				dtProd._endDate = Cs.util.Utility.computeDate(dtProd._startDate, product.endUnit, product.endOffset);
				dtProd._endDate = Cs.util.Utility.computeDate(dtProd._endDate, '6', -1);
			}
		//--------------------wanglu
		}
	}
	//用户原有产品取原产品的生效失效时间
	else {
		dtProd._startDate = product.startDate;		
		if(recordOpenUserChgPro=="true" && tradeTypeCode == "12"){
			//资料返档老产品的特殊处理
			dtProd._endDate = Cs.util.Utility.computeDate(firstCallTime, '6', -1);
		}
		else
			dtProd._endDate = product.endDate;
	}

	return dtProd;
}

/**
 * 计算元素生效失效时间
 * @param product 产品对象
 * @param element 元素对象
 * @return 元素生效失效时间
 * @author zhoush
 */
function compElemDate(product, element) {
	var dtElem = {};
	var sysDate = Cs.ctrl.Trade.getSysDate();
	var allElem = ["X","A","K","M","C","B"];
	//新增元素使用参数计算生效失效时间
	if(element.modifyTag == '0' || element.modifyTag == '9' && product.getAttribute('modifyTag') == '0') {
		//服务，生效失效时间取产品时间
		if(element.elementTypeCode.toUpperCase() == "S") {			
			if(tradeTypeCode=="12"){
				//用户资料反档生失效时间：取页面中产品时间 add by xuyh@20090604
				dtElem._startDate = product.getAttribute('_startDate');
				dtElem._endDate = product.getAttribute('endDate');			
			}
			else if(tradeTypeCode=="124"){
				dtElem._startDate = product.getAttribute('_startDate');
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
						   dtElem._startDate = product.getAttribute('_startDate');
						}
				  }
			     //tfs:151580  guagua end
			      else 
			    	  {
			    	  dtElem._startDate = product.getAttribute('_startDate');
			    	  }
				//如果是原有产品中增加服务，生效时间取主产品生效时间	
				//因为支持活动中多个基本产品，所元素计算时主产品生效时间尚未确定
				//原有产品中增加服务的生效时间在生成服务台帐时处理(product.getAttribute('modifyTag') == '9'的服务)
				
				dtElem._endDate = product.getAttribute('_endDate');
				
				
			
			}
			
		
		      
		}
		//优惠
		else if(element.elementTypeCode.toUpperCase() == "D") 
		{
			//开户,优惠默认为立即
			//qc 33688 begin	网龄开户也是下月生效
            var isNetAge=false;
            if($('CS_NET_AGE') && $F('CS_NET_AGE')!=''){
                var elmtId="|"+element.elementId+"|";
                if($F('CS_NET_AGE').indexOf(elmtId)>-1){	
                    isNetAge = true;
                }
            }
            
			if((tradeTypeCode == "1060"||tradeTypeCode == "10"||tradeTypeCode == "500"||tradeTypeCode == "503")&&product.getAttribute('productMode')=="00" && !isNetAge){
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
			
			//取产品与优惠生效时间的大值
			dtElem._startDate = dtElem._startDate>product.getAttribute('_startDate') ? dtElem._startDate : product.getAttribute('_startDate');
			
			//QC:98214 begin 由于开户，元素默认为立即开户，现在需要对两个特定元素进行下月生效的特殊处理
      if(tradeTypeCode == "10" && product.getAttribute('productMode')=="00" && (element.elementId=="20010609" || element.elementId=="20010608")){				
			dtElem._startDate = Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), element.startUnit, element.startOffset);
			}
      //QC:98214 end
      
			//优惠的失效时间以优惠的生效时间为计算起点
			//优惠绝对失效时间
			if(element.endEnableTag == '0'){
				dtElem._endDate = element.endAbsoluteDate>dtElem._startDate ? element.endAbsoluteDate : dtElem._startDate;
			}//优惠相对失效时间
			else {
				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._startDate, element.endUnit, element.endOffset);
				dtElem._endDate = Cs.util.Utility.computeDate(dtElem._endDate, '6', -1);
			}
			
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
				dtElem._endDate = dtElem._endDate>product.getAttribute('_endDate') ? product.getAttribute('_endDate') : dtElem._endDate;	
			}	

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
			dtElem._startDate = dtElem._startDate>product.getAttribute('_startDate') ? dtElem._startDate : product.getAttribute('_startDate');
			
			
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
				dtElem._endDate = dtElem._endDate>product.getAttribute('_endDate') ? product.getAttribute('_endDate') : dtElem._endDate;	
			}	
		}				
		//实物,礼品包,话费
		else if(allElem.include(element.elementTypeCode.toUpperCase())) 
		{
    		dtElem._startDate = product.getAttribute('_startDate');
    		dtElem._endDate = product.getAttribute('_endDate');				
		}
		
		if(element.modifyTag == '9' && product.getAttribute('modifyTag') == '0') 
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
//				dtElem._startDate = Cs.util.Utility.computeDate(product.getAttribute('_startDate'), 3, 1).substring(0,10);
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
 * 重算所有产品、元素的生效、失效时间
 * @param 无
 * @return 无
 * @author zhoush
 */
function compAllProdDate() {
	$A($(productArea).all).each(function(prod) {
		if(prod.tagName.toUpperCase() == 'INPUT' && prod.type.toUpperCase() == 'CHECKBOX'
			&& prod.getAttribute('_thisType') != 'undefined' && prod.getAttribute('_thisType').toUpperCase() == 'PRODUCT') {
			
			var prodDate = compProdDate(prod);
			prod._startDate = prodDate._startDate;
			prod._endDate = prodDate._endDate;
			
			//重算元素生效、失效时间
			$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
					&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
					&& elem.checked) {
					
					var elemDate = compElemDate($('_p'+elem.getAttribute('productId')), elem); 
					elem._startDate = elemDate._startDate;
					elem._endDate = elemDate._endDate;
				}
			});
		}
	});
}


function compSelectedProdDate(paramProd) {
	
	var selProdStartDate ="";
	var selProdEndDate ="";
	$A($(productArea).all).each(function(prod) {
		if(prod.tagName.toUpperCase() == 'INPUT' && prod.type.toUpperCase() == 'CHECKBOX'
			&& prod.getAttribute('_thisType') != 'undefined' && prod.getAttribute('_thisType').toUpperCase() == 'PRODUCT' && prod.getAttribute('productId') == paramProd) {
			
			selProdStartDate = 	prod.getAttribute('_startDate');
		    selProdEndDate =  prod.getAttribute('_endDate');
			//重算元素生效、失效时间
			$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
					&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
					&& elem.checked) {
					
					var elemDate = compElemDate($('_p'+elem.getAttribute('productId')), elem); 
					elem._startDate = elemDate._startDate;
					elem._endDate = elemDate._endDate;
				}
			});
		}
	});
	
	$A($(productArea).all).each(function(prod) {
		if(prod.tagName.toUpperCase() == 'INPUT' && prod.type.toUpperCase() == 'CHECKBOX'
			&& prod.getAttribute('_thisType') != 'undefined' && prod.getAttribute('_thisType').toUpperCase() == 'PRODUCT' && prod.getAttribute('productMode')!="00" && prod.getAttribute('modifyTag') =="0") {
				
			if (selProdStartDate != "")		
				prod.setAttribute('_startDate',selProdStartDate);
			if (selProdEndDate != "")		
				prod.setAttribute('_endDate',selProdEndDate);
			//重算元素生效、失效时间
			$A($('p'+prod.setAttribute('productId')).all).each(function(elem) {
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
					&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
					&& elem.checked) {
					
					var elemDate = compElemDate($('_p'+elem.setAttribute('productId')), elem); 
					elem._startDate = elemDate._startDate;
					elem._endDate = elemDate._endDate;
				}
			});
		}
	});
}

// qc:81561 begin
/*
* 2g转3g 重算服务时间
*配置commpara9627，设置服务月底失效，次月生效。但是有特殊情况要排除
*产品变更时，无2g服务、无3g服务。新增2g服务立即生效（特殊情况）
*产品变更时，无2g服务、无3g服务。新增3g服务次月生效
*产品变更时，有2g服务、无3g服务。取消2g服务同时新增3g服务。2g服务月底失效，3g服务次月生效
*产品变更时，有2g服务、无3g服务。取消2g服务。2g服务立即失效（特殊情况）
*产品变更时，无2g服务、有3g服务。取消3g服务同时新增2g服务。取消3g服务月底失效，新增2g服务次月生效
*产品变更时，无2g服务、有3g服务。取消3g服务。3g服务月底失效
*/
function compSvcDate(elementId) {
	var all2g = ["10025","16025","10323"];
	var all3g = ["10300","16300","10299"];
	var has2g="false";
	var has3g="false";
	
	if(!all2g.include(elementId))
		return false;
		
	$A($(productArea).all).each(function(prod) {
		if(prod.tagName.toUpperCase() == 'INPUT' && prod.type.toUpperCase() == 'CHECKBOX'
			&& prod.getAttribute('_thisType') != 'undefined' && prod.getAttribute('_thisType').toUpperCase() == 'PRODUCT' && prod.getAttribute('productMode')=="00" && prod.checked) {
							
			//重算元素生效、失效时间
			$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
					&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
					&& elem.getAttribute('elementTypeCode').toUpperCase() == 'S') {
				
						if(all2g.include(elem.elementId)
							&&(elem.getAttribute('modifyTag')=="9"||(elem.getAttribute('modifyTag')=="0"&&elem.checked)))
						{
							has2g="true";
						}
						
						if(all3g.include(elem.elementId)
							&&(elem.getAttribute('modifyTag')=="9"||(elem.getAttribute('modifyTag')=="0"&&elem.checked)))
						{
							has3g="true";
						}
				}
			});
		}
	});
	//产品变更时，无2g服务、无3g服务。新增2g服务立即生效（特殊情况）
	//产品变更时，有2g服务、无3g服务。取消2g服务。2g服务立即失效（特殊情况）
	if(has2g=="true"&&has3g=="false")
	{
		return true;
	}
	
	return false;
}

// qc:81561 end
/**
 * 生成基本产品信息
 * @param 无
 * @return 记录基本产品的相关信息
 * @author zhoush
 */
function geneBaseProductInfo() {
	mProdCount = 0;
	memDisProdCount = 0;
	mProdStartDate = '';
	mProdEndDate = '';
	newProdId = '';
	newBrandCode = '';
	newNetCode = '';
	newPrepayTag = '';
	baseProduct=null;//added by tangz@2009-1-1 0:33
	
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
		
		if(prod.getAttribute('parentArea') =="productArea" && prod.getAttribute('productMode')=='00' && prod.isDisabled == true && prod.getAttribute('endDate')<=Cs.util.Utility.getLastDay(Cs.ctrl.Trade.getSysDate())){
    		memDisProdCount++;
    	}
	    
		if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
			//记录新产品、新品牌、新基本产品生效时间、新基本产品失效时间
			mProdCount++;
			//如果基本产品是用户原有产品，生效时间取系统时间（例：服务/优惠变更业务）
			if(prod.getAttribute('modifyTag') == '9') {
				mProdStartDate = mOldProdEndDate = Cs.ctrl.Trade.getSysDate();
			}
			else {
			if(tradeTypeCode == "10"||tradeTypeCode == "500"||tradeTypeCode == "503")
			{
				mProdStartDate = Cs.ctrl.Trade.getSysDate() ;
				prod.setAttribute('_startDate', mProdStartDate);
			}
			else{
				mProdStartDate = prod.getAttribute('_startDate');
				}
				mOldProdEndDate = Cs.util.Utility.computeDate(mProdStartDate, '6', -1);
				
			}
			mProdEndDate = prod.getAttribute('_endDate');
			
			newProdId = prod.getAttribute('productId');
			newBrandCode = prod.getAttribute('brandCode');
			newNetCode = prod.getAttribute('netTypeCode');
			newPrepayTag = prod.getAttribute('prepayTag');
			newProductTypeCode = prod.getAttribute('productTypeCode');
			baseProduct = prod;//added by tangz@2009-1-1 0:33
			
		}
	});
	if(mOldProdEndDate=="")
	{
	if(relationTypeCode =='21')
	    {
	        mOldProdEndDate = Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), '3', 1),'1',-1);
	        mProdStartDate = Cs.ctrl.Trade.getSysDate();
	    }
	else    
	    {
	        mOldProdEndDate = Cs.ctrl.Trade.getSysDate();
	        mProdStartDtae = Cs.ctrl.Trade.getSysDate();
	    }   
	}    
}

/* 生成成员产品信息
 * @param 无
 * @return 记录成员产品的相关信息
 * @author steven gong
 */
function geneMemberProductInfo() {
    memProdCount = 0;
    $A(document.getElementsByName('_productinfos')).each(function(prod) {
         if(prod.checked && prod.getAttribute('productMode') == '20' &&prod.getAttribute('parentArea') == productArea) {
              //统计成员产品的数量
              memProdCount++;
         }
    });
}


/**
 * @deprecated 被ChangeElement.checkBeforeGeneTrade()覆盖
 * 
 * 生成台帐信息前检查
 * @param 无
 * @return 抛出提示信息
 * @author zhoush
 */
function checkBeforeGeneTrade() {
	console.log('+++++ checkBeforeGenTrade() ++++\n');	
	tradeAttr =[];
	if(mProdCount == 0) throw new Error('请选择一个基本产品！');
	if(mProdCount > 1) throw new Error('只能选择一个基本产品！');
	
	if($("iphoneDeviceArea")){
		if($("DEVICE_IMEI") && $F("DEVICE_IMEI") =="")
			throw new Error('请校验自备机串号！');	
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
	     	if(getRightCode() != "csCreateWileBossYUserTrade" && getRightCode() != "csCreateWileBossYUserTrade4G" && getRightCode() != "csCreateWileProvYUserTrade" )
	     	throw new Error('参加活动后请选择营销产品！');
	     }else if(deviceProductCount>1)
	     {
	     	throw new Error('营销产品只能选择一个！');
	     } 
	     //qc 33729 begin
	     if ($("ASSURE_SERIAL_NUMBER_PRODUCTASSURE")&&$("ASSURE_TYPE")&&$F("ASSURE_TYPE")=="W")
	     {
	    	 if(typeof($('ASSURE_SERIAL_NUMBER_PRODUCTASSURE').yue)!='undefined'){
	    	 if (parseFloat($('ASSURE_SERIAL_NUMBER_PRODUCTASSURE').yue)<parseInt($F("mobilesaleprice")))
	    	 {
	    		 throw new Error('账户余额小于终端结算额！');
	    	 }	
	    	 }
	     }
         //qc 33729 end
    }
	console.log('+++++ checkBeforeGenTrade() 1 ++++\n');	
	
	/*是否需要展开产品、包判断*/
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
		if(prod.checked&&prod.getAttribute('parentArea') == productArea) {
			if((prod.getAttribute('needExp') == '1') && $("p"+prod.getAttribute('productId')).getAttribute('first').toUpperCase() == 'TRUE') {
				throw new Error('请展开产品：\"' + prod.getAttribute('productName') + '\"进行选择操作！');
			}
			
		    var packageCount =0;
			$A($('p'+prod.getAttribute('productId')).all).each(function (s) {
				if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
					&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'PACKAGE'
					&& s.checked) {
					packageCount ++
	
					var elementConut = 0;
					$A($('p'+s.getAttribute('productId')).all).each(function (m) {
			    	    if(m.tagName.toUpperCase() == 'INPUT' && m.type.toUpperCase() == 'CHECKBOX'
			    	        && m.packageId == s.getAttribute('packageId')
					        && m._thisType != 'undefined' && m._thisType.toUpperCase() == 'ELEMENT' && m.checked) {
					     	elementConut++;
					     	
					     	var ele = $("_p"+s.getAttribute('productId')+"k"+s.packageId+"e"+m.elementId+"T"+"D");
					     	if (ele == null)
					     		ele = $("_p"+s.getAttribute('productId')+"k"+s.packageId+"e"+m.elementId+"T"+"S");
					     	if (ele == null)
					     		ele = $("_p"+s.getAttribute('productId')+"k"+s.packageId+"e"+m.elementId+"T"+"X");
							if (ele == null)
					     		ele = $("_p"+s.getAttribute('productId')+"k"+s.packageId+"e"+m.elementId+"T"+"C");
					     		
					     	if(ele && typeof(ele.hasAttr)!='undefined' && !ele.hasAttr.blank()&&ele.hasAttr!="0"){
					     		var tempEle ={};
					     		tempEle.elementId = ele.elementId;
					     		tempEle.elementTypeCode = ele.elementTypeCode;
					     		tempEle.elementName = ele.elementName;
					     		if(typeof m.itemObjNew=="undefined")
					     			tempEle.itemObjNew = "N";
					     		else
					     			tempEle.itemObjNew = m.itemObjNew;
					     		tradeAttr.push(tempEle);
					     		
					     	}
					     	
					    }    		 
        			});	
        			var pkg = $('_p'+s.getAttribute('productId')+'k'+s.packageId);
        			if(elementConut == 0  && $("p"+s.productId+"k"+s.packageId).getAttribute('first').toUpperCase() != 'TRUE') throw new Error('业务包：\"' + pkg.packageName + '\"至少选择1个元素，业务无法继续！');
        			if (pkg.maxNumber !="-1" && parseInt(pkg.maxNumber,10) <elementConut)
						throw new Error('业务包：\"' + pkg.packageName + '\"最多选择'+pkg.maxNumber+'个元素，业务无法继续！');
					if (pkg.minNumber !="-1" && parseInt(pkg.minNumber,10) >elementConut)
						throw new Error('业务包：\"' + pkg.packageName + '\"最少选择'+pkg.minNumber+'个元素，业务无法继续！');
					
				}
			});
						
			if ($('_p'+prod.getAttribute('productId')).maxNumber !="-1" && parseInt($('_p'+prod.getAttribute('productId')).maxNumber,10) <packageCount)
				throw new Error('产品：\"' + prod.getAttribute('productName') + '\"最多选择'+$('_p'+prod.getAttribute('productId')).maxNumber+'个业务包，业务无法继续！');
						
			if ($('_p'+prod.getAttribute('productId')).minNumber !="-1" && parseInt($('_p'+prod.getAttribute('productId')).minNumber,10) >packageCount)
				throw new Error('产品：\"' + prod.getAttribute('productName') + '\"最少选择'+$('_p'+prod.getAttribute('productId')).minNumber+'个业务包，业务无法继续！');
			
			
			$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
					&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'PACKAGE' && elem.needExp == '1'
					&& elem.checked && $("p"+elem.getAttribute('productId')+"k"+elem.getAttribute('packageId')).getAttribute('first').toUpperCase() == 'TRUE') {
						throw new Error('请展开产品：\"' + prod.getAttribute('productName') + '\"的业务包：\"' + elem.packageName + '\"进行选择操作！');
				}
			});
		}
	});
	console.log('+++++ checkBeforeGenTrade() 2 ++++\n');	
	
	/*是否需要展开产品、包判断*/
	$A(document.getElementsByName('_productinfos')).each(function(prod) {
		if(prod.checked&&prod.getAttribute('parentArea') == "deviceProdutArea") {
			if((prod.getAttribute('needExp') == '1') && $("p"+prod.getAttribute('productId')).getAttribute('first').toUpperCase() == 'TRUE') {
				throw new Error('请展开产品：\"' + prod.getAttribute('productName') + '\"进行选择操作！');
			}
			
			var packageCount =0;
			$A($('p'+prod.getAttribute('productId')).all).each(function (s) {
				if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX'
					&& s.getAttribute('_thisType') != 'undefined' && s.getAttribute('_thisType').toUpperCase() == 'PACKAGE'
					&& s.checked) {
					packageCount ++
					var elementConut = 0;
					$A($('p'+s.productId).all).each(function (m) {
			    	    if(m.tagName.toUpperCase() == 'INPUT' && m.type.toUpperCase() == 'CHECKBOX'
			    	        && m.packageId == s.getAttribute('packageId')
					        && m._thisType != 'undefined' && m._thisType.toUpperCase() == 'ELEMENT' && m.checked) {
					     	elementConut++;
					     	
					    }    		
        			});	
        			var pkg = $('_p'+s.productId+'k'+s.packageId);
        			if(elementConut == 0 && $("p"+s.productId+"k"+s.packageId).getAttribute('first').toUpperCase() != 'TRUE') throw new Error('业务包：\"' + pkg.packageName + '\"至少选择1个元素，业务无法继续！');
        			if (pkg.maxNumber !="-1" && parseInt(pkg.maxNumber,10) <elementConut)
						throw new Error('业务包：\"' + pkg.packageName + '\"最多选择'+pkg.maxNumber+'个元素，业务无法继续！');
					if (pkg.minNumber !="-1" && parseInt(pkg.minNumber,10) >elementConut)
						throw new Error('业务包：\"' + pkg.packageName + '\"最少选择'+pkg.minNumber+'个元素，业务无法继续！');
				}
			});
			

		    if ($('_p'+prod.getAttribute('productId')).maxNumber !="-1" && parseInt($('_p'+prod.getAttribute('productId')).maxNumber,10) <packageCount)
				throw new Error('产品：\"' + prod.getAttribute('productName') + '\"最多选择'+$('_p'+prod.getAttribute('productId')).maxNumber+'个业务包，业务无法继续！');
						
			if ($('_p'+prod.getAttribute('productId')).minNumber !="-1" && parseInt($('_p'+prod.getAttribute('productId')).minNumber,10) >packageCount)
				throw new Error('产品：\"' + prod.getAttribute('productName') + '\"最少选择'+$('_p'+prod.getAttribute('productId')).minNumber+'个业务包，业务无法继续！');
			
					
			$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
					&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'PACKAGE' && elem.needExp == '1'
					&& elem.checked && $("p"+elem.getAttribute('productId')+"k"+elem.getAttribute('packageId')).getAttribute('first').toUpperCase() == 'TRUE') {
						throw new Error('请展开产品：\"' + prod.getAttribute('productName') + '\"的业务包：\"' + elem.packageName + '\"进行选择操作！');
				}
			});
		}
	});
	console.log('+++++ checkBeforeGenTrade() end ++++\n');	
}

/**
 * 生成产品、优惠、服务台帐信息
 * @param 无
 * @return true-将生成的台帐信息存入_tradeInfo false-生成失败
 * @author zhoush
 */
function geneTradeInfo() {
	//生成基本产品信息
	geneBaseProductInfo();
	console.log('++++ genTradeInfo 1 ++++');
	//生成台帐信息前检查
	checkBeforeGeneTrade();
	console.log('++++ genTradeInfo 2 ++++');
	
	//各业务生成台帐前
	if(typeof checkBeforeGeneTradeChild != 'undefined' && checkBeforeGeneTradeChild instanceof Function)
		checkBeforeGeneTradeChild();
	var tradeProduct = [];
	var tradeDiscnt = [];
	var tradeSvc = [];
	var tradeNoExp = [];
	var tradePurchase = [];
	var tradeFee = [];
	var tradeGiftFee = [];
	var tradeSubItem =[];
	var tradeScore = [];
	var tradeScoresub = [];
	var tradeSp = [];
	var tradeElement = [];
	var tradeBook = [];
	var tradeProType = [];
	tradeAssure =[];
	var OtherExchangeElement ={};
	var isHasElement = false;
	console.log('++++ genTradeInfo 3 ++++');
	
	/*
	 * 生成未展开台帐时处理逻辑！！
	 * 
	 * 计算逻辑在后台处理
	 * 
	 * 原产品：
	 * 新增时：start_date-业务受理时间(作为元素生效时间的计算起点，取mProdStartDate：当前业务里有基本产品变化时取新基本产品时间，否则系统时间)
	 * end_date-产品失效时间(作为元素结束时间的比较起点)
	 * 
	 * 删除时：
	 * 删除产品时：start_date-用户产品的原生效时间(暂不使用) end_date-产品失效时间(作为元素结束时间的比较起点)
	 * 删除包时：start_date-用户产品的原生效时间(暂不使用) end_date-基本产品失效时间:mOldProdEndDate(作为元素结束时间的比较起点)
	
	 * 新产品：
	 * 新增时：start_date-产品生效时间(作为元素生效时间的计算起点) end_date-产品失效时间(作为元素结束时间的比较起点)
	 * 
	 * @author zhoush
	 */
	 
	$A($(productArea).all).each(function(prod) {
		console.log('++++ genTradeInfo 4 ++++');

		if(prod.tagName.toUpperCase() == 'INPUT' && prod.type.toUpperCase() == 'CHECKBOX'
			&& prod.getAttribute('_thisType') != 'undefined' && prod.getAttribute('_thisType').toUpperCase() == 'PRODUCT') {
						
			//新增产品
			if(prod.getAttribute('modifyTag') == '0') {
				if(prod.checked) {					
					console.log('++++ genTradeInfo 4-1 ++++');
					//新增产品台帐
					tradeProduct.push(geneProdInfo(prod, '0'));
					console.log('++++ genTradeInfo 4-2 ++++');
					
					if($('p'+prod.getAttribute('productId')).getAttribute('first').toUpperCase() == 'TRUE') {
						console.log('++++ genTradeInfo 4-2-1 ++++');
						//生成产品未展开台帐
						tradeNoExp.push(geneNoExpInfo(prod.getAttribute('productId'), '-9', '0', prod.getAttribute('_submitStartDate'), prod.getAttribute('_submitEndDate'), prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
					}
					console.log('++++ genTradeInfo 4-3 ++++');
					
					//新增活动台帐
					tradeProType.push(geneProType(prod, '0'));
					//生成属性台帐子表
					tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('1', prod));
					console.log('++++ genTradeInfo 4-4 ++++');
					// console.log(prod.getAttribute('productId'))
					// console.log($('p'+ prod.getAttribute('productId')).outerHTML + '\n');
					$A($('p' + prod.getAttribute('productId')).all).each(function(elem) {
						console.log('++++ genTradeInfo 4-4-a ++++');
						// console.log(elem.outerHTML)
						//包是否展开处理(处理包已选择的)
						if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
							&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'PACKAGE'
							&& elem.checked && $("p"+elem.getAttribute('productId')+"k"+elem.getAttribute('packageId')).getAttribute('first').toUpperCase() == 'TRUE') {
							//生成包未展开台帐
							console.log('++++ genTradeInfo 4-4-1 ++++');
							tradeNoExp.push(geneNoExpInfo(elem.getAttribute('productId'), elem.getAttribute('packageId'), '0', prod.getAttribute('_submitStartDate'), prod.getAttribute('_submitEndDate'), prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
						}
						console.log('++++ genTradeInfo 4-5 ++++');
												
						if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
							&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
							&& elem.checked) {
							
							console.log('++++ genTradeInfo 4-6 ++++\n');
							//新增优惠台帐
							if(elem.getAttribute('elementTypeCode').toUpperCase() == 'D') {
								console.log('++++ genTradeInfo 5 ++++');
								tradeDiscnt.push(geneDiscntInfo(elem, '0'));
								//生成属性台帐子表
								tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('3', elem));				
								//捆绑减免优惠								
								tradeDiscnt.push(geneExpDiscntInfo(elem));														
								console.log(JSON.stringify(tradeDiscnt))	
							}
							//新增服务台帐
							else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'S') {
								tradeSvc.push(geneSvcInfo(elem, '0'));
								//生成属性台帐子表
								tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('2', elem));							
								//捆绑减免优惠
								tradeDiscnt.push(geneExpDiscntInfo(elem));					
							}
							//新增sp服务台帐
							else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'X') {
								tradeSp.push(geneSpInfo(elem, '0'));
								//生成属性台帐子表
								tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('8', elem));							
								//捆绑减免优惠
								tradeDiscnt.push(geneExpDiscntInfo(elem));										
							}
							//新增购机台帐
							else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'C') {	
								if(getRightCode() != "csCreateWileBossYUserTrade" && getRightCode()!="csCreateWileProvYUserTrade"
                                 && getRightCode() != "csCreateWileGrpUserTrade"  && getRightCode() != "csCreateWilePerUserTrade" && getRightCode() !="csCreatePrePagUserTrade"
                                 && getRightCode() != "csCreateWileGrpUserTrade4G"  && getRightCode() != "csCreateWilePerUserTrade4G" && getRightCode() != "csCreateWilePerUserJoinWO"
                                 && getRightCode() != "csCreateWileBossYUserTrade4G"){
									if(typeof elem.itemObjNew=="undefined"||typeof elem.itemObjNew.mytradeinfo=="undefined")									
										throw new Error('请输入手机imei号！');
									
									
									var purInfo=elem.itemObjNew.mytradeinfo.evalJSON();								
									
									if(typeof purInfo.imei=="undefined")
										throw new Error('请输入手机imei号！');
										
									if(elem.itemObjNew.feelists!=""){									
										var fee=elem.itemObjNew.feelists.evalJSON();									
										for(var i=0;i<fee.length;i++){
											if(fee[i].FEE!=0&&fee[i].OLDFEE!=0)
												tradeFee.push(fee[i]);									
										}										
									}	
																				
									tradePurchase.push(genePurchaseInfo(elem, purInfo));																						
									tradeGiftFee.push(geneGiftFee(purInfo));																					
									tradeSubItem=tradeSubItem.concat(geneSubItem(elem,purInfo,'6'));	//qc:95934																					
																	
									tradeDiscnt.push(geneBindDiscntInfo(elem, purInfo));														
									tradeScore.push(geneTradeScore(purInfo.availscore,purInfo.scorechg));														
									tradeScoresub.push(geneTradeScoresub(elem, purInfo.scorechg));
									
									tradeElement.push(geneElementInfo(elem, '0'));
								}else if(getRightCode()　== "csCreatePrePagUserTrade"){
											//var purInfo={};									
											//purInfo=myDeviceTradeInfo.evalJSON();
											tradeElement.push(geneElementInfo(elem, '0'));
											//tradeDiscnt.push(geneBindDiscntInfo(elem, purInfo));
								}
							}
							//新增实物台帐
							else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'A' || elem.getAttribute('elementTypeCode').toUpperCase() == 'K') {
								tradeElement.push(geneElementInfo(elem, '0'));
							}
							//新增积分台帐
							else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'I'){								
								if(score<elem.score)
									throw new Error('用户积分不够！');
								tradeScore.push(geneTradeScore(score,elem.score));	
								tradeScoresub.push(geneTradeScoresub(elem, elem.score));
								tradeElement.push(geneElementInfo(elem, '0'));
							}
						}
					});
				}
			//删除产品
			} else if(prod.getAttribute('modifyTag') == '1') {
				
				//如果产品置灰并且失效时间为当月月底,则退出当前循环
				if(prod.isDisabled == true && prod.getAttribute('endDate')<=Cs.util.Utility.getLastDay(Cs.ctrl.Trade.getSysDate())){
					return true;
				}

				//删除产品台帐
				tradeProduct.push(geneProdInfo(prod, '1'));

				if($('p'+prod.getAttribute('productId')).getAttribute('first').toUpperCase() == 'TRUE') {
					//生成产品未展开台帐
					tradeNoExp.push(geneNoExpInfo(prod.getAttribute('productId'), '-9', '1', prod.getAttribute('_submitStartDate'), prod.getAttribute('_submitEndDate'), prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
				}
				
				//删除活动台帐
				tradeProType.push(geneProType(prod, '1'));
				//生成属性台帐子表
				tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('1', prod));
				
				$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {
					//包是否展开处理
					if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
						&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'PACKAGE'
						&& $("p"+elem.getAttribute('productId')+"k"+elem.getAttribute('packageId')).getAttribute('first').toUpperCase() == 'TRUE') {
						//生成包未展开台帐
						tradeNoExp.push(geneNoExpInfo(elem.getAttribute('productId'), elem.getAttribute('packageId'), '1', prod.getAttribute('_submitStartDate'), prod.getAttribute('_submitEndDate'), prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
					}					
					
					if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
						&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT') {
						
						//删除优惠台帐
						if(elem.getAttribute('elementTypeCode').toUpperCase() == 'D') {
							tradeDiscnt.push(geneDiscntInfo(elem, '1'));
							//生成属性台帐子表
							tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('3', elem));
							
						}
						//删除服务台帐
						else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'S') {
							tradeSvc.push(geneSvcInfo(elem, '1'));
							//生成属性台帐子表
							tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('2', elem));
							
						}
						//删除sp服务台帐
						else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'X') {
							tradeSp.push(geneSpInfo(elem, '1'));	
							//生成属性台帐子表
							tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('8', elem));	
																					
						}
						//删除实物台帐
						else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'A' || elem.getAttribute('elementTypeCode').toUpperCase() == 'K') {
							tradeElement.push(geneElementInfo(elem, '1'));
						}
					}
				});
				
			//用户原有产品
			} else if(prod.getAttribute('modifyTag') == '9') {
				//选中
				if(prod.checked) {
					//用户原产品可能修改属性
					tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('1', prod));
					
					$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {
						//包是否展开处理
						if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
							&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'PACKAGE'
							&& $("p"+elem.getAttribute('productId')+"k"+elem.getAttribute('packageId')).getAttribute('first').toUpperCase() == 'TRUE') {
							
							//用户原有包(modifyTag='9')，选中时不处理，取消选中时生成删除未展开台帐
							if(!elem.checked && elem.modifyTag == '9') {
								//生成包未展开台帐
								tradeNoExp.push(geneNoExpInfo(elem.getAttribute('productId'), elem.getAttribute('packageId'), '1', prod.startDate, mOldProdEndDate, prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
								
								//生成用户原有包完全删除台帐信息
								tradeNoExp.push(geneDelPackInfo(elem.getAttribute('productId'), elem.getAttribute('packageId'), '1', prod.startDate, mOldProdEndDate, prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
							}
							
							//新增包(modifyTag='0')，选中时生成新增未展开台帐，取消选中时不处理
							if(elem.checked && elem.modifyTag == '0') {
								//生成包未展开台帐
								tradeNoExp.push(geneNoExpInfo(elem.getAttribute('productId'), elem.getAttribute('packageId'), '0', mProdStartDate, prod.endDate, prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
							}
						}
						
						if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
							&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT') {
							
							//用户原有元素(modifyTag='9')，选中不处理，取消选中时生成删除台帐
							if(!elem.checked && elem.modifyTag == '9') {

								//删除优惠台帐
								if(elem.getAttribute('elementTypeCode').toUpperCase() == 'D') {
									tradeDiscnt.push(geneDiscntInfo(elem, '1'));
									//生成属性台帐子表
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('3', elem));
									
								}
								//删除服务台帐
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'S') {
									tradeSvc.push(geneSvcInfo(elem, '1'));
									//生成属性台帐子表
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('2', elem));									
								}
								//删除sp服务台帐
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'X') {
									tradeSp.push(geneSpInfo(elem, '1'));
									//生成属性台帐子表
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('8', elem));																																
								}	
								//删除实物台帐
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'A' || elem.getAttribute('elementTypeCode').toUpperCase() == 'K') {
									tradeElement.push(geneElementInfo(elem, '1'));									
								}															
							}
							
							//用户原有元素选中时修改属性
							if(elem.checked && elem.modifyTag == '9') {
								if(elem.getAttribute('elementTypeCode').toUpperCase() == 'D') {									
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('3', elem));
								}
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'S') {									
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('2', elem));
								}
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'X') {									
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('8', elem));
								}
								//处理删除元素重新选择的情况
								if(elem.hasEnd=="2")
								    tradeDiscnt.push(geneDiscntInfo(elem, '0'));
							}
							
							//新增元素(modifyTag='0')，选中时生成新增台帐，取消选中时不处理
							if(elem.checked && elem.modifyTag == '0') {
								
								//新增优惠台帐
								if(elem.getAttribute('elementTypeCode').toUpperCase() == 'D') {
									tradeDiscnt.push(geneDiscntInfo(elem, '0'));
									//生成属性台帐子表
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('3', elem));						
									//捆绑减免优惠
									tradeDiscnt.push(geneExpDiscntInfo(elem));
								}
								//新增服务台帐
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'S') {
									tradeSvc.push(geneSvcInfo(elem, '0'));
									//生成属性台帐子表
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('2', elem));
									//捆绑减免优惠
									tradeDiscnt.push(geneExpDiscntInfo(elem));										
								}
								//新增sp服务台帐
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'X') {
									tradeSp.push(geneSpInfo(elem, '0'));	
									//生成属性台帐子表
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('8', elem));
									//捆绑减免优惠
									tradeDiscnt.push(geneExpDiscntInfo(elem));																															
								}	
								//新增实物台帐
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'A' || elem.getAttribute('elementTypeCode').toUpperCase() == 'K') {
									tradeElement.push(geneElementInfo(elem, '0'));
								}																
							}
						}
					});
				}
				//取消
				else {
					
					//如果产品置灰并且失效时间为当月月底,则退出当前循环
					if(prod.isDisabled == true && prod.getAttribute('endDate')<=Cs.util.Utility.getLastDay(Cs.ctrl.Trade.getSysDate())){
						return true;
					}
					if(tradeTypeCode=='196'&&prod.getAttribute('productMode')=='00'){
						var modifytag_mark='4';
					}else{
						var modifytag_mark='1';
						
					}
					//删除产品台帐
					tradeProduct.push(geneProdInfo(prod, modifytag_mark));

					if($('p'+prod.getAttribute('productId')).getAttribute('first').toUpperCase() == 'TRUE') {
						//生成产品未展开台帐
						tradeNoExp.push(geneNoExpInfo(prod.getAttribute('productId'), '-9', '1', prod.getAttribute('_submitStartDate'), prod.getAttribute('_submitEndDate'), prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
					}
					
					//删除活动台帐
					tradeProType.push(geneProType(prod, modifytag_mark));
					//生成属性台帐子表
					tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('1', prod));
					
					//用户原优惠、服务(modifyTag='9')的删除记录
					$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {
						//包是否展开处理
						if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
							&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'PACKAGE'
							&& $("p"+elem.getAttribute('productId')+"k"+elem.getAttribute('packageId')).getAttribute('first').toUpperCase() == 'TRUE') {
							//生成包未展开台帐
							tradeNoExp.push(geneNoExpInfo(elem.getAttribute('productId'), elem.getAttribute('packageId'), '1', prod.getAttribute('_submitStartDate'), prod.getAttribute('_submitEndDate'), prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
						}
						
						if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
							&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
							&& elem.modifyTag == '9') {
							
							//删除优惠台帐
							if(elem.getAttribute('elementTypeCode').toUpperCase() == 'D') {
								tradeDiscnt.push(geneDiscntInfo(elem, modifytag_mark));
								//生成属性台帐子表
								tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('3', elem));								
							}
							//删除服务台帐
							else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'S') {
								tradeSvc.push(geneSvcInfo(elem, modifytag_mark));
								//生成属性台帐子表
								tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('2', elem));								
							}
							//删除sp服务台帐
							else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'X') {
								tradeSp.push(geneSpInfo(elem, modifytag_mark));	
								//生成属性台帐子表
								tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('8', elem));																							
							}	
							//删除实物台帐
							else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'A' || elem.getAttribute('elementTypeCode').toUpperCase() == 'K') {
								tradeElement.push(geneElementInfo(elem, '1'));
							}													
						}
					});
				}
			}
		}		
	});
	console.log('++++ genTradeInfo 6 ++++');
	
	if($('currentSaleProductArea')){
		var mOldProdEndDateBak=mOldProdEndDate;
		mOldProdEndDate = Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), '3', 1),'6',-1);
		$A($("currentSaleProductArea").all).each(function(prod) {
			if(prod.tagName.toUpperCase() == 'INPUT' && prod.type.toUpperCase() == 'CHECKBOX'
				&& prod.getAttribute('_thisType') != 'undefined' && prod.getAttribute('_thisType').toUpperCase() == 'PRODUCT') {
				if (prod.getAttribute('modifyTag') == '1') {
					
					//如果产品置灰并且失效时间为当月月底,则退出当前循环
					if(prod.isDisabled == true && prod.getAttribute('endDate')<=Cs.util.Utility.getLastDay(Cs.ctrl.Trade.getSysDate())){
						return true;
					}
					
					//删除产品台帐
					tradeProduct.push(geneProdInfo(prod, '1'));
					if ($('p' + prod.getAttribute('productId')).getAttribute('first').toUpperCase() == 'TRUE') {
						//生成产品未展开台帐
						tradeNoExp.push(geneNoExpInfo(prod.getAttribute('productId'), '-9', '1', prod.getAttribute('_submitStartDate'), prod.getAttribute('_submitEndDate'), prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
					}

					//删除活动台帐
					tradeProType.push(geneProType(prod, '1', prod.getAttribute('productTypeCode')));
					//生成属性台帐子表
					tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('1', prod));

					$A($('p' + prod.getAttribute('productId')).all).each(
							function(elem) {
								//包是否展开处理
								if (elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX' && elem.getAttribute('_thisType') != 'undefined'
										&& elem.getAttribute('_thisType').toUpperCase() == 'PACKAGE' && $("p" + elem.getAttribute('productId') + "k" + elem.getAttribute('packageId')).getAttribute('first').toUpperCase() == 'TRUE') {
									//生成包未展开台帐
									tradeNoExp.push(geneNoExpInfo(elem.getAttribute('productId'), elem.getAttribute('packageId'), '1', prod.getAttribute('_submitStartDate'), prod.getAttribute('_submitEndDate'), prod.getAttribute('productMode'),
											prod.brandCode));
								}

								if (elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX' && elem.getAttribute('_thisType') != 'undefined'
										&& elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT') {

									//删除优惠台帐
									if (elem.getAttribute('elementTypeCode').toUpperCase() == 'D') {
										tradeDiscnt.push(geneDiscntInfo(elem, '1'));
										//生成属性台帐子表
										tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('3', elem));

									}
									//删除服务台帐
									else if (elem.getAttribute('elementTypeCode').toUpperCase() == 'S') {
										tradeSvc.push(geneSvcInfo(elem, '1'));
										//生成属性台帐子表
										tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('2', elem));

									}
									//删除sp服务台帐
									else if (elem.getAttribute('elementTypeCode').toUpperCase() == 'X') {
										tradeSp.push(geneSpInfo(elem, '1'));
										//生成属性台帐子表
										tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('8', elem));

									}
									//删除实物台帐
									else if (elem.getAttribute('elementTypeCode').toUpperCase() == 'A' || elem.getAttribute('elementTypeCode').toUpperCase() == 'K') {
										tradeElement.push(geneElementInfo(elem, '1'));
									}
								}
							});
				}
			}
		});
		mOldProdEndDate=mOldProdEndDateBak;
	}
	
	//ess 营销处理
	if($("deviceProdutArea")){

		//活动相关截止时间
		//qc 10613 begin
		var isGeneTradeId = false;
		//qc 10613 end
		
		$A($("deviceProdutArea").all).each(function(prod) {
			if(prod.tagName.toUpperCase() == 'INPUT' && prod.type.toUpperCase() == 'CHECKBOX'
				&& prod.getAttribute('_thisType') != 'undefined' && prod.getAttribute('_thisType').toUpperCase() == 'PRODUCT') {
							
				//新增产品
				if(prod.getAttribute('modifyTag') == '0') {
					if(prod.checked) {					
						//新增产品台帐
						//qc:95752 begin
						var activeEndDate = "";
						if (myDeviceAllInfo !=""){
							var activeInfo = myDeviceAllInfo.evalJSON();
							var activeStartDate = prod.getAttribute('_startDate') > mProdStartDate ? prod._startDate : mProdStartDate;
							if (spePurchaseTimeStr !=""){
								activeStartDate = spePurchaseTimeStr;						
							}	
							if(typeof activeInfo.months != "undefined" && activeInfo.months != ''){
								activeEndDate = Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(activeStartDate,"3",parseInt(activeInfo.months)).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";
							}	
						}
						if(activeEndDate != "")
							prod._endDate = activeEndDate;
					   //qc:95752 end
						tradeProduct.push(geneProdInfo(prod, '0'));
						//begin zhangzc 149279
						var itemId = "";
				 		Cs.Ajax.register("seq_item_id_ptype",function(node){itemId = node.getAttribute('seq');});
                        Cs.Ajax.swallowXml("common.UtilityPage","getSequence", "seqName=seq_item_id&registerName=seq_item_id_ptype", "",false);
                        if(itemId==""){
                        	itemId="111111";
                        }
					 	if( typeof $("DEVELOP_DEPART_ID_PTYPE") != 'undefined' && typeof $("DEVELOP_STAFF_ID_PTYPE") != 'undefined' && $('DEVELOP_DEPART_ID_PTYPE').value  !="" && $("DEVELOP_STAFF_ID_PTYPE").value !="")
					 	{
					 		var flag=true;
					 		if( typeof(Cs.ctrl.Trade.getObject("TF_B_TRADE_SUB_ITEM"))!= 'undefined' ){
					 	        var subItem = Cs.ctrl.Trade.getObject("TF_B_TRADE_SUB_ITEM")["ITEM"];
					 	        if(typeof(subItem) != 'undefined' && subItem && subItem != ''){
					 	            subItem.each(function(s) {
					 	                if(s.ATTR_CODE == 'developerStaffId'){
					 	                	flag=false;
					 	                }
					 	               
					 	            });
					 	        }
					 	    }
					 		if(flag){
						 		var tempItem1 = [];
						 		var tempItem2 = [];
						 		var params1 = '';
						 		params1 += 'ATTR_TYPE_CODE='+"1"+ '&ITEM_ID='+itemId + '&ATTR_CODE='+"developerStaffId";
						 		params1 += '&ATTR_VALUE='+$('DEVELOP_STAFF_ID_PTYPE').value + '&START_DATE='+Cs.ctrl.Trade.getSysDate() + '&END_DATE='+"2050-12-31 23:59:59";
	
						 		tempItem1.push(params1.toQueryParams());
						 		tradeSubItem=tradeSubItem.concat(tempItem1);
						 				
						 		var params2 = '';
						 		params2 += 'ATTR_TYPE_CODE='+"1"+ '&ITEM_ID='+itemId + '&ATTR_CODE='+"developDepartId";
						 		params2 += '&ATTR_VALUE='+$('DEVELOP_DEPART_ID_PTYPE').value + '&START_DATE='+Cs.ctrl.Trade.getSysDate() + '&END_DATE='+"2050-12-31 23:59:59";
	
						 		tempItem2.push(params2.toQueryParams());
						 		tradeSubItem=tradeSubItem.concat(tempItem2);
					 		}
					 	}
					 	if( typeof $("DEVELOP_DEPART_NAME_PTYPE") != 'undefined' && typeof $("DEVELOP_STAFF_NAME_PTYPE") != 'undefined' && $('DEVELOP_DEPART_NAME_PTYPE').value  !="" && $("DEVELOP_STAFF_NAME_PTYPE").value !="")
					 	{
					 		var flag=true;
					 		if( typeof(Cs.ctrl.Trade.getObject("TF_B_TRADE_SUB_ITEM"))!= 'undefined' ){
					 	        var subItem = Cs.ctrl.Trade.getObject("TF_B_TRADE_SUB_ITEM")["ITEM"];
					 	        if(typeof(subItem) != 'undefined' && subItem && subItem != ''){
					 	            subItem.each(function(s) {
					 	                if(s.ATTR_CODE == 'developerStaffName'){
					 	                	flag=false;
					 	                }
					 	               
					 	            });
					 	        }
					 	    }
					 		if(flag){
						 		var tempItem3 = [];
						 		var tempItem4 = [];
						 		var params3 = '';
						 		params3 += 'ATTR_TYPE_CODE='+"1"+ '&ITEM_ID='+itemId+ '&ATTR_CODE='+"developerStaffName";
						 		params3 += '&ATTR_VALUE='+$('DEVELOP_STAFF_NAME_PTYPE').value + '&START_DATE='+Cs.ctrl.Trade.getSysDate() + '&END_DATE='+"2050-12-31 23:59:59";
	
						 		tempItem3.push(params3.toQueryParams());
						 		tradeSubItem=tradeSubItem.concat(tempItem3);
						 		var params4 = '';
						 		params4 += 'ATTR_TYPE_CODE='+"1"+ '&ITEM_ID='+itemId+ '&ATTR_CODE='+"developDepartName";
						 		params4 += '&ATTR_VALUE='+$('DEVELOP_DEPART_NAME_PTYPE').value + '&START_DATE='+Cs.ctrl.Trade.getSysDate() + '&END_DATE='+"2050-12-31 23:59:59";
	
						 		tempItem4.push(params4.toQueryParams());
						 		tradeSubItem=tradeSubItem.concat(tempItem4);
					 		}
					 	}
					 	
					 	//end 149279
	
						if($('p'+prod.getAttribute('productId')).getAttribute('first').toUpperCase() == 'TRUE') {
							//生成产品未展开台帐
							tradeNoExp.push(geneNoExpInfo(prod.getAttribute('productId'), '-9', '0', prod.getAttribute('_submitStartDate'), prod.getAttribute('_endDate'), prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
						}
						
						if(getRightCode() == "csCreateWilePerUserTrade" || getRightCode() == "csCreateWileGrpUserTrade" || getRightCode() == "csCreateWilePerUserTrade4G" || getRightCode() == "csCreateWileGrpUserTrade4G" || getRightCode() == "csCreateWilePerUserJoinWO"){
							//新增活动台帐
							tradeProType.push(geneProType(prod, '0',$F('NETCARD_PTYPE')));//传入合约可选活动							
						}else{
							//新增活动台帐
							tradeProType.push(geneProType(prod, '0',$F('SALE_PRODUCT_LIST')));//传入营销活动
						}
						//生成属性台帐子表
						tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('1', prod));
						
		     			
	
						$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {
							if(activeEndDate != "")
								elem._endDate = activeEndDate;
							//包是否展开处理(处理包已选择的)
							if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
								&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'PACKAGE'
								&& elem.checked && $("p"+elem.getAttribute('productId')+"k"+elem.getAttribute('packageId')).getAttribute('first').toUpperCase() == 'TRUE') {
								//生成包未展开台帐
								tradeNoExp.push(geneNoExpInfo(elem.getAttribute('productId'), elem.getAttribute('packageId'), '0', prod.getAttribute('_submitStartDate'), prod.getAttribute('_endDate'), prod.getAttribute('productMode'), prod.getAttribute('brandCode')));
							}
													
							if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
								&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
								&& elem.checked) {
								
								//新增优惠台帐
								if(elem.getAttribute('elementTypeCode').toUpperCase() == 'D') {
									//qc 51724 begin 统一版本合并
									Cs.Ajax.register("seq_item_id",function(node){elem.itemId = node.getAttribute('seq');});
                                    Cs.Ajax.swallowXml("common.UtilityPage","getSequence", "seqName=seq_item_id&registerName=seq_item_id", "",false);
                                    tradeDiscnt.push(geneDiscntInfo(elem, '0'));
									//qc 51724 end 统一版本合并
									//qc 10613 begin
									if (myDeviceAllInfo !=""){
										var purInfo={};	
										purInfo=myDeviceAllInfo.evalJSON();
										//qc 51724 begin 统一版本合并
                                        //QC:14818 Begin  对于存在多个资费的情况，原代码用一个ITEM_ID，送计费接口有问题。在QC10613基础上修改。
                                        //Cs.Ajax.register("seq_item_id",function(node){elem.itemId = node.getAttribute('seq');});
                                        //Cs.Ajax.swallowXml("common.UtilityPage","getSequence", "seqName=seq_item_id&registerName=seq_item_id", "",false);
                                        //elem.itemId = purInfo.discntItemId;
                                        //QC:14818 End
										//tradeDiscnt.push(geneDiscntInfo(elem, '0'));
										//qc 51724 end 统一版本合并
										//生成属性台帐子表
								    	var tradeIdCheck = "";
								    	var discntInfo ={};
										if($("tradeIdCheck")) tradeIdCheck = $F("tradeIdCheck");
										else if($("_all_infos"))  tradeIdCheck = $F("_all_infos").evalJSON().TRADE_ID;
										if (tradeIdCheck != "")  discntInfo.tradeId = tradeIdCheck;	
										if (!isGeneTradeId){
										    //qc:95764 河南有礼品的时候不传时间报错 add by xiexc start	
										    //if($('pagecontext').provinceId=='0076'&&getRightCode() == "csCreateUserTrade"){    //qc:95934
										        tradeSubItem=tradeSubItem.concat(geneSubItem(elem,discntInfo,"3",prod._submitStartDate, prod.getAttribute('_endDate')));
										   // }else{
										    //qc:95764 河南有礼品的时候不传时间报错 add by xiexc end
										     //   tradeSubItem=tradeSubItem.concat(geneSubItem1(elem,discntInfo,"3"));
										    //qc:95764 河南有礼品的时候不传时间报错 add by xiexc start
										    //}									
										 	//qc:95764 河南有礼品的时候不传时间报错 add by xiexc end
										 	isGeneTradeId =true;
										}	
									}
										
								    //qc 10613 end
									//生成属性台帐子表
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('3', elem));				
									//捆绑减免优惠								
									tradeDiscnt.push(geneExpDiscntInfo(elem));	
		                            if (isOtherExchange =="1" && myDeviceAllInfo !="")
										Object.extend(OtherExchangeElement,elem);												
								}else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'C') {
									isHasElement = true;
									if(getRightCode()!="csBatCreateUserTrade" &&　getRightCode() != "csCreateWilePerUserTrade" && getRightCode() != "csCreateWileGrpUserTrade" && getRightCode() != "csCreateWilePerUserTrade4G" && getRightCode() != "csCreateWilePerUserJoinWO" && getRightCode() != "csCreateWileGrpUserTrade4G")
									{
										if((typeof elem.itemObjNew=="undefined"||typeof elem.itemObjNew.mytradeinfo=="undefined") && myDeviceAllInfo == "")									
											throw new Error('请输入手机imei号！');										
																					
										var purInfo={};									
										if (myDeviceAllInfo !=""){
											 purInfo=myDeviceAllInfo.evalJSON();
										}else if(typeof elem.itemObjNew!="undefined") {
											purInfo=elem.itemObjNew.mytradeinfo.evalJSON();	
										}else{
											throw new Error('请展开购机属性窗口！');
										}							
										
										if(typeof purInfo.imei=="undefined" && myDeviceAllInfo == "")
											throw new Error('请输入手机imei号！');
											
										if (elem.itemId=="")
											elem.itemId = purInfo.itemId;							
												
										if (myDeviceTradeInfo != ""){
								
												if(myDeviceFeeList!=""){								
														var fee=myDeviceFeeList.evalJSON();									
														for(var i=0;i<fee.length;i++){
															if(fee[i].FEE!=0&&fee[i].OLDFEE!=0)
																tradeFee.push(fee[i]);									
														}										
												} 
				
							
												tradePurchase.push(genePurchaseInfo(elem, purInfo));																						
												tradeGiftFee.push(geneGiftFee(purInfo));	
												purInfo.isPartActive = isPartActive;
												//95934																				
												tradeSubItem=tradeSubItem.concat(geneSubItem(elem,purInfo,'6'));																						
																				
												tradeDiscnt.push(geneBindDiscntInfo(elem, purInfo));														
												tradeScore.push(geneTradeScore(purInfo.availscore,purInfo.scorechg));														
												tradeScoresub.push(geneTradeScoresub(elem, purInfo.scorechg));	
												tradeElement.push(geneElementInfo(elem, '0'));
												if($("deviceAssureArea")){
													if( $("ASSURE_TYPE$lst") && $F("ASSURE_TYPE") !="4" && $F("ASSURE_TYPE") !="0" && $F("ASSURE_TYPE") !="F" && $F("ASSURE_TYPE") !=""){
														var assureStr  = Object.toJSON(lightAssure.getValue("0"));
														if (assureStr !="{}"){
															assureStr= assureStr.replaceAll("_PRODUCTASSURE","");
															var assure =assureStr.evalJSON(true);
						                                    if(typeof assure.ASSURE_ID == "undefined")
					                                    		assure.ASSURE_ID=elem.itemId;
						                                    //qc:50251 统一版本合并
					                                    	if((typeof assure.ASSURE_BANK_MONEY != "undefined")&&(typeof assure.ASSURE_BANK_ACCT_NO != "undefined")){
					                                    	    if(assure.ASSURE_BANK_MONEY==null||assure.ASSURE_BANK_MONEY==""||assure.ASSURE_BANK_ACCT_NO==""||assure.ASSURE_BANK_ACCT_NO==null){
					                                    	        throw new Error('冻结银行存款流水号和冻结金额不能为空,请输入!');
					                                    	        return;
					                                    	    }else{
					                                    	        var assureMoney=parseInt(assure.ASSURE_BANK_MONEY)*100;
					                                    	        assure.ASSURE_BANK_MONEY=assureMoney.toString();
					                                    	        assure.ASSURE_TYPE_CODE="D";
					                                    	    }
					                                    	}
					                                    	//qc:50251 统一版本合并
						                                    assure.ASSURE_DATE=tradePurchase[0].END_DATE;
						                                    assure.X_DATATYPE="NULL";
						                                    //yueyh21 begin
						                                    assure.ASSURE_ID_TYPE="3";
						                                    //yueyh21  end
						                                    tradeAssure.push(assure);
						                                    //qc:95934
						                                    tradeSubItem=tradeSubItem.concat(geneSubItem(elem,Object.toJSON(lightAssure.getValue("1")),'6'));
														}else{
															throw new Error('购机担保场景未配置，请检查配置');
														}
														var assureOtherStr  = Object.toJSON(lightAssure.getValue("1"));
														if (assureOtherStr !="{}"){
															var assureOther =assureOtherStr.evalJSON(true);
															if (typeof assureOther.COMPANY_TYPE_PRODUCTASSURE != "undefined"){
																var tradeItemPur = {};
																tradeItemPur.ATTR_CODE = "TOTAL_COUNT_PRODUCTASSURE";
																tradeItemPur.ATTR_VALUE = assureOther.TOTAL_COUNT_PRODUCTASSURE;
																Cs.ctrl.Trade.appendObject("TF_B_TRADE_ITEM", {ITEM: tradeItemPur});
															}  
														}
													}
												}
												//qc:95934
												if($("devicePtypeArea"))												
													tradeSubItem=tradeSubItem.concat(geneSubItem(elem,lightPtype.getValue(null,false),'6'));
										}
									}
									else{
									  if(getRightCode() != "csCreateWilePerUserTrade" && getRightCode() != "csCreateWileGrpUserTrade" && getRightCode() != "csCreateWilePerUserTrade4G" && getRightCode() != "csCreateWilePerUserJoinWO" && getRightCode() != "csCreateWileGrpUserTrade4G"){
											var purInfo={};	
											purInfo.months="";
											purInfo.imei="999999";
											purInfo.extraFee="";
											purInfo.deviceno="";
											purInfo.mobilecost="0";
											purInfo.mobileinfo="";
											tradePurchase.push(genePurchaseInfo(elem, purInfo));
											tradeElement.push(geneElementInfo(elem, '0'));
											
											if($("deviceAssureArea")){
												if( $("ASSURE_TYPE$lst") && $F("ASSURE_TYPE") !="4" && $F("ASSURE_TYPE") !="0" && $F("ASSURE_TYPE") !="F" && $F("ASSURE_TYPE") !=""){
													var assureStr  = Object.toJSON(lightAssure.getValue("0"));
													if (assureStr !="{}"){
														assureStr= assureStr.replaceAll("_PRODUCTASSURE","");
														var assure =assureStr.evalJSON(true);
														if(typeof assure.ASSURE_ID == "undefined")
					                                    	assure.ASSURE_ID=elem.itemId;
					                                    //qc:50251 add by xiexc atart
					                                    	if((typeof assure.ASSURE_BANK_MONEY != "undefined")&&(typeof assure.ASSURE_BANK_ACCT_NO != "undefined")){
					                                    	    if(assure.ASSURE_BANK_MONEY==null||assure.ASSURE_BANK_MONEY==""||assure.ASSURE_BANK_ACCT_NO==""||assure.ASSURE_BANK_ACCT_NO==null){
					                                    	        throw new Error('冻结银行存款流水号和冻结金额不能为空,请输入!');
					                                    	        return;
					                                    	    }else{
					                                    	        var assureMoney=parseInt(assure.ASSURE_BANK_MONEY)*100;
					                                    	        assure.ASSURE_BANK_MONEY=assureMoney.toString();
					                                    	        assure.ASSURE_TYPE_CODE="D";
					                                    	    }
					                                    	}
					                                    	//qc:50251 add by xiexc end
					                                    assure.ASSURE_DATE=tradePurchase[0].END_DATE;
					                                    assure.X_DATATYPE="NULL";	
					                                    tradeAssure.push(assure);
					                                    //tradeSubItem=tradeSubItem.concat(geneSubItem(elem,Object.toJSON(lightAssure.getValue("1"))));
													}else{
														throw new Error('购机担保场景未配置，请检查配置');
													}
													
													var assureOtherStr  = Object.toJSON(lightAssure.getValue("1"));
													if (assureOtherStr !="{}"){
														var assureOther =assureOtherStr.evalJSON(true);
														if (typeof assureOther.COMPANY_TYPE_PRODUCTASSURE != "undefined"){
															var tradeItemPur = {};
															tradeItemPur.ATTR_CODE = "TOTAL_COUNT_PRODUCTASSURE";
															tradeItemPur.ATTR_VALUE = assureOther.TOTAL_COUNT_PRODUCTASSURE;
															Cs.ctrl.Trade.appendObject("TF_B_TRADE_ITEM", {ITEM: tradeItemPur});
														}  
													}
												}
											}
											//if($("devicePtypeArea"))
												//tradeSubItem=tradeSubItem.concat(geneSubItem(elem,lightPtype.getValue(null,false)));
										}else if(getRightCode()　== "csCreateWilePerUserTrade" || getRightCode() == "csCreateWileGrpUserTrade" || getRightCode()　== "csCreateWilePerUserTrade4G" || getRightCode()　== "csCreateWilePerUserJoinWO" || getRightCode() == "csCreateWileGrpUserTrade4G"){
											var purInfo={};									
											purInfo=myDeviceTradeInfo.evalJSON();
											tradeElement.push(geneElementInfo(elem, '0'));
											if(purInfo.submonths && purInfo.submonths != '' && typeof purInfo.submonths!="undefined")	purInfo.months = purInfo.submonths;																				
											tradeDiscnt.push(geneBindDiscntInfo(elem, purInfo));
										}
									}									
									
								}
								//新增服务台帐
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'S') {
									tradeSvc.push(geneSvcInfo(elem, '0'));
									//生成属性台帐子表
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('2', elem));							
									//捆绑减免优惠
									tradeDiscnt.push(geneExpDiscntInfo(elem));					
								}
								//新增sp服务台帐
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'X') {
									tradeSp.push(geneSpInfo(elem, '0'));
									//生成属性台帐子表
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('8', elem));							
									//捆绑减免优惠
									tradeDiscnt.push(geneExpDiscntInfo(elem));										
								}
								
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'K') {
									tradeElement.push(geneElementInfo(elem, '0'));
								}
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'A') {
									isHasElement = true;
									tradeElement.push(geneElementInfo(elem, '0'));
									elem.isPartActive = isPartActive;
									//qc:95764 校验礼品属性 add by xiexc start
									if((typeof elem.itemObjNew=="undefined")&&(elem.hasAttr&&!elem.hasAttr.blank()&&elem.hasAttr!="0")){
									    throw new Error('请设置礼品'+elem.elementName+'属性之后再保存！');
									}
									//qc:95764 校验礼品属性 add by xiexc end
									tradeSubItem = tradeSubItem.concat(geneTradeSubItemInfo('e', elem));
								}
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'B') {
									isHasElement = true;
									if(typeof elem.itemObjNew=="undefined"||typeof elem.itemObjNew.mytradeinfo=="undefined")									
										throw new Error('请输入礼品串号！');			
														
									var purInfo=elem.itemObjNew.mytradeinfo.evalJSON();				
											
									if(typeof purInfo.imei=="undefined")
										throw new Error('请输入礼品串号！');
									
									tradePurchase.push(genePurchaseInfo(elem, purInfo));	
									purInfo.isPartActive = isPartActive;
									//qc:95934																																											
									tradeSubItem=tradeSubItem.concat(geneSubItem(elem,purInfo,'6'));																			
									tradeElement.push(geneElementInfo(elem, '0'));
										
								}
								//新增积分台帐
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'I'){								
									if(score<elem.score)
										throw new Error('用户积分不够！');
									tradeScore.push(geneTradeScore(score,elem.score));	
									tradeScoresub.push(geneTradeScoresub(elem, elem.score));
									tradeElement.push(geneElementInfo(elem, '0'));
								}
							}
						});
					}
				} 
			}	
		});
		
		//防止营销产品配置错误，导致元素没有被选中
		var calProductCount=0;
		$A(document.getElementsByName('_productinfos')).each(function(prod) {
		  if(prod.checked && prod.getAttribute('productMode') == '50'&&prod.getAttribute('parentArea') == "deviceProdutArea") {
			    //循环累积基础产品
			     calProductCount++
			 }
	     });  
	     //qc:4673 begin
		if(cfsfPtypeTag!="3" && calProductCount>0&&!isHasElement && getRightCode() != "csCreateWilePerUserTrade" && getRightCode() != "csCreateWileGrpUserTrade"
		   && getRightCode() != "csCreateWileBossYUserTrade" && getRightCode()!='csCreateWileProvYUserTrade' && getRightCode() !="csCreatePrePagUserTrade"
		   && getRightCode() != "csCreateWilePerUserTrade4G" && getRightCode() != "csCreateWilePerUserJoinWO" && getRightCode() != "csCreateWileGrpUserTrade4G" && getRightCode() != "csCreateWileBossYUserTrade4G")
			throw new Error('参加活动营销产品中终端或礼品元素必须选择！');
	    //qc:4673 end
	}
	
	//qc:15575 begin
//    alert("isOtherExchange:"+isOtherExchange+" selectTypeStr:"+selectTypeStr+" isPartActive:"+isPartActive);
    if (isOtherExchange =="1" || (selectTypeStr =="1" && isPartActive =="1")){ //存费送费等其他自卑终端的iphone套餐，信息存用户属性
	//qc:15575 end
		var purInfo={};
		//qc:4673 begin
		try{
			purInfo.deviceImei = $F("DEVICE_IMEI");
			purInfo.deviceType = $F("DEVICE_TYPE");
		}catch(ex){
//			throw new Error('自备机场景场景更新异常，请关掉页面重新受理！');
            throw new Error('因变动了产品，请重新参与活动并校验自备机，如果不再需要参与活动，请放弃该用户，重新新装或纳入该用户。');
        }
		purInfo.isPartActive = isPartActive;
		purInfo.isOwnerPhone ="1";
		//qc:15575 begin
		//Cs.ctrl.Trade.appendObject("TRADE_SUB_ITEM_INPRODUCTFRAME",purInfo);
		//qc:15575 end
		//qc:4673 end
		
		//qc:15575 begin
		if (selectTypeStr == "1" && isPartActive == "1") {
			if (myDeviceTradeInfo !="" && Object.toJSON(OtherExchangeElement) == "{}") {
				OtherExchangeElement.elementId = "-1";
				OtherExchangeElement.productId = "-1";
				OtherExchangeElement.packageId = "-1";
				var providePurInfo = myDeviceTradeInfo.evalJSON();
				providePurInfo.isPartActive = isPartActive;
				providePurInfo.itemId = "-1";
				OtherExchangeElement.itemId = providePurInfo.itemId;
				tradePurchase.push(genePurchaseInfo(OtherExchangeElement, providePurInfo));	
				//qc:95934																			
				tradeSubItem=tradeSubItem.concat(geneSubItem(providePurInfo,providePurInfo,'6'));
			}
		}
		// qc:15575 end
		
		if (myDeviceAllInfo !="" && Object.toJSON(OtherExchangeElement) !="{}"){//参加合约计划
		    OtherExchangeElement.elementId ="-1";
			var providePurInfo=myDeviceAllInfo.evalJSON();
			providePurInfo.isPartActive = isPartActive;
			OtherExchangeElement.itemId = providePurInfo.itemId;
			tradePurchase.push(genePurchaseInfo(OtherExchangeElement, providePurInfo));	
		//QC:7232 Begin
		//	tradeSubItem=tradeSubItem.concat(geneSubItem(providePurInfo,providePurInfo));	
		//QC:7232 End
		}
		
		//qc:15575 begin
		if (myDeviceAllInfo !="" && Object.toJSON(OtherExchangeElement) == "{}") {
			OtherExchangeElement.elementId ="-1";
			OtherExchangeElement.productId ="-1";
			OtherExchangeElement.packageId ="-1";
			var providePurInfo=myDeviceAllInfo.evalJSON();
			providePurInfo.isPartActive = isPartActive;
			OtherExchangeElement.itemId = providePurInfo.itemId;
			tradePurchase.push(genePurchaseInfo(OtherExchangeElement, providePurInfo));
			//qc:95934																				
			tradeSubItem=tradeSubItem.concat(geneSubItem(providePurInfo,providePurInfo,'6'));
		}
		//qc:15575 end
	}
    
    //修正iptv、互联网电视开始时间
    
    //修正iptv、互联网电视附加产品月底失效，重新添加iptv后导致iptv时间不对问题。
	$A($(productArea).all).each(function(prod) {
		if(prod.tagName.toUpperCase() == 'INPUT' && prod.type.toUpperCase() == 'CHECKBOX'
			&& prod.getAttribute('_thisType') != 'undefined' && prod.getAttribute('_thisType').toUpperCase() == 'PRODUCT' 
			&& prod.checked && prod.getAttribute('netTypeCode') == "40" && prod.getAttribute('productMode') == "01" && prod.getAttribute('modifyTag') == '9'
			&& prod.getAttribute('endDate') < Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(), "3", 1).substring(0,10)) {
					var hasSvcAdd = false;
					var hasDiscntAdd = false;
					var hasProduct = false;
					$A($('p'+prod.getAttribute('productId')).all).each(function(elem) {

						if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
							&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT') {
							
							if(elem.checked && elem.modifyTag == '0') {
								if(elem.getAttribute('elementTypeCode').toUpperCase() == 'D') {
									hasDiscntAdd = true;
								}
								else if(elem.getAttribute('elementTypeCode').toUpperCase() == 'S' || elem.getAttribute('elementTypeCode').toUpperCase() == 'X') {
									hasSvcAdd = true;
								}																
							}
						}
					});
					if(hasSvcAdd && hasDiscntAdd){
						for(var i=0; i<tradeProduct.length; i++){
							if(tradeProduct[i].PRODUCT_ID == prod.getAttribute('productId')){
								hasProduct = true;
							}
						}
					}
					if(hasSvcAdd && hasDiscntAdd && !hasProduct){
						
						var itpvProd = geneProdInfo(prod, "2");
						itpvProd.START_DATE = prod.startDate;
						itpvProd.END_DATE = "2050-12-31 23:59:59";
						tradeProduct.push(itpvProd);
						
						var itpvProdType = geneProType(prod, '2', prod.getAttribute('productTypeCode'));
						itpvProdType.START_DATE = prod.startDate;
						itpvProdType.END_DATE = "2050-12-31 23:59:59";
						tradeProType.push(itpvProdType);
						
						for(var i=0; i<tradeSvc.length; i++){
							if(tradeSvc[i].PRODUCT_ID == prod.getAttribute('productId')){
								tradeSvc[i].END_DATE = "2050-12-31 23:59:59";
								tradeSubItem = fixIptvTradeSubItemInfo(tradeSvc[i].ITEM_ID, tradeSubItem);
							}
						}
						for(var i=0; i<tradeDiscnt.length; i++){
							if(tradeDiscnt[i]!=undefined && tradeDiscnt[i].PRODUCT_ID == prod.getAttribute('productId')){
								tradeDiscnt[i].END_DATE = "2050-12-31 23:59:59";
								tradeSubItem = fixIptvTradeSubItemInfo(tradeDiscnt[i].ITEM_ID, tradeSubItem);
							}
						}
						for(var i=0; i<tradeSp.length; i++){
							if(tradeSp[i].PRODUCT_ID == prod.getAttribute('productId')){
								tradeSp[i].END_DATE = "2050-12-31 23:59:59";
								tradeSubItem = fixIptvTradeSubItemInfo(tradeSp[i].ITEM_ID, tradeSubItem);
							}
						}
					}
		}		
	});
		
	if(tradeProduct.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_PRODUCT", {ITEM: tradeProduct});
	if(tradeDiscnt.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_DISCNT", {ITEM: tradeDiscnt});
	if(tradeSvc.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_SVC", {ITEM: tradeSvc});
	if(tradeNoExp.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_OTHER", {ITEM: tradeNoExp});
	if(tradePurchase.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_PURCHASE", {ITEM: tradePurchase});
	if(tradeFee.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADEFEE_SUB", {ITEM: tradeFee});	
	if(tradeGiftFee.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADEFEE_GIFTFEE", {ITEM: tradeGiftFee});		
	if(tradeSubItem.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_SUB_ITEM", {ITEM: tradeSubItem});
	if(tradeScore.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_SCORE", {ITEM: tradeScore});
	if(tradeScoresub.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_SCORESUB", {ITEM: tradeScoresub});
	if(tradeSp.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_SP", {ITEM: tradeSp});	
	if(tradeElement.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_ELEMENT", {ITEM: tradeElement});	
	if(tradeBook.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_BOOKING", {ITEM: tradeBook});

	if(tradeProType.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_PRODUCT_TYPE", {ITEM: tradeProType});
	
	if(tradeAssure.length > 0) Cs.ctrl.Trade.saveObject("TF_B_TRADE_ASSURE", {ITEM: tradeAssure});
	
	return true;
}

function fixIptvTradeSubItemInfo(itemId, tradeSubItem){

	if(itemId==null || itemId=="" || isNaN(itemId)) 
		return tradeSubItem;
	for(var j=0; j<tradeSubItem.length; j++){
		if(itemId == tradeSubItem[j].ITEM_ID){
			tradeSubItem[j].END_DATE = "2050-12-31 23:59:59";
		}
	}
	return tradeSubItem;
}

/**
 * 生成台帐纵表信息(TF_B_TRADE_SUB_ITEM)
 * @param attrTypeCode 1：台帐产品子表 2：台帐服务子表 3：台帐资费子表 8：台帐sp子表
 * @param srcObject 产品或元素对象
 * @return 属性台帐数组
 * @author zhoush
 */
function geneTradeSubItemInfo(attrTypeCode, srcObject) {
	var tradeSubItem = [];
	
	var startDate = '';
	var endDate = '';
	
	if(srcObject.modifyTag == '0') {
		startDate = srcObject._submitStartDate;
		endDate = srcObject._submitEndDate;
	}
	else if(srcObject.modifyTag == '9') {
		startDate = Cs.ctrl.Trade.getSysDate();
		endDate = srcObject.endDate;
	}
	else if(srcObject.modifyTag == '1') {
		startDate = srcObject._submitStartDate;
		endDate = srcObject._submitEndDate;
	}

	
	for (var property in srcObject.itemObjNew) {
		
		//判断体验
		if(srcObject.itemObj["experience"]=="0"){
			
			if(srcObject.itemObj["experience"]!=srcObject.itemObjNew["experience"])
				throw new Error("提前终止体验直接取消即可！");
			if(srcObject.itemObj["experienceLimitMonths"]!=srcObject.itemObjNew["experienceLimitMonths"])
				throw new Error("不能修改体验月数！");
			if(srcObject.itemObj["experienceEnableTag"]!=srcObject.itemObjNew["experienceEnableTag"])
				throw new Error("不能修改生效方式！");	
										
			endDate=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(startDate,"3",parseInt(srcObject.itemObjNew["experienceLimitMonths"])).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";									
     	}
		//判断不体验
		if(srcObject.itemObj["experience"]=="1"){
			if(srcObject.itemObj["experience"]!=srcObject.itemObjNew["experience"])
			     throw new Error("已经是永久体验了，不能 再次修改成体验，可以提前终止体验直接取消即可！");
		}
		else if(srcObject.itemObjNew["experience"]=="0"){
			endDate=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(startDate,"3",parseInt(srcObject.itemObjNew["experienceLimitMonths"])).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";	
		}
				
		if(srcObject.itemObjNew[property] != srcObject.itemObj[property]) {
			
			var params = '';
			params += 'ATTR_TYPE_CODE='+attrTypeCode + '&ITEM_ID='+srcObject.itemId + '&ATTR_CODE='+property;
			params += '&ATTR_VALUE='+srcObject.itemObjNew[property] + '&START_DATE='+startDate + '&END_DATE='+endDate;

			tradeSubItem.push(params.toQueryParams());
		}
	}
	
	return tradeSubItem;
}

/**
 * 生成产品台帐信息
 * @param prod 产品对象
 * @param modifyTag 修改标志
 * @return JSON格式产品台帐
 * @author zhoush
 */
function geneProdInfo(prod, modifyTag) {
	var params = '';
	var startDate;
	var endDate;
	
	if(modifyTag == '0') {
		//附加产品生效时间：取附加产品与基本产品的大值
		startDate = prod.getAttribute('_startDate') > mProdStartDate ? prod._startDate : mProdStartDate;
		endDate = prod.getAttribute('_endDate');		
	} else if(modifyTag == '1') {
		startDate = prod.startDate;
		endDate = mOldProdEndDate;
	}else if (modifyTag == '4')//begin tfs:291295  add by qinjl
	{
		startDate = prod.startDate;
		endDate = mOldProdEndDate;
	}//end
	//记录提交时间
	prod._submitStartDate = startDate;
	prod._submitEndDate = endDate;
	params += 'PRODUCT_ID='+prod.getAttribute('productId') + '&PRODUCT_MODE='+prod.getAttribute('productMode') + '&START_DATE='+startDate + '&END_DATE='+endDate;
	params += '&MODIFY_TAG=' + modifyTag + '&USER_ID_A=' + userIdA + '&ITEM_ID='+prod.itemId + '&BRAND_CODE='+prod.brandCode + '&X_DATATYPE=NULL';
	
	return params.toQueryParams();
}

/**
 * 生成活动台帐信息
 * @param prod 活动对象
 * @param modifyTag 修改标志
 * @return JSON格式产品台帐
 * @author zhoush
 */
function geneProType(prod, modifyTag,productTypeCodeIn) {
	var params = '';
	var startDate;
	var endDate;
	if(prod.getAttribute('productMode')=="20")
	    return;
	if(modifyTag == '0') {
		//附加产品生效时间：取附加产品与基本产品的大值
		startDate = prod.getAttribute('_startDate') > mProdStartDate ? prod._startDate : mProdStartDate;
		endDate = prod.getAttribute('_endDate');		
	} else if(modifyTag == '1') {
		startDate = prod.startDate;
		endDate = mOldProdEndDate;
	}else if (modifyTag == '4')//begin tfs:291295  add by qinjl
	{
		startDate = prod.startDate;
		endDate = mOldProdEndDate;
	}//end
	
	//记录提交时间
	prod._submitStartDate = startDate;
	prod._submitEndDate = endDate;
	params += 'PRODUCT_ID='+prod.getAttribute('productId') + '&PRODUCT_MODE='+prod.getAttribute('productMode') + '&START_DATE='+startDate + '&END_DATE='+endDate;
	params += '&MODIFY_TAG=' + modifyTag +"&X_DATATYPE=NULL" ;
	
	//QC:97860 Begin
	if(typeof newProductTypeCode == "undefined")
	{
		if(typeof prod.getAttribute('productTypeCode') != "undefined")
		{
			newProductTypeCode = prod.getAttribute('productTypeCode');
		}
		else
		{
			newProductTypeCode = productTypeCode;
		}
	}
	//QC:97860 End
	if(productTypeCodeIn){//指定传入活动
		if(userId!=""){
		params +="&USER_ID=" + userId +"&PRODUCT_TYPE_CODE=" + productTypeCodeIn;
		}
		else
		params +="&PRODUCT_TYPE_CODE="+productTypeCodeIn;
	}else{
	//开户
	if(userId!=""){
		params +="&USER_ID=" + userId +"&PRODUCT_TYPE_CODE=" + ((modifyTag=="0")?newProductTypeCode:productTypeCode);
	}
	else
		params +="&PRODUCT_TYPE_CODE="+newProductTypeCode;
	}
	
	return params.toQueryParams();
}

/**
 * 生成优惠台帐信息
 * @param discnt 优惠对象
 * @param modifyTag 修改标志
 * @return JSON格式优惠台帐
 * @author zhoush
 */
function geneDiscntInfo(discnt, modifyTag) {
	var params = '';
	var startDate;
	var endDate;
	
	if(modifyTag == '0') {
		if(tradeTypeCode=="12"){//用户资料反档生失效时间：按页面中计算时间 add by xuyh@20090604
			startDate = discnt._startDate;
			endDate = discnt._endDate;
		}else{
			//附加产品中优惠生效时间：取元素生效时间与基本产品的大值
			startDate = discnt._startDate > mProdStartDate ? discnt._startDate : mProdStartDate;
			endDate = discnt._endDate;
		}
	} else if(modifyTag == '1') {
		if(tradeTypeCode=="12"){//用户资料反档生失效时间：按页面中计算时间 add by xuyh@20090604
			startDate = discnt._startDate;
			endDate = discnt._endDate;
		}else{
			startDate = discnt.startDate;
			//endDate = mOldProdEndDate;
			endDate = mOldProdEndDate > discnt._endDate ? discnt._endDate : mOldProdEndDate;//老优惠处理
		}
	}else if (modifyTag == '4')//begin tfs:291295  add by qinjl
	{
		startDate = discnt.startDate;
		endDate = mOldProdEndDate > discnt._endDate ? discnt._endDate : mOldProdEndDate;//老优惠处理
	}//end

	if(modifyTag == '0'){
		for (var property in discnt.itemObjNew) {
			if(discnt.itemObjNew[property] != discnt.itemObj[property]) {
				//用户未曾体验
				if(discnt.itemObj["experienceLimitMonths"]==undefined&&discnt.itemObjNew["experience"]=="0"){
					//立即生效	
					if(discnt.itemObjNew["experienceEnableTag"]=="0")					
						startDate=Cs.ctrl.Trade.getSysDate();					
					//下月生效				
					else					
						startDate=Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",1);
					startDate = startDate > mProdStartDate ? startDate : mProdStartDate	;
					if(discnt.itemObjNew["experienceMode"]=="1")
						endDate=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(startDate,"3",parseInt(discnt.itemObjNew["experienceMode"])).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";										
				}		
			}
		}
	}
	
	//记录提交时间
	discnt._submitStartDate = startDate;
	discnt._submitEndDate = endDate;

	params += 'ID='+userId + '&ID_TYPE='+idType + '&PRODUCT_ID='+discnt.productId + '&PACKAGE_ID='+discnt.packageId;
	params += '&DISCNT_CODE='+discnt.elementId + '&SPEC_TAG='+specTag + '&MODIFY_TAG='+modifyTag + '&START_DATE='+startDate;
	params += '&END_DATE='+endDate + '&RELATION_TYPE_CODE='+relationTypeCode + '&USER_ID_A=' + userIdA + '&ITEM_ID='+discnt.itemId + '&X_DATATYPE=NULL';
	
	return params.toQueryParams();
}

/**
 * 生成服务台帐信息
 * @param svc 服务对象
 * @param modifyTag 修改标志
 * @return JSON格式服务台帐
 * @author zhoush
 */
function geneSvcInfo(svc, modifyTag) {
	var params = '';
	var startDate;
	var endDate;
	
	if(modifyTag == '0') {
		//用户原产品中增加服务时，服务的生效时间取基本产品的生效时间
		/*if($('_p'+svc.productId).modifyTag == '9')
			startDate = mProdStartDate;
		else
			startDate = svc._startDate;*/
		
		
		if(tradeTypeCode=="12"){//用户资料反档生失效时间：按页面中计算时间 add by xuyh@20090604
			startDate = svc._startDate;
			endDate = svc._endDate;
			// 81561 begin
					}else if(svc.svcStartMode && svc.svcStartMode == "1"){
			//alert("取消手机上网流量封顶服务月末失效特殊处理");
			if(compSvcDate(svc.elementId))
				startDate	= Cs.ctrl.Trade.getSysDate();
			else
				startDate = Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",1);
			endDate= svc._endDate;
			// 81561 end
		}else{
			//附加产品中服务生效时间：取元素生效时间与基本产品的大值
			startDate = svc._startDate > mProdStartDate ? svc._startDate : mProdStartDate
			endDate = svc._endDate;
			
		}
		
	} else if(modifyTag == '1') {
		if(tradeTypeCode=="12"){//用户资料反档生失效时间：按页面中计算时间 add by xuyh@20090604
			startDate = svc._startDate;
			endDate = svc._endDate;
		}else if(svc.svcEndMode && svc.svcEndMode == "1"){//"取消手机上网流量封顶"服务月末失效特殊处理。 modified by jiaxl@2012-03-30
			//alert("取消手机上网流量封顶服务月末失效特殊处理");
			startDate = svc.startDate;
		//	endDate=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(startDate,"3",1),"6",-1);
		  
		  // 18561 begin		
			if(compSvcDate(svc.elementId))
				endDate = mOldProdEndDate;
			else
				endDate=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",1),"6",-1);
     // 18561 end
     
		}else{
			startDate = svc.startDate;
		    //qc 11065 begin
			if($('pagecontext').provinceId=='0011'){
				endDate = Cs.util.Utility.computeDate(mOldProdEndDate, '6', -1);
			}
			//qc 33698  begin 
			else if ($("N1_33698_TAG_CODE") && $("N1_33698_TAG_CODE").value=="1")
			{
				if(svc.discntSel!=""&&svc.discntSel=="-1")
				{
					var pElement = null;
					for (pElement=svc.parentNode; pElement!=window.document; pElement=pElement.parentNode)
					{
						if(pElement.tagName.toUpperCase() == 'INPUT' && pElement.type.toUpperCase() == 'CHECKBOX'
							&& pElement._thisType != 'undefined' && pElement._thisType.toUpperCase() == 'PRODUCT')
						{
							break;
						}
					}
					if ( pElement!=null && (svc._endDate>pElement._endDate) )
					{
						throw new Error("预约取消时间不能大于产品失效时间!");
					}
					endDate = svc._endDate;
				}
				else
				{
					endDate = mOldProdEndDate;
				}
			}
			//qc 33698 end 
			else{
				endDate = mOldProdEndDate;
			}
			//qc 11065 end
		}
	}else if (modifyTag == '4')//begin tfs:291295  add by qinjl
	{
		startDate = svc.startDate;
		endDate = mOldProdEndDate;
	}//end
	if(modifyTag == '0'){
		for (var property in svc.itemObjNew) {
			if(svc.itemObjNew[property] != svc.itemObj[property]) {
				//用户未曾体验
				if(svc.itemObj["experienceLimitMonths"]==undefined&&svc.itemObjNew["experience"]=="0"){					
					if(svc.itemObjNew["experienceEnableTag"]=="0")	//立即生效				
						startDate=Cs.ctrl.Trade.getSysDate();								
					else//下月生效				
						startDate=Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",1);
					startDate = startDate > mProdStartDate ? startDate : mProdStartDate	;	
					if(svc.itemObjNew["experienceMode"]=="1")
						endDate=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(startDate,"3",parseInt(svc.itemObjNew["experienceLimitMonths"])).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";										
				}		
			}
		}
	}
	//取消特服时若前台加载了失效时间选择场景并且营业员进行了选择就取_endDate为台账失效时间
	if(modifyTag == '1'){
		if(svc.discntEndSel!=undefined&&svc.discntEndSel!='-1')
			endDate = svc._endDate;
	}
		
	//记录提交时间
	svc._submitStartDate = startDate;
	svc._submitEndDate = endDate;

	params += 'SERVICE_ID='+svc.elementId + '&PRODUCT_ID='+svc.productId + '&PACKAGE_ID='+svc.packageId + '&MODIFY_TAG='+modifyTag;
	params += '&START_DATE='+startDate + '&END_DATE='+endDate + '&USER_ID_A=' + userIdA + '&ITEM_ID='+svc.itemId + '&X_DATATYPE=NULL';
	
	return params.toQueryParams();
}

/**
 * 生成未展开的产品或包信息
 * @param productId 产品编码
 * @param packageId 包编码
 * @param modifyTag 修改标志
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @param productMode 产品模式
 * @param brandCode 产品品牌
 * @return JSON格式未展开产品、包台帐信息
 * @author zhoush
 */
function geneNoExpInfo(productId, packageId, modifyTag, startDate, endDate, productMode, brandCode) {
	if(tradeTypeCode == "10"||tradeTypeCode == "500"||tradeTypeCode == "503"){
		startDate = Cs.ctrl.Trade.getSysDate();
	}

	var params = '';
	
	params += 'RSRV_VALUE_CODE=NEXP' + '&RSRV_VALUE='+userId + '&RSRV_STR1='+productId + '&RSRV_STR2='+productMode
	params += '&RSRV_STR3='+packageId + '&RSRV_STR4='+productTypeCode + '&RSRV_STR5='+newProductTypeCode;
	params += '&RSRV_STR6='+userIdA + '&RSRV_STR7='+specTag + '&RSRV_STR8='+relationTypeCode + '&RSRV_STR9='+brandCode + '&RSRV_STR10='+serialNumber;
	params += '&MODIFY_TAG='+modifyTag + '&START_DATE='+startDate + '&END_DATE='+endDate + '&X_DATATYPE=NULL';
	
	return params.toQueryParams();
}


/**
 * 生成包完全删除的记录信息
 * @param productId 产品编码
 * @param packageId 包编码
 * @param productMode 产品模式
 * @return JSON格式包完全删除信息
 * @author zhoush
 */
function geneDelPackInfo(productId, packageId, modifyTag, startDate, endDate, productMode, brandCode) {
	var params = '';
	
	params += 'RSRV_VALUE_CODE=DLPK' + '&RSRV_VALUE='+userId + '&RSRV_STR1='+productId + '&RSRV_STR2='+productMode
	params += '&RSRV_STR3='+packageId + '&RSRV_STR4='+productTypeCode + '&RSRV_STR5='+newProductTypeCode;
	params += '&RSRV_STR6='+userIdA + '&RSRV_STR7='+specTag + '&RSRV_STR8='+relationTypeCode + '&RSRV_STR9='+brandCode + '&RSRV_STR10='+serialNumber;
	params += '&MODIFY_TAG='+modifyTag + '&START_DATE='+startDate + '&END_DATE='+endDate + '&X_DATATYPE=NULL';
	
	return params.toQueryParams();
}


/**
 * 生成sp服务台帐信息
 * @param sp sp服务对象
 * @param modifyTag 修改标志
 * @return JSON格式服务台帐
 */
function geneSpInfo(sp, modifyTag) {
	var params = '';
	var startDate;
	var endDate;
	
	if(modifyTag == '0') {
		//附加产品中服务生效时间：取元素生效时间与基本产品的大值
		startDate = sp._startDate > mProdStartDate ? sp._startDate : mProdStartDate
		
		endDate = sp._endDate;
	} else if(modifyTag == '1') {
		startDate = sp.startDate;
		endDate = mOldProdEndDate;
	}else if (modifyTag == '4')//begin tfs:291295  add by qinjl
	{
		startDate = sp.startDate;
		endDate = mOldProdEndDate;
	}//end
	
	if(modifyTag == '0'){
		for (var property in sp.itemObjNew) {
			if(sp.itemObjNew[property] != sp.itemObj[property]) {
				//用户未曾体验
				if(sp.itemObj["experienceLimitMonths"]==undefined&&sp.itemObjNew["experience"]=="0"){					
					if(sp.itemObjNew["experienceEnableTag"]=="0")	//立即生效				
						startDate=Cs.ctrl.Trade.getSysDate();											
					else	//下月生效			
						startDate=Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",1);
					startDate = startDate > mProdStartDate ? startDate : mProdStartDate	;					
					if(sp.itemObjNew["experienceMode"]=="1")
						endDate=Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(startDate,"3",parseInt(sp.itemObjNew["experienceLimitMonths"])).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";						
				}		
			}
		}
	}	
	
	//记录提交时间
	sp._submitStartDate = startDate;
	sp._submitEndDate = endDate;	

	params += 'SP_ID='+sp.spId + '&PRODUCT_ID='+sp.productId + '&PACKAGE_ID='+sp.packageId + '&MODIFY_TAG='+modifyTag + '&SP_SERVICE_ID='+sp.elementId + '&ITEM_ID='+sp.itemId;
	params += '&FIRST_BUY_TIME='+startDate + '&START_DATE='+startDate + '&END_DATE='+endDate +'&PARTY_ID='+sp.partyId + '&SP_PRODUCT_ID='+sp.spProductId + '&X_DATATYPE=NULL&REMARK=';
	
	return params.toQueryParams();
}

/**
 * 生成实物台帐信息
 * @param element 实物对象
 * @param modifyTag 修改标志
 * @return JSON格式服务台帐
 */
function geneElementInfo(element, modifyTag) {
	var params = '';
	var startDate;
	var endDate;
	
	if(modifyTag == '0') {
		//附加产品中服务生效时间：取元素生效时间与基本产品的大值
		startDate = element._startDate > mProdStartDate ? element._startDate : mProdStartDate
		
		endDate = element._endDate;
	} else if(modifyTag == '1') {
		startDate = element.startDate;
		endDate = mOldProdEndDate;
	}

	//记录提交时间
	element._submitStartDate = startDate;
	element._submitEndDate = endDate;
	if (element.spId !="-1")
		params += 'ID='+element.spId;
	else
		params += 'ID='+element.elementId;
	
	params += '&PRODUCT_ID='+element.productId + '&PACKAGE_ID='+element.packageId + '&MODIFY_TAG='+modifyTag+'&ITEM_ID='+element.itemId;
	if(userId!=""){
		params += '&START_DATE='+startDate + '&END_DATE='+endDate +'&ID_TYPE='+element.elementTypeCode + '&USER_ID='+userId + '&X_DATATYPE=NULL';		
	}else{
		params += '&START_DATE='+startDate + '&END_DATE='+endDate +'&ID_TYPE='+element.elementTypeCode + '&X_DATATYPE=NULL';
	}	
	
	return params.toQueryParams();
}

/**
 * 生成预约台帐表信息(TF_B_TRADE_BOOKING)
 * @param attrTypeCode 元素类型 0-服务变更 1-优惠变更 2-sp退订 3-停开机
 * @param srcObject 产品或元素对象
 * @return 属性台帐数组
 * @author zhoush
 */
function geneTradeBook(attrTypeCode, srcObject) {
	var tradeBook = [];
	
	var params = '';
	var startDate = '';
	var endDate = '';
	var expMode= '';
	var enableTag ='';
	var expLimitMonth='';
	if(srcObject.modifyTag == '0') {
		startDate = srcObject._submitStartDate;
		endDate = srcObject._submitEndDate;
	}
	else if(srcObject.modifyTag == '9') {
		startDate = Cs.ctrl.Trade.getSysDate();
		endDate = srcObject._submitEndDate;
	}
	else if(srcObject.modifyTag == '1') {
		startDate = srcObject._submitStartDate;
		endDate = srcObject._submitEndDate;
	}
	
	for (var property in srcObject.itemObjNew) {
		if(srcObject.itemObjNew[property] != srcObject.itemObj[property]) {
			//用户未曾体验
			if(srcObject.itemObj["experienceLimitMonths"]==undefined&&srcObject.itemObjNew["experience"]=="0"){
				if(property=="experienceLimitMonths")
					expLimitMonth = srcObject.itemObjNew[property];		
		
				if(property=="experienceMode"){
					params += '&EXP_MODE='+srcObject.itemObjNew[property];
					expMode=srcObject.itemObjNew[property];
				}		
				if(srcObject.itemObjNew["experienceEnableTag"]=="0"){
					enableTag="0";
					startDate=Cs.ctrl.Trade.getSysDate();
				}					
				else{
					enableTag="1";
					startDate=Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",1);
				}
			}	
		
		}
	}
//	if(params!=""&&enableTag=="1"){
//		params +="&ID_TYPE="+attrTypeCode+"&ID="+srcObject.elementId+"&USER_ID="+userId+"&ACCEPT_DATE="+Cs.ctrl.Trade.getSysDate();
//		params +="&DEAL_STATE=0&X_DATATYPE=NULL&BOOK_TIME="+startDate+"&MODIFY_TAG="+srcObject.modifyTag+"&ITEM_ID="+srcObject.itemId;		
//		tradeBook.push(params.toQueryParams());
//	}
	//到期截至
	if(expMode==1){
		params ="MODIFY_TAG=1&ID_TYPE="+attrTypeCode+"&ID="+srcObject.elementId+"&USER_ID="+userId+"&ACCEPT_DATE="+Cs.ctrl.Trade.getSysDate()+"&ITEM_ID="+srcObject.itemId;
		params +="&DEAL_STATE=0&EXP_MODE=1&X_DATATYPE=NULL&BOOK_TIME="+Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(startDate,"3",parseInt(expLimitMonth)).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";
		tradeBook.push(params.toQueryParams());
	}
	return tradeBook;
}

/**
 * 生成购机台帐信息
 * @param purchase 购机对象
 * @param tmp      购机信息
 * @return JSON格式服务台帐
 */
function genePurchaseInfo(purchase,tmp){
	var params = '';
	var endDateTime ;
    //QC:16114 Begin 
	
	//qc 95752 begin
	var startDate = Cs.ctrl.Trade.getSysDate();
	if(typeof purchase._startDate !="undefined")
		startDate = purchase._startDate > mProdStartDate ? purchase._startDate : mProdStartDate;
	
	if(spePurchaseTimeStr&&spePurchaseTimeStr!=null&&spePurchaseTimeStr!="")
		startDate = spePurchaseTimeStr; //续约指定生效时间
	if(tmp.months==''|| typeof tmp.months=="undefined"){
		endDateTime = "2050-12-31 23:59:59";
		tmp.months = "-1";
	}
	else{
	   
		endDateTime = Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(startDate,"3",parseInt(tmp.months)).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";
        
	}
	//qc 95752 end

	//QC:16114 End
	params += 'BINDSALE_ATTR='+purchase.elementId + '&PRODUCT_ID='+purchase.productId　+ '&PACKAGE_ID='+purchase.packageId +'&ITEM_ID='+purchase.itemId+'&AGREEMENT_MONTHS='+tmp.months;	
	params += '&MPFEE='+parseFloat((tmp.extraFee==""?0:tmp.extraFee))*100+'&FEEITEM_CODE='+(tmp.extraFee==""?-1:tmp.feeitem);	
	params += '&END_MODE=0&DEVICE_TYPE='+tmp.deviceno+'&MOBILE_COST='+parseFloat(tmp.mobilecost)*100+'&DEVICE_NAME='+tmp.mobileinfo+'&DEVICE_BRAND=' +tmp.devicebrand + '&IMEI='+tmp.imei;		
	params += '&START_DATE='+startDate+'&END_DATE='+endDateTime+'&X_DATATYPE=NULL';
	//qc:9029 begin
	params += '&STAFF_ID='+$('pagecontext').staffId+'&DEPART_ID='+$('pagecontext').deptId;
	//qc:9029 end
	return params.toQueryParams();	
	
}

/**
 * 生成体验减免优惠信息
 * @param elem 
 * @return JSON格式优惠台帐
 */
function geneExpDiscntInfo(elem){
	var startDate='';
	for (var property in elem.itemObjNew) {
		if(elem.itemObjNew[property] != elem.itemObj[property]) {
			//用户未曾体验
			if(elem.itemObj["experienceLimitMonths"]==undefined&&elem.itemObjNew["experience"]=="0"){
				if(property=="experienceLimitMonths")
					expLimitMonth = elem.itemObjNew[property];		
		
				if(property=="experienceMode"){
					params += '&EXP_MODE='+elem.itemObjNew[property];
					expMode=elem.itemObjNew[property];
				}		
				if(elem.itemObjNew["experienceEnableTag"]=="0"){
					enableTag="0";
					startDate=Cs.ctrl.Trade.getSysDate();
				}					
				else{
					enableTag="1";
					startDate=Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",1);
				}
			}		
		}
	}
	var params = '';
	if(startDate!=''&&elem.itemObjNew["bindDiscnt"]!=null&&trim(elem.itemObjNew["bindDiscnt"])!=""){	
		params += 'ID='+userId + '&ID_TYPE=1&USER_ID_A=-1&SPEC_TAG=0&PRODUCT_ID=-1&PACKAGE_ID=-1';
		params += '&DISCNT_CODE='+elem.itemObjNew["bindDiscnt"] + '&MODIFY_TAG=0&START_DATE='+startDate;
		params += '&END_DATE='+Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",parseInt(elem.itemObjNew["experienceLimitMonths"])+1).substring(0,10),"1",-1).substring(0,10)+" 23:59:59" + '&X_DATATYPE=NULL';									
		
		return params.toQueryParams();	
	}
								
}
/**
 * 生成购机捆绑优惠信息
 * @param purchase 购机对象
 * @param tmp      购机信息
 * @return JSON格式优惠台帐
 */
function geneBindDiscntInfo(purchase,tmp){	
	

	if(tmp.discntcode!="" && typeof tmp.discntcode!="undefined"){
		
        var params = '';
		var iMonths = parseInt(tmp.months)+1;		
		var curSysdate=Cs.ctrl.Trade.getSysDate();		
		var startDateTime = Cs.util.Utility.computeDate(curSysdate, "3", 1);
		var endDateTime = Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(curSysdate,"3",iMonths).substring(0,10),"1",-1).substring(0,10)+" 23:59:59";
                  
		params += 'ID='+userId+'&ID_TYPE=1&PRODUCT_ID='+purchase.productId + '&PACKAGE_ID='+purchase.packageId;
		params += '&DISCNT_CODE='+tmp.discntcode + '&SPEC_TAG='+specTag + '&MODIFY_TAG=0&START_DATE='+startDateTime;
		params += '&END_DATE='+endDateTime + '&RELATION_TYPE_CODE='+relationTypeCode + '&USER_ID_A=' + userIdA + '&ITEM_ID='+purchase.itemId;
	
		return params.toQueryParams();
    }
	
}

/**
 * 生成积分台帐信息
 * @param availscore   可用积分
 * @param scorechg     变化积分
 * @return JSON格式积分台帐
 */
function geneTradeScore(availscore,scorechg)
{
	if(scorechg!='' && typeof scorechg!="undefined"){		
		var params = '';
		params += 'SCORE='+availscore + '&SCORE_CHANGED='+ (-1)*parseInt(scorechg) +'&VALUE_CHANGED=-1&X_DATATYPE=NULL' ;		
		return params.toQueryParams();
	}		
}

/**
 * 生成积分子表台帐信息
 * @param scoresub 积分对象
 * @param scorechg 变化积分
 * @return JSON格式积分子表台帐
 */
function geneTradeScoresub(scoresub,scorechg)
{
	if(scorechg!='' && typeof scorechg!="undefined"){			
		var params = '';
		params += 'ACTION_CODE='+scoresub.elementId + '&SCORE_TYPE_CODE=*&SCORE_CHANGED_SUB='+(-1)*parseInt(scorechg) ;	
		params += '&VALUE_CHANGED_SUB=-1&REMARK=积分兑换&ACTION_COUNT=1&X_DATATYPE=NULL';
		return params.toQueryParams();		
	}	
}


/**
 * 生成赠送费用台帐信息
 * @param fee 实物对象
 * @return JSON格式服务台帐
 */
function geneGiftFee(giftFee){

	if(giftFee.scoremoney!=null && typeof giftFee.scoremoney!="undefined"){
		
		var params = '';
		params += 'FEE='+giftFee.scoremoney + '&OLDFEE='+giftFee.scoremoney + '&LIMIT_FEE=-1';
		params += '&MONTHS=-1&FEE_TYPE_CODE=1000&FEE_MODE=0&RULE_ID=-1&DEPOSIT_PRIOR_RULE_ID=-1';
		params += '&CHARGE_SOURCE_CODE=2&CALCULATE_ID=0&CALCULATE_TAG=0&PAY_TAG=0&STAFF_ID=0000&CALCULATE_DATE=2050-12-31&X_DATATYPE=NULL';	
		return params.toQueryParams();		
	}
	
}

/**
 * 生成子台帐纵表信息
 * @param subItem  对象
 * @param purInfo  购机信息
 * @return JSON格式子台帐纵表
 */
/*function geneSubItem(subItem,purInfo){ //这个函数不用，换用另外一个qc:95934
	
	var result=[];
	var o;
	for (var property in purInfo) {	
		if (purInfo[property] instanceof Function || purInfo[property]=="") continue;
		o={};
		o["ATTR_TYPE_CODE"]=6;		
		o["ITEM_ID"]=subItem.itemId;
		o["ATTR_CODE"]=Cs.util.Utility.unCamelize(property);
		o["ATTR_CODE"]=property;
		o["ATTR_VALUE"]=purInfo[property];	
		result.push(o);				
	}		
	return result;
}*/


//qc 10613 begin
/**
 * 生成子台帐纵表信息
 * @param subItem  对象
 * @param purInfo  购机信息
 * @return JSON格式子台帐纵表
 */
function geneSubItem1(subItem,purInfo,attrTypeCode, startDate, endDate){
	
	var result=[];
	var o;
	for (var property in purInfo) {	
		if (purInfo[property] instanceof Function || purInfo[property]=="") continue;
		o={};
		o["ATTR_TYPE_CODE"]=attrTypeCode;		
		o["ITEM_ID"]=subItem.itemId;
		o["ATTR_CODE"]=Cs.util.Utility.unCamelize(property);
		o["ATTR_CODE"]=property;
		o["ATTR_VALUE"]=purInfo[property];
		result.push(o);				
	}		
	return result;
}
 //qc 10613 end
 
 
 
 //qc 95764 begin
/**
 * 生成子台帐纵表信息
 * @param subItem  对象
 * @param purInfo  购机信息
 * @return JSON格式子台帐纵表
 */
function geneSubItem(subItem,purInfo,attrTypeCode, startDate, endDate){
	// add by huangwy qc:95934 start
	try{
		if (typeof subItem.modifyTag != 'undefined'){
			if(subItem.modifyTag == '0') {
				startDate = subItem._startDate > mProdStartDate ? subItem._startDate : mProdStartDate;
				endDate = subItem._endDate;
			}
			else if(subItem.modifyTag == '9') {
				startDate = Cs.ctrl.Trade.getSysDate();
				endDate = subItem._endDate;
			}
			else if(subItem.modifyTag == '1') {
				startDate = subItem.startDate;
				endDate = mOldProdEndDate > subItem._endDate ? subItem._endDate : mOldProdEndDate;//老优惠处理
			}
		}else{
			startDate = Cs.ctrl.Trade.getSysDate();
			endDate = "2050-12-31 23:59:59";
		}
	}catch(e){
		startDate = Cs.ctrl.Trade.getSysDate();
		endDate = "2050-12-31 23:59:59";
	}
	//add by huangwy qc:95934 end 
	if((tradeTypeCode == "10"||tradeTypeCode == "500"||tradeTypeCode == "503")){
		startDate = Cs.ctrl.Trade.getSysDate();
	}
	var result=[];
	var o;
	for (var property in purInfo) {	
		if (purInfo[property] instanceof Function || purInfo[property]=="") continue;
		o={};
		o["ATTR_TYPE_CODE"]=attrTypeCode;		
		o["ITEM_ID"]=subItem.itemId;
		o["ATTR_CODE"]=Cs.util.Utility.unCamelize(property);
		o["ATTR_CODE"]=property;
		o["ATTR_VALUE"]=purInfo[property];
		o["START_DATE"]=startDate;	
		o["END_DATE"]=endDate;	
		result.push(o);				
	}		
	return result;
}
//qc 95764 end

/**
 * 设置元素属性
 */
function setAttr(param){ 
	var inputNode = Event.element(event).up("span").previous("input");
	if(!inputNode.checked){alert("请先选择后再设置属性！");return;}
	if(param.substr(param.length-2,1)=="C" && getRightCode()=="csBatCreateUserTrade"){alert("批量开户不需要设置终端属性！");return;}
	if(param!=null&&param!=""){//拷贝 add by zhangyangshuo
		copyToClip(param,true);
	}
	//used for attrwin d context
	curAttrObject = inputNode;
	inputNode.isDate = "false";
 	var attr = new Cs.Product.AttrMgr(inputNode);
}
function setAttr1(param){ 
	var inputNode = Event.element(event).up("span").up("span").previous("input");
	if(!inputNode.checked){alert("请先选择后再设置属性！");return;}
	if(param!=null&&param!=""){
		copyToClip(param,true);
	}
	//used for attrwin d context
	curAttrObject = inputNode;
	inputNode.isDate = "false";
 	var attr = new Cs.Product.AttrMgr(inputNode);
}
/**
 * 设置弹出时间框属性
 */
function setDateAttr(obj){
	    
	var parentNode = obj.parentNode.parentNode;
	var inputNode;
	
	$A(parentNode.childNodes).each(function (s) {
       if(s.tagName.toUpperCase() == 'INPUT' && s.type.toUpperCase() == 'CHECKBOX') 
          inputNode = s;
	});
	
	curAttrObject = inputNode;
	inputNode.isDate = "true";
	var attr = new Cs.Product.AttrMgr(inputNode);
}
/**
 * 设置弹出时间框属性
 */
function changeDate(obj){
var sel =  Cs.flower.LookupCombo.getValue(obj);
var sysDate = Cs.ctrl.Trade.getSysDate();

//guagua
//漏话提醒需求 440 和 续约不让选择立即。
if(curAttrObject.elementId=='52017'&&(tradeTypeCode ==440 ||specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&tradeTypeCode == "120" ))
	{
	win.alert("23转4,续约业务不能选择立即。只能次月!");
    Cs.flower.LookupCombo.setValue($("discntSel"), "2");
	Cs.flower.LookupCombo.disabled($('discntSel'),true);
    return;
	}
 
  
if(sel=="0"){
    $(_startDate).value = sysDate;
    $("IMG_CAL__startDate").disabled = true;
    $(_startDate).disabled = true;
}
else if(sel=="1"){    
    $(_startDate).value = Cs.util.Utility.computeDate(sysDate,"1",1);
}
else if(sel=="2") {   
    $(_startDate).value = Cs.util.Utility.computeDate(sysDate,"3",1);
    $("IMG_CAL__startDate").disabled = true;
    $(_startDate).disabled = true;
}
else if(sel=="3"){
    $(_startDate).disabled = false;
	$(_endDate).disabled = false;
	$("IMG_CAL__endDate").disabled = false;
	$("IMG_CAL__startDate").disabled = false;
}else{
	$(_endDate).disabled = true;
	$("IMG_CAL__endDate").disabled = true;
}


} 

/**
 * 时间框属性中的失效时间下拉列表响应函数：
 * 只支持0,2 立即和下月。
 * add by zhangmq45
 */
function changeDatePlus(obj) {
    var sel = Cs.flower.LookupCombo.getValue(obj);
    var sysDate = Cs.ctrl.Trade.getSysDate();

    
    //zhangmq45 tfs 275853 begin
    if(curAttrObject.modifyTag=="0"&&sel=="0"){
    	win.alert("新开服务时,失效时间禁止选为立即!");
    	Cs.flower.LookupCombo.setValue($("discntEndSel"), "-1");
    	return;
    }
    if(curAttrObject.modifyTag=="9"&&sel=="0"&&curAttrObject.checked){
    	win.alert("新开服务时,失效时间禁止选为立即!");
    	Cs.flower.LookupCombo.setValue($("discntEndSel"), "-1");
    	return;
    }
   //zhangmq45 tfs 275853 end
    if (sel == "0") {
        $(_endDate).value = sysDate;
        $("IMG_CAL__startDate").disabled = true;
        $("IMG_CAL__endDate").disabled = true;
        $(_startDate).disabled = true;
        $(_endDate).disabled = true;
    } else if (sel == "1") {
        $(_endDate).value = Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(sysDate, "1", 1), "6", -1);
        $("IMG_CAL__startDate").disabled = true;
        $("IMG_CAL__endDate").disabled = true;
        $(_startDate).disabled = true;
        $(_endDate).disabled = true;
    } else if (sel == "2") {
        $(_endDate).value = Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(sysDate, "3", 1),"6",-1);
        $("IMG_CAL__startDate").disabled = true;
        $("IMG_CAL__endDate").disabled = true;
        $(_startDate).disabled = true;
        $(_endDate).disabled = true;
    } else {
    	
    }
}

/**
 * 设置弹出时间框属性：
 * 需要结束时间和开始时间一起联动
 * 漏话提醒需求，特殊改造
 * 只支持0,2 立即和下月。生失效判断
 * guagua
 */
function changeEndDate(obj){
var sel =  Cs.flower.LookupCombo.getValue(obj);
var sysDate = Cs.ctrl.Trade.getSysDate();
     if(sel=="0"&&(tradeTypeCode ==440 ||specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&tradeTypeCode == "120" ))
	  {
         win.alert("23转4,续约业务不能选择立即。只能次月!");
         Cs.flower.LookupCombo.setValue($("discntSel"), "2");
 		 Cs.flower.LookupCombo.disabled($('discntSel'),true);
         return;
	   }
     
      if (sel=="2"&&(tradeTypeCode ==440 ||specialTimeStr&&specialTimeStr!=null&&specialTimeStr!=""&&tradeTypeCode == "120" ))
    	 {
    	 return;
    	 }
if(sel=="0"){
    $(_startDate).value = sysDate;
   
    $(_endDate).value = Cs.util.Utility.computeDate(sysDate, curAttrObject.endUnit, curAttrObject.endOffset);
	$(_endDate).value = Cs.util.Utility.computeDate($(_endDate).value, '6', -1);
    $("IMG_CAL__startDate").disabled = true;
    $("IMG_CAL__endDate").disabled = true;
    $(_startDate).disabled = true;
    $(_endDate).disabled = true;
}
else if(sel=="1"){    
    $(_startDate).value = Cs.util.Utility.computeDate(sysDate,"1",1);
}
else if(sel=="2") {   
    $(_startDate).value = Cs.util.Utility.computeDate(sysDate,"3",1);
    
    //计算优惠失效时间
		$(_endDate).value = Cs.util.Utility.computeDate(Cs.util.Utility.computeDate(sysDate,"3",1), curAttrObject.endUnit, curAttrObject.endOffset);
		$(_endDate).value = Cs.util.Utility.computeDate($(_endDate).value, '6', -1);
	
    $("IMG_CAL__startDate").disabled = true;
    $("IMG_CAL__startDate").disabled = true;
    $(_startDate).disabled = true;
    $(_endDate).disabled = true;
}
else if(sel=="3"){
    $(_startDate).disabled = false;
	$(_endDate).disabled = false;
	$("IMG_CAL__endDate").disabled = false;
	$("IMG_CAL__startDate").disabled = false;
}
} 
function chkLTE4SerialNumber(chkSerialNumber){
	var isOk = true;
	$A($(productArea).all).each(function(prod) {
		if(prod.tagName.toUpperCase() == 'INPUT' && prod.type.toUpperCase() == 'CHECKBOX'
						&& prod.getAttribute('_thisType') != 'undefined' && prod.getAttribute('_thisType').toUpperCase() == 'PRODUCT' && prod.checked)
		{
			$A($('p'+prod.getAttribute('productId')).all).each(function(elem) 
			{			
				if(elem.tagName.toUpperCase() == 'INPUT' && elem.type.toUpperCase() == 'CHECKBOX'
							&& elem.getAttribute('_thisType') != 'undefined' && elem.getAttribute('_thisType').toUpperCase() == 'ELEMENT'
							&& elem.checked && elem.getAttribute('elementTypeCode').toUpperCase() == 'S') 
				{
					if ($("ISNEED_LET_CHECK") && $("ISNEED_LET_CHECK").value =="1"){ //总开关
						if ($("IS_LTE_SERVICE") && $("IS_LTE_SERVICE").value == elem.elementId){ //判断是否是LTE服务

						    //$("LTE_SER_BEGIN").value="10000000000";
						    //$("LTE_SER_END").value="10000000100";
						                                         
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
						       }
						       var lteFlag = true;
						       //如果不为空则判断号码是否在号段之内							    
							   if (chkSerialNumber!=""){
							       var serNum = parseInt(chkSerialNumber);
						           for (var i=0;i<serBegList.length;i++){
						              var b = parseInt(serBegList[i]);
						              var e = parseInt(serEndList[i]);
						              if (b <= serNum && serNum <= e){
						                 lteFlag = false;
						                 continue;
						              }
						           }  
							   }else{
								   lteFlag = false;
							   }
							   
							   if(lteFlag){
						          win.alert("用户号码不在配置的开始号段:"+serBegList+"到结束号段"+serEndList+"之内，不能办理LTE4G上网服务！<B>需要取消掉LTE4G上网服务！</B>");
						          isOk = false;
						          return;
						       }
						    } else {
						       win.alert("没有配置可办理LTE服务号段，不可办理LTE4G上网服务!");
						    }	   
						    
						}
					}

				}
			});
		}
	});
	
	return isOk;
	
}

/**
 * 业务受理后清空产品展示区域
 * @param 无
 * @return 无
 * @author zhoush
 */
function clearChildInterface() {
	if($(productArea) != null)
		$(productArea).innerHTML = '';
}

/**
 * 调整日期控件,使之弹出在产品属性框之上
 * @author tz
 */

if (window.Calendar!=null && Calendar.prototype.create){
    Calendar.prototype._create=Calendar.prototype.create;
    Calendar.prototype.create=function(_par){this._create(_par);this.element.style.zIndex="6";}
}

Cs.ns("Cs.Product");
Cs.Product.AttrMgr = Class.create();
/**
 * 产品属性管理器
 * @author tz
 */
 
Object.extend(Cs.Product.AttrMgr.prototype , {
  
    close:function(){
        if ($("attrTable")){
            $("attrTable").remove();
            $("attrTableBg").remove();
        }
    },
    
    initialize:function(elm){ 
        if (!elm.elementTypeCode||elm.elementTypeCode.blank()){
            win.alert("参数不正确!");
            return;
        } 
        var a=[];
        a.push("<div id='attrTable' style='position:absolute;z-index=5;'>");
        a.push('<table width="700" border="0" align="center" cellpadding="0" cellspacing="0" style="border:1px solid #ff820a;background-color:#fff;">');
    	a.push('<tr>');
    	a.push('<td valign="top" style="height:41px; background:url(/images-custserv/win/title_bg.gif) top left repeat-x;">');
    	a.push('<table width="100%" height="28" border="0" cellpadding="0" cellspacing="0">');
    	a.push('<tr>');
    	a.push('<td width="20" style="padding-left:10px;"><img src="/images-custserv/win/01.gif" width="17" height="17" /></td>');
    	a.push('<td style="color:#FFFFFF;"><b>属性编辑窗口</b></td>');
    	a.push('<td width="50" style="padding-right:10px;"><a onclick="Cs.Product.AttrMgr.prototype.close()" style="color:#FFFFFF;cursor:pointer;">[&nbsp;关闭&nbsp;]</a></td>');
    	a.push('</tr></table></td></tr>');
    	a.push('<tr>');
    	a.push('<td align="center" valign="top">');
    	a.push('<table width="100%" border="0" cellspacing="0" cellpadding="1" class="threeCol">');
    	a.push('<tr>');
        a.push('<td><div id=_elemAttrArea></div>');
        
        a.push('</td>');
    	a.push('</tr>');
    	a.push('</table>');
    	a.push('</td></tr>');
        a.push('<tr><td class="btnArea" style="line-height:30px;">');
        a.push('<input type="button" id="attrTableOk" value=" 确定 " class="btn3" onclick="Cs.Product.AttrMgr.prototype.close()"/>');
        a.push(' <input type="button" id="attrTableCancel" value=" 取消 " class="btn3" onclick="Cs.Product.AttrMgr.prototype.close()"/></td></tr>');
        a.push('<tr><td height="3" align="center"></td></tr>');
        a.push('</table>');
        a.push('</div>');
        a.push("<iframe id=attrTableBg frameborder=\"0\" style='background-color:#ffffff;position:absolute;top:0;left:0;height:100%;width:100%;z-index:4;filter : progid:DXImageTransform.Microsoft.Alpha(opacity=75);border:0'></iframe>");
        document.body.insertAdjacentHTML("beforeEnd",a.join(""));
        Position.clone(document.body, $('attrTableBg'));
        $("attrTable").modifyTag = elm.modifyTag;
		$("attrTable").itemId = elm.itemId;  //增加 itemid  add by monk 2016.01.06 ---
        $("attrTable").style.top=Position.realOffset(elm)[1]+window.top.document.body.offsetHeight/2-100;
        $("attrTable").style.left = (document.body.scrollWidth - $("attrTable").offsetWidth)/2;
    	
		Event.observe(window, 'resize', function() {
			if($("attrTable")){
				$("attrTable").style.top=Position.realOffset(elm)[1]+window.top.document.body.offsetHeight/2-100;
	            $("attrTable").style.left = (document.body.scrollWidth - $("attrTable").offsetWidth)/2;
	            Position.clone(document.body, $('attrTableBg'));
        	}
        });

        lightAttr.parent=$("_elemAttrArea");
        lightAttr.labelStyle="label";
        lightAttr.inputStyle="";
        
        var context="";
        switch(elm.elementTypeCode){
            case "P":context="PRODUCT_"+elm.productId;break;
            case "D":context="DISCNT_"+elm.elementId;break;
            case "S":context="SERVICE_"+elm.elementId;break;
			case "C":context="GIFT_EXCHANGE_"+elm.elementId;break;
			case "X":context="SP_SERVICE_"+elm.elementId;break;
			case "K":context="GIFT_PACKAGE_"+elm.elementId;break;
			case "B":context="GIFT_EXCHANGE_"+elm.elementId;break;
			case "A":context="GIFT_ELEMENT_"+elm.elementId;break;
        }
        
        $("attrTableOk").onclick=function(){
			var resultMustFill=true;
			var resultOther=true;
			
			//by 271612 begin 
       if($("TERMINAL_CHECK_TAG") && $F("TERMINAL_CHECK_TAG") == "1"){
					if("17"==$('pagecontext').provinceId){
						if($("terminalmac")!=undefined && $("terminalsrcmode")!=undefined && $F("terminalsrcmode")=="A004" && $F("terminalmac")==""){
			        		
			        		win.alert("请输入终端MAC地址进行终端设备校验！");
			    			return;
			        	}
			        	if($("terminalsn")!=undefined && $("terminalsrcmode")!=undefined && $F("terminalsrcmode")=="A005" && $F("terminalsn")==""){
			        		
			        		win.alert("请输入终端串码进行终端设备校验！");
			    			return;
			        	}
			        	/*if($("terminalsn")!=undefined && $F("terminalsn")!="" &&  $("terminalsrcmode")!=undefined && $F("terminalsrcmode")=="A005" 
			        		&& $("termcalC")!=undefined  && $("termcalC").style.display == "none"){
			                win.alert("请重新输入终端串码进行终端设备校验！");
				            return false;
						   }else  if($("terminalmac")!=undefined && $F("terminalmac")!="" &&  $("terminalsrcmode")!=undefined && $F("terminalsrcmode")=="A004" 
							   && $("termcalC")!=undefined  && $("termcalC").style.display == "none"){
						       win.alert("请重新输入终端MAC地址进行终端设备校验！");
							          return false;
						   }else */
							   if($("terminalsn")!=undefined && $F("terminalsn")!="" &&  $("terminalsrcmode")!=undefined && ($F("terminalsrcmode")!="A005" && 
								   $F("terminalsrcmode")!="A004")  && $("termcalC")!=undefined && $("termcalC").style.display == ""){
							   $("termcalC").style.display = "none";
						   }else if($("terminalmac")!=undefined && $F("terminalmac")!="" &&  $("terminalsrcmode")!=undefined && ($F("terminalsrcmode")!="A005" && 
								   $F("terminalsrcmode")!="A004")  && $("termcalC")!=undefined && $("termcalC").style.display == ""){
							   $("termcalC").style.display = "none";
						   }else  if(termcalFlag =="0" && $("termcalC")!=undefined && $("termcalC").style.display == ""){
						            			
						            win.alert("请进行终端设备校验！");
						            return false;
						   } 
						}
			}
			//by 271612 end
			//必输项检查
			$A($("attrTable").getElementsByTagName("INPUT")).each(function(element){  
				      
	            if (element.required == "true"){
	                if (!Cs.ctrl.Validate.verifyElement(element)){
		                resultMustFill = false;
		                throw $break;						
            		}
	            }            
        	});
            //子类业务场景其他操作
			if(resultMustFill&&elm.isDate!="true"){
				try {
					if (typeof doAttrValidate != 'undefined' && doAttrValidate instanceof Function){ 
		                if(doAttrValidate(elm)===false) {//bqglt@20100603 子类验证需要当前元素产品，优惠编码需求							
		                    resultOther = false;
			                throw $break;
		            	}
					}
				}
				catch(e) {
					win.alert(e.message);
					return false;
				}
			}
			if(resultMustFill&&resultOther){
			    
	            if(elm.isDate=="true"){//如果是时间场景回填		    
			        var result = lightAttr.getValue(null,false);
			        var _startDateTemp = elm._startDate;
			        var _endDateTemp =  elm._endDate;
			        elm._startDate = result._startDate;
			        elm._endDate = result._endDate;
			      //qc 33698 begin `
			        elm.discntSel =result.discntSel;
			      //qc 33698 end
			        elm.discntEndSel =result.discntEndSel;
			        //begin
			        if(elm.elementTypeCode.toUpperCase() == "D") 
			        	{
			        	if(elm._endDate.length == 19)
			        		{
			        		if(elm._endDate.substring(14,16) == "59")
			        		{
			        			elm._endDate = elm._endDate.substring(0,16)+":59";
			        		}	
			        		}
			        	}
			        //end
			        //处理对已经失效的优惠进行回复
			        if(elm.hasEnd=="1"&& elm._startDate == Cs.util.Utility.computeDate(Cs.ctrl.Trade.getSysDate(),"3",1))
			        {
			            elm.hasEnd = "2";
			            elm._endDate = "2050-12-31 23:59:59";
			            elm.itemId="";  //added by tangz@2009-5-28 11:31下午  新增的记录重新生成itemId.否则完工报错
			        }    
			        if(result._endDate<result._startDate&&elm.hasEnd!="2")
    		        {
    		        	elm._startDate = _startDateTemp;
			       		elm._endDate = _endDateTemp;
    		            win.alert("开始时间不能大于结束时间!");
    	                return;
    	            }
    	            //qc 33698 begin 
			        if ($("N1_33698_TAG_CODE") && $("N1_33698_TAG_CODE").value=="1")
			        {
			        	if(result._startDate<Cs.ctrl.Trade.getSysDate()&&elm.hasEnd!="2")
			        	{ 
			        		//qc:83512 begin 解决产品变更选择当天立即生效提示：开始时间不能小于当前时间
			        		if(result._startDate.substring(0,10) == Cs.ctrl.Trade.getSysDate().substring(0,10))
			        		{
			        			elm._startDate = Cs.ctrl.Trade.getSysDate();
			        		}
			        		else
			        		{
			        			elm._startDate = _startDateTemp;
			       			  	elm._endDate = _endDateTemp;
			       			  	win.alert("开始时间不能小于当前时间!");
			       			  	return;
			        		}
			        	} 
			        	else if(result._startDate<Cs.ctrl.Trade.getSysDate()&&elm.hasEnd!="2")
			        	{
	    		        	elm._startDate = _startDateTemp;
				       		elm._endDate = _endDateTemp;
	    		            win.alert("开始时间不能小于当前时间!");
	    		            return; 	
			        	}	        
			        		//qc:83512 end 
    	            }	
			        //qc 33698 end  
			        if(result._endDate<Cs.ctrl.Trade.getSysDate()&&elm.hasEnd!="2")
    		        {
    		        	elm._startDate = _startDateTemp;
			       		elm._endDate = _endDateTemp;
    		            win.alert("结束时间不能小于当前时间!");
    	                return;
    	            } 
    	            
    	            if(elm.elementTypeCode.toUpperCase() == "P" && elm.modifyTag =="0"
    	            			&&(tradeTypeCode == "120" ||tradeTypeCode == "110"||tradeTypeCode == "127"||tradeTypeCode == "128")){
    	            	compSelectedProdDate(elm.productId);
    	            }  	             	            
			    }
				else {
	                elm.itemObjNew = lightAttr.getValue(null,true);
			    	if(elm.itemObjTemp!=undefined&&elm.itemObjTemp.id != undefined)
			    		elm.itemObj = {};
			    	try {
						if (typeof doAttrOK != 'undefined' && doAttrOK instanceof Function && elm.isDate!="true"){ 
			        		doAttrOK();
						}
					}
					catch(e) {
						win.alert(e.message);
						return false;
					}
				}
				
				Cs.Product.AttrMgr.prototype.close();
			}
        };
		
		$("attrTableCancel").onclick=function(){
			var resultOther=true;
            //子类业务场景其他操作			
			try {
				if (typeof doAttrCancel != 'undefined' && doAttrCancel instanceof Function && elm.isDate!="true"){ 
			        if(doAttrCancel()===false) {							
			            resultOther = false;
			            throw $break;
			    	}
				}
			}
			catch(e) {
				win.alert(e.message);
				return false;
			}
			
			if(resultOther){				
				if(elm.isDate!="true")
				{   
				    if(elm.itemObjNew == 'undefined'||elm.itemObjNew== null||elm.itemObjNew== ""){
				    	
				    }
				    else{
				    	if(elm.itemObjTemp!=undefined&&elm.itemObjTemp.id != undefined)
				    		elm.itemObj=elm.itemObjTemp;
				    	else
				    		elm.itemObjNew=elm.itemObj;
				    }
				}
								
				Cs.Product.AttrMgr.prototype.close();
			}
        };
        
        //编辑 item 的属性
        lightAttr.callback=function(){
            // 宽带续包年不允许修改包期生效方式
            if(elm.modifyTag == '9') {
                chgabled(["EFFECT_MODE$dspl"],true);
            }
            if(elm.isDate=="true")//设置时间属性
		        lightAttr.setDateValue(elm);
			else
			{      
				if(elm.elementTypeCode =="A")
					initAttrInfo(elm);//初始化礼品属性	      
                if (!elm.itemObj){
                    //获取用户元素属性信息
                    var param="";
                    if (elm.elementTypeCode =="C")
                    	param = "itemId="+elm.itemId+"&elementTypeCode="+elm.elementTypeCode+"&itemIdOld="+"";
                    else
                    	param = "itemId="+elm.itemId+"&elementTypeCode="+elm.elementTypeCode+"&userId="+userId+"&itemIdOld="+elm.itemIdOld;
               
                    Cs.Ajax.register("itemId", function(node){
                        elm.itemId = node.getAttribute("id");
                    });
                    
                    Cs.Ajax.register("subItem", function(node){
                        elm.itemObj = Cs.util.Utility.node2JSON(node);                        
                        
                        lightAttr.setValue(elm.itemObj);
                    });
    				
                    Cs.Ajax.register("subItemOld", function(node){
                    	elm.itemObjNew = elm.itemObjTemp = Cs.util.Utility.node2JSON(node);
                    	elm.itemId = node.getAttribute("id");

                    	lightAttr.setValue(elm.itemObjNew);
                    });
                    //if((Cs.ctrl.PageData.getProvinceCode() == "NMCU")){
                    	if(context.startsWith("GIFT_EXCHANGE_")){
	    					Cs.Ajax.register("tradeInfo", dealTradeInfo);
	    					Cs.Ajax.register("tradeFee", afterDealTradeFee);
	    					myDeviceFeeList ="";
	    					var prodInfo={};
							$A(document.getElementsByName('_productinfos')).each(function(prod) {
							  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
								    //循环累积基础产品
								    prodInfo=prod;
								 }
						     }); 
						   /*  var selectTypeStr ="";
						     var x=document.getElementsByName("selectType");
							 for (var i=0;i<x.length;i++){
								if(x[i].checked == true){
								    selectTypeStr= x[i].value;
								    break;
								}
							 }*/
	    					if (deviceNameTmp!="" && endDateTmp!="" )
	    					{					
	    						Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","init","&score="+elm.score+"&rewardLimit="+elm.rewardLimit+"&userId="+userId+"&context="+context+"|prodAttrs"+"&paramvalue="+elm.paramvalue+"&deviceName="+deviceNameTmp+"&endDate="+endDateTmp+"&myTradeInfo="+myDeviceTradeInfo+"&baseProductId="+prodInfo.productId+"&purchaseProductId="+elm.productId+"&selectTypeStr="+selectTypeStr);
	    					}
	    					else
	    					{
	    						Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","init","&score="+elm.score+"&rewardLimit="+elm.rewardLimit+"&userId="+userId+"&context="+context+"|prodAttrs"+"&paramvalue="+elm.paramvalue+"&myTradeInfo="+myDeviceTradeInfo+"&baseProductId="+prodInfo.productId+"&purchaseProductId="+elm.productId+"&selectTypeStr="+selectTypeStr);
	    					}
	    				};
                    
                  /*  }else{
	    				if(context.startsWith("GFT_EXCHANGE_")){
	    					Cs.Ajax.register("tradeInfo", dealTradeInfo);				
	    					Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","init","&score="+elm.score+"&rewardLimit="+elm.rewardLimit+"&userId="+userId+"&context="+context+"|prodAttrs"+"&paramvalue="+elm.paramvalue);
	    				};
	    			}*/
                    
                    elm.itemObj = elm.itemObjNew = elm.itemObjTemp = {};
                                       
                    Cs.Ajax.swallowXml(prodPage, "getItemValueById", "param="+encodeURIComponent(Object.toJSON(param.toQueryParams())));
                
                }else{
                	if (elm.elementTypeCode =="C"){
                		elm.itemId ="";
                		elm.itemObj ={};
                		var param = "itemId="+elm.itemId+"&elementTypeCode="+elm.elementTypeCode+"&itemIdOld="+"";
                                        
                    Cs.Ajax.register("itemId", function(node){
                        elm.itemId = node.getAttribute("id");
                    });
                    
                    Cs.Ajax.register("subItem", function(node){
                        elm.itemObj = Cs.util.Utility.node2JSON(node);                        
                        
                        lightAttr.setValue(elm.itemObj);
                    });
    				
                    Cs.Ajax.register("subItemOld", function(node){
                    	elm.itemObjNew = elm.itemObjTemp = Cs.util.Utility.node2JSON(node);
                    	elm.itemId = node.getAttribute("id");

                    	lightAttr.setValue(elm.itemObjNew);
                    });
                     if(context.startsWith("GIFT_EXCHANGE_")){
	    					Cs.Ajax.register("tradeInfo", dealTradeInfo);
	    					Cs.Ajax.register("tradeFee", afterDealTradeFee);
	    					var prodInfo={};
							$A(document.getElementsByName('_productinfos')).each(function(prod) {
							  if(prod.checked && prod.getAttribute('productMode') == '00'&&prod.getAttribute('parentArea') == productArea) {
								    //循环累积基础产品
								    prodInfo=prod;
								 }
						     }); 
	    					if (deviceNameTmp!="" && endDateTmp!="" )
	    					{					
	    						Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","init","&score="+elm.score+"&rewardLimit="+elm.rewardLimit+"&userId="+userId+"&context="+context+"|prodAttrs"+"&paramvalue="+elm.paramvalue+"&deviceName="+deviceNameTmp+"&endDate="+endDateTmp+"&myTradeInfo="+myDeviceTradeInfo+"&baseProductId="+prodInfo.productId+"&purchaseProductId="+elm.productId+"&selectTypeStr="+selectTypeStr);
	    					}
	    					else
	    					{
	    						Cs.Ajax.swallowXml("popupdialog.PopMobileInfo","init","&score="+elm.score+"&rewardLimit="+elm.rewardLimit+"&userId="+userId+"&context="+context+"|prodAttrs"+"&paramvalue="+elm.paramvalue+"&myTradeInfo="+myDeviceTradeInfo+"&baseProductId="+prodInfo.productId+"&purchaseProductId="+elm.productId+"&selectTypeStr="+selectTypeStr);
	    					}
	    				};            
                    elm.itemObj = elm.itemObjNew = elm.itemObjTemp = {}; 
                    Cs.Ajax.swallowXml(prodPage, "getItemValueById", "param="+encodeURIComponent(Object.toJSON(param.toQueryParams())));
                	}else{
                    	lightAttr.setValue(elm.itemObjNew);
                	}
                }
            }    
               //add by hutao3
            if($("productArea1")!=null&&$("productArea1")!=undefined&&$("productArea1")!="undefined"&&$("productArea1").style.display!='none'){
            	productAttrCallBack(elm.elementId);//属性回调函数
            }
            //end by hutao3
        }
        
        //第一次从后台取数据，以后从本级缓存取。重新登陆BSS，可清缓存。
        if(elm.isDate=="true"){ 
            if(elm.endEnableTag=="2")
                  lightAttr.lighting_cache("DATE_"+elm.elementId+"|prodAttrs", "DATE_"+elm.elementId);
            else{
                  var netTypeCode = $("_p"+ elm.productId).netTypeCode;
                  if(elm.productMode=="00"||elm.endEnableTag=="1"){
                       if(netTypeCode=="WV" && "TJCU" == provinceCode){
                            lightAttr.lighting_cache("DATE_WV"+"|prodAttrs", "DATE_WV");
                            //light.lighting_first("DATE_WV|prodAttrs","DATE|prodAttrs","DATE_WV");
                       }else{
                       	    if(elm.elementTypeCode.toUpperCase() == "P" && elm.modifyTag =="0"
    	            			&&(tradeTypeCode == "120" ||tradeTypeCode == "110"||tradeTypeCode == "127"||tradeTypeCode == "128")){
    	            			lightAttr.lighting_cache("DATE_MODIFY_PRODUCT"+"|prodAttrs", "DATE_MODIFY_PRODUCT");
    	            		}else
    	            			//QC:98214    对北京这两个元素进行特殊处理，生失效时间不允许在前台修改
    	            		if((elm.elementId=="20010608"||elm.elementId=="20010609") && tradeTypeCode == "10"){
    	            		  lightAttr.lighting_cache("DATE_NOMODIFY"+"|prodAttrs", "DATE_NOMODIFY");
    	            		}
    	            		else if (elm.elementTypeCode.toUpperCase()=="D"&&(elm.elementId=="5706000" || elm.elementId=="5704000" || elm.elementId=="5705000" || elm.elementId=="5707000"))
                              lightAttr.lighting_cache("DATE_"+elm.elementId+"|prodAttrs", "DATE_"+elm.elementId);
    	            		//QC:98214
    	            		else{   
                            	lightAttr.lighting_cache("DATE"+"|prodAttrs", "DATE");
    	            		}
                       }
                 }else 
                	 if(elm.productMode=="60"){ 
                	  lightAttr.lighting_first("DATE_MODIFY_Berry"+"|prodAttrs","DATE_MODIFY_60"+"|prodAttrs");  
                  }else 
                	 {
                	   //qc 33858 begin   设置某个服务的时间可修改（通过场景和tag配置） 
                	    var tagValues = new Array();
                	    var judgeFlag = false; 
                	    if($("N1_DATEMODIFYBYELEMENT_TAG_CODE") && $("N1_DATEMODIFYBYELEMENT_TAG_CODE").value != "0"){           	 	
                	 		tagValues = $("N1_DATEMODIFYBYELEMENT_TAG_CODE").value.split("_");
                	 	}            	 	
                	 	if(typeof(tagValues) != "undefined" && tagValues.length > 0){              	 
	                	 	for (var tagCount = 0;tagCount <tagValues.length;tagCount++){                	 		
	                	 		if(tagValues[tagCount] == elm.elementId){
	                	 			judgeFlag = true;
	                	 		}
	                	 	}    
                	 	}            	 	
                	   if(judgeFlag == true){                	 		
                	 		lightAttr.lighting_first("DATE_MODIFY_BY_ELEMENTID_"+elm.elementId+"|prodAttrs"); 
                	   }else
                	   //qc 33858 end
                	   
                	   if(elm.elementId=="99998013"||elm.elementId=="99998014"||elm.elementId=="99998015"||elm.elementId=="99998016"||elm.elementId=="99998017"){ 
                           	lightAttr.lighting_first("DATE_MODIFY_"+elm.elementId+"|prodAttrs");   
                	   }else{
                       if(netTypeCode=="WV" && "TJCU" == provinceCode){
                            lightAttr.lighting_cache("DATE_MODIFY_WV"+"|prodAttrs", "DATE_MODIFY_WV"); 
                            //light.lighting_first("DATE_MODIFY_WV|prodAttrs","DATE_MODIFY|prodAttrs","DATE_MODIFY_WV");
                       }else{
                       	    if(elm.hasEnd=="1"){
                            	lightAttr.lighting_cache("DATE_MODIFY_IS"+"|prodAttrs", "DATE_MODIFY_IS"); 
                            }
                            // tfs 5184 begin
                            else if (elm.productMode == '01' && groupUserId !=""){
                                    lightAttr.lighting_first("DATE_MODIFY_IS"+"|prodAttrs"); 
                            }
                            // tfs 5184 end
                            else{ 
                            	//QC:52544 begin
                            	if(elm.elementTypeCode.toUpperCase()=="S"&&(elm.elementId=="10300"||elm.elementId=="16300"||elm.elementId=="10025"||elm.elementId=="16025"||elm.elementId=="1629"||elm.elementId=="1048"||elm.elementId=="10110020"||elm.elementId=="16110022"||elm.elementId=="101800"||elm.elementId=="161800"))
                            		lightAttr.lighting_cache("DATE_"+elm.elementId+"|prodAttrs", "DATE_"+elm.elementId);
                            	else if (elm.elementTypeCode.toUpperCase()=="D"&&(elm.elementId=="5706000" || elm.elementId=="5704000" || elm.elementId=="5705000" || elm.elementId=="5707000"))
                                    lightAttr.lighting_cache("DATE_"+elm.elementId+"|prodAttrs", "DATE_"+elm.elementId);
                            	else{ 
                            	//QC:52544 end
                            	//lightAttr.lighting_first("DATE_MODIFY_"+elm.elementId+"|prodAttrs","DATE_MODIFY"+"|prodAttrs", "DATE_MODIFY");
                            	//lightAttr.lighting_first("DATE_MODIFY"+"|prodAttrs");
                            		
                            		//后续可能会使用先留着:套内sp前台生效、失效方式可选立即还是次月，需要配置场景和32省份的tag表参数SP_DATE_START_TAG、SP_DATE_END_TAG
                            		if(document.getElementById("SP_DATE_START_TAG").value=="1"&&document.getElementById("SP_DATE_END_TAG").value!="1"){
                            			lightAttr.lighting_first("DATE_SP_START_PLUG_"+elm.elementId+"|prodAttrs,"+"DATE_MODIFY"+"|prodAttrs");
                            			
                            		}
                            		else
                            			if(document.getElementById("SP_DATE_START_TAG").value!="1"&&document.getElementById("SP_DATE_END_TAG").value=="1"){
                            				lightAttr.lighting_first("DATE_SP_END_PLUG_"+elm.elementId+"|prodAttrs,"+"DATE_MODIFY"+"|prodAttrs");
                            			}
                            			else
                            				if(document.getElementById("SP_DATE_START_TAG").value=="1"&&document.getElementById("SP_DATE_END_TAG").value=="1"){
                            					lightAttr.lighting_first("DATE_SP_START_PLUG_"+elm.elementId+"|prodAttrs,"+"DATE_SP_END_PLUG_"+elm.elementId+"|prodAttrs,"+"DATE_MODIFY"+"|prodAttrs");
                            				}else
                            					lightAttr.lighting_first("DATE_MODIFY"+"|prodAttrs");
                            		
                            		// add by zhangmq45 套内sp前台生效方式可选立即还是次月，需要配置场景和32省份的tag表开关参数SP_DATE_START_TAG
                            		/*if(document.getElementById("SP_DATE_START_TAG").value=="1"){
                            			lightAttr.lighting_first("DATE_SP_START_PLUG_"+elm.elementId+"|prodAttrs,"+"DATE_MODIFY"+"|prodAttrs");
                            		}
                            		else
                            			lightAttr.lighting_first("DATE_MODIFY"+"|prodAttrs");*/
                            		
                            	}                        	
                            }                           	
                       }
                	   }
                  }
             }  
        }
        else{
        	if (elm.elementTypeCode =="C")
        		 lightAttr.lighting_first(context+"|prodAttrs");
        	else
            	lightAttr.lighting_cache(context+"|prodAttrs", context);
            	//lightAttr.lighting_first(context+"|prodAttrs2");
            	
        }
     }
});
function showSaleProduct(productArea,node){

    var plusProductNode = "" ;
    var saleProductNodeXml = "";
    var plusProductNodeXml = "" 
	var saleProductNodeXml = new Cs.util.XML();
	saleProductNodeXml.loadXML(node.xml);	
	saleProductNode = saleProductNodeXml.documentElement;  
	var plusProductNodeXml = new Cs.util.XML(); 
	plusProductNodeXml.loadXML(node.xml);	
	plusProductNode = plusProductNodeXml.documentElement; 
	
	for(var i=0; i<plusProductNode.childNodes.length; i++)
 	{
 		if(plusProductNode.childNodes[i].getAttribute("root")){
	    	if(plusProductNode.childNodes[i].getAttribute("root") =="SALE")
	    	{
	    	    plusProductNode.removeChild(plusProductNode.childNodes[i]);
	    	    i--;
	    	}
 		}
	}
	
	for(var i=0; i<saleProductNode.childNodes.length; i++)
 	{
    	if(!saleProductNode.childNodes[i].getAttribute("root"))//没有包含root 的部分 刷新活动下拉框
    	{
    	    saleProductNode.removeChild(saleProductNode.childNodes[i]);
    	    i--;
    	}
	} 
	

	for(var i=0; i<saleProductNode.childNodes.length; i++)
	{
		var ts = saleProductNode.childNodes[i].getAttribute("paraCode7");
 		if (ts!= null && ts != "-1"){
	    	if (ts.indexOf("|"+tradeTypeCode+"|")==-1 )//不可以办理的业务删掉
	    	{
	    	    saleProductNode.removeChild(saleProductNode.childNodes[i]);
	    	    i--;
	    	}
 		}
 	} 
	var productAreaStr  = "<div id=\""+productArea+"\"><\/div>";
	productAreaStr+="<div id=\"deviceAgreeAreaParent2\" class=\"feldsetCont noPadding\"><div class=\"e_title\">是否参加活动<\/div><\/div>";
	productAreaStr+="<div class=\"c_search\">";
	productAreaStr+="<div id=\"deviceAgreeArea\" class=\"feldsetCont\"><\/div>";
	
	productAreaStr+="<div class=\"feldsetCont noPadding\" id =\"shAgreeDiv\">";
	productAreaStr+="<div class=\"e_title\">活动信息<\/div>";
	productAreaStr+="<div id=\"devicePtypeArea\"><\/div>";
	productAreaStr+="<div id=\"deviceAssureArea\"><\/div>";
	productAreaStr+="<div id=\"deviceSelectArea\" class=\"feldsetCont\"><\/div>";
	productAreaStr+="<div id=\"deviceArea\"><\/div>";
	productAreaStr+="<\/div>";
	productAreaStr+="<div id=\"iphoneDeviceArea\"><\/div>";
	productAreaStr+="<div id=\"deviceProdutArea\"><\/div>";
	productAreaStr+="<\/div>";
	
	if (saleProductNode.childNodes.length>0){
		
		$(productArea).parentNode.innerHTML = productAreaStr;
		drawAgreeArea();
		
	}else{
		$(productArea).parentNode.innerHTML = "<div id=\""+productArea+"\"><\/div>";
	}
	showProductInfoByArea(productArea,plusProductNode);
	if (saleProductNode.childNodes.length>0)
		drawDevicePtypeArea(saleProductNode);
	//return plusProductNode;
}

function showContractProduct(productArea,node){
	var productAreaStr  = "<div id=\""+productArea+"\"><\/div><div id=\"contractInfoArea\"></div>";
	$(productArea).parentNode.innerHTML = productAreaStr;
	
	showProductInfoByArea(productArea,node);
}

Cs.Ajax.unregister("evaluateUserId");  //获取号码的用户编码
Cs.Ajax.unregister("prodInfoByType");  //活动下面的产品
Cs.Ajax.unregister("prodInfoByType1000");  //活动下面的产品
Cs.Ajax.unregister("prodInfoByTypeBat");  //活动下面的产品
Cs.Ajax.unregister("prodInfoByTypePREPAG");  //活动下面的产品
Cs.Ajax.unregister("prodInfoByTypeSALE");  //活动下面的产品
Cs.Ajax.unregister("pkgByPId");  //产品下面包信息
Cs.Ajax.unregister("eleByPkgId");  //包中元素信息
Cs.Ajax.unregister("intfElms_prodAttrs");
Cs.Ajax.unregister("intfElms_ptypeArea"); //购机 活动
Cs.Ajax.unregister("intfElms_assureArea"); //活动购机担保信息
Cs.Ajax.unregister("intfElms_deviceArea"); //终端场景
Cs.Ajax.unregister("intfElms_bossArea");//总部预付费 套包终端场景
Cs.Ajax.unregister("intfElms_provArea");//省份预付费 根据产品配置是否终端场景
Cs.Ajax.unregister("intfElms_netCardPtypeArea"); 

Cs.Ajax.register("evaluateUserId", evaluateUserId);  //获取号码的用户编码
Cs.Ajax.register("prodInfoByType", showProductInfo);  //活动下面的产品
Cs.Ajax.register("prodInfoByType1000", showProductInfo);  //活动下面的产品
Cs.Ajax.register("prodInfoByTypeBat", showProductInfoBat);  //活动下面的产品
Cs.Ajax.register("prodInfoByTypePREPAG", dealAfterGetPrePagProInfo);  //活动下面的产品
Cs.Ajax.register("prodInfoByTypeSALE", showSaleProductInfo);  //活动下面的产品
Cs.Ajax.register("pkgByPId", showPackageInfo);  //产品下面包信息
Cs.Ajax.register("eleByPkgId", showElementInfo);  //包中元素信息
Cs.Ajax.register("intfElms_prodAttrs", lightAttr.draw.bind(lightAttr));
Cs.Ajax.register("intfElms_ptypeArea", lightPtype.draw.bind(lightPtype)); //购机 活动
Cs.Ajax.register("intfElms_assureArea", lightAssure.draw.bind(lightAssure)); //活动购机担保信息
Cs.Ajax.register("intfElms_deviceArea", lightDevice.draw.bind(lightDevice)); //终端场景
Cs.Ajax.register("intfElms_bossArea", lightPtype.draw.bind(lightPtype));//总部预付费 套包终端场景
Cs.Ajax.register("intfElms_provArea", lightPtype.draw.bind(lightPtype));//省份预付费 根据产品配置是否终端场景
Cs.Ajax.register("intfElms_netCardPtypeArea", lightNetCardPtype.draw.bind(lightNetCardPtype)); 
 
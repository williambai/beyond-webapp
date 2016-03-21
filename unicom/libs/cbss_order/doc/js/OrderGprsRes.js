
Event.observe(window, "load", init);

/** init */
function init() {
    tableedit1 = new TableEdit("resInfosTable");
	tableedit1.myEncodeTable =function(headstr){
		var str = "";
		var rowcount = 0;

		var rows = tableedit1.table.rows;
		var hcells = tableedit1.header.cells;
		var encodehead = headstr.split(",");

		for (var i=1; i<rows.length; i++) {
			var row = rows[i];
			for (var j=0; j<encodehead.length; j++) {
				var cell = tableedit1.getCell(row, encodehead[j]);
				if (cell == null) alert("column " + encodehead[j] + " not found！");

				str += getStrByPadLength(cell.innerText);
			}

			rowcount ++;
		}

		return getStrByPadPrefix(encodehead.length) + getStrByPadPrefix(rowcount) + str;
	}
}


function changeResource(){ 
		tableedit = new TableEdit("QryOrderGprsResTable");
		var rows = tableedit.table.rows;
   		var boxList = getElements("sches"); 
		for(var i = 0;i < boxList.length;i++){
			var dealTag = tableedit.getCell(rows[i+1], "DEAL_TAG").innerText.strip();
			if(dealTag == "0"){
				alert("用户有正在处理中的资源包订单，不能再次订购！");
				return false;
			}			
		}
		var restag = $("data_RESOURCE_TAG").value;	 
		if($('data_RESOURCE_TAG').value.trim() == "") {
			alert("请选择需要办理的资源包！");
			return false;
		}
		var param = "&RESOURCE_TAG="+restag;

		getElement("X_CODING_STR").value = tableedit1.myEncodeTable("X_TAG,RESOURCE_TAG,PACKAGE_CODE,RESOURCE_CODE,RESOURCE_COUNT,MONEY,UNIT,VALID_TIME,VALID_TIME_UNIT,DEPOSIT_RATE,RESOURCE_NAME");
		
		ajaxSubmit(this, 'getResZKList', param, 'refeshZK');
	
		//ajaxSubmit(this, 'getOrderResInfos', param, 'refeshMoney');
	}
function changeMoney(){ 
	var restag = $("data_RESOURCE_TAG").value;
	var resZK = $("data_RESOURCE_ZK").value;	 
	if($('data_RESOURCE_TAG').value.trim() == "") {
		alert("请选择需要办理的资源包！");
		return false;
	}
	if($('data_RESOURCE_ZK').value.trim() == "") {
		alert("请选择需要办理的资源包折扣率！");
		return false;
	}
	var param = "&RESOURCE_TAG="+restag + "&ZK_CODE=" + resZK;	
	getElement("X_CODING_STR").value = tableedit1.myEncodeTable("X_TAG,RESOURCE_TAG,PACKAGE_CODE,RESOURCE_CODE,RESOURCE_COUNT,MONEY,UNIT,VALID_TIME,VALID_TIME_UNIT,DEPOSIT_RATE,RESOURCE_NAME");
	ajaxSubmit(this, 'getOrderResInfos', param, 'refeshMoney');
}
function changeZJ(){ 
	var ZJCODE = getElement("data_DL_ZJ").value; 
	var param = "&ZJCODE="+ZJCODE;	
	ajaxSubmit(this, 'changeZJ', param, 'refeshZJ');
}
function submitGenerals(obj){

	
      var acct_id=getElement("userinfoback_ACCT_ID").value;
      var pre_paytag=getElement("userinfoback_PREPAY_TAG").value;
 
      var resmoney = parseFloat(getElement('data_RES_MONEY').value);
    
		if(''==acct_id)
		{
			alert('请先查询用户信息！谢谢！');
			endPageLoading();
			return false;
		}
	
	if($('data_RESOURCE_TAG').value.trim() == "")
	    {
			alert("请选择需要办理的资源包！");
			endPageLoading();
			return false;
		}
		if($('data_RESOURCE_ZK').value.trim() == "") {
			alert("请选择需要办理的资源包折扣率！");
			return false;
		}
		if (!queryAll(obj)) {
				return false;
			}
	if(pre_paytag == 1 || pre_paytag == 0 || pre_paytag == "")
   {
	   var creditvalue =  parseFloat(getElement("cond_CREDIT_VALUE").value); 
		
		var depositmoney = parseFloat(getElement("cond_DEPOSIT_MONEY").value); 
		
		var	avalbalance = creditvalue+depositmoney;
		
		if(resmoney > avalbalance)
		 {
		    alert("用户可用额度小于" + resmoney + "元,不能订购该资源包~！");
		    endPageLoading();
	        return false;
   		 }
	}
	/**
	else{
		var totalfee =  parseFloat(getElement("cond_TOTAL_FEE").value); 
			if(resmoney > totalfee) 
			  {
			    alert("用户预存款小于" + resmoney + "元,不能订购该流量包~！");
			    endPageLoading();
		        return false;
	          }
    }
    **/
	return true;
         
}
//免填单跳转
function dispatchToMarketPrint()
{
var PRINT_FLAG = $("cond_PRINT_FLAG").value;
var param = "&PRINT_FLAG="+PRINT_FLAG;	
ajaxSubmit(this, 'printMTD',param, 'refeshFlag');
    if($('cond_DL_NAME').value.trim() == ""&&$('cond_DL_SNUMBER').value.trim() == ""&&$('data_DL_ZJ').value.trim() == ""&&$('cond_DL_NUMBER').value.trim() == "") {
			var show=1;
		}else{
		var show=0;
		}
		if($('cond_SHOWLIST').value.trim() == 0) 
		{
			var showlist=1;
		}
		else
		{
		var showlist=0;
		}
   var	ZK_NAME=getElementValue("data_ZK_NAME").trim();
	var	RESOURCE_ZK=getElementValue("data_RESOURCE_ZK").trim();
	var	DL_NAME=getElementValue("cond_DL_NAME").trim();
	var	DL_SNUMBER=getElementValue("cond_DL_SNUMBER").trim();
	var	DL_ZJ_NAME=getElementValue("cond_DL_ZJ_NAME").trim();
	var	DL_NUMBER=getElementValue("cond_DL_NUMBER").trim();
  var acct_id=getElement("userinfoback_ACCT_ID").value;
    if(''==acct_id)
	{
		alert('请先查询用户信息！谢谢！');
		endPageLoading();
		return false;
	}
	var rescode = $("data_RESOURCE_CODE").value;
	var resZK = $("data_RESOURCE_ZK").value;	 
	if($('data_RESOURCE_TAG').value.trim() == "") {
		alert("请选择需要办理的资源包！");
		return false;
	}
	if($('data_RESOURCE_ZK').value.trim() == "") {
		alert("请选择需要办理的资源包折扣率！");
		return false;
	}
    var SERIAL_NUMBER=getElementValue("cond_SERIAL_NUMBER").trim();
    var DATE=getElementValue("cond_DATE").trim();
    var ENDDATE=getElementValue("cond_ENDDATE").trim();
    var DATE1=getElementValue("cond_DATE1").trim();
    var DATE2=getElementValue("cond_DATE2").trim();
    var DATE3=getElementValue("cond_DATE3").trim();
    //var ORDER_ID=getElementValue("cond_CHARGE_ID").trim();
    var NET_TYPE_CODE=getElementValue("cond_NET_TYPE_CODE1").trim();
    var CUST_NAME=getElementValue("cond_CUST_NAME").trim();
    var PSPT_TYPE_CODE=getElementValue("cond_PSPT_TYPE_CODE").trim();
    var PSPT_ID=getElementValue("cond_PSPT_ID").trim();
    var PSPT_ADDR=getElementValue("cond_PSPT_ADDR").trim();
    var POST_ADDRESS=getElementValue("cond_POST_ADDRESS").trim();
    var CONTACT=getElementValue("cond_CONTACT").trim();
    var CONTACT_PHONE=getElementValue("cond_CONTACT_PHONE").trim();
    var EMAIL=getElementValue("cond_EMAIL").trim();
    var PSPT_END_DATE=getElementValue("cond_PSPT_END_DATE").trim();
    var RESOURCE_CODE=getElementValue("data_RESOURCE_NAME").trim();
    var LONG=getElementValue("data_LONG").trim();
    var STAFF_ID1=getElementValue("cond_STAFF_ID1").trim();
    var STAFF_NAME1=getElementValue("cond_STAFF_NAME1").trim();
    var DEPART_NAME1=getElementValue("cond_DEPART_NAME1").trim();
    
    popupDialog('amcharge.ordergprsresource.OrderGprsResPrint', 'dispatchToMarketPrint',
    '&CUST_NAME=' + CUST_NAME + '&NET_TYPE_CODE=' + NET_TYPE_CODE + '&PSPT_TYPE_CODE=' + PSPT_TYPE_CODE +'&showlist=' + showlist
    +'&ZK_NAME=' + ZK_NAME + '&ENDDATE=' + ENDDATE
    + '&DATE1=' + DATE1 + '&DATE2=' + DATE2 + '&DATE3=' + DATE3 +'&show=' + show + '&RESOURCE_ZK=' + RESOURCE_ZK
    +'&DL_NAME=' + DL_NAME +'&DL_SNUMBER=' + DL_SNUMBER +'&DL_ZJ_NAME=' + DL_ZJ_NAME +'&DL_NUMBER=' + DL_NUMBER 
    +'&STAFF_ID1=' + STAFF_ID1 + '&STAFF_NAME1=' + STAFF_NAME1 + '&DEPART_NAME1=' + DEPART_NAME1
    + '&PSPT_ID=' + PSPT_ID + '&PSPT_ADDR=' + PSPT_ADDR + '&POST_ADDRESS=' + POST_ADDRESS + '&CONTACT=' + CONTACT+ '&CONTACT_PHONE=' + CONTACT_PHONE 
    + '&EMAIL=' + EMAIL + '&LONG=' + LONG + '&PSPT_END_DATE=' + PSPT_END_DATE + '&SERIAL_NUMBER=' + SERIAL_NUMBER + '&DATE=' + DATE + '&RESOURCE_CODE=' + RESOURCE_CODE,
    '打印受理单', '820px', '600px');
}
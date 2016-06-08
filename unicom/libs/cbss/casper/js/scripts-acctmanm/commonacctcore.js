/**
 * 重写了wade框架的beginPageLoading方法，主要是在封页面后，把按钮的焦点移开，以免营业员多次敲击键盘回车键，引起多次提交（例如多次交费的情况）。
 */
function beginPageLoading() {
	var loading = getElement("loading");
	var overlay = getElement("overlay");
	if (loading == null) {
		loading = document.createElement("div");
		loading.className = "c_loading";
		loading.id = "loading";
		var loadimg = document.createElement("img");
		loadimg.src = "component/images/loading-2.gif";
		loadimg.alt = "正在载入";
		loadimg.className = "imgtop_3";
		loading.appendChild(loadimg);
		document.body.appendChild(loading);
		loading.style.display = "block";
		loading.focus();
	} else  loading.style.display = "";//chenjuewei 2010-06-16 add before dismiss
	if (overlay == null) {
		overlay = document.createElement("div");
		overlay.className = "c_overlay";
		overlay.id = "overlay";
		overlay.innerHTML = "<iframe class=\"c_overfrm\" style=\"height:" + getPageHeight() + "px;\" frameborder=no></iframe>";
		document.body.appendChild(overlay);
	} else overlay.style.display = "";////chenjuewei 2010-06-16 add before dismiss
}

Object.extend(HtmlPrint.prototype, {
	printGD: function(objname) {
		this.printframe.document.body.innerHTML = document.getElementById(objname).outerHTML;
		this.printframe.focus();
		this.printframe.print();
	}
});

function printGD(objname) {
	new HtmlPrint().printGD(objname);
}

/**
 * 
 */
function show_hideBtn(/*需要隐藏或者显示的id*/tabId) {
	var obj = getElement(tabId);
	if (obj.style.display=='none') {
		obj.style.display='';
	} else {
		obj.style.display='none';
	}
}

/**
 * @author chenjw
 */
Object.extend(Array.prototype , {    
    remove: function(value){
        var i = this.indexOf(value);
        if (i == -1) {
        	throw new Error("数组中没有该值："+value);
        } else {
        	this.splice(i, 1);
        }
    }
}) 

/**
 * 用于ajax处理后，弹出提示框，目前只是用alert()
 * @author chenjuewei 2008-11-22
 */
function acctAjaxAfteraction() {
	var win = new TradeWin(200,120,400,250);
	var temp = $('_errorInfoAcct');
	if (temp != null) {
		win.error(temp.innerText);
		return;
	} 
	temp = $('_alertInfoAcct');
	if (temp != null) {
		win.alert(temp.innerText);
		return;
	}
	temp = $('_succInfoAcct');
	if (temp != null) {
		win.alert(temp.innerText, null, true);
	}
}

/**
 * 在手机号码输入后，将网别置为---请选择---
 */
function changeNetCodeAfterSerialNumber(obj) {
	if (obj.id.indexOf('cond_') != -1) {
		if (getElement('cond_NET_TYPE_CODE')) {
			getElement('cond_NET_TYPE_CODE').value="";
		}
	} else if (obj.id.indexOf('cond2_') != -1) {
		if (getElement('cond2_NET_TYPE_CODE')) {
			getElement('cond2_NET_TYPE_CODE').value="";
		}
	}
}

/**
 * 校验这个控件所在表格的所有控件
 */
function queryParentTable(obj) {
	var parentTable = getElementByTag(obj, 'table');
	return queryOneTable(parentTable);
}

/**
 * 校验一个table，同validate.js里面的queryAll等
 * 如果知道这个table的id，则可以直接用queryAll(id)
 */
function queryOneTable(/*table的名字，也可以是table这个对象*/obj, info) {
	if (typeof(obj) != "object") {
		obj = getElement(obj);
	}
	
	var rscoll = getVerifyElementsForOneTab(obj);
	
	if (!rscoll["result"]) return false;
	
	var elements = rscoll["elements"];
	setDisabledElements(elements, false);
	
	if (!initialAll(obj)) return false;
	submitLoading();
	
	return true;
}

function getVerifyElementsForOneTab(object, isopen) {
	var elements = new Array;
	var discount = 0;
	var childs = null;
	var areaobj = object;
	childs = getChildsByRecursion(areaobj, "desc");
	if (childs == null) {
		alert(object + " define error!");
		return false;
	}
	
	for (var i=0; i<childs.length; i++) {
		var element = childs[i];
		if (element.disabled) {
			elements[discount] = element;
			discount++;
			continue;
		}
		if (isopen == null || isopen == false) {
			if (element.getAttribute("desc") == null) continue;
			if (!verifyField(element)) return { "result" : false };
		}
	}
	
	return { "result" : true, "elements" : elements };
}
/**
 * 显示多用户界面
 */
function showAllUserForAcct() {
  var count = getElementValue("cond_X_USER_COUNT");
 	if (count > 1) {
		$('cond_X_USER_COUNT').value="";
		var obj = popupDialog("amcommon.CustInfos", "queryInfo", null, "多用户选择", "800", "300");
		if (!obj) {
			alert("没有选择用户！");
			return false;
		}
		var removeTag = "0";
		for (var i = 0; i < obj.paramNames.length; i++) {
			var name = obj.paramNames[i];
			if (name=="cond_REMOVE_TAG") {
				removeTag = obj.paramValues[i];
				break;
			}
		}
		if(removeTag == "0") {
			for (var i = 0; i < obj.paramNames.length; i++) {
				var name = obj.paramNames[i];
				if (name=="cond_NET_TYPE_CODE") {
					if (!getElement(name)) {
						continue;
					} else {
						getElement(name).value = obj.paramValues[i];
					}
				}
			}
		} else {
			for (var i = 0; i < obj.paramNames.length; i++) {
				var name = obj.paramNames[i];
				if (name=="cond_SERIAL_NUMBER" || name == "cond_ID_TYPE" || name=="cond_NET_TYPE_CODE") {
					if (!getElement(name)) {
						continue;
					} else {
						getElement(name).value = obj.paramValues[i];
					}
				}
			}
		}
		
		if ($("bquerytop") != null && $("bquerytop").tagName == "INPUT") {
			$("bquerytop").click();
		} else if ($("bquerytopwithfee") != null && $("bquerytopwithfee").tagName == "INPUT") {
			$("bquerytopwithfee").click();
		}
	}
}

//根据前缀取多个对象
			function getByPre(eTagName,lateName) {
				var a = document.getElementsByTagName(eTagName);
				var b = new Array();
				for (var i=0;i<a.length;i++) {
					if (a[i].id.length<=lateName.length) {
						continue;
					} else if (a[i].id.substring(a[i].id.length-lateName.length, a[i].id.length) == lateName) {
						b.push(a[i]);
					}
				}
				return b;
		}
	
/**
 * 1、按照 手机号码，用户标识 这个下拉框变化之后，那么书机号码输入框的desc就要变化；
 * 2、同时，自动匹配网别的图标，要隐藏。
 * 这个函数就是这个用途，
 * @author chenjuewei
 */
function changeDesc(obj) {
				var sObject = obj.options[obj.selectedIndex];
				var sn = document.getElementById(obj.id.substring(0, obj.id.length-8)+'_SERIAL_NUMBER');
				if (sn){
					sn.desc = sObject.text;
				}
				var idType = obj.id.substring(0, obj.id.length-8)+"_ID_TYPE";
				var imgName = obj.id.substring(0, obj.id.length-8)+"_netType$img";
				if ($(imgName)) {
					$(imgName).style.display="none";
				}
			}
/**
 * 判断这个表格中的所有checkBox是否有选中，有选中的，就返回true。
 * @author chenjw
 */			
function hasOneChecked(tableName) {
	var hasOne = false;
	var checkboxArr = $(tableName).getElementsBySelector('[type="checkbox"]');
	for(var i=0;i<checkboxArr.length;i++) {
		if(checkboxArr[i].checked) {
			hasOne = true;
			break;
		}
	}
	return hasOne;
}
/**将一个表中的几列数据，copy到另一个表中，oTabId可以指定哪几列，但iTabId不能指定，是按照顺序来的
 * @author chenjw
 * @param oTabId提供数据的表格
 * @param iTabId准备接收数据的表格
 * @param oArgs 是个数组，表示oTabId中的哪几列copy到iTabId表中
 */
function copyTableData(oTabId, iTabId, oArgs) {
	
	var oCell,iCell;
	var hcells = iTabId.header.cells;
	for (var i=1; i<oTabId.table.rows.length; i++) {
		var oRow = oTabId.table.rows[i];
		
		var iRow = iTabId.table.insertRow(iTabId.table.rows.length);
		
		for (var j=0;j<oArgs.length;j++) {
			
			oCell = oTabId.getCell(oRow, oArgs[j]);
			
			iCell = iRow.insertCell(j);
			iTabId.setCellValue(hcells[j], iCell, oCell.innerHTML);			
		}
	}
	iTabId.rowIndex = 0;
}

/**
*  从页面表对象中导出文件
*  @obj 表对象（ID）
*/
function localExportFile(tableobj){ 
	try{
		showWaitInfo("正在处理，请稍候...");
		if(tableobj == null){ alert("要导出的数据对象不存在！"); hideWaitInfo(); return false;}
		if(tableobj.rows.length < 2){ alert("没有数据可导出！"); hideWaitInfo(); return false;}
		try{
			var fd = new ActiveXObject("MSComDlg.CommonDialog"); 
		}
		catch(e){
			throw new Error("创建MSComDlg.CommonDialog对象失败!");
		}
		fd.Filter = "文本文件(*.txt)|*.txt|Excel文件(*.xls)|*.xls";
		fd.FilterIndex = 1; 
		fd.MaxFileSize = 128; 
		fd.ShowSave();     
		if(fd.filename == null || fd.filename == "") {hideWaitInfo(); return false;}
    		
 		var iLine = tableobj.rows.length;
 		var iCol  = tableobj.rows[0].cells.length;
		var i = 0;
 		switch(fd.FilterIndex){
 			case 1:
 				try{
 					var oTxt = new ActiveXObject("Scripting.FileSystemObject");
 				}
 				catch(e){
 					//regsvr32 scrrun.dll 注册
 					try{
 						var oWsh = new ActiveXObject("WScript.Shell");
 					}
 					catch(e){
 						throw new Error("创建Script.Shell对象失败!");
 					}
 					oWsh.run("regsvr32 scrrun.dll");
 					
 					try{
 						var oTxt = new ActiveXObject("Scripting.FileSystemObject");
 					}
 					catch(e){
 						throw new Error("创建Scripting.FileSystemObject对象失败!");
 					}
 				}
 				var ForReading = 1, ForWriting = 2;
 				var f = oTxt.OpenTextFile(fd.filename, ForWriting, true);
				for(i=0;i<iLine;i++){
				var strLine="";
				for(j=0;j<iCol;j++){
					strLine += tableobj.rows[i].cells[j].innerText + "\t";
				}
				f.WriteLine(strLine);
 			}
 			f.Close();
 			break;
 			case 2:
 				try{
			 		 	var oXls = new ActiveXObject("Excel.Application");
				}
				catch(e){
			 			throw new Error("创建Excel.Application对象失败!");
				} 
				var oWorkbook = oXls.Workbooks.Add();
				var oSheet = oWorkbook.ActiveSheet;
				for(i=0;i<iLine;i++){
					for(j=0;j<iCol;j++){
						oSheet.Cells(i+1,j+1).value = tableobj.rows[i].cells[j].innerText;
					}
 				}
				oSheet.Name=tableobj.name;
 				oWorkbook.SaveAs(fd.filename);
 				oWorkbook.Close();
 				break;
 			}
			alert("导出[" + tableobj.name + "]文件成功!");
			hideWaitInfo();
			return true;
		}
		catch(e){
			alert(e.description);
			hideWaitInfo();
			return false;
		}
} 

/**
* 校验type="file" 控件选择的文件类型  onchange="fileTypeCheck(this,"txt");"
* @fileObj  file对象
* @filetypes  类型类型"txt,xls"
*/
function fileTypeCheck(fileObj,filetypes){
	if(fileObj.value.length>0){
		if(eval("with(fileObj.value) if(!/" + filetypes.split(",").join("|")+"/ig.test(substring(lastIndexOf('.')+1,length)))1;")){
			alert("Only Allowed file types: " + filetypes);
			fileObj.form.reset();
		}
	}
}

/**
 * 将树的节点值，节选出code和name
 * 例如：其他费(-1)，那么截出: 其他费  and  -1
 * @return 一维数组，只有两列，arr[0]是code,arr[1]是name
 * @author chenjw
 */
function splitTreeNodeValue(cn) {
	var arr = new Array();
	bk = cn.lastIndexOf('(');
	ak = cn.lastIndexOf(')');
	arr.push(cn.substring(bk+1,ak));
	arr.push(cn.substring(0,bk));
	return arr;
}
	
function toChineseMoney(/*数字货币值*/currencyDigits) {
	// Constants:
	var MAXIMUM_NUMBER = 99999999999.99;
	// Predefine the radix characters and currency symbols for output:
	var CN_ZERO = "零";
	var CN_ONE = "壹";
	var CN_TWO = "贰";
	var CN_THREE = "叁";
	var CN_FOUR = "肆";
	var CN_FIVE = "伍";
	var CN_SIX = "陆";
	var CN_SEVEN = "柒";
	var CN_EIGHT = "捌";
	var CN_NINE = "玖";
	var CN_TEN = "拾";
	var CN_HUNDRED = "佰";
	var CN_THOUSAND = "仟";
	var CN_TEN_THOUSAND = "万";
	var CN_HUNDRED_MILLION = "亿";
	var CN_SYMBOL = "";
	var CN_DOLLAR = "元";
	var CN_TEN_CENT = "角";
	var CN_CENT = "分";
	var CN_INTEGER = "整";

// Variables:
	var integral; // Represent integral part of digit number.
	var decimal; // Represent decimal part of digit number.
	var outputCharacters; // The output result.
	var parts;
	var digits, radices, bigRadices, decimals;
	var zeroCount;
	var i, p, d;
	var quotient, modulus;

// Validate input string:
	currencyDigits = currencyDigits.toString();
	if (currencyDigits == "") {
		//如果是空，无需提示，只要返回空字符串即可
		//alert("Empty input!");
		return "";
	}
	if (currencyDigits.match(/[^,.\d]/) != null) {
		alert("Invalid characters in the input string!");
		return "";
	}
	if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
		alert("Illegal format of digit number!");
		return "";
	}

	// Normalize the format of input digits:
	currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
	currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
	// Assert the number is not greater than the maximum number.
	if (Number(currencyDigits) > MAXIMUM_NUMBER) {
		alert("Too large a number to convert!");
		return "";
	}

	// Process the coversion from currency digits to characters:
	// Separate integral and decimal parts before processing coversion:
	parts = currencyDigits.split(".");
	if (parts.length > 1) {
		integral = parts[0];
		decimal = parts[1];
		// Cut down redundant decimal digits that are after the second.
		decimal = decimal.substr(0, 2);
	} else {
		integral = parts[0];
		decimal = "";
	}
	// Prepare the characters corresponding to the digits:
	digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
	radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
	bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
	decimals = new Array(CN_TEN_CENT, CN_CENT);
	// Start processing:
	outputCharacters = "";
	// Process integral part if it is larger than 0:
	if (Number(integral) > 0) {
		zeroCount = 0;
		for (i = 0; i < integral.length; i++) {
			p = integral.length - i - 1;
			d = integral.substr(i, 1);
			quotient = p / 4;
			modulus = p % 4;
			if (d == "0") {
				zeroCount++;
			} else {
				if (zeroCount > 0) {
					outputCharacters += digits[0];
				}
				zeroCount = 0;
				outputCharacters += digits[Number(d)] + radices[modulus];
			}
			if (modulus == 0 && zeroCount < 4) {
				outputCharacters += bigRadices[quotient];
			}
		}
		outputCharacters += CN_DOLLAR;
	}
	// Process decimal part if there is:
	if (decimal != "") {
		for (i = 0; i < decimal.length; i++) {
			d = decimal.substr(i, 1);
			if (d != "0") {
				outputCharacters += digits[Number(d)] + decimals[i];
			}
		}
	}
	// Confirm and return the final output string:
	if (outputCharacters == "") {
		outputCharacters = CN_ZERO + CN_DOLLAR;
	}
	if (decimal == "") {
		outputCharacters += CN_INTEGER;
	}
	outputCharacters = CN_SYMBOL + outputCharacters;
	return outputCharacters;
}

//formart: 'date'/'datetime'
function getdatetime(formart){

	var d = new Date();
	var vYear = d.getFullYear();
	var vMon = d.getMonth() + 1;
	var vDay = d.getDate();
	var vHour = d.getHours();
	var vMinutes = d.getMinutes();
	var vSeconds = d.getSeconds();  
   
   if(formart=="date")                           
  {
	var s =  vYear + "-" + ((vMon<10) ? "0" + vMon : vMon) + "-" 
			+ ((vDay<10) ? "0" + vDay : vDay);         
  }
  else if(formart=="datetime")  
  {  
	var s = vYear + "-" + ((vMon<10) ? "0" + vMon : vMon) + "-" 
			+ ((vDay<10) ? "0" + vDay : vDay) + " " 
			+ ((vHour<10) ? "0" + vHour : vHour)+ ":"
	 		+ ((vMinutes<10) ? "0" + vMinutes : vMinutes) + ":" 
	 		+ ((vSeconds<10) ? "0" + vSeconds : vSeconds) ; 
  }                       
   return(s);                               
}

/** return formatted current date,year:yyyy month:mm day:dd hour:hh minite:nn second:ss */
function getCurTime(formatter) {
    if(formatter == null || formatter == "")
    {
        formatter = "YYYY-MM-DD HH:NN:SS";
    }
    
    var curDate = new Date();
    var year = curDate.getYear().toString();
    var month = (curDate.getMonth() + 1).toString();
    var day = curDate.getDate().toString();
    var hour = curDate.getHours().toString();
    var minite = curDate.getMinutes().toString();
    var second = curDate.getSeconds().toString();
        
    var yearMarker = formatter.replace(/[^y|Y]/g,'');
    if(yearMarker.length > 1) {        
        if(yearMarker.length == 2) {
            year = year.substring(2,4);
        }    
        formatter = formatter.replace(yearMarker,year);
    }
    
    var monthMarker = formatter.replace(/[^m|M]/g,'');
    if(monthMarker.length > 1) {
        if(month.length == 1) {
            month = "0" + month;
        }
        formatter = formatter.replace(monthMarker,month);
    }    
    
    var dayMarker = formatter.replace(/[^d|D]/g,'');
    if(dayMarker.length > 1) {
        if(day.length == 1) {
            day = "0" + day;
        }
        formatter = formatter.replace(dayMarker,day);
    }    
    
    var hourMaker = formatter.replace(/[^h|H]/g,'');
    if(hourMaker.length > 1) {
        if(hour.length == 1) {
            hour = "0" + hour;
        }
        formatter = formatter.replace(hourMaker,hour);
    } 
    
    var miniteMaker = formatter.replace(/[^n|N]/g,'');
    if(miniteMaker.length > 1) {
        if(minite.length == 1) {
            minite = "0" + minite;
        }
        formatter = formatter.replace(miniteMaker,minite);
    } 
    
    var secondMaker = formatter.replace(/[^s|S]/g,'');
    if(secondMaker.length > 1) {
        if(second.length == 1) {
            second = "0" + second;
        }
        formatter = formatter.replace(secondMaker,second);
    } 
    
    return formatter;
}

/**a pair of controls,ie..start_serial_number & end_serial_number, */
/**when the start control changed,the end control's value also change */
/* *eCtrlId:  end control's name
   *sValue:     start control's value
   *sCtrlId:  (not required) start control's name
**/
function startChangeEnd(eCtrlId,sValue,sCtrlId) {
        if(getElement(eCtrlId) && 
           getElement(eCtrlId+'$dspl') &&
           getElement(eCtrlId+'$lst') &&
           sCtrlId &&
           getElement(sCtrlId))//THis's tangzhi's lookupcombo! 
        {
            if(sCtrlId.indexOf('$dspl') > 0) sCtrlId = sCtrlId.substr(0,sCtrlId.length-5);
            getElement(eCtrlId).value = sValue;
            getElement(eCtrlId+'$dspl').value = getElement(sCtrlId+'$dspl').value;
        } else {
            getElement(eCtrlId).value = sValue;
        }		
	}
	
/**
lookupcomb ajax after
* 要刷新几个LookUpCombo，就写几个，用","隔开
**/	

function freshLookupComb()
{
	 for(var i =0;i<arguments.length;i++)
	{
	  	var id = arguments[i];
	
	  	var id_frame = id + '$box$p';
	  	
	  	var id_table = id + '$box$sha';
	  	
	  	var id_event = id + '$dspl';
	  	if ($(id_frame)) {
		  	document.body.removeChild($(id_frame));
		  	document.body.removeChild($(id_table));
	  	}
	  	addLookupComboListener($(id_event));
	 }

}

//checkbox 和radio对时间的控制
function CheckDefinedDate(){
	if (arguments.length == 0)
		return;
		
	var defineddate;
	var beginIndex = 0;
	var byCheck = typeof arguments[0] == 'object' && arguments[0].getAttribute("checked") != null;
	if (byCheck) {
		defineddate = new Array(1);
		defineddate[0] = arguments[0];
		beginIndex = 1;
	} else {
		defineddate = document.getElementsByName("DEFINED");
	}

	for(var j=0;j<defineddate.length;j++)
	{

	if (defineddate[j].checked) {	
		for(var i =beginIndex;i<arguments.length;i++)
	 {
	 	var id = arguments[i];
	 
	 	if(byCheck || getElement(id).DEFINED==j)
		{
		$('IMG_CAL_'+ id).show();
		getElement(id).disabled = false;
		$(id).value="";//getdatetime("date");
		}
	 }
	} 
	else {
		for(var i =beginIndex;i<arguments.length;i++)
	 {
	 	var id = arguments[i];
	 	if(byCheck || getElement(id).DEFINED==j)
		{
		$('IMG_CAL_' + id).hide();
		getElement(id).disabled = true;
		$(id).value="";//getdatetime("date");
		}
	 }
	}
}	
}

//checkbox 和radio对文本的控制
function CheckDefinedText(){
	if (arguments.length == 0)
		return;
		
	var definedtext;
	var beginIndex = 0;
	var byCheck = typeof arguments[0] == 'object' && arguments[0].getAttribute("checked") != null;
	if (byCheck) {
		definedtext = new Array(1);
		definedtext[0] = arguments[0];
		beginIndex = 1;
	} else {
		definedtext = document.getElementsByName("DEFINED");
	}

	for(var j=0;j<definedtext.length;j++)
	{
	if (definedtext[j].checked) {
		for(var i =beginIndex;i<arguments.length;i++)
	 {
	 	var id = arguments[i]; 	
		if(byCheck || getElement(id).DEFINED==j)
			getElement(id).disabled = false;
	 }
	} 
	else {
		for(var i =beginIndex;i<arguments.length;i++)
	 {
	 	var id = arguments[i];
		if(byCheck || getElement(id).DEFINED==j) {
			getElement(id).disabled = true;
			getElement(id).value = '';			
		}
	 }
	}
}	
}

//checkbox 和radio对lookcomb的控制
function CheckDefinedLookComb(){
	if (arguments.length == 0)
		return;
		
	var definedlookcomb;
	var beginIndex = 0;
	var byCheck = typeof arguments[0] == 'object' && arguments[0].getAttribute("checked") != null;
	if (byCheck) {
		definedlookcomb = new Array(1);
		definedlookcomb[0] = arguments[0];
		beginIndex = 1;
	} else {
		definedlookcomb = document.getElementsByName("DEFINED");
	}
		
	for(var j=0;j<definedlookcomb.length;j++)
	{
		if (definedlookcomb[j].checked) {
			for(var i =beginIndex;i<arguments.length;i++)
	 		{
	 			var id = arguments[i]; 	
	 	
				if(byCheck || getElement(id+'$dspl').DEFINED==j)
				{
					getElement(id+'$dspl').disabled = false;
					getElement(id+'$img').disabled = false;
					freshLookupComb(id);
				}
	 		}
		} 
		else {
			for(var i =beginIndex;i<arguments.length;i++)
	 		{
			 	var id = arguments[i];
				if(byCheck || getElement(id+'$dspl').DEFINED==j)
				{
					LookupCombo.setValue($(id), '');
					getElement(id+'$dspl').disabled = true;
					getElement(id+'$img').disabled = true;
				}
			 }
		}
	}	
}

/**
 * js写的解串函数，同java端的一样
 */
function getArrayByCodingStr(/*拼串的列名*/namestr, /*拼成的串*/encodestr) {
	var encodename = namestr.split(",");
	var rows = parseInt(encodestr.substring(4, 8), 10);
	var content = encodestr.substr(11);

	var dataset = new Array(rows);
	for (var i = 0; i < rows; i++) {
		var data = new Object();
		for (var j = 0; j < encodename.length; j++) {
			var namelen = parseInt(content.substring(0, 4), 10);
			content = content.substr(4);
			var value = content.substring(0, namelen);
			content = content.substr(namelen);
			data[encodename[j]] = value;
			}
			dataset[i] = data;
		}

		return dataset;
}

var UserInfoFeeHandler = new Object();
UserInfoFeeHandler.titleTab = null;
/**
 * 用户信息点击显示或隐藏的函数
 */
UserInfoFeeHandler.ifShowUserInfoTab = function(titleObj) {
	if (UserInfoFeeHandler.titleTab != null) {
		UserInfoFeeHandler.hideShowUserInfoTab();
	}
	if (!titleObj || !titleObj.nextSibling || titleObj.nextSibling.tagName.toUpperCase() != "TABLE") {
		throw new Error("用户信息标签下，应该是用户信息的table");
	}
	var userInfoTab = titleObj.nextSibling;
	UserInfoFeeHandler.titleTab = titleObj;
	if (userInfoTab.style.display == "none") {
//		Event.observe(document.body, 'click', UserInfoFeeHandler.hideShowUserInfoTab);
		userInfoTab.style.zIndex='2';
		userInfoTab.style.position='absolute';
		userInfoTab.style.display='block';
		userInfoTab.style.background = '#FFEDDF';
	} else {
		userInfoTab.style.display='none';
		UserInfoFeeHandler.titleTab = null;
//		Event.stopObserving(document.body, 'click', UserInfoFeeHandler.hideShowUserInfoTab);
	}
}

/**
 * 给document.body调用隐藏用户信息的
 */
UserInfoFeeHandler.hideShowUserInfoTab = function() {
	if (getElementBySrc() == UserInfoFeeHandler.titleTab) {
		return;
	}
	var titleObj = UserInfoFeeHandler.titleTab;
	if (!titleObj || !titleObj.nextSibling || titleObj.nextSibling.tagName.toUpperCase() != "TABLE") {
		throw new Error("用户信息标签下，应该是用户信息的table。...");
	}
	var userInfoTab = titleObj.nextSibling;
	if (userInfoTab.style.display != "none") {
		userInfoTab.style.display='none';
	}
	UserInfoFeeHandler.titleTab = null;
	Event.stopObserving(document.body, 'click', UserInfoFeeHandler.hideShowUserInfoTab);
}

//找零界面控制js
var dibsWindowHandler = new Object();
/**
 * 显示找零界面
 * 主要操作包括如下：
 * 1、将焦点放在“实缴”输入框内
 * 2、如果将来对于“实缴”和“实收”输入框的初始值有什么要求的话，也好处理
 */
dibsWindowHandler.showWindow = function(/*组件名称*/dibsName) {
	getElement(dibsName).style.display = '';
	var dialog = getElement(dibsName);
	dialog.style.left = (parseInt(document.body.offsetWidth)) / 2 + 'px';
	dialog.style.top = (parseInt(document.body.offsetHeight)) / 2 + 'px';
	getElement(dibsName+'_pay').focus();
	getElement(dibsName+'_pay').select();
	dibsWindowHandler.calculateDibs(dibsName);
}

/**
 * 计算找零
 */
dibsWindowHandler.calculateDibs = function(/*组件名称*/dibsName) {
	
	var m = getElementValue(dibsName+'_receive');
	var n = getElementValue(dibsName+'_pay');
	var btn = getElement(dibsName+'_okBtn');
	if (!checkTradeFee(getElement(dibsName+'_receive')) || !checkTradeFee(getElement(dibsName+'_pay'))) {
		btn.disabled = true;
		getElement(dibsName+'_dibs').innerHTML = '';
		return false;
	}
		
	if (m == null || m.blank() || n == null || n.blank()) {
		getElement(dibsName+'_dibs').innerHTML = '';
		return;
	}
	var r = 0;
	try {
		var r = parseFloat(m)-parseFloat(n);
		r  = parseFloat(r).toFixed(2);
		if (parseFloat(r)<0) {
			r = r + " (钱少了)";
			btn.disabled = true;
		} else {
			btn.disabled = false;
		}
	} catch(ex) {
		getElement(dibsName+'_dibs').innerHTML = '';
		return;
	}
	
	getElement(dibsName+'_dibs').innerHTML = r;
}

/**
 * 输入金额后，点确定按钮
 */
dibsWindowHandler.okBtnClick = function(obj) {
	try {
		
		var t = obj.getAttribute('fieldName');
		if (!verifyField($(t+'_pay')) || !verifyField($(t+'_receive')))
			return false;
		getElement(t).style.display = 'none';
		getElement(obj.getAttribute('idForReturnValue')).value = getElement(t+'_pay').value;
		if (obj.getAttribute('okBtnEvent') != '') {
			eval(obj.getAttribute('okBtnEvent'));
		}
	} catch (ex) {
		alert(ex.message);
	}
}

/*
*回车控制焦点,内部动态加载的方法
*/
var move_focus = function(o){
//alert(o);
	return function(){
	if(event.keyCode=="13"){
		var tar = document.getElementById(o);
		
		   tar.focus();
		
		}
	}
}
/*
*回车控制焦点，公用方法
*/
function add_keyFunction(id_str,elem_str){

  var id_arr=id_str.split(',');

  for(var i=0;i<id_arr.length;i++){

    var elem=document.getElementById(id_arr[i]);

    if(i==id_arr.length-1&&elem){
    	
	  elem.attachEvent("onkeyup",move_focus(id_arr[0])); 
	}
    else if(elem){
    	
	  elem.attachEvent("onkeyup",move_focus(id_arr[i+1])); 

	}
  }
  
  document.getElementById(id_arr[0]).focus();
  
  if(elem_str){
    var elem_arr=elem_str.split(',');
   if(elem_arr.length>1){
    for(var i=0;i<elem_arr.length;i=i+2){
    var judge_elem=document.getElementById(elem_arr[i]);
  	if('text,radio,checkbox,select'.indexOf(judge_elem.type)>-1){
  		if((judge_elem.value!=null&&judge_elem.value!='')||judge_elem.checked==true){
		  document.getElementById(elem_arr[i+1]).focus();
		   }
  	 }
    }
   }
  }
  
  
}

/**
*金额输入格式校验
*added by sqz@20081024
*[0-9]{0,2} 表示小数位数可以为0-2位
*/
function isMoney(money){   
   var regu = "^[0-9]+[\.]{0,1}[0-9]{0,2}$"; 
   var re = new RegExp(regu); 
   if (re.test(money)) { 
   
      return true; 

   }
    
   return false; 
  
}

/**  金额输入校验*/
function checkTradeFee(obj) {
   //输入金额
	var tradeFee = obj.value;
	if (tradeFee == "" || tradeFee == "0.00" || parseFloat(tradeFee) == 0) {
		obj.value = "0.00";
		return false;
	}
	if (!isMoney(tradeFee)) {
		alert("金额输入格式错误或含有非法字符！");
		obj.value = "0.00";
		return false;
	}
	if (Math.abs(parseFloat(tradeFee) * 100) < 1) {
		alert("金额必须大于等于0.01元!");
		obj.value = "0.00";
		return false;
	}
	obj.value = formatRatio(tradeFee, 0);
	if (parseFloat(obj.value) >= 500) {
		obj.style.backgroundColor = 'deepskyblue';
	} else {
		obj.style.backgroundColor = '';
	}
	return true;
}


/*added by sqz@20081024
 *格式化显示金额/比例,结合isMoney函数使用，对金额/比例输入框进行输入字符合法性校验以及对输入的数据进行格式化
 *3->3.00/3.00%
 *3.1->3.10/3.10%
 */
 
 function formatRatio(obj,format)
 {
       obj = obj+"";  //转换成字符
       if(format == 0) {
		   if (obj.length ==0)return "0.00";	   
		   var strArray = obj.split(".");
		   var len = strArray.length;	
		   if (len == 1)
		   {
		      var firstPart = strArray[0];	   
		      return (firstPart +".00")
		   
		   }else if(len == 2)
		   {
		      var firstPart = strArray[0];
		      var secondPart = strArray[1];
		      var secDis;
		      if (secondPart.length == 1)
		      {	      
		           secDis = secondPart + "0";	           
		      }
		      else if (secondPart.length >2) {
		      	secDis = (parseFloat(secondPart)).toFixed(2);
		      } else {
		           secDis = secondPart;
		      } 	      
		      return (firstPart + "." + secDis );	  
		   }	
	   } else if (format == 1) {
	   
	       if (obj.length ==0)return "0.00%";
		   var strArray = obj.split(".");
		   var len = strArray.length;
		   if(len > 2) {
		      alert("比例输入格式错误！");
		      return "0.00%";
		   }
		   if (len == 1)
		   {
		      var firstPart = strArray[0];
		      return (firstPart +".00%")
		   
		   }else if(len == 2)
		   {
		      var firstPart = strArray[0];
		      var secondPart = strArray[1];
		      var secDis;   
		      if (secondPart.length == 1)
		      {
		           secDis = secondPart + "0";          
		      }
		      else if (secondPart.length == 2){
		           secDis = secondPart;     
		      }	      	      
		      return (firstPart + "." + secDis + "%");
		   }  
	   }  
 } 


/*src为需要处理的数据，pos值表示小数点后的位数*/
function formatFloat(src, pos)
{
    return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
}

/*限制金额格式，小数点后位数大于2时报错*/
function formatErr(src)
{
   if(!(/^\d+(\.\d{1,2})?$/.test(src))){
				throw new Error('提示！输入金额格式有误，精确到分!');
		
		}
}

/** 判断结束时间是否大于开始时间,放在结束时间的onchange事件中,若不符合,则将结束时间置为开始时间
 * startId  开始时间ID
 * endId	结束时间ID
 * format	日期格式:'YYYY-MM','YYYYMM','YYYY-MM-DD','YYYY-MM-DD HH:MM:SS', 'YYYYMMDD','YYYYMMDDHHMMSS'
 */
function compDate(startId, endId, format){   
	var startDateStr=$(startId).value;       
	var endDateStr=$(endId).value;
	var startDesc = $(startId).getAttribute("desc");
	var endDesc = $(endId).getAttribute("desc");
	startDesc = startDesc == null || startDesc == 'undefined' ? "开始时间" : startDesc;
	endDesc = endDesc == null || endDesc == 'undefined' ? "结束时间" : endDesc;
	var startDate = null;
	var endDate = null;
	
	if (format == null)
		format = 'YYYY-MM-DD';
	else
		format = format.toUpperCase();
	
	switch (format) {
		case 'YYYY-MM':
			if (startDateStr.length < 7)  {
				alert(startDesc + "格式错误");
				$(startId).focus();
				return false;
			}
			if (endDateStr.length < 7)  {
				alert(endDesc + "格式错误");
				$(endId).focus();
				return false;
			}
			startDateStr = startDateStr.substr(0, 7) + "-01";
			endDateStr = endDateStr.substr(0, 7) + "-01";
		case 'YYYY-MM-DD':
		case 'YYYY-MM-DD HH:MM:SS':
			if (startDateStr.length < 10)  {
				alert(startDesc + "格式错误");
				$(startId).focus();
				return false;
			}
			if (endDateStr.length < 10)  {
				alert(endDesc + "格式错误");
				$(endId).focus();
				return false;
			}
			var startYear = startDateStr.substr(0, 4);
			var startMonth = startDateStr.substr(5, 2);
			var startDay = startDateStr.substr(8, 2);
			startDate = new Date(parseInt(startYear, 10), parseInt(startMonth, 10) - 1, parseInt(startDay, 10));
			
			var endYear = endDateStr.substr(0, 4);
			var endMonth = endDateStr.substr(5, 2);
			var endDay = endDateStr.substr(8, 2);
			endDate = new Date(parseInt(endYear, 10), parseInt(endMonth, 10) - 1, parseInt(endDay, 10));
			break;
		case 'YYYYMM':
			if (startDateStr.length < 6)  {
				alert(startDesc + "格式错误");
				$(startId).focus();
				return false;
			}
			if (endDateStr.length < 6)  {
				alert(endDesc + "格式错误");
				$(endId).focus();
				return false;
			}
			startDateStr = startDateStr.substr(0, 6) + "01";
			endDateStr = endDateStr.substr(0, 6) + "01";
		case 'YYYYMMDD':
		case 'YYYYMMDDHHMMSS':
			if (startDateStr.length < 8)  {
				alert(startDesc + "格式错误");
				$(startId).focus();
				return false;
			}
			if (endDateStr.length < 8)  {
				alert(endDesc + "格式错误");
				$(endId).focus();
				return false;
			}
			var startYear = startDateStr.substr(0, 4);
			var startMonth = startDateStr.substr(4, 2);
			var startDay = startDateStr.substr(6, 2);
			startDate = new Date(parseInt(startYear, 10), parseInt(startMonth, 10) - 1, parseInt(startDay, 10));
			
			var endYear = endDateStr.substr(0, 4);
			var endMonth = endDateStr.substr(4, 2);
			var endDay = endDateStr.substr(6, 2);
			endDate = new Date(parseInt(endYear, 10), parseInt(endMonth, 10) - 1, parseInt(endDay, 10));
			break;
		default:
			alert("日期格式化异常!");
	}
		
	if(startDate.getTime() > endDate.getTime()) {           
		alert("警告：" + endDesc + "小于" + startDesc + "！");
		$(endId).value = $(startId).value;
		return false;   
	}
	return true;
}

/**
 * 设置LookupCombo的disabled属性，可以设置多个LookupCombo以","分隔
 */
function setLookupComboDisabled(lookupcombos, enable) {
	var disable = true;
	if (typeof enable == 'boolean') {
		disable = !enable;
	} else if (typeof enable == 'string') {
		if (enable != null) 
			disable = enable == 'false';
	}
	var lookups = lookupcombos.split(",");
	for (var i = 0; i < lookups.length; i++) {
		var id = lookups[i];
		getElement(id+'$dspl').disabled = disable;
		getElement(id+'$img').disabled = disable;
		if (disable == false ||disable == 'false' )
			freshLookupComb(id);
	}
}
 
 // 设置按钮的是否可用,可设置多个按钮,以逗号分隔
function setButtEnabled(butts, enable) {
	var disable = true;
	if (typeof enable == 'boolean') {
		disable = !enable;
	} else if (typeof enable == 'string') {
		if (enable != null) 
			disable = enable == 'false';
	}
	
	var buttArr = butts.split(",");
	for (var i = 0; i < buttArr.length; i++) {
		var buttId = buttArr[i];
		if ($(buttId)) {
			$(buttId).disabled = disable;
		} else {
			alert("控件【" + buttId + "】不存在，请查看！");
		}
	}
}

// 删除无用的必输的*号
function deleteNodeStar(){
	for(var i =0;i<arguments.length;i++)
	{
		var obj = $(arguments[i]);
	  
		if(obj.getAttribute("required") != "true"||obj.getAttribute("nullable") != "no") {
	  		if (obj.lookupCombo == "true" && obj.nextSibling && obj.nextSibling.tagName.toLowerCase() == "img") {
       			if (obj.nextSibling.nextSibling && obj.nextSibling.nextSibling.innerText == "*")
        			obj.parentNode.removeChild(obj.nextSibling.nextSibling);
     		} else if (obj.nextSibling && obj.nextSibling.innerText == "*") {
        		obj.parentNode.removeChild(obj.nextSibling);
     		}
	  	}
	}
}


/**
 * 弹出大金额校验的密码签权界面
 * @author chenjuewei  2008-11-20
 */
function openDialog_leaderCheck() {
	var obj = popupDialog('amcomponent.LeaderCheck', null, null, '密码签权');
	if (!obj) {
			return false;
		}
	return obj.value;
}


/**
 * popup dialog
 * 由于wade框架中的该方法，对于不同应用之间的跳转，支持的不好，所以我改了下，大家可以比较下它与wade里面的少许区别
 */
function popupDialogForAcct(page, listener, params, title, width, height, subsyscode, subsysaddr) {
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
}



//返回值：arg1加上arg2的精确结果  
function accAdd(arg1,arg2){
    lengthMaxChk(arg1);
    lengthMaxChk(arg2);
    return (parseFloat(arg1)+parseFloat(arg2)).toFixed(2);  
}  

function lengthMaxChk(arg) {
    if (arg.toString().split(".")[0].length>9) {
        throw new Error(arg+"超过了最大位数！");
    }
}

//说明：javascript的减法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。  
//调用：accSub(arg1,arg2)  
//返回值：arg1减上arg2的精确结果  
function accSub(arg1,arg2){     
    lengthMaxChk(arg1);
    lengthMaxChk(arg2); 
    return accAdd(arg1,-arg2);  
}  


//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。    
//调用：accMul(arg1,arg2)                                                                                 
//返回值：arg1乘以arg2的精确结果                                                                          
function accMul(arg1,arg2)                                                                                
{                                 
    lengthMaxChk(arg1);
    lengthMaxChk(arg2);                                                                                                                              
    return (parseFloat(arg1)*parseFloat(arg2)).toFixed(2);                           
}                                                                                                         
                                                                                                                  

//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。                                                                                                
//调用：accDiv(arg1,arg2)                                                                                 
//返回值：arg1除以arg2的精确结果                                                                          
function accDiv(arg1,arg2){      
    lengthMaxChk(arg1);
    lengthMaxChk(arg2);                                                                         
    return (arg1/arg2).toFixed(2);                                                                                                     
}                                  

/**
 * 只选中当前选择的checkbox，其他checkbox全都不选中
 */
function checkedOneOnly(obj, boxName) {
	var boxList = getElements(boxName);
	for (var i=0; i<boxList.length; i++) {
		if (boxList[i] == obj) continue;
		boxList[i].checked = false;	
	}
}

function showConfirm(msg,okBut,cancelBut,title) {
	var param;
	if(msg && msg != "null" && msg != "" && msg != null) {
		param = param + "&MSG=" + msg;
	}
	if(okBut && okBut != "null" && okBut != "" && okBut != null) {
		param = param + "&OKBUT=" + okBut;
	}
	if(cancelBut && cancelBut != "null" && cancelBut != "" && cancelBut != null) {
		param = param + "&CANCELBUT=" + cancelBut;
	}
    var obj = popupDialog("common.alertwin.AlertWin","initConfirmWin", 
                          "&OKBUT=" + okBut + "&CANCELBUT=" + cancelBut + "&MSG=" + msg, (title&&title != null)?title:"系统提示", "350","65");
			if (!obj) {
			    return false;
			} else {
			    return obj.paramValues[0];
			}
        }
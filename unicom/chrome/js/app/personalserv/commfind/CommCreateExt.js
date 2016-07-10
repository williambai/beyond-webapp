//在调试区输出页面信息,add by zhangyanghsuo
function initShowHtml(name,flag) {
	var htmlButStr = "";
	if(flag){
	var buttons = [{"name":"\u52a0\u8f7d", "id":"show", "click":"show"}, 
	               {"name":"\u683c\u5f0f\u5316", "id":"formate", "click":"formate"}, 
	               {"name":"\u590d\u5236", "id":"copy", "click":"copy"},
	               {"name":"\u53e6\u5b58", "id":"save", "click":"save"}, 
	               {"name":"\u7c98\u8d34", "id":"paste", "click":"paste"}, 
	               //{"name":"\u6d4b\u8bd5", "id":"exec", "click":"exec"}, 
	               {"name":"\u6e05\u7a7a", "id":"clean", "click":"clean"}, 
	               {"name":"\u5173\u95ed", "id":"close", "click":"close"}];
	 htmlButStr = "\u573a\u666f\u811a\u672c";
	for (var i = 0; i < buttons.length; i++) {
		var oo = eval(buttons[i]);
		htmlButStr += "<input id=\"" + oo.id + "HtmlBut\" type=\"button\" value=\"" + oo.name + "\" class=\"btn2\" onmouseover=\"this.className='btn3 btnOver'\" onmouseout=\"this.className='btn3 btnOff'\" onclick=\"" + oo.click + "HtmlFunc()\" />";
	}
	htmlButStr += "<span id =\"showHtml3\"></span>";
	}
	document.getElementById(name).innerHTML = htmlButStr;
	
	
	//alert(hasPriv("aaaa"));
	
}
//divName用于指定div,默认为全页面,beforeStr,afterStr,func用于补充默认获取的界面。
var divNameTemp = "";
var beforeStrTemp = "";
var afterStrTemp = "";
var funcTemp = "";
function showHtmlShow(divName, beforeStr, afterStr, func) {
	$("EDIT_AREA").value = "";
	divNameTemp = divName;
	beforeStrTemp = beforeStr;
	afterStrTemp = afterStr;
	funcTemp = func;
	var arrayInfo = [];
	var win = new Cs.flower.Win();
	arrayInfo.push({value:"1", name:"\u89e3\u6790\u663e\u793a1"});
	arrayInfo.push({value:"2", name:"\u76f4\u63a5\u663e\u793a"});
	arrayInfo.push({value:"3", name:"\u4ec5\u663e\u793a\u8c03\u8bd5\u7a97\u53e3"});
	resultInfo = win.select(arrayInfo, showHtmlCore, 3, "\u3010\u6ce8\u610f\u3011\u5f53\u6570\u636e\u8fc7\u5927\uff0c\u4f1a\u62a5IE\u5185\u5b58\u6ea2\u51fa,\u8bf7\u4e0d\u8981\u9009\u62e9\u89e3\u6790\u6a21\u5f0f");
}

function showHtmlCore(value) {
	initShowHtml("showHtmlDiv2",true);
	if (value == "3") {
		$displayV("showHtmlDiv", true);
		return;
	}
	var info = "";
	if (divNameTemp == null || divNameTemp.trim() == "") {
		info = document.documentElement.outerHTML;
	} else {
		info = document.getElementById(divName).innerHTML;
	}
	if (value == "1") {
		info = (info != null && info.trim() != "") ? info : "";
		info = info.replaceAll("http://130.34.3.195/", "").replaceAll(" src=\"/", " src=\"").replaceAll(" href=\"/", "  href=\"");
		var str = "<script>";
		try {
			if (baseProduct != null && Object.toJSON(baseProduct) != "{}") {
				str += "var baseProduct={};";
			}
			for (var property in baseProduct) {
				if (",netTypeCode,brandCode,productTypeCode,productId,".include("," + property + ",")) {
					if (baseProduct[property] != "") {
						str += "baseProduct." + property + "='" + baseProduct[property] + "';";
					}
				}
			}
		}
		catch (e) {
		}
		try {
			if (tradeTypeCode != null) {
				str += "var tradeTypeCode=" + tradeTypeCode + ";";
			}
		}
		catch (e) {
		}
		var cache = new Cs.flower.DataCache();
		var custInfo = cache.get("custInfo");
		if (custInfo != null) {
			str += "var openInfo={};openInfo.custInfo={};";
			for (var property in custInfo) {
				if (typeof property == "string" && property != "toJSONString") {
					var v = custInfo[property];
					if (typeof v == "string") {
						str += "openInfo.custInfo." + property + "='" + custInfo[property] + "';";
					} else {
						str += "openInfo.custInfo." + property + "=" + custInfo[property] + ";";
					}
				}
			}
			str += "var cache = new Cs.flower.DataCache();cache.put(\"custInfo\", openInfo.custInfo);";
		}
		str += "</script>";
		info = info.replace("<DIV id=showHtml1>", "<DIV id=showHtml1>" + str);
		str = "<DIV id=showHtml2><script>";
		str += "$A(document.getElementsByTagName(\"IMG\")).flatten().each(function(element){";
		str += "if(element.id.startsWith(\"IMG_CAL_\")){";
		str += "addCalendar(element.id.substr(\"IMG_CAL_\".length));";
		str += "}";
		str += "});";
		str += "</script>";
		info = info.replace("<DIV id=showHtml2>", str);
	}
	info = ((beforeStrTemp != null && beforeStrTemp.trim() != "") ? beforeStrTemp : "") + info + ((afterStrTemp != null && afterStrTemp.trim() != "") ? afterStrTemp : "");
	if (typeof funcTemp != "undefined" && funcTemp instanceof Function) {
		info = funcTemp(info);
	}
	document.getElementById("showHtml3").innerHTML =   info.length + "\u4e2a\u5b57\u7b26";
	document.getElementById("EDIT_AREA").value = info;   //flag?startFormat(info):info;
	
	$displayV("showHtmlDiv", true);
}
function showHtmlFunc() {
	$("EDIT_AREA").value = "";
	var arrayInfo = [];
	var win = new Cs.flower.Win();
	arrayInfo.push({value:"1", name:"\u89e3\u6790\u663e\u793a1"});
	arrayInfo.push({value:"2", name:"\u76f4\u63a5\u663e\u793a"});
	resultInfo = win.select(arrayInfo, showHtmlCore, 3, "\u3010\u6ce8\u610f\u3011\u5f53\u6570\u636e\u8fc7\u5927\uff0c\u4f1a\u62a5IE\u5185\u5b58\u6ea2\u51fa,\u8bf7\u4e0d\u8981\u9009\u62e9\u89e3\u6790\u6a21\u5f0f");
}
function formateHtmlFunc() {
	document.getElementById("EDIT_AREA").value = startFormat(document.getElementById("EDIT_AREA").value);
}
function copyHtmlFunc() {
	copyToClip($F("EDIT_AREA"));
}
function saveHtmlFunc() {
	var temp = $F("EDIT_AREA");
	if (temp == "") {
		alert("\u8bf7\u8f93\u5165\u8981\u4fdd\u5b58\u7684\u4ee3\u7801\u5185\u5bb9");
		return false;
	}
	//var winname = window.open("", "_blank", "");
	
	//winname.document.open("text/html", "replace");
	//try{
	//winname.document.writeln(temp);
	//winname.document.close();
	//}catch(e){}
	document.execCommand("saveas", "", "savecode.html");
	//winname.close();
}
function pasteHtmlFunc() {
	copyFromClipboard($("EDIT_AREA"));
}
function execHtmlFunc() {
	
	var flag = confirm("这个功能仅用于调试，操作慎用,是否使用？");
	if(flag){
		var temp = $F("EDIT_AREA");
		document.getElementById("showHtml3").innerHTML =   temp.length + "\u4e2a\u5b57\u7b26";
		eval($F("EDIT_AREA"));
	}
}
function cleanHtmlFunc() {
	$("showHtml3").innerHTML = "";
	$("EDIT_AREA").value = "";
}
function closeHtmlFunc() {
	initShowHtml("showHtmlDiv2",false);
	chgabled(null, null, ["EDIT_AREA"], null, null, ["showHtmlDiv"], false);
}


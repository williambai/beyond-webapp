var wadeAjaxLoading = true;
var myGlobalHandlers ={
		onCreate:function(){
			ajaxBegin();
		},
		onComplete:function(){
			ajaxEnd();
		}
	};
	
Ajax.Responders.register(myGlobalHandlers);
	
	
function ajaxDirect(page, listener, params, partids, israw) {
	if (page == null || page != null && typeof(page) != "string") {
		page = pagevisit.getAttribute("pagename");
	}
	var obj = getElementBySrc();
	//var url = window.location.protocol + '//' + window.location.host + '/' + getContextName() +
	// zhangqing modify by 20071113
	var url = getContextName() +
	 "?service=ajaxDirect/1/" + page + '/' + page + '/javascript/' + partids;
	if (page != null) url += "&pagename=" + page;
	if (listener != null) url += "&eventname=" + listener;
	if (params != null) url += '&' + params;
	if (israw == null || !israw) url = getSysAddr(url,obj == null ? null : obj.subsys);
	
	url = url + '&partids=' + partids;
	url += "&random=" + getRandomParam();
	
	ajaxRequest(url,'','get');
	return;
}

function ajaxSubmit(page,listener,params,partids,formIds,israw){
	if (document.forms.length == 0) {
		alert('form tag not exist');
		return;
	}
	if (page == null || page != null && typeof(page) != "string") {
		page = pagevisit.getAttribute("pagename");
	}
	var obj = getElementBySrc();
	//var url = window.location.protocol + '//' + window.location.host + '/' + getContextName() +
	// zhangqing modify by 20071113
	var url = getContextName() +
	 "?service=ajaxDirect/1/" + page + '/' + page + '/javascript/' + partids;
	if (page != null) url += "&pagename=" + page;
	if (listener != null) url += "&eventname=" + listener;
	if (israw == null || !israw) url = getSysAddr(url,obj == null ? null : obj.subsys);
	
	var ele='';
	
	if (formIds) {
		formIds = formIds.split(",");
		for(i=0;i<formIds.length;i++){
			if (!$(formIds[i])){
				alert("can't get form (" + formIds[i] + ")");
				continue;
			}
			ele += Form.serialize(formIds[i]) + '&';
			ele = delElement(ele, "service");
			ele = delElement(ele, "sp");
		}
	} else {
		//formId为空默认为链接所在表单
		formNode = getParentForm(obj);
		if (formNode=='null'){
			formNode = document.forms[0];
		}
		ele = Form.serialize(formNode);
		ele = delElement(ele, "service");
		ele = delElement(ele, "sp");
	}
	
	if (params != null) ele += params;
	
	url = url + '&partids=' + partids;
	url += "&random=" + getRandomParam();
	ajaxRequest(url,ele,'post');
}

function ajaxRequest(reqUrl,params,method){
	if (method==null || !method) method='get';
	if (method=='get'){
		reqUrl = reqUrl+'&ajaxSubmitType=get';
		var myAjax = new Ajax.Request(reqUrl, {method:"get", parameters:params,onComplete:showResponse});
	}
	else if (method=='post'){
		reqUrl = encodeURI(reqUrl+'&ajaxSubmitType=post');
		var myAjax = new Ajax.Request(reqUrl, {method:"post", parameters:params,onComplete:showResponse});
	}
	else{
		alert('错误的提交方式'+method);
		return false;
	}
}

//var dialog;

/* 默认onComplete事件 */
function showResponse(response) {
	var scripts = "";
	var root;
	if (Browser.isFF) { 
		var parser = new DOMParser();
		var xml = parser.parseFromString(response.responseText, "text/xml");
		var root = xml.documentElement;
	}
	else{
		root = response.responseXML.documentElement;
	}
	if (root == null || root.nodeName!='parts') {
		if (wade_sbtframe != null) {
			document.getElementById("wade_sbtframe").setAttribute("simplePage", "true");
			wade_sbtframe.document.write(response.responseText);
		} else {
			w = window.open("", null, "status=yes,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no");
			w.document.write(response.responseText);
		}
		this.afterAction = "";
	} else {
		var partNodes = root.childNodes;
		for (var i = 0; i < partNodes.length; i++) {
			var part = partNodes.item(i);
			if (part.nodeName == 'JSONDATA' && part.childNodes[0]!=null){
				this.ajaxData=part.childNodes[0].nodeValue.parseJSON();
			}
			if (part.attributes) {
				var partId = part.attributes[0].value;
				var partElement = document.getElementById(partId);
				if (partElement) {
					if (part.childNodes != null && part.childNodes.length > 0) {
						var content = "";
						for (var ii = 0; ii < part.childNodes.length; ii++) {
							content += part.childNodes[ii].nodeValue;
						}
						if (partElement.innerHTML != content) {
							partElement.innerHTML = content;
							scripts += content.extractScripts().join(";") + ";";
						}
					} else {
						//modi by zhujm 20070720
						//不应该将part删除
						//partElement.parentNode.removeChild(partElement);
						partElement.innerHTML='';
					}
				}
			}
		}
	}
	this.afterAction = scripts + (this.afterAction ? this.afterAction : "");
}

function delElement(ele, key) {
	var start = ele.indexOf(key);
	if (start == -1) {
		return ele;
	}
	var end = ele.indexOf("&", ele.indexOf(key));
	var tmp1 = ele.substring(0, start);
	var tmp2;
	if (end == -1) {
		tmp2 = "";
	} else {
		tmp2 = ele.substring(end + 1);
	}
	return tmp1 + tmp2;
}

function getParentForm(obj){
	if (obj == null) return 'null';
	var parent = obj.parentNode;
	if (parent.tagName=='FORM'){
		return parent;
	}
	else if (parent.tagName=='BODY'){
		return 'null';
	}
	else{
		return getParentForm(parent);
	}
}

function setAjaxLoading(isloading) {
	wadeAjaxLoading = isloading;
}

function ajaxBegin(){
	if (wadeAjaxLoading) beginPageLoading();
}

function ajaxEnd(){
	if (wadeAjaxLoading) endPageLoading();
	eval(this.afterAction);
	this.afterAction = "";
}
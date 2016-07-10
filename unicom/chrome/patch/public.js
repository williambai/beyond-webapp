var Browser = {
	isFF : window.navigator.appName.indexOf("Netscape") != -1 ? true : false
};


/** firefox transition */
if (Browser.isFF) {
	/** search event */
	function SearchEvent() {
		var func = SearchEvent.caller;
		while (func != null) {
			var arg = func.arguments[0];
			if (arg) {
				if (String(arg.constructor).indexOf('Event') > -1) {
					return arg;
				}
			}
			func = func.caller;
		}
		return null;
	}
	/** transition event */
	window.constructor.prototype.__defineGetter__("event", function() {
		return SearchEvent();
		});
	/** transition modal dialog */
	window.constructor.prototype.showModalDialog = function(url, arg, parameters) {
		parameters = "width=" + arg.width + ",innerHeight=" + (parseInt(arg.height) + 30) + ",toolbar=no,menubar=no,scrollbars=no,location=no,resizable=no,alwaysRaised=yes,depended=yes";
		var hasUrlParam = url.indexOf("?") == -1;
		for (a in arg) {
			url += (hasUrlParam ? "?" : "&") + a + "=" + encodeURIComponent(arg[a]);
			if (hasUrlParam) hasUrlParam = false;
		}
		this.open(url, null, parameters);
		};
	/** transition event properties */
	if (window.Event) {
		Event.prototype.__defineSetter__("returnValue", function(b) {
			if (!b) this.preventDefault();
			return b;
			});
		Event.prototype.__defineSetter__("cancelBubble", function(b) {
	    	if (b) this.stopPropagation();
			return b;
			});
		Event.prototype.__defineGetter__("srcElement", function() {
	        var node = this.target;
	        while (node.nodeType != 1) node = node.parentNode;
			return node;
			});
		Event.prototype.__defineGetter__("fromElement", function() {
	        var node;
	        if (this.type == "mouseover")
	            node = this.relatedTarget;
	        else if (this.type == "mouseout")
	            node = this.target;
	        if (!node) return;
	        while (node.nodeType != 1) node = node.parentNode;
			return node;
			});
		Event.prototype.__defineGetter__("toElement", function() {
	        var node;
	        if (this.type == "mouseout")
	            node = this.relatedTarget;
	        else if (this.type == "mouseover")
	            node = this.target;
	        if (!node) return;
	        while (node.nodeType != 1) node = node.parentNode;
			return node;
			});
		Event.prototype.__defineGetter__("offsetX", function() {
			return this.layerX;
			});
		Event.prototype.__defineGetter__("offsetY", function() {
        	return this.layerY;
			});
		Event.prototype.__defineGetter__("keyCode", function() {
			return this.charCode;
			});
	}
	/** transition document properties */
	if (window.Document) {
    }
    /** transition node properties */
	if (window.Node) {
		Node.prototype.replaceNode = function(Node) {
			this.parentNode.replaceChild(Node, this);
        }
		Node.prototype.removeNode = function(removeChildren) {
        	if (removeChildren)
            	return this.parentNode.removeChild(this);
        	else {
				var range = document.createRange();
				range.selectNodeContents(this);
				return this.parentNode.replaceChild(range.extractContents(), this);
			}
        }
		Node.prototype.swapNode = function(Node) {
			var nextSibling = this.nextSibling;
			var parentNode = this.parentNode;
			node.parentNode.replaceChild(this, Node);
			parentNode.insertBefore(node, nextSibling);
        }
    }
    /** transition html element properties */
	if (window.HTMLElement) {
		HTMLElement.prototype.__defineGetter__("all", function() {
	    	var a = this.getElementsByTagName("*");
	    	var node = this;
	    	a.tags = function(sTagName) {
	        	return node.getElementsByTagName(sTagName);
	        }
			return a;
			});
		HTMLElement.prototype.__defineGetter__("parentElement", function() {
        	if (this.parentNode == this.ownerDocument) return null;
        	return this.parentNode;
        	});
		HTMLElement.prototype.__defineGetter__("children", function() {
	        var tmp = [];
	        var j = 0;
	        var n;
	        for (var i=0; i<this.childNodes.length; i++) {
	            n = this.childNodes[i];
	            if (n.nodeType == 1) {
	                tmp[j++] = n;
	                if (n.name) {
	                    if(!tmp[n.name])
							tmp[n.name] = [];
	                    	tmp[n.name][tmp[n.name].length] = n;
						}
					if (n.id)
						tmp[n.id] = n;
	                }
			}
			return tmp;
			});
		HTMLElement.prototype.__defineGetter__("currentStyle", function() {
			return this.ownerDocument.defaultView.getComputedStyle(this, null);
			});
		HTMLElement.prototype.__defineSetter__("outerHTML", function(sHTML) {
	        var r = this.ownerDocument.createRange();
	        r.setStartBefore(this);
	        var df = r.createContextualFragment(sHTML);
	        this.parentNode.replaceChild(df, this);
	        return sHTML;
	        });
		HTMLElement.prototype.__defineGetter__("outerHTML", function() {
	        var attr;
	        var attrs = this.attributes;
	        var str = "<" + this.tagName;
	        for (var i=0; i<attrs.length; i++) {
	            attr = attrs[i];
	            if (attr.specified)
	        		str += " " + attr.name + '="' + attr.value + '"';
	        }
	        if (!this.canHaveChildren)
				return str + ">";
			return str + ">" + this.innerHTML + "</" + this.tagName + ">";
	        });
		HTMLElement.prototype.__defineGetter__("canHaveChildren", function() {
	        switch (this.tagName.toLowerCase()){
	            case "area":
	            case "base":
	            case "basefont":
	            case "col":
	            case "frame":
	            case "hr":
	            case "img":
	            case "br":
	            case "input":
	            case "isindex":
	            case "link":
	            case "meta":
	            case "param":
	                return false;
	            }
	        return true;
	        });
		HTMLElement.prototype.__defineSetter__("innerText", function(sText) {
	        var parsedText=document.createTextNode(sText);
	        this.innerHTML=parsedText;
	        return parsedText;
	        });
	    HTMLElement.prototype.__defineGetter__("innerText", function() {
	        var r = this.ownerDocument.createRange();
	        r.selectNodeContents(this);
	        return r.toString();
	        });
	    HTMLElement.prototype.__defineSetter__("outerText", function(sText) {
	        var parsedText = document.createTextNode(sText);
	        this.outerHTML = parsedText;
	        return parsedText;
	        });
	    HTMLElement.prototype.__defineGetter__("outerText", function() {
	        var r = this.ownerDocument.createRange();
	        r.selectNodeContents(this);
	        return r.toString();
	        });
	    /** define properties */
	    HTMLElement.prototype.__defineGetter__("parameters", function() {
	        return this.getAttribute("parameters");
	        });
	    /** define click event */
		HTMLElement.prototype.click = function() {
			var mevt = document.createEvent("MouseEvent"); 
  			mevt.initEvent("click", false, false);
  			this.dispatchEvent(mevt);
		}
	    HTMLElement.prototype.attachEvent = function(sType, fHandler) {
	    	var shortTypeName = sType.replace(/on/, "");
	        fHandler._ieEmuEventHandler=function(e){
	            window.event = e;
	            return fHandler();
	        }
			this.addEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
		}
	    HTMLElement.prototype.detachEvent = function(sType, fHandler) {
	    	var shortTypeName = sType.replace(/on/, "");
			if (typeof(fHandler._ieEmuEventHandler) == "function")
	            this.removeEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
	        else
	            this.removeEventListener(shortTypeName, fHandler, true);
		}
	    HTMLElement.prototype.contains = function(Node) {
	        do if (Node == this) return true;
	        while (Node = Node.parentNode);
			return false;
	    }
		HTMLElement.prototype.insertAdjacentElement = function(where, parsedNode) {
	        switch (where) {
	            case "beforeBegin":
	                this.parentNode.insertBefore(parsedNode, this);
	                break;
	            case "afterBegin":
	                this.insertBefore(parsedNode, this.firstChild);
	                break;
	            case "beforeEnd":
	                this.appendChild(parsedNode);
	                break;
	            case "afterEnd":
	                if(this.nextSibling)
	                    this.parentNode.insertBefore(parsedNode, this.nextSibling);
	                else
	                    this.parentNode.appendChild(parsedNode);
	                break;
			}
		}
	    HTMLElement.prototype.insertAdjacentHTML = function(where, htmlStr) {
	        var r = this.ownerDocument.createRange();
	        r.setStartBefore(this);
	        var parsedHTML = r.createContextualFragment(htmlStr);
	        this.insertAdjacentElement(where, parsedHTML);
	        }
	    HTMLElement.prototype.insertAdjacentText = function(where, txtStr) {
	        var parsedText = document.createTextNode(txtStr);
	        this.insertAdjacentElement(where, parsedText);
	        }
		HTMLElement.prototype.attachEvent = function(sType, fHandler) {
	        var shortTypeName = sType.replace(/on/, "");
	        fHandler._ieEmuEventHandler = function(e) {
	            window.event = e;
	            return fHandler();
	        }
			this.addEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
		}
	    HTMLElement.prototype.detachEvent=function(sType, fHandler) {
	        var shortTypeName=sType.replace(/on/, "");
	        if (typeof(fHandler._ieEmuEventHandler) == "function")
	            this.removeEventListener(shortTypeName, fHandler._ieEmuEventHandler, false);
	        else
	            this.removeEventListener(shortTypeName, fHandler, true);
		}
	}
}
/** object expand */
/** trim */
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
/** starts with */
String.prototype.startsWith = function(prefix) {
	return this.substring(0, prefix.length) == prefix;
}
/** ends width */
String.prototype.endsWith = function(suffix) {
	return this.substring(this.length - suffix.length) == suffix;
}
/** replace all */
String.prototype.replaceAll = function(oldstr, newstr) {
	return this.replace(new RegExp(oldstr,"gm"), newstr);
}

/** global variable */
var wade_keypress_events = new Array();

/** is array */
function isArray(obj) {
	return (typeof obj == 'object') && obj.constructor == Array; 
}
/** is string */
function isString(str) {
	return (typeof str == 'string') && str.constructor == String;
}
/** is number */
function isNumber(obj) {
	return (typeof obj == 'number') && obj.constructor == Number;
}
/** is date */
function isDate(obj) {
	return (typeof obj == 'object') && obj.constructor == Date;
}
/** is function */
function isFunction(obj) {
	return (typeof obj == 'function') && obj.constructor == Function;
}
/** is object */
function isObject(obj) {
	return (typeof obj == 'object') && obj.constructor == Object;
}

/** get parameter */
function getParameter(param) {
	var paramstr = window.location.search;
	var len = param.length;
	var start = paramstr.indexOf(param);
	if (start == -1) return "";
	start += len + 1;
	var end = paramstr.indexOf("&", start);
	if (end == -1) return decodeURIComponent(paramstr.substring(start));
	return decodeURIComponent(paramstr.substring(start, end));
}

/**get attribute value  add by caom*/
function getAttributeValue(obj, attrname, defvalue){
	var attrvalue = obj == null ? null : obj.getAttribute(attrname);
	return attrvalue == null ? defvalue : attrvalue;
}

/** get element */
function getElement(name) {
	return document.getElementById(name);
}
/** get element value */
function getElementValue(name) {
	var element = getElement(name);
	return element == null ? null : element.value;
}
/** get elements */
function getElements(name) {
	return document.getElementsByName(name);
}
/** field focus */
function focus(field) {
	try {
		field.focus();
	} catch (e) {
	}
}
/** set class name */
function setClass(name, value) {
	getElement(name).className = value;
}
/** get box number */
function getBoxNum(boxName) {
	var boxList = getElements(boxName);
	return boxList == null ? null : boxList.length;
}
/** get checked box number */
function getCheckedBoxNum(boxName) {
	var boxCount = 0;
	var boxList = getElements(boxName);
	for (var i=0; i<boxList.length; i++) {
		if(boxList[i].checked) boxCount++;
	}
	return boxCount;
}
/** get checked box str */
function getCheckedBoxStr(boxName, separator) {
	if (separator == null) separator = ","
	var boxStr = "";
	var boxList = getElements(boxName);
	for (var i=0; i<boxList.length; i++) {
		if(boxList[i].checked) {
			boxStr += (boxStr == "" ? "" : separator) + boxList[i].value;
		}
	}
	return boxStr;
}
/** checked all */
function checkedAll(boxName, ischecked) {
	var boxList = getElements(boxName);
	for (var i=0; i<boxList.length; i++) {
		if (boxList[i].disabled || boxList[i].getAttribute("flag") == "temp") continue;
		boxList[i].checked = ischecked;
	}
}
/** checked other */
function checkedOther(boxName) {
	var boxList = getElements(boxName);
	for (var i=0; i<boxList.length; i++) {
		if (boxList[i].disabled || boxList[i].getAttribute("flag") == "temp") continue;
		boxList[i].checked = !boxList[i].checked;	
	}
}
/** selected all */
function selectedAll(selectName) {
	var options = getElement(selectName);
	for (var i=0; i<options.length; i++) {
		options[i].selected = true;
	}
}
/** get length */
function getLength(str) {
	var length = 0;
	for (var i=0; i<str.length; i++) {
		if (str.charCodeAt(i) > 255) length += 2; else length ++;
	}
	return length;
}
/** get part str */
function getPartStr(str, maxlen) {
	if (getLength(str) <= maxlen) return str;
	maxlen = maxlen - 3;

	var partlen = 0;
	var length = 0;
	while (length < maxlen) {
		if (str.charCodeAt(length) > 255) {
			length += 2;
		} else {
			length ++;
		}
		partlen ++;
	}
	return str.substr(0, partlen) + "...";
}
/** contain key */
function containKey(array, key) {
	for (var i=0; i<array.length; i++) {
		if (array[i].value == key) {
			return true;
		}
	}
	return false;
}
/** hidden obj */
function hidden(obj, ishidden) {
	if(obj){obj.style.display = ishidden ? "none" : "";}
}
/** mouse over */
function mouseOver(obj) {
	obj.bgColor = "#F0F0F0";
}
/** mouse out */
function mouseOut(obj) {
	obj.bgColor = "#FFFFFF";
}
/** get data by str */
function getDataByStr(obj, group, istrim) {
	var str = "";
	var theForm = obj == null ? null : obj.form;
	if (theForm == null) theForm = document.forms[0];
	var elements = theForm.elements;
	for (var i=0; i<elements.length; i++) {
		var name = elements[i].name;
		var value = elements[i].value;
		
		if (name == "listener" || name == "service" || name == "sp" || name == "Form0") continue;
		if (group == null || group != null && name.startsWith(group + "_")) {
			if (group != null && istrim != null && istrim) {
				name = name.substring(group + "-");
			}
			str += "&" + name + "=" + value;
		}
	}
	return str;
}
/** set key press event */
function setKeyPressEvent(fldname, btname) {
	wade_keypress_events[fldname] = btname;
}
/** get default submit */
/** get default submit */
function getDefaultSubmit() {
	var forms = document.forms;
	for (var i=0; i<forms.length; i++) {
		var elements = forms[i].elements;
		for (var j=0; j<elements.length; j++) {
			var element = elements[j];
			if (element.tagName == "INPUT" && (element.type.toUpperCase() == "SUBMIT" || element.type.toUpperCase() == "BUTTON")) {
				if (!element.disabled && element.style.display != "none") {
					return element;
				}
			}
		}
	}
	return null;
}
/** on key press event */
function onKeyPressEvent(name) {
	if (window.event.keyCode == 13) {
		var evtbutton = null;
		var srcelement = getElementBySrc();
		if (srcelement != null) {
			if (srcelement.tagName == "INPUT" && srcelement.type.toUpperCase() == "TEXT" && !srcelement.disabled && !srcelement.readOnly) {	
				var evtbtname = wade_keypress_events[srcelement.name];
				if (evtbtname != null) {
					evtbutton = getElement(evtbtname);
				}
			} else if (srcelement.tagName == "TEXTAREA") {
				return;
			}
		}
		window.event.returnValue = false;
		
		if (evtbutton == null && name != null) {
			evtbutton = getElement(name);
		}
		if (evtbutton == null) {
			evtbutton = getDefaultSubmit();
		}
		if (evtbutton != null) {
			focus(evtbutton);
			evtbutton.click();
		} else {
			window.event.returnValue = true;
		}
	}
}
/** set hotkey */
function setHotkey(target) {
	document.attachEvent("onkeydown",
		function() {
			if (!target) return;
			
			var evt = window.event;
			var keyCode = evt.keyCode;
			
			var hotkey = target.document.getElementById("HOTKEY_" + keyCode);
			if (hotkey != null) {
				if (keyCode == 112) {
					window.onhelp=function() { return false; }
				} else {
					evt.keyCode = 0;
					evt.returnValue = false;
				}
				
				hotkey.click();
			}
		});
}
/** add event listener */
function addObjEventListener(obj, eventName, eventHandler) {
	if (eval(obj + ".addEventListener")) {
		eval(obj + ".addEventListener('" + eventName+"', " + eventHandler + ", false);");
    } else if (eval(obj + ".attachEvent")) {
		eval(obj + ".attachEvent('on" + eventName + "'," + eventHandler + ");");
    } else if (eval(obj + ".on" + eventName)) {
		eval(obj + ".on" + eventName + "=" + eventHandler);
    }
}
/** remove event listener */
function removeObjEventListener(obj, eventName, eventHandler) {
	if (eval(obj + ".removeEventListener")) {
		eval(obj + ".removeEventListener('" + eventName+"', " + eventHandler + ", false);");
    } else if (eval(obj + ".detachEvent")) {
		eval(obj + ".detachEvent('on" + eventName + "'," + eventHandler + ");");
    } else if (eval(obj + ".on" + eventName)) {
		eval(obj + ".on" + eventName + "=" + eventHandler);
    }
}
/** get frame, for example: 'custframe'、'custframe.subframe'、['custframe',parent] */
function getFrame(frame) {
	var target = null;
	if (isString(frame)) {
		var array = frame.split(".");
		for (var i=0; i<array.length; i++) {
			if (array[i] == "parent") {
				target = target == null ? parent : target.parent;
			}
		}
		if (target != null) return target;
	}
	
	var tgtrange = window.top;
	if (isArray(frame)) {
		tgtrange = frame[1];
		frame = frame[0];
	}
	var ifrms = tgtrange.frames;
	for (var i=0; i<ifrms.length; i++) {
		var jfrms = ifrms[i].frames;
		if (jfrms.name == frame) return jfrms;
		if (jfrms.length > 0) {
			for (var j=0; j<jfrms.length; j++) {
				var kfrms = jfrms[j].frames;
				if (kfrms.name == frame) return kfrms;
				if (kfrms.length > 0) {
					for (var k=0; k<kfrms.length; k++) {
						if (kfrms[k].name == frame) return kfrms[k];
					}
				}
			}
		}
	}
}
/* get element by tag */
function getElementByTag(obj, tag) {
	while (obj != null && typeof(obj.tagName) != null) {
		if (obj.tagName == tag.toUpperCase()) return obj;
		obj = obj.parentElement;
	}
	return null;
}
/* get child element */
function getChildElement(obj, tag, sign) {
	var nodes = obj.childNodes;
	for (var i=0; i<nodes.length; i++) {
		if (nodes[i].tagName == tag.toUpperCase() && nodes[i].sign == sign) return nodes[i];
		var child = getChildElement(nodes[i], tag, sign);
		if (child != null) return child;
	}
	return null;
}
/** get elementBySrc */
function getElementBySrc() {
	return window.event == null ? null : window.event.srcElement;
}
/** fill childs by recursion */
function fillChildsByRecursion(array, object, tag) {
	var childs = object.childNodes;
	for (var i=0; i<childs.length; i++) {
		var child = childs[i];
		if (child.attributes != null && child.attributes[tag] != null) {
			array[array.length] = child;
		}
		fillChildsByRecursion(array, child, tag);
	}
}
/** get childs  by recursion */
function getChildsByRecursion(object, tag) {
	var array = new Array;
	fillChildsByRecursion(array, object, tag);
	return array;
}
/** get os */
function getOS() {
	var osstr = navigator.appVersion.split(";")[2].trim().toLowerCase();
	switch (osstr) {
		case "windows nt 5.0":
			return "win2000";
		case "windows nt 5.1":
			return "winxp";
		case "windows nt 5.2":
			return "win2003";
	}
	return null;
}
/** get random param */
function getRandomParam() {
	var date = new Date();
	return "" + date.getYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
}
/** get dialog height */
function getDialogHeight(height) {
	return getOS() == "winxp" ? parseInt(height) + 25 : parseInt(height);
}
/** open dialog */
function openDialog(url, width, height, arg) {
	var returnValue;
	//通过父窗体的位置距离判断，窗体等级,设置当前窗体的位置。
	if(typeof window.dialogLeft=='undefined'&&typeof window.dialogTop=='undefined'){
		
		returnValue = window.showModalDialog(url, arg, "dialogWidth: " + width + "px; dialogLeft: 205px; dialogTop: 260px; resizable: no; help: no; status: no; scroll: no;");
	}else{
		var dialogLeft=window.dialogLeft.substring(0,window.dialogLeft.lastIndexOf("p"))*1.1;
		var dialogTop=window.dialogTop.substring(0,window.dialogTop.lastIndexOf("p"))*1.1;
		returnValue = window.showModalDialog(url, arg, "dialogWidth: " + width + "px; dialogLeft: " + dialogLeft + "px; dialogTop: " + dialogTop + "px;   resizable: no; help: no; status: no; scroll: no;");
	
	}
	
	//var returnValue = window.showModalDialog(url, arg, "dialogWidth: " + width + "px; resizable: no; help: no; status: no; scroll: no;");
	if (Browser.isFF) {
		alert("请在打开的弹出窗口进行相关操作，待操作完成并关闭弹出窗口后，点【确认】继续进行后续操作！");
		returnValue = window.returnValue;
	}
	return returnValue;
	//return window.showModalDialog(url, arg, "dialogWidth: " + width + "px; dialogHeight: " + getDialogHeight(height) + "px; resizable: no; help: no; status: no; scroll: no;");
}
/** popup dialog */
function popupDialog(page, listener, params, title, width, height, subsyscode, subsysaddr,isShow) {
	if (title == null) title = "弹出窗口";
	//20110816
	if(!isShow){//还是放开吧。。。。。。
	if (width == null||width>780)  width = 780;
	if (height == null||height>300) height = 300;
	}
	
	var url = getContextName() + "?service=page/" + page;
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
/** popup page */
function popupPage(page, listener, params, title, width, height) {
	var imgobj = getElementBySrc();
	var fieldName = imgobj.getAttribute("fieldName");
	var textName = imgobj.getAttribute("textName");
	var returnValue = popupDialog(page, listener, params, title, width, height, imgobj.getAttribute("subsyscode"), imgobj.getAttribute("subsysaddr"));	
	if (returnValue != null) {
		getElement(fieldName).value = returnValue.value;
		getElement(textName).value = returnValue.text;
		var paramNames = returnValue.paramNames;
		var paramValues = returnValue.paramValues;
		if (paramNames != null && paramValues != null) {
			for (var i=0; i<paramNames.length; i++) {
				var field = getElement(paramNames[i]);
				if (field == null) {
					//alert("field " + paramNames[i] + " not exist!");
				} else {
					field.value = paramValues[i];
				}
			}
		}
	}
	return returnValue;
}

function popupPageCRM(page, listener, params, title, width, height) {
	var imgobj = getElementBySrc();
	var fieldName = imgobj.getAttribute("fieldName");
	var textName = imgobj.getAttribute("textName");
	var returnValue = popupDialogCRM(page, listener, params, title, width, height, imgobj.getAttribute("subsyscode"), imgobj.getAttribute("subsysaddr"));	
	if (returnValue != null) {
		getElement(fieldName).value = returnValue.value;
		getElement(textName).value = returnValue.text;
		var paramNames = returnValue.paramNames;
		var paramValues = returnValue.paramValues;
		if (paramNames != null && paramValues != null) {
			for (var i=0; i<paramNames.length; i++) {
				var field = getElement(paramNames[i]);
				if (field == null) {
					//alert("field " + paramNames[i] + " not exist!");
				} else {
					field.value = paramValues[i];
				}
			}
		}
	}
	return returnValue;
}

function popupDialogCRM(page, listener, params, title, width, height, subsyscode, subsysaddr,isShow) {
	if (title == null) title = "弹出窗口";
	//20110816
	if(!isShow){//还是放开吧。。。。。。
	if (width == null||width>780)  width = 780;
	if (height == null||height>300) height = 300;
	}
	
	var url = "?service=page/" + page;
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
	var returnValue = openDialog(getSysAddr("custserv" + "?service=page/component.Agent&random=" + getRandomParam()), width, height, obj);
	if (returnValue != null) {
		var pageName = returnValue.$pageName;
		if (pageName != null) {
			redirectTo(pageName, returnValue.$listener, returnValue.$parameters, returnValue.$target);
		}
	}
	return returnValue;
}

/** set return obj */
function setReturnObj(obj) {
	if (Browser.isFF) {
		top.window.opener.returnValue = obj;
	} else {
		window.returnValue = obj;
	}
	top.close();
}
/**
 * set return value
 * example 1: setReturnValue('key', 'value');
 * example 2: setReturnValue('key', 'value', ['key1', 'key2'], ['value1', 'value2'])
 */
function setReturnValue(value, text, paramNames, paramValues) {
	var obj = new Object();
	obj.value = value;
	obj.text = text;
	obj.paramNames = paramNames;
	obj.paramValues = paramValues;
	setReturnObj(obj);
}
/** set return func */
function setReturnFunc(pageName, listener, parameters, target) {
	var obj = new Object();
	obj.$pageName = pageName;
	obj.$listener = listener;
	obj.$parameters = parameters;
	obj.$target = target;
	setReturnObj(obj);
}
/** popup upload dialog */
function popupUploadDialog(objname) {
	var ctlobj = getElement("UPLOAD_DIV_" + objname);
	var record = ctlobj.getAttribute("record");
	var reserved = ctlobj.getAttribute("reserved");
	var fileTotal = ctlobj.getAttribute("fileTotal");
	
	var editobj = getElement(objname);
	if (editobj.value != "" && fileTotal != null && parseInt(fileTotal) == editobj.value.split("/").length) {
		alert("上传文件数不能超过" + fileTotal + "个!");
		return false;
	}
	
	var obj = new Object();
	obj.title = "上传文件";
	obj.width = 428;
	obj.height = 190;
	obj.url = "../../../component/popups/editor/upload_attach.html";
	obj.uploadPath = ctlobj.uploadPath;
	obj.record = ctlobj.record;
	var retobj = openDialog("component/popups/editor/editor_agent.html", obj.width, obj.height, obj);
	
	if (retobj != null) {
		var filehref = record == "true" && reserved == "false" ? "attach?action=delete&file_id=" + retobj.fileId : "javascript:void(0)";
		
		var fileobj = document.createElement("SPAN");
		fileobj.innerHTML += (ctlobj.innerHTML == "" ? "" : "<br/>") + retobj.fileUrl;
		fileobj.innerHTML += "<a href='" + filehref + "' target='printframe' onclick='if (!window.confirm(\"确定删除文件么？\")) return false;hidden(parentElement, true);deleteUploadFile(\"" + objname + "\", \"" + retobj.fileId + "\");'><img src='component/images/dellzt.gif' alt='删除' width='16' height='15' border='0'/></a>";
		ctlobj.appendChild(fileobj);
		
		editobj.value += (editobj.value == "" ? "" : "/") + retobj.fileId + ":" + retobj.fileName;
	}
	
	return true;
}
/** delete upload file */
function deleteUploadFile(objname, tfileId) {
	var editstr = "";
	var editobj = getElement(objname);
	var attachs = editobj.value.split("/");
	for (var i=0; i<attachs.length; i++) {
		var attach = attachs[i];
		var fileId = attach.split(":")[0];
		var fileName = attach.split(":")[1];
		if (fileId != tfileId) {
			editstr += (editstr == "" ? "" : "/") + attach;
		}
	}
	editobj.value = editstr;
}
/** set upload field content */
function setUploadFieldContent(objname, isdelete) {
	var ctlobj = getElement("UPLOAD_DIV_" + objname);
	var editobj = getElement(objname);
	if (editobj.value == "") return;
	
	var attachs = editobj.value.split("/");
	for (var i=0; i<attachs.length; i++) {
		var attach = attachs[i];
		var fileId = attach.split(":")[0];
		var fileName = attach.split(":")[1];
		
		var fileobj = document.createElement("SPAN");
		fileobj.innerHTML += (ctlobj.innerHTML == "" ? "" : "<br/>") + getFileImage(fileName) + "<a href='attach?file_id=" + fileId + "'>" + fileName + "</a>";
		//if (isdelete != null && isdelete) fileobj.innerHTML += "<a href='attach?action=delete&file_id=" + fileId + "' target='printframe' onclick='if (!window.confirm(\"确定删除文件么？\\n注：删除后需要提交[更新|修改]操作才能生效！\")) return false;hidden(parentElement, true);deleteUploadFile(\"" + objname + "\", \"" + fileId + "\");'><img src='component/images/dellzt.gif' alt='删除' width='16' height='15' border='0'/></a>";
		ctlobj.appendChild(fileobj);
	}
}
/** get sys addr */
function getSysAddr(url, subsyscode, subsysaddr) {
	var addr = subsysaddr == null ? "" : subsysaddr;
	addr += url;

	var staffId = pagevisit.getAttribute("staffId");
	var departId = pagevisit.getAttribute("deptId");
	var subSysCode = subsyscode != null ? subsyscode : pagevisit.getAttribute("subSysCode");
	var epachyId = pagevisit.getAttribute("loginEpachyId");
	
	if (staffId != null && addr.indexOf("&%73taffId=") == -1) addr += "&staffId=" + staffId;
	if (departId != null && addr.indexOf("&%64epartId") == -1) addr += "&departId=" + departId;
	if (subSysCode != null && addr.indexOf("&%73ubSysCode=") == -1) addr += "&subSysCode=" + subSysCode;
	if (epachyId != null && addr.indexOf("&%65parchyCode=") == -1) addr += "&eparchyCode=" + epachyId;
	
	return addr;
}
/** get context name */
function getContextName() {
	var contextName = pagevisit.getAttribute("contextName");
	if (contextName == null) {
		contextName = "app";
	}
	var obj = getElementBySrc();
	if (obj != null && obj.getAttribute("subsys") != null && obj.getAttribute("subsys") != "") {
		return contextName;
	}
	for (var i=0; i<document.forms.length; i++) {
		var action = document.forms[i].action;
		if (action != null && action != "") {
			return action.substr(action.lastIndexOf("/") + 1);
		}
	}
	return contextName;
}
/** redirect to, target for example: 'custframe'、'custframe.subframe'、['custframe',parent] */
/** redirect to, target for example: 'custframe'、'custframe.subframe'、['custframe',parent] */
function redirectTo(page, listener, params, target, israw, method) {
	var subsyscode = null, subsysaddr = null, contextname = null;
	var obj = getElementBySrc();
	if (obj != null) {
		subsyscode = obj.getAttribute("subsyscode");
		subsysaddr = obj.getAttribute("subsysaddr");
		if (subsysaddr != null && !subsysaddr.endsWith("/")) {
			contextname = subsysaddr.substring(subsysaddr.lastIndexOf("/") + 1);
			subsysaddr = subsysaddr.substring(0, subsysaddr.lastIndexOf("/") + 1);
		}
	}
	if (contextname == null) contextname = getContextName();
	var url = contextname + "?service=page/" + page
	if (listener != null) url += "&listener=" + listener;
	if (params != null) url += params;
	
	redirectToByUrl(url, target, israw, subsysaddr, method);
}
/** redirect to by url */
function requestPatchURL(getFunc, postFunc, method)
{	
	if(!method || method === "GET")
	{
		getFunc();
	}
	else if(method === "POST")
	{
	    var ___fm = document.getElementById("___fm");
	    if(!___fm)
	    {
	    	___fm = document.createElement("form");
	    	___fm.method='post';
	    	___fm.id='___fm';
	    	document.body.appendChild(___fm);
	    }
	    if(postFunc(___fm))
	    {
	        
	    	___fm.submit();
	    }
	    else
	    {
	        
	    	getFunc();
	    }
	    ___fm = null;
	}
	else
	{
		throw new Error("non support rt!");
	}
}
function PostFunc(fm, target, url)
{	
	if(target && typeof target == "string")
	{
		fm.target = target;
		fm.action=url;
		return true;
	}
	return false;
	
}
//fix too long request for GET method
function redirectToByUrl(url, target, israw, subsysaddr, method) {
	var obj = getElementBySrc();
	if (israw == null || !israw) url = getSysAddr(url, obj == null ? null : obj.getAttribute("subsyscode"), subsysaddr == null ? (obj == null ? null : obj.getAttribute("subsysaddr")) : subsysaddr);
	if (target != null && target != "" && target != "contentframe" && target != "currentframe") {
		var object = getElement(target);
		if (object != null && object.tagName == "IFRAME") {
			if (document.readyState == "complete") beginPageLoading();	
			requestPatchURL(function(){object.src = url},function(fm){return PostFunc(fm, getFrame(target).name, url)}, method);
		} else {
			requestPatchURL(function(){getFrame(target).window.location.href = url},function(fm){return PostFunc(fm, getFrame(target).name, url);}, method);
		}
	} else {
		var linkobj = obj == null ? null : getElementByTag(obj, "a");
		var caption = linkobj != null ? linkobj.getAttribute("caption") : (obj == null ? null : obj.getAttribute("caption"));
		if (caption == null && linkobj != null) {
			caption = linkobj.innerHTML;
		} else if (obj != null && obj.value != null) {
			caption = obj.value;
		}
		if (caption != null) {
			if (target != "currentframe") {
				if (addNavFrame(target == null ? parent : target, url, caption)) return;
			}
		}
		if (linkobj != null) {
			linkobj.href = url;
		} else {
			location.href = url;
		}
	}
}
/** redirect to nav */
function redirectToNav(page, listener, params, target) {
	var url = getContextName() + "?service=page/" + page;	
	if (listener != null) url += "&listener=" + listener;
	if (params != null) url += params;
	
	redirectToNavByUrl(url, target);
}
/** redirect to nav by url */
function redirectToNavByUrl(url, target) {
	if (getFrame(target).location.href == "about:blank") {
		url = "&url=" + url;
		var linkobj = getElementByTag(getElementBySrc(), "a");
		if (linkobj != null) url = "&title=" + linkobj.innerHTML + url;
		url = getSysAddr(url);
		
		getFrame(target).location.href = getContextName() + "?service=page/component.Navigation&listener=opencontent" + url;
	} else {
		redirectToByUrl(url, target)
	}
}
/** redirect to jsp */
function redirectToJsp(page, params, target) {
	var url = "" + page;
	if (params != null) url = url + "?" + params;

	if (target != null && target != "") {
		getFrame(target).window.location.href = url;
	} else {
		var linkobj = getElementByTag(getElementBySrc(), "a");
		if (linkobj != null) {
			linkobj.href = url;
		} else {
			location.href = url;
		}
	}
}
/** redirect to extscr by url */
function redirectToExtscrByUrl(url) {
	var menuframe = getFrame("menuframe");
	if (menuframe == null) {
		alert("未检测到双屏控制开关！");
		return;
	}
	var dboutwin = null, dboutdoc = null;
	var dbctrlwin = menuframe.getDbctrlWin();
	if (dbctrlwin == null) {
		alert("需要先开启双屏控制页面，确认开启双屏控制吗？");
		menuframe.turnOnDbdisplay(url);
		return;
	}
	
	try {
		dboutwin = dbctrlwin.dboutwin;
		dboutdoc = dboutwin.document;
	} catch (e) {
	}
	
	if (dboutwin == null || dboutdoc == null) {
		alert("请先开启外屏页面");
		return;
	}
	
	dboutwin.location.href = url;
}
/** redirect to extscr */
function redirectToExtscr(page, listener, params) {
	var url = getContextName() + "?service=page/" + page;
	if (listener != null) url += "&listener=" + listener;
	if (params != null) url += params;
	url = getSysAddr(url);
	if (url.indexOf("&%72andom=") == -1) url += "&random=" + getRandomParam();
	
	redirectToExtscrByUrl(url);
}
/** click tabpane */
function clickTabPane(target, page, listener, params, isreload) {
	var frame = getElement(target);
	if (frame.src == null || frame.src == "" || isreload != null && isreload) {
		var parameters = frame.getAttribute("parameters") + (params ? params : "");
		redirectTo(page, listener, parameters, frame.name);
	}
}
/** cancle */
function cancel(iswin) {
	return iswin != null && iswin ? top.close() : history.back();
}
/** get page visit */
function getPageVisit() {
	var pagevisit = getElement("pagecontext");
	if (pagevisit == null) {
		alert("component Head not exist!");
	}
	return pagevisit;
}
/** has priv */
function hasPriv(privcode) {
	if (pagevisit.getAttribute("staffId") == "SUPERUSR") return true; 
	var result = pagevisit.attributes[privcode];
	return result != null && result.value == privcode;
}
/** get version */
function getVersion() {
	return pagevisit.getAttribute("version");
}
/** is prov */
function isProv(provinceId) {
	return pagevisit.getAttribute("provinceId") == provinceId;
}
/** check page size */
function checkPageSize(obj) {
	if (!checkText(obj, "每页记录数")) return false;
	if (!checkNature(obj, "每页记录数")) return false;
	if (parseInt(obj.value) > parseInt(obj.getAttribute("maxpagesize"))) {
		alert("每页记录数不能大于" + obj.getAttribute("maxpagesize") + "条！");
		obj.focus();
		return false;
	}
	
	var sizes = getElements(obj.name);
	for (var i=0; i<sizes.length; i++) {
		sizes[i].value = obj.value;
	}
	
	return true;
}
/** check page change */
function checkPageChange(obj) {
	var changeInput = getChildElement(obj.parentElement, "input", "changePage");
	if (!checkText(changeInput, "跳转页数")) return false;
	if (!checkNature(changeInput, "跳转页数")) return false;
	if (parseInt(changeInput.value) > parseInt(changeInput.getAttribute("maxsize"))) {
		alert("跳转页数不能大于总页数" + changeInput.getAttribute("maxsize") + "页！");
		changeInput.focus();
		return false;
	}
	
	obj.currPageValue = changeInput.value;
	
	return true;
}
/** before pagination */
function beforePagination(obj) {
	var param = "&" + obj.getAttribute("currPageName") + "=" + obj.getAttribute("currPageValue");
	param += "&" + obj.getAttribute("currPageName") + "_count=" + obj.getAttribute("rowCount");
	if (obj.getAttribute("needCount") != null) {
		param += "&" + obj.getAttribute("currPageName") + "_needCount=" + obj.getAttribute("needCount");
	}
	if (obj.getAttribute("checkboxName") != null && obj.getAttribute("checkboxName") != "") {
		var checkboxNames = obj.getAttribute("checkboxName").split(",");
		for (var i=0; i<checkboxNames.length; i++) {
			var boxname = obj.getAttribute("currPageName") + "_" + checkboxNames[i];
			var boxobj = getElement(boxname);
			if (boxobj == null) {
				boxobj = document.createElement("INPUT");
				boxobj.name = boxname;
				boxobj.type = "hidden";
				boxobj.value = getCheckedBoxStr(checkboxNames[i], "!");
				obj.parentElement.appendChild(boxobj);
			}
			//param += "&" + obj.getAttribute("currPageName") + "_" + obj.getAttribute("checkboxName") + "=" + getCheckedBoxStr(obj.getAttribute("checkboxName"), "!");	
		}
	}
	obj.jsparam = param;
}
/** after pagination */
function afterPagination(paginName, checkboxName) {
	if (checkboxName == null || checkboxName == "" || checkboxName == "null") return;
	
	var checkboxNames = checkboxName.split(",");
	for (var i=0; i<checkboxNames.length; i++) {	
		var boxList = getElements(checkboxNames[i]);
	
		var transfer = new Array;
		for (var j=0; j<boxList.length; j++) {
			var boxValue = boxList[j].value;
			if (boxList[j].getAttribute("flag") == "temp" && boxList[j].checked) {
				transfer[boxValue] = boxValue;
			}
		}
	
		var current = new Array;
		for (var j=0; j<boxList.length; j++) {
			var boxValue = boxList[j].value;
			if (transfer[boxValue] != null) {
				if (boxList[j].getAttribute("flag") != "temp") {
					boxList[j].checked = true;
					current[boxValue] = boxValue;
				}
			}
		}
	
		for (var j=0; j<boxList.length; j++) {
			var boxValue = boxList[j].value;
			if (boxList[j].getAttribute("flag") == "temp" && current[boxValue] != null) {
				boxList[j].checked = false;
			}
		}
	
		var boxobj = getElement(paginName + "_" + checkboxNames[i]);
		if (boxobj != null) boxobj.value = "";
	}
}
/** move */
function move(source_name, target_name, isall) {
	var options = new Array();
	var source = getElement(source_name);
	var target = getElement(target_name);
	for (var i=source.length-1; i>=0; i--) {
		var option = source.options[i];
		if (option.selected || isall != null && isall) {
			options[options.length] = option;
			source.remove(i);
		}
	}
	for (var i=options.length-1; i>=0; i--) {
		var option = options[i];
		if (!containKey(target.options, option.value)) target.add(new Option(option.text, option.value));
	}
}
/** sort */
function sort(name, mode) {
	var select = getElement(name);
	var selectedIndex = select.selectedIndex;;
	if (selectedIndex == -1) return;
	
	var option = select.options[selectedIndex];
	select.remove(selectedIndex);
	if (mode == "down" && selectedIndex < select.length) {
		selectedIndex = selectedIndex + 1;
	}
	if (mode == "up" && selectedIndex > 0) {
		selectedIndex = selectedIndex - 1;
	}
	select.add(new Option(option.text, option.value), selectedIndex);
	select.selectedIndex = selectedIndex;
}
/** flip mouse on */
function flipMouseOn(obj, name, mode) {
	if (mode == "up") {
		obj.className = "up";
	}
	if (mode == "down") {
		obj.className = "down";
	}
	return true;
}
/** flip mouse down */
function flipMouseDown(obj, name, mode) {
	if (mode == "up") {
		obj.className = "up on";
		if (!flipTrigger(name, "up")) return false;
	}
	if (mode == "down") {
		obj.className = "down on";
		if (!flipTrigger(name, "down")) return false;
	}
	return true;
}
/** flip key down */
function flipKeyDown(name) {
	if (window.event.keyCode == 38) {
		if (!flipTrigger(name, "up")) return false;
	}
	if (window.event.keyCode == 40) {
		if (!flipTrigger(name, "down")) return false;
	}
	return true;
}
/** flip trigger */
function flipTrigger(name, mode) {
	var field = getElement(name);
	var fieldValue = field.value;
	var fieldDesc = field.getAttribute("desc");
	if (!checkText(field, fieldDesc)) return false;
	if (!checkInteger(field, fieldDesc)) return false;
	
	var minValue = field.getAttribute("min");
	var maxValue = field.getAttribute("max");
	var degreeValue = field.getAttribute("degree");
	if (mode == "up") {
		if (maxValue == null || parseInt(fieldValue) + parseInt(degreeValue) <= parseInt(maxValue)) {
			field.value = parseInt(fieldValue) + parseInt(degreeValue);
		}
	}
	if (mode == "down") {
		if (minValue == null || parseInt(fieldValue) - parseInt(degreeValue) >= parseInt(minValue)) {
			field.value = parseInt(fieldValue) - parseInt(degreeValue);
		}
	}
	return true;
}
/** get str by pad prefix */
function getStrByPadPrefix(len, max) {
	if (max == null) max = 4; 
	var str = len.toString();
	for (var i=0; i<max - len.toString().length; i++) {
		str = "0" + str;
	}
	return str;
}
/** get str by pad length */
function getStrByPadLength(value, encode) {
	var length = encode != null && encode == true ? getLength(value) : value.length;
	return getStrByPadPrefix(length) + value;
}
/** get array by encode str */
function getArrayByEncodeStr(encodename, encodestr) {
	var celllen = parseInt(encodestr.substring(0, 4), 10);
	var rowlen = parseInt(encodestr.substring(4, 8), 10);
	var content = encodestr.substring(8);

	var array = new Array();
	for (var i=0; i<rowlen; i++) {
		array[i] = new Array();
		for (var j=0; j<encodename.length; j++) {
			var namelen = parseInt(content.substring(0, 4), 10);
			content = content.substring(4);
			
			var value = content.substring(0, namelen);
			content = content.substring(namelen);
			
			array[i][encodename[j]] = value;
		}
	}
	return array;
}
/** encode criteria(column: NAME,DESC,VALUE,TEXT) */
function encodeCriteria(theForm) {
	var str = "";
	var count = 0;
	
	for (var i=0; i<theForm.elements.length; i++) {
		var element = theForm.elements[i];
		var name = element.name;
		var desc = element.getAttribute("desc");
		var value = element.value;
		var text = element.value;	
		var isvalid = false;
		
		if (element.tagName == "INPUT" || element.tagName == "SELECT" || element.tagName == "TEXTAREA") {
			if (name == null || desc == null || value == null) {
				continue;
			}
			else if (element.type.toUpperCase() == "TEXT") {
				//if (/^(POP_.*)$/.test(name)) continue;
				if (value == "") continue;
				if (element.getAttribute("fieldName") != null && getElement(element.getAttribute("fieldName")) != null) {
					continue;
				}
				isvalid = true;
			}
			else if (element.type.toUpperCase() == "HIDDEN") {
				if (element.getAttribute("textName") != null) {
					var popfield = getElement(element.getAttribute("textName"));
					if (popfield != null) text = popfield.value;
				}
				if (value == "" && text == "") continue;
				isvalid = true;
			}
			else if (element.tagName == "SELECT") {
				if (value == "") continue;
				text = element.options[element.selectedIndex].text;
				isvalid = true;
			}
			else if (element.tagName == "TEXTAREA") {
				if (value == "") continue;
				isvalid = true;
			}
			else if (element.type.toUpperCase() == "CHECKBOX"){
				if(!element.checked) continue;
				isvalid = true;
			}
			else if(element.type.toUpperCase() == "RADIO"){
				if(!element.checked) continue;
				isvalid = true;
			}
			
			if (isvalid) {
				count ++;
				str += getStrByPadLength(name) + getStrByPadLength(desc) + getStrByPadLength(value) + getStrByPadLength(text);
			}
		}
	}
	
	setReturnObj(getStrByPadPrefix(4) + getStrByPadPrefix(count) + str);
}
/** encode criteria export(column: NAME,DESC,VALUE,TEXT) */
function encodeCriteriaExport(cond_group) {
	var str = "";
	var count = 0;
	
	for (var i=0; i<document.forms.length; i++) {
		var theForm = document.forms[i];
		for (var j=0; j<theForm.elements.length; j++) {
			var element = theForm.elements[j];
			var name = element.name;
			var desc = element.getAttribute("desc") == null ? "FIELD_DESC" : element.getAttribute("desc");
			var value = element.value;
			var text = element.value;
			var isvalid = false;
			
			if (element.tagName == "INPUT" || element.tagName == "SELECT" || element.tagName == "TEXTAREA") {
				if (cond_group != null && !name.startsWith(cond_group)) {
					continue;
				}
				if (name == null || desc == null || value == null) {
					continue;
				}
				
				if (element.type.toUpperCase() == "TEXT") {
					//if (/^(POP_.*)$/.test(name)) continue;
					if (value == "") continue;
					if (element.getAttribute("fieldName") != null && getElement(element.getAttribute("fieldName")) != null) {
						continue;
					}
					isvalid = true;
				}
				if (element.type.toUpperCase() == "HIDDEN") {
					if (element.getAttribute("textName") != null) {
						var popfield = getElement(element.getAttribute("textName"));
						if (popfield != null) text = popfield.value;
					}
					if (value == "" && text == "") continue;
					isvalid = true;
				}
				if (element.tagName == "SELECT") {
					if (value == "") continue;
					text = element.options[element.selectedIndex].text;
					isvalid = true;
				}
				if (element.tagName == "TEXTAREA") {
					if (value == "") continue;
					isvalid = true;
				}
				
				if (isvalid) {
					count ++;
					str += getStrByPadLength(name) + getStrByPadLength(desc) + getStrByPadLength(value) + getStrByPadLength(text);
				}
			}
		}
	}
	
	return getStrByPadPrefix(4) + getStrByPadPrefix(count) + str;
}
/** decode criteria */
function decodeCriteria(encodestr) {
	var condition = getElement("CRIT_CONDITION");
	var encodename = ["NAME","DESC","VALUE","TEXT"];
	
	condition.innerHTML = "";
	
	var urlstr = "", descstr = "";
	var array = getArrayByEncodeStr(encodename, encodestr);
	for (var i=0; i<array.length; i++) {
		var name = array[i]["NAME"];
		var desc = array[i]["DESC"];
		var value = array[i]["VALUE"];
		var text = array[i]["TEXT"];
		
		if (getElement(name) == null) {
			var element = document.createElement("INPUT");
			element.type = "hidden";
			element.name = name;
			element.value = value;
			condition.appendChild(element);
		}
		
		urlstr += "&" + name + "=" + value;
		
		descstr += desc + "=" + text + (i != array.length - 1 ? ", " : "");
	}
	
	return { "URL" : urlstr, "DESC" : descstr };
}
/** decode criteria export */
function decodeCriteriaExport(encodestr) {
	var encodename = ["NAME","DESC","VALUE","TEXT"];
	
	var urlstr = "", descstr = "";
	var array = getArrayByEncodeStr(encodename, encodestr);
	for (var i=0; i<array.length; i++) {
		var name = array[i]["NAME"];
		var desc = array[i]["DESC"];
		var value = array[i]["VALUE"];
		var text = array[i]["TEXT"];
		
		if (getElement(name) == null) {
			var element = document.createElement("INPUT");
			element.type = "hidden";
			element.name = name;
			element.value = value;
		}
		
		urlstr += "&" + name + "=" + value;
		
		descstr += desc + "=" + text + (i != array.length - 1 ? ", " : "");
	}
	
	return { "URL" : urlstr, "DESC" : descstr };
}
/** view criteria */
function viewCriteria(title, encodestr) {
	var datas = decodeCriteria(encodestr);
	
	getElement("CRIT_NAME").value = title;
	getElement("CRIT_REMARK").value = encodestr;
	getElement("QUERY_DESC").value = datas["DESC"];
	
	getElement("CriteriaPane").style.display = "none";
}
/* config criteria */
function configCriteria(obj) {
	var ret = popupDialog(obj.getAttribute("param2"), obj.getAttribute("param3"), "&EXEC_CONDITION=" + getElementValue("CRIT_REMARK") + obj.getAttribute("parameters"), obj.getAttribute("param1"), obj.getAttribute("param4"), obj.getAttribute("param5"));
	if (ret == null) return;

	var datas = decodeCriteria(ret);
	
	getElement("CRIT_NAME").value = "请输入方案名称...";
	getElement("CRIT_REMARK").value = ret;
	getElement("QUERY_DESC").value = datas["DESC"];
	
	getElement("CriteriaPane").style.display = "none";
}
/** create criteria */
function createCriteria(obj) {
	var crit_name = getElement("CRIT_NAME");
	var query_desc = getElement("QUERY_DESC");
	var crit_remark = getElement("CRIT_REMARK");
	
	if (query_desc.value == "" && obj.getAttribute("open") != "true") {
		alert("请先配置需保存的定制方案！");
		crit_name.focus();
		return false;
	}
	if (crit_name.value == "" || crit_name.value == "请选择定制方案..." || crit_name.value == "请输入方案名称...") {
		alert("请输入需保存的自定义方案名称！");
		crit_name.focus();
		return false;
	}
	if (!checkMaxLength(crit_name, 200, "方案名称")) return false;
	if (!confirmInfo(obj, "确定保存为定制方案么？")) return false;
	
	var params = "&CRIT_CLASS=" + obj.getAttribute("crit_class") + "&CRIT_NAME=" + crit_name.value + "&CRIT_REMARK=" + crit_remark.value;
	ajaxDirect(this, "createCriteria", params, "CriteriaPart");
	this.afterAction = "alert('定制方案保存成功！');";	
	
	return true;
}
/* criteria export */
function criteriaExport(obj) {
	var encodestr = "", decodedatas, oper_mode;
	
	var obj = getElementBySrc();
	
	var query_desc = getElement("QUERY_DESC");
	if (query_desc != null) {
		encodestr = encodeCriteriaExport(obj.getAttribute("conditionGroup"));
		decodedatas = decodeCriteriaExport(encodestr);
	} else {
		if (query_desc.value == "" && obj.getAttribute("open") != "true") {
			alert("请选择已有方案或配置新方案进行导出！");
			focus(query_desc);
			return false;
		}
		encodestr = getElementValue("CRIT_REMARK");
		decodedatas = decodeCriteria(encodestr);
		oper_mode = obj.getAttribute("critClass");
	}
	
	var exec_condition = encodestr;
	var crit_desc = decodedatas["DESC"];
	var exec_url = decodedatas["URL"];

	var hasPrivSimpexp = hasPriv("COM_SIMPLEEXP_" + obj.getAttribute("critClass"));
	var hasPrivCritexp = hasPriv("COM_CRITERIAEXP_" + obj.getAttribute("critClass"));
	if (!hasPrivSimpexp && !hasPrivCritexp) {
		alert("您没有批量导出权限，无法继续操作！\n如果需要操作此功能，请与管理人员联系！");
		return false;
	}
	
	var confirmExport = null;
	if (hasPrivSimpexp && hasPrivCritexp) {
		confirmExport = window.confirm("是否执行定时导出？\n按【确定】执行定时导出\n按【取消】可以取消操作或执行即时导出");
	}
	var hasCritexp = confirmExport == null && hasPrivCritexp || confirmExport != null && confirmExport && hasPrivCritexp;
	var hasSimpexp = confirmExport == null && hasPrivSimpexp || confirmExport != null && !confirmExport && hasPrivSimpexp;
	if (hasCritexp) {
		if (obj.getAttribute("exportConfigPath") == "") {
			alert("定时导出事件未指定！");
			return false;
		}
		if (obj.getAttribute("exportConfigFile") == "") {
			alert("定时导出配置文件未指定！");
			return false;
		}
		var params = "&CRIT_CLASS=" + obj.getAttribute("critClass") + "&EXEC_PATH=" + obj.getAttribute("exportConfigPath") + "&CONFIG_FILE=" + obj.getAttribute("exportConfigFile") + "&EXEC_CONDITION=" + exec_condition + "&EXEC_GROUP=" + obj.getAttribute("conditionGroup") + "&CRIT_DESC=" + crit_desc + "&NEED_LOG=" + obj.getAttribute("needLog");
		popupDialog('component.query.ExportConfig', 'inputCriteriaExec', params, '定时导出配置', 600, 400);
	}
	if (hasSimpexp) {
		var exportSimplePath = obj.getAttribute("exportSimplePath");
		if (exportSimplePath == "") {
			alert("即时导出事件未配置！");
			return false;
		}
		if (!exportFile(exportSimplePath.split("@")[0], exportSimplePath.split("@")[1], exec_url, obj.getAttribute("critClass"), null, oper_mode)) return false;
	}
	return true;
}
/** criteria query */
function criteriaQuery(obj) {
	var query_desc = getElement("QUERY_DESC");
	if (query_desc.value == "" && obj.getAttribute("open") != "true") {
		alert("请选择已有方案或配置新方案进行查询！");
		query_desc.focus();
		return false;
	}
	return true;
}
/** export file */
function exportFile(page, listener, params, privcode, info, oper_mod) {
	if (privcode != null && !hasPriv("COM_SIMPLEEXP_" + privcode)) {
		alert("您没有批量导出权限，无法继续操作！\n如果需要操作此功能，请与管理人员联系！");
		return false;
	}
	var result = window.confirm(info == null ? "确定导出吗？" : info);
	if (!result) return false;
	try {
		beginPageLoading();
		if (oper_mod != null && getVersion() != "BOSS15") {
			redirectTo(page, "createQryLog", "&CRIT_CLASS=" + oper_mod + "&OPER_TYPE=EXP&CRIT_DESC=" + getElementValue("QUERY_DESC"), "qryframe");
		}
		var exportResult = redirectTo(page, listener, params, "printframe");
		setTimeout("endPageLoading()", 6000);
		return exportResult;
	} catch (e) {
		alert("导出发生异常，您的浏览器版本过低或浏览器安全设置过高，导致点击一次导出并保存文件后，如果不刷新或重新打开该页面而再次点击导出将使导出无法执行\n如果要解决此问题，有以下三种方式：\n1、升级浏览器版本\n2、导出并保存文件后重新打开或刷新该页面\n3、导出文件时不要直接保存文件，而是选择打开文件，然后在打开的文件中保存文件");
	}
	return true;
}
/** switch nav frame */
function switchNavFrame(target, navmenuid) {
	var navframeset = target.document.getElementById("navframeset");
	if (navframeset == null) return;
	
	var navmenus = target.menuframe.document.getElementById("navmenus");
	if (navmenus.childNodes.length == 0) return;
	var navmenu = navmenuid == null ? navmenus.childNodes[0] : target.menuframe.document.getElementById(navmenuid);
	
	var navframeid = navmenu.getAttribute("relaframe");
	var navframeidx = navframeid.substring("navframe_".length);
	var navarray = navframeset.cols.split(",");
	
	var navcols = "";
	for (var i=0; i<navarray.length; i++) {
		navcols += (i == navframeidx) ? "*" : "0";
		if (i != navarray.length - 1) navcols += ",";
	}
	navframeset.cols = navcols;

	var navfoucs = false;
	for (var i=0; i<navmenus.childNodes.length; i++) {
		var menu = navmenus.childNodes[i];
		if (!navfoucs && menu.id == navmenu.id) {
			menu.className = "open";
			navfoucs = true;
		} else {
			menu.className = "";
		}
	}
}
/** get nav frame */
function getNavFrame(target, menuidx) {
	var navframe = target.frames["navframe_" + menuidx];
	
	if (navframe != null && navframe.location.href == "about:blank" && target.menuframe.document.getElementById(navframe.name + "_close") == null) {
		return navframe;
	}
	
	for (var i=0; i<target.frames.length; i++) {
		var frame = target.frames[i];
		if (!frame.name.startsWith("navframe_")) continue;
		if (frame.location.href == "about:blank" && target.menuframe.document.getElementById(frame.name + "_close") == null) {
			return frame;
		}
	}
	
	return null;
}
/** add nav frame */
function addNavFrame(target, url, title) {
	if (target == "contentframe") {
		target = getFrame("contentframe");
		if (target == null) target = top;
	}
	if (target.menuframe == null) return false;
	
	var navmenus = target.menuframe.document.getElementById("navmenus");
	var navmenuidx = target.menuframe.NAV_MENU_CURSOR ++;
	var navmenuid = "navmenu_" + navmenuidx;;
	
	var navframe = getNavFrame(target, navmenuidx);
	if (navframe == null) {
		alert("打开页面数已超过最大限制，请先关闭部分页面后再操作！");
		return true;
	}
	
	var closeNavMethod = "closeOnEsc", searchKeyWord = "&closeNavMethod=";
	if (url.indexOf(searchKeyWord) != -1) {
		closeNavMethod = url.substring(url.indexOf(searchKeyWord) + searchKeyWord.length);
		if (closeNavMethod.indexOf("&") != -1) closeNavMethod = closeNavMethod.substring(0, closeNavMethod.indexOf("&"));
	}
	
	var targetsrc = getReduceUrl(url);
	var framesrc = null;
	for (var i=0; i<navmenus.childNodes.length; i++) {
		var menu = navmenus.childNodes[i];
		var frameid = menu.getAttribute("relaframe");
		var frame = target.frames[frameid];
		try{framesrc=frame.location.href}catch(ex){framesrc=frame.src;}
		var framesrc = getReduceUrl(framesrc);
		if (framesrc == targetsrc) {
			switchNavFrame(target, menu.id);
			target.menuframe.document.getElementById(frameid + "_loading").className = "loading";
			frame.location.href = url;
			return true;
		}
		framesrc = null;
	}
	
	var navframeid = navframe.name;
	
	var navmenucont = "<a href=\"javascript:void(0)\" class=\"li\" title=\"" + title + "\" onclick=\"switchNavFrame(parent, '" + navmenuid + "');\" ondblclick=\"return closeNavFrame(parent, '" + navmenuid + "', '" + closeNavMethod + "');\"><span class=\"left\"></span><span class=\"text\"><span id=\"" + navframeid + "_loading\" class=\"loading\">" + getPartStr(title, 20) + "</span></span><span class=\"right\"></span></a>";
	navmenucont += "<a href=\"javascript:void(0)\" class=\"closeTab\" id=\"" + navframeid + "_close\" onclick=\"return closeNavFrame(parent, '" + navmenuid + "', '" + closeNavMethod + "');\"/></a>";
	
	var navmenu = target.menuframe.document.createElement("LI");
	navmenu.className = "open";
	navmenu.id = navmenuid;
	navmenu.setAttribute("relaframe", navframeid);
	navmenu.innerHTML = navmenucont;
	navmenus.appendChild(navmenu);
	
	switchNavFrame(target, navmenuid);
	
	navframe.location.href = url;
	
	return true;
}
/** close nav frame */
function closeNavFrame(target, navmenuid, closeNavMethod) {
	var navmenu = target.menuframe.document.getElementById(navmenuid);
	if (navmenu == null) return false;
	
	if (target.menuframe.HOLD_FIRST_PAGE && navmenuid.substring("navmenu_".length) == "0") {
		alert("不能关闭主页面！");
		return false;
	}
	
	var prenavmenuid = null;
	var navmenus = target.menuframe.document.getElementById("navmenus").childNodes;
	for (var i=0; i<navmenus.length; i++) {
		if (i > 0 && navmenus[i].id == navmenuid) {
			prenavmenuid = navmenus[i - 1].id;
			break;
		}
	}
	
	var navframeid = navmenu.getAttribute("relaframe");
	var navframe = target.frames[navframeid];
	if (navframe == null) return false;
	
	//if (!window.confirm("确定关闭该页面么？")) return false;
	
	//invoke frame close nav method
	if (closeNavMethod != null) {
		try {
			eval('navframe.' + closeNavMethod + '()');
		} catch (e) {
		}
	}
	
	navmenu.removeNode(true);
	
	switchNavFrame(target, prenavmenuid);
	
	navframe.location.href = "about:blank";
	
	return true;
}
/** get active nav menu */
function getActiveNavMenu(target) {
	var navframeset = target.document.getElementById("navframeset");
	if (navframeset == null) return null;
	
	var navmenus = target.menuframe.document.getElementById("navmenus");
	if (navmenus.childNodes.length == 0) return null;
	
	for (var i=0; i<navmenus.childNodes.length; i++) {
		var menu = navmenus.childNodes[i];
		if (menu.className == "open") return menu;
	}
	
	return null;
}
/** hold first nav frame,for example:holdFirstNavFrame("contentframe", true); redirectTo...*/
function holdFirstNavFrame(target, ishold) {
	getFrame(target).menuframe.HOLD_FIRST_PAGE = ishold;
}
/** get nav frame by location */
function getNavFrameByLocation() {
	if (parent.document.getElementById("navframeset") != null) {
		var targetsrc = getReduceUrl(location.href);
		var frames = parent.frames;
		var framesrc = null;
		for (var i=0; i<frames.length; i++) {
			try{framesrc = frames[i].location.href;}catch(ex){framesrc=frames[i].src;}
			if (framesrc != null && framesrc != "about:blank") {
				framesrc = getReduceUrl(framesrc);
				if (targetsrc == framesrc) {
					return frames[i];
				}
			}
			framesrc = null;
		}
	}
	return null;
}
/** close nav frame by location */
function closeNavFrameByLocation() {
	var navmenu = getActiveNavMenu(parent);
	if (navmenu != null) {
		var navframeid = navmenu.getAttribute("relaframe");
		if (navframeid != null) {
			var tabclose = parent.menuframe.document.getElementById(navframeid + "_close")
			if (tabclose != null) tabclose.click();
		}
	}
}
/** set nav title */
function setNavTitle(title) {
	var navframe = getNavFrameByLocation();
	if (navframe != null) {
		var tabload = parent.menuframe.document.getElementById(navframe.name + "_loading");
		if (tabload != null && title != null) {
			tabload.innerHTML = title;
		}
	}
}
/** is same domain */
function isSameDomain(target) {
	try {
		return target.document.domain == document.domain;
	} catch (e) {
		return false;
	}
}
/** complete page load */
function completePageLoad() {
	document.onreadystatechange = function() {
		if (document.readyState == "complete") {
           
            //added by zhangxiaoping当输入框和选择框获取焦点后背景颜色变成柠檬黄，失去焦点后回复到之前的样式		    
		   // focusInput('orangebg','txt'); 
		   // focusSelect('orangebg', 'sel');
		   // focusTextarea('orangebg', 'textarea');  		
		
			if (isSameDomain(parent)) {
				if (parent.document.getElementById("navframeset") != null) {
					var navframe = getNavFrameByLocation();
					if (navframe != null) {
						var tabload = parent.menuframe.document.getElementById(navframe.name + "_loading");
						if (tabload != null) tabload.className = "";
					}
				} else if (parent.document.getElementById("flowbody") != null) {
					if (self.name != "flowtab" && self.name != "flowsubmit" && self.name != "flowleft" && self.name != "flowright") {
						getFrame(["flowtab", parent]).pageflow.endFlowLoading();
					}
				} else {
					if (parent.Browser != null) parent.endPageLoading();
				}
			}
		}
	}
}
/** get reduce url */
function getReduceUrl(url) {
	if (url != null && url.indexOf("?") != -1) {
		url = url.substr(url.indexOf("?") + 1);
	}
	return url;
}
/*cust troop popupDialog*/
function popTroop(param) {
	popupDialog('troop.Troop', 'queryTroops', '&SERIAL_NUMBER='+getElementValue(param), '客户群选择', '600', '400');
}

function updateFrameTitle(s) {
	if (top.setFrameTitle) {
		top.setFrameTitle(s ? s : document.title);
	}
}
/* open menu */
function openmenu(url) {
	if (!url) return false;
	if (url.lastIndexOf("&url=") != -1) {
		url = url.substr(url.lastIndexOf("&url=") + 5);
	}
	redirectToNavByUrl(url, "contentframe");
}

/* get absolute pos */
function getAbsolutePos(el) {
	var r = { x: el.offsetLeft, y: el.offsetTop };
	if (el.offsetParent) {
		var tmp = getAbsolutePos(el.offsetParent);
		r.x += tmp.x;
		r.y += tmp.y;
	}
	return r;
}
/* show ground */
function showGround(obj) {
	if (!obj || !obj.currentStyle || !(obj.currentStyle.position == 'absolute' || obj.currentStyle.position == 'relative')) return;
	var ground = obj.background;
	if (!ground) {
		ground = document.createElement("<iframe src='about:blank' style='position:absolute; left:0px; top:0px; width:0px; height:0px; display:none' scrolling='no' frameborder='0'></iframe>");
		document.body.insertAdjacentElement("beforeEnd", ground);
		obj.background = ground;
	}
	var pos = getAbsolutePos(obj);
	with(ground.style) {
		left = pos.x;
		top = pos.y;
		width = obj.offsetWidth + "px";
		height = obj.offsetHeight + "px";
		zIndex = "9998";
		display = 'block';
	}
	obj.style.zIndex = "9999";
}
/* hide ground */
function hideGround(obj) {
	var ground = obj.background;
	if (!ground) return;
	ground.parentNode.removeChild(ground);
	obj.background = null;
}
/* alter relative */
function alterRelative() {
	var allElement = document.getElementsByTagName('div');
	for (var i = 0; i < allElement.length; i++) {
		if (allElement[i].currentStyle.position == "relative") {
			allElement[i].getAttribute("_position") = "relative";
			allElement[i].runtimeStyle.position = "static";
		}
	}
}
/* resume relative */
function resumeRelative() {
	var allElement = document.getElementsByTagName('div');
	for (var i = 0; i < allElement.length; i++) {
		if (allElement[i].getAttribute("_position") == "relative") {
			allElement[i].runtimeStyle.position = "";
			allElement[i].setAttribute("_position", null);
		}
	}
}
/** to chinese money */
function toChineseMoney(money) {
	if (money == null) return null;
	money = new String(money);
	for (var i=money.length-1; i>=0; i--) {
		money = money.replace(",", "");
		money = money.replace(" ", "");
 	}
	money = money.replace("￥", "");
	if (isNaN(money)) {
		alert("请检查小写金额是否正确");
		return;
	}
	var prefix = money.startsWith("-") ? "负" : "";
	money = money.replace("-", "");
	var part = money.split(".");
	var newchar = "";
	for (var i=part[0].length-1; i>=0; i--) {
		if (part[0].length > 10){
			alert("位数过大，无法计算");
			return;
		}
		var tmpnewchar = "";
		perchar = part[0].charAt(i);
		switch (perchar) {
		    case "0": tmpnewchar = "零" + tmpnewchar; break;
		    case "1": tmpnewchar = "壹" + tmpnewchar; break;
		    case "2": tmpnewchar = "贰" + tmpnewchar; break;
		    case "3": tmpnewchar = "叁" + tmpnewchar; break;
		    case "4": tmpnewchar = "肆" + tmpnewchar; break;
		    case "5": tmpnewchar = "伍" + tmpnewchar; break;
		    case "6": tmpnewchar = "陆" + tmpnewchar; break;
		    case "7": tmpnewchar = "柒" + tmpnewchar; break;
		    case "8": tmpnewchar = "捌" + tmpnewchar; break;
		    case "9": tmpnewchar = "玖" + tmpnewchar; break;
 		}
		switch (part[0].length - i - 1) {
		    case 0: tmpnewchar = tmpnewchar + "元"; break;
		    case 1: if (perchar != 0) tmpnewchar = tmpnewchar + "拾"; break;
		    case 2: if (perchar != 0) tmpnewchar = tmpnewchar + "佰"; break;
		    case 3: if (perchar != 0) tmpnewchar = tmpnewchar + "仟"; break;
		    case 4: tmpnewchar = tmpnewchar + "万"; break;
		    case 5: if (perchar != 0) tmpnewchar = tmpnewchar + "拾"; break;
			case 6: if (perchar != 0) tmpnewchar = tmpnewchar + "佰"; break;
			case 7: if (perchar != 0) tmpnewchar = tmpnewchar + "仟"; break;
			case 8: tmpnewchar = tmpnewchar + "亿"; break;
			case 9: tmpnewchar = tmpnewchar + "拾"; break;
		}
		newchar = tmpnewchar + newchar;
	}
	if (money.indexOf(".") != -1) {
		if (part[1].length > 2) {
			alert("小数点之后只能保留两位,系统将自动截断");
			part[1] = part[1].substr(0, 2);
		}
		for (var i=0; i<part[1].length; i++) {
			var tmpnewchar = "";
			var perchar = part[1].charAt(i);
			switch (perchar) {
				case "0": tmpnewchar = "零" + tmpnewchar; break;
				case "1": tmpnewchar = "壹" + tmpnewchar; break;
				case "2": tmpnewchar = "贰" + tmpnewchar; break;
				case "3": tmpnewchar = "叁" + tmpnewchar; break;
			    case "4": tmpnewchar = "肆" + tmpnewchar; break;
			    case "5": tmpnewchar = "伍" + tmpnewchar; break;
			    case "6": tmpnewchar = "陆" + tmpnewchar; break;
			    case "7": tmpnewchar = "柒" + tmpnewchar; break;
			    case "8": tmpnewchar = "捌" + tmpnewchar; break;
			    case "9": tmpnewchar = "玖" + tmpnewchar; break;
			}
			if (i == 0) tmpnewchar = tmpnewchar + "角";
	 		if (i == 1) {
				tmpnewchar = (part[1].charAt(0) == "0" ? "零" : "") + tmpnewchar + "分";
			}
			newchar = newchar + tmpnewchar;
		}
	}
	
	while (newchar.search("零零") != -1) newchar = newchar.replace("零零", "零");
	newchar = newchar.replace("零亿", "亿");
	newchar = newchar.replace("亿万", "亿");
	newchar = newchar.replace("零万", "万");
	if (!newchar.startsWith("零元")) newchar = newchar.replace("零元", "元");
	newchar = newchar.replace("零角", "");
	newchar = newchar.replace("零分", "");
	if (newchar.charAt(newchar.length - 1) == "元" || newchar.charAt(newchar.length - 1) == "角")
		newchar = newchar + "整";
	return prefix + newchar;
}
/* add class */
function addClass(el, className) {
	removeClass(el, className);
	el.className += " " + className;
}
/* remove class */
function removeClass(el, className) {
	if (!(el && el.className)) {
		return;
	}
	var cls = el.className.split(" ");
	var ar = new Array();
	for (var i = cls.length; i > 0;) {
		if (cls[--i] != className) {
			ar[ar.length] = cls[i];
		}
	}
	el.className = ar.join(" ");
}
/** get handler */
function getHandler() {
	var params = new Array();
	for (var i = 0; i < arguments.length; i++) {
		params[i] = arguments[i];
	}
	var scope = params.shift();
	var func = params.shift();
	
	return function() {
		if (func && typeof func == "function") {
			func.apply(scope, params);
		}
		if (func && typeof func == "string") {
			var handler = function() { 
				try { 
					eval(func); 
				} catch(ex) {
				}
			};
			handler.apply(scope, params);
		}
	}
}
/** exec on load */
function execOnload(func) {
	var old = window.onload ? window.onload : function() {};
	window.onload = function() {
		old();
		if (func && typeof func == "function") {
			func();
		}
		if (func && typeof func == "string") {
			try { 
				eval(func); 
			} catch(ex) {
			}
		}
	}
}
/* re display */
function redisplay() {
	document.body.style.display = 'none';
	document.body.style.display = '';
}
/* fix height */
function fixHeight(box) {
	try {
		if (window != parent) {
			var frms = parent.document.getElementsByTagName('FRAME');
			for (var i = 0, l = frms.length; i < l; i++) {
				if (frms[i].contentWindow == window) {
					var contentHeight = 600;
					var viewHeight = frms[i].offsetHeight;
					if (document.documentElement && document.documentElement.scrollHeight) {
						contentHeight = document.documentElement.scrollHeight;
					}
					/*if (document.body && document.body.scrollHeight) {
						contentHeight = document.body.scrollHeight;
					}*/
					var h = contentHeight - viewHeight;
					if (h > 0) {
						box.style.height = (box.offsetHeight - h) + 'px';
						redisplay();
					}
					return;
				}
			}
		}
	} catch (ex) {}
}
/** debug */
function debug(info) {
	alert(info);
}
/** info */
function info(info) {
	alert(info);
}
/** warn */
function warn(info) {
	if (pagevisit.getAttribute("productMode") == "false") {
		alert(info);
	}
}
/** error */
function error(info) {
	alert(info);
}
/** private begin */
/** get page height */
function getPageHeight() {
	var clientHeight = document.body.clientHeight;
	var scrollHeight = document.body.scrollHeight;
	return clientHeight > scrollHeight ? clientHeight : scrollHeight;
}
/** begin page loading */
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
	}
	else  loading.style.display = "";   //added by tangz@2010-4-7 10:50:51
	    
	if (overlay == null) {
		overlay = document.createElement("div");
		overlay.className = "c_overlay";
		overlay.id = "overlay";
		overlay.innerHTML = "<iframe class=\"c_overfrm\" style=\"height:" + getPageHeight() + "px;\" frameborder=no></iframe>";
		document.body.appendChild(overlay);
	}
	else overlay.style.display = "";   //added by tangz@2010-4-7 10:50:51
}
/** end page loading */
function endPageLoading() {
	var loading = getElement("loading");
	var overlay = getElement("overlay");
	if (loading != null) {
		loading.style.display = "none";  //document.body.removeChild(loading);   modify by tangz@2010-4-7 10:52:04
	}
	if (overlay != null) {
		overlay.style.display = "none";  //document.body.removeChild(overlay);   modify by tangz@2010-4-7 10:52:04
	}
}
/** begin page overlay */
function beginPageOverlay() {
    var pagelay = getElement("pagelay");    //added by tangz@2010-4-7 10:50:51
    if (pagelay == null){                   //added by tangz@2010-4-7 10:50:51
	    pagelay = document.createElement("div");
	    pagelay.className = "c_overlay";
	    pagelay.id = "pagelay";
	    pagelay.innerHTML = "<iframe class=\"c_overfrm\" style=\"height:" + getPageHeight() + "px;\" frameborder=no scrolling=no></iframe>";
	    document.body.appendChild(pagelay);
    }else pagelay.style.display = "";       //added by tangz@2010-4-7 10:50:51
}
/** end page overlay */
function endPageOverlay() {
	var pagelay = getElement("pagelay");
	if (pagelay != null) {
		pagelay.style.display = "none";    //document.body.removeChild(pagelay);  modify by tangz@2010-4-7 10:52:04
	}
}
/** open new page add by zhangyangshuo 2011-9-15**/
function redirectToNavOpenNew(page, listener, params, target,caption) {
	var url = getContextName() + "?service=page/" + page;	
	if (listener != null) url += "&listener=" + listener;
	if (params != null) url += params;
	
	redirectToByUrlOpenNew(url, target,caption);
}
/** open new page add by zhangyangshuo 2011-9-15**/
function redirectToByUrlOpenNew(url, target,caption, israw, subsysaddr) {
	var obj = getElementBySrc();
	if (israw == null || !israw) url = getSysAddr(url, obj == null ? null : obj.getAttribute("subsyscode"), subsysaddr == null ? (obj == null ? null : obj.getAttribute("subsysaddr")) : subsysaddr);
	if (target != null && target != "" && target != "contentframe" && target != "currentframe") {
		var object = getElement(target);
		if (object != null && object.tagName == "IFRAME") {
			if (document.readyState == "complete") beginPageLoading();
			object.src = url;
		} else {
			getFrame(target).window.location.href = url;
		}
	} else {
		var linkobj = obj == null ? null : getElementByTag(obj, "a");
		if (caption != null) {
			if (target != "currentframe") {
				if (addNavFrameOpenNew(target == null ? parent : target, url, caption)) return;
			}
		}
		if (linkobj != null) {
			linkobj.href = url;
		} else {
			location.href = url;
		}
	}
}
/** add new page add by zhangyangshuo 2011-9-15**/
function addNavFrameOpenNew(target, url, title) {
	if (target == "contentframe") {
		target = getFrame("contentframe");
		if (target == null) target = top;
	}
	if (target.menuframe == null) return false;
	
	var navmenus = target.menuframe.document.getElementById("navmenus");
	var navmenuidx = target.menuframe.NAV_MENU_CURSOR ++;
	var navmenuid = "navmenu_" + navmenuidx;
	
	if(url.include("pub.chkcust.MainChkCust")){
		navmenuidx = 0;
		navmenuid = "navmenu_" + navmenuidx;
	}
	
	var navframe = getNavFrame(target, navmenuidx);
	if (navframe == null) {
		alert("打开页面数已超过最大限制，请先关闭部分页面后再操作！");
		return true;
	}
	
	var closeNavMethod = "closeOnEsc", searchKeyWord = "&closeNavMethod=";
	if (url.indexOf(searchKeyWord) != -1) {
		closeNavMethod = url.substring(url.indexOf(searchKeyWord) + searchKeyWord.length);
		if (closeNavMethod.indexOf("&") != -1) closeNavMethod = closeNavMethod.substring(0, closeNavMethod.indexOf("&"));
	}
	
	var navframeid = navframe.name;
	
	var navmenucont = "<a href=\"javascript:void(0)\" class=\"li\" title=\"" + title + "\" onclick=\"switchNavFrame(parent, '" + navmenuid + "');\" ondblclick=\"return closeNavFrame(parent, '" + navmenuid + "', '" + closeNavMethod + "');\"><span class=\"left\"></span><span class=\"text\"><span id=\"" + navframeid + "_loading\" class=\"loading\">" + getPartStr(title, 20) + "</span></span><span class=\"right\"></span></a>";
	navmenucont += "<a href=\"javascript:void(0)\" class=\"closeTab\" id=\"" + navframeid + "_close\" onclick=\"return closeNavFrame(parent, '" + navmenuid + "', '" + closeNavMethod + "');\"/></a>";
	
	var navmenu = target.menuframe.document.createElement("LI");
	navmenu.className = "open";
	navmenu.id = navmenuid;
	navmenu.setAttribute("relaframe", navframeid);
	navmenu.innerHTML = navmenucont;
	navmenus.appendChild(navmenu);
	
	switchNavFrame(target, navmenuid);
	
	navframe.location.href = url;
	
	return true;
}
/** private end */
/** deprecated begin */
/** starts with */
function startsWith(str1, str2) {
	return str1.startsWith(str2);
}
/** trim str */
function trim(str) {
	if(typeof str =='string'){
		return str.trim();
	}else{
		return str;
	}
}
/** get request parameter by name **/
function getReqParamByName(url, name) {
	new RegExp("(^|&)"+name+"=([^&]*)").exec(decodeURIComponent(url));
	return RegExp.$2
}
/** deprecated end */

function getLoginCheckCode() {
	
	var checkCode=pagevisit.getAttribute("loginCheckCode");

	return ""+checkCode;
}


// 说明：文本框(input)获取焦点(onfocus)时样式改变的实现方法 
// focusClass : 获取焦点时的样式 
// normalClass : 正常状态下的样式
function focusInput(focusClass,normalClass) {	
	 var elements = document.getElementsByTagName("INPUT");
	 for (var i=0; i < elements.length; i++) {        
		 	if (elements[i].type != "button" && elements[i].type != "submit" && elements[i].type != "reset" && elements[i].type != "radio" && elements[i].type != "checkbox") {
 		 	  elements[i].onfocus = function() { 
				  this.className = currClass+' '+focusClass;
			  };             
			  elements[i].onblur = function() { 
				  this.className = currClass; 
			  };         
		   }     
	   }	   
 }
 //SELECT
function focusSelect(focusClass, normalClass) {	
	 var elements = document.getElementsByTagName("SELECT");
	 for (var i=0; i < elements.length; i++) {                    
		  elements[i].onfocus = function() { 
			  this.className = this.className+' '+focusClass;
		  };             
		  elements[i].onblur = function() { 
			  this.className = normalClass; 
		  };         
	   }	   
 }
 //Textarea
 function focusTextarea(focusClass, normalClass) {	
	 var elements = document.getElementsByTagName("TEXTAREA");
	 for (var i=0; i < elements.length; i++) {                    
		  elements[i].onfocus = function() { 
			  this.className = this.className+' '+focusClass;
		  };             
		  elements[i].onblur = function() { 
			  this.className = normalClass; 
		  };         
	   }	   
 };
 /*屏蔽Backspace，输入内容不屏蔽 add by zhangyangshuo*/
document.onkeydown = function()  { 
    if(
    	(window.event.altKey && (window.event.keyCode == 37 || window.event.keyCode == 39||window.event.keyCode == 115)) //屏蔽 Alt+ 方向键 ←  →   Alt+F4  
      ||(window.event.ctrlKey && (window.event.keyCode == 82||window.event.keyCode == 78||window.event.keyCode == 121))//Ctrl + r  Ctrl+n Ctrl+F10
      ||(window.event.keyCode == 116 || window.event.keyCode == 112)//屏蔽 F5、F1
      ||(window.event.srcElement.tagName == "A" && window.event.shiftKey)//屏蔽 shift 加鼠标左键新开一网页
      ||(((document.activeElement.type != "text"&&document.activeElement.type !="textarea"&&document.activeElement.type !="password")
      ||((document.activeElement.type == "text"||document.activeElement.type =="textarea"||document.activeElement.type =="password")
         &&document.activeElement.readOnly))&&(window.event.keyCode==8))//屏蔽退格删除键
     )
    {  
    	event.keyCode = 0;
        event.returnValue = false;
    }
}

function closeOnEsc(){
	
}


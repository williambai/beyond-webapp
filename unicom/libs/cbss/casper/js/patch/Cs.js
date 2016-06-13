Cs = {};
var _EditChkIEWin = false;
var _NEED_CHK_CUST=false;

Object.extend(Cs, {
    namespace : function(){
            var a=arguments, o=null, i, j, d, rt;
            for (i=0; i<a.length; ++i) {
                d=a[i].split(".");
                rt = d[0];
                eval('if(typeof ' + rt + ' == "undefined"){' + rt + ' = {};} o = ' + rt + ';');
                for (j=1; j<d.length; ++j) {
                    o[d[j]]=o[d[j]] || {};
                    o=o[d[j]];
                }
            }
        }
})

Cs.ns = Cs.namespace;

Cs.ns("Cs", "Cs.util", "Cs.ctrl", "Cs.flower");

Cs.util.XML = function(){
        return Try.these(
          function() {return new ActiveXObject("MSXML2.DOMDocument.3.0")},
          function() {return new ActiveXObject('Microsoft.XMLDOM')},
          function() {
                //** add by williambai
                var xmlDoc = document.implementation.createDocument("", "", null);
                xmlDoc.loadXML = function(text){
                    // console.log('++++++++++++')
                    // console.log(text)
                    var doc = (new DOMParser()).parseFromString(text,'text/xml');
                    xmlDoc.appendChild(doc.documentElement)
                    xmlDoc.documentElement.xml = text;
                    // console.log('+++++++++++99999+++')
                };
                return xmlDoc;
            }
        ) || false;
    }

Cs.util.Utility = {
    node2JSON:function(node){ 
        var o = {};
        for(var i=0; i<node.attributes.length; i++) {
            o[node.attributes[i].name] = node.attributes[i].value;
        }
        return o;
    },
    
    json2opts:function(obj, valueName, labelName) {
    	valueName=valueName||"value";
    	labelName=labelName||"label";
    	
    	var lst = new Array;
    	lst.push("<opts>");
    	for(var i in obj){
    	    if (obj[i] instanceof Function) continue;
    		lst.push("<data ");
    		lst.push(valueName+"='"+i+"' ");
    		lst.push(labelName+"='"+obj[i]+"' />");
    	}
    	lst.push("</opts>");
    	return lst.join("");
    },
    updAreaValue:function(json,area)
    {
        $A(area.getElementsByTagName("INPUT")).each(function(el){
            if (el.id&&json[el.id.toCamelize()]!=null){
                el.value=json[el.id.toCamelize()];
                if (el.lookupComboValue=="true")
                    Cs.flower.LookupCombo.setValue(el, el.value);
            }
        });
    },
    
	clearAreaValue:function(area)
	{
	    $A(area.getElementsByTagName("INPUT")).each(function(el){
	        if (el.id!=null){
	            el.value='';
	            if (el.lookupComboValue=="true")
	                Cs.flower.LookupCombo.setValue(el, '');
	        }
	    })
	},
    
    unCamelize:function(str){
        $R('A','Z').each(function(i){
            str=str.replace(new RegExp(i, 'g'),'_'+i)
            });
        return str.toUpperCase();
    },
    getLastDay:function(first){
        var firstDate = first;
        if (typeof first == "string"){
            var firstDate = new Date();
            var year = parseInt(first.substring(0,4),10);//取当前的年份
            var month = parseInt(first.substring(5,7),10)+1;//取当前月下一个月份
        	if (month>12)//如果当前大于12月，则年份转到下一年
            {
            month -=12;//月份减
            year++;//年份增
            }
            month -=1;
            var new_date = new Date(year,month,1);//取第一天
            var doubleStr = function(num){
        		if (num<10) return "0"+String(num);
        		else return String(num);
        	}
            var result = new Array();
        	result[result.length] = String((new Date(new_date.getTime()-1000*60*60*24)).getFullYear());
        	result[result.length] = "-";
        	result[result.length] = doubleStr((new Date(new_date.getTime()-1000*60*60*24)).getMonth()+1);
        	result[result.length] = "-";
        	result[result.length] = doubleStr((new Date(new_date.getTime()-1000*60*60*24)).getDate());
        	result[result.length] = " ";
        	result[result.length] = "23";
        	result[result.length] = ":";
        	result[result.length] = "59";
        	result[result.length] = ":";
        	result[result.length] = "59";
        	return result.join("");
        }
        },
    /**
     * 对日期进行计算
     * @param {Date/String} first 可以是Date型，也可以是"yyyy-mm-dd hh:mi:ss"型字符串，其他形式不可以
     * @param {String} unit  0:天   1:自然天  2:月  3:自然月  4:年   5:自然年  6:秒
     * @param {Number} offset  偏移量
     * @return {String} result 返回 "yyyy-mm-dd hh:mi:ss"型日期
     */
    computeDate:function(first, unit, offset){
    	var firstDate = first;
        if (typeof first == "string"){
    		var firstDate = new Date();
    		firstDate.setFullYear(parseInt(first.substring(0,4),10));
    		firstDate.setDate(1);//added by tangz@2009-1-29 16:38 
    		firstDate.setMonth(parseInt(first.substring(5,7),10)-1);
    		firstDate.setDate(parseInt(first.substring(8,10),10));
    		firstDate.setHours(0,0,0);
    		if (first.length == 19){
    			firstDate.setHours(parseInt(first.substring(11,13),10));
    			firstDate.setMinutes(parseInt(first.substring(14,16),10));
    			firstDate.setSeconds(parseInt(first.substring(17,19),10));
    		}
    	}
    	
    	if (typeof offset == "string") offset = parseInt(offset);
    	
    	switch(unit){
    		case "0": //天
    			firstDate.setDate(firstDate.getDate()+offset);
    			break;
    		case "1": //自然天
    			firstDate.setDate(firstDate.getDate()+offset);
    			firstDate.setHours(0,0,0);
    			break;
    		case "2": //月
    			firstDate.setMonth(firstDate.getMonth()+offset);
    			break;
    		case "3"://自然月
    			firstDate.setMonth(firstDate.getMonth()+offset, 1);
    			firstDate.setHours(0,0,0);
    			break;
    		case "4": //年
    			firstDate.setYear(firstDate.getYear()+offset);
    			break;
    		case "5"://自然年
    			firstDate.setYear(firstDate.getYear()+offset);
    			firstDate.setMonth(1,1);
    			firstDate.setHours(0,0,0);
    		case "6"://秒
    			firstDate.setSeconds(firstDate.getSeconds()+offset);    			
    	}
    	
    	var doubleStr = function(num){
    		if (num<10) return "0"+String(num);
    		else return String(num);
    	}
    	
    	var result = new Array();
    	result[result.length] = String(firstDate.getFullYear());
    	result[result.length] = "-";
    	result[result.length] = doubleStr(firstDate.getMonth()+1);
    	result[result.length] = "-";
    	result[result.length] = doubleStr(firstDate.getDate());
    	result[result.length] = " ";
    	result[result.length] = doubleStr(firstDate.getHours());
    	result[result.length] = ":";
    	result[result.length] = doubleStr(firstDate.getMinutes());
    	result[result.length] = ":";
    	result[result.length] = doubleStr(firstDate.getSeconds());
    	return result.join("");
    },
    
    /**
    * 给目标日期加上(减去)N天。
    * @param {Date/String} date 可以是Date型，也可以是"yyyy-mm-dd hh:mi:ss"型字符串，其他形式不可以
    * author jiaxl@2012-04-18
    */
    addDay:function(first,offset){
    	var firstDate = first;
        if (typeof first == "string"){
    		var firstDate = new Date();
    		firstDate.setFullYear(parseInt(first.substring(0,4),10));
    		firstDate.setDate(1);//added by tangz@2009-1-29 16:38 
    		firstDate.setMonth(parseInt(first.substring(5,7),10)-1);
    		firstDate.setDate(parseInt(first.substring(8,10),10));
    		firstDate.setHours(0,0,0);
    		if (first.length == 19){
    			firstDate.setHours(parseInt(first.substring(11,13),10));
    			firstDate.setMinutes(parseInt(first.substring(14,16),10));
    			firstDate.setSeconds(parseInt(first.substring(17,19),10));
    		}
    	}
    	firstDate.setTime(firstDate.getTime() + offset * 24*60*60*1000);
    	
    	var doubleStr = function(num){
    		if (num<10) return "0"+String(num);
    		else return String(num);
    	}    	
    	var result = new Array();
    	result[result.length] = String(firstDate.getFullYear());
    	result[result.length] = "-";
    	result[result.length] = doubleStr(firstDate.getMonth()+1);
    	result[result.length] = "-";
    	result[result.length] = doubleStr(firstDate.getDate());
    	result[result.length] = " ";
    	result[result.length] = doubleStr(firstDate.getHours());
    	result[result.length] = ":";
    	result[result.length] = doubleStr(firstDate.getMinutes());
    	result[result.length] = ":";
    	result[result.length] = doubleStr(firstDate.getSeconds());
    	return result.join("");    	
    }
}

Cs.Ajax = {
    
    _ErrorReport:new Error("error report html!"),
    
    direct:function(linkName, params , refreshs, meth, beforeAction, afterAction, asyn){
    	var win = new Cs.flower.Win();
        if ($(linkName).tagName.toLowerCase() == "a"){
        
            u="about:blank";
            try{
                u = $(linkName).href;
            }catch(ex){win.alert(ex.message)}
            
            params = params || "";
            
            meth = meth || "post";
            if (meth.blank())
                meth = "post";
        
        }else if ($(linkName).tagName.toLowerCase() == "input" && ["submit","image"].include($(linkName).type)){
            
            u = $(linkName).form.action;
            
            var data = Form.getElements($(linkName).form).inject({}, function(result, element) {
              if (!element.disabled && element.name) {
                var key = element.name, value = $(element).getValue();
                
                if ( !["input"].include(element.tagName.toLowerCase())
                    || !["button","submit","image"].include(element.type)){
                   if (value != null) {
                     	if (key in result) {
                        if (result[key].constructor != Array) result[key] = [result[key]];
                        result[key].push(value);
                      }
                      else result[key] = value;
                    }
                }
              }
              return result;
            })
            
            if ($(linkName).type == "image"){
                params = Hash.toQueryString(data)+"&"+$(linkName).name+".x="+encodeURIComponent($F(linkName));
            }
            else
                params = Hash.toQueryString(data)+"&"+$(linkName).name+"="+encodeURIComponent($F(linkName));
            
            meth = $(linkName).form.method || "post";
        
        }
        else if ($(linkName).action){
            u = $(linkName).action;
            params = params || "";
            
            meth = $(linkName).method || "post";
        }
        else{
            win.alert("调用错误! 正确调用方法可以咨询 tangzhi 或参考其文档")
            return;
        }
        
        refreshParts = [];
		
        if (refreshs)
            refreshParts = refreshs.split(",");
        
        messageParts = ["_messageXml"];
        
        refreshParts = refreshParts.concat(messageParts);
        
        Cs.ctrl.Web.showInfo("正在处理，请稍候...");
        
        if (beforeAction)
            eval(beforeAction);
        
        new Ajax.Request(u, {
            
            parameters: params,
            
            method: meth,
        
            asynchronous: asyn===undefined?true:asyn,
            
            onComplete: function(transport){
                try{
                    tmp = document.createElement("DIV");
                    tmp.innerHTML = transport.responseText;
                    
                    if ($(linkName).tagName.toLowerCase() == "input" && ["submit","image"].include($(linkName).type)){
                        $(linkName).form.locked = false;
                    }
                    
                    errorLevel = 0;
                    
                    arr = tmp.getElementsByTagName("*");
					
				
                    for(var i=0; i<arr.length; i++)
                    {
						if (arr[i].tagName.toLowerCase() == "div"  && arr[i].className && ["wrapper4", "wrapper2", "dragArea", "body", "tip"].include(arr[i].className))
                            errorLevel++;
                         
                        if (errorLevel > 4)
                            throw _ErrorReport;
                         
						
                        if (!arr[i].id || (!refreshParts.include(arr[i].id)) ) continue;
						
						
                        if (arr[i].id){
                            if (messageParts.include(arr[i].id) && $(arr[i].id)==null){
                                if (!arr[i].innerText) {
                                    msg = document.createElement("span");
                                    msg.innerHTML = arr[i].outerHTML
                                }else {
                                    msg = document.createElement("span");
                                    msg.innerText = arr[i].innerText;
                                    msg.id = arr[i].id;
                                }
                                msg.style.display = "none";
                                document.body.appendChild(msg);
                            }
                            else {
                            	if (['THEAD','TBODY','TR','TD'].include(arr[i].tagName))
	                            	$(arr[i].id).update(arr[i].innerHTML);
	                            else
	                            	$(arr[i].id).replace(arr[i].outerHTML);
                            }                            
                        }
                    }
                    
                    tmp = null;
                    
                    setTimeout(Cs.ctrl.Web.dealTradeMsg, 200);
                    
                }catch(ex){
                    
                    Cs.ctrl.Web.hideInfo();
                    
                    if  (ex == _ErrorReport){
                        
                        if (window.confirm("\u7A0B\u5E8F\u53D1\u751F\u5F02\u5E38\uFF0C\u662F\u5426\u67E5\u770B\u9519\u8BEF\u9875\u9762\n\u5982\u679CIE\u8BBE\u7F6E\u4E86\u7981\u6B62\u5F39\u51FA\u9875\u9762\uFF0C\u9519\u8BEF\u9875\u9762\u5C06\u65E0\u6CD5\u663E\u793A")) {
	    		            var w = window.open("", null, "status=yes,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no");
	    		            w.document.write(transport.responseText);
	    		            w.document.close();
	    	            }
        
                        return;
                    }
                    else
                        win.alert(ex.message)
                }
                
                Cs.ctrl.Web.hideInfo();
                            
                if (afterAction)
                    eval(afterAction);
            }
            
        })
    },
    
    directPage:function(page, listener , params , refreshs, meth, beforeAction, afterAction, asyn){
		var win = new Cs.flower.Win();
        var g = Cs.ctrl.Web.getTradeGlobal();
        servletPath = g.servletPath;   
        
        var pageName = page||"";
        if (pageName.blank()){
            pageName = g.pageName;
        }
        
        Cs.ctrl.Web.showInfo("正在处理，请稍候...");
        
                
        refreshParts = [];		
        if (refreshs)
            refreshParts = refreshs.split(",");
        
        messageParts = ["_messageXml"];
        
        refreshParts = refreshParts.concat(messageParts);
        
        if (beforeAction)
            eval(beforeAction);

		var obj = getElementBySrc();
		var u = servletPath+"?service=page/"+pageName;
		if (listener != null) u += "&listener=" + listener;

        meth = meth || "post";
        if (meth.blank())
            meth = "post";
        
        new Ajax.Request(u, {            
            parameters: params,            
            method: meth,        
            asynchronous: asyn===undefined?true:asyn,            
            onComplete: function(transport){
                try{
                    tmp = document.createElement("DIV");
                    tmp.innerHTML = transport.responseText;
                    win.alert(transport.responseText);
                    errorLevel = 0;                    
                    arr = tmp.getElementsByTagName("*");
					
				
                    for(var i=0; i<arr.length; i++)
                    {
						if (arr[i].tagName.toLowerCase() == "div"  && arr[i].className && ["wrapper4", "wrapper2", "dragArea", "body", "tip"].include(arr[i].className))
                            errorLevel++;
                         
                        if (errorLevel > 4)
                            throw _ErrorReport;
                         
						
                        if (!arr[i].id || (!refreshParts.include(arr[i].id)) ) continue;
						
						
                        if (arr[i].id){
                            if (messageParts.include(arr[i].id) && $(arr[i].id)==null){
                                if (!arr[i].innerText) {
                                    msg = document.createElement("span");
                                    msg.innerHTML = arr[i].outerHTML
                                }else {
                                    msg = document.createElement("span");
                                    msg.innerText = arr[i].innerText;
                                    msg.id = arr[i].id;
                                }
                                msg.style.display = "none";
                                document.body.appendChild(msg);
                            }
                            else {
                            	if (['THEAD','TBODY','TR','TD'].include(arr[i].tagName))
	                            	$(arr[i].id).update(arr[i].innerHTML);
	                            else
	                            	$(arr[i].id).replace(arr[i].outerHTML);
                            }                            
                        }
                    }
                    
                    tmp = null;
                    
                    setTimeout(Cs.ctrl.Web.dealTradeMsg, 200);
                    
                }catch(ex){
                    
                    Cs.ctrl.Web.hideInfo();
                    
                    if  (ex == _ErrorReport){
                        
                        if (window.confirm("\u7A0B\u5E8F\u53D1\u751F\u5F02\u5E38\uFF0C\u662F\u5426\u67E5\u770B\u9519\u8BEF\u9875\u9762\n\u5982\u679CIE\u8BBE\u7F6E\u4E86\u7981\u6B62\u5F39\u51FA\u9875\u9762\uFF0C\u9519\u8BEF\u9875\u9762\u5C06\u65E0\u6CD5\u663E\u793A")) {
	    		            var w = window.open("", null, "status=yes,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no");
	    		            w.document.write(transport.responseText);
	    		            w.document.close();
	    	            }
        
                        return;
                    }
                    else
                        win.alert(ex.message)
                }
                
                Cs.ctrl.Web.hideInfo();
                            
                if (afterAction)
                    eval(afterAction);
            }
            
        })
    },    
    
    //不推荐使用
    _swallow:function(page, listener ,options, msg)
    {
        var g = Cs.ctrl.Web.getTradeGlobal();
        servletPath = g.servletPath;   
        
        var pageName = page||"";
        if (pageName.blank()){
            pageName = g.pageName;
        }
        
        Cs.ctrl.Web.showInfo(msg||"正在处理，请稍候...");
        
        var u = servletPath+"?service=swallow/"+pageName+"/"+listener+"/1";
        new Ajax.Request(u,options);
    },
    
    _dealSet:{},
    
    register:function(nodeName, func){
        this._dealSet[nodeName]=func;
    },
    
    unregister:function(nodeName){
        delete this._dealSet[nodeName];
    },
    
    registerErrReturn:function(func){
        this._dealSet["$error"]=func;
    },
    
    parseResultXml:function(node){
        //** add by williambai
        var xml = new XMLSerializer();
        node.xml = xml.serializeToString(node);
        var f = this._dealSet[node.nodeName];
        if(f&&f instanceof Function) f(node);
    },
    
    /**
     * 例子:
     * Cs.Ajax.register("aftersn",dealAfterSnResult);
     * Cs.Ajax.swallowXml("personalserv.createuser.CreateUser","afterDevelopStaffId","developStaffId="+obj.value);
     */
    swallowXml:function(page, listener, params, msg, asyn){
    	var win = new Cs.flower.Win();
	    var g = $("_tradeGlobal") != null?$("_tradeGlobal").innerHTML.evalJSON():null;
        pageName = g!=null?g.pageName:"";
        if(typeof(params) == "string"){
            params = params+"&globalPageName="+pageName;
        }else if (params == null || params == ''|| params == undefined){
           params = "&globalPageName="+pageName;         
        }else{
           params.globalPageName = pageName;
        }
        this.listener=listener;
        this._swallow(page,listener,{
            parameters: params||"",
            asynchronous: asyn===undefined?true:asyn,
            onComplete:function(transport){
                            try{                  
                                // console.log('====22222====')
                                // console.log(transport.responseText)              
                                var root = transport.responseXML.documentElement;
                                Cs.ctrl.Web.hideInfo();
                              
                                if (root == null) {
                                 
                                    try{
                                        //异常处理
                                        Cs.Ajax.parseResultXml({nodeName:"$error"});
                                        if (window.confirm("\u7A0B\u5E8F\u53D1\u751F\u5F02\u5E38\uFF0C\u662F\u5426\u67E5\u770B\u9519\u8BEF\u9875\u9762\n\u5982\u679CIE\u8BBE\u7F6E\u4E86\u7981\u6B62\u5F39\u51FA\u9875\u9762\uFF0C\u9519\u8BEF\u9875\u9762\u5C06\u65E0\u6CD5\u663E\u793A")) {
                                            var w = window.open("", null, "status=yes,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no");
                                            w.document.write(transport.responseText);
                                            w.document.close();
                                        }
                                    }catch(e){}
                                }else{
                                    var nodes = root.childNodes;
                                    for(var i=0; i<nodes.length; i++)
                                        Cs.Ajax.parseResultXml(nodes[i]);
                                }         
                            }catch(e){win.alert(e.message)}
                         }
        },msg)
    },
    
    //key可以为一个关键字,也可以是一个包含关键字的object，该object同时必须包含pool属性来指定缓存池
    swallowXmlCache:function(key, page, listener, params, msg, asyn, noCache){
    	var win = new Cs.flower.Win();
        if(!noCache) {
            var cache = new Cs.flower.DataCache();
            if(cache){
                var obj=key;
                if (typeof obj == 'object'){
                    key=obj.key;
                    if (obj.pool instanceof Function){
                        cache.setCachePool(obj.pool());
                    }else{
                        cache.setCachePool(obj.pool);
                    }
                }
                var xmlStr = cache.get(key);
                if(xmlStr){
	                var root = new Cs.util.XML();
	    	        root.loadXML(xmlStr);
	    	        var nodes=root.documentElement;
	    	        var dataDoc = nodes.childNodes;
	                if (dataDoc){
	                    for(var i=0; i<dataDoc.length; i++)
	                        Cs.Ajax.parseResultXml(dataDoc[i]);
	                    return;
                	}
                }
            }
        }
        this._swallow(page,listener,{
            parameters: params||"",
            asynchronous: asyn===undefined?true:asyn,
            onComplete:function(transport){
                            try{                                
                                // console.log('====333333====')
                                // console.log(transport.responseText)              
                                var root = transport.responseXML.documentElement;
                                //** add by williambai
                                root.xml = transport.responseText || '';
                                Cs.ctrl.Web.hideInfo();
                                if (root == null) {
                                    try{
                                        if (window.confirm("\u7A0B\u5E8F\u53D1\u751F\u5F02\u5E38\uFF0C\u662F\u5426\u67E5\u770B\u9519\u8BEF\u9875\u9762\n\u5982\u679CIE\u8BBE\u7F6E\u4E86\u7981\u6B62\u5F39\u51FA\u9875\u9762\uFF0C\u9519\u8BEF\u9875\u9762\u5C06\u65E0\u6CD5\u663E\u793A")) {
                                            var w = window.open("", null, "status=yes,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no");
                                            w.document.write(transport.responseText);
                                        }
                                    }catch(e){}
                                }else{
                                    var nodes = root.childNodes;

                                    if (cache){
                                        cache.put(key, root.xml);
                                    }
                                    for(var i=0; i<nodes.length; i++){
                                        Cs.Ajax.parseResultXml(nodes[i]);
                                    }
                                }         
                            }catch(e){win.alert(e.message)}
                         }
        },msg)
    },
    
    swallowJson:function(page, listener, params, msg, asyn){
    	var win = new Cs.flower.Win();
        this._swallow(page,listener,{
            parameters: params||"",
            asynchronous: asyn===undefined?true:asyn,
            onComplete:function(transport){
                            try{          
                            	Cs.ctrl.Web.hideInfo();                      
                                var jsonStr = transport.responseText;
                                Cs.ctrl.Web.hideInfo();
                                var json = jsonStr.evalJSON();
                                var dealFunc = json.dealFunc;
                                delete json["dealFunc"];
                                eval(dealFunc+"(json)");
                            }catch(e){win.alert(e.message)}
                         }
        }, msg)
    }
}


Object.extend(String.prototype , {    
    toCamelize: function(){
        return this.toLowerCase().replace(/_/g,"-").camelize();
    }
})

//added by tangz@2009-1-16 23:06
Object.extend(Array.prototype , {    
    remove: function(idx){
        return this.splice(idx,1);
    }
})

if (!TableEdit) TableEdit={};
Object.extend(TableEdit.prototype , {
	
	//找某些字段满足条件的某条记录
	findRow:function(colNames,values){
		var key=colNames.split(",");
		var value=values.split(",");
		for (var i=1; i<this.table.rows.length; ++i) {
			var found=true;
			for(var k=0;k<key.length;++k){
				if (this.getCell(this.table.rows[i],key[k]).innerHTML!=value[k])
				{
					found=false;
					break;
				}
			}
			if (found)
				return this.table.rows[i];
		}
		return null;
	},
	
	setRowStyle:function(colNames,values,styleName){
		var p =false;
		styleName=styleName|| "row_select";
		var key=colNames.split(",");
		var value=values.split(",");
		for (var i=1; i<this.table.rows.length; ++i) {
			var found=true;
			for(var k=0;k<key.length;++k){
				if (this.getCell(this.table.rows[i],key[k]).innerHTML!=value[k])
				{
					found=false;
					break;
				}
			}
			if (found){
				this.table.rows[i].className=styleName;
				p = true;
			}
		}
		return p;
	},
	/** click row */
	clickRowOnly:function() {
		for (var i=1; i<this.table.rows.length; i++) {
			this.table.rows[i].className = "row_even";
		}

		var row = getElementByTag(window.event.srcElement, "tr");
		
		if (row == null || (this.rowIndex=row.rowIndex) == 0) return;

		row.className = "row_select";
		this.rowIndex = row.rowIndex;
		this.isSelected = true;
	},
	
	baseClick:function(){
	    for (var i=1; i<this.table.rows.length; i++) {
			this.table.rows[i].className = "row_even";
		}

		var row = Event.findElement(event, "tr");
		
		if (row == null || (this.rowIndex=row.rowIndex) == 0) return;

		row.className = "row_select";
		this.rowIndex = row.rowIndex;
		this.isSelected = true;
	},
	
	//选中某条记录
	selectRow:function(row){
	    
	    if (!row || row.rowIndex == 0) return;
	    
	    row.className = "row_select";
		this.rowIndex = row.rowIndex;
		this.isSelected = true;

		for (var i=0; i<this.header.cells.length; i++) {
			var cellName = this.header.cells[i].id.substring("col_".length);
			var field = $(cellName);
			if (field != null) {
				var fieldValue = this.decodeCellValue(trim(row.cells[i].innerHTML));
				if (field.tagName == "INPUT" && field.type != null && (field.type.toUpperCase() == "CHECKBOX" || field.type.toUpperCase() == "RADIO")) {
					field.checked = fieldValue == field.value;
				} else {
					field.value = fieldValue;
				}
			}
		}
	},
	
	toJSON:function(headstr){
		var win = new Cs.flower.Win();
	    var rows = this.table.rows;
		var hcells = this.header.cells;
		var encodehead = headstr.split(",");
        
        var result = [];
		for (var i=1; i<rows.length; i++) {
		    if (this.getCell(rows[i], "X_TAG")&&this.getCell(rows[i], "X_TAG").innerText == "") continue;
            
			var row = rows[i];
			
			var o={};
			for (var j=0; j<encodehead.length; j++) {
			    
			    var headCode = encodehead[j];
			    var encodeCode = encodehead[j];
			    if (encodehead[j].split("|").length>1){
			        headCode = encodehead[j].split("|")[0];
			        encodeCode = encodehead[j].split("|")[1];
			    }
			    
				var cell = this.getCell(row, headCode);
				if (cell == null) win.alert("column " + headCode + " not found！");

				o[encodeCode] = cell.innerHTML.strip();
			}
			result.push(o);
		}
		return result;
	},
	
	rowToJSON:function(row,headstr,isCamelize){
		var win = new Cs.flower.Win();
		var hcells = this.header.cells;
		var encodehead = headstr.split(",");
		var o={};
		for (var j=0; j<encodehead.length; j++) {
		    var headCode = encodehead[j];
		    var encodeCode = encodehead[j];
		    if (encodehead[j].split("|").length>1){
		        headCode = encodehead[j].split("|")[0];
		        encodeCode = encodehead[j].split("|")[1];
		    }
			var cell = this.getCell(row, headCode);
			if (cell == null) win.alert("column " + headCode + " not found！");
			if(isCamelize)
				o[encodeCode.toCamelize()] = cell.innerHTML.strip();
			else
			    o[encodeCode] = cell.innerHTML.strip();
		}
		return o;
	},	
	//qc:52430 begin
	_addData:function(celldata,noCamelize,index){
	//qc:52430 end
		if(noCamelize!=true)
			noCamelize = false;
	    var row = this.table.insertRow(this.table.rows.length);
	        
        var hcells = this.header.cells;
		for (var i=0; i<hcells.length; ++i) {
			if (hcells[i].id == null || !startsWith(hcells[i].id, "col_")) continue;

			var cell = row.insertCell(i);			
			var cellName = hcells[i].id.substring("col_".length);
			var key = noCamelize?cellName:cellName.toCamelize();
			//qc:52430 begin
			if (!celldata[key]&&!["radio","radio2","checkbox","checkbox2"].include(cellName.toLowerCase())) continue;
			//qc:52430 end
			if (cellName.toLowerCase() == "radio"){
			    if (celldata[key]=="1"){
			        var a = [];
			        a.push("<input type='radio' class='radio' name='");
			        a.push(this.tableName);
			        a.push("R' checked />");
			        cell.innerHTML = a.join("");
			    }
			    else{
			        var a = [];
			        a.push("<input type='radio' class='radio' name='");
			        a.push(this.tableName);
			        a.push("R'/>");
			        cell.innerHTML = a.join("");
			    }
			}else if (cellName.toLowerCase() == "checkbox"){
			    if (celldata[key]=="1"){
			        var a=[];
			        a.push("<input type='checkbox' class='radio' name='");
			        a.push(this.tableName);
			        a.push("C' checked />");
			        cell.innerHTML = a.join("");
			    }else if (celldata[key]=="3"){//默认选择，不可改
			        var a=[];
			        a.push("<input type='checkbox' class='radio' name='");
			        a.push(this.tableName);
			        a.push("C' checked  disabled='true' />");
			        cell.innerHTML = a.join("");
			    }
			    else{
			        var a=[];
			        a.push("<input type='checkbox' class='radio' name='");
			        a.push(this.tableName);
			        a.push("C'/>");
			        cell.innerHTML = a.join("");
			    }			
		    //qc:52430 begin
			}else if (cellName.toLowerCase() == "checkbox2"){//用于带序号的列
			    if (celldata[key]=="1"){
			        var a=[];
			        a.push("<input type='checkbox' class='radio' name='");
			        a.push(this.tableName);
			        if(index!=null){
			        	a.push("C' checked value="+index+">");
			            a.push(index);
			            a.push("</input>")
			        }else{
			        	a.push("C' checked />");
			        }
			        cell.innerHTML = a.join("");
			    } else if (celldata[key]=="3"){//默认选择，不可改
			        var a=[];
			        a.push("<input type='checkbox' class='radio' name='");
			        a.push(this.tableName);
			        if(index!=null){
			        	a.push("C' checked value='"+index+"' disabled='true'> ");
			            a.push(index);
			            a.push("</input>")
			        }else{
			        	a.push("C' checked disabled='true'/>");
			        }
			        cell.innerHTML = a.join("");
			    }
			    else{
			        var a=[];
			        a.push("<input type='checkbox' class='radio' name='");
			        a.push(this.tableName);
			        if(index!=null){
			        	a.push("C' value="+index+">");
			        	a.push(index);
			       		a.push("</input>")
			        }else{
			        	a.push("C'/>");
			        }
			        cell.innerHTML = a.join("");
			    }
			//qc:52430 end
		    }else if (cellName.toLowerCase() == "radio2"){//用于多列 add by zhangyangshuo
			    if (celldata[key]=="1"){
			        var a = [];
			        a.push("<input type='radio' class='radio' name='");
			        a.push(this.tableName.substring(0,this.tableName.length-1));
			        a.push("R' checked />");
			        cell.innerHTML = a.join("");
			    }
			    else{
			        var a = [];
			        a.push("<input type='radio' class='radio' name='");
			        a.push(this.tableName.substring(0,this.tableName.length-1));
			        a.push("R'/>");
			        cell.innerHTML = a.join("");
			    }
			}
		    else if (celldata[key])
			    cell.innerHTML = celldata[key];
		}
		
		for(var i=0;i<hcells.length;++i)
		    row.cells[i].style.display = hcells[i].style.display;
		if(celldata["class"]){
			row.className = celldata["class"];
		}			
	},
	
	insertJson:function(arr,noCamelize){
	    if(noCamelize!=true)
	    	noCamelize = false;
	    if (!arr.length||arr.length==0) return;
	    
	    for(var i=0,len=arr.length; i<len; ++i){
	    	//qc:52430 begin
	        this._addData(arr[i],noCamelize,i+1);
	        //qc:52430 end
	    }
	    
	},
	
	insertXml:function(node){
	    if (node.childNodes.length<=0) return;
	    
	    for(var j=0; j<node.childNodes.length; ++j){

	        var celldata = Cs.util.Utility.node2JSON(node.childNodes[j]);
	        
	        this._addData(celldata,false,j+1);
	    }
	    this.showLinefeedStyle();
	},
	/**    **/
	insertXmlPage:function(node,page,pageSize){ 
		 if (node.childNodes.length<=0) return;
		 
		 var rows = (page-1) * pageSize;
		 var endIndex = page * pageSize;
		 //--begin  add by monk 2015 -08-05  避免最后一页的报错
		 if(endIndex > node.childNodes.length){
			 endIndex = node.childNodes.length
		 }
		 //-- end
		 var startIndex;
		 if(rows < 0) {
			 startIndex = 0;
		 }else {
			 startIndex = rows;
		 }
		 for(var i = startIndex; i < endIndex; ++i){
			 var celldata = Cs.util.Utility.node2JSON(node.childNodes[i]);
			 if(celldata == null  || celldata == ""){
				 break;
			 }
			 this._addData(celldata,false,i+1);
		 }
		 this.showLinefeedStyle();
	},
	
	insertXmlNew:function(node,num,odd){
	    if (node.childNodes.length<=0) return;
	    
	    for(var j=0; j<node.childNodes.length; ++j){
			if(j%num==odd){
	        var celldata = Cs.util.Utility.node2JSON(node.childNodes[j]);
	        this._addData(celldata);
	        }
	    }
	    this.showLinefeedStyle();
	},
	
	showLinefeedStyle:function(){
		var Ptr=this.table.getElementsByTagName("tr");  
	    for (i=1;i<Ptr.length+1;i++) {  
	    	if(Ptr[i-1]){
	    	Ptr[i-1].className = (i%2>0)?"row_odd":"row_even";
	    	 var hcells = this.header.cells;
			for (var j=0; j<hcells.length; ++j) {//列增加style add by zhangyangshuo
				if(hcells[j].styleName!=null&&hcells[j].styleName!=""&&i>1){
					var oo = hcells[j].styleName.evalJSON();
					 for (var prop in oo) {
					 		if(prop!="toJSONString"){
								this.getCell(this.table.rows[i-1], hcells[j].id.substring("col_".length)).style[prop] = oo[prop]+"";
							}
						}
				}
			}
			}
	    }
	},
	
	updateJson:function(info) {
		var row = this.table.rows[this.rowIndex];
	
		var hcells = this.header.cells;
		for (var i=0; i<hcells.length; i++) 
		{
			if (hcells[i].id == null || !startsWith(hcells[i].id, "col_")) continue;

			var cell = row.cells[i];
			var cellName = hcells[i].id.substring("col_".length);
			if(cellName.toCamelize()=="radio" || cellName.toCamelize()=="checkbox")
			{
				continue;
			}
			var fvalue = info[cellName.toCamelize()];
	
			if (typeof(fvalue)!='undefined') 
			{
				this.setCellValue(hcells[i], cell, fvalue);
			}

		}
	},
	
	/** window.setTimeout(isdbclick, 500) click row add by qusy*/
	clickRowAfterTime:function(srcClickElement) {
		for (var i=1; i<this.table.rows.length; i++) {
			this.table.rows[i].className = "row_even";
		}

		var row = getElementByTag(srcClickElement, "tr");
		if (row == null || row.rowIndex == 0) return;

		row.className = "row_select";
		this.rowIndex = row.rowIndex;
		this.isSelected = true;

		for (var i=0; i<this.header.cells.length; i++) {
			var cellName = this.header.cells[i].id.substring("col_".length);
			var field = getElement(cellName);
			if (field != null) {
				var fieldValue = this.decodeCellValue(trim(row.cells[i].innerHTML));
				if (field.tagName == "INPUT" && field.type != null && (field.type.toUpperCase() == "CHECKBOX" || field.type.toUpperCase() == "RADIO")) {
					field.checked = fieldValue == field.value;
				} else {
					field.value = fieldValue;
				}
			}
		}
	},
		
	getChecked:function(){
	    var idx=-1;
	    var hcells = this.header.cells;
	    for(var i=0; i<hcells.length; ++i) {
	        if (hcells[i].id&&["radio","checkbox","checkbox2","radio2"].include(hcells[i].id.substring("col_".length).toLowerCase())){
	            idx=i;
	            break;
	        }
	    }
	    if (idx==-1)return undefined;
	    return $A(this.table.rows).findAll(function(row){
	        return row.cells[idx].childNodes.length>0&&row.cells[idx].childNodes[0].checked;
	    });
	},
	
	clear:function(){
	    for(var i=this.table.rows.length; i>1;){
	        this.table.deleteRow(--i);
	    }
	},
	//根据当前的rowIndex 选中记录.
	clickF:function() {
		for (var i=1; i<this.table.rows.length; i++) {
			this.table.rows[i].className = "row_even";
		}

		var row = this.table.rows[this.rowIndex];
		
		if (row == null || (this.rowIndex=row.rowIndex) == 0) return;

		row.className = "row_select";
		this.rowIndex = row.rowIndex;
		this.isSelected = true;

		for (var i=0; i<this.header.cells.length; i++) {
			var cellName = this.header.cells[i].id.substring("col_".length);
			var field = getElement(cellName);
			if (field != null) {
				var fieldValue = this.decodeCellValue(trim(row.cells[i].innerHTML));
				if (field.tagName == "INPUT" && field.type != null && (field.type.toUpperCase() == "CHECKBOX" || field.type.toUpperCase() == "RADIO")) {
					field.checked = fieldValue == field.value;
				} else {
					field.value = fieldValue;
				}
			}
		}
	}	
	
})

if (!Prototype.Browser.IE7){
	Prototype.Browser.IE7 = Prototype.Browser.IE && navigator.userAgent.toLowerCase().indexOf('msie 7') > -1;
}
//修复IE7以下背景闪烁bug
if (Prototype.Browser.IE && !Prototype.Browser.IE7){
	try{
    	document.execCommand("BackgroundImageCache", false, true);
    }catch(e){}
}

/**
 * Created by tangz@2008-12-14 19:06
 */
Cs.util.Cookies=Class.create();Object.extend(Cs.util.Cookies.prototype,{initialize:function(){},set:function(name,value){var argv=arguments,argc=arguments.length,expires=(argc>2)?argv[2]:null,path=(argc>3)?argv[3]:'/',domain=(argc>4)?argv[4]:null,secure=(argc>5)?argv[5]:false;document.cookie=name+"="+escape(value)+((expires===null)?"":("; expires="+expires.toGMTString()))+((path===null)?"":("; path="+path))+((domain===null)?"":("; domain="+domain))+((secure===true)?"; secure":"");},get:function(name){var arg=name+"=",alen=arg.length,clen=document.cookie.length,i=0,j=0;while(i<clen){j=i+alen;if(document.cookie.substring(i,j)==arg){return this.getCookieVal(j);}i=document.cookie.indexOf(" ",i)+1;if(i===0){break;}}return null;},clear:function(name,path){if(this.get(name)){path=path||'/';document.cookie=name+'='+'; expires=Thu, 01-Jan-70 00:00:01 GMT; path='+path;}},getCookieVal:function(offset){var endstr=document.cookie.indexOf(";",offset);if(endstr==-1){endstr=document.cookie.length;}return unescape(document.cookie.substring(offset,endstr));}});
Cs.flower.DataCache=Class.create();Cs.flower.DataCache.pageCache={};Object.extend(Cs.flower.DataCache.prototype,{_pool:null,initialize:function(){this._pool=null;if(this.defaultCachePool)this.setCachePool(this.defaultCachePool())},setCachePool:function($){this._pool=$},get:function($){if(!this._pool)return undefined;if(this._pool instanceof Cs.util.Cookies){v=this._pool.get($);if(v==undefined)return undefined;else return v.evalJSON();}return this._pool[$]},put:function($,_){if(!this._pool)return undefined;if(this._pool instanceof Cs.util.Cookies)this._pool.set($,Object.toJSON(_));else
this._pool[$]=_;return _},remove:function($){delete this._pool[$]}});Object.extend(Cs.flower.DataCache.prototype,{defaultCachePool:function(){try{if(Cs.cacheusecookie) return new Cs.util.Cookies(); if(window.top&&!window.top.datapool)window.top.datapool={};return window.top.datapool}catch($){return new Cs.util.Cookies();}},pageCachePool:function(){return Cs.flower.DataCache.pageCache}});

/**
 * 对页面元素进行控制
 */
Cs.ctrl.Web = {
    
    bg:"slategray",  //提示框边线颜色
    mustFillCheck:"yes",
    dataValidateCheck:"yes",
    lookupComboCheck:"yes",
    hotkeyCheck:"yes",
    formLockCheck:"no",
    _hotkeys:{},
    
    //锁定界面，提示加载
    loading:function(){
        Cs.ctrl.Web.showInfo("正在加载数据，请稍候...");
    },
    
    //锁定界面，显示提示信息
    showInfo:function(msg){
        Cs.ctrl.Web.hideInfo();
        var waitInfo = "<div id=_waitInfo style='position:absolute;background-color:white;"
                     + "color:"+this.bg+";height:40;top:30%;left:25%;border:2px solid "
                     + this.bg + " ;z-index=10005;width:400;'><div id=_waitInfoContent style='position:relative;top:25%;text-align:center;'>"
                     + "<img src='/component/images/loading.gif' alt='[loading]'>  "
                     + msg
                     + "</div></div><iframe id=_waitInfobg frameborder=\"0\" style='background-color:#ffffff;position:absolute;top:0;left:0;height:100%;width:100%;z-index:10000;filter : progid:DXImageTransform.Microsoft.Alpha(opacity=75);border:0'></iframe>"
        document.body.insertAdjacentHTML("beforeEnd",waitInfo);
        Position.clone(document.body, $('_waitInfobg'));//added by qiumb@
        $("_waitInfo").style.top=document.documentElement.scrollTop+150;//chengjie
        document.getElementById("_waitInfo").focus();
    },
    
    //界面解锁，隐藏提示信息
    hideInfo:function(){
        if ($('_waitInfo'))
            document.body.removeChild($('_waitInfo'));
        if ($('_waitInfobg'))
            document.body.removeChild($('_waitInfobg'));
    },
    
    dealTradeMsg:function(){
    	var win = new Cs.flower.Win();
        Cs.ctrl.Web.hideInfo();
        if ($("_messageXml")!=null && $F("_messageXml")!=null && $F("_messageXml")!=""){
            try{
    	        xml = new Cs.util.XML();
    	        xml.loadXML($F("_messageXml"));
    	        Cs.ctrl.Web.dealScriptMessage(xml.documentElement);
    	        $("_messageXml").value = "";
    	    }catch(e){win.alert(e.message)}
    	}
    },
    
    addValidateListener:function(element){
        Cs.ctrl.Validate.addListener(element);
    },
    
    addFormSubmitListener:function(element){
    	var win = new Cs.flower.Win();
        var elt = $(element);
        elt.observe('click' , function(event){
            element = Event.element(event);
            if (element.form.locked){
                var win = new Cs.flower.Win();
                win.alert("正在提交数据 或者 表单被锁定，请稍候再提交！");
                Event.stop(event);
            }
            else {
                element.form.locked = true;
            }
        });
    },
    
    addLookupComboListener:function(element){
        var win = new Cs.flower.Win();
        var elt = $(element);
        try{
            elt.observe('focus' , Cs.flower.LookupCombo.onfocus);
            elt.observe('keyup' , Cs.flower.LookupCombo.onkeyup);
            elt.observe('blur' , Cs.flower.LookupCombo.onblur);
            elt.observe('keydown' , Cs.flower.LookupCombo.onkeydown);
        }catch(ex){
            win.alert(ex.message)
        }
    },
    
    
    init:function(){
    	 
    	//qc:11345  begin 获取url地址判断是否是外围接入的
     	 var inModeCode =$("inModeCode")? $getV("inModeCode"):"-1";
    	if (inModeCode==null||inModeCode!=1){
    	Cs.Ajax.register("needchkcusttradetype", function(node){
    		var tradetypecodes=node.getAttribute("RESULT");
        	var tradetypecode="-1";
        	if($("_TRADE_TYPE_CODE")){
        		tradetypecode ='|'+$F("_TRADE_TYPE_CODE")+'|';
            }else if($("_TRADE_TYPE_CODE_CP")){
            	tradetypecode='|'+$F("_TRADE_TYPE_CODE_CP")+'|';
            }
            var win = new Cs.flower.Win();
            if(tradetypecodes.indexOf(tradetypecode)>=0){
            	_NEED_CHK_CUST=true;

            	//qc:95873 begin
            	if($("_TRADE_TYPE_CODE") && "100" == $F("_TRADE_TYPE_CODE") && $("cond_REMOVE_TAG") && "YES"==$("cond_REMOVE_TAG").value)
	            {
		          _NEED_CHK_CUST=false;
	            }
	            //qc:95873 end
	            
             
             
            	//tfs 125437 begin 
             //   alert($F("_MARK_FOR_REALITY_IDENTIFICATION"));
            	if($("_TRADE_TYPE_CODE") && "100" == $F("_TRADE_TYPE_CODE"))
	            {
            		var rightCode = "";
            		if($("_rightCode")) rightCode =  $F("_rightCode");
            		else if($("RIGHT_CODE")) rightCode = $F("RIGHT_CODE");
            	   
            		if(rightCode=="csChangeCustOwnerTrue") _NEED_CHK_CUST=false;
            		 
	            }
            	//tfs 125437 end
            	
             	
              	if(_NEED_CHK_CUST){
            		var cache = new Cs.flower.DataCache();
                    if (cache){
                    	var custInfo = cache.get("custInfo");
                    	 
                    	if (!custInfo||!custInfo.custId){
                    		win.error("请先创建客户或者对已有客户进行认证后<br>再办理此业务！", function(){
                    		closeNavFrameByLocation();
                    		if (parent.menuframe.HOLD_FIRST_PAGE)
                    			switchNavFrame(parent, "navmenu_0");
                    		});
                    		return;
                    	}else{
                    		//&&"101" != $F("_TRADE_TYPE_CODE") 
                    		if(custInfo&&$("SERIAL_NUMBER")){
                    			var custId1=custInfo.custId;
                    			// alert("custId1"+custId1);
                    			
                    			var custId2=node.getAttribute("CUSTID");
                    			if( custId1!=$F('_CUST_ID') && $F('_CUST_ID')!="" ){
                    				win.error("认证的客户不是此号码的客户<br>请重新认证！", function(){
                                		closeNavFrameByLocation();
                                		if (parent.menuframe.HOLD_FIRST_PAGE)
                                			switchNavFrame(parent, "navmenu_0");
                                		});
                                		return;
                    			}
                    			
                    		}
                    	}

                    }
                	
                }  
            }
        	
        
                } );	
    	
    	var serialnumber="";
		if($("SERIAL_NUMBER"))
		{
		 serialnumber=$F("SERIAL_NUMBER");}
		// alert("serialnumber"+serialnumber);
		var netTypeCode="";
		if($("NET_TYPE_CODE")){
		var netTypeCode=$F("NET_TYPE_CODE");
		}
		
		if($("_TRADE_TYPE_CODE")){
		var tradeTypeCode=$F("_TRADE_TYPE_CODE");
		}           
		// alert("netTypeCode"+netTypeCode);
		try{
        	Cs.Ajax.swallowXml("common.UtilityPage", "needChkCust",  "&SERIAL_NUMBER="+serialnumber+"&NET_TYPE_CODE="+netTypeCode+"&TRADE_TYPE_CODE=" +tradeTypeCode +"&judge=1", "正在获取校验配置信息，请稍候...", false);
		}catch(e){
			;
		}

    	}//qc:11345 end 
		
        $A(document.getElementsByTagName("FORM")).map(Form.getElements).flatten().each(function(element){
            
            if (Cs.ctrl.Web.mustFillCheck == "yes" && element.required == "true"){
                Cs.ctrl.Validate.initMustFill(element);
            }
            
            if  (Cs.ctrl.Web.dataValidateCheck == "yes" && typeof element.checkdata == "string"){
                Cs.ctrl.Web.addValidateListener(element);
            }else if (Cs.ctrl.Web.dataValidateCheck == "yes" && element.datatype == "date"){
	    		element.checkdata="date";
                Cs.ctrl.Web.addValidateListener(element);
            }
            
            if (Cs.ctrl.Web.lookupComboCheck=="yes" && element.lookupCombo == "true" && element.id.slice(-5) == "$dspl"){
                Cs.ctrl.Web.addLookupComboListener(element);
            }
            
            if (Cs.ctrl.Web.formLockCheck=="yes" && element.tagName.toLowerCase() == "input" && ["submit","image"].include(element.type.toLowerCase())){
                Cs.ctrl.Web.addFormSubmitListener(element);
            }
            
            if (Cs.ctrl.Web.hotkeyCheck=="yes"&&typeof element.hotkey=="string"){
                Cs.ctrl.Web.addHotkeyElement(element.hotkey.toLowerCase(), element);
                if (element.tagName.toLowerCase()=="input"&&element.type&&["submit","button"].include(element.type.toLowerCase())){
                    var s=[];s.push(element.value);s.push("[");s.push(element.hotkey.toUpperCase());s.push("]");
                    element.value=s.join("");
                }
            }
            
        });

        if (typeof initChildInterface != 'undefined' && initChildInterface instanceof Function) 
            initChildInterface();
                
        Cs.ctrl.Web.hideInfo();
        
        if($("SERIAL_NUMBER")){
			try{
				$("SERIAL_NUMBER").focus();
			}catch(e){};
		}

    },
    
    needChkCustAfter:function(){
      	if(_NEED_CHK_CUST){
    		var cache = new Cs.flower.DataCache();
            if (cache){
            	var custInfo = cache.get("custInfo");
            	if (!custInfo||!custInfo.custId){
            		win.error("请先创建客户或者对已有客户进行认证后<br>再办理此业务！", function(){
            		closeNavFrameByLocation();
            		if (parent.menuframe.HOLD_FIRST_PAGE)
            			switchNavFrame(parent, "navmenu_0");
            		});
            		return false;
            	}else{
	    			var custId1=custInfo.custId;
	    			if( custId1!=$F('_CUST_ID') && $F('_CUST_ID')!="" ){
	    				win.error("认证的客户不是此号码的客户<br>请重新认证！", function(){
	                		closeNavFrameByLocation();
	                		if (parent.menuframe.HOLD_FIRST_PAGE)
	                			switchNavFrame(parent, "navmenu_0");
	                		});
	        			return false;
            		}
            	}
            }
        }  
      	return true;
    },
    
    addHotkeyElement:function(key,element){
        Cs.ctrl.Web._hotkeys[key]=element;
    },
    
    hotkeyAction:function(event){
        if (!event.ctrlKey||event.keyCode==17) return; //alt被IE用了一大半，shift小写转大写,看来只能用ctrl了.
        
        var ele = Cs.ctrl.Web._hotkeys[String.fromCharCode(event.keyCode).toLowerCase()];
        if(ele){
            if (ele.disabled) return;
            if (ele.tagName.toLowerCase()=="input"&&ele.type&&["submit","button","image"].include(ele.type.toLowerCase())){
                ele.focus();
                ele.click();
            }
        }
    },
    
    enter2Tab:function(event){
        if (event.keyCode == Event.KEY_RETURN){
            
            element = Event.element(event);
            if (element.tagName.toLowerCase() == "input"  && (element.type.toLowerCase() == "submit" ||  element.type.toLowerCase() == "button"))
                return;
            
            if (element.tagName.toLowerCase() == "textarea")
                return;
            
            if (element.tagName.toLowerCase() == "input"  && element.lookupCombo)
                return;
            
            event.keyCode = Event.KEY_TAB;   
        }
        else
            Cs.ctrl.Web.hotkeyAction(event);
    },
    
    unlockForm:function(element){
        setTimeout(function(){element.form.locked = false}, 100);
    },
    
    getTradeGlobal:function(){
        if ($("_tradeGlobal") != null){
            return $("_tradeGlobal").innerHTML.evalJSON();
        }
        throw new Error("页面数据不全!");
        return null; 
    },
    
    setTradeGlobal:function(g){
        if ($("_tradeGlobal") != null){
            $("_tradeGlobal").innerHTML = Object.toJSON(g);
        }
        else
        {
            var tradeGlobal = document.createElement("span");
            tradeGlobal.style ="display:none";
            tradeGlobal.id = "_tradeGlobal";
            tradeGlobal.innerHTML = Object.toJSON(g);
            document.body.appendChild(tradeGlobal);
        }
    },
    
    dealScriptMessage:function(xml){
         if (xml.childNodes.length>0)
         {
            option = {}
            option.xml = xml;
            option.ok = function(){
                if (this.okFunc && !this.okFunc.blank())
                    Function(this.okFunc).bind(window)();
                this.xml.removeChild(this.xml.childNodes[0]); 
                Cs.ctrl.Web.dealScriptMessage(this.xml)
            }
            option.cancel = function(){
                if (this.cancelFunc && !this.cancelFunc.blank())
                    Function(this.cancelFunc).bind(window)();
                this.xml.removeChild(this.xml.childNodes[0]); 
                Cs.ctrl.Web.dealScriptMessage(this.xml)
            }
            for(var i=0; i < xml.childNodes[0].attributes.length; i++)
            {
                if  (xml.childNodes[0].attributes[i].name == "type")
                	option.type = xml.childNodes[0].attributes[i].value;
                else if (xml.childNodes[0].attributes[i].name == "message")
                	option.message = xml.childNodes[0].attributes[i].value;
                else if (xml.childNodes[0].attributes[i].name == "ok")
                    option.okFunc = xml.childNodes[0].attributes[i].value;
                else if (xml.childNodes[0].attributes[i].name == "cancel")
                	option.cancelFunc = xml.childNodes[0].attributes[i].value;
                else if (xml.childNodes[0].attributes[i].name == "lightName")
                	option.lightName = xml.childNodes[0].attributes[i].value;
                else if (xml.childNodes[0].attributes[i].name == "afterLight")
                	option.afterLight = xml.childNodes[0].attributes[i].value;
                else if (xml.childNodes[0].attributes[i].name == "extString")
                	option.extString = xml.childNodes[0].attributes[i].value;
                else if (xml.childNodes[0].attributes[i].name == "leftEdge")
                	option.leftEdge = xml.childNodes[0].attributes[i].value;
                else if (xml.childNodes[0].attributes[i].name == "lightNum")
                	option.lightNum = xml.childNodes[0].attributes[i].value;
            }
            var win = new Cs.flower.Win();
            
            if (option.type == "confirm")
    		    win.confirm(option.message, option);
    		else if (option.type == "error")
    		    win.error(option.message, function(){return option.ok()});
    		else if(option.type == "confirmLight"){//带场景提示框，add by zhangyangshuo
    			win.confirmLight(option.message, option);
    		}else
    		    win.alert(option.message, function(){return option.ok()});
         }
    },
    
    encodeExtraProperty:function(tname,propType,isCamelize){
        if(typeof(isCamelize)=="undefined") isCamelize = false;
        if(isCamelize==true)
        {           
            isCamelize = true;
        }
        else
        {
            isCamelize = false;
        }
        if(typeof tname != "string") tname="";
	    var tempo = {};
	    $A(document.getElementsByTagName("FORM")).map(Form.getElements).flatten().each(function(element){
	    	if(typeof(element.zbpropertyname)=="string" && (tname.blank() || element.zbtablename == tname) && (!propType || propType.blank() || element.elementtype == propType)){
	    		if(typeof(element.lookupCombo)=="string" || typeof(element.lookupTree)=="string")
	    		{
	    			//日期框的内容=格式，则清空 add by suiqian,2011-09-11
	    			if($("IMG_CAL_"+element.id) && element.format){
	    				if(element.value == element.format.toLowerCase())
	    					$(element.valueId).value = "";
	    			}
	    				
	    			if(isCamelize)
	    				tempo[element.zbpropertyname.toCamelize()]=$(element.valueId).value
	    			else	    			
	    				tempo[element.zbpropertyname]=$(element.valueId).value;
	    		}
	    		else
	    		{
	    			if(isCamelize)
	    				tempo[element.zbpropertyname.toCamelize()]=element.value;
	    			else
	    				tempo[element.zbpropertyname]=element.value;
	    		}
	    	}
	    	
	    	});
	    return tempo;
    },

    $P:function(propName,tname,s){
        if(typeof propName != "string") return;
        var o = document.getElementsByTagName("FORM")
    	if(typeof s == "string"){
    		o = $(s)?$(s).all:o //for speed. add by chengj
    	}
    	return $A(o).map(Form.getElements).flatten().find(function(element){
    		return (typeof(element.zbpropertyname)=="string" && element.zbpropertyname ==propName &&(!tname || tname.blank() || element.zbtablename == tname))
    	});
    },

    bindFunc:function(EleName,MethodName,FuncName){
        if(typeof EleName == "string")
        {
            $A(document.getElementsByTagName("FORM")).map(Form.getElements).flatten().each(function(element){
    		    if(typeof(element.zbpropertyname)=="string" && element.zbpropertyname ==EleName)
    		    {
    		        if(element.lookupCombo=="true" && MethodName=="onrealvaluechange") 
    		            element.onrealvaluechange = FuncName;
                    else		            
    		            element.observe(MethodName , FuncName);
    		    }
    		});
        }
        else
        {
            if(EleName.lookupCombo=="true" && MethodName=="onrealvaluechange") 
                EleName.onrealvaluechange = FuncName;
            else
                EleName.observe(MethodName , FuncName);
        }
    },
    
    $B:this.bindFunc,
    
    getElements: function(parent) {
        return $A($(parent).getElementsByTagName('*')).inject([],
            function(elements, child) {
                if (Form.Element.Serializers[child.tagName.toLowerCase()])
                    elements.push(Element.extend(child));
                return elements;
            }
        );
    },
    
    clear:function(parent) {
        var combo=[];
        Cs.ctrl.Web.getElements(parent).each(function(element){
            if (!element.visible()) return; //不可见的不修改.考虑会存放一些参数
            if (element.tagName.toLowerCase()=="input"){
                if (element.lookupComboValue) combo.push(element);
                if (element.type=="hidden") return;  //不可见的不修改.考虑会存放一些参数
                if (element.type=="text") element.clear();
				if (element.type=="checkbox") element.checked=false;
            }
        });
        
        combo.each(function(element){$(element.displayId).onrealvaluechange="";Cs.flower.LookupCombo.setValue(element, "")});
        
    },
    
     /**
    *  屏蔽快捷键 配合hotKey使用
    */
    keyDown:function() {
		var keyCodeArr = "Q,W,E,R,T,A,S,D,G,Z,B".split(",");
	
		if(event.ctrlKey) {
			for(var i = 0; i < keyCodeArr.length; i ++) {
				if(String.fromCharCode(event.keyCode) == keyCodeArr[i]) {
					return false;
				}
			}
		}
    },
    
    ctrlArea:function(areaId,disabled)
    {
    	$A($(areaId).all).each(function(element){
			if(element.tagName.toUpperCase()=="INPUT"||element.tagName.toUpperCase()=="IMG")
			{
				if(disabled&&!element.disabled)
				{
					element.setAttribute("_lock",true);
					element.disabled = true;
				}
				
				if(disabled==false&&element.getAttribute("_lock")==true)
				{
					element.disabled=false;
					element.setAttribute("_lock",false)
				}
			}
		})
    },
    
    disableArea:function(areaId)
    {
    	Cs.ctrl.Web.ctrlArea(areaId,true);
    },
    
    enableArea:function(areaId)
    {
    	Cs.ctrl.Web.ctrlArea(areaId,false);
    }     
    
    
}

Cs.Ajax._dealSet["message"]=Cs.ctrl.Web.dealScriptMessage;
Cs.Ajax._dealSet["$error"]=Prototype.emptyFunction;
/**
 * 校验
 */
Cs.ctrl.Validate = {
    
    alertPressErr:false,
    
    _mustFillElms:[],
    
    checkEditAlert:function (edit,msg){
    	var win = new Cs.flower.Win();
	    if(_EditChkIEWin){
	    	//edit.value = "";
	        win.alert(msg, function(){
	            edit.focus();
	            edit.select();
	            }); 
	    }
	    else{
	        win.alert(msg, function(){
	            edit.focus();
	            edit.select();
	            });        
	    }    
	},
    addListener:function(element){
        var elt = $(element);
        if( elt.checkdata == undefined) return;
        var checkers = elt.checkdata.split(",");
                
        if (checkers.length == 0) return;
         
        var allKeys = ["isalnum", "isalpha", "isdigit",
                        "islower", "isupper","isinteger",
                        "isdouble","ispinteger",
                        "isemail", "ispsptid0", "isphone",
                        //QC 32635 begin 统一版本合并
                        "isphone0","isnotalldigit",
                        //QC 32635 end 统一版本合并          
                        "agreementchecktab", //托收协议编码限制 TFS 201456
                        "thelength", "minlength","maxlength", 
                        "maxvalue", "minvalue", "isipaddr",
	    				"date","regexp","isalnumchina","illegalStr","issuperalnumschina","issdnum","illegalStrbz","ispercenttage"];
         
        if (checkers.any(function(checker){
           return ["isalnum", "isalpha", "isdigit", "ispsptid0",
                    "islower", "isupper","isinteger","isdouble","ispinteger",
                    "illegalStr","maxlength", "thelength","issuperalnumschina","issdnum","illegalStrbz"].include(checker.split("=")[0].strip())
        }))
        {
            elt.observe('keypress' , Cs.ctrl.Validate.editKeyPress);
        }
        
        if (checkers.any(function(checker){
           return allKeys.include(checker.split("=")[0].strip())
        }))
        {
            var func = elt.onblur;
            elt.onblur = function(){
                if (!Cs.ctrl.Validate.editBlur(event)) return false;
                if (func instanceof Function)
                    func.bind(elt)();
                return true;
            }
        }
    },
    
    editKeyPress:function(event){
    	var win = new Cs.flower.Win();
        if(Cs.ctrl.Validate.alertPressErr)
        {
            try
            {
               return Cs.ctrl.Validate._editKeyPress(event);
            }
            catch(e)
            {
                Event.stop(event); 
                win.alert(e.message);
                event.srcElement.focus();
                return false;
            }
        }
        else
        {
            return Cs.ctrl.Validate._editKeyPress(event);
        }
    },
    
    _editKeyPress:function(event){
        var edit  = Event.element(event);
    
        if ([ 27, Event.KEY_RETURN ].include(event.keyCode)) return;
        
        var checkers = edit.checkdata.split(",");
        
        var curStr,newStr;
        
        if (event.type == "keypress")
        {
            curStr = String.fromCharCode(event.keyCode);
            var tmp =document.selection.createRange()
            if(edit.tagName == "TEXTAREA")
            {
                var rng =document.body.createTextRange();
                rng.moveToElementText(edit);
	            tmp.setEndPoint("StartToStart",rng);
            }
            else
            {
            	tmp.setEndPoint("StartToStart",edit.createTextRange())
            }
            var len=tmp.text.length;
            newStr = $F(edit).substring(0,len)+curStr+$F(edit).substring(len)
        }
        else
        {
            curStr = $F(edit);
            newStr = $F(edit);
        }

        if (checkers.include("isdigit")){
            if (!/^\d*$/.test(curStr))
            {
                Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输入数字!");
                else
                    return false;
            }
        }
        
        //begin add by wangwp 2011-10-10  山东省份固网serial_number有些有@符号
        if (checkers.include("issdnum"))
        {
        
        
        	if (!/^[A-Za-z0-9@\\.\\_\\-]*$/.test(curStr))
        	{
        		Event.stop(event);
        		this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 请输入正确的数据！(只能包含数字、字母或者\"@\"符或.)");
                else
                    return false;
        	}
        }
        //end add by wangwp 2011-10-10
        
        if (checkers.include("isalnum")){
            if (!/^\w*$/.test(curStr))
            {
                Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输入数字或字母!");
                else
                    return false;
            }
        }
        
        if (checkers.include("isalnumchina")){
            if (!/^\w*$/.test(curStr))
            {
                if(/^[u4E00-u9FA5]+$/.test(curStr) || /([{}｛｝~·！!@#￥$%&*（）^'。，"()`=+,.?<>-]|\\|\/)/.test(curStr))
                {
                	   Event.stop(event);
                	   this.showVerColor(edit);
		                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
		                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输中文数字或字母!");
		                else
		                    return false;
		                   
                }
            }
        }
        //QC:15226 Begin 统一版本合并
        if($("N6_15226_TAG_CODE")&&$("N6_15226_TAG_CODE").value=="1"){ 
	        if (checkers.include("ishnalnumchina")){
	            if (!/^\w*$/.test(curStr))
	            {
	                if(/^[u4E00-u9FA5]+$/.test(curStr) || /([{}｛｝~·！!@#￥$%&*（）^'。，"()`=+,.?<>]|\\|\/)/.test(curStr))
	                {
	                	   Event.stop(event);
	                	   this.showVerColor(edit);
			                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
			                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输中文数字字母横杠!");
			                else
			                    return false;
			                   
	                }
	            }            
	        }        
        }   
        //QC:15226 End 统一版本合并
        //begin add by zhoubl 辽宁，客户创建要求能输入-
        if (checkers.include("islncreatecust"))
        {
        
        
        	if (!/^[A-Za-z0-9\\-]*$/.test(curStr))
        	{
        		Event.stop(event);
        		this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 请输入正确的数据！(只能包含数字、字母或者-)");
                else
                    return false;
        	}
        }
        //end add by zhoubl 辽宁，客户创建要求能输入-
        //Add By Zhu_ZhiMin On : 2011-09-23 Remark : 增加辽宁的业务号码超级检测
        if (checkers.include("issuperalnumschina")){
        
            if (!/^\w*$/.test(curStr))
            {
        
                if((/^[u4E00-u9FA5]+$/.test(curStr) && !/^[@]+$/.test(curStr)) || /([{}|｛｝~·！!#￥$%&*（）^'。，"()`=+,?<>]|\\|\/)/.test(curStr))
                {
                	   Event.stop(event);
        				this.showVerColor(edit);
        				
        				if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
		                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ "：只能输中文数字或字母或@或点号!");
		                else
		                    return false;
		                   
                }
            }
        }
        
        //QC12253 begin 统一版本合并 北京号码中 有包含 符号/ 的号码 去掉/的限制
        if (checkers.include("issuperalnumschinaBJ")){
        
            if (!/^\w*$/.test(curStr))
            {
        
                if((/^[u4E00-u9FA5]+$/.test(curStr) && !/^[@]+$/.test(curStr)) || /([{}|｛｝~·！!#￥$%&*（）^'。，"()`=+,?<>]|\\)/.test(curStr))
                {
                	   Event.stop(event);
        				this.showVerColor(edit);
        				
        				if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
		                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ "：只能输中文数字或字母或@或点号!");
		                else
		                    return false;
		                   
                }
            }
        }
        //QC12253 end 统一版本合并     
        
        if (checkers.include("isChinaletter")){
            if (!/^\w*$/.test(curStr)|| /\d/.test(curStr))
            {
                if(/^[u4E00-u9FA5]+$/.test(curStr) || /([{}｛｝~·！!@#￥$%&*（）^'。，"()`=+,.?<>-]|\\|\/)/.test(curStr) || /\d/.test(curStr))
                {
                	   Event.stop(event);
                	   this.showVerColor(edit);
		                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
		                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输中文，字母!");
		                else
		                    return false;
		                   
                }
            }
        }
        //辽宁有带括号的 add by dujx2
        if (checkers.include("isChinaletterForLiaoning")){
            if (!/^\w*$/.test(curStr)|| /\d/.test(curStr))
            {
                if(/^[u4E00-u9FA5]+$/.test(curStr) || /([{}｛｝~·！!@#￥$%&*^'。，"`=+,.?<>-]|\\|\/)/.test(curStr) || /\d/.test(curStr))
                {
                	   Event.stop(event);
                	   this.showVerColor(edit);
		                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
		                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输中文，字母!");
		                else
		                    return false;
		                   
                }
            }
        }
        
      //QC:14598 Begin
        //由于辽宁需要客户名称中带有数字和.，一次添加新的校验
        if (checkers.include("isChinaletterForBeijingHavePoint")){
            if (!/^\w*$/.test(curStr)|| /\d/.test(curStr))
            {
                if(/^[u4E00-u9FA5]+$/.test(curStr) || /([{}｛｝~·！!@#￥$%&*^'。，"`=+,?<>-]|\\|\/)/.test(curStr))
                {
                	   Event.stop(event);
                	   this.showVerColor(edit);
		                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
		                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输中文，字母，数字或者点号!");
		                else
		                    return false;
		                   
                }
            }
        }
      //QC:14598 End
        
        //qc：01781 begin    山东有带括号的 
        if (checkers.include("isChinaletterForShandong")){
            if (!/^\w*$/.test(curStr)|| /\d/.test(curStr))
            {
                if(/^[u4E00-u9FA5]+$/.test(curStr) || /([{}｛｝~·！!@#￥$%&*^'。，"`=+,.?<>-]|\\|\/)/.test(curStr) || /\d/.test(curStr))
                {
                	   Event.stop(event);
                	   this.showVerColor(edit);
		                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
		                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输中文，字母!");
		                else
		                    return false;
		                   
                }
            }
        }
        //qc：01781 end 
        //由于辽宁需要客户名称中带有数字，一次添加新的校验  || /\d/.test(curStr)
        if (checkers.include("isChinaletterForLiaoningHaveDigtal")){
            if (!/^\w*$/.test(curStr)) 
            {
                if(/^[u4E00-u9FA5]+$/.test(curStr) || /([{}｛｝~·！!@#￥$%&*^'。，"`=+,.?<>-]|\\|\/)/.test(curStr))
                {
                	   Event.stop(event);
                	   this.showVerColor(edit);
		                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
		                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输中文，字母，数字!");
		                else
		                    return false;
		                   
                }
            }
        }
        if (checkers.include("isalpha")){
            if (!/^\w*$/.test(curStr) || /\d/.test(curStr))
            {
                Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输入字母!");
                else
                    return false;
            }
        }
        
        if (checkers.include("islower")){
            if (/^[A-Z]$/.test(curStr))
            {
                if (event.type == "keypress")
                    event.keyCode = event.keyCode + 97 - 65;
                else
                {
                	this.showVerColor(edit);
                    if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                        throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输入小写字母!");
                    else
                        return false;
                }
            } 
        }
        
        if (checkers.include("isupper")){
            if (/^[a-z]$/.test(curStr))
            {
                if (event.type == "keypress")
                    event.keyCode = event.keyCode - 97 + 65;
                else
                {
                	this.showVerColor(edit);
                    if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                        throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输入大写字母!");
                    else
                        return false;
                }
            } 
        }
        
        if (checkers.include("isinteger")){
            if (!/^(-)?\d*$/.test(newStr))
            {
                Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输入整数!");
                else
                    return false;
            } 
        }
        
        if (checkers.include("isdouble")){
            if (!/^(-)?(\d)+(\.)?(\d)*$/.test(newStr))
            {
                Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输入数字!");
                else
                    return false;
            } 
        }
        if(checkers.include("ispinteger")){
	        if (!/^\d+$/.test(newStr)) {
	            Event.stop(event);
	            this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输入大于或等于零的整数!");
                else
                    return false;
			}
        }
        if (checkers.include("xmlcheck")){
            if(/^['"<>&]+$/.test(curStr))
            {
                Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ "  不能输入以下非法字符\'\"<>&!");
                else
                    return false;
            } 
        }
        if (checkers.include("checkspec")){
            if(/[%]+/.test(curStr))
            {
                Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ "  不能输入以下非法字符'%'");
                else
                    return false;
            } 
        }
        if (checkers.include("illegalStr")){
            if(/^.*[·#￥%……\-*（）]+.*$/g.test(newStr))
            {
                Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ "  不能输入以下非法字符·#￥%……—*（）");
                else
                    return false;
            }      
        }
        
        if (checkers.include("illegalStrbz")){
           		 if(/^.*[￥%……&*]+.*$/g.test(newStr))
            {
                Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ "  不能输入以下非法字符￥%……&*");
                else
                    return false;
            } 
       }
        
       
        if (checkers.include("ispercenttage")){
            if (!/^(\d)+(\.)?(\d)*$/.test(newStr))
            {
                Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 只能输入数字!");
                else
                    return false;
            } 
            
            var vk = parseInt(newStr);
            
            if(vk>100||vk<0){
            	Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ " 百分数介于0和100之间!");
                else
                    return false;
            }
        }
        
        
        
        
        if (checkers.any(function(checker){ 
            return ["thelength", "maxlength"].include(checker.split("=")[0].strip())}))
        {
            var checker = checkers.find(function(checker){ 
                if (checker.startsWith("maxlength")) return true;
                else if (checker.startsWith("thelength")) return true;
                 })
            var l = parseInt(checker.split("=")[1]);
        
            if (newStr.length > l)
            {
                Event.stop(event);
                this.showVerColor(edit);
                if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
                    throw new Error(Cs.ctrl.Validate.getDesc(edit)+ (checker.startsWith("maxlength")?" 最大长度为 ":" 长度必须为 ")+ l);
                else
                    return false;
            }
        }   
        this.hideVerColor(edit);
        return true;
    },
    
    editBlur:function(event){
        var edit  = Event.element(event);
    
        if ($F(edit).length == 0) return true;
        
        var checkers = edit.checkdata.split(",");
        
        var win = new Cs.flower.Win();
        
        if (checkers.include("ispsptid0")){
            if ($F(edit).length != 15 && $F(edit).length != 18) {
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+"身份证长度不正确！"); 
                return false;
            }
			var result = Cs.ctrl.Validate.isIdCardNo(edit.value);
			if( result != ""){
				Event.stop(event);
				this.showVerColor(edit);
				if (event.type=="blur"||Cs.ctrl.Validate.alertPressErr)
				{
					Cs.ctrl.Validate.checkEditAlert(edit,result);
				}
                return false;
			}
        }
        
        //邮件格式检查
        if (checkers.include("isemail")){
            if ($F(edit).length > 0 && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($F(edit)))
            {
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+"必须为EMail格式！"); 
                return false;
            }
        }
        
        //电话号码检查
        //20110923 modify by wuxg
        if (checkers.include("isphone")){
            if (!/^[\d-]{7,}$/.test($F(edit))){
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+" 请输入正确的数据！(只能包含数字或者\"-\"符,并且长度大于7位)"); 
                return false;
            }
        }
        
        //qc 32635 begin 统一版本合并
        //联系电话检查
        if (checkers.include("isphone0")){
            if (!/^[\d-,]{6,}$/.test($F(edit))){
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+" 请输入正确的数据！(只能包含数字、[-]和[,],并且长度大于等于6位)！"); 
                return false;
            }
        }     
        //不能全为数字
        if (checkers.include("isnotalldigit")){
            if (/^\d*$/.test($F(edit)))
            {
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+" 不能全为数字！"); 
                return false;
            }
        }        
        //qc 32635 end 统一版本合并         
        
        //托收 禁止输入空格、逗号、TAB键 TFS 201456
        if (checkers.include("agreementchecktab")){
            if ((/[,]+/.test($F(edit))) || (/[，]+/.test($F(edit))) || (/[ ]+/.test($F(edit))) || (/[\t]+/.test($F(edit))) || (/[　]+/.test($F(edit))))
            {
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+" 托收协议号禁止输入空格、逗号、TAB键！"); 
                return false;
            }
        }      
        
        //Ip address
        if (checkers.include("isipaddr")){
            if (!/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/.test($F(edit))){
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+" 请输入正确的IP地址!"); 
                return false;
            }
        }
        
        if (checkers.any(function(checker){ 
            return "thelength" == checker.split("=")[0].strip()})){
            var checker = checkers.find(function(checker){ 
                if (checker.startsWith("thelength")) return true;
                 })
            var l = parseInt(checker.split("=")[1]);
            
            if ($F(edit).length > 0 && $F(edit).length != l)
            {
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+" 长度必须为"+l+"！");
                return false;
            }
        }
        
        if (checkers.any(function(checker){ 
            return "minlength" == checker.split("=")[0].strip()})){
            var checker = checkers.find(function(checker){ 
                if (checker.startsWith("minlength")) return true;
                 })
            
            var l = parseInt(checker.split("=")[1]);
            
            if ($F(edit).length > 0 && $F(edit).length < l)
            {
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+" 最小长度不能低于"+l+"！");
                return false;
            }
        }
        
        if (checkers.any(function(checker){ 
            return "maxvalue" == checker.split("=")[0].strip()})){
            var checker = checkers.find(function(checker){ 
                if (checker.startsWith("maxvalue")) return true;
                 })
            var l = checker.split("=")[1];
            
            if ($F(edit).length > 0 && parseInt($F(edit),10) > parseInt(l,10))
            {
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+" 不能大于 "+l+"！");
                return false;
            }
        }
        
        if (checkers.any(function(checker){ 
            return "minvalue" == checker.split("=")[0].strip()})){
            var checker = checkers.find(function(checker){ 
                if (checker.startsWith("minvalue")) return true;
                 })
            var l = checker.split("=")[1];
            
            if ($F(edit).length > 0 && parseInt($F(edit),10) < parseInt(l,10))
            {
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+" 不能小于 "+l+"！");
                return false;
            }
        }
        
        if (checkers.include("regexp")){
            var expression = $(edit).expr;
			var hint = $(edit).explain!=null?$(edit).explain:"";
            var re = new RegExp(expression);
            if (!re.test($F(edit))){
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+" 请输入正确格式的数据！"+hint); 
                return false;
            }
        }
        
	    
	    if (checkers.any(function(checker){ 
            return "date" == checker.split("=")[0].strip()})){
            var checker = checkers.find(function(checker){ 
                if (checker.startsWith("date")) return true;
                 })
            var fmt = checker.split("=")[1];
	    	if (fmt==null||fmt.blank()){
	    		fmt = edit.format||"";
	    	}
	    	
	    	var expression;
	    	switch(fmt){
	    		case "yyyy":
	    		expression = /^(\d{1,4})$/;
	    		break;
	    	case "yyyyMM":
	    		expression = /^(\d{1,4})(\d{1,2})$/;
	    		break;
	    	case "yyyy-MM":
	    		expression = /^(\d{1,4})(-|\/)(\d{1,2})$/;
	    		break;
	    	case "yyyy/MM":
	    		expression = /^(\d{1,4})(\/|\/)(\d{1,2})$/;
	    		break;
	    	case "yyyyMMdd":
	    		expression = /^(\d{1,4})(\d{1,2})(\d{1,2})$/;
	    		break;
	    	case "yyyy-MM-dd":
	    		expression = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
	    		break;
	    	case "yyyy/MM/dd":
	    		expression = /^(\d{1,4})(\/|\/)(\d{1,2})\2(\d{1,2})$/;
	    		break;
	    	case "HH":
	    		expression = /^(\d{1,2})$/;
	    		break;
	    	case "HHmm":
	    		expression = /^(\d{1,2})(\d{1,2})$/;
	    		break;
	    	case "HH:mm":
	    		expression = /^(\d{1,2})(:)?(\d{1,2})$/;
	    		break;
	    	case "HHmmss":
	    		expression = /^(\d{1,2})(\d{1,2})(\d{1,2})$/;
	    		break;
	    	case "HH:mm:ss":
	    		expression = /^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/;
	    		break;
	    	case "yyyyMMdd HH":
	    		expression = /^(\d{1,4})(\d{1,2})(\d{1,2}) (\d{1,2})$/;
	    		break;
	    	case "yyyy-MM-dd HH":
	    		expression = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2})$/;
	    		break;
	    	case "yyyy/MM/dd HH":
	    		expression = /^(\d{1,4})(\/|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2})$/;
	    		break;
	    	case "yyyyMMdd HHmm":
	    		expression = /^(\d{1,4})(\d{1,2})(\d{1,2}) (\d{1,2})(\d{1,2})$/;
	    		break;
	    	case "yyyy-MM-dd HH:mm":
	    		expression = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
	    		break;
	    	case "yyyy/MM/dd HH:mm":
	    		expression = /^(\d{1,4})(\/|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
	    		break;
	    	case "yyyyMMdd HHmmss":
	    		expression = /^(\d{1,4})(\d{1,2})(\d{1,2}) (\d{1,2})(\d{1,2})(\d{1,2})$/;
	    		break;
	    	case "yyyy-MM-dd HH:mm:ss":
	    		expression = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	    		break;
	    	case "yyyy/MM/dd HH:mm:ss":
	    		expression = /^(\d{1,4})(\/|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	    		break;
	    	}
	    	if($F(edit).length == 8) 
	    		$(edit).value = $F(edit).substring(0,4) + "-" + $F(edit).substring(4,6)  + "-" + $F(edit).substring(6,8) ;
	    	
	    	if ($F(edit).length!=fmt.length||!expression.test($F(edit)))
	    	{
                Event.stop(event);
                this.showVerColor(edit);
                Cs.ctrl.Validate.checkEditAlert(edit,Cs.ctrl.Validate.getDesc(edit)+" 格式不正确！格式:"+fmt); 
                return false;
            }
        }
        
	    var chkresult = true;
        try{
            chkresult = Cs.ctrl.Validate._editKeyPress(event);
        }catch(e){
            Event.stop(event);
            this.showVerColor(edit);
            Cs.ctrl.Validate.checkEditAlert(edit,e.message);
            return false;
        }
        if(chkresult){
        	this.hideVerColor(edit);
        }
        
        return true&&chkresult;
    },
    
    getDesc:function(element){ 
        if (element.desc)
            return element.desc;
        else if(element.parentNode.previousSibling&&element.parentNode.previousSibling.innerText!="")
            return element.parentNode.previousSibling.innerText;
        else
        	return element.parentNode.parentNode.previousSibling.innerText;
    },
    
    showMustFillTag:function(parent){
        parent = parent || document;
        
    	Cs.ctrl.Validate._mustFillElms.clear();
    	
        $A(parent.getElementsByTagName("*")).each(function(element){
            
            if (element.required == "true"){
                if (element.lookupCombo == "true" && element.nextSibling && element.nextSibling.tagName.toLowerCase() == "img"){
                    if  (!element.nextSibling.nextSibling || element.nextSibling.nextSibling.innerText != "*")
                        new Insertion.After(element.nextSibling, "<span class=\"e_red\">*</span>");    
                }
                else if  (!element.nextSibling || element.nextSibling.innerText != "*")
                {
                    new Insertion.After(element, "<span class=\"e_red\">*</span>");
                }
	    		
	    		Cs.ctrl.Validate._mustFillElms[Cs.ctrl.Validate._mustFillElms.length] = element;
            }
            else if (element.required == "false") {
                if (element.lookupCombo == "true" && element.nextSibling && element.nextSibling.tagName.toLowerCase() == "img" 
                    && element.nextSibling.nextSibling && element.nextSibling.nextSibling.innerText && element.nextSibling.nextSibling.innerText.strip() == "*"){
                    $(element.nextSibling.nextSibling).remove();
                }
                if (element.nextSibling && element.nextSibling.innerText && element.nextSibling.innerText.strip() == "*")
                {
                    $(element.nextSibling).remove();
                }
	    		
	    		var idx = Cs.ctrl.Validate._mustFillElms.indexOf(element);
	    		if (idx != -1){
	    			Cs.ctrl.Validate._mustFillElms.splice(idx,1);
	    		}
            }
            
        });
    },
    
    setDisBackGroud:function(parent,color){
    parent = parent || document;
    	color = color||"lightgrey";
        $A(parent.getElementsByTagName("INPUT")).each(function(el){
                if(el.disabled ==true){
                	 el.style.backgroundColor=color;
                	//else $(el.id).style.backgroundColor=color;
                }else{
                	  //Modified By Zhu_ZhiMin On : 2011-07-16 Remark :ESS要求场景刷出框底色和其它一致
                	  //el.style.backgroundColor="lightyellow";
                	//else $(el.id).style.backgroundColor=color;
                
                }
            
        });
    },
    
    initMustFill:function(element){
    	try{
        if (element.lookupCombo == "true" && element.nextSibling && element.nextSibling.tagName.toLowerCase() == "img"){
            if  (!element.nextSibling.nextSibling || element.nextSibling.nextSibling.innerText != "*")
                new Insertion.After(element.nextSibling, "<span class=\"e_red\">*</span>");    
        }
        else if  (!element.nextSibling || element.nextSibling.innerText != "*")
        {
            new Insertion.After(element, "<span class=\"e_red\">*</span>");
        }
        }catch(e){
        }
	    
	    Cs.ctrl.Validate._mustFillElms[Cs.ctrl.Validate._mustFillElms.length] = element;
    },
    
    verifyElement:function(element,flag){

        if ( Cs.ctrl.Validate.needMustFillPrompt(element) ){
            
            if(element.id && element != $(element.id) ) return true;  //无效对象(可能已被replace/delete) by qmbin@2008-04-10
            if(!flag){
            	if (element.disabled == true) return true;
            }
            var fielddesc="";
            try
            {
                fielddesc = Cs.ctrl.Validate.getDesc(element);
            }catch(e) {;}
            
            
            Cs.ctrl.Web.hideInfo();
            
            var msg="";
            if(fielddesc == null || fielddesc == "" || fielddesc.length == 0){
            	
            	msg = "[id=" + element.id + "] 请输入内容"; //便于开发人员定位 qmbin@
            }else{
            	msg = ""+fielddesc+" 请输入内容";
            }
            
            var win = new Cs.flower.Win();
            win.alert(msg,function(){
                if (element.beforeFocus && element.beforeFocus != "")
                    Function(element.beforeFocus).bind(window)();
                try{element.focus();}catch(e){}
            });
            
         	this.showVerColor(element);
            return false;
        }
        this.hideVerColor(element);
        return true;
    },
    
    showVerColor:function(element){//add by zhangyangshuo
    	if(element&&element.style.borderColor!="#ff1100"){
    
            	element.bakborderColor= element.style.borderColor;
    
            	element.bakborderWidth = element.style.borderWidth;
    
            	element.bakcheck=true;
    
            	element.style.borderColor = '#ff1100';
    
                element.style.borderWidth  = "1px";
    
        }
    },
    
   hideVerColor:function(element){//add by zhangyangshuos
    	if(element&&element.style.borderColor=="#ff1100"&&element.bakcheck){
        	element.style.borderColor = element.bakborderColor||'';
            element.style.borderWidth  = element.bakborderWidth||'' ;
            element.bakcheck=null;
        }
    },
    
    verifyData:function(parent,flag){
        var result=true;
        
        Cs.ctrl.Web.getElements(parent).each(function(element){
            
            if (!Cs.ctrl.Validate.verifyElement(element,flag)){
                result = false;
                throw $break;
            }

        });
        if(!result){
        	return result;
        }else{
          if(parent.validateJS&&(parent.validateJS instanceof Function)){//add by zhangyangshuo
             result = parent.validateJS();
          }
        }
        return result;
    },
    
    verifyTradeData:function(){
        
        var result = true;
        
        Cs.ctrl.Validate._mustFillElms.each(function(element){
            
            if (!Cs.ctrl.Validate.verifyElement(element,true)){
                result = false;
                throw $break;
            }
                
        });
        
        return result;
    },
    
    needMustFillPrompt:function(element){
    	//日期框的内容=格式，则清空 add by suiqian,2011-09-11
		if($("IMG_CAL_"+element.id) && element.format){
			if(element.value == element.format.toLowerCase())
				element.value = "";
		}
		//select 的内容是否空present无法判断
		if(element.tagName.toLowerCase()=="select")
		{
			if(element.required == "true")
				return element.value.blank()?true:false;//return element.length==0?true:false;
		}
		else	 	
	        return element.required == "true" && (!element.present() || (element.lookupCombo == "true" && $(element.id.slice(0, -5))!=null && !$(element.id.slice(0, -5)).present() ) )&&(!(element.noCheck))
    },
	isIdCardNo:function(num)
    {
		var win = new Cs.flower.Win();
		var result = "";
        num=num.toUpperCase();
        
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。   
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)))
        {
            result = "输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。";
            return result;
        }
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
        //下面分别分析出生日期和校验位 
        var len,re;
        len=num.length;
        if(len==15)
        {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/); 
            
            var arrSplit=num.match(re);
            
            //检查生日日期是否正确 
            var dtmBirth=new Date('19'+arrSplit[2]+'/'+arrSplit[3]+'/'+arrSplit[4]);
            var bGoodDay;
            bGoodDay=(dtmBirth.getYear()==Number(arrSplit[2]))&&((dtmBirth.getMonth()+1)==Number(arrSplit[3]))&&(dtmBirth.getDate()==Number(arrSplit[4]));
            
            if(!bGoodDay)
            {
                result = '输入的身份证号里出生日期不对！';
            }
            else 
            {
                //将15位身份证转成18位 
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
				/*  屏蔽将15位转换成18位
                var arrInt=new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);
                var arrCh=new Array('1','0','X','9','8','7','6','5','4','3','2');
                var nTemp=0,i;
                num=num.substr(0,6)+'19'+num.substr(6,num.length-6);
                for(i=0;i<17;i++)
                {
                    nTemp+=num.substr(i,1)*arrInt[i];
                }
                num+=arrCh[nTemp%11];
                return num;
                */
            }
        }
        if(len==18)
        {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/); 
            var arrSplit=num.match(re);
            //检查生日日期是否正确 
            var dtmBirth=new Date(arrSplit[2]+"/"+arrSplit[3]+"/"+arrSplit[4]);
            var bGoodDay;
            bGoodDay=(dtmBirth.getFullYear()==Number(arrSplit[2]))&&((dtmBirth.getMonth()+1)==Number(arrSplit[3]))&&(dtmBirth.getDate()==Number(arrSplit[4]));
            if(!bGoodDay)
            {
                result = '输入的身份证号里出生日期不对！';
            }
            else 
            {
                //检验18位身份证的校验码是否正确。 
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
                var valnum;
                var arrInt=new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);
                var arrCh=new Array('1','0','X','9','8','7','6','5','4','3','2');
                var nTemp=0,i;
                for(i=0;i<17;i++)
                {
                    nTemp+=num.substr(i,1)*arrInt[i];
                }
                valnum=arrCh[nTemp%11];
                if(valnum!=num.substr(17,1))
                {
                    //alert('18位身份证的校验码不正确！应该为：'+valnum);
                    result = '18位身份证号码不符合国家标准!';
                }
            }
        }
        return result;
    }
}
 /*屏蔽Backspace，输入内容不屏蔽 add by zhangyangshuo*/
document.onkeydown = function(){
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
//object2json转换，过滤多余的变量，特殊的类型无法转化，仅用于调试 add by zhangyangshuo
function $2Json(object,flag){
	var type = typeof object;
    switch(type) {
      case 'undefined': return "undefined"
      case 'function': return flag==null?"[function]":"undefined";
      case 'unknown': return "undefined";
      case 'boolean': return object.toString();
      case 'string': return "\"" + object.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
      case 'number': return object;
    }
    if (object === null) return 'null';
   if (object.toJSON) {
    	try{
    		return object.toJSON();
    	}catch(e){
    	}	
    }
    if (object.ownerDocument === document) return flag==null?"[document]":"undefined";
    var results = [];
    try{
    for (var property in object) {
    	if(property!="toJSONString"){
      		var value = $2Json(object[property],flag);
      		//if (value !== undefined)
      			if(!flag||value !== undefined&& typeof(value)!='undefined'&&value != "undefined")
        		results.push(property.toJSON() + ': ' + value);
       }
    }
    }catch(e){
    	return flag==null?"[object]":"undefined";
    }
    return '{' + results.join(', ') + '}';
}
function alertObj(object,flag){
	var win = new Cs.flower.Win();    
	win.alert($2Json(object,flag));
}

function Each(list, fun)
{
	for (var i = 0, len = list.length; i < len; i++)
	{
		fun(list[i], i);
	}
};


var Util = new Object;
var _table;
var _row;
var _column = new Array();
var _fromIndex = -1;
var _toIndex = -1;
var _canDragFromIndex = 0;
var _tempDragTarget;
var _fromDragTarget;
var    _toDropTarget;
var _isDrag = false;
var _isMove = false;

var whenCanDropToTargStyle = "_toDropTarget.style.borderLeft = 'thick solid #00FFFF'";
var whenCannotDropToTargStyle = "_toDropTarget.style.borderLeft = '1px solid'";
Util.addEventHandler = function (oTarget, sEventType, fnHandler)
{

	if (oTarget.addEventListener)
	{
		oTarget.addEventListener(sEventType, fnHandler, false);
	}
	else if (oTarget.attachEvent)
	{
		oTarget.attachEvent("on" + sEventType, fnHandler);
	}
	else
	{
		oTarget["on" + sEventType] = fnHandler;
	}
};
Util.removeEventHandler = function (oTarget, sEventType, fnHandler)
{
	if (oTarget.removeEventListener)
	{
		oTarget.removeEventListener(sEventType, fnHandler, false);
	}
	else if (oTarget.detachEvent)
	{
		oTarget.detachEvent("on" + sEventType, fnHandler);
	}
	else
	{
		oTarget["on" + sEventType] = null;
	}
};
Util.getPos = function(elem)
{
	var pos = new Object();

	pos.left = elem.offsetLeft;
	pos.top = elem.offsetTop;


	while (elem = elem.offsetParent)
	{
		pos.left += elem.offsetLeft;
		pos.top += elem.offsetTop;
	}
	pos.left += document.body.scrollLeft;
	pos.top += document.body.scrollTop;
	return pos;
};

Util.formatEvent = function (oEvent)
{



	if (oEvent.srcElement && !oEvent.target && oEvent.srcElement.tagName && oEvent.srcElement.tagName.toUpperCase() == "TH")
	{

		if (typeof oEvent.charCode == "undefined")
		{
			oEvent.charCode = (oEvent.type == "keypress") ? oEvent.keyCode : 0;
			oEvent.isChar = (oEvent.charCode > 0);
		}

		oEvent.eventPhase = 2;
		oEvent.pageX = oEvent.clientX + document.documentElement.scrollLeft;
		oEvent.pageY = oEvent.clientY + document.documentElement.scrollTop;
		if (!oEvent.preventDefault)
		{
			oEvent.preventDefault = function ()
			{
				this.returnValue = false;
			};
		}

		if (oEvent.type == "mouseout")
		{
			oEvent.relatedTarget = oEvent.toElement;
		}
		else if (oEvent.type == "mouseover")
		{
			oEvent.relatedTarget = oEvent.fromElement;
		}

		if (!oEvent.stopPropagation)
		{
			oEvent.stopPropagation = function ()
			{
				this.cancelBubble = true;
			};
		}
		if ( typeof oEvent.button == "undefined" )
		{
			oEvent.button = oEvent.which;
		}

		oEvent.target = oEvent.srcElement;
		oEvent.time = (new Date).getTime();

	}

	return oEvent;
};

Util.getEvent = function()
{
	if (window.event)
	{
		return this.formatEvent(window.event);
	}
	else
	{
		return Util.getEvent.caller.arguments[0];
	}
};

function insertAfter(newElement, targetElement)
{
	var parent = targetElement.parentNode;
	if (parent.lastChild == targetElement)
	{
		parent.appendChild(newElement);
	}
	else
	{
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
};

function setTempDragTarget(elem)
{
	_tempDragTarget.innerHTML = elem.innerHTML;
	_tempDragTarget.className = "dragtemp";
	_tempDragTarget.style.height = elem.style.height;
	_tempDragTarget.style.width = elem.style.width;
};
function handleMouseDown(elem)
{


	_isDrag = true;
	_isMove = false;
	setTempDragTarget(elem);
	_fromDragTarget = elem;
	_toDropTarget = elem;
	_fromIndex = elem.cellIndex;
	_toIndex = elem.cellIndex;
	eval(whenCanDropToTargStyle);
	Util.addEventHandler(window.document.body, "mousemove", handleMouseMove);
	Util.addEventHandler(window.document.body, "mouseup", handleBodyMouseUp);
};

function handleBodyMouseUp()
{
	if (_isDrag)
	{
		_isDrag = false;
	}
	_isDrag = false;

	Util.removeEventHandler(window.document.body, "mousemove", handleMouseMove);
	Util.removeEventHandler(window.document.body, "mouseup", handleBodyMouseUp);
	_tempDragTarget.style.display = "none";
	if (_toDropTarget)
	{
		if (eval(whenCannotDropToTargStyle))
		{
			eval(whenCannotDropToTargStyle);
		}
		_fromIndex = -1;
		_toIndex = -1;
		_toDropTarget = null;
	}
};

function handleMouseUp(elem)
{

	if (!_isDrag)
	{
		return false;
	}
	if (!_isMove)
	{
		return false;
	}
	_isDrag = false;
	_isMove  = false;
	Util.removeEventHandler(window.document.body, "mousemove", handleMouseMove);
	Util.removeEventHandler(window.document.body, "mouseup", handleBodyMouseUp);
	_tempDragTarget.style.display = "none";
	if (_toDropTarget)
	{
		if (eval(whenCannotDropToTargStyle))
		{
			eval(whenCannotDropToTargStyle);
		}

		moveTargetTo();
		_fromIndex = -1;
		_toIndex = -1;
		_toDropTarget = null;
	}
};

function handleMouseOver(elem)
{
	_isMove = true;
	if (!_isDrag)
	{
		return false;
	}
	_toIndex = elem.cellIndex;
	_toDropTarget = _rows.cells[elem.cellIndex];

	if (_isDrag) eval(whenCanDropToTargStyle);
};

function handleMouseOut()
{
	_isMove = true;
	if (!_toDropTarget)
	{
		return false;
	}
	eval(whenCannotDropToTargStyle);
	_toIndex = -1;
	_toDropTarget = null;
};

function handleMouseMove(oEvent)
{
	oEvent = Util.getEvent(oEvent);
	if (oEvent.type.indexOf("mousemove") == -1 )
	{
		Util.removeEventHandler(window.document.body, "mousemove", handleMouseMove);
		Util.removeEventHandler(window.document.body, "mouseup", handleBodyMouseUp);
		return false;
	}
	if (isNaN(oEvent.pageX))oEvent.pageX = 0;
	if (isNaN(oEvent.pageY))oEvent.pageY = 0;
	var x = oEvent.pageX + 10;
	var    y = oEvent.pageY + 10;

	with(_tempDragTarget.style)
	{
		left = x + "px";
		top = y + "px";
		display = "";
	}
};
function moveTargetTo()
{
	var row = _table.tHead.rows[0];
	var fTag = row.cells[_fromIndex];
	var tTag = row.cells[_toIndex];
	row.insertBefore(fTag, tTag);
	for (var i = 0; i < _table.tBodies[0].rows.length; i++ )
	{
		var row = _table.tBodies[0].rows[i];
		var fTag = row.cells[_fromIndex];
		var tTag = row.cells[_toIndex];
		row.insertBefore(fTag, tTag);
	}

};
function initDrag(tabName)
{
	_tempDragTarget = document.createElement("DIV");
	_tempDragTarget.className = "temp";
	if (window.document.body)
	{
		window.document.body.insertBefore(_tempDragTarget, window.document.body.firstChild);
	}
	_table = document.getElementById(tabName);
	_rows = _table.tHead.rows[0];
	_table.tHead.onselectstart = function()
	{
		return false;
	}
	for (var i = 0; i < _table.tHead.rows[0].cells.length; i++)
	{
		var cell = _table.tHead.rows[0].cells[i];
		cell.onmousedown = function()
		{
			handleMouseDown(this);
		}
		
		cell.onmouseover = function ()
		{
			handleMouseOver(this);
		}
		cell.onmouseout = function ()
		{
			handleMouseOut();
		}
		cell.onmouseup = function ()
		{
			handleMouseUp(this);
		}
	}
};



var TableOrder = Class.create();
TableOrder.prototype =
{
initialize:
	function(table)
	{
		this.tBody = $(table).tBodies[0];//tbody对象
		this.Rows = [];//行集合
		this._order = null;//排序对象
		Each(this.tBody.rows, function(o)
		{
			this.Rows.push(o);
		} .bind(this));

	},
	//排序并显示
Sort:
	function()
	{
		//没有排序对象返回
		if (!this._order)
		{
			return false
		       };
		//排序
		this.Rows.sort(this._order.Compare || this.Compare.bind(this));
		this._order.Down && this.Rows.reverse();//取反
		//显示表格
		var oFragment = document.createDocumentFragment();
		Each(this.Rows, function(o)
		{
			oFragment.appendChild(o);
		});
		this.tBody.appendChild(oFragment);
		//执行附加函数
		this._order.onSort();
	},
	//比较函数
Compare:
	function(o1, o2)
	{
		var value1 = this.GetValue(o1), value2 = this.GetValue(o2);
		return value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
	},
	//获取比较值
GetValue:
	function(tr)
	{
		var td = tr.getElementsByTagName("td")[this._order.Index], data = td[this._order.Attri] || td.getAttribute(this._order.Attri);

		//数据转换
		switch (this._order.DataType.toLowerCase())
		{
		case "int":
			return parseInt(data) || 0;
		case "float":
			return parseFloat(data) || 0;
		case "date":
			return Date.parse(data) || 0;
		case "string":
		default:
			return data.toString() || "";
		}
	},
	//添加并返回一个排序对象
Add:
	function(index, options)
	{
		var oThis = this;
		return new function()
		{
			//默认属性
			this.Attri = "innerHTML";//获取数据的属性
			this.DataType = "string";//比较的数据类型
			this.Down = true;//是否按顺序
			this.onSort = function() {};//排序时执行
			this.Compare = null;//自定义排序函数
			Object.extend(this, options || {});
			//td索引
			this.Index = index;
			this.Sort = function()
			{
				oThis._order = this;
				oThis.Sort();
			};
		};
	},
SetOrder:
	function(obj, index, options)
	{
		var o = $(obj);
		//<img src='/images-custserv/essNew/arrow-down.gif' >
		var ap = document.createElement('image');
		ap.src =   "/images-custserv/essNew/arrow-up.gif";
		o.appendChild(ap);
		var _arr = []
		           //_arr是记录排序项目（这里主要用来设置样式）
		           _arr.push(o);
		//添加一个排序对象
		var order = this.Add(index, options);
		ap.onclick = function()
		{
			order.Sort();
			return false;
		}
		order.onSort = function()
		{
			//设置样式
			Each(_arr, function(o)
			{
				o.className = "";
			});
			o.className = order.Down ? "down" : "up";
			//取相反排序
			order.Down = !order.Down
			if (order.Down)
			{
				var v = o.childNodes;
				for (var i = 0; i < v.length; i++)
				{
					var oo = v[i];
					if (oo != null && oo.tagName && oo.tagName.toUpperCase() == "IMG")
					{
						o.removeChild(oo);
						var ap = document.createElement('image');
						ap.src =   "/images-custserv/essNew/arrow-up.gif";
						o.appendChild(ap);
						ap.onclick = function()
						{
							order.Sort();
							return false;
						}
					}
				}
			}
			else
			{
				var v = o.childNodes;
				for (var i = 0; i < v.length; i++)
				{
					var oo = v[i];
					if (oo != null && oo.tagName && oo.tagName.toUpperCase() == "IMG")
					{
						o.removeChild(oo);
						var ap = document.createElement('image');
						ap.src =   "/images-custserv/essNew/arrow-down.gif";
						o.appendChild(ap);
						ap.onclick = function()
						{
							order.Sort();
							return false;
						}
					}
				}

			}
		}
	},
setTableEdit:
	function(tableEdit)
	{
		for (var i = 0; i < tableEdit.header.cells.length; i++)
		{
			var cellName = tableEdit.header.cells[i].id;

			var field = $(cellName);

			if (field != null)
			{
				if (cellName == "col_ROWNUM")
				{
					this.SetOrder(cellName, i, {  DataType: "int" });
				}
				else
				{
					this.SetOrder(cellName, i);
				}
			}
		}
	}
}
//qc:52430 begin
//获取radio/checkbox选中的记录 ,将每行转换成列装换成JSON对象，返回 add by zhangyangshuo
function getTabCheckedObject(tableedit,colName) {   
	var idx = -1;
	var hcells = tableedit.header.cells;
	for (var i = 0; i < hcells.length; ++i) {
		if (hcells[i].id && hcells[i].id.substring("col_".length).toLowerCase() == colName) {
			idx = i;
			break;
		}
	}
	if (idx == -1) {
		return undefined;
	}
	var aryChecked = $A(tableedit.table.rows).findAll(function (row) {
		return row.cells[idx].childNodes.length > 0 && row.cells[idx].childNodes[0].checked;
	}); 
    if(typeof aryChecked == 'undefined') return undefined;
    var ret = new Array;
	for (var i = 0; i < aryChecked.length; ++i) {
		var returnObject = new Object();
		var ths = aryChecked[i].cells;
		var tid, name,value;
		for (var j = 0; j < ths.length; j++) {
			tid = hcells[j].id;
			value = ths[j].innerText;
			if (tid != null && tid != "undefined" && tid != "") {
				if (tid.substring(0, 4) == "col_") {
					name = tid.substring(4, tid.length);
					returnObject[name] = value;
				}
			}
		}
		ret.push(returnObject);
	}
	return ret;
}
//在新的见面获取table里的元素 add by zhangyangshuo
 function showTabCheckedInfo(tableeditname,param,choiceType, title,rows,cols,leftEdge,widthEdge){
 	  var tableedit = new TableEdit(tableeditname);
    	title = title||'获取信息';
    	rows = rows||'5';
    	cols = cols||'50';
    	leftEdge = leftEdge||'300';
    	widthEdge = widthEdge||'400';
    	var ret = getTabCheckedObject(tableedit,choiceType);
    	if (ret.length == 0) {
				win.alert("请选择记录");
				return;
		}
		var str  = "";
		if(param!=null&&param!=""){
			var paramA = param.split(",");
			for(var i = 0;i<paramA.length;i++){
				var v = paramA[i];
				for(var j = 0;j<ret.length;j++){
				if(v.indexOf(":")>=0){
					var vv  = v.split(":");
					str += vv[1]+":"+ ret[j][vv[0]]+" ";
				}else{
					str += v+":"+ret[j][v]+" ";
				}
				if(i<paramA.length-1){
					str +=",";
				}
				}
			}
		}
		
		var str = "<textarea rows=\""+rows+"\" name=\"PhotoBuffer\" cols=\""+cols+"\">"+str+"</textarea>";
		var option = {};
		option.leftEdge=leftEdge;
		option.widthEdge=widthEdge;
		
		win.confirmHTML(title,option,str);
    
    }
//qc:52430 end

//消息提示工具类 add by zhangyangshuo
var csMessBox = Class.create();
//width, height, caption, title, message, openMessage, cols, target, action, funcMess,left, right, top, bottom, autoHide,color,autoHeight,heightrows,page, listener, params
csMessBox.prototype = {
    initialize: function(id,options ) {
        this.id = id;
        this.options=options;
        this.title = this.options.title||'';//标题
        this.caption = this.options.caption||'';//标题栏
        this.message = this.options.message||'';//消息
        this.target = this.options.target;
        this.action = this.options.action;
        this.width = this.options.width ? this.options.width: 200;//提示框的宽
        this.height = this.options.height ? this.options.height: 120;//提示框的高
        this.cols = this.options.cols||30;//消息显示每行多个列字符
        if(this.message!=null&&this.message.trim()!=""){
        	if(this.message.include("~")){//~标识换行符
        		this.message=this.message.replace(/~/g, '<br>');
        	}else{
        		this.message=this.replaceEnter(this.message,this.cols,"<br>");
        	}
        	if(this.options.autoHeight){//根据文字行数自动调整高度
        		this.heightrows=this.options.heightrows||35;
        		var rows = this.getCount(this.message,'<br>');
        		if(rows<=10)this.heightrows=35;
        		if(rows>10)this.heightrows=18;
        		var hh = (++rows)*this.heightrows;
        		if(hh>this.height) this.height = hh;
        	}
        }
        this.timeout = 150;
        this.speed = 10;//延迟周期ms
        this.step = 5;//步长
        this.timer = 0;
        this.pause = false;
        this.close = false;
        this.autoHide = this.options.autoHide!=null?this.options.autoHide:true;//是否定时关闭
        this.openMessage = this.options.openMessage||false;//消息是否提供单击事件
        this.funcMess = this.options.funcMess;//openMessage为true时,点击事件方法
        if(typeof this.funcMess != 'undefined' && this.funcMess instanceof Function){
	  		this.openMessage =true;
		}else if (typeof this.funcMess != 'undefined' && typeof this.funcMess == "string" && this.funcMess!="" ){
			this.openMessage =true;
		}
        this.color=this.options.color||"#FF6600";//标题栏颜色
        this.right = screen.width - 1;//右位置
        this.left = this.options.left != null ? this.options.left: this.right - this.width;//左位置
        this.right = this.options.right != null ? this.options.right: this.left + this.width;//右位置
        this.bottom = this.options.bottom != null ? (this.options.bottom > screen.height ? screen.height: this.options.bottom) : screen.height;//底距离
        this.top = this.options.top != null ? this.options.top: this.bottom - this.height;//顶距离 
    },
    hide: function() {//隐藏消息方法 
        if (this.onunload()) {
            var offset = this.height > this.bottom - this.top ? this.height: this.bottom - this.top;
            var me = this;
            if (this.timer > 0) {
                window.clearInterval(me.timer);
            }
            var fun = function() {
                if (me.pause == false || me.close) {
                    var x = me.left;
                    var y = 0;
                    var width = me.width;
                    var height = 0;
                    if (me.offset > 0) {
                        height = me.offset;
                    }
                    y = me.bottom - height;
                    if (y >= me.bottom) {
                        window.clearInterval(me.timer);
                        me.Pop.hide();
                    } else {
                        me.offset = me.offset - me.step;
                    }
                    me.Pop.show(x, y, width, height);
                }
            }
            this.timer = window.setInterval(fun, this.speed)
        }
    },
    onunload: function() {//消息卸载事件，可以重写 
        return true;
    },
    oncommand:function() {//消息命令事件，需要传递funcMess方法
        this.hide();
        if(typeof this.funcMess != 'undefined' && this.funcMess instanceof Function){
	  		this.funcMess();
		}else if (typeof this.funcMess != 'undefined' && typeof this.funcMess == "string" && this.funcMess!="" ){
			eval(this.funcMess);
		}
    },
    replaceEnter:function(m,d,s){//替换字符串
    	var t = "";
    	if(m!=null&&m.length>0){
    		while(m.length>d){
    			t+= m.substr(0,d)+s;
    			m=m.substr(d);
    		}
    		if(m.length>0){
    			t+=m;
    		}
    	}
    	return t;
    } ,
    getCount:function(str,find){//统计str中find出现次数
		var reg = new RegExp(find,"g");//建立了一个正则表达式
		var count = str.match(reg); //match则匹配返回的字符串,这是很正规的做法
		return count ? count.length : 0;
    },
    show: function() {//消息显示方法
        var oPopup = window.createPopup(); //IE5.5+ 
        this.Pop = oPopup;
        var w = this.width;
        var h = this.height;
        var str = "<DIV style='BORDER-RIGHT: #455690 1px solid; BORDER-TOP: #a6b4cf 1px solid; Z-INDEX: 99999; LEFT: 0px; BORDER-LEFT: #a6b4cf 1px solid; WIDTH: " + w + "px; BORDER-BOTTOM: #455690 1px solid; POSITION: absolute; TOP: 0px; HEIGHT: " + h + "px; BACKGROUND-COLOR: #c9d3f3' id="+this.id+">" 
        str += "<TABLE style='BORDER-TOP: #ffffff 1px solid; BORDER-LEFT: #ffffff 1px solid' cellSpacing=0 cellPadding=0 width='100%' bgColor=#cfdef4 border=0>" 
        str += "<TR bgcolor="+this.color+">" 
        str += "<TD style='FONT-SIZE: 12px;COLOR: #0f2c8c' width=30 height=24></TD>" 
        str += "<TD style='PADDING-LEFT: 4px; FONT-WEIGHT: normal; FONT-SIZE: 12px; COLOR: #1f336b; PADDING-TOP: 4px' vAlign=center width='100%'>" + this.caption + "</TD>" 
        str += "<TD style='PADDING-RIGHT: 2px; PADDING-TOP: 2px' vAlign=center align=right width=19>" 
        str += "<SPAN title=关闭 style='FONT-WEIGHT: bold; FONT-SIZE: 12px; CURSOR: hand; COLOR: black; MARGIN-RIGHT: 4px' id='btSysClose' >×</SPAN></TD>" 
        str += "</TR>" 
        str += "<TR>" 
        str += "<TD style='PADDING-RIGHT: 1px;PADDING-BOTTOM: 1px' colSpan=3 height=" + (h-28) + ">" 
        str += "<DIV style='BORDER-RIGHT: #b9c9ef 1px solid; PADDING-RIGHT: 8px; BORDER-TOP: #728eb8 1px solid; PADDING-LEFT: 8px; FONT-SIZE: 12px; PADDING-BOTTOM: 8px; BORDER-LEFT: #728eb8 1px solid; WIDTH: 100%; COLOR: #1f336b; PADDING-TOP: 8px; BORDER-BOTTOM: #b9c9ef 1px solid; HEIGHT: 100%'>"  
        if(this.title!=null&&this.title.trim()!=""){
        	str += this.title + "<BR><BR>"
        }
        if(this.openMessage==true||this.openMessage=="true"){
        	str+="<DIV style='WORD-BREAK: break-all' align=left><A href='javascript:void(0)' hidefocus=false id='btCommand'><FONT color=#ff0000>" + this.message + "</FONT></A></DIV>"
        }else{
        	str+="<DIV style='WORD-BREAK: break-all' align=left><FONT color=#ff0000 >" + this.message + "</FONT></DIV>"
        }
        str += "</DIV>" 
        str += "</TD>" 
        str += "</TR>" 
        str += "</TABLE>" 
        str += "</DIV>" ;
        oPopup.document.body.innerHTML = str; 
        this.offset = 0;
        var me = this;
   		oPopup.document.body.onmouseover = function() {
            me.pause = true;
        }
        oPopup.document.body.onmouseout = function() {
            me.pause = false;
        }
         var fun = function() {
            var x = me.left;
            var y = 0;
            var width = me.width;
            var height = me.height;
            if (me.offset > me.height) {
                height = me.height;
            } else {
                height = me.offset;
            }
            y = me.bottom - me.offset;
            if (y <= me.top) {
                me.timeout--;
                if (me.timeout == 0) {
                    window.clearInterval(me.timer);
                    if (me.autoHide==true||me.autoHide=="true") {
                        me.hide();
                    }
                }
            } else {
                me.offset = me.offset + me.step;
            }
            me.Pop.show(x, y, width, height);
        };
        this.timer = window.setInterval(fun, this.speed);
        var btClose = oPopup.document.getElementById("btSysClose");
        if(btClose){btClose.onclick = function() {
            me.close = true;
            me.hide();
        };}
        var btCommand = oPopup.document.getElementById("btCommand");
        if(btCommand)btCommand.onclick = function() {
            me.oncommand();
        }
        var ommand = oPopup.document.getElementById("ommand");
        if(ommand){ommand.onclick = function() {
            me.hide();
            window.open(ommand.href);
        }}
    }
}

//<span jwcid='@cs:ShowMess' t='操作说明' m='CHK:CSM|8100|1'   ></span>
//<span jwcid='@cs:ShowMess' t='操作说明' m='CHK:TAGXXXXX'   ></span>
//<span jwcid='@cs:ShowMess' t='操作说明' m='直接提示XXXXXXXXXXXXX'   ></span>
//<span jwcid='@cs:ShowMess' t='操作说明' m='CHK:CSM|8100|1'  f="alert(11111);" ></span>
//add　by zhangyangshuo
function showMessObj(m,o,t,h,w,f,a){//m->消息，o->对象，t->标题，h->高度，w->宽度，f->触发脚本,a->是否自动隐藏
	t=t||"操作说明：";
    w=w||210;
    h=h||126;	
    a=a||false
    var autoHeight = false;
    if(h==126){
    	autoHeight = true;
    }
    if((o&&o.value!="")||(m!=""&&m.indexOf("CHK:")!=0)){
    	new csMessBox("messBox",{width:w, height:h, caption:t, message:((m!=""&&m.indexOf("CHK:")!=0)?m:o.value),  bottom:screen.height-50,autoHide:a,autoHeight:autoHeight,funcMess:f}).show(); 
    }else if(m!=""&&m.indexOf("CHK:")==0){
		Cs.Ajax.register("messOK", function(node){	
		var mess =  node.getAttribute('mess');
		if(o)o.value = mess;
			if(mess!=""){
				new csMessBox("messBox",{width:w, height:h, caption:t, message:mess,  bottom:screen.height-50,autoHide:a,autoHeight:autoHeight,funcMess:f}).show(); 
			}
		});
		m = m.substring(4);
		 Cs.Ajax.swallowXml("personalserv.print.printComb", "getMess", "findStr="+m, "", true);//支持从td_s_comm或td_s_tag中取值
	}
}


//获取相对与文档的位置，增加鼠标滚动
function getMousePos() {
   var e = event || window.event;
   var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
   var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
   var x = e.pageX || e.clientX + scrollX;
   var y = e.pageY || e.clientY + scrollY;
   // alert('x: ' + x + '\ny: ' + y);
   return { 'X': x, 'Y': y };
}
//浮动提示信息zys   
function showToolTip(title,msg){
    var e = getMousePos(); 
    var xPos = e.X;
    var yPos = e.Y;
   var toolTip = document.createElement("toolTip");
   if(!toolTip||toolTip==null) toolTip=document.createElement("DIV");
   toolTip.id= "toolTip";
   toolTip.innerHTML = "<h1>"+title+"</h1><p>"+msg+"</p>";
   var len = 60;
   if(!msg.blank()&&msg.length<=10){
   	 len = msg.length*15;
   	 toolTip.style.width=len;
   }
   if(parseInt(xPos)+len+20>document.body.clientWidth)
   xPos=parseInt(xPos)-len-20;
   if(parseInt(yPos)+60>document.body.clientHeight)
   yPos=parseInt(yPos)-60;
   toolTip.style.top = parseInt(yPos)+2 + "px";
   toolTip.style.left = parseInt(xPos)+20 + "px";
   //toolTip.style.filter = "alpha(opacity=50)";
   toolTip.style.visibility = "visible";
   document.body.appendChild(toolTip);
}
//浮动提示隐藏
function hideToolTip(){
   var toolTip = document.getElementById("toolTip");
   if (toolTip != null){
        toolTip.style.visibility = "hidden";
        toolTip.parentNode.removeChild(toolTip);
   }
}

//切换展开和隐藏用户信息
function toggleLightInfo(id,obj) {
    $(id).toggle();
    if(obj.className == "unexpand") {
     	obj.className = "expand";
     	obj.src='/images-custserv/win/close.gif';
    } else {
      	obj.className = "unexpand";
      	obj.src='/images-custserv/win/open.gif';
    }
}
//叠加事件
//after 在原事件之前还是之后执行。true=之后 false=之前 有另外几个页面用，放在CS里了。
//isNeedReturn 是否需要根据前面的结果，判断后续是否执行。只有在after为true的时候才有效
function addEventIfExist(object,event,func,after,isNeedReturn){
	if(!object) return;
	var eventAction = object[event];
	object[event] = function(){
		if(typeof func !== "undefined" && typeof eval(func) == "function"){
			if(after && after == true){
				var retValue = "";
				if(typeof eventAction !== "undefined" && typeof eval(eventAction) == "function"){
					retValue = eventAction.bind(object)();					
				}
				if(isNeedReturn && isNeedReturn == retValue)
					func.bind(object)();
				else if(!isNeedReturn)
					func.bind(object)();
			}else{
				func.bind(object)();
				if(typeof eventAction !== "undefined" && typeof eval(eventAction) == "function")
					eventAction.bind(object)();	
			}	
		}
	}
}
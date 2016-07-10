/**************************************************************************
* Created by chenjw@2007-3-20
* 从tangz的代码中修改而得
**************************************************************************/
var _tradeInfoAcct = new String;//页面监控控件的值，拼接成的字符串
var $TradeExit = new Error("trade abort!");
var $ErrorReport = new Error("error report html!");
//var $TradeExtendSerialize = "";
//var pagevisit = {};

/**
 * 必输项(nullable="no")后面加*号
 */
function initAcctInterface(){
    //这一段是我加的，为了是在下拉框内容太多的时候，设置了tooLang="true"后，有一个提示框
    //回到公司后，应该看长沙的tip，进行修改。同是要修改的还有，实时校验的时候，提示的tip
    //function add2SelectMouseOver(sel) {
    //	return function(){stm(["提示",sel.options[sel.selectedIndex].text],["#000000","black","#0000ee","#FFCC99","","","","","","","center","","2","3",200,"",4,4,20,20,"","","","",""]);}
    //}
    if(document.getElementById("sys_staffId")) {
        document.getElementById("sys_staffId").value = pagevisit.getAttribute("staffId");
    }
    
    $A(document.getElementsByTagName("FORM")).map(Form.getElements).flatten().each(function(element){
        
        //如果是下拉框，那么添加tip
        //if (element.tagName.toUpperCase() == "SELECT" && element.tooLang != "undefined" && element.tooLang == "true") {
        //	element.onmouseover = add2SelectMouseOver(element);
		//
		//	element.onmouseout = htm;
        //}
        
        if (element.nullable=="no"){
            if (element.lookupCombo == "true" && element.nextSibling && element.nextSibling.tagName.toLowerCase() == "img"){
                if  (!element.nextSibling.nextSibling || element.nextSibling.nextSibling.innerText != "*")
                    new Insertion.After(element.nextSibling, "<span class=\"textred\">*</span>");    
            }
            else if  (!element.nextSibling || element.nextSibling.innerText != "*")
            {
                new Insertion.After(element, "<span class=\"textred\">*</span>");
            }
        }
        //因为好资源较多，所以注释掉
        if  (typeof element.checkdata == "string"){
            
            addInputListener(element);
            
        }
        
        if (element.lookupCombo == "true" && element.id.slice(-5) == "$dspl" && element.nextSibling.disabled!=true){
            //alert(element.nextSibling.disabled);
            addLookupComboListener(element);
            
        }
        
//        if (element.tagName.toLowerCase() == "input" && ["submit","image"].include(element.type.toLowerCase())){
//            
//            addFormSubmitListener(element);
//            
//        }
        
    });
    if (typeof initChildInterface != 'undefined' && initChildInterface instanceof Function) 
        initChildInterface();
    /*if ($needValidateDataChange)
        _tradeInfo = $('workarea').serialize()+$TradeExtendSerialize;*/
    //隐藏监控控件值
    _tradeInfoAcct = storageData();
    hideWaitInfo();
}

//将监控控件的值存储，在初始化的时候
function storageData() {
	var tradeInfo = new String;
	
	var g = getTradeGlobal();
    if (g!=null && g.tradeStatus != "querySuccess") {
    	tradeInfo = "";
    } else if (g!=null && g.tradeStatus == "querySuccess") {
    	
    	var fs = document.forms;
    	
		for(var i=0;i<fs.length;i++) {
			
			var a = $(fs[i].id.length>0?fs[i].id:'Form0').getElementsBySelector('[whenWatch="querySuccess"]');
			
			for (var j=0;j<a.length;j++) {
				tradeInfo+=a[j].id+"="+a[j].value+"&";
				}
		}	
		if (tradeInfo.length>0) {
			tradeInfo = tradeInfo.substring(0,tradeInfo.length-1);
		}	
    }
	return tradeInfo;
}

function showMustFillTag(parent){
    
    parent = parent || document;
    
    $A(parent.getElementsByTagName("*")).each(function(element){
        
        if (element.nullable=="no"){
            if (element.lookupCombo == "true" && element.nextSibling && element.nextSibling.tagName.toLowerCase() == "img"){
                if  (!element.nextSibling.nextSibling || element.nextSibling.nextSibling.innerText != "*")
                    new Insertion.After(element.nextSibling, "<span class=\"textred\">*</span>");    
            }
            else if  (!element.nextSibling || element.nextSibling.innerText != "*")
            {
                new Insertion.After(element, "<span class=\"textred\">*</span>");
            }
        }
        else if (!element.nullable||element.nullable=="yes") {
            if (element.lookupCombo == "true" && element.nextSibling && element.nextSibling.tagName.toLowerCase() == "img" 
                && element.nextSibling.nextSibling && element.nextSibling.nextSibling.innerText && element.nextSibling.nextSibling.innerText.strip() == "*"){
                $(element.nextSibling.nextSibling).remove();
            }
            if (element.nextSibling && element.nextSibling.innerText && element.nextSibling.innerText.strip() == "*")
            {
                $(element.nextSibling).remove();
            }
        }
        
    });
}

//function verifyConditionArea(event){
//    if ($("SERIAL_NUMBER")!=null && $F("SERIAL_NUMBER").blank()){
//        var win = new TradeWin(200,120,400,250);
//        win.alert("请输入号码！", function(){$("SERIAL_NUMBER").focus();});
//        //unlockForm(Event.element(event));
//        Event.stop(event);
//       
//        hideWaitInfo();
//        return false;
//    }
//    
//    return true;
//}

//function conditionAreaEnter(event){
//    
//    if (event.keyCode == Event.KEY_RETURN){
//        /*
//        form = Event.findElement(event, "form");
//        btn = $(form).getElements().find(function(element) {
//            return element.tagName.toLowerCase() == "input" && !element.disabled  
//                && (element.type.toLowerCase() == "submit" ||  element.type.toLowerCase() == "button");
//        });
//        */
//        event.keyCode = Event.KEY_TAB;
//    }
//    
//}

function enter2Tab(event){

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

}


function addLookupComboListener(element){
    
    var elt = $(element);
    try{
    elt.observe('focus' , LookupCombo.onfocus);
    elt.observe('keyup' , LookupCombo.onkeyup);
    elt.observe('blur' , LookupCombo.onblur);
    elt.observe('keydown' , LookupCombo.onkeydown);
    }catch(ex){
        alert(ex.message)
    }
}

function addInputListener(element){
    var elt = $(element);
    var checkers = elt.checkdata.split(",");
            
    if (checkers.length == 0) return;
     
     var allKeys = ["isalnum", "isalpha", "isdigit",
                    "islower", "isupper","isinteger","isdouble",
                    "isemail", "ispsptid0", "isphone","checkspec",
                    "thelength", "minlength","maxlength", 
                    "maxvalue", "minvalue" ];
     
    if (checkers.any(function(checker){
       return ["isalnum", "isalpha", "isdigit", "ispsptid0",
                "islower", "isupper","isinteger","isdouble","checkspec",
                "maxlength", "thelength"].include(checker.split("=")[0].strip())
    }))
    
    elt.observe('onchange' , tradeEditKeyPress);
    
    
    if (checkers.any(function(checker){
       return allKeys.include(checker.split("=")[0].strip())
    }))
    {
        var func = elt.onblur;
        Event.observe(elt, 'blur', function(){
            if (!tradeEditBlur(event)) return;
            if (func instanceof Function)
                func.bind(elt)();
        });
    }

}

function tradeEditKeyPress(event){
    var edit  = Event.element(event);
    if ([ Event.KEY_RETURN ].include(event.keyCode)) return;
    
    var checkers = edit.checkdata.split(",");
    
    var curStr,newStr;
    //try{
	    if (event.type == "keypress")
	    {
	        curStr = String.fromCharCode(event.keyCode);
	        
	        var tmp =document.selection.createRange()
	        tmp.setEndPoint("StartToStart",edit.createTextRange())
	        var len=tmp.text.length;
	        newStr = $F(edit).substring(0,len)+curStr+$F(edit).substring(len)
	    }
	    else
	    {
	        curStr = $F(edit);
	        newStr = $F(edit);
	    }
	    if (curStr.length == 0 || newStr.length == 0) return;
	    
	    if (checkers.include("isdigit")){
	        if (!/^\d*$/.test(curStr))
	        {
	            Event.stop(event);
	            //throw new Error(getDesc(edit)+ " 只能输入数字!");
	            showErrMsg(getDesc(edit)+ " 只能输入数字!");
	            edit.focus();
	            edit.select();
	            return false;
	        }
	    }
	    
	    if (checkers.include("isalnum")){
	        if (!/^\w*$/.test(curStr))
	        {
	            Event.stop(event);
	            //throw new Error(getDesc(edit)+ " 只能输入数字或字母!");
	            showErrMsg(getDesc(edit)+ " 只能输入数字或字母!");
	            edit.focus();
	            edit.select();
	            return false;
	        }
	    }
	    
	    if (checkers.include("isalpha")){
	        if (!/^\w*$/.test(curStr) || /\d/.test(curStr))
	        {
	            Event.stop(event);
	            //throw new Error(getDesc(edit)+ " 只能输入字母!");
	            showErrMsg(getDesc(edit)+ " 只能输入字母!");
	            edit.focus();
	            edit.select();
	            return false;
	        }
	    }
	    
	    if (checkers.include("islower")){
	        if (/^[A-Z]$/.test(curStr))
	        {
	            if (event.type == "keypress")
	                event.keyCode = event.keyCode + 97 - 65;
	            else {
	                //throw new Error(getDesc(edit)+ " 只能输入小写字母!");
	                showErrMsg(getDesc(edit)+ " 只能输入小写字母!");
	            edit.focus();
	            edit.select();
	                return false;
	            }
	        } 
	    }
	    
	    if (checkers.include("isupper")){
	        if (/^[a-z]$/.test(curStr))
	        {
	            if (event.type == "keypress")
	                event.keyCode = event.keyCode - 97 + 65;
	            else {
	                //throw new Error(getDesc(edit)+ " 只能输入大写字母!");
	                showErrMsg(getDesc(edit)+ " 只能输入大写字母!");
	            edit.focus();
	            edit.select();
	            return false;
	            }
	        } 
	    }
	    
	    if (checkers.include("isinteger")){
	        if (!/^(-)?\d*$/.test(newStr))
	        {
	            Event.stop(event);
	            //throw new Error(getDesc(edit)+ " 只能输入整数!");
	            showErrMsg(getDesc(edit)+ " 只能输入整数!");
	            edit.focus();
	            edit.select();
	            return false;
	        } 
	    }
	    
	    if (checkers.include("isdouble")){
	        if (!/^(-)?(\d)+(\.)?(\d)*$/.test(newStr))
	        {
	            Event.stop(event);
	            //throw new Error(getDesc(edit)+ " 只能输入数字!");
	            showErrMsg(getDesc(edit)+ " 只能输入数字!");
	            edit.focus();
	            edit.select();
	            return false;
	        } 
	    }
	    
	    //身份证检查,15位全部数字 ,18位仅最后一位可以为字母
	    if (checkers.include("ispsptid0")){
	        
	        if (newStr.length<18 && !/^\d+$/.test(newStr))
	        {
	            Event.stop(event);
	            //throw new Error(getDesc(edit)+ " 格式不正确!");
	            showErrMsg(getDesc(edit)+ "  格式不正确!");
	            edit.focus();
	            edit.select();
	            return false;
	        }
	        else if ( newStr.length>=18 && !/^\d{15,15}\d\d\w$/.test(newStr)){
	            Event.stop(event);
	            //throw new Error(getDesc(edit)+ " 格式不正确!");
	            showErrMsg(getDesc(edit)+ "  格式不正确!");
	            edit.focus();
	            edit.select();
	            return false;
	        }
	        
	    }
	    //特色字符校验
	    if (checkers.include("checkspec")){
            if(/[%&]+/.test(newStr))
            {
            	showErrMsg(getDesc(edit)+ " 不能输入以下非法字符'%&'");
	            edit.focus();
	            edit.select();
                //throw new Error(getDesc(edit) + "  不能输入以下非法字符'%&'");
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
	            //throw new Error(getDesc(edit)+ (checker.startsWith("maxlength")?" 最大长度为 ":" 长度必须为 ")+ l);
	            showErrMsg(getDesc(edit)+ (checker.startsWith("maxlength")?" 最大长度为 ":" 长度必须为 ")+ l);
	            edit.focus();
	            edit.select();
	            return false;
	        }
	    }
    //} catch(ex) {
	//    stm(["警告",ex.message],["white","black","#0000ee","#FFCC99","","","","","","","","","2","2",200,"",2,2,10,10,51,0.5,75,"simple","gray"]);
	//    setTimeout(htm, 3000);
    //}
}

function tradeEditBlur(event){
    
    var edit  = Event.element(event);
    
    if ($F(edit).length == 0) return;
    
    var checkers = edit.checkdata.split(",");
    
    var win = new TradeWin(200,120,400,250);
    
    //邮件格式检查
    if (checkers.include("isemail")){
        if ($F(edit).length > 0 && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($F(edit)))
        {
            win.alert(getDesc(edit) + "必须为EMail格式！", function(edit){
                edit.focus();
                edit.select();
                });
            return;
        }
    }
    
    //电话号码检查
    if (checkers.include("isphone")){
        if (!/^[\d-]{7,}/.test($F(edit))){
            Event.stop(event);
            win.alert(getDesc(edit) + " 请输入正确的数据！(只能包含数字或者\"-\"符)", function(){
                edit.focus();
                edit.select();
                });
            //throw new Error(getDesc(edit) + " 请输入正确的数据！(只能包含数字或者\"-\"符)");
            return;
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
            win.alert(getDesc(edit) + " 长度必须为"+l+"！", function(){
                edit.focus();
                edit.select();
                });
            //throw new Error(getDesc(edit) + " 长度必须为"+l+"！");
            return;
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
            win.alert(getDesc(edit) + " 最小长度不能低于"+l+"！", function(){
                edit.focus();
                edit.select();
                });
            //throw new Error(getDesc(edit) + " 最小长度不能低于"+l+"！");
            return;
        }
    }
    
    if (checkers.any(function(checker){ 
        return "maxvalue" == checker.split("=")[0].strip()})){
        var checker = checkers.find(function(checker){ 
            if (checker.startsWith("maxvalue")) return true;
             })
        var l = checker.split("=")[1];
        
        if ($F(edit).length > 0 && $F(edit) > l)
        {
            Event.stop(event);
            win.alert(getDesc(edit) + " 不能大于 "+l+"！", function(){
                edit.focus();
                edit.select();
                });
            //throw new Error(getDesc(edit) + " 不能大于 "+l+"！");
            return;
        }
    }
    
    if (checkers.any(function(checker){ 
        return "minvalue" == checker.split("=")[0].strip()})){
        var checker = checkers.find(function(checker){ 
            if (checker.startsWith("minvalue")) return true;
             })
        var l = checker.split("=")[1];
        
        if ($F(edit).length > 0 && $F(edit) < l)
        {
            Event.stop(event);
            win.alert(getDesc(edit) + " 不能小于 "+l+"！", function(){
                edit.focus();
                edit.select();
                });
            //throw new Error(getDesc(edit) + " 不能小于 "+l+"！");
            return;
        }
    }
    
    try{
        tradeEditKeyPress(event);
    }catch(e){
        Event.stop(event);
        win.alert(e.message, function(){
            edit.focus();
            edit.select();
            });
        throw new Error(e.message);
    }
    
}

function getTradeGlobal(){
    
    if ($("_tradeGlobal") != null){
    	var temp = new Object();
    	temp.servletPath = $F('_tradeGlobal_SERVLET_PATH');
    	temp.pageName = $F('_tradeGlobal_PAGE_NAME');
    	temp.tradeStatus = $F('_tradeGlobal_TRADE_STATUS');
    	temp.error = $F('_tradeGlobal_ERROR');
        return temp;
    }
    throw new Error("页面数据不全!");
    return null; 
}

function setTradeGlobal(g){
	alert('这个在tradectrl.js里面还没有实现');
	throw new Error('这个在tradectrl.js里面还没有实现');
//    if ($("_tradeGlobal") != null){
//        $("_tradeGlobal").innerHTML = Object.toJSON(g);
//    }
//    else 
//    {
//        var tradeGlobal = document.createElement("span");
//        tradeGlobal.style ="display:none";
//        tradeGlobal.id = "_tradeGlobal";
//        tradeGlobal.innerHTML = Object.toJSON(g);
//        document.body.appendChild(tradeGlobal);
//    }
}

function existError(){
    var g = getTradeGlobal();
    if (g == null)
        return true;
    else 
        return g.error;
}

function dealTradeMsg(){
    hideWaitInfo();
    acctAjaxAfteraction();
    
//    if ($("_errorMsg") != null){
//        setErrow(true);
//        
//        var win = new TradeWin(200,120,400,250);
//        win.error($("_errorMsg").innerText, function(){
//            $("_errorMsg").remove();
//            });
//        
//        return;
//    }
    
//    if ($("_webMessage") != null){
//        
//        var  strTab = new StrTable($("_webMessage").innerText.strip());
//        
//        var mesg = strTab.getTableByName("mesg")
//        
//        for(var i=0; i<mesg.rowCount; i++)
//        {
//            if (mesg.values[i][0] == "1")
//                alert(mesg.values[i][1]);
//            else if (mesg.values[i][0] == "2" && !confirm(mesg.values[i][1]))
//            {/*
//                setErrow(true);
//                $("_webMessage").remove();
//                
//                //查询时询问出错锁住界面
//                var g = getTradeGlobal();
//                if (g && g.tradeStatus == "queryTrade"){
//                    tradeInit();
//                }*/
//                
//                return;
//            }
//        }
//        
//        $("_webMessage").remove();
//    }
    
//    if ($("confirmXml")!=null){
//        try{
//	        xml = new XML();
//	        xml.loadXML(confirmXml.value);
//	        dealScriptMessage(xml.documentElement);
//	        confirmXml.value = "";
//	    }catch(e){alert(e.message)}
//	}
}


/************************************************/
var bg = "slategray";
function showWaitInfo(msg){
    
    hideWaitInfo();

    var waitInfo = "<div id=_waitInfo "
                 + "style='position:absolute;background-color:white;"
                 + "color:"+bg+";height:40;top:30%;left:25%;border:2px solid "
                 + bg + " ;z-index=10005;width:400;'>"
                 + "<div id=_waitInfoContent style='position:relative;top:25%;text-align:center;'>"
                 + "<img src='/component/images/loading.gif' alt='[loading]'>  "
                 + msg
                 + "</div></div>"
                 + "<iframe id=_waitInfobg frameborder=\"0\" style='background-color:#ffffff;position:absolute;top:0;left:0;height:100%;width:100%;z-index:10000;filter : progid:DXImageTransform.Microsoft.Alpha(opacity=75);border:0'></iframe>"
    document.body.insertAdjacentHTML("beforeEnd",waitInfo);

}

function showWaitInfo2(msg){
    hideWaitInfo();
    var waitInfo="<div id=_waitInfo style='position:absolute;background-color:white;color:white;height:40;top:30%;left:25%;border:2px solid white ;z-index=10005;width:400;'><table width=100% height=100px border='0' cellpadding='0' cellspacing='0' style='background-image: url(/images-custserv/win/loading.gif);background-repeat: no-repeat;background-position: center top;text-align: center;word-wrap:break-word;'><tr><td height='90'>"+msg+"</td></tr></table></div>"+
                 "<iframe id=_waitInfobg frameborder=\"0\" style='background-color:#ffffff;position:absolute;top:0;left:0;height:100%;width:100%;z-index:10000;filter : progid:DXImageTransform.Microsoft.Alpha(opacity=75);border:0'></iframe>";
    document.body.insertAdjacentHTML("beforeEnd",waitInfo);
}

function hideWaitInfo(){
	//alert("------------------------------------");
    if ($('_waitInfo'))
        document.body.removeChild($('_waitInfo'));
    if ($('_waitInfobg'))
        document.body.removeChild($('_waitInfobg'));
}

function loading(){
    showWaitInfo("正在加载数据，请稍候...");
}

function doBeforeSubmit(element){
	var form=element.form;
    showWaitInfo('提交数据，请稍候......');
    try
    {
        //校验必输项
        verifyTradeData(form);
        
        //拼统一串
        //crateMainTable();
		
		//子类的验证
		if (typeof element.childSubmitVerify != 'undefined' && element.childSubmitVerify instanceof Function) 
            element.childSubmitVerify();
		
		
        //子类业务界面其他操作
        if (typeof finishChildSave != 'undefined' && finishChildSave instanceof Function) 
            finishChildSave();

        //子类业务界面拼串
        if (typeof createChildEncodeStr != 'undefined' && createChildEncodeStr instanceof Function) 
        {
            createChildEncodeStr();
        }
       
        //保存编码字串
        //saveEncodeStr();
        
        //校验数据是否发生变化
        /*if ($needValidateDataChange)
            if (form.serialize()+$TradeExtendSerialize == _tradeInfo){
                throw new Error("资料没有发生变更，不需要提交！");
            }*/
        
    }catch(e)
    {        
        hideWaitInfo();
        Event.stop(event);
        if (e != $TradeExit)
        {
            var win = new TradeWin(200,120,400,250);
            win.alert(e.message);
        }
        
        //unlockForm(Event.element(event));
        
        return false;
    }

    return true;
}

function getDesc(element){
    if (element.desc)
        return element.desc;
    else
        return element.parentNode.previousSibling.innerText;
}

//function needMustFillPrompt(element){
//    return element.nullable=="no" && (!element.present() || (element.lookupCombo == "true" && $(element.id.slice(0, -5))!=null && !$(element.id.slice(0, -5)).present() ) )
//}
//
//function verifyTradeData(form){
//    
//    var result = true;
//    
//    form.getElements().each(function(element){
//        
//        if ( needMustFillPrompt(element) ){
//            
//            if (element.disabled == "true") return;
//            
//            var fielddesc="";
//            try
//            {
//                fielddesc = getDesc(element);
//            }catch(e) {;}
//            
//            result = false;
//            
//            hideWaitInfo();
//            
//            /*var win = new TradeWin(200,120,400,250);
//            win.alert(""+fielddesc+" 请输入内容");
//            element.focus();
//            
//            throw $break;*/
//            throw new Error(fielddesc+" 请输入内容");
//        }
//    });
//    
//    return result;
//}

//function displayEditBlur(event){
//    var element = Event.element(event);
//    var targetElement = $(element.targetId);
//    targetElement.innerHTML = element.value;
//    element.remove();
//}
//
//function displayEdit(parent){
//    if (!parent.innerHTML)  return;
//    
//    if ($("_displayEdit") && $("_displayEdit").targetId == parent.id)
//        return;
//        
//    if ($("_displayEdit"))
//        $("_displayEdit").blur();
//    
//    var edit = document.createElement("input");
//    edit = $(edit);
//    edit.type = "text";
//    edit.id = "_displayEdit";
//    
//    if (!parent.id){
//        var targetId = "_"+parent.tagName + parseInt(Math.random()*1000000).toString();
//        while($(targetId)!=null)
//            targetId = "_"+parent.tagName + parseInt(Math.random()*1000000).toString();
//        parent.id = targetId;
//    }
//    
//    edit.targetId = parent.id;
//    edit.value = parent.innerHTML;
//    
//    edit.observe('blur', displayEditBlur);
//    
//    if (parent.checkdata)
//    {
//        edit.checkdata = parent.checkdata;
//        addInputListener(edit);
//    }
//    
//    parent.innerHTML = "";
//    parent.appendChild(edit);
//
//    $("_displayEdit").focus();
//}


function ajaxDirectLink(linkName, params , refreshs, meth, beforeAction, afterAction){
    if ($(linkName).tagName.toLowerCase() == "a"){
    
        u="about:blank";
        try{
            u = $(linkName).href;
        }catch(ex){alert(ex.message)}
        
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
        alert("调用错误! 正确调用方法可以咨询 tangzhi 或参考其文档")
        return;
    }
    
    refreshParts = [];
    if (refreshs)
        refreshParts = refreshs.split(",");
    
    messageParts = ["_errorMsg","_webMessage", "_messageXml"];
    
    refreshParts = refreshParts.concat(messageParts);
    
    showWaitInfo("正在处理，请稍候...");
    
    if (beforeAction)
        eval(beforeAction);
    
    new Ajax.Request(u, {
        
        parameters: params,
        
        method: meth,
        
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
                    //if (arr[i].tagName.toLowerCase() == "div"  && arr[i].className && ["errbox", "errinfo", "errtxt", "errboximg", "errbn"].include(arr[i].className))   //old version
                    if (arr[i].tagName.toLowerCase() == "div"  && arr[i].className && ["wrapper4", "wrapper2", "dragArea", "body", "tip"].include(arr[i].className))
                        errorLevel++;
                    
                    if (errorLevel > 4)
                        throw $ErrorReport;
                        
                    if (!arr[i].id || !refreshParts.include(arr[i].id)) continue;
                    
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
                        else
                            $(arr[i].id).replace(arr[i].outerHTML);
                    }
                }
                
                tmp = null;
                
                //setTimeout(dealTradeMsg, 200);
                dealTradeMsg();
                
            }catch(ex){
                
                hideWaitInfo();
                ajaxEnd();
                if  (ex == $ErrorReport){
                	if (wade_sbtframe) {
						document.getElementById("wade_sbtframe").setAttribute("simplePage", "true");
						wade_sbtframe.document.write(transport.responseText);
					} else {
						if (window.confirm("程序发生异常，是否查看错误页面\n如果IE设置了禁止弹出页面，错误页面将无法显示！")) {
			            	var w = window.open("", null, "status=yes,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no");
			           	 	w.document.write(transport.responseText);
			            	w.document.close();
		            		}
					}
                    return;
                }
                else
                    alert(ex.message)
            }
            
            hideWaitInfo();
            ajaxEnd();      
            if (afterAction)
                eval(afterAction);
        }
        
    })
}


function ids2JSON(element, fields){
    
    element = $F(element)
    if (element.innerHTML){
        result = element.innerHTML;
    }else{
        result = $F(element);
    }
    
    if (typeof fields == 'string')
        fields = fields.split(",");
    
    len = fields.length;
    for(var i=0; i<len; i++){
        pattern = fields[i].strip();
        pattern1 = pattern + "=(.*?)([,}])";
        pattern2 = pattern + ":'#{1}'#{2}";
        result = result.gsub(pattern1, pattern2);
    }
    
    try{
        result = result.evalJSON();
    }catch(ex){
        alert(ex.message);
    }
    
    return result;
}

/**
 * page: 目标页面，如果为"",则表示当前页面
 * listener: 监听事件
 * options: 选项 Object
 */
function ajaxSwallow(page, listener ,options){
    
    var g = getTradeGlobal();
    var servletPath = g.servletPath;
    var pageName = page;
    if (pageName.blank())
        pageName = g.pageName;
    
    var u = servletPath+"?service=swallow/"+pageName+"/"+listener+"/1";
    
    new Ajax.Request(u,options);
}

if (!TabSet) TabSet={};
Object.extend(TabSet.prototype , {
    
    hide: function(index){
        if (this.tabs.length <= index) return;
        
        $("TabSet_"+this._id+"_tabCap_"+index).hide();
        $(this.tabs[index].container).hide();
    },
    
    show: function(index){
        if (this.tabs.length <= index) return;
        
        $("TabSet_"+this._id+"_tabCap_"+index).show();
        $(this.tabs[index].container).show();
    },
    
    visible: function(index){
        if (this.tabs.length <= index) return false;
        
        return $("TabSet_"+this._id+"_tabCap_"+index).visible();
    },
    
    toggle: function(index){
        if (this.tabs.length <= index) return;
        
        $("TabSet_"+this._id+"_tabCap_"+index).toggle();
        $(this.tabs[index].container).toggle();
    },
    
    hidemove: function(){
        var gomove = $(this._outerElmId+"gomove");
        if (gomove != null)
            gomove.hide();
    }
    
});

if (!TableEdit) TableEdit={};
Object.extend(TableEdit.prototype , {
    
    encode: function(headstr) {
		
		var rows = this.table.rows;
		var encodehead = headstr.split(",");
        
        var strTab = new StrTable(); 
        strTab.addTable(this.tableName.substr(0, 4), encodehead.length);
        
		for (var i=1; i<rows.length; i++) {
			if (this.getCell(rows[i], "X_TAG").innerText == "") continue;

			var row = rows[i];
			for (var j=0; j<encodehead.length; j++) {
			    
			    if (encodehead[j].substring(0,1)=="@"){
			        strTab.addField(this.tableName.substr(0, 4), encodehead[j].substring(1));
			    }
			    else{
			        var cell = this.getCell(row, encodehead[j]);
				    if (cell == null) alert("column " + encodehead[j] + " not found！");
                    
                    strTab.addField(this.tableName.substr(0, 4), cell.innerText);
                }
			}
		}

		return strTab.inspect();
	}
    
});

var XML = function(){
        return Try.these(
          function() {return new ActiveXObject("MSXML2.DOMDocument.3.0")},
          function() {return new ActiveXObject('Microsoft.XMLDOM')},
          function() {return document.implementation.createDocument("", "", null)}
        ) || false;
    }

/**
 * @author tz@2007-11-9 15:35
 */
function  dealScriptMessage(xml){
     if (xml.childNodes.length>0)
     {
        option = {}
        option.xml = xml;
        option.ok = function(){
            if (this.okFunc && !this.okFunc.blank())
                eval(this.okFunc);
            this.xml.removeChild(this.xml.childNodes[0]); 
            dealScriptMessage(this.xml)
        }
        option.cancel = function(){
            if (this.cancelFunc && !this.cancelFunc.blank())
                eval(this.cancelFunc);
            this.xml.removeChild(this.xml.childNodes[0]); 
            dealScriptMessage(this.xml)
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
        }
        var win = new TradeWin(200,120,400,250);
        
        if (option.type == "confirm")
		    win.confirm(option.message, option);
		else if (option.type == "error")
		    win.error(option.message, function(){return option.ok()});
		else
		    win.alert(option.message, function(){return option.ok()});
     }
}

Object.extend(String.prototype , {    
    toCamelize: function(){
        return this.toLowerCase().replace(/_/g,"-").camelize();
    }
})
/**
 * @author hongm@2007-12-5 15:35 控件判断表格为空报错
 */
	function checkField(tableName,message) {
		
    var rows = getElement(tableName).rows.length;
 
    if(rows<=1)
    {
    alert(message);
    return false;
  }
}
/**
 * 这个函数是为下面的checkStorageDataChange()方法服务的
 * 主要是将cond_开头的组件，拼成地址栏的字符串
 */
function getDescendantsByPre() {
	var fs = document.forms;
	var s="";
	for(var i=0;i<fs.length;i++) {
		var a=$(fs[i].name.length>0?fs[i].name:'Form0').descendants();
		for (var j=0;j<a.length;j++) {
			if (a[j].id.length>=5 && a[j].id.substring(0,5) == "cond_") {
				s+="&"+a[j].id+"="+a[j].value;
			}
		}
	}
	return s;
}
/**
 *简化版的判断页面中监控控件的值是否发生了改变如果改变了，提示，并且执行相应的操作
 *选择确定
 */
function simpleCheckStorageDataChange() {
	
			if (_tradeInfoAcct.length>0) {
			var temp = storageData();
			
			if (temp == _tradeInfoAcct) {
				//alert("没有数据变化...");
			} else {
				alert("页面数据已发生改变，请重新查询");
				var paramString = getDescendantsByPre();
				redirectTo(pagevisit.getAttribute("pagename"), 'init',paramString, 'currentframe');
				throw new Error('页面数据改变...');
			}
		}
	}
/**
 * 页面提交的时候，判断页面中监控控件的值是否发生了改变，如果改变了，提示，并且执行相应的操作
 * 选择是，则换一个新的页面，只保留查询区域内容
 * 选择否，则还原监控控件的值
 */
function checkStorageDataChange() {
			
			if (_tradeInfoAcct.length>0) {
			var temp = storageData();
			
			if (temp == _tradeInfoAcct) {
				//alert("没有数据变化...");
			} else {
				var win = new TradeWin(200,120,400,250);
				win.confirm("查询区域数据发生变化，选择\"【确定】\"进行新的查询，选择\"【取消】\"还原被改变的查询区域数据", {
					ok:function() {
						//alert("这里还没有做好，要跳转到父类的函数");
						var paramString = getDescendantsByPre();
						redirectTo(pagevisit.getAttribute("pagename"), 'init',paramString, 'currentframe');
						},
					cancel:function() {
						
						var a = _tradeInfoAcct.split("&");
						for(var i=0;i<a.length;i++) {
							var b = a[i].split("=");
							//......?????????????????????????????????
							//这里只是针对了select, text 两种控件
							//要进行扩展，使其支持所有的页面控件
							if ($(b[0]).tagName && $(b[0]).tagName.toUpperCase() == "SELECT") {
									for(var j=0;j<$(b[0]).options.length;j++){
										if ($(b[0]).options[j].value == b[1]) {
											$(b[0]).options[j].selected = true;
											break;
										}
									}
								} else if ($(b[0]).type.toUpperCase() == "TEXT") {
									
									$(b[0]).value=b[1];
								}
							}
						
						}
					});
				throw new Error('页面数据改变...');
			}
		}
	}
	
/**
 * 统一认证
 * 从营业那边copy过来的
 */
function promptAuth(rightCode,chkMode,serialNumber,psptType,psptId,routeEparchy)
{
	/**********屏蔽统一认证功能******************/
	return true;
	/****************************/
    var params = "&showMode=1&chkMode="+chkMode+"&rightCode="+rightCode;
    params += "&serialNumber="+serialNumber;
    params += "&psptType="+psptType + "&psptId="+psptId;
    params += "&routeEparchy="+routeEparchy;
    var result =  popupDialogAcct("pub.chkcust.MainChkCust","init",params,"客户统一认证","500","200","");

    if(result=="true")
    {
        return true;
    }
    else
    {
        //return false;
        //营业有问题，所以现在都过滤掉
        return true;
    }
}

function popupDialogAcct(page, listener, params, title, width, height, subsyscode, subsysaddr) {
	if (title == null) title = "弹出窗口";
	if (width == null) width = 400;
	if (height == null) height = 300;
	
	var url = "custserv" + "?service=page/" + page;//"custserv" + "?service=page/" + page;
	if (listener != null) url += "&listener=" + listener;
	if (params != null) url += params;
	url = getSysAddr(url, subsyscode, subsysaddr);
	if (url.indexOf("&%72andom=") == -1) url += "&random=" + getRandomParam();
	//增加的5个,看懂代码后去掉
	url += "&provinceId="+pagevisit.getAttribute("provinceId");
	url += "&loginEpachyId="+pagevisit.getAttribute("loginEpachyId");
	url += "&cityId="+pagevisit.getAttribute("cityId");
	url += "&staffId="+pagevisit.getAttribute("staffId");
	url += "&deptId="+pagevisit.getAttribute("deptId");
	///////
	var obj = new Object();
	obj.title = title;
	obj.width = width;
	obj.height = height;
	obj.url = url;
	obj.parentwindow = window;
	var returnValue = openDialog(getContextName() + "?service=page/component.Agent&random=" + getRandomParam(), width, height, obj);
	if (returnValue != null) {
		var pageName = returnValue.$pageName;
		if (pageName != null) {
			redirectTo(pageName, returnValue.$listener, returnValue.$parameters, returnValue.$target);
		}
	}
	return returnValue;
}

//获取一个区域中所有的插入控件名，递归调用
//str--Array类型
//obj:区域对象
//author:wangxy2
//date:2008-9-5
function getInputCtrlList(obj,str) {
    if(obj == null || !obj.hasChildNodes() || str== null) {
        return;
    }
                    
    if(obj.hasChildNodes()) {
        var nodeList = obj.childNodes;
        for(var i = 0;i < nodeList.length;i++) {
            if(nodeList[i].tagName == "INPUT" || nodeList[i].tagName == "SELECT") {
            	var tmpName = "";
                if(nodeList[i].name != null && nodeList[i].name.length > 0 ) {
					tmpName = nodeList[i].name;
                } else if(nodeList[i].id != null && nodeList[i].id.length > 0 ) {
                	tmpName = nodeList[i].id;
                } 
                if(tmpName != "") { 
                	var tmpIdx = tmpName.indexOf("$");
					if(tmpIdx >= 0 && (tmpName.substr(tmpIdx) == "$dspl" || tmpName.substr(tmpIdx) == "$lst"))
						continue;
                    str[str.length++] = tmpName;
                }
            }
            getInputCtrlList(nodeList[i],str);
        }
    }               
}

function getParamerString(obj) {
    if(typeof obj == "string") obj = $(obj);
    if(obj != null) {
        var str = new Object();
        str.value = "";
        getAreaParamCtrlValue(obj,str);
        return str.value;
    }
}

function getAreaParamCtrlValue(obj,str) {
    if(obj == null || !obj.hasChildNodes()) {
        return;
    }
    
    if(obj.hasChildNodes()) {
        var nodeList = obj.childNodes;
        for(var i = 0;i < nodeList.length;i++) {
            if(nodeList[i].tagName == "INPUT" || nodeList[i].tagName == "SELECT") {
            	var tmpName = "";
                if(nodeList[i].name != null && nodeList[i].name.length > 0 ) {
					tmpName = nodeList[i].name;
                } else if(nodeList[i].id != null && nodeList[i].id.length > 0 ) {
                	tmpName = nodeList[i].id;
                } 
                if(tmpName != "") { 
                	var tmpIdx = tmpName.indexOf("$");
					if(tmpIdx >= 0 && (tmpName.substr(tmpIdx) == "$dspl" || tmpName.substr(tmpIdx) == "$lst"))
						continue;
				    str.value += "&";
                    str.value += tmpName;
                    str.value += "=";
                    str.value += nodeList[i].value;
                }
            }
            getAreaParamCtrlValue(nodeList[i],str);
        }
    }
}

function showErrMsg(obj) {
	document.getElementById("errorMsg").style.display = "";
    document.getElementById("errorMsg").style.left = event.clientX;
    document.getElementById("errorMsg").style.top = event.clientY;
    document.getElementById("errorMsg").innerText = obj;
    setTimeout("document.getElementById('errorMsg').style.display = 'none'", 1000);
    /*if(document.getElementById("errmsg") == null) {
	    var errmsg = document.createElement("div");
		errmsg.className = "popNoteMsg";
		var h = getPageHeight() + "px";
		errmsg.style.height = h;
		errmsg.id = "errmsg";
				
		var msg = document.createElement("div");
		msg.className = "popNote";
		msg.innerText = obj;
		errmsg.appendChild(msg);
		//errmsg.innerHTML = "<iframe class=\"c_overfrm\" style=\"height:" + getPageHeight() + "px;\" frameborder=no></iframe>";
		document.body.appendChild(errmsg);
		setTimeout("document.getElementById('errmsg').style.display = 'none';document.body.removeChild(errmsg);", 1000);
	}*/
}

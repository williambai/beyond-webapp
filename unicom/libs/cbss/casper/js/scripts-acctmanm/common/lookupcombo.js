/****************************************************
 *    Created By Tangzhi@2007-11-15 14:38
 *    lookupCombo.js
 *    encoding: GBK
 ***************************************************/

var LookupCombo = {
    
    timers:{},
    
    onfocus:function(event){
        element = Event.element(event);
        try{
            box = new LookupComboBox(element);
            box.match(element.value);
        }catch(ex){debug(ex.message)}
    },
    
    onkeydown: function(event){
        if  (event.keyCode == Event.KEY_RETURN){
            element = Event.element(event);
            
            LookupCombo.displayValue(element);
            
            event.keyCode = Event.KEY_TAB;
            
        }else if (event.keyCode == Event.KEY_DOWN){
            try{
            element = Event.element(event);
            
            baseId = element.id.slice(0, -5);
            
            row = null;
            if (element.rowselected)
                row = $(element.rowselected);
            
            if  (row && row.next()){
                
                if (row.className && row.className=="lookupSelect") {}
                else row.className = ""
                    
                row = row.next();
            }
            else{
                if (row){
                    if (row.className && row.className=="lookupSelect") {}
                    else row.className = ""
                }
                
                row = $(baseId+"$box").rows[0];
            }
            
            if (row.className && row.className=="lookupSelect") {}
            else row.className = "hover"
            
            LookupCombo.record(row);
            
            rowpos = Position.cumulativeOffset(row);
            parpos = Position.cumulativeOffset($(baseId+"$box$p"));
            
            Position.prepare();
            var k= Position.within($(baseId+"$box$p"), rowpos[0], rowpos[1] + 30 - $(baseId+"$box").parentNode.scrollTop);
            
            if (k==false){
                $(baseId+"$box").parentNode.scrollTop = rowpos[1] - parpos[1] - 40;
            }
            }catch(ex){debug(ex.message)}
        }else if (event.keyCode == Event.KEY_UP){
            
            element = Event.element(event);
            
            baseId = element.id.slice(0, -5);
            
            row = null;
            if (element.rowselected)
                row = $(element.rowselected);
            
            if  (row && row.previous()){
                
                if (row.className && row.className=="lookupSelect") {}
                else row.className = ""
                    
                row = row.previous();
            }
            else{
                if (row){
                    if (row.className && row.className=="lookupSelect") {}
                    else row.className = ""
                        
                    row = $(baseId+"$box").rows[ $(baseId+"$box").rows.length - 1 ];
                }
                else
                    row = $(baseId+"$box").rows[0];
            }
            
            if (row.className && row.className=="lookupSelect") {}
            else row.className = "hover"
            
            LookupCombo.record(row);
            
            rowpos = Position.cumulativeOffset(row);
            parpos = Position.cumulativeOffset($(baseId+"$box$p"));
            
            Position.prepare();
            var k= Position.within($(baseId+"$box$p"), rowpos[0], rowpos[1] - 30 - $(baseId+"$box").parentNode.scrollTop);
            
            if (k==false){
                $(baseId+"$box").parentNode.scrollTop = rowpos[1] - parpos[1] - 40;
            }
            
        }
    },
    
    onkeyup:function(event){
        element = Event.element(event);
        
        if (element.value == ""){
            ele_value = $(element.id.slice(0, -5))
            element.preValue = "";
            element.preLabel = "";
            LookupCombo.locate(element);
        }

        if ([ 0, Event.KEY_RETURN, Event.KEY_ESC, Event.KEY_LEFT,
            Event.KEY_UP, Event.KEY_RIGHT, Event.KEY_DOWN,
            Event.KEY_HOME, Event.KEY_END, Event.KEY_PAGEUP, Event.KEY_PAGEDOWN,
            16, 17, 18, 229 ].include(event.keyCode)) 
            return;
        
        LookupCombo.match(element);
    },
    
    onblur:  function(event){
        elt = Event.element(event);
        if (!elt.lookupCombo) return;
        
        var timer = setTimeout(function(){
            box = new LookupComboBox(elt, true);
            LookupCombo.displayValue(elt);
        }, 200);
        
        LookupCombo.timers[element.id] = timer;
    },
    
    wrapperFocus:  function(event){
        var baseId = LookupCombo.getBaseId(Event.element(event));
        if (LookupCombo.timers[baseId+"$dspl"] != null){
            clearTimeout(LookupCombo.timers[baseId+"$dspl"]);
            LookupCombo.timers[element.id] = null;
        }
    },
    
    wrapperBlur: function(event){
        var baseId = LookupCombo.getBaseId(Event.element(event));
        $(baseId+"$dspl").focus();
    },
    
    boxClick: function(event){
        
        //try{
            row = Event.findElement(event, "tr");
            
            if (row.parentNode.parentNode.parentNode.className != "LookupContentWrapper")
                return;
            
            elt = LookupCombo.record(row);
            
            LookupCombo.displayValue(elt);
            
            LookupCombo.show(elt.id.slice(0, -5), "none");
            
        //}catch(ex){debug(ex.message)}
    },
    
    onmouseover: function(event){
        
        element = Event.findElement(event, "tr");
        
        if (element.className == "lookupSelect") return;
        
        element.className = "hover";
    },
    
    onmouseout: function(event) {
        
        element = Event.findElement(event, "tr");
        
        if (element.className == "lookupSelect") return;
        
        if (element.className == "hover")
            element.className = "";
        
    },
    
    show: function(baseId, mode){
		if ($(baseId + "$box$p") != null) {
			$(baseId + "$box$p").style.display = mode;
			$(baseId + "$box$sha").style.display = mode;
		}
    },
    
	disabled: function(ele, mode){
		
		var id = ele.id;
		if (id.endsWith("$dspl"))
			id = id.slice(0, -5);
		
		$(id+"$dspl").disabled = mode;
		$(id+"$img").disabled = mode;
	},
	
    record: function(row){
        
        id = LookupCombo.getBaseId(row);
        
        if (id.blank()) return;
        
        id = id + "$dspl";
        
        titleCodes = $A($(id).titleCodes.split(","));
        
        valueCode = $(id).valueCode;
        labelCode = $(id).labelCode;
        var i = titleCodes.indexOf(valueCode)

        value = row.cells[i].innerText;  //"$dspl".length = 5
        j = titleCodes.indexOf(labelCode)
        
        label = row.cells[j].innerText?row.cells[j].innerText:"";
        
        $(id).preValue = value;
        $(id).preLabel = label;
        $(id).rowselected = row;
        
        if ($(id).onchanging){
            if (typeof $(id).onchanging == "string") {
                (Function($(id).onchanging).bind($(id)))();
            }
            else if ($(id).onchanging instanceof Function)
                (element.onchanging.bind(element))();
        }
        
        return $(id);
    },
    
    getValue: function(element) {

        if (!element.id || !element.id.endsWith("$dspl")) return;

        baseId = element.id.slice(0, -5);

        return $(baseId).value;
    },
    
    setValue: function(element, value) {
        if (!element.lookupComboValue || element.lookupComboValue!="true") return;
        
        box = new LookupComboBox($(element.displayId), true);
        box.locate(value);
        LookupCombo.displayValue($(element.displayId));
        LookupCombo.update(element);
    },
	
	/**
	 * 获取列表数据,以Xml的ChildNodes形式返回
	 * @param {String/Object} elm   可以是id也可以是对象.可以是baseId对象也可以是显示框$dspl
	 * @return {Nodes} nodes 以xml的childNodes形式返回列表数据.
	 */
	getRows: function(elm){
		elm = $(elm);
		
		if (elm.id && elm.id.slice(-5)=="$dspl") {
            baseId = elm.id.slice(0,-5);    
        }
        else
            baseId = elm.id;
			
		
		var xmlList = new XML();
        
        if (xmlList.loadXML($F(baseId + "$lst"))) {
			return xmlList.documentElement.childNodes;
		}
	},
	
	getRowValue: function(elm, idx){
		elm = $(elm);
		
		if (elm.id && elm.id.slice(-5)=="$dspl") {
            baseId = elm.id.slice(0,-5);    
        }
        else
            baseId = elm.id;
		
		var opts = this.getRows(elm);
		
		var valueCode = $(baseId+"$dspl").valueCode.toCamelize();
		
		return opts[idx].getAttribute(valueCode);
	},
    
    displayValue : function(element){
        
        if (element.preLabel === undefined) return;
        
        element.value = element.preLabel;
        
        var changed = false;
        baseId = element.id.slice(0, -5);
        
        if ($(baseId).value !== element.preValue)
            changed = true;
        
        $(baseId).value = element.preValue;
        
        if (element.preValue == "" && element.preLabel == "" && element.prompt){
            element.value = element.prompt;
        }
        
        if (changed && element.onrealvaluechange){
            if (typeof element.onrealvaluechange == "string" && !element.onrealvaluechange.blank()) {
                (Function(element.onrealvaluechange).bind(element))();
            }
            else if (element.onrealvaluechange instanceof Function)
                (element.onrealvaluechange.bind(element))();
        }
        
        if (element.rowselected){
            
            $A(document.getElementsByClassName("lookupSelect", $(baseId+"$box"))).each(function(element){
                element.className = "";
            })
        
            element.rowselected.className="lookupSelect";
            
        }
        //debug("label:"+element.preLabel + ",value:"+element.value);
    },
    
    match: function(element){
        box = new LookupComboBox(element);
        box.locate(element.value, true);
    },
    
    locate: function(element){
        box = new LookupComboBox(element);
        box.locate(element.value);
    },
    
    getBaseId: function(element){
        while (element.parentNode 
            && (!element.id || !element.id.endsWith('$box$p')))
            element = element.parentNode;
        
        if (!element.id) return "";
        
        return element.id.slice(0, -6);
    },
    
    /*数据源发生变化时调用该方法，以刷新列表*/
    update: function(element) {
        
        if (element.id && element.id.slice(-5)=="$dspl") {
            baseId = element.id.slice(0,-5);    
        }
        else
            baseId = element.id;
        
        if ($(baseId + "$box$p") != null) {
            $(baseId + "$box$sha").remove();
            $(baseId + "$box$p").remove();
        }
    }
    
}

var LookupComboBox = Class.create();

//值框 name   {BASE_ID}
//显示框 name+$dspl
//列表框 name+$lst
//表格框 name+$box
//表格框表皮  name+$box+$p
//表格框表皮底  name+$box+$sha
Object.extend(LookupComboBox.prototype , {
    
    TITLE : [],
    TITLE_CODE : [],
    valueCode: "",
    labelCode: "",
    TOP: "0",
    LEFT: "0",
    HEIGHT: "180px",
    WIDTH: "240px",
    SCROLL_WIDTH: "18px",
    COL_COUNT: 3,
    
    initialize:function(element, hide){
        
        //初始化
        this.initParam(element);
        
        //显示or隐藏
        if ($(this.BASE_ID + "$box$p")==null){
            this.draw();
            if (hide) this.hide();
        }
        else if (!hide){
            this.show();
            this.clearHover();
        }else {
            this.hide();
        }
    },
    
    initParam: function(element){
        
        this.TITLE = element.titles.split(",");
        this.TITLE_CODE = element.titleCodes.split(",");
        this.valueCode = element.valueCode;
        this.labelCode = element.labelCode;
        
        //计算常量
        //left top 
        var pos = Position.cumulativeOffset(element);
        this.LEFT = pos[0];
        this.TOP = pos[1] + element.offsetHeight;
        
        //height width colnum
        if (element.boxHeight)
            this.HEIGHT = element.boxHeight;
            
        this.CLIENT_HEIGHT = parseInt(this.HEIGHT,10) - 18 - parseInt(this.SCROLL_WIDTH);
        this.CLIENT_HEIGHT += "px";
            
        if (parseInt(this.TOP)+parseInt(this.HEIGHT) > document.body.clientHeight){
            this.TOP = parseInt(pos[1],10) - parseInt(this.HEIGHT,10);
            element.appearAbove = true;
        }
        
        if (element.boxWidth){
            this.WIDTH = element.boxWidth;
            this.CLIENT_WIDTH = parseInt(this.WIDTH,10) - parseInt(this.SCROLL_WIDTH,10);
            this.CLIENT_WIDTH = this.CLIENT_WIDTH + "px";
        }
        else {
            this.CLIENT_WIDTH=0;
            for (var  i=0; i<this.TITLE.length; i++){
                var theTitle = this.TITLE[i];
                var titleLength = isNaN(parseInt(theTitle.split(":")[1],10))?50:parseInt(theTitle.split(":")[1],10);
                this.CLIENT_WIDTH = this.CLIENT_WIDTH + titleLength;
            }
            this.WIDTH = this.CLIENT_WIDTH + parseInt(this.SCROLL_WIDTH,10)+2;
            this.CLIENT_WIDTH = this.CLIENT_WIDTH + "px";
            this.WIDTH = this.WIDTH + "px";
        }
        
        this.COL_COUNT = this.TITLE.length + 1;
        
        this.BASE_ID = element.id;
        this.BASE_ID = this.BASE_ID.slice(0, -5);
        
    },
    
    draw: function(){
        
        ////
        var titleContent = "<tr>";
        for (var i=0; i<this.TITLE_CODE.length; i++){
			if (i<this.TITLE.length){
				var theTitle = this.TITLE[i];
            	var titleName = theTitle.split(":")[0];
            	var titleLength = isNaN(parseInt(theTitle.split(":")[1],10))?"auto":(parseInt(theTitle.split(":")[1],10)+"px");
            	titleContent = titleContent + "<td width=\""+titleLength+"\">"+titleName+"</td>"
			}
            else{
				titleContent = titleContent + "<td style=\"display:none\">"+this.TITLE_CODE[i]+"</td>"
			}
        }
        titleContent = titleContent + "<td style=\"width:"+this.SCROLL_WIDTH+";white-space: nowrap;\"></td></tr>";
        
        ////
        var lstContent = new Array;
        lstContent[lstContent.length] = "<tbody>";
        var xmlList = new XML();
        
        if (xmlList.loadXML($(this.BASE_ID+"$lst").value)){
            
            var opts = xmlList.documentElement.childNodes;
            for(var i=0; i<opts.length; i++){
                lstContent[lstContent.length] = "<tr>";
                for(var j=0; j<this.TITLE_CODE.length; j++){
					
					var attrName = this.TITLE_CODE[j].toCamelize();
					
					if (j<this.TITLE.length){
						lstContent[lstContent.length] = "<td";
	                    if (i==0){
	                        var theTitle = this.TITLE[j];
	                        var titleLength = isNaN(parseInt(theTitle.split(":")[1],10))?"auto":(parseInt(theTitle.split(":")[1],10)+"px");
	                        lstContent[lstContent.length] = " width=\"";
							lstContent[lstContent.length] = titleLength;
							lstContent[lstContent.length] = "\">";
	                    }
	                    else{
	                        lstContent[lstContent.length] =  ">"
	                    }
	                    lstContent[lstContent.length] = opts[i].getAttribute(attrName);
						lstContent[lstContent.length] = "</td>";
					}else{
						lstContent[lstContent.length] = "<td style=\"display:none\">";
						lstContent[lstContent.length] =opts[i].getAttribute(attrName);
						lstContent[lstContent.length] = "</td>";
					}
                }
                lstContent[lstContent.length] = "</tr>";
            }
        }
        lstContent[lstContent.length] = "</tbody>";
        
        /////
        var ret = new Array;
        ret[ret.length] = '<div class="LookupWrapper"  id="'+this.BASE_ID+'$box$p" onfocus="LookupCombo.wrapperFocus(event)" onblur="LookupCombo.wrapperBlur(event)"';
        ret[ret.length] = 'style="left:'+this.LEFT+';top:'+this.TOP+';height:'+this.HEIGHT+';width:'+this.WIDTH+';z-index:10">';
        ret[ret.length] = '<table height="'+this.HEIGHT+'"><thead onselectstart="return false">'+titleContent+'</thead>';
        ret[ret.length] = '<tfoot><tr><td colSpan='+this.COL_COUNT+'>Created by tangzhi@Linkage</td></tr></tfoot>';
        ret[ret.length] = '<tbody><tr><td colSpan='+this.COL_COUNT+'><div style="height:'+this.CLIENT_HEIGHT+'" class="LookupContentWrapper"  onfocus="LookupCombo.wrapperFocus(event)" onblur="LookupCombo.wrapperBlur(event)"><table width="';
        ret[ret.length] = this.CLIENT_WIDTH+'" onclick="LookupCombo.boxClick(event)" id="'+this.BASE_ID+'$box" onmouseover="LookupCombo.onmouseover(event)" onmouseout="LookupCombo.onmouseout(event)">'+lstContent.join("");
        ret[ret.length] = '</table></div></td></tr></tbody></table></div>';
        ret[ret.length] = '<iframe id="'+this.BASE_ID+'$box$sha" frameborder="0" style="background-color:#ffffff;position:absolute;left:'+this.LEFT+';top:'+this.TOP+';height:'+this.HEIGHT+';width:'+this.WIDTH+';z-index:6;border:0"></iframe>';
        var str = ret.join('');
                
        document.body.insertAdjacentHTML("beforeEnd",str);
    },
    
    show: function(){
        LookupCombo.show(this.BASE_ID, "block");
    },
    
    hide: function(){
        LookupCombo.show(this.BASE_ID, "none");
    },
    
    clearHover: function(){
        
        $A(document.getElementsByClassName("hover", $(this.BASE_ID+"$box"))).each(function(element){
                element.className = "";
            });
        
    },
    
    getSelected: function(){
        
        selectRow = document.getElementsByClassName("lookupSelect", $(this.BASE_ID+"$box"));
        if (selectRow.length>0)
            return selectRow[0];
        
        return null;
    },
    
    showSelected: function(){
        
        selectRow = this.getSelected();
        
        if (selectRow == null) return;
        
        return this.gotoRow(selectRow);
    },
    
    gotoRow: function(row){
        rowpos = Position.cumulativeOffset(row);
                
        Position.prepare();
        var k= Position.within($(this.BASE_ID+"$box$p"), rowpos[0], rowpos[1] + 30 - $(this.BASE_ID+"$box").parentNode.scrollTop);
        if (k==false){
            $(this.BASE_ID+"$box").parentNode.scrollTop = rowpos[1] - 60;
        }
        
        return row;
    },
    
    getValueColIndex: function(){
        
        id = this.BASE_ID + "$dspl";
        
        titleCodes = $A($(id).titleCodes.split(","));
        valueCode = $(id).valueCode;
        
        return titleCodes.indexOf(valueCode);
    },
    
    getLabelColIndex: function(){
        
        id = this.BASE_ID + "$dspl";
        
        titleCodes = $A($(id).titleCodes.split(","));
        labelCode = $(id).labelCode;
        
        return titleCodes.indexOf(labelCode);
    },
    
    match: function(value) {
        return this.locate(value, true);
    },
    
    locate: function(value, match){
        
        selectRow = this.getSelected();
        if (selectRow != null){
            if (selectRow.cells[this.getValueColIndex()].innerHTML == value 
                || (match && selectRow.cells[this.getLabelColIndex()].innerHTML == value)){
                this.gotoRow(selectRow);
                return selectRow;
            }else{
                selectRow.className = "";
                id = this.BASE_ID + "$dspl";
                $(id).preValue = "";
                $(id).preLabel = "";
                $(id).rowselected = null;
            }
        }
        
        if (value.empty()){
			id = this.BASE_ID + "$dspl";
            $(id).preValue = "";
            $(id).preLabel = "";
            $(id).rowselected = null;
			return null;
		}
        
        rows = $(this.BASE_ID+"$box").rows;
        count = rows.length;
        for(var i=0; i<count; i++){
            
            if (rows[i].cells[this.getValueColIndex()].innerHTML.startsWith(value)
              ||  (match && rows[i].cells[this.getLabelColIndex()].innerHTML.startsWith(value)) ){
                
                row = rows[i];
                if (row.className && row.className=="lookupSelect") {}
                else row.className = "hover"
                
                LookupCombo.record(row);
                
                return this.gotoRow(row);
            }
        }
    }
})

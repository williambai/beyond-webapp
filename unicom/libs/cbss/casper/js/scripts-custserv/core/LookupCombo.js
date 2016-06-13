/****************************************************
 *    Created By Tangzhi@2007-11-15 14:38
 *    lookupCombo.js
 *    encoding: GBK
 ***************************************************/
Cs.flower.LookupCombo = {
    
    timers:{},
    
    onfocus:function(event){
        element = Event.element(event);
        try{
            box = new Cs.flower.LookupComboBox(element);
            
            rows = $(box.BASE_ID+"$box").rows;
            count = rows.length;
            for(var i=0; i<count; i++){
            	rows[i].style.display = "block";
            }
            
            box.match(element.value);
        }catch(ex){debug(ex.message)}
    },
    
    onkeydown: function(event){
        if  (event.keyCode == Event.KEY_RETURN){
            element = Event.element(event);
            
            //Cs.flower.LookupCombo.displayValue(element);
            
            //event.keyCode = Event.KEY_TAB;
            
            box = new Cs.flower.LookupComboBox(element);

            rows = $(box.BASE_ID+"$box").rows;
            value = element.value;
            count = rows.length;
            /*if(value.include("-----请选择-----") || value.empty()){
            	for(var i=0; i<count; i++){
            		rows[i].style.display="block";
            	}
            } else{
                for(var i=0; i<count; i++){
       	 			var pf = false;
       	 			var arr = rows[i].cells;
       	 			if(arr&&arr.length>0){
       	 				var pl = arr.length;
            			for(var j=0; j<box.TITLE.length; j++){
            			if(j<pl){
							var tempV = arr[j].innerHTML;
            				if (tempV.include(value)){	
                				pf = true;
                				break;
            				}
            			}
               	  	}
               		if(pf){
               			rows[i].style.display="block";
               		}else{
               			rows[i].style.display="none";
               		}
               	  }
        	   }
            }*/
        
           //----2011.8.16--add by zhoucs----start
	        baseId = element.id.slice(0, -5);          
	        row = null;
	        label = null;
	        if (element.rowselected)
	           row = $(element.rowselected);
	            
	        if (row){
                elt = Cs.flower.LookupCombo.record(row);
                Cs.flower.LookupCombo.displayValue(elt);          
                Cs.flower.LookupCombo.show(elt.id.slice(0, -5), "none");
            }
            element = Event.element(event);
            event.keyCode = Event.KEY_TAB; 
            //----2011.8.16--add by zhoucs----end

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
                while(row &&row.style.display=="none"&& row.next()){
                	 row = row.next();
                }
                if(row&&row.style.display=="none"){
                	if (row){
                    	if (row.className && row.className=="lookupSelect") {}
                    	else row.className = ""
                	}
               		if($(baseId+"$box")){
                		row = $(baseId+"$box").rows[0];
               		}
                   while(row&&row.style.display=="none" && row.next()){
                	 row = row.next();
                	}
                }
            }
            else{
                if (row){
                    if (row.className && row.className=="lookupSelect") {}
                    else row.className = ""
                }
               if($(baseId+"$box")){
                row = $(baseId+"$box").rows[0];
                }
               while(row&&row.style.display=="none" && row.next()){
                	 row = row.next();
               }
            }
            if(row){
            if (row.className && row.className=="lookupSelect") {}
            else row.className = "hover"
            
            Cs.flower.LookupCombo.record(row);
            
            rowpos = Position.cumulativeOffset(row);
            parpos = Position.cumulativeOffset($(baseId+"$box$p"));
            
            Position.prepare();
            var k= Position.within($(baseId+"$box$p"), rowpos[0], rowpos[1] + 30 - $(baseId+"$box").parentNode.scrollTop);
            
            if (k==false){
                $(baseId+"$box").parentNode.scrollTop = rowpos[1] - parpos[1] - 40;
            }
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
                while(row&&row.style.display=="none"&&row.previous()){
                	 row = row.previous();
                }
                if(row&&row.style.display=="none"){
                		 if (row){
                    		if (row.className && row.className=="lookupSelect") {}
                    		else row.className = ""
                    		row = $(baseId+"$box").rows[ $(baseId+"$box").rows.length - 1 ];
                		}
                		else
                   			 row = $(baseId+"$box").rows[0];
                		 while(row&&row.style.display=="none" && row.previous()){
                			 row = row.previous();
                		 }
                	}
            }
            else{
                if (row){
                    if (row.className && row.className=="lookupSelect") {}
                    else row.className = ""
                        
                    row = $(baseId+"$box").rows[ $(baseId+"$box").rows.length - 1 ];
                }
                else
                    row = $(baseId+"$box").rows[0];
                
                 while(row&&row.style.display=="none" && row.previous()){
                			 row = row.previous();
                		 }
            }
            if(row){
            if (row.className && row.className=="lookupSelect") {}
            else row.className = "hover"
            
            Cs.flower.LookupCombo.record(row);
            
            rowpos = Position.cumulativeOffset(row);
            parpos = Position.cumulativeOffset($(baseId+"$box$p"));
            
            Position.prepare();
            var k= Position.within($(baseId+"$box$p"), rowpos[0], rowpos[1] - 30 - $(baseId+"$box").parentNode.scrollTop);
            
            if (k==false){
                $(baseId+"$box").parentNode.scrollTop = rowpos[1] - parpos[1] - 40;
            }
            }
            
        }
    },
    
    onkeyup:function(event){
        element = Event.element(event);
        if (element.value == ""&&element.rowselected==null){
              //return;
            ele_value = $(element.id.slice(0, -5))
            element.preValue = "";
            element.preLabel = "";
            Cs.flower.LookupCombo.locate(element);
        }

        if ([ 0, Event.KEY_RETURN, Event.KEY_ESC, Event.KEY_LEFT,
            Event.KEY_UP, Event.KEY_RIGHT, Event.KEY_DOWN,
            Event.KEY_HOME, Event.KEY_END, Event.KEY_PAGEUP, Event.KEY_PAGEDOWN,
            16, 17, 18, 229 ].include(event.keyCode)) 
            return;
        
        Cs.flower.LookupCombo.match(element);
    },
    
    onblur:  function(event){
        elt = Event.element(event);
        if (!elt.lookupCombo) return;
        
        var timer = setTimeout(function(){
            box = new Cs.flower.LookupComboBox(elt, true);
            Cs.flower.LookupCombo.displayValue(elt);
        }, 200);
        
        Cs.flower.LookupCombo.timers[element.id] = timer;
    },
    
    wrapperFocus:  function(event){
        var baseId = Cs.flower.LookupCombo.getBaseId(Event.element(event));
        if (Cs.flower.LookupCombo.timers[baseId+"$dspl"] != null){
            clearTimeout(this.timers[baseId+"$dspl"]);
            Cs.flower.LookupCombo.timers[element.id] = null;
        }
    },
    
    wrapperBlur: function(event){
        var baseId = Cs.flower.LookupCombo.getBaseId(Event.element(event));
        $(baseId+"$dspl").focus();
    },
     
    boxClick: function(event){
        
        //try{
            row = Event.findElement(event, "tr");
            
            if (row.parentNode.parentNode.parentNode.className != "LookupContentWrapper")
                return;
            
            elt = Cs.flower.LookupCombo.record(row);
            
            Cs.flower.LookupCombo.displayValue(elt);
            
            this.show(elt.id.slice(0, -5), "none");
            
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
	/**
	 *  该功能表示设置文本框、下拉框等背景颜色。  add  by zhaoqianjin
	 *  ele 表示 $当前对象. 例如： $("TOWN_FLAG$dspl")
	 *  value 表示颜色值. 例如：白色 #FFFFFF.
	 **/
	setStyle: function(ele, value){
		if(ele == undefined)  return ;
		var id = ele.id;
		if (id.endsWith("$dspl"))
			id = id.slice(0, -5);
		
		if(ele != null && ele != undefined ){
			$(id +"$dspl").style.backgroundColor = value;
		}
	},
	
    record: function(row){
        
        id = Cs.flower.LookupCombo.getBaseId(row);
        
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
        if (!element||!element.lookupComboValue || element.lookupComboValue!="true") return;
        
        box = new Cs.flower.LookupComboBox($(element.displayId), true);
        box.locate(value);
        Cs.flower.LookupCombo.displayValue($(element.displayId));
        //Cs.flower.LookupCombo.update(element);
         this.show($(element.displayId).id.slice(0, -5), "none");//modify by zhangyangshuo
    },
	
	clear:function(element){
        if (!element.lookupComboValue || element.lookupComboValue!="true") return;
        
        element.value="";
        var elmDspl = $(element.displayId);
        elmDspl.preValue="";
        elmDspl.preLabel="";
        if (elmDspl.rowselected)
            elmDspl.rowselected.className="";
        elmDspl.rowselected=null;
        elmDspl.value="";
        if (elmDspl.preValue == "" && elmDspl.preLabel == "" && elmDspl.prompt){
            elmDspl.value = elmDspl.prompt;
        }
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
			
		
		var xmlList = new Cs.util.XML();
        
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
		
		var opts = Cs.flower.LookupCombo.getRows(elm);
		
		var valueCode = $(baseId+"$dspl").valueCode.toCamelize();
		
		return opts[idx].getAttribute(valueCode);
	},
    
    displayValue : function(element){
        
        if (element.preLabel === undefined) return;
        
        element.value = element.preLabel;
        
        var changed = false;
        baseId = element.id.slice(0, -5);
        
        if (!$(baseId))return;//fix
        if ($(baseId).value !== element.preValue)
            changed = true;
        
        $(baseId).value = element.preValue;
        
        if($(element.id).style.borderColor=="#ff1100"&&$(baseId).value!=""){//add by zhangyangshuo
        	element.style.borderColor = element.bakborderColor||'';
            element.style.borderWidth  = element.bakborderWidth||'' ;
             element.bakcheck=null;
        }
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
        box = new Cs.flower.LookupComboBox(element);
        box.locate(element.value, true);
    },
    
    locate: function(element){
        box = new Cs.flower.LookupComboBox(element);
        
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
    },
    
    filter:function(element, func){
        var elm = $(element);
        if (elm.lookupComboValue=="true")
            elm=$(elm.displayId)
            
        var box = new Cs.flower.LookupComboBox(elm);
        box.filter(func);
    }
    
}

Cs.flower.LookupComboBox = Class.create();

//值框 name   {BASE_ID}
//显示框 name+$dspl
//列表框 name+$lst
//表格框 name+$box
//表格框表皮  name+$box+$p
//表格框表皮底  name+$box+$sha
Object.extend(Cs.flower.LookupComboBox.prototype , {
    
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
        //qc 00537 begin 统一版本合并
        /*
        if($(this.BASE_ID+"$dspl")==null){
        	$(this.BASE_ID+"$box$p").hide();//fix pop up window
        	return;
        }*/
        
        //不可编辑的下拉框，禁止弹出下拉列表 add by suiqian,2011-09-10
        if($(this.BASE_ID+"$dspl") && $(this.BASE_ID+"$dspl").disabled){
        	hide = true;
        }
        //qc 00537 end 统一版本合并
        //显示or隐藏
        if ($(this.BASE_ID + "$box$p")==null){
            this.draw();
            if (hide) this.hide();
        }
        else if (!hide){
        	//重新处理下拉框坐标位置
        	$(this.BASE_ID + "$box$p").style.top=this.TOP;
        	$(this.BASE_ID + "$box$p").style.left=this.LEFT;
        	$(this.BASE_ID + "$box$sha").style.top=this.TOP;
        	$(this.BASE_ID + "$box$sha").style.left=this.LEFT;
        	
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
            
        this.CLIENT_HEIGHT = parseInt(this.HEIGHT,10) - 6 - parseInt(this.SCROLL_WIDTH);
        this.CLIENT_HEIGHT += "px";
            
        if (parseInt(this.TOP)+parseInt(this.HEIGHT) > document.body.clientHeight){
            var t = parseInt(pos[1],10) - parseInt(this.HEIGHT,10);
            if (t>0)  this.TOP = t;
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
		
        if (parseInt(this.LEFT)+parseInt(this.WIDTH)>document.body.clientWidth){
			 this.LEFT = document.body.clientWidth - parseInt(this.WIDTH,10) - parseInt(this.SCROLL_WIDTH,10);
		}
		
        this.COL_COUNT = this.TITLE.length + 1;
        
        this.BASE_ID = element.id;
        this.BASE_ID = this.BASE_ID.slice(0, -5);
        
    },
    
    filter:function(func){
        
        if (!(func instanceof Function)) return;
        
        var rows = $(this.BASE_ID+"$box").rows;
        
        for(var i=0,len=rows.length; i<len; ++i){
            rows[i].style.display=func(rows[i], i)?"":"none";
        }
        
        Cs.flower.LookupCombo.show(this.BASE_ID, "none");
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
        var xmlList = new Cs.util.XML();
        
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
        ret[ret.length] = '<div class="LookupWrapper"  id="'+this.BASE_ID+'$box$p" onfocus="Cs.flower.LookupCombo.wrapperFocus(event)" onblur="Cs.flower.LookupCombo.wrapperBlur(event)"';
        ret[ret.length] = 'style="left:'+this.LEFT+';top:'+this.TOP+';height:'+this.HEIGHT+';width:'+this.WIDTH+';z-index:10">';
        ret[ret.length] = '<table height="'+this.HEIGHT+'"><thead onselectstart="return false">'+titleContent+'</thead>';
        ret[ret.length] = '<tfoot style="display:none;"><tr><td colSpan='+this.COL_COUNT+'>Created by tangzhi@Linkage</td></tr></tfoot>';
        ret[ret.length] = '<tbody><tr><td colSpan='+this.COL_COUNT+'><div style="height:'+this.CLIENT_HEIGHT+'" class="LookupContentWrapper"  onfocus="Cs.flower.LookupCombo.wrapperFocus(event)" onblur="Cs.flower.LookupCombo.wrapperBlur(event)"><table width="';
        ret[ret.length] = this.CLIENT_WIDTH+'" onclick="Cs.flower.LookupCombo.boxClick(event)" id="'+this.BASE_ID+'$box" onmouseover="Cs.flower.LookupCombo.onmouseover(event)" onmouseout="Cs.flower.LookupCombo.onmouseout(event)">'+lstContent.join("");
        ret[ret.length] = '</table></div></td></tr></tbody></table></div>';
        ret[ret.length] = '<iframe id="'+this.BASE_ID+'$box$sha" frameborder="0" style="background-color:#ffffff;position:absolute;left:'+this.LEFT+';top:'+this.TOP+';height:'+this.HEIGHT+';width:'+this.WIDTH+';z-index:6;border:0"></iframe>';
        var str = ret.join('');
                
        document.body.insertAdjacentHTML("beforeEnd",str);
    },
    
    show: function(){
        Cs.flower.LookupCombo.show(this.BASE_ID, "block");
    },
    
    hide: function(){
        Cs.flower.LookupCombo.show(this.BASE_ID, "none");
    },
    
    clearHover: function(){
        
        $A(document.getElementsByClassName("hover", $(this.BASE_ID+"$box"))).each(function(element){
                element.className = "";
            });
        
    },
    
    getSelected: function(){
        return $(this.BASE_ID+"$dspl").rowselected;
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
        if (selectRow != null&&selectRow.cells!=null){
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
        
        rows = $(this.BASE_ID+"$box").rows;
        count = rows.length;
        
        if (value.empty()){
        	
			id = this.BASE_ID + "$dspl";
            $(id).preValue = "";
            $(id).preLabel = "";
            $(id).rowselected = null;
            for(var i=0; i<count; i++){//显示
            	rows[i].style.display="block";
            }
			return null;
		}
        	//增加根据输入过滤隐藏列表信息 add by zhangyangshuo
		if(value.include("-----请选择-----")||value==""||$(this.BASE_ID + "$dspl").rowselected!=null||$(this.BASE_ID + "$dspl").writeTag==null){
			 for(var i=0; i<count; i++){
            	rows[i].style.display="block";
            }
		}else{
       	 	for(var i=0; i<count; i++){
       	 		var pf = false;
       	 		var arr = rows[i].cells;
       	 		if(arr&&arr.length>0){
       	 			var pl = arr.length;
            		for(var j=0; j<this.TITLE.length; j++){
            			if(j<pl){
							var tempV = arr[j].innerHTML;
            				if (tempV == value ||  (match && tempV.include(value)) ){	
                				pf = true;
                				break;
            				}
            			}
               	  }
               	if(pf){
               		rows[i].style.display="block";
               	}else{
               		rows[i].style.display="none";
               	}
               }
        	}
        }
        $(this.BASE_ID + "$dspl").writeTag="1";
        
        rows = $(this.BASE_ID+"$box").rows;
        count = rows.length;
        for(var i=0; i<count; i++){
            
            //if (rows[i].cells[this.getValueColIndex()].innerHTML.startsWith(value)//这段代码有问题，赋值不能用搜索 ，add by zhangyangshuo
            if (rows[i].cells[this.getValueColIndex()].innerHTML == value
              ||  (match && rows[i].cells[this.getLabelColIndex()].innerHTML.include(value)) ){
                
                row = rows[i];
                if (row.className && row.className=="lookupSelect") {}
                else row.className = "hover"
                
                Cs.flower.LookupCombo.record(row);
                
                return this.gotoRow(row);
            }
        }
    }
})

/**
    用于变更LookupCombo下拉列表的值
    propName 为属性名
    elementType 为类型， 4为枚举型，5 为读NormalPara 6 为读CommPara ,9为原始页面，直接传入列表
    elementParam :
                  参数elementType如果是4 elementParam 为要变更的ENUM_CODE
                  参数elementType如果是5 elementParam 为sql[|参数1=值1~参数2=值2......]
                  参数elementType如果是6 elementParam 参数如:CSM|6028|PARAM_NAME,PARAM_CODE
                  参数elementType如果是9 elementParam 参数如:PARAM_NAME:PARAM_CODE|张三:0|李四:1|王五:2 第一组值为列标识名
	extendParam :  'ENUM_FIELD_NAME|ENUM_FIELD_CODE|ENUM_FIELD_NAME,ENUM_FIELD_CODE' ,如果非4必须传
	              格式是：labelCode|valueCode|titles[|titles]       前三列必须给出,titles以逗号隔开每列
	initval 为初始化值，可以没有
	在原zhangyangshuo基础上增加funcCallBack回调方法
	
	例如：
	$Z('MACHINE_TYPE',4,'MACHINE_TYPE1');  
    $Z('MACHINE_TYPE',5,'td_s_enumerate0|ENUM_CODE=MACHINE_TYPE1','ENUM_FIELD_NAME|ENUM_FIELD_CODE|ENUM_FIELD_NAME,ENUM_FIELD_CODE','1');   
    $Z('MACHINE_TYPE',6,'CSM|6027|PARAM_NAME,PARAM_CODE','PARAM_NAME|PARAM_CODE|PARAM_NAME,PARAM_CODE');  
    $Z('MACHINE_TYPE',9,'PARAM_NAME:PARAM_CODE|张三:0|李四:1|王五:2','PARAM_NAME|PARAM_CODE|PARAM_NAME,PARAM_CODE'); 
    注册事件用propName ，注意不要在一次提交中调用对属性propName变更两次,如果一定要连续调用两次，将indexId传入不同的值；
    如：
     $Z('ENTERNET_MODE',6,'CSM|200|33|PARAM_NAME,PARA_CODE1','PARAM_NAME|PARA_CODE1|PARAM_NAME,PARA_CODE1','0');
     $Z('ENTERNET_MODE',6,'CSM|200|34|PARAM_NAME,PARA_CODE1','PARAM_NAME|PARA_CODE1|PARAM_NAME,PARA_CODE1','8','X');
    尽量要传这个参数：extendParam
    @author zhangyangshuo
    var paramV = 'com.linkage.core.view.personalserv.print.PrintHtmlModify|getFindTrade|rightCode='+$("_rightCode").value;
	$Z('COMM_FIND','F',paramV,'PARAM_NAME|PARAM_CODE|PARAM_NAME,PARAM_CODE');
	调用java类方法的例子，注意类必须是不能是抽象和接口 方法定义 public IDataset getFindTrade(PageData pd) throws Exception 
	pd中的变量需要通过参数方式传递，格式是以|隔开，第一个参数和第二个分别是类、方法名，第三个开始是参数变量（可以有多个），以=隔开
*/
function $Z(propName,elementType,elementParam,extendParam,initval,indexId,sync,func,defaultTag,funcCallBack){
	var propNamelst = propName+"$lst";
	var propNamedspl = propName+"$dspl";
	var registerName = propName;
	var propelement=$(propNamedspl);
	if(!$(propNamedspl)||$(propNamedspl)==null){
		propNamelst=$P(propName).valueId+"$lst";
		propNamedspl = $P(propName).valueId+"$dspl";
	}
	if(elementType=='4')extendParam = 'ENUM_FIELD_NAME|ENUM_FIELD_CODE|ENUM_FIELD_NAME,ENUM_FIELD_CODE';
	if(indexId) registerName = propName+indexId;
	Cs.Ajax.register(registerName, function(node){
		$(propNamelst).value = node.xml;
		var valueStr = "";
		if(extendParam&&extendParam!=null&&!extendParam.blank()){
		    var str = extendParam.split('|');
			$(propNamedspl).labelCode = str[0];
			$(propNamedspl).valueCode = str[1];
			valueStr = str[1];
			$(propNamedspl).titleCodes = str[2];
			if(str.length>3){//用于指定标题  add by zhangyangshuo 
			$(propNamedspl).titles= str[3];
			}
		}
    		if($(propName))Cs.flower.LookupCombo.update($(propName));
    		else Cs.flower.LookupCombo.update($P(propName));
		   //qc:97949 张洋说要求修改  begin
    		if(typeof initval == 'undefined' || initval==false )
    		{
    			//Cs.flower.LookupCombo.setValue($(propName), '');
    			$setV(propName);
    		}else if(typeof initval != 'undefined'&& initval!=false && initval!='-9'){
    			$setV(propName,initval);
    		}
    		else if(initval=="-9")
    		{
    			try
    			{	
    				//first load data 
    				//$setV(propName,'');
    				$setV(propName,$(propName + "$box").rows[0].cells[1].innerHTML);
    			}catch(e){}
    			initval = false;
    		}
    		//if(initval)Cs.flower.LookupCombo.setValue($(propName), initval);
    			
    		//if(initval)$setV(propName,initval);
		//qc:97949 张洋说要求修改  end
    		if(typeof func != 'undefined' && func instanceof Function){
	  			func();
			}
			
			if(defaultTag){//如果当前值为空，指定一个元素为列表值
			var lookvalue = Cs.flower.LookupCombo.getValue($(propNamedspl));
			
			
    		if(lookvalue.blank()&&node.firstChild&&valueStr!=""){
    			  var obj = Cs.util.Utility.node2JSON(node.firstChild);
    			  if(obj!=null&&obj[valueStr.toCamelize()]){
    			  	//Cs.flower.LookupCombo.setValue($(propName), obj[valueStr.toCamelize()]);
    			  	$setV(propName,obj[valueStr.toCamelize()]);
    			  }
    		}
    		
    		}
    		
    		if(typeof funcCallBack != 'undefined' && funcCallBack instanceof Function){
	  			funcCallBack();
			}
	});  
	
	if(sync!=false){
		sync = true;
	}
	// qc 1929 begin
	if($("pagecontext").loginProvinceId == "0017"){
	   elementParam = escape(encodeURIComponent(elementParam)); 
	}
	// qc 1929 end
 Cs.Ajax.swallowXml("common.product.ProductHelper", "changeSource", "propName="+propName+"&elementType="+elementType+"&elementParam="+elementParam+"&registerName="+registerName, "", sync);
}
/**
*向下拉列表末尾追加值。不添加重复的元素
*	
*	propName     : 下拉列表的ELMENT_CODE
*	elementParam : 指定下拉列表数据源中元素<data>的属性(如paramName,paraCode)与值，默认将*$dspl的labelCode、valueCode与之关联。
*	initval      : 下拉列表初始化选择值
*	maxItemNum   ： 维持当前列表最大条数
*	
*
*@author jiaxl@20120304
*/
function addItemAtEnd(propName,elementParam,extendParam,initval,maxItemNum)
{
	var propNamelst = propName+"$lst";
	var propNamedspl = propName+"$dspl";
	if(!$(propNamedspl)||$(propNamedspl)==null){
		propNamelst=$P(propName).valueId+"$lst";
		propNamedspl = $P(propName).valueId+"$dspl";
	}
	if(elementParam && elementParam != null && !elementParam.blank())
	{
		var sArr = elementParam.split('|');
		if(sArr.length > 0)
		{
			var sMode = sArr[0];
			if(sMode.split(':').length < 2) {
				alert("elementParam 第一个元素不合法!!!");
				return false;
			}
			var paramName = sMode.split(':')[0];//paramName
			var paramCode = sMode.split(':')[1];//paramCode
			
			//获取解析器
			var xmlDoc = Cs.util.XML();
			try
			{
				xmlDoc.async="false";
				xmlDoc.loadXML($(propNamelst).value);
				var rootNode = xmlDoc.documentElement;
				for(var i = 1; i < sArr.length; i++)
				{
					var sTemp = sArr[i].split(':');
					//维持下拉列表的条数
					var iMaxItem = 7;
					if(typeof maxItemNum == "number" && maxItemNum > 0) {
						iMaxItem = maxItemNum;
					}
					for(; rootNode.childNodes.length >= iMaxItem ;) {
						if(rootNode.childNodes.length > 1) {//默认删除第二条
							rootNode.removeChild(rootNode.childNodes[1]);
						}else if(iMaxItem == 1 ){//限制只显示一条
							if(rootNode.childNodes.length == 1) {
								rootNode.removeChild(rootNode.childNodes[0]);
							}else {
								break;
							}
						}
					}
					//排重-根据paraCode的值进行排重
					var bFound = false;
					for(var j = 0; j < rootNode.childNodes.length; j++) {
						var childNode = rootNode.childNodes[j];
						if(childNode.getAttribute(paramCode.toCamelize()) == sTemp[1]) {
							bFound = true;
							break;
						}
					}
					if(!bFound) {
						var newNode = xmlDoc.createElement("data");
						newNode.setAttribute(paramName.toCamelize(),sTemp[0]);
						newNode.setAttribute(paramCode.toCamelize(),sTemp[1]);	
						rootNode.appendChild(newNode);				
					}
				}
				
				//指定显示列与标题
				if(extendParam && extendParam != null && !extendParam.blank()){
				    var str = extendParam.split('|');
					$(propNamedspl).labelCode = str[0];
					$(propNamedspl).valueCode = str[1];
					$(propNamedspl).titleCodes = str[2];
					if(str.length>3){//用于指定标题  add by zhangyangshuo 
					$(propNamedspl).titles= str[3];
					}
				}				
				//赋值下拉列表数据源
				$(propNamelst).value = xmlDoc.xml;
				//刷新
	    		if($(propName)) {
		    		Cs.flower.LookupCombo.update($(propName));    		
	    		}else {
	    			Cs.flower.LookupCombo.update($P(propName));		
	    		}
	    		//默认选择的元素
				if(initval)
				{
					$setV(propName,initval);
				}
			}
			catch(e)
			{
				alert("解析XML出错" + e.message);
			}
			return true;			
		}
	}
	return false;
}

//QC:11115 Begin
function removeLookupComboItem(propName, removeValue, initval){
	if(!$(propName)){
		return ;
	}
	try{
		var xmlDoc = Cs.util.XML();
		xmlDoc.async="false";
		xmlDoc.loadXML($(propName+"$lst").value);
		var rootNode = xmlDoc.documentElement;
		var valueCode = $(propName+"$dspl").valueCode.toCamelize();
		for(var i=0; i<rootNode.childNodes.length; i++) {
			var tmpValue = rootNode.childNodes[i].getAttribute(valueCode);
			if(tmpValue!="" && tmpValue==removeValue) {
				rootNode.removeChild(rootNode.childNodes[i]);
			}
		}			
		$(propName+"$lst").value = xmlDoc.xml;
		if($(propName)) {
			Cs.flower.LookupCombo.update($(propName));    		
		}else {
			Cs.flower.LookupCombo.update($P(propName));		
		}
		if(initval){
			$setV(propName,initval);
		}else{
			$setV(propName,"");
		}
	}catch(e){
		alert("解析XML出错" + e.message);
	}
}
//QC:11115 End

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

/**
	用于获取LookupCombo下拉列表对应字段的值
	propName 为下拉列表， elementCode 为要去的列名
	
	$Z展示三列元素例子：
	 $Z('INFOA_AREA_CODE',5,'SEL_ALL_AREA_CODE_BY_EPARCHY_ID|EPARCHY_CODE='+$F("INFOA_EPARCHY_CODE"),'PARAM_NAME|PARA_CODE1|PARAM_NAME,PARA_CODE1,AREA_CODE|服务区:150,服务区编码:80,区域编码:80','','','',false);
	获取第三列的列值（此例子元素为INFOA_AREA_CODE，第三列为AREA_CODE）
	   $("INFOA_CITY_CODE").value =  $ZZ("INFOA_AREA_CODE",'AREA_CODE');	
	   @author zhangyangshuo 
**/
 function $ZZ(propName,elementCode){
    var propNamedspl = propName+"$dspl";
    if($(propNamedspl).rowselected){
 	var listInfo = $(propNamedspl).rowselected.cells;
	var titleCode = split2Json($(propNamedspl).titleCodes);
	var param = titleCode[elementCode];
	var value =   listInfo[param].innerText;		
	return value;
	}else{
		return "";
	}
 }
/**
通用的弹出式界面查询返回界面
参数 nodeName 查询方式场景名 ：
参数 func 返回值解析函数
参数title 弹出窗口标题
参数extendInfo 为传入参数 ，格式可以自己定，并按其格式解析
参数weight、height 弹出窗口 宽度、高度
参数button 界面展示元素的按钮类型， 1 表示显示单选返回， 2 表示复选返回、全部选择按钮，默认为1

例如：
$('USED_PORT_BUT').observe("click" ,function(){ $Y('QUERY_DDN',function(retInfo){
	if(typeof retInfo == 'undefined'){
		return;
	}
$('USER_PORT').value = retInfo.SERIAL_NUMBER;
},'已有端口','4932|6000001',null,null,'1');});


注意 场景 USER_PORT_BUT 要配置 查询按钮和它的js处理事件 ，通常调用通用查询js，查询返回信息列表
例如 var ext =$F("EXTEND_INFO").split('|');  // 这里$F("EXTEND_INFO") 为参数的参数 extendInfo = '4932|6000001'
    Cs.ctrl.Trade.commonQueryRedirectTo(ext[0],"frame1","1","","0","&SERIAL_NUMBER="+$P("QUERY_INFO").value+"&EXT_PROPS="+ext[1]);
    这里必须用frame1
    可在通用查询表 td_s_commonquery 配置查询sql，如参和返回值， 
    返回值第一个列 必须是  '选择,X_TAG,2'  或  '选择,X_TAG,4'  （2表示单选，4是复选），如果单选上面的参数button要输入1 或 null，如果是复选 button 要出入2,如果传3将隐藏页面结果区域和按钮
    lightMode 为1时页面用light方式刷新
    @author zhangyangshuo
*/

function $Y(nodeName,func, title,extendInfo,weight,height,button,colNum,lightMode){
   extendInfo = extendInfo||'';
   weight = weight||'600';
   height = height||'400';
   title = title||'查询界面';
   colNum = colNum||'3';
   button = button||'1';
   lightMode = lightMode||'0';
	var retInfo = popupDialog("popupdialog.QueryCommList","init",
		"&nodeName="+ nodeName+"&extendInfo="+extendInfo+"&button="+button+"&colNum="+colNum+"&lightMode="+lightMode,title,weight,height,"CSM");
	if(typeof func != 'undefined' && func instanceof Function){
	  func(retInfo);
	}
}

/**
取序列方法
seqName 为序列名
如果propName 存在  $(propName).value  = 序列值
如果 func存在，调用 func 处理序列值
例子 ：$S('seq_SPECIAL_LINE_NO','SPECIAL_LINE_NO');  //取序列
      $S('CSM|90|0','SERIAL_NUMBER'); //从通用参数表取
  如果 第一参数 包含 '|' 表示从通用参数表中取值， 否则从序列中取  
如果用通用参数表时配置注意：  入参格式为 ： CSM|90|0   或 CSM|90|0|0
第一种格式表示 ：SUBSYS_CODE|PARAM_ATTR|PARAM_CODE  
第二种格式表示 ：SUBSYS_CODE|PARAM_ATTR|PARAM_CODE|PARA_CODE1
配置参数时要注意 ，这条记录要事先维护 ，并且根据条件必须有且只有一条。
PARA_CODE2 用于保存序列 PARA_CODE3 用于保存前缀参数或规则 PARA_CODE4用于保存后缀参数和规则 PARA_CODE5为长度（如果设置长度， 不足位数补0）
前后缀规则： 可以用如下格式替换 参数 %001! （中间字符串为3位） ，如%001! 为 年月日 : 20090819 %002! 为 年月日时分秒 20090819080808
最终返回的序列为 ：[前缀]序列[后缀]     （如果设置长度， 不足位数补0）
如果一次请求对同一个序列查询两次，将indexId传入不同的值；

如果seqName以#开头，表式取通用参数序列 ：对应通用参数表的数据为： CSM|90|0|seqName.substring("1")
例如 ： $S('#DDN','serialNumber');  等价于  $S('CSM|90|0|DDN','serialNumber');
@author zhangyangshuo
*/
function $S(seqName,propName,func,indexId,num){
var registerName = seqName;
num=num||"1";
if (registerName.indexOf("|")>=0){
  registerName = (registerName.split("|")).join("_");
}else if(registerName.indexOf("#")==0){
  registerName = registerName.substring("1")+"_XXX";
  seqName = 'CSM|90|0|'+ seqName.substring("1");
}
	if(indexId) registerName = registerName+indexId;
 Cs.Ajax.register(registerName, function(node){
    var err = node.getAttribute('error');
    if(err != null){
     return ;
    }
    if(propName){
        if($(propName)){
      $(propName).value = node.getAttribute('seq');
      }else if($P(propName)){
      	$P(propName).value = node.getAttribute('seq');
      }
    }
    if(typeof func != 'undefined' && func instanceof Function){
	  func(node.getAttribute('seq'));
	}
 });
  Cs.Ajax.swallowXml("common.UtilityPage","getSequence", "seqName="+seqName+"&registerName="+registerName+"&num="+num, "");
}


 function $P(propName,tname,s){
        if(typeof propName != "string") return;
    	var o = document.getElementsByTagName("FORM")
    	if(typeof s == "string"){
    		o = $(s)?$(s).all:o //for speed. add by chengj
    	}
    	return $A(o).map(Form.getElements).flatten().find(function(element){
    		return (typeof(element.zbpropertyname)=="string" && element.zbpropertyname ==propName &&(!tname || tname.blank() || element.zbtablename == tname))
    	});
    }
  
  Object.extend(String.prototype, {
   chgDerscore :function(){
   var result = "";
    this.split("_").each(function(node){
    	result += node.capitalize();
    });
    return result.charAt(0).toLowerCase() + result.substring(1);
   }
  });
  
  /**
     用于读取已有用户属性批量拷贝，从号码serialNumber读取用户属性，如果号码存在从用户取，否则从台帐子表取，
     copyArr 为需要拷贝的数组，格式为 [属性1，属性2....]
     disArr 为需要置灰的属性数组
     registerStr 为注册事件
     其中属性的通用格式为 "SERIAL_NUMBER" 或 "SERIAL_NUMBER:serialNumber" 如果是下拉列表,需要将要拷贝的属性以$dspl结尾，
     注意属性不加:表示同名拷贝，加冒号表示将后面的属性拷贝到前面的属性，冒号后面的属性不要加$dspl
     例如 ： copyItemByNbr(retInfo.SERIAL_NUMBER,['SPEED_INPUT','SPEED_UNIT$dspl'],['SPEED_INPUT','SPEED_UNIT$dspl']);
     查询号码为retInfo.SERIAL_NUMBER,从用户属性取值（如果号码为在途，则从台帐子表取值）将页面元素SPEED_INPUT、 SPEED_UNIT$dspl 分别赋予对应的元素
     并将SPEED_INPUT、 SPEED_UNIT$dspl置灰
     @author zhangyangshuo
  */
  //qc:11274 begin 
  function copyItemByNbr(serialNumber,copyArr,disArr,registerStr,relationTypeCode,sync,netTypeCode,func){
  //qc:11274 end 
   registerStr = registerStr||"COPY_ITEM_CREATE_USER";
   relationTypeCode = relationTypeCode||'';
   netTypeCode = netTypeCode||'';
   Cs.Ajax.register(registerStr, function(node){
    var err = node.getAttribute('error');
    if(err != null){
      var win = new Cs.flower.Win();
      win.alert(err);
      return ;
    }
    if(copyArr&&copyArr.constructor == window.Array)copyArr.each(function(obj){
      var src,dist ;
      if(obj.indexOf(":")>=0){
      	src = obj.substring(0,obj.indexOf(":"));
      	dist = obj.substring(obj.indexOf(":")+1);
      }else{
        src = obj;
        dist = obj;
      }
      
	 if(dist.length>=5&&dist.slice(-5)=="$dspl"){
    	  dist = dist.substring(0,dist.length-5);
      }	    
      //正对山东，黑龙江特殊处理
      	if(src=="MOFFICE_ID$dspl"&&$(src)&&node.getAttribute(dist.chgDerscore())){
            //Cs.Ajax.register("retMofficeMsg",getMofficeName);
      		//Cs.Ajax.swallowXml("personalserv.createuser.CreateUser", "getMofficeNameById", "mofficeId="+node.getAttribute(dist.chgDerscore()));
      		$Z('MOFFICE_ID',9,'PARAM_NAME:PARAM_CODE|'+node.getAttribute("BUREAU_NAME".chgDerscore())+':'+node.getAttribute(dist.chgDerscore()),'PARAM_NAME|PARAM_CODE|PARAM_NAME,PARAM_CODE','','',false,null,true);
      	}
      	else 
         $setV(src, node.getAttribute(dist.chgDerscore())?node.getAttribute(dist.chgDerscore()):"");//2010-11-24 modify by zhangyangshuo 
         
    });
    if(disArr&&disArr.constructor == window.Array)disArr.each(function(obj){
     
      $ableV(obj,true);//2010-11-24 modify by zhangyangshuo 
    });
    //根据共线号码重新刷局向
    /*if(typeof getMofficeInfoByShareNum == "function") {getMofficeInfoByShareNum();}*/
     //qc:11274 begin
    if(typeof func != 'undefined' && func instanceof Function){
	  			func(node);
    }
	//qc:11274 end 
     });

	if(sync!=false){
		sync = true;
	}

   Cs.Ajax.swallowXml("personalserv.createuser.CreateUser", "getUserItemNbr", "serialNumber="+serialNumber+"&registerName="+registerStr+"&relationTypeCode="+relationTypeCode+"&netTypeCode="+netTypeCode, "", sync);
  
  }
  /**
   * 处理黑龙江山东不显示局向问题 add by fuqiang6
   */
   function getMofficeName(node){
    	var retInfo = Cs.util.Utility.node2JSON(node);
  		$Z('MOFFICE_ID',9,'PARAM_NAME:PARAM_CODE|'+retInfo.mofficeName+':'+retInfo.mofficeId,'PARAM_NAME|PARAM_CODE|PARAM_NAME,PARAM_CODE','','',false,null,true);	 
    }
  /**
     界面元素批量设置方法：置灰、赋值、置必输
     ableArr为一个数组，数组元素为页面元素 如果是下拉列表，以$dspl结尾
     abled  boolean 类型，类型 按abled的值控制数组ableArr中元素的disabled值
     requiredArr 赋值数组，数组元素统一赋值，如果是下拉列表，以$dspl结尾  数组中元素如果有分号:则将 分号后的值赋给分号前的值,否则将该元素值赋予空
     requiredArr 数组，数组元素为页面元素
     reqAbled boolean 类型 按reqAbled的值控制数组requiredArr中元素的required值，并刷新页面 
     displayArr 数组，控制元素显示隐藏 //2010-11-24 add by zhangyangshuo 
     disAbled   控制元素显示隐藏
     
     例子：
      chgabled(['ONLY_PAY_MODE$dspl','PORT_PAY$dspl','ONCEELSE_PAY_CUST'],false,['SPEED_INPUT','SPEED_UNIT$dspl:2'],['PORT_PAY'],true);
      将页面元素ONLY_PAY_MODE$dspl、PORT_PAY$dspl、ONCEELSE_PAY_CUST元素 统一置成disabled = false;
      将页面元素SPEED_INPUT的赋予'', SPEED_UNIT$dspl的值赋予'2'
      将页面元素PORT_PAY的required 赋予 'true'
      @author zhangyangshuo
  **/
  function chgabled(ableArr,abled,setArr,requiredArr,reqAbled,displayArr,disAbled){
  	if(ableArr&&ableArr.constructor == window.Array)ableArr.each(function(obj){
  	 /* if($(obj)){
      if($(obj).id.slice(-5)=="$dspl"){
       var prop = $(obj).id.substring(0,$(obj).id.length-5);
        Cs.flower.LookupCombo.disabled($(prop),abled);
      }else{
    	$(obj).disabled = abled;
      }
      }else{
      	if(obj.slice(-5)=="$dspl"){
       var prop = obj.substring(0,obj.length-5);
        Cs.flower.LookupCombo.disabled($P(prop),abled);
      }else{
    	$P(obj).disabled = abled;
      }
      }*/
      $ableV(obj,abled);//2010-11-24 modify by zhangyangshuo 
    });
    
    if(setArr&&setArr.constructor == window.Array)setArr.each(function(obj){
      var src,dist ;
      if(obj.indexOf(":")>=0){
      	src = obj.substring(0,obj.indexOf(":"));
      	dist = obj.substring(obj.indexOf(":")+1);
      }else{
        src = obj;
        dist = "";
      }
     /* if($(src)){
      	if($(src).id.slice(-5)=="$dspl"){
         	var prop = $(src).id.substring(0,$(src).id.length-5);
            Cs.flower.LookupCombo.setValue($(prop), dist);
      	}else{
     	  $(src).value = dist;
      	}
      }else{
      	if(src.slice(-5)=="$dspl"){
         	var prop = src.substring(0,src.length-5);
            Cs.flower.LookupCombo.setValue($P(prop), dist);
      	}else{
     	  $P(src).value = dist;
      	}
      }*/
      	$setV(src,dist);//2010-11-24 modify by zhangyangshuo 
    });
    if(requiredArr&&requiredArr.constructor == window.Array){
    requiredArr.each(function(obj){
      var val = "";
      /*if(reqAbled||reqAbled=="true"){
      	val = "true";
      }else{
      	val = "false"
      }
     
      /*if($(obj)){
      if($(obj).id.slice(-5)=="$dspl"){
       var prop = $(obj).id.substring(0,$(obj).id.length-5);
         $(prop).required = val;
      }else{
		$(obj).required = val;
      }
      }else{
      	  if(obj.slice(-5)=="$dspl"){
      		 var prop = obj.substring(0,obj.length-5);
        	 $P(prop).required = val;
      		}else{
			$P(obj).required = val;
     	 }
      }*/
      
      if(reqAbled&&reqAbled!="false"){
      	val = true;
      }else{
      	val = false;
      }
      
      $requiredV(obj,val,true);//2010-11-24 modify by zhangyangshuo 
    });
    Cs.ctrl.Validate.showMustFillTag();
    
    }
    
    if(displayArr&&displayArr.constructor == window.Array){
    	 displayArr.each(function(obj){
    	 	 $displayV(obj,disAbled);	
    	 });
    }
  }
  
  /**
  	获取TD_S_TAG
  	@author zhangyangshuo
  **/
   function getSysTagInfo( tagCode,  tagType,  def,tagInfo,func,registerName){
   
    Cs.Ajax.register(registerName, function(node){
  
    if(tagInfo){
      tagInfo = node.getAttribute('tagInfo');
    }
    if(typeof func != 'undefined' && func instanceof Function){
	  func(node.getAttribute('tagInfo'));
	}
 	});
   Cs.Ajax.swallowXml("common.UtilityPage","getSysTagInfo", "tagCode="+tagCode+"&registerName="+registerName+"&tagType="+tagType+"&def="+def, "");
   }
   
     //通用元素赋值方法 add by zhangyangshuo
   function $setV(src,value){
   	 if(typeof src == 'undefined') return ;
   	 if(typeof src != "string") return;
   	 var dist = value||'';
   	 var element = null;
   	 if($(src)){
   	 	element = $(src);
      	if(src.length>5&&src.slice(-5)=="$dspl"){
         	var prop = src.substring(0,src.length-5);
            if($(prop))Cs.flower.LookupCombo.setValue($(prop), dist);
        }else if (element.lookupComboValue && element.lookupComboValue=="true") {   
         	Cs.flower.LookupCombo.setValue(element, dist);
      	}else{
     	 	element.value = dist;
      	}
      }else{
      	if(src.length>5&&src.slice(-5)=="$dspl"){
         	var prop = src.substring(0,src.length-5);
         	element = $P(prop);
            if(element&&element.valueId&&$(element.valueId))Cs.flower.LookupCombo.setValue($(element.valueId), dist);
        }else{
        	element = $P(src);
        	if(element){
        	 	if (element.valueId&&$(element.valueId)&&$(element.valueId).lookupComboValue && $(element.valueId).lookupComboValue=="true") {   
         			Cs.flower.LookupCombo.setValue($(element.valueId), dist);
      			}else{
     	  			element.value = dist;
      			}
      		}
      	}
      }
   }
  
   //通用取元素值方法 add by zhangyangshuo
   function $getV(src,flag){
   	
   	 var retInfo = null;
   	 var element = null;
   	 if(typeof src == 'undefined') {retInfo = null;}
   	 if(typeof src == "string"){
   	 if($(src)){
   	 	if(src.length>5&&src.slice(-5)=="$dspl"){
   	 		var prop = src.substring(0,src.length-5);
   	 		retInfo =  $("prop")?$F(prop):null;
   	 	}else{
   	  		retInfo = $F(src);
   	  	}
   	 }else {
   	  	if(src.length>5&&src.slice(-5)=="$dspl"){
   	 		var prop = src.substring(0,src.length-5);
   	 		element = $P(prop);
   	 		retInfo =  (element&&element.valueId&&$(element.valueId))?$F(element.valueId):null;
   	 	}else{
   	 		element = $P(src);
   	 		if(element){
   	 		 	if (element&&element.valueId&&$(element.valueId)&&$(element.valueId).lookupComboValue && $(element.valueId).lookupComboValue=="true"){
   	 				retInfo =  $F(element.valueId);
   	 			}else{
   	 				retInfo = element.value;
   	 			}
   	 		}
   	 	}
   	 }
   	 }
   	  if(flag&&retInfo == null){
   	  	retInfo ="";
   	  }
   	  return retInfo;
   }
   
   function trim(str) {
	if(typeof str =='string'){
		return str.trim();
	}else{
		return str;
	}
  }
   
   //判断是否为空  add by zhangyangshuo
   function $isBlank(src,flag){
   		if(flag) return (src == 'undefined')||(src == null)||(src=="")
   		return (src == 'undefined')||(src == null)||(trim(src) == "");
   }
   
   //判断是否为非空  add by zhangyangshuo
   function $notBlank(src,flag){
   		if(flag) return (src != 'undefined')&&(src != null)&&(src!="");
   		return (src != 'undefined')&&(src != null)&&(trim(src) != "");
   }
   //判断是两个值是否相等  add by zhangyangshuo
   function $isEqual(value1,value2){
   		if($isBlank(value1)&&$isBlank(value2))return true;
   		if($isBlank(value1)||$isBlank(value2))return false;
   		return  value1==value2;
   }
   //判断是两个值是否不等  add by zhangyangshuo
   function $notEqual(value1,value2){
   		if($isBlank(value1)&&$isBlank(value2))return false;
   		if($isBlank(value1)||$isBlank(value2))return true;
   		return  value1!=value2;
   }
   //通用设置元素disable属性 add by zhangyangshuo
   function $ableV(src,val){
    if(typeof src == 'undefined') return ;
    if(typeof src != "string") return ;
   	 var element = null;
   	 var abled = null;
   	 if(val&&val!="false")abled = true;
   	 else abled = false;

   	 if($(src)){
      	if(src.length>5&&src.slice(-5)=="$dspl"){
         	var prop = src.substring(0,src.length-5);
            if($(prop))Cs.flower.LookupCombo.disabled($(prop),abled);
        }else if ($(src).lookupComboValue && $(src).lookupComboValue=="true") {   
         	Cs.flower.LookupCombo.disabled($(src),abled);
      	}else{
     	 	$(src).disabled = abled;
      	}
      }else{
      	if(src.length>5&&src.slice(-5)=="$dspl"){
         	var prop = src.substring(0,src.length-5);
         	element = $P(prop);
            if(element&&element.valueId&&$(element.valueId))Cs.flower.LookupCombo.disabled($(element.valueId),abled);
        }else{
        	element = $P(src);
       	    if(element){
         		if (element.valueId&&$(element.valueId)&&$(element.valueId).lookupComboValue && $(element.valueId).lookupComboValue=="true") {   
         			Cs.flower.LookupCombo.disabled($(element.valueId), abled);
      			}else{
     	  			element.disabled = abled;
      			}
      		}
      	}
      }
   }
   //通用设置元素required属性 add by zhangyangshuo
   //如果flag 为true 不实现required效果，适用于批量统一显示。
   function $requiredV(src,reqV,flag){
   	if(typeof src != "string") return ;
    var val = reqV;
    if(reqV&&reqV!="false")val = "true";
    else{ val = "false";}
    var element = null;
   	if($(src)){
      if(src.length>5&&src.slice(-5)=="$dspl"){
       var prop = src.substring(0,src.length-5);
         if($(prop))$(prop+"$dspl").required = val;
      }else if ($(src).lookupComboValue && $(src).lookupComboValue=="true") { 
      	  $(src+"$dspl").required = val;		
      }else{
		  $(src).required = val;
      }
      }else{
      	  if(src.slice(-5)=="$dspl"){
      		 var prop = src.substring(0,src.length-5);
      		 element = $P(prop);
        	 if(element&&element.valueId&&$(element.valueId))element.required = val;	
        	}else {
        		element = $P(src);
       	    	if(element){
        			if (element.valueId&&$(element.valueId)&&$(element.valueId).lookupComboValue && $(element.valueId).lookupComboValue=="true") {   
      					element.required = val;		
      				}else{
			 			element.required = val;
			 		}
			   }
     	 }
      }

   	 if(!flag)Cs.ctrl.Validate.showMustFillTag();
   }
   //For Array
   function $displayV4Array(src,dis,visibility,tag){
		if(typeof src=="string"){
			$displayV(src,dis,visibility,tag);
		}else if(typeof src=="object"&&src.constructor == window.Array){
			src.flatten().each(function(obj){
		 		$displayV(obj,dis,visibility,tag);
		 	});
		}
   }
   //通用设置元素显示 add by zhangyangshuo
   //@param vis control style.visibility property
   //@param tag control element.required property
   function $displayV(src,dis,vis,tag){
   	 if(typeof src == 'undefined') return ;
   	 if(typeof src != "string") return ;
   	 var abled="";
   	 if(dis&&dis!="false"){abled = "";}else{abled = "none";}
   	 var visible ="";
   	 if(typeof vis != 'undefined'){if(vis){visible ="visible";}else{visible ="hidden";}};
   	 var element = null;
   	 var elebel = "";
   	 if($(src)){
      	if(src.length>5&&src.slice(-5)=="$dspl"){
         	var prop = src.substring(0,src.length-5);
         	element = $(prop+"$dspl");
            if(element){
            	if(!visible.blank()){element.style.visibility = visible}
         		else {element.style.display = abled;}
         		if($(prop+"$img"))$(prop+"$img").style.display = abled;
         		elebel = "ZLABEL_"+prop;
         		if(tag){if(!dis&&element.required==true){element.req = true;$requiredV(src,dis);}if(dis&&element.req==true){$requiredV(src,dis);}}
         	}
        }else if ($(src).lookupComboValue && $(src).lookupComboValue=="true") {   
        	element = $(src+"$dspl");
         	if(element){
         		if(!visible.blank()){element.style.visibility = visible}
         		else{element.style.display = abled;}
         		if($(src+"$img"))$(src+"$img").style.display = abled;
         		elebel = "ZLABEL_"+src;
         		if(tag){if(!dis&&element.required==true){element.req = true;$requiredV(src,dis);}if(dis&&element.req==true){$requiredV(src,dis);}}
         	}
      	}else{
      		element = $(src);
			if(!visible.blank()){element.style.visibility = visible}
			else{element.style.display = abled;}
     	 	elebel = "ZLABEL_"+src;
     	 	if(tag){if(!dis&&element.required==true){element.req = true;$requiredV(src,dis);}if(dis&&element.req==true){$requiredV(src,dis);}}
      	}
      	if($notBlank(elebel)){//设置标题属性
      		var elementLabel = $(elebel);
      		if(!visible.blank()){elementLabel.style.visibility = visible}
      		else if(elementLabel){ elementLabel.style.display = abled;}
      	}
      }else{
      	
      	if(src.length>5&&src.slice(-5)=="$dspl"){
         	var prop = src.substring(0,src.length-5);
         	element = $P(prop);
            if(element&&element.valueId&&$(element.valueId)){
				if(!visible.blank()){element.style.visibility = visible}
            	else{element.style.display = abled;}
            	if($(element.valueId+"$img"))$(element.valueId+"$img").style.display = abled;
            	elebel = "ZLABEL_"+prop;
           	}
        }else {
        	element = $P(src);
        	if(element){
       		 	if (element.valueId&&$(element.valueId)&&$(element.valueId).lookupComboValue && $(element.valueId).lookupComboValue=="true") { 
         			if($(element.valueId+"$img"))$(element.valueId+"$img").style.display = abled;
      			}
				if(!visible.blank()){element.style.visibility = visible}
     	  		else{element.style.display = abled;}
     	  		elebel = "ZLABEL_"+src;
     	  		
      		}
      	}
      	 if($notBlank(elebel))$A(document.getElementsByTagName("td")).flatten().find(function(elm){//设置标题属性
    		 if(typeof(elm.zbpropertyname)=="string"&&elm.zbpropertyname==elebel){
				if(!visible.blank()){element.style.visibility = visible}
    		 	else{elm.style.display = abled;}
    		 }
    	 });
      }
      
	 if(element){
		 if (element.lookupCombo == "true" && element.nextSibling && element.nextSibling.tagName.toLowerCase() == "img" 
			   && element.nextSibling.nextSibling && element.nextSibling.nextSibling.innerText && element.nextSibling.nextSibling.innerText.strip() == "*"){
				$(element.nextSibling.nextSibling).style.display = abled;
		 }
		 if (element.nextSibling && element.nextSibling.innerText && element.nextSibling.innerText.strip() == "*")
		 {
				$(element.nextSibling).style.display = abled;
		 }
	 }
 }

   
   
   //add by zhangyangshuo 元素设置
   //$setE("CHECK_MODE",'{disabled:false,value:"0"}');
   function $setE(src,dis){
   		var objItme  = dis.evalJSON();
   		for (var prop in objItme){
			if(prop=="value"||objItme[prop] !=""){
				if(prop=="disabled"){
					$ableV(src,objItme[prop]);
				}else if(prop=="value"){
					$setV(src,objItme[prop]);
				}else if(prop=="required"){
					$requiredV(src,objItme[prop]);
				}else if(prop=="display"){
					$displayV(src,objItme[prop]);
				}
			}
		}	
   }
   //add by zhangyangshuo 群组成对赋值
   $setG = function(){
   		var args = $A(arguments);
   		var src = null;
   		for(var i = 0;i<args.length;i++){
   			if(i%2==0){
   				src = args[i];
   				if(i==args.length-1){
   					if(typeof src=="string"){
   						$setV(src);
   					}else if(typeof src=="object"&&src.constructor == window.Array){
   						src.flatten().each(function(obj){
   					 		$setV(obj);
   					 	});
   					}
   				}
   			}else{
   				if(typeof src=="string"){
   					$setV(src,args[i]);
   				}else if(typeof src=="object"&&src.constructor == window.Array){
   					src.flatten().each(function(obj){
   					  $setV(obj,args[i]);
   					});
   				}
   			}  			
   		}
   }
   //add by zhangyangshuo
   $ableG = function(){
   		var args = $A(arguments);
   		var src = null;
   		for(var i = 0;i<args.length;i++){
   			if(i%2==0){
   				src = args[i];
   				if(i==args.length-1){
   					if(typeof src=="string"){
   						$ableV(src,false);
   					}else if(typeof src=="object"&&src.constructor == window.Array){
   						src.flatten().each(function(obj){
   					 		$ableV(obj,false);
   					 	});
   					}
   				}
   			}else{
   				if(typeof src=="string"){
   					$ableV(src,args[i]);
   				}else if(typeof src=="object"&&src.constructor == window.Array){
   					src.flatten().each(function(obj){
   					  $ableV(obj,args[i]);
   					});
   				}
   			}  			
   		}
   }
   //add by zhangyangshuo
   $requiredG = function(){
   		var args = $A(arguments);
   		var src = null;
   		for(var i = 0;i<args.length;i++){
   			if(i%2==0){
   				src = args[i];
   				if(i==args.length-1){
   					if(typeof src=="string"){
   						$requiredV(src,false);
   					}else if(typeof src=="object"&&src.constructor == window.Array){
   						src.flatten().each(function(obj){
   					 		$requiredV(obj,false);
   					 	});
   					}
   				}
   			}else{
   				if(typeof src=="string"){
   					$requiredV(src,args[i]);
   				}else if(typeof src=="object"&&src.constructor == window.Array){
   					src.flatten().each(function(obj){
   					  $requiredV(obj,args[i]);
   					});
   				}
   			}  			
   		}
   		Cs.ctrl.Validate.showMustFillTag();
   }
   //add by zhangyangshuo
   $displayG = function(){
   		var args = $A(arguments);
   		var src = null;
   		for(var i = 0;i<args.length;i++){
   			if(i%2==0){
   				src = args[i];
   				if(i==args.length-1){
   					if(typeof src=="string"){
   						$displayV(src,false);
   					}else if(typeof src=="object"&&src.constructor == window.Array){
   						src.flatten().each(function(obj){
   					 		$displayV(obj,false);
   					 	});
   					}
   				}
   			}else{
   				if(typeof src=="string"){
   					$displayV(src,args[i]);
   				}else if(typeof src=="object"&&src.constructor == window.Array){
   					src.flatten().each(function(obj){
   					  $displayV(obj,args[i]);
   					});
   				}
   			}  			
   		}
   }
    //判断是否存在某些元素  add by zhangyangshuo
    $existG = function(){
    	var args = $A(arguments);
   		var src = null;
   		for(var i = 0;i<args.length;i++){
   			src = args[i];
   			if(typeof src != 'string') return false;
   			if($(src)){}
   			else if($P(src)){}
   			else return false;
   		}
   		return true;
   }
   
       //判断是否不为空  add by zhangyangshuo
    $notBlankG = function(){
    	var args = $A(arguments);
   		var src = null;
   		for(var i = 0;i<args.length;i++){
   			src = args[i];
   			if(typeof src != 'string') return false;
   			if(!$notBlank(src)){
   				return false;
   			}
   		}
   		return true;
    }
    

    
    //去掉空格 add by zhangyangshuo
    String.prototype.trim=function(){
    	return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    String.prototype.ltrim=function(){
    	return this.replace(/(^\s*)/g,"");
    	}
    String.prototype.rtrim=function(){
    	return this.replace(/(\s*$)/g,"");
    }
    
     //onrealvaluechange 这个方法经常用错，提供一个通用写法，zys
    function $Zchange(element,func,flag){
    	if($(element+"$dspl")){
    		$(element+"$dspl").onrealvaluechange=function(){
    			if(typeof func != 'undefined' && func instanceof Function){
	  				func();
				}
    		}
    		if(flag&&typeof func != 'undefined' && func instanceof Function){
	  			func();
			}
    	}
    }
    //Qc:29676 Begin
    //Qc:31165 Begin
    $IsAllBlankEG = function(){
    	var args = $A(arguments);
   		var src = null;
   		for(var i = 0;i<args.length;i++){
   			src = args[i];
   			if(typeof src != 'string') return false;
   			if(!$getV(src,true).blank()){
   				return false;
   			}
   		}
   		return true;
    }

	$IsAllNotBlankEG = function(){
    	var args = $A(arguments);
   		var src = null;
   		for(var i = 0;i<args.length;i++){
   			src = args[i];
   			if(typeof src == 'undefined'||src==null) return false;
   			if(typeof src == 'string' ){
   				if($getV(src,true).blank()){
   					return false;
   				}
   			}
   		}
   		return true;
    }
    //Qc:31165 End
      //Qc:29676 End

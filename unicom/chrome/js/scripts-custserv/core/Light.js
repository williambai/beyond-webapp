/**************************************************************************
* Created by tangzhi@2008-12-31 20:00
* encoding GBK
* 根据参数表，动态生成界面,js版本.
**************************************************************************/
Cs.flower.Light = Class.create();

Object.extend(Cs.flower.Light.prototype , {
     
    utilPage:"common.UtilityPage",
    tabClass:"",
    trClass:function(){return ""},    
    cellClass:function(){return ""},
    //Modified By Zhu_ZhiMin On : 2011-07-27
    //labelStyle:"",
    //inputStyle:"",
    labelStyle:"label",
    inputStyle:"",
    zbtablename:"",
    //Qc:1696 Begin 合并版本
    showFlag:false,//true 仅显示元素
    
   
    
    initialize:function(parent, colCount,showFlag){
        this.parent=$(parent);
        this.colCount=colCount||3;//默认3列
        this.showFlag=showFlag||false;
    },
    //Qc:1696 End 合并版本
    
    
    //根据一个场景编码进行显示
    lighting:function(contextCode){
        this.contextCode = contextCode.split("|")[0];
        //modify by chengyj2 2011-10-11
        if(contextCode.split("|").length>1){
        	this.zbtablename = contextCode.split("|")[1];
        }else{
        	this.zbtablename = contextCode.split("|")[0];
        }
        //返回 intfElms 节点
        Cs.Ajax.swallowXml(this.utilPage, "getInterfaceElement", "contextCode="+contextCode);
    },
    
    //支持多个参数传若干个场景，依次取第一个有内容的场景进行显示
    lighting_first:function(){
        if (arguments.length==0) return;
        //modify by chengyj2 2011-10-11
        var str=$A(arguments).toString();
        var arr=str.split(",");
        this.contextCode = arr[arr.length-1].split("|")[0];
        
        if(arr[arr.length-1].split("|").length>1){
        	this.zbtablename = arr[arr.length-1].split("|")[1];
        }else{
        	this.zbtablename = arr[arr.length-1].split("|")[0];
        }
      //Qc:03649 Begin
        if($("QC_TAG_2649") && $("QC_TAG_2649").value == '0')
        	Cs.Ajax.swallowXml(this.utilPage, "getInterfaceElement_first", "contextCode="+$A(arguments).toString(),'',false);
      //Qc:04733 Begin
        else if($("QC_TAG_04733") && $("QC_TAG_04733").value == '0')
        	Cs.Ajax.swallowXml(this.utilPage, "getInterfaceElement_first", "contextCode="+$A(arguments).toString(),'',false);
      //Qc:04733 End       
        else
        	Cs.Ajax.swallowXml(this.utilPage, "getInterfaceElement_first", "contextCode="+$A(arguments).toString());
       //Qc:03649 End
    },
//    QC:096475 Begin
//    lighting_first_for_async 这个函数完全复制的lighting_first，但是当时那个版本里所有QC必须打QCTAG
//	   所以，这里改了下，实际上加个动态argu就可以了，今后如果还需要动态参数，就改这个函数就行了
    lighting_first_for_async:function(){
        if (arguments.length==0) return;
        var str = arguments[0];
        var arr=str.split(",");
        this.contextCode = arr[arr.length-1].split("|")[0];
        if(arr[arr.length-1].split("|").length>1){
        	this.zbtablename = arr[arr.length-1].split("|")[1];
        }else{
        	this.zbtablename = arr[arr.length-1].split("|")[0];
        }
        if(arguments[1] == false)
        	Cs.Ajax.swallowXml(this.utilPage, "getInterfaceElement_first", "contextCode="+arguments[0],'',false);
        else
        	Cs.Ajax.swallowXml(this.utilPage, "getInterfaceElement_first", "contextCode="+arguments[0]);
    },
//   QC:096475 End    
    //cacheKey为缓存关键字,可以不输，不输就是contextCode
    lighting_cache:function(contextCode, cacheKey){
        this.contextCode = contextCode;
        var key = cacheKey||contextCode;
        //返回 intfElms 节点
        Cs.Ajax.swallowXmlCache(key, this.utilPage, "getInterfaceElement", "contextCode="+contextCode);
    },
    
    _drawBody:function(nodes, func){
        var a = [];
        //Qc:1696 Begin 合并版本
        if(!this.showFlag){
        //Qc：1696 End 合并版本
        //Modified By Zhu_ZhiMin On : 2011-07-27
        //if (this.tabClass.blank())  a.push("<table>");
        if (this.tabClass.blank())  a.push("<div class='c_content' id='scene' >  <table cellpadding='0' cellspacing='0' class='threeCol'> ");
        else a.push("<table class='"+this.tabClass+"'>");
        
        var trIdx=0;
        if (nodes.length>0){
            a.push("<tr");
            if (!this.trClass(trIdx).blank()){
                a.push(" class='");
                a.push(this.trClass(trIdx));
                a.push("'>")
            }else
                a.push(">");
            
            ++trIdx;
        }

        var r=nodes.length;
        for(var j=0;j<nodes.length;++j){
        	var elm = Cs.util.Utility.node2JSON(nodes[j]);
        	if(elm.showOrder=="99999999"|| elm.regExpr.include("#hideLabel"))
        		r--;
        }
        
        var cls;
        var ii = 0;
        var ishow = 0;
        for(var i=0;i<nodes.length;++i){
            
            var obj = Cs.util.Utility.node2JSON(nodes[i]);
            if(obj.regExpr.include("#changeLine")){//add  by zys@2009-11-2 
        	    a.push("</tr><tr>");
        	    ii=0;
             }   
             if(obj.regExpr.include("#tabname")){//标题   
                var col= this.colCount*2;
                  a.push("</tr>");
                   var tabname = obj.regExpr.substring(obj.regExpr.indexOf("#tabname=")+"#tabname=".length,obj.regExpr.indexOf(";",obj.regExpr.indexOf("#tabname=")+"#tabname=".length));
                  a.push("<tr><td class='e_title' colspan='"+col+"' ");
                  
                   
             		 
                  a.push(" >"+tabname);
                  
                  if(obj.regExpr.include("#tabbegin")&&obj.regExpr.include("#tabid"))
              		{
                 		tabid = obj.regExpr.substring(obj.regExpr.indexOf("#tabid=")+"#tabid=".length,obj.regExpr.indexOf(";",obj.regExpr.indexOf("#tabid=")+"#tabid=".length));
                 	 	if(obj.regExpr.include("#tabexpand")){//折叠
                 	 	a.push("<image id='"+tabid+"img' src ='/images-custserv/win/close.gif' class='expand' onclick='toggleLightInfo(\""+tabid+"\",this)' style='cursor:hand'  >");
                 	 	}else{
                 	 	a.push("<image id='"+tabid+"img' src ='/images-custserv/win/open.gif' class='unexpand' onclick='toggleLightInfo(\""+tabid+"\",this)' style='cursor:hand'  >");
                 	 	}
             		 }
                  a.push("</td></tr>");
                  a.push("<tr>");
                  ii=0;
                
			}
            //增加分栏和标题 zys   
        	 if(obj.regExpr.include("#tabbegin"))
			{
			 a.push("</tr></table>");
			 var tabstyle = "border:2px solid #000";
			 if(obj.regExpr.include("#tabstyle="))
			 {
			 	 tabstyle = obj.regExpr.substring(obj.regExpr.indexOf("#tabstyle=")+"#tabstyle=".length,obj.regExpr.indexOf(";",obj.regExpr.indexOf("#tabstyle=")+"#tabstyle=".length));	 
			 }
			 if (this.tabClass.blank())  a.push(" <table cellpadding='0' cellspacing='0' class='threeCol' style='"+tabstyle);
              else a.push("<table class='"+this.tabClass+"' style='"+tabstyle);
              
              if(obj.regExpr.include("#tabexpand"))
              {//折叠
              	a.push(";display:none;' ");
              }else{
              	a.push(";display:block;' ");
              }
              if(obj.regExpr.include("#tabid"))
              {
                 tabid = obj.regExpr.substring(obj.regExpr.indexOf("#tabid=")+"#tabid=".length,obj.regExpr.indexOf(";",obj.regExpr.indexOf("#tabid=")+"#tabid=".length));
                 a.push(" id='"+tabid+"' ");
              }
              a.push(" > ");
			 a.push("<tr>");
			 ii=0;
			}  
			
			

            if (ii%this.colCount==0&&ii!=0){
                /*表格样式class="threeCol"，当每行显示六列时，输入框长度才合适。
		        *当只有一个属性时（两列），增加四列，补齐六列；
		        *当只有两个属性时（四列），增加两列，补齐六列。
		        *add by suiqian begin 2011-09-02
		        */
		        if(r==1){
		           	a.push("<td");
		           	if (!this.labelStyle.blank()){
		           		a.push(" class='");a.push(this.labelStyle);a.push("'");
		       		}
		       		a.push("></td>");
		       		a.push("<td");
		       		if (!this.inputStyle.blank()){
		           		a.push(" style='");a.push(this.inputStyle);a.push("'");
		       		}
		       		a.push("></td>");
		       		
		       		a.push("<td");
		           	if (!this.labelStyle.blank()){
		           		a.push(" class='");a.push(this.labelStyle);a.push("'");
		       		}
		       		a.push("></td>");
		       		a.push("<td");
		       		if (!this.inputStyle.blank()){
		           		a.push(" style='");a.push(this.inputStyle);a.push("'");
		       		}
		       		a.push("></td>");
		        }
		        if(r==2){
		        	a.push("<td");
		        	if (!this.labelStyle.blank()){
		        		a.push(" class='");a.push(this.labelStyle);a.push("'");
		    		}
		    		a.push("></td>");
		    		a.push("<td");
		    		if (!this.inputStyle.blank()){
		        		a.push(" style='");a.push(this.inputStyle);a.push("'");
		    		}
		    		a.push("></td>");
		        }
		        /*add by suiqian end*/
		        cls=this.trClass(trIdx);
		        
		       
		        
                if (cls.blank())
                    a.push("</tr><tr>");
                else{
                    a.push("</tr><tr class='");a.push(cls);a.push("'>");
                }
                
                
                ++trIdx;
            }
            else if(i==nodes.length-1&&i!=this.colCount-1){
            	/*表格样式class="threeCol"，当每行显示六列时，输入框长度才合适。
		        *当只有一个属性时（两列），增加四列，补齐六列；
		        *当只有两个属性时（四列），增加两列，补齐六列。
		        *add by suiqian begin 2011-09-02
		        */
		        if(r==1){
		           	a.push("<td");
		           	if (!this.labelStyle.blank()){
		           		a.push(" class='");a.push(this.labelStyle);a.push("'");
		       		}
		       		a.push("></td>");
		       		a.push("<td");
		       		if (!this.inputStyle.blank()){
		           		a.push(" style='");a.push(this.inputStyle);a.push("'");
		       		}
		       		a.push("></td>");
		       		
		       		a.push("<td");
		           	if (!this.labelStyle.blank()){
		           		a.push(" class='");a.push(this.labelStyle);a.push("'");
		       		}
		       		a.push("></td>");
		       		a.push("<td");
		       		if (!this.inputStyle.blank()){
		           		a.push(" style='");a.push(this.inputStyle);a.push("'");
		       		}
		       		a.push("></td>");
		        }
		        if(r==2){
		        	a.push("<td");
		        	if (!this.labelStyle.blank()){
		        		a.push(" class='");a.push(this.labelStyle);a.push("'");
		    		}
		    		a.push("></td>");
		    		a.push("<td");
		    		if (!this.inputStyle.blank()){
		        		a.push(" style='");a.push(this.inputStyle);a.push("'");
		    		}
		    		a.push("></td>");
		        }
		        /*add by suiqian end*/
		       /* cls=this.trClass(trIdx);
		        if (cls.blank())
                    a.push("</tr><tr>");
                else{
                    a.push("</tr><tr class='");a.push(cls);a.push("'>");
                }*/
                ++trIdx;
            }
            
            if (func&&func instanceof Function)
                a.push(func(nodes[i]))
           
            ii ++;
            if(obj.showOrder!="99999999"&& !obj.regExpr.include("#hideLabel"))
        		ishow++;
           //分栏结束
         	 if(obj.regExpr.include("#tabend"))
			{
			 	 a.push("</tr></table>");
			 	 if (this.tabClass.blank())  a.push(" <table cellpadding='0' cellspacing='0' class='threeCol'> ");
        	 	else a.push("<table class='"+this.tabClass+"'>");
              	a.push("<tr>");
              	ii=0;
              	r-=ishow;//遇到tabend重新计算r
              	ishow=0;
			} 
           
        }
        
       
        /*
        var j =this.colCount - nodes.length % this.colCount;
        for (var i=0;i<j;++i){
            a.push('<td>&nbsp;</td><td>&nbsp;</td>');
        }
        */
        if (nodes.length>0) a.push("</tr>");
        a.push("</table> </div>");
        //Qc:1696 Begin 合并版本
        }else{
        	 for(var i=0;i<nodes.length;++i){
           		 if (func&&func instanceof Function){
                	a.push(func(nodes[i]))
                }
        	}
        }
        //Qc:1696 End 合并版本
        this.parent.innerHTML = a.join("");
    },
    
    //
    _drawContext:function(obj,func){
       var a=[];
        
        a.push("<td");a.push(" id='ZLABEL_");a.push(obj.elementCode);a.push("' ");
        if (!this.labelStyle.blank()){
            //Modified By Zhu_ZhiMin On : 2011-07-27
            //a.push(" style='");a.push(this.labelStyle);a.push("'");
            a.push(" class='");a.push(this.labelStyle);a.push("'");
        }
        if (obj.showOrder=="99999999"|| obj.regExpr.include("#hideLabel"))//modify by zys@2009-11-2 
            a.push(" style='display:none'");
        a.push(">");a.push(obj.intfElementLabel);a.push("</td>");
        
        a.push("<td");
        if (!this.inputStyle.blank()){
            //Modified By Zhu_ZhiMin On : 2011-07-27
            a.push(" style='");a.push(this.inputStyle);a.push("'");
            //a.push(" class='");a.push(this.inputStyle);a.push("'");
        }
        
        if (obj.regExpr.include("colspan=")){  //added by tz@2009-10-18 18:59
            a.push(" colSpan='");a.push(parseInt(obj.regExpr.split("colspan=")[1], 10));a.push("'");
        }
        if (obj.showOrder=="99999999")
            a.push(" style='display:none'");
        a.push(">");a.push(func(obj));a.push("</td>");
        
        
        return a.join("");
    },
    
    _showLookupTree:function(elm){
        if($(elm.valueId).itemCode.blank()) return;
    
        var result = popupDialog("common.lookuptree.TreeList","init","&ITEM_CODE="+$(elm.valueId).itemCode,"选择列表","350","370","CSM");
        if(result && typeof(result)!='undefined')
        {
            elm.value=result.text;
            $(elm.valueId).value=result.value;
        }
    },
    
    //树
    _drawTree:function(obj){
        return this._drawContext(obj, (function(item){
            var r=[];
            
            var initValue=item.intfElementInitValue.split("|")[0];
            var initDisplay=item.intfElementInitValue.split("|")[1];
            
            r.push("<input ");r.push("type=hidden");r.push(" name='");r.push(item.elementCode);
            r.push("' elementtype='");r.push(item.elementType);r.push("' zbtablename='");
            r.push(this.zbtablename);r.push("' zbpropertyname='");r.push(item.elementCode);
            r.push("' id='");r.push(item.elementCode);r.push("' displayId='");r.push(item.elementCode);
            r.push("$dspl' itemCode='");r.push(item.intfElementParam);r.push("' treeType='0' value='");
            r.push(initValue);r.push("'/>");
            r.push("<input ");r.push("id='");r.push(item.elementCode);r.push("$dspl' value=''");
            r.push(" valueId='");r.push(item.elementCode);
            r.push("' lookupTree='true' value='");r.push(initDisplay);r.push("'");
            if (item.modifyRightCode=="false")r.push(" disabled ");
            r.push("/><img id='");r.push(item.elementCode);r.push("$img' src='/images-custserv/win/treesearch.gif' class='LookupSearchIco' onclick='Cs.flower.Light.prototype._showLookupTree(");
            r.push(item.elementCode);r.push("$dspl);setTimeout(function(){$(\"");r.push(item.elementCode);r.push("$dspl\").focus()},100)'");
            if (item.modifyRightCode=="false")r.push(" disabled style='dispaly:none'");
            r.push("/>");
            return r.join("");
        }).bind(this));
    },
    
    //日期
    _drawDate:function(obj){
        return this._drawContext(obj, (function(item){
        	var formatStr = "yyyy-MM-dd";
            if(item.intfElementTypeCode=="3")
                formatStr = "yyyy-MM-dd HH:mm:ss";
            else
                formatStr = "yyyy-MM-dd";
                
            var r=[]
            r.push("<div class='inputbox'>");//把日期图片放在文本框里面 add by suiqian,2011-09-10
            r.push("<input ");r.push("name='");r.push(item.elementCode);
            r.push("' elementtype='");r.push(item.elementType);
            r.push("' zbtablename='");r.push(this.zbtablename);r.push("' zbpropertyname='");r.push(item.elementCode);
            r.push("' format='");
            if (item.intfElementTypeCode=="3")
                r.push("yyyy-MM-dd HH:mm:ss'");
            else
                r.push("yyyy-MM-dd'");
            r.push(" id='");r.push(item.elementCode);
            r.push("' desc='");r.push(item.intfElementLabel);
            if (item.intfElementCanNull=="0")
                r.push("' required='true");
            r.push("' checkdata='date' value='");
            if(item.intfElementInitValue)
                r.push(item.intfElementInitValue);
            r.push("' ");
            r.push(" class='txt' ");
            if (item.modifyRightCode=="false")r.push(" disabled ");
            r.push("/>");
            
            //把日期图片放在文本框里面 add by suiqian,2011-09-10 begin
            r.push("<span class='date' id='");r.push("IMG_CAL_");r.push(item.elementCode);
            r.push("' onmousemove=\"this.className='datemove'\" onmouseout=\"this.className='date'\" ");
            if(item.modifyRightCode=="false")r.push(" disabled style='dispaly:none'");
            r.push("></span>");
            r.push("</div>");	
            //把日期图片放在文本框里面 add by suiqian,2011-09-10 end
            
            return r.join("");
        }).bind(this));
    },
    
    //下拉框
    _drawCombo:function(obj){
        
        var todo={};
        todo.id=obj.elementCode;
        if (["1","4"].include(obj.intfElementTypeCode))
            todo.type="enum";
        else if (obj.intfElementTypeCode=="5")
            todo.type="normalPara";
        else if (obj.intfElementTypeCode=="6")
            todo.type="commPara";
        else throw new Error("不支持的参数类型!");
        todo.param=obj.intfElementParam;
        this.todos.push(todo);
        
        return this._drawContext(obj, (function(item){
            var r=[];
            r.push("<div class='inputbox'>");//把绿色箭头换成蓝色箭头，并放在文本框里面 add by suiqian,2011-09-10
            r.push("<input ");r.push("type=hidden");r.push(" name='");r.push(item.elementCode);
            r.push("' elementtype='");r.push(item.elementType);r.push("' zbtablename='");
            r.push(this.zbtablename);r.push("' zbpropertyname='");r.push(item.elementCode);
            r.push("' id='");r.push(item.elementCode);r.push("' displayId='");r.push(item.elementCode);
            r.push("$dspl'");r.push(" lookupComboValue='true'");r.push(" value='");
            r.push(item.intfElementInitValue);r.push("'/>");
            r.push("<input ");r.push("type=hidden");r.push(" id='");r.push(item.elementCode);
            r.push("$lst' value='' disabled />");
            r.push("<input ");r.push("id='");r.push(item.elementCode);r.push("$dspl' value=''");
            r.push(" valueId='");r.push(item.elementCode);
            if (item.intfElementCanNull=="0")
                r.push("' required='true");
            r.push("' lookupCombo='true' prompt=''")
            if (item.intfElementTypeCode=="1")
                r.push(" valueCode='ENUM_FIELD_CODE' labelCode='ENUM_FIELD_NAME' titles='优惠名称:150,优惠编码:80' titleCodes='ENUM_FIELD_NAME,ENUM_FIELD_CODE' ");
            else if (item.intfElementTypeCode=="4")
                r.push(" valueCode='ENUM_FIELD_CODE' labelCode='ENUM_FIELD_NAME' titles='名称:150,编码:80' titleCodes='ENUM_FIELD_NAME,ENUM_FIELD_CODE' ");
            else if (item.intfElementTypeCode=="5")
                r.push(" valueCode='PARACODE' labelCode='PARANAME' titles='名称:150,编码:80' titleCodes='PARANAME,PARACODE' ");
            else if (item.intfElementTypeCode=="6"){
                var params = item.intfElementParam.split("|");
                var valueCode = params[params.length-1].split(",")[1];
                var labelCode = params[params.length-1].split(",")[0];
                r.push(" valueCode='");r.push(valueCode);r.push("' labelCode='");
                r.push(labelCode);r.push("' titleCodes='");r.push(params[params.length-1]);
                r.push("' titles='名称:150,编码:80'");
            }else
                r.push(" valueCode='ENUM_FIELD_CODE' labelCode='ENUM_FIELD_NAME' titles='优惠名称:150,优惠编码:80' titleCodes='ENUM_FIELD_NAME,ENUM_FIELD_CODE' ");
            if (item.modifyRightCode=="false")r.push(" disabled ");
            r.push(" class='txt'/>");

            //把绿色箭头换成蓝色箭头，并放在文本框里面 add by suiqian,2011-09-10 begin
            r.push("<span class='select' id='");r.push(item.elementCode);r.push("$img' ");
            r.push("onmousemove=\"this.className='selectmove'\" onmousedown=\"this.className='selectdown'\" onmouseout=\"this.className='select'\" ");
            r.push(" onclick='new Cs.flower.LookupComboBox(");
            r.push(item.elementCode);r.push("$dspl);setTimeout(function(){$(\"");r.push(item.elementCode);r.push("$dspl\").focus()},100)'");
            if (item.modifyRightCode=="false"){r.push(" disabled='disabled' style='dispaly:none'");}
            r.push("></span>");
            if(item.regExpr.include("#hrefFunc")){//查询按钮 zys id后缀加上href
            r.push("<span HREF='javascript:void(0)' id="+item.elementCode+"href class='search2' ");
            var funcFuction = item.regExpr.substring(item.regExpr.indexOf("#hrefFunc=")+"#hrefFunc=".length,item.regExpr.indexOf(";",item.regExpr.indexOf("#hrefFunc=")+"#hrefFunc=".length));
            if(!funcFuction.blank())
            {
            	r.push(" onclick= '"+funcFuction+"' ");
            }
            if(item.regExpr.include("#hrefName")){
            	var funcName = item.regExpr.substring(item.regExpr.indexOf("#hrefName=")+"#hrefName=".length,item.regExpr.indexOf(";",item.regExpr.indexOf("#hrefName=")+"#hrefName=".length));
            	if(!funcName.blank())r.push(" onmouseover='showToolTip(\"\",\""+funcName+"\",event);' onmouseout='hideToolTip();' ");
            }
            r.push("></span>");
           
            }
            
            r.push("</div>");	
            //把绿色箭头换成蓝色箭头，并放在文本框里面 add by suiqian,2011-09-10 end
            
           	if($(item.elementCode+"$box$p")){//add by zhangyangshuo
           		$(item.elementCode+"$box$p").remove();
           	}
           	if($(item.elementCode+"$box$sha")){
           		$(item.elementCode+"$box$sha").remove();
           	}
            return r.join("");
        }).bind(this));
    },
    
    //输入框
    _drawText:function(obj){
        return this._drawContext(obj, (function(item){//增加非法字符校验，避免xml解析失败 add by zhangyangshuo
            var r=[];
            r.push("<div class='inputbox'><input");r.push(" id='");r.push(item.elementCode);r.push("' name='");r.push(item.elementCode);r.push("' elementtype='");
            r.push(item.elementType);r.push("' zbtablename='");r.push(this.zbtablename);
            r.push("' zbpropertyname='");r.push(item.elementCode);r.push("' value='");
            r.push(item.intfElementInitValue);r.push("' explain='");r.push(item.intfElementHint);
            if (item.intfElementCanNull=="0")
                r.push("' required='true'");
            else
                r.push("'");
                
            r.push(" checkdata='");
            var rege=item.regExpr;
            var expr=item.regExpr;
            if (item.regExpr.include("~$&")){
                var reg=item.regExpr.split("~$&");
                rege=reg[0];
                expr=reg[1];
            }
               
            r.push(rege);r.push("'");r.push(" expr='");r.push(expr);r.push("'");
            
            if (rege.include("style=")){  //added by tz@2009-10-18 19:09
                var s=rege.split(",").find(function(o){
                    return o.split("=")[0].strip()=="style";
                    });
                r.push(" style='");r.push(s.split("=")[1]);r.push("'");
            }
            
            if (item.modifyRightCode=="false"){
            	r.push(" disabled ");
            }
            if (item.intfElementTypeCode=="P")
                r.push(" type=password ");
            //r.push(" class='txt' ");
            //48563 begin 增加一个全角的判断限制
            r.push(" class='txt' onKeyUp='quanjiao(this)'");
            //48563 end 增加一个全角的判断限制
            r.push("/>");
              
            if(obj.regExpr.include("#hrefFunc")){//查询按钮 zys id后缀加上href
            r.push("<span HREF='javascript:void(0)' id="+obj.elementCode+"href class='search2' ");
             var funcFuction = obj.regExpr.substring(obj.regExpr.indexOf("#hrefFunc=")+"#hrefFunc=".length,obj.regExpr.indexOf(";",obj.regExpr.indexOf("#hrefFunc=")+"#hrefFunc=".length));
            if(!funcFuction.blank())
            {
            	r.push(" onclick= '"+funcFuction+"' ");
            }
            if(obj.regExpr.include("#hrefName")){
            	var funcName = obj.regExpr.substring(obj.regExpr.indexOf("#hrefName=")+"#hrefName=".length,obj.regExpr.indexOf(";",obj.regExpr.indexOf("#hrefName=")+"#hrefName=".length));
            	if(!funcName.blank())r.push(" onmouseover='showToolTip(\"\",\""+funcName+"\",event);' onmouseout='hideToolTip();' ");
            }
            r.push("></span>");
            }
            
             r.push("</div>")
            
            return r.join("");
        }).bind(this))
    },
    
    _drawAny:function(obj){

        return this._drawContext(obj, (function(item){
            if (item.modifyRightCode=="false") return "";//无权限不显示
            var find  = "id="+item.elementCode+"$";//格式为id=..$的变量用于替换场景元素信息
            if(item.regExpr && item.regExpr.include("#variable"))
            {
                find = "id=$elementCode"; 
            } 
            var r=[]; 
            
            if(item.regExpr.include("#hrefFunc")){
            	r.push("<div class='inputbox'>");
            }
            var itemTemp  = item.intfElementParam
            if(itemTemp.indexOf(find)>0){
            	itemTemp = itemTemp.substring(0,itemTemp.indexOf(find)) 
            	+" id='"+item.elementCode+"' elementtype='"+item.elementType+"' zbtablename='"+this.zbtablename+"' zbpropertyname='"+item.elementCode+"' "
            	+itemTemp.substring(itemTemp.indexOf(find)+find.length) ;
            	item.intfElementParam  = itemTemp;
            }
            var length=item.intfElementParam.indexOf('/>');			
			
			var anyparam = "";
			if(length>0&&item.intfElementParam.indexOf('<script>')==-1)
				anyparam=item.intfElementParam.substring(0,length)+ " zbtablename=\""+this.zbtablename+"\" />" ;
			else
            	anyparam=item.intfElementParam;
           
            r.push(anyparam);	
           if(item.regExpr.include("#hrefFunc")){//查询按钮 zys id后缀加上href
            r.push("<span HREF='javascript:void(0)' id="+item.elementCode+"href class='search2' ");
            var funcFuction = item.regExpr.substring(item.regExpr.indexOf("#hrefFunc=")+"#hrefFunc=".length,item.regExpr.indexOf(";",item.regExpr.indexOf("#hrefFunc=")+"#hrefFunc=".length));
            if(!funcFuction.blank())
            {
            	r.push(" onclick= '"+funcFuction+"' ");
            }
            if(item.regExpr.include("#hrefName")){
            	var funcName = item.regExpr.substring(item.regExpr.indexOf("#hrefName=")+"#hrefName=".length,item.regExpr.indexOf(";",item.regExpr.indexOf("#hrefName=")+"#hrefName=".length));
            	if(!funcName.blank())r.push(" onmouseover='showToolTip(\"\",\""+funcName+"\");' onmouseout='hideToolTip();' ");
            }
            r.push("></span></div>");
            } 	
            return r.join("");
        }).bind(this));		
    },
    
    //现身  
    draw:function(node){
        this.todos=[];
        
        this._drawBody(node.childNodes, (function(item){
            var elm = Cs.util.Utility.node2JSON(item);
            
            if (elm.intfElementTypeCode=="0") //普通输入框
                return this._drawText(elm);
            else if (elm.intfElementTypeCode=="1") //优惠下拉框
                return this._drawCombo(elm);
            else if (elm.intfElementTypeCode=="2") //日期输入框
                return this._drawDate(elm);
            else if (elm.intfElementTypeCode=="3") //时间输入框
                return this._drawDate(elm);
            else if (elm.intfElementTypeCode=="4") //普通下拉框-枚举表
                return this._drawCombo(elm);
            else if (elm.intfElementTypeCode=="5") //普通下拉框-NormalPara
                return this._drawCombo(elm);
            else if (elm.intfElementTypeCode=="6") //普通下拉框-CommPara
                return this._drawCombo(elm);
            else if (elm.intfElementTypeCode=="7") //树
                return this._drawTree(elm);
            else if (elm.intfElementTypeCode=="9") //自定义元素
                return this._drawAny(elm);
            else if (elm.intfElementTypeCode=="P") //密码输入框
                return this._drawText(elm);
	    }).bind(this));
	    
	    Cs.ctrl.Validate.showMustFillTag(this.parent);
	    
	    for(var i=0,l=node.childNodes.length;i<l;++i){
	        var item = Cs.util.Utility.node2JSON(node.childNodes[i]);
	        switch(item.intfElementTypeCode){
	            case "0":
	            case "P":
                    Cs.ctrl.Validate.addListener(item.elementCode);                    
                    break;	               
	            case "1":
	            case "4":
	            case "5":
	            case "6":
	                Cs.ctrl.Web.addLookupComboListener($(item.elementCode+"$dspl"));
	                break;
	            case "2":
	            case "3":
	                addCalendar(item.elementCode);
	                break;
	        }
	    }
	    
	    setTimeout((function() {this.parent.innerHTML.evalScripts()}).bind(this), 2);
	    
	    if (this.callback&&this.callback instanceof Function){
	        setTimeout(this.callback.bind(this),5);
	    }
	    Cs.ctrl.Validate.setDisBackGroud(this.parent);
    },
    
    setValue:function(obj,noCamelize){
        $A(this.parent.getElementsByTagName("INPUT")).each(function(el){
        	var eid;
        	if(el.id)
        	{
        		if(noCamelize)
        			eid = el.id;
        		else
        			eid = el.id.toCamelize();
        	}

            if (el.id&&obj[eid]!=null){                
                if (el.lookupComboValue=="true")
                    Cs.flower.LookupCombo.setValue(el, obj[eid]);
                else
                	el.value=obj[eid];
            }            
            if (typeof el.afterSetValue != 'undefined' && el.afterSetValue instanceof Function)
            {
            	try{
            		el.afterSetValue();
            	}catch(e){alert(e.message);}            
            }
        });
    },
    
    setValueNoCamelize:function(obj){
        $A(this.parent.getElementsByTagName("INPUT")).each(function(el){
            if (el.id&&obj[el.id]!=null){
                el.value=obj[el.id];
                if (el.lookupComboValue=="true")
                    Cs.flower.LookupCombo.setValue(el, el.value);
            }
        });
    },
    setDateValue:function(obj){
        $A(this.parent.getElementsByTagName("INPUT")).each(function(el){
           
            if (el.id&&obj[el.id]!=null){
                el.value=obj[el.id];
                if (el.lookupComboValue=="true")
                    Cs.flower.LookupCombo.setValue(el, el.value);
            }
        });
    },
    //elmType可输可不输入
    getValue:function(elmType,camelized){
        var result={};
        
        $A(this.parent.getElementsByTagName("INPUT")).each((function(element){
            
            if (element.zbtablename==this.zbtablename&&(!elmType||element.elementtype==elmType)){
                if (element.zbpropertyname&&!element.zbpropertyname.blank())
                    result[camelized?element.zbpropertyname.toCamelize():element.zbpropertyname]=$F(element);
                else if(element.id&&!element.id.blank())
                    result[camelized?element.id.toCamelize():element.id]=$F(element);
                else
                    result[camelized?element.name.toCamelize():element.name]=$F(element);
            }
        }).bind(this));
        
        return result;
    },
  
 /*
 *获取不为空(null)场景元素的值，proList为指定获取某些场景元素数组。elmType必填，camelized、proList选填
 *使用方法1、light.getValueNotNull("0");2、light.getValueNotNull("0",false,["USER_NAME","MOFFICE_ID"])
 *
 *author jiaxl@2012-03-014
 */
    getValueNotNull:function(elmType,camelized,proList) {
    	var result={};
        $A(this.parent.getElementsByTagName("INPUT")).each((function(element){
        	if (element.zbtablename==this.zbtablename&&(!elmType||element.elementtype==elmType)){
	        	//非空元素才返回
	        	if($F(element) && !$F(element).blank()) {
	        		var bFound = false;
			    	if(proList != null && proList instanceof Array) {
			    		for(var i = 0; i < proList.length; i++) {
			    			if (element.zbpropertyname&&!element.zbpropertyname.blank()&&element.zbpropertyname==proList[i]) {
			    				bFound = true;
			    				break;
			    			}
			    			if(element.id&&!element.id.blank()&&element.zbpropertyname==proList[i]) {
			    				bFound = true;
			    				break;
			    			}
			    			if(element.name&&element.name==proList[i]) {
			    				bFound = true;
			    				break;
			    			}	
			    		}
			    	}else {
			    		bFound = true;//指定获取的数组为空，默认获取场景中所有的元素的值
			    	}
			    	
	                if (element.zbpropertyname&&!element.zbpropertyname.blank()&&bFound)
	                    result[camelized?element.zbpropertyname.toCamelize():element.zbpropertyname]=$F(element);
	                else if(element.id&&!element.id.blank()&&bFound)
	                    result[camelized?element.id.toCamelize():element.id]=$F(element);
	                else if(bFound)
	                    result[camelized?element.name.toCamelize():element.name]=$F(element);
	        	}        		
        	}          
        }).bind(this));
        
        return result;    	 
    },   
    
    getElementById:function(id){
        return $A(this.parent.getElementsByTagName("INPUT")).find((function(element){
            return element.id==id;
        }).bind(this));
    },
    
    $:this.getElementById,
    
    getComboList:function(arr){
        
        if (!arr||!arr.length||arr.length==0) return;
        
        Cs.Ajax.swallowXml(this.utilPage, "getComboList", "params="+encodeURIComponent(Object.toJSON(arr)));
    },
    
    parseList:function(node){
        for(var i=0,l=node.childNodes.length; i<l; ++i){
            var item = node.childNodes[i];
            $(item.tagName+"$lst").value=item.xml;
            Cs.flower.LookupCombo.setValue($(item.tagName), $(item.tagName).value);
        }

		if (Cs.flower.Light.prototype.afterParse&&Cs.flower.Light.prototype.afterParse instanceof Function){
	        Cs.flower.Light.prototype.afterParse.bind(this)();
	    }
    },
    
     getAllInfo:function(obj,infoTagSet){
		Cs.Ajax.register("allinfo", function(node)
		{
			var infos = Cs.util.Utility.node2JSON(node.firstChild);
			obj.setValue(infos);
			try{
			   afterAllLightInfo(infos);//赋值后调用 add by zhangyangshuo
			}catch(e){}
		});
		var str ="Base="+encodeURIComponent($F("_tradeBase"));
		if(infoTagSet&&infoTagSet!=null&&infoTagSet!=""){
			str+="&infoTagSet="+infoTagSet;
		}
		
		Cs.Ajax.swallowXml("personalserv.modifyusertrade.ModifyAnyInfos", "getAnyInfo", str);
	 }
})

Cs.Ajax.register("comboLst", Cs.flower.Light.prototype.parseList);

//fix undefined
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
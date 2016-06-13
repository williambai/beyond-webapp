/**************************************************************************
 *   the file encoding:GBK
 *   Created by tangz@2008-12-14 12:39
 *   动态创建用于布局的table
**************************************************************************/

Cs.flower.LayoutHelper = Class.create();

Object.extend(Cs.flower.LayoutHelper.prototype , {
    
    colCount:1,
    parent:null,

    tabClass:"elementBox",
    trClass:function(){return "";},    
    cellClass:function(idx){
        return (idx%8==0||idx%8==2||idx%8==5||idx%8==7)?"cell":"";
    },
    
    initialize:function(parent, colCount){
        this.parent = $(parent);
        this.colCount = colCount;
    },
    
    draw:function(nodes, func){
        var str = new Array;
        
        if (this.tabClass.blank())
            str.push("<table>");
        else{
            str.push("<table class='"+this.tabClass+"'>");
        }
        
        var trIdx=0;
        var cellIdx=0;
        
        if (nodes.length>0){
            str.push("<tr class='"+this.trClass(trIdx)+"'>");
            ++trIdx;
        }
           
        var cls;
        for(var i=0;i<nodes.length;++i){
            if (i%this.colCount==0&&i!=0){
                cls=this.trClass(trIdx);
                if (cls.blank())
                    str.push("</tr><tr>");
                else{
                    str.push("</tr><tr class='");
                    str.push(cls);   
                    str.push("'>");
                }
                ++trIdx;
            }
            
            cls=this.cellClass(cellIdx);
            if (cls.blank())
                str.push("<td>");
            else{
                str.push("<td class='")
                str.push(cls);   
                str.push("'>");
            }
            
            if (func&&func instanceof Function)
                str.push(func(nodes[i],cellIdx));
            
            ++cellIdx;
            
            str.push("</td>");
        }
        
        if (nodes.length>0)
            str.push("</tr>");
            
        str.push("</table>");
        
        this.parent.innerHTML = str.join("");
    },

	 drawNew:function(nodes, func,func2,elmIndex){//针对开户展示产品使用 add by zhangyangshuo

        var str = new Array;

        

        if (this.tabClass.blank())

            str.push("<table>");

        else{

            str.push("<table class='"+this.tabClass+"'>");

        }

        

        var trIdx=0;

        var cellIdx=0;

        

        if (nodes.length>0){

            str.push("<tr class='"+this.trClass(trIdx)+"'>");

            ++trIdx;

        }

           

        var cls;

        for(var i=0;i<nodes.length;++i){
        
        	var retNode = func(nodes,nodes[i],cellIdx);
        	
        	if(!retNode.blank()){

            if (i%this.colCount==0&&i!=0){

                cls=this.trClass(trIdx);

                if (cls.blank())

                    str.push("</tr><tr>");

                else{

                    str.push("</tr><tr class='");

                    str.push(cls);   

                    str.push("'>");

                }

                ++trIdx;

            }

            

            cls=this.cellClass(cellIdx);

            if (cls.blank())
				
				if(elmIndex!=null){
                	str.push("<td id = 'TD"+elmIndex+"' >");
                }else{
                	str.push("<td>");
                }
                

            else{
				if(elmIndex!=null){
                	str.push("<td id = 'TD"+elmIndex+"' class='")
                }else{
                	str.push("<td class='")
                }

                str.push(cls);   

                str.push("'>");

            }

            

            if (func&&func instanceof Function)

                str.push(retNode);

            

            

            

            str.push("</td>");
            }
            
            ++cellIdx;

        }

        

        if (nodes.length>0){
			str.push("</tr>");
            var ret2 = func2();
            if(!ret2.blank()){
            str.push("<tr><td>")
             str.push(ret2);
          	str.push("</tr></td>")
          }
          }
        str.push("</table>");

        

        this.parent.innerHTML = str.join("");
        
        $$("td[id='TD"+elmIndex+"']").each(function(elm){//如果子元素隐藏，父节点隐藏 add by zhangyangshuo
        if(elm.firstChild!= 'undefined'&&elm.firstChild.style&&elm.firstChild.style.display=="none")
        {elm.hide();}
        });

    },
	 drawNewAddFieldset:function(titleName,nodes, func,func2,elmIndex){//针对样式实用 add by zhangxiaoping for add fieldset

        var str = new Array;
        str.push("<fieldset><legend>"+titleName+"</legend>")
        str.push("<div class='feldsetCont noPadding'>")

        if (this.tabClass.blank())

            str.push("<table border='0' cellspacing='0' cellpadding='0'>");

        else{

            str.push("<table border='0' cellspacing='0' cellpadding='0' class='"+this.tabClass+"'>");

        }

        

        var trIdx=0;

        var cellIdx=0;

        

        if (nodes.length>0){

            str.push("<tr class='"+this.trClass(trIdx)+"'>");

            ++trIdx;

        }

           

        var cls;

        for(var i=0;i<nodes.length;++i){
        
        	var retNode = func(nodes,nodes[i],cellIdx);
        	
        	if(!retNode.blank()){

            if (i%this.colCount==0&&i!=0){

                cls=this.trClass(trIdx);

                if (cls.blank())

                    str.push("</tr><tr>");

                else{

                    str.push("</tr><tr class='");

                    str.push(cls);   

                    str.push("'>");

                }

                ++trIdx;

            }

            

            cls=this.cellClass(cellIdx);

            if (cls.blank())
				
				if(elmIndex!=null){
                	str.push("<td id = 'TD"+elmIndex+"' >");
                }else{
                	str.push("<td>");
                }
                

            else{
				if(elmIndex!=null){
                	str.push("<td id = 'TD"+elmIndex+"' class='")
                }else{
                	str.push("<td class='")
                }

                str.push(cls);   

                str.push("'>");

            }

            

            if (func&&func instanceof Function)

                str.push(retNode);

            

            

            

            str.push("</td>");
            }
            
            ++cellIdx;

        }

        

        if (nodes.length>0){
			str.push("</tr>");
            var ret2 = func2();
            if(!ret2.blank()){
            str.push("<tr><td>")
             str.push(ret2);
          	str.push("</tr></td>")
          }
          }
        str.push("</table>");
        str.push("</div>")
        str.push("</fieldset>")

        

        this.parent.innerHTML = str.join("");
        
        $$("td[id='TD"+elmIndex+"']").each(function(elm){//如果子元素隐藏，父节点隐藏 add by zhangyangshuo
        if(elm.firstChild!= 'undefined'&&elm.firstChild.style&&elm.firstChild.style.display=="none")
        {elm.hide();}
        });
    },    
    
    

	drawMore:function(nodes,count,id, func){
		var str = new Array;
		//-----总是显示-------
        if (this.tabClass.blank())
            str.push("<table>");
        else{
            str.push("<table class='"+this.tabClass+"'>");
        }
        
        var trIdx=0;
        var cellIdx=0;
        
        if (nodes.length>0){
            str.push("<tr class='"+this.trClass(trIdx)+"'>");
            ++trIdx;
        }
        var cls,showNum;
		if(nodes.length > count){
			showNum = count;
		}
		else{
			showNum = nodes.length;
		} 
			
        for(var i=0;i<showNum;++i){
            if (i%this.colCount==0&&i!=0){
                cls=this.trClass(trIdx);
                if (cls.blank())
                    str.push("</tr><tr>");
                else{
                    str.push("</tr><tr class='");
                    str.push(cls);   
                    str.push("'>");
                }
                ++trIdx;
            }
            
            cls=this.cellClass(cellIdx);
            if (cls.blank())
                str.push("<td>");
            else{
                str.push("<td class='")
                str.push(cls);   
                str.push("'>");
            }
            
            if (func&&func instanceof Function)
                str.push(func(nodes[i],cellIdx));
            
            ++cellIdx;
            
            str.push("</td>");
        }
        
        if (nodes.length>0)
            str.push("</tr>");
            
        str.push("</table>");
		//-------点击显示部分---------------
		if(nodes.length > showNum){
			str.push("<div class='e_title' style='cursor:hand' ");
			str.push(" onclick=mytoggle()>");
			str.push("<a href='javascript:void(0)'>更多品牌</a></div>");//changed by zhangxiaoping  for link style change
			str.push("<table id="+id+" style='display:none' class='"+this.tabClass+"'>");
			var trIdx=0;
        	var cellIdx=0;
			str.push("<tr class='"+this.trClass(trIdx)+"'>");
			++trIdx;
			for(var i=showNum;i<nodes.length;++i){
	            if (i%this.colCount==0&&i!=showNum){
	                cls=this.trClass(trIdx);
	                if (cls.blank())
	                    str.push("</tr><tr>");
	                else{
	                    str.push("</tr><tr class='");
	                    str.push(cls);   
	                    str.push("'>");
	                }
	                ++trIdx;
	            }
	            
	            cls=this.cellClass(cellIdx);
	            if (cls.blank())
	                str.push("<td>");
	            else{
	                str.push("<td class='")
	                str.push(cls);   
	                str.push("'>");
	            }
	            
	            if (func&&func instanceof Function)
	                str.push(func(nodes[i],cellIdx));
	            
	            ++cellIdx;
	            
	            str.push("</td>");
	        }
			str.push("</tr>");
        	str.push("</table>");
        	str.push("<div class='hide'id='hideTage' style='display:none;' ");
        	str.push(" onclick=mytoggle()>");
        	str.push("<a>收起↑</a></div>");
        	
		}
        this.parent.innerHTML = str.join("");
	}
});

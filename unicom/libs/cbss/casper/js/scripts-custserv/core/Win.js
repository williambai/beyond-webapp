/**************************************************************************
* Created by tangzhi@2007-9-27 14:52
* 提示窗口 + 锁定器
**************************************************************************/
Cs.flower.TradeWinGlobal = { 
    _offx:0, 
    _offy:0, 
    _debugMove:false,
    close:  function(){
                var win = Event.findElement(event, 'table').parentNode.parentNode;
                win.parentNode.removeChild(win);
                
                var TradeLocker = new Cs.flower.Locker();
                TradeLocker.locked(false);
            },
     closeDiv:  function(){//场景关闭窗体,配合win.confirmLight方法使用，add by zhangyangshuo
                var win = document.getElementById("showTabIdRow").parentNode.parentNode;
                win.parentNode.removeChild(win);
                
                var TradeLocker = new Cs.flower.Locker();
                TradeLocker.locked(false);
            }
};

Cs.flower.Locker = Class.create();
Object.extend(Cs.flower.Locker.prototype , {
    
    lockerName:"",
    
    initialize:function(name){
        this.lockerName = name||"_locker";
        
        if ($(this.lockerName)==null){        	
            var s = "<iframe id='"+this.lockerName+"' frameborder=\"0\" style='background-color:#ffffff;position:absolute;top:0;left:0;height:100%;width:100%;z-index:10000;filter : progid:DXImageTransform.Microsoft.Alpha(opacity=75);border:0'></iframe>"
            document.body.insertAdjacentHTML("beforeEnd", s);
            Position.clone(document.body, $(this.lockerName));//added by qiumb@
        }
    },
    
    locked:function(mode){
        if ($(this.lockerName)!=null){
            Element[mode?'show':'hide']($(this.lockerName));
            Position.clone(document.body, $(this.lockerName));
            if (!$(this.lockerName).visible())
                $(this.lockerName).remove();
        }
    },
    
    pos: function(left, top, height, width){
        
        if (left != undefined){
            $(this.lockerName).style.left = left;
        }
        
        if (top != undefined){
            $(this.lockerName).style.top = top;
        }
        
        if (height != undefined){
            $(this.lockerName).style.height = height;
        }
        
        if (width != undefined){
            $(this.lockerName).style.width = width;
        }
        
    },
    
    setIndex: function(zIndex){
        
        $(this.lockerName).style.zIndex = zIndex;
        
    }
    
});

Cs.flower.Win = Class.create();
Object.extend(Cs.flower.Win.prototype , {
    
    initialize:function(left, top, width, height){
        this.left = left||200;
        this.top = top||120;
        this.width = width||500;
        this.height = height||250;
        this.idx = ++Cs.flower.TradeWinGlobal._idx;
    },
    
    build: function(left, top, width, height,title,marginLeft){
        var marginLeftW = marginLeft||'-250';
        var winArea = document.createElement("div");
        var titleArea=document.createElement("div");
        var bodyArea= document.createElement("div");
        var s="<table style=\"width: 100%; border-style: none; border-width:0\" height=\"15\"  border=0 cellpadding=\"0\" cellspacing=\"0\"><tr>   "
	        s+="<td height=\"15\" valign=\"top\" ><img border=\"0\" src=\"/images-custserv/win/left.gif\"></td>   "
	        s+="<td style=\"width: 100%\" background=\"/images-custserv/win/barbg.gif\" valign=\"center\" height=\"15\" align=\"left\"></td>   "
	        s+="<td height=\"15\" valign=\"top\"><img border=\"0\" src=\"/images-custserv/win/xpclose.gif\" id=_tradewinclose"+this.idx+" onclick=\"Cs.flower.TradeWinGlobal.close();\" style=\"cursor:default\"><img border=\"0\" src=\"/images-custserv/win/right.gif\" id=_tradewinright"+this.idx+" style=\"cursor:default;display:none\"></td>   "
	        s+="</tr></table>   "
        titleArea.innerHTML=s;
        titleArea.onselectstart=function(){return(false);}
        
        titleArea.onmousedown=function(){
            if(Event.isLeftClick(event))
            {
                var obj = this;
                var win = this.parentNode;
                obj.setCapture();
                    
                Cs.flower.TradeWinGlobal._offx = parseInt(win.style.left) - event.clientX;
                Cs.flower.TradeWinGlobal._offy = parseInt(win.style.top) - event.clientY;
                
                Cs.flower.TradeWinGlobal._debugMove = true;
            }
        };
        
        titleArea.onmouseup=function(){
            var obj = this;
            if(Cs.flower.TradeWinGlobal._debugMove)
            {
                obj.releaseCapture();
                Cs.flower.TradeWinGlobal._debugMove = false;
            }
        };
        
        titleArea.onmousemove=function(){
            var obj = this;
            obj.style.cursor = "move";
            
            if (Cs.flower.TradeWinGlobal._debugMove){
                var win = obj.parentNode;
                try{
                win.style.left = Cs.flower.TradeWinGlobal._offx + event.clientX;
                win.style.top  = Cs.flower.TradeWinGlobal._offy + event.clientY;
                }catch(e){}
            }
        };
        
        winArea.appendChild(titleArea);
        winArea.appendChild(bodyArea);
       
        winArea.style.cssText="position:absolute;margin-left:"+marginLeftW+"px; z-index:10015;height:"+height+"px;width:"+width+"px;left:"+left+"px;top:"+top + "px;"+"left:50%;"
        bodyArea.style.cssText="position:relative;top:0px;left:0px;background-color:white;color:black;text-align:center;font-size:10pt;margin:0px; border:1px solid #e99053; border-top:0;"
        
        var tmp = document.createElement("table");
        tmp.style.cssText = "width:97%;border:0px;";
        tmp.id = "showTabIdRow";//增加id
        tmp.insertRow();
        var imgArea = tmp.rows[0].insertCell();
        imgArea.style.cssText="width:15%; background-color:#fff;text-align:center; padding-top:20px;"
        var infoArea= tmp.rows[0].insertCell();
        infoArea.style.cssText = "border-left:#999999 1px dashed; background-color:#fff;  margin-top:10px; text-align:center";
        
        bodyArea.appendChild(tmp);

        var infoText = document.createElement("div");
        infoText.style.cssText = "margin: 0px 0px 0px 10px;text-align:center;word-wrap:break-word;word-break:break-all;";
        
        var infoButton = document.createElement("div");
        infoButton.style.cssText = "valign:bottom;margin: 10px 0px 0px 10px;padding:2px; text-align:center;";
        
        infoArea.appendChild(infoText);
        infoArea.appendChild(infoButton);
        
        document.body.appendChild(winArea);
        
        this.win =  winArea;
        this.title = titleArea;
        this.body = bodyArea;
        this.img = imgArea;
        this.info = infoText;
        this.button = infoButton;
        
        this.setTitle(title);
        
        var TradeLocker = new Cs.flower.Locker();
        TradeLocker.locked(true);
    },
    
    setNoClose: function(){
        $('_tradewinclose'+this.idx).hide();
        $('_tradewinright'+this.idx).show()
    },
    
    setTitle: function(title){
        
        var titleTd = this.title.getElementsByTagName("TD")[1];
        var titleArea = document.createElement("div");
        titleArea.style.cssText = "color:white;font-weight:bold;margin-top:4px;padding-top:2px;font-size:11pt;font-family:arial;";
        titleArea.innerHTML = title;
        titleTd.innerHTML = "";
        titleTd.innerHTML = titleArea.outerHTML;
    },
    
    addButton: function(button){
        
        var btn = document.createElement("input");
        btn.type = "button";
        btn.className = "btn4";
        btn.style.cssText = "margin-right:5px;"
        
        if (button.value)
            btn.value = button.value;
        
        if (button.onclick)
            btn.onclick = button.onclick;
        
        this.button.appendChild(btn);
        
        try{btn.focus();}catch(e){};
        btn.onmouseover=function(){
        	btn.className="btn4 btnOver";
        };
        btn.onmouseout=function(){
        	btn.className="btn4 btnOff";
        };
        return btn;
    },
    
    addDiv: function(divId,extString,cssText){
        
        var divE = document.createElement("div");
        divE.id = divId;
        //btn.style.cssText = "margin-right:5px;"
        this.button.appendChild(divE);
        if(extString&&extString!="")$(divId).innerHTML=extString;
        if(cssText&&cssText!="")$(divId).style.cssText=cssText;
    },
    
    center: function(){
        
        this.win.style.left = (document.body.scrollWidth - this.win.offsetWidth)/2;
        this.win.style.top = (document.body.scrollHeight - this.win.offsetHeight)/2;
        
    },
    
    alert: function(msg, next){
    	
        this.build(this.left, document.documentElement.scrollTop + this.top, this.width, this.height,"系统提示");
        this.setNoClose();
        
        this.img.innerHTML = "<img src=\"/images-custserv/win/jingaoico.gif\" />";
        
        this.info.innerHTML = msg;
        this.title.style.width = this.body.offsetWidth;
        
        //this.center();
        
        this.button.innerHTML = "";

        this.addButton({value:" 确定 ",
                        onclick:function(){
                                Cs.flower.TradeWinGlobal.close();
                                
                                if (next instanceof Function)
                                    next();
                            }})
    },
    
    error: function(msg,next){
        
        this.build(this.left, document.documentElement.scrollTop + this.top, this.width, this.height,"系统错误");
        this.setNoClose();
        
        if (typeof setErrow != 'undefined')
            setErrow(true);
        
        this.img.innerHTML = "<img src=\"/images-custserv/win/warning.gif\" />";
        
        this.info.innerHTML = msg;
        this.title.style.width = this.body.offsetWidth;
        
        //this.center();
        
        this.button.innerHTML = "";
        this.addButton({value:" 确定 ",
                        onclick:function(){
                                Cs.flower.TradeWinGlobal.close();
                                
                                if (next instanceof Function)
                                    next();  
                            }})
                            //alert(new Cs.flower.Win().error)
                      
    },
    
    confirm:function(msg, options){
        
        this.build(this.left, document.documentElement.scrollTop + this.top, this.width, this.height,"系统确认");
        this.setNoClose();
        
        this.img.innerHTML = "<img src=\"/images-custserv/win/helpico.gif\" />";
        
        this.info.innerHTML = msg;
        this.title.style.width = this.body.offsetWidth;
        
        //this.center();
        
        this.button.innerHTML = "";

        btn = this.addButton({ value:" 确定 ",
                         onclick:function(){
                                //
                                Cs.flower.TradeWinGlobal.close();
                                
                                //
                                if (options && options.ok)
                                    options.ok();
                            }
                         })
        
        this.addButton({ value:" 取消 ",
                         onclick:function(){
                                //
                                Cs.flower.TradeWinGlobal.close();

                                //
                                if (options && options.cancel)
                                    options.cancel();
                            }
                         })
                         
        btn.focus();
    },
    
    //例子：win.confirmLight("特批工号",{lightName:"",afterLight:function(){alert(123);},extString:"111"});
      confirmLight:function(msg, options){//带场景的提示信息 add by zhangyangshuo
         
        var leftEdge = options&&options.leftEdge&&options.leftEdge!=""?options.leftEdge-500:-400;
        var widthEdge = options&&options.widthEdge&&options.widthEdge!=""?options.widthEdge:800;
        var lightNum = options&&options.lightNum&&options.lightNum!=""?options.lightNum:3;
        var lightName= options&&options.lightName&&options.lightName!=""?("SHOW_WIN_"+options.lightName):"SHOW_WIN";

        this.build(this.left, document.documentElement.scrollTop + this.top, widthEdge, this.height,"系统确认",leftEdge);
        this.setNoClose();
        
        this.img.innerHTML = "<img src=\"/images-custserv/win/helpico.gif\" />";
        
        this.info.innerHTML = msg;
        this.title.style.width = this.body.offsetWidth;

        //alertObj(options);
        this.button.innerHTML = "";
        this.addDiv("showWinDiv");
        if(options&&options.extString&&options.extString!=""){
        	this.addDiv("showWinExtDiv",options.extString,"display:none");
        }
        var showWinlight = new Cs.flower.Light(undefined,lightNum);
        showWinlight.parent=$("showWinDiv");
        
        Cs.Ajax.register("intfElms_SHOW_WIN", function(node){showWinlight.draw.bind(showWinlight)(node);});	
        showWinlight.lighting_first(lightName+"|SHOW_WIN");        
        showWinlight.callback=function(){
        	if (options && options.afterLight &&options.afterLight!="" ){
              	if(options.afterLight instanceof Function){
              		options.afterLight();
              	}else{
              		Function(options.afterLight).bind(window)();
              	}
              }
        }
        

       	
    },
    
    
    confirmHTML:function(msg, options,htmlInfo){//带HTML的提示信息 add by zhangyangshuo
         
        var leftEdge = options&&options.leftEdge&&options.leftEdge!=""?options.leftEdge-500:-400;
        var widthEdge = options&&options.widthEdge&&options.widthEdge!=""?options.widthEdge:800;
        

        this.build(this.left, document.documentElement.scrollTop + this.top, widthEdge, this.height,msg,leftEdge);
        this.setNoClose();
        
        this.img.innerHTML = "<img src=\"/images-custserv/win/helpico.gif\" />";
        
        //this.info.innerHTML = msg;
        this.title.style.width = this.body.offsetWidth;

        
        this.button.innerHTML = "";
        this.addDiv("showWinDiv");
         this.info.innerHTML = htmlInfo;
        
        
         this.button.innerHTML = "";

         this.addButton({value:" 关闭 ",
                        onclick:function(){
                                Cs.flower.TradeWinGlobal.close();
                                
                                if (options && options.ok)
                                    options.ok();
                               
                            }})
        
       	
    },
    
    open:function(url){
        
        this.build(this.left, document.documentElement.scrollTop + this.top, this.width, this.height,"打开窗口");

        var tmp = document.createElement("table");
        tmp.style.cssText = "width:97%;border:0;height:"+this.height;
        tmp.insertRow();
        var contentArea = tmp.rows[0].insertCell();
        contentArea.style.cssText="width:100%; background-color:#fff;text-align:center; padding-top:20px;"
        var con = document.createElement("div");
        contentArea.appendChild(con);
        this.body.innerHTML = "";
        this.body.appendChild(tmp);

        con.innerHTML = "<img src=\"/images-custserv/win/loading.gif\" />";
        
        new Ajax.Updater({ success: con}, url);
        
    },
    
    template: '<table cellpadding="0" cellspacing="0" width="%1%" border="0">' +
            '<tr><td><table cellpadding="3" cellspacing="1" width="100%" border="0">' +
            '<tr><td height="18" class="tipClass">%0%</td></tr>' +
            '</table></td></tr></table>',
    
    newwin:function(){
        this.build(this.left, document.documentElement.scrollTop + this.top, this.width, this.height,"打开窗口");
        
        var args = $A(arguments);
        var str=this.template;

        for(var i=0;i<args.length;++i){
            str = str.replace(new RegExp('%'+i+'%', 'g'), args[i]);
        }
        
        this.body.innerHTML=str;
    },
	select: function(arrayInfo, next, colCount,title){
		var t
        this.build(this.left, document.documentElement.scrollTop + this.top, this.width, this.height,("请选择"+((title!=null&&title!="")?(","+title):"")));
        this.setNoClose();
        this.img.innerHTML = "<img src=\"/images-custserv/win/jingaoico.gif\" />";

		this.info.innerHTML = '<fieldset id="selectArea" class="fieldset"></fieldset>';
		if(!colCount) colCount=2;
		var pTypeLayout = new Cs.flower.LayoutHelper("selectArea", colCount); //四列显示,父节点为"prodTypeArea";
	
		pTypeLayout.draw(arrayInfo, function(item){
			return "<input type='radio' class='radio' name='selectInfo'  value='"+item.value+"' />"+item.name;
		});
		selectInfo[0].click();	//选中第一个元素
        this.title.style.width = this.body.offsetWidth;

        this.button.innerHTML = "";
		var resultValue;
        this.addButton({value:" 确定 ",
                        onclick:function(){
							    var obj = $A(document.getElementsByName("selectInfo")).find(function(item)
								{
									return (item.checked == true)
								})
							    resultValue = obj.value;
                                Cs.flower.TradeWinGlobal.close();
                                
                                if (next instanceof Function)
                                    next(resultValue);
                            }})
    }
    
});

/**************************************************************************
* Created by tangzhi@2007-9-27 14:52
* 提示窗口 + 锁定器
**************************************************************************/
var onKeyPressEventTemp = onKeyPressEvent;
var TradeWinGlobal = { 
    _offx:0, 
    _offy:0, 
    _debugMove:false,
    close:  function(){
    			onKeyPressEvent = onKeyPressEventTemp;
                var win = Event.findElement(event, 'table').parentNode.parentNode;
                win.parentNode.removeChild(win);
                
                var TradeLocker = new Locker();
                TradeLocker.locked(false);
            }
};

var Locker = Class.create();
Object.extend(Locker.prototype , {
    
    initialize:function(){
        if ($('_locker')==null){
            var s = "<iframe id=_locker frameborder=\"0\" style='background-color:#ffffff;position:absolute;top:0;left:0;height:100%;width:100%;z-index:10000;filter : progid:DXImageTransform.Microsoft.Alpha(opacity=75);border:0'></iframe>"
            document.body.insertAdjacentHTML("beforeEnd", s);
            Position.clone(document.body, $('_locker'));//added by qiumb@
        }
    },
    
    locked:function(mode){
        if ($('_locker')!=null)
            Element[mode?'show':'hide']($('_locker'));
    },
    
    pos: function(left, top, height, width){
        
        if (left != undefined){
            $("_locker").style.left = left;
        }
        
        if (top != undefined){
            $("_locker").style.top = top;
        }
        
        if (height != undefined){
            $("_locker").style.height = height;
        }
        
        if (width != undefined){
            $("_locker").style.width = width;
        }
        
    },
    
    setIndex: function(zIndex){
        
        $("_locker").style.zIndex = zIndex;
        
    }
    
});
            
var TradeWin = Class.create();
Object.extend(TradeWin.prototype , {
    
    initialize:function(left, top, width, height){
        this.left = left||200;
        this.top = top||120;
        this.width = width||400;
        this.height = height||250;
    },
    
    build: function(left, top, width, height,title){
        
        var winArea = document.createElement("div");
        var titleArea=document.createElement("div");
        var bodyArea= document.createElement("div");
        var s="<table style=\"width: 100%; border-style: none; border-width:0\" height=\"15\"  border=0 cellpadding=\"0\" cellspacing=\"0\"><tr>   "
	        s+="<td height=\"15\" valign=\"top\" ><img border=\"0\" src=\"/images-custserv/win/left.gif\"></td>   "
	        s+="<td style=\"width: 100%\" background=\"/images-custserv/win/barbg.gif\" valign=\"center\" height=\"15\" align=\"left\"></td>   "
	        s+="<td height=\"15\" valign=\"top\"><img border=\"0\" src=\"/images-custserv/win/xpclose.gif\" id=_tradewinclose onclick=\"TradeWinGlobal.close();\" style=\"cursor:default\"><img border=\"0\" src=\"/images-custserv/win/right.gif\" id=_tradewinright style=\"cursor:default;display:none\"></td>   "
	        s+="</tr></table>   "
        titleArea.innerHTML=s;
        titleArea.onselectstart=function(){return(false);}
        
        titleArea.onmousedown=function(){
            if(Event.isLeftClick(event))
            {
                var obj = this;
                var win = this.parentNode;
                obj.setCapture();
                    
                TradeWinGlobal._offx = parseInt(win.style.left) - event.clientX;
                TradeWinGlobal._offy = parseInt(win.style.top) - event.clientY;
                
                TradeWinGlobal._debugMove = true;
            }
        };
        
        titleArea.onmouseup=function(){
            var obj = this;
            if(TradeWinGlobal._debugMove)
            {
                obj.releaseCapture();
                TradeWinGlobal._debugMove = false;
            }
        };
        
        titleArea.onmousemove=function(){
            var obj = this;
            obj.style.cursor = "move";
            
            if (TradeWinGlobal._debugMove){
                var win = obj.parentNode;
                win.style.left = TradeWinGlobal._offx + event.clientX;
                win.style.top  = TradeWinGlobal._offy + event.clientY;
            }
        };
        
        winArea.appendChild(titleArea);
        winArea.appendChild(bodyArea);
        
        winArea.style.cssText="position:absolute;margin-left:-200px; z-index:10005;height:"+height+"px;width:"+width+"px;left:"+left+"px;top:"+top + "px;"+"left:50%;"
        bodyArea.style.cssText="position:relative;top:0px;left:0px;background-color:white;color:black;text-align:center;font-size:10pt;margin:0px; border:1px solid #e99053; border-top:0;"
        
        var tmp = document.createElement("table");
        tmp.style.cssText = "width:97%;border:0;";
        tmp.insertRow();
        var imgArea = tmp.rows[0].insertCell();
        imgArea.style.cssText="width:15%; background-color:#fff;text-align:center; padding-top:20px;"
        var infoArea= tmp.rows[0].insertCell();
        infoArea.style.cssText = "border-left:#999999 1px dashed; background-color:#fff;  margin-top:10px;";
        
        bodyArea.appendChild(tmp);

        var infoText = document.createElement("div");
        infoText.style.cssText = "margin: 0px 0px 0px 10px;text-align:center;";
        
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
        
        var TradeLocker = new Locker();
        TradeLocker.locked(true);
    },
    
    setNoClose: function(){
        $('_tradewinclose').hide();
        $('_tradewinright').show();
    },
    
    setTitle: function(title){
        
        var titleTd = this.title.getElementsByTagName("TD")[1];
        var titleArea = document.createElement("div");
        titleArea.style.cssText = "color:white;font-weight:bold;margin-top:4;padding-top:2;font-size:11pt;font-family:arial;";
        titleArea.innerHTML = title;
        titleTd.innerHTML = "";
        titleTd.innerHTML = titleArea.outerHTML;
    },
    
    addButton: function(button){
        onKeyPressEvent = function(){};
        var btn = document.createElement("input");
        btn.type = "button";
        btn.className = "btn3";
        btn.style.cssText = "margin-right:5px;"
        
        if (button.value)
            btn.value = button.value;
        
        if (button.onclick)
            btn.onclick = button.onclick;
        
        this.button.appendChild(btn);
        
        btn.focus();
        
        return btn;
    },
    
    center: function(){
        
        this.win.style.left = (document.body.scrollWidth - this.win.offsetWidth)/2;
        this.win.style.top = (document.body.scrollHeight - this.win.offsetHeight)/2;
        
    },
    
    alert: function(msg, next, ifsucc){
        this.build(this.left, this.top, this.width, this.height,"系统提示");
        this.setNoClose();
        if (ifsucc) {
        	this.img.innerHTML = "<img src=\"/component/images/goodico.gif\" />";
        } else {
        	this.img.innerHTML = "<img src=\"/images-custserv/win/jingaoico.gif\" />";
        }
        this.info.innerHTML = msg;
        this.title.style.width = this.body.offsetWidth;
        
        this.button.innerHTML = "";

        this.addButton({value:"确定",
                        onclick:function(){
                                TradeWinGlobal.close();
                                
                                if (next instanceof Function)
                                    next();
                            }})
    },
    
    error: function(msg,next){
        
        this.build(this.left, this.top, this.width, this.height,"系统错误");
        this.setNoClose();
        
        this.img.innerHTML = "<img src=\"/images-custserv/win/warning.gif\" />";
        
        this.info.innerHTML = msg;
        this.title.style.width = this.body.offsetWidth;
        
        this.button.innerHTML = "";
        this.addButton({value:"确定",
                        onclick:function(){
                                TradeWinGlobal.close();
                                
                                if (next instanceof Function)
                                    next();  
                            }})
    },
    
    confirm:function(msg, options){
        
        this.build(this.left, this.top, this.width, this.height,"系统确认");
        this.setNoClose();
        
        this.img.innerHTML = "<img src=\"/images-custserv/win/helpico.gif\" />";
        
        this.info.innerHTML = msg;
        this.title.style.width = this.body.offsetWidth;
        
        this.button.innerHTML = "";

        btn = this.addButton({ value:"确定",
                         onclick:function(){
                                //
                                TradeWinGlobal.close();
                                
                                //
                                if (options && options.ok)
                                    options.ok();
                            }
                         })
        
        this.addButton({ value:"取消",
                         onclick:function(){
                                //
                                TradeWinGlobal.close();

                                //
                                if (options && options.cancel)
                                    options.cancel();
                            }
                         })
                         
        btn.focus();
    },
    
    open:function(url){
        
        this.build(this.left, this.top, this.width, this.height,"打开窗口");

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
        
    }
    
});


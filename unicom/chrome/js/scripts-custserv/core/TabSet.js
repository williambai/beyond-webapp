/**************************************************************************
 *   the file encoding:GBK
 *   Created by tz@2008-3-3 20:26
**************************************************************************/
Cs.flower.TabSet = Class.create();

if (!Cs.flower.TabSets) { Cs.flower.TabSets = []; }
Object.extend(Cs.flower.TabSet.prototype , {
    
    headElmId: "",
    captions: [],
    tabs:[],
    activeIdx:0,
    
    initialize:function(headElmId){
        if ($(headElmId+"_tabs"))  //兼容原来的js类TabSet
            this.headNamesId = headElmId+"_tabs";
        else if ($(headElmId))
            this.headNamesId = headElmId;
        else new Error("调用出错!");
        
        this._id = Cs.flower.TabSets.length; 
        Cs.flower.TabSets[this._id]=this;
		
		this.captions=[];
        this.tabs=[];
        this.activeIdx=0;
    },
        
    addTab: function(caption, tab){
        this.captions[this.captions.length] = caption;
        this.tabs[this.tabs.length] = tab;
    },
    
    draw: function(){
        var content = new Array;
        content[content.length]="<div class=\"c_content\"><div class=\"c_tab e_clearfix\"><ul>";
        for(var i=0; i<this.tabs.length; i++){
            if (i==this.activeIdx){
                content[content.length]="<li class=\"current\" ";
            }
            else{
                content[content.length]="<li "
                this.tabs[i].style.display = "none";
            }
            content[content.length]="style=\"cursor:hand\" onclick=\"Cs.flower.TabSets["+this._id+"].switchTo("+i+")\">";
            //content[content.length]="<a href=\"javascript:void(0)\" onfocus=\"this.blur()\">";
            //add by zhoucs 2011.8.17 start
            content[content.length]="<a href=\"javascript:void(0)\" onfocus=\"Cs.flower.TabSets["+this._id+"].switchTo("+i+")\">";
            //add by zhoucs 2011.8.17 end
            content[content.length]=this.captions[i];
            content[content.length]="</a></li>";
        }
        content[content.length]="</ul></div></div>";
        $(this.headNamesId).innerHTML = content.join("");
    },
    
    switchTo:function(index){
        if (index == this.activeIdx) return;
        
        $(this.headNamesId).down("li.current").removeClassName("current");
        this.tabs[this.activeIdx].style.display = "none";
        if(typeof this.tabs[this.activeIdx].id !="undefined" && this.tabs[this.activeIdx].id != null){
            $(this.tabs[this.activeIdx].id).style.display = "none";//对象
        }
        if (typeof this.tabs[this.activeIdx].onBlur != "undefined"){
            if (typeof this.tabs[this.activeIdx].onBlur == "string")
                (Function(this.tabs[this.activeIdx].onBlur).bind(this.tabs[this.activeIdx]))();
            else
                this.tabs[this.activeIdx].onBlur.bind(this.tabs[this.activeIdx])();
        }
        
        this.activeIdx = index;
        $(this.headNamesId).down("ul").down("li", this.activeIdx).addClassName("current");
        this.tabs[this.activeIdx].style.display = "block";
        if(typeof this.tabs[this.activeIdx].id !="undefined" && this.tabs[this.activeIdx].id != null){
            $(this.tabs[this.activeIdx].id).style.display = "block";//对象
        }
        if (typeof this.tabs[this.activeIdx].onFocus != "undefined"){
            if (typeof this.tabs[this.activeIdx].onFocus == "string")
                (Function(this.tabs[this.activeIdx].onFocus).bind(this.tabs[this.activeIdx]))();
            else
                this.tabs[this.activeIdx].onFocus.bind(this.tabs[this.activeIdx])();
        }
        
        if (typeof this._onTabSelectEvent != "undefined"){
            if (typeof this._onTabSelectEvent == "string")
                (Function(this._onTabSelectEvent).bind(this.tabs[this.activeIdx]))();
            else
                this._onTabSelectEvent.bind(this.tabs[this.activeIdx])();
        }
    },
    
    onTabSelect: function(yourEvent){
        this._onTabSelectEvent = yourEvent;
    },
    
    getActiveTab: function(){
        return this.tabs[this.activeIdx];
    },
    
    getActiveIdx: function(){
        return this.activeIdx;
    },
    
    hide: function(index){
        $(this.headNamesId).down("ul").down("li", index).style.display = "none";
        this.tabs[index].style.display = "none";
    },
    
    show: function(index){
        $(this.headNamesId).down("ul").down("li", index).style.display = "block";
        this.tabs[index].style.display = "block";
    },
    
    visible: function(index){
        return this.tabs[index].style.display != "none";
    },
    
    toggle: function(index){
        if (this.visible(index))
            this.hide(index)
        else 
            this.show(index);
    }
});

/**************************************************************************
 *   the file encoding:GBK
 *   Created by tz@2008-12-10 0:10
**************************************************************************/
Cs.flower.PageFlow = Class.create();

Object.extend(Cs.flower.PageFlow.prototype , {
    
    pages:[],
    activeId:0,
    title:null,
    activePage:null,
    move:null,
    
    initialize:function(parentId){
        this.pages.clear();
        this.activeId=0;
    },
    
    setTitle: function(titleId){
        this.title = $(titleId);
        this.title.innerHTML="<div class=\"c_tab e_clearfix\"><ul><li class=\"current\"><a href=\"javascript:void(0)\" id='_"+titleId+"' > </a></li></ul></div>";
       
    },
    
    _showTitle:function(){
   
        if (this.title&&this.activePage.titleName)
        {						
			if(this.activePage.type=="1")
				this.title.down("a").innerHTML=this.activePage.titleName +"  [您选择的号码："+pageFlowNumCode+",当前选择的产品:"+((typeof(baseProduct)=='undefined'||baseProduct==null)?"":baseProduct.productName)+"]";
			else
				this.title.down("a").innerHTML=this.activePage.titleName				
        }
        
    },
    
    addPage:function(pageId, name, type){

        this.pages.push($(pageId));
        $(pageId).titleName = name;
        $(pageId).type = type;
        $(pageId).hide();
    },
    
    addPreviousBtn:function(btn){
        this.previousBtn = $(btn);
        $(btn).hide();
        $(btn).onclick=this.previous.bind(this);
        return $(btn);
    },
    
    addNextBtn: function(btn){
        this.nextBtn = $(btn);
        $(btn).hide();
        $(btn).onclick=this.next.bind(this);
        return $(btn);
    },
    
    _showNextBtn:function(i){
        var idx = i||this.activeId;

        if(this.pages.length>idx+1&&this.nextBtn){
            var pg = this.pages[idx+1];
            if (pg.display===undefined||pg.display===true||pg.display=="true"){
                if (this.nextBtn.display===undefined||this.nextBtn.display===true||this.nextBtn.display=="true")
                    this.nextBtn.show();
                else
                    this.nextBtn.hide();
                return idx;
            }else{
                ++idx;
                return this._showNextBtn(idx);
            }
        }
        
        if (this.nextBtn)
            this.nextBtn.hide();
        
        return idx;
    },
    
    _showPreviousBtn:function(i){
        var idx = i||this.activeId;
        
        if (idx>0&&this.previousBtn){
            var pg=this.pages[idx-1];
            if (pg.display===undefined||pg.display===true||pg.display=="true"){
                if (this.previousBtn.display===undefined||this.previousBtn.display===true||this.previousBtn.display=="true")
                    this.previousBtn.show();
                else
                    this.previousBtn.hide();
                return idx;
            }else{
                --idx;
                return this._showPreviousBtn(idx);
            }
        }
        
        if (this.previousBtn)
            this.previousBtn.hide();
        
        return idx;
    },
    
    next:function(){
        
        if (this.pages.length <= this.activeId + 1) return false;
        
        this.move="next";
        window.scrollTo(0,0);
        //校验
        if (typeof this.pages[this.activeId].oncheck == "string" && !this.pages[this.activeId].oncheck.blank()){
            if (!(Function(this.pages[this.activeId].oncheck).bind(this.pages[this.activeId]))()) return;
        }
        else if (this.pages[this.activeId].onhide instanceof Function) {
            if (!(this.pages[this.activeId].onhide.bind(this.pages[this.activeId]))())return;
        }
        
        if (typeof this.pages[this.activeId].onhide == "string" && !this.pages[this.activeId].onhide.blank())
            (Function(this.pages[this.activeId].onhide).bind(this.pages[this.activeId]))();
        else if (this.pages[this.activeId].onhide instanceof Function)
            (this.pages[this.activeId].onhide.bind(this.pages[this.activeId]))();
                
        this.pages[this.activeId].hide();
        
        this.activeId = this._showNextBtn(this.activeId);
        
        this.pages[++this.activeId].show();
        
        this.activePage=this.pages[this.activeId];
        
        if (typeof this.pages[this.activeId].onshow == "string" && !this.pages[this.activeId].onshow.blank())
            (Function(this.pages[this.activeId].onshow).bind(this.pages[this.activeId]))();
        else if (this.pages[this.activeId].onshow instanceof Function)
            (this.pages[this.activeId].onshow.bind(this.pages[this.activeId]))();
        
        this._showTitle();
        
        this._showPreviousBtn(this.activeId);
        this._showNextBtn(this.activeId);
        
        return true;
    },
    
    previous:function(){
        if (this.activeId==0) return false;
        
        this.move="previous";
        
        //校验
        if (typeof this.pages[this.activeId].oncheck == "string" && !this.pages[this.activeId].oncheck.blank()){
            if (!(Function(this.pages[this.activeId].oncheck).bind(this.pages[this.activeId]))()) return;
        }
        else if (this.pages[this.activeId].onhide instanceof Function) {
            if (!(this.pages[this.activeId].onhide.bind(this.pages[this.activeId]))())return;
        }
        
        if (typeof this.pages[this.activeId].onhide == "string" && !this.pages[this.activeId].onhide.blank())
            (Function(this.pages[this.activeId].onhide).bind(this.pages[this.activeId]))();
        else if (this.pages[this.activeId].onhide instanceof Function)
            (this.pages[this.activeId].onhide.bind(this.pages[this.activeId]))();
        
        this.pages[this.activeId].hide();
        
        this.activeId=this._showPreviousBtn(this.activeId);
        
        this.pages[--this.activeId].show();
        
        this.activePage=this.pages[this.activeId];
        
        if (typeof this.pages[this.activeId].onshow == "string" && !this.pages[this.activeId].onshow.blank())
            (Function(this.pages[this.activeId].onshow).bind(this.pages[this.activeId]))();
        else if (this.pages[this.activeId].onshow instanceof Function)
            (this.pages[this.activeId].onshow.bind(this.pages[this.activeId]))();
        
        this._showTitle();
        
        this._showNextBtn(this.activeId);
        this._showPreviousBtn(this.activeId);
        
        return true;
    },
    
    switchPage:function(idx){
        this.activeId = idx;
        for(var i=0;i<this.pages.length;++i){
            if (i!=idx&&this.pages[i].visible()){
                this.pages[i].hide();
            }
        }
        if(!this.pages[this.activeId].visible())
            this.pages[this.activeId].show();
            
        if (typeof this.pages[this.activeId].onshow == "string" && !this.pages[this.activeId].onshow.blank())
            (Function(this.pages[this.activeId].onshow).bind(this.pages[this.activeId]))();
        else if (this.pages[this.activeId].onshow instanceof Function)
            (this.pages[this.activeId].onshow.bind(this.pages[this.activeId]))();
        
        this._showTitle();
        
        this._showPreviousBtn(this.activeId);
        this._showNextBtn(this.activeId);            
    },
    
    draw: function(){
        if (this.pages.length==0) return;
        
        this.activePage=this.pages[this.activeId];
        
        this.activePage.show();
        
        this._showNextBtn();
        this._showPreviousBtn();

        this._showTitle();
    }
    
    
});
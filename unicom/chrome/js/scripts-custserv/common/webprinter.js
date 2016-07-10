//Web直接打印类
var WebPrinter = Class.create();

WebPrinter.prototype = {
    //printMode:0-直接打印 1-IE打印
    initialize: function(printWindowName, printMode) {
        this.printWindowName = printWindowName || top.printframe;
		
        if(printMode == '1') {
            this.printMode = printMode;
        }
        else {
            this.printMode = '0';
        }		
    },
    
    //预览
    preview: function(pageName) {    	
        this.prePrint(pageName);
        
		var param = {};
		param.preview = '1'
		param.content = this.printWindowName.document.getElementById('paper').innerHTML;
		
        var result = window.showModalDialog(pageName, param, 'dialogWidth: 1000px; dialogHeight: 600px; resizable: no; help: no; status: no; scroll: yes;');        
        
        if(result == '1') {
        	this.print(pageName);
        }
		
		return result;
    },
    
    
    //打印内容更新至Frame
    prePrint: function(pageName) {
        var webPrinter = this;
		
        var printAjax = new Ajax.Request(
        pageName,
        {
            method: 'get',
			asynchronous: false,
            onComplete: function(result) {
                webPrinter.printWindowName.document.write(result.responseText);
                webPrinter.printWindowName.document.close();

			if(typeof Cs.ctrl.Print.beforePrintContent != 'undefined' && Cs.ctrl.Print.beforePrintContent instanceof Function)
				Cs.ctrl.Print.beforePrintContent();
            }
        });
    },
    
    //打印内容更新至Frame，完成之后调用printContent方法直接打印
    print: function(pageName) {
        var webPrinter = this;
		
        var printAjax = new Ajax.Request(
        pageName,
        {
            method: 'get',
			asynchronous: false,
            onComplete: function(result) {
                webPrinter.printWindowName.document.write(result.responseText);
                webPrinter.printWindowName.document.close();
				webPrinter.printContent();
				
            }
        });
    },
		
    printContent: function() {	
		
		if(typeof Cs.ctrl.Print.beforePrintContent != 'undefined' && Cs.ctrl.Print.beforePrintContent instanceof Function)
			Cs.ctrl.Print.beforePrintContent();

        try
        {
			DirectPrinter.BackupPaper();

            //设置打印纸张
            var paper = this.printWindowName.document.getElementById('paper');
            if(paper == null)
            	return;

			var divCount = paper.getElementsByTagName('div');

            var paperWidth = parseInt(paper.currentStyle.width) * 10;
            var paperHeight = parseInt(paper.currentStyle.height) * 10;
            
            DirectPrinter.SetCustomPaper(paper.name, paperWidth, paperHeight, 0, 0, 0,0);
			
			//设置换行分隔符
			var separator = '';
			if(this.printWindowName.document.getElementById('separator'))
				separator = this.printWindowName.document.getElementById('separator').innerHTML;
			DirectPrinter.SetSeparator(separator);

	    	//IE方式打印，设置纸张大小之后进行
	    	if(this.printMode != '0') {
	    		this.printWindowName.document.execCommand("Print");
	    		return;
	    	}
	
            //开始打印
            DirectPrinter.PrintOpen(paper.name);
           
			//设置偏移量
			var offsetX = 0;
			if(this.printWindowName.document.getElementById('offsetX'))
				offsetX = parseInt(this.printWindowName.document.getElementById('offsetX').innerHTML);
				
			var offsetY = 0;
			if(this.printWindowName.document.getElementById('offsetY'))
				offsetY = parseInt(this.printWindowName.document.getElementById('offsetY').innerHTML);
				
			DirectPrinter.SetPrintOffset(offsetX, offsetY);
           
            var i, printWordWrap;
            var printX, printY, printFontName, printFontSize, printText;
            var textInterval, lineInterval;
            var printBold,printItalic,printUnderline,printStrikeOut;
			var linenumber=0;
            
            for(i = 0; i < divCount.length; i++) {
                if(divCount[i].currentStyle.display == 'none' || divCount[i].currentStyle.previewOnly == 'yes')
                    continue;
                if(paper == divCount[i] || divCount[i].innerHTML == '')
                    continue;

				//文本打印模式
                //Mode：0-越边界时省略，1：自动换行
                printWordWrap = divCount[i].currentStyle.wordWrap == 'break-word' ?1:0;
                DirectPrinter.SetTextPrintMode(printWordWrap);
                
                //printX = divCount[i].offsetLeft;
				//printY = divCount[i].offsetTop;
                printX = parseInt(divCount[i].currentStyle.left);
                printY = parseInt(divCount[i].currentStyle.top);
                if(isNaN(printX))
                {
                	printX = this.getLeft(divCount[i]);
                }
                
                printFontName = divCount[i].currentStyle.fontFamily;
                printFontSize = parseInt(divCount[i].currentStyle.fontSize);
                
                //字间距
                textInterval = divCount[i].currentStyle.letterSpacing;
                if(textInterval == "normal")
                    textInterval = 0;
                else
                    textInterval = parseInt(textInterval);
                DirectPrinter.SetTextInterval(textInterval);
                    
                //行间距
                lineInterval = divCount[i].currentStyle.lineHeight;
                if(lineInterval != "normal")
                    lineInterval = parseInt(lineInterval);
                DirectPrinter.SetLineInterval(lineInterval);
                
                if(isNaN(printY))
                {
                	printY = this.getTop(divCount[i]);
                	if(isNaN(lineInterval))
                	{
                		printY +=linenumber*9;
                	}
                	else
                	{
                		printY +=linenumber*lineInterval;
                	}
                	linenumber += divCount[i].innerHTML.split(separator).length-2;
                }
                
                //字体风格
                printBold = divCount[i].currentStyle.fontWeight == 700?1:0;
                printItalic = divCount[i].currentStyle.fontStyle == 'italic' ||
                    divCount[i].currentStyle.fontStyle == 'oblique' ?1:0;
                printUnderline = divCount[i].style.textDecoration.indexOf('underline') != -1 ?1:0;
                printStrikeOut = divCount[i].style.textDecoration.indexOf('line-through') != -1 ?1:0;
                DirectPrinter.SetFontStyle(printBold, printItalic, printUnderline, printStrikeOut);

                printText = divCount[i].innerHTML;
                DirectPrinter.PrintTextFormat(printX, printY, printFontName, printFontSize, printText);
            }
            
            //结束打印
            DirectPrinter.PrintClose();
            DirectPrinter.RestorePaper();
        }
        catch(e) {
            alert('打印异常：' + e.message);
        }
    },
    
    //以JSON格式更新数据
    /*var divPaper =     
    {     
        "div1":"111",
        "div2":"222",
        "div3":"333",
        "div4":"444",
        "div5":"555"
    };*/
    updatePaper: function(divPaper) {		
		for(var c in divPaper) {
			if(c == "toJSONString")
	    		;
			else
				this.printWindowName.document.getElementById(c).innerHTML = divPaper[c];
		}
    },
	
	insertOne: function(id,style,content) {
		_s = '<div id="' + id + '" style="' + style + '">' + content + '</div>';
		new Insertion.Bottom(this.printWindowName.document.getElementById('paper'), _s);
    },
    
    getTop:function(e){
    	var offset=e.offsetTop;
    	if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent);
    	return offset;
    },
    
    getLeft:function(e){
    	var offset=e.offsetLeft;
    	if(e.offsetParent!=null) offset+=this.getLeft(e.offsetParent);
    	return offset;
    }
}

WebPrinter.loadActiveX = function() {
	/*new Insertion.Top(document.getElementsByTagName('body')[0], '<object id="DirectPrinter" classid="CLSID:A3C5160E-FD3C-4474-A879-2BF3397F2CD8"	CODEBASE="' + codeBase + '" style="display:none;"></object>');
	try{
	DirectPrinter.SetBaudRate(_baudRate);
	}catch(e){}*/
}

var WebTool = Class.create();

WebTool.prototype = {
    
    initialize:function(){
        if ($("DirectPrinter")==null){
            new Insertion.Top(document.getElementsByTagName('body')[0], '<object id="DirectPrinter" classid="CLSID:A3C5160E-FD3C-4474-A879-2BF3397F2CD8"	CODEBASE="' + codeBase + '" style="display:none;"></object>');
	          DirectPrinter.SetBaudRate(_baudRate);
        }
    },
    
    setBaudRate:function(rate){
        DirectPrinter.SetBaudRate(rate);
    },
    
    readFirstPwd:function(){
        return DirectPrinter.ReadCom(0,"COM1");
    },
    
    readSecondPwd:function(){
        return DirectPrinter.ReadCom(1,"COM1");
    }
}

var LittleKB = Class.create();

LittleKB.prototype = {
    
    initialize:function(){
        if ($("CYLE904R")==null){
        	new Insertion.Top(document.getElementsByTagName('body')[0], '<object id="CYLE904R" classid="CLSID:4E463D34-7674-439E-871B-AC9FB85954A9" CODEBASE="/CYLE904R.ocx#version=1,0" style="display:none;"></object>');
        }
    },
    
    readFirstPwd:function(){
    	try {
            document.CYLE904R.SetEnterMode();
            return document.CYLE904R.GetPass();
    	}
    	catch(err) {
    		txt="小键盘初始化错误！\n\n";
    	  	txt+="错误描述：" + err.description + "\n\n";
    	  	txt+="可能的原因：小键盘驱动未安装！\n\n";
    	  	alert(txt)
    	}
    },
    
    readSecondPwd:function(){
    	try {
            document.CYLE904R.SetRetryMode();
            return document.CYLE904R.GetPass();
    	}
    	catch(err) {
    		txt="小键盘初始化错误！\n\n";
    	  	txt+="错误描述：" + err.description + "\n\n";
    	  	txt+="可能的原因：小键盘驱动未安装！\n\n";
    	  	alert(txt)
    	}
    }
}
//Lodop  add by zhangyangshuo
//qc:33744 begin
var LodopTool = Class.create();
LodopTool.prototype = {
		initialize: function(printWindowName, printMode) {
	        this.printWindowName = printWindowName || top.printframe;	        
	        new Insertion.Top(document.getElementsByTagName('body')[0], '<object id="LODOP" classid="CLSID:2105C259-1E0C-4534-8141-A753534CB4CA"	CODEBASE="lodop.cab#version=6.1.4.1" style="display:none;"></object>');
	    },
	    
	    //预览
	    preview: function(pageName,pdatas,w,h) {    	
	    	w = w||1000;
	    	h = h||1000;
			window.showModalDialog(pageName, pdatas, 'dialogWidth: '+w+'px; dialogHeight: '+h+'px; resizable: no; help: no; status: no; scroll: yes;');        
	    }
}
//qc:33744 end

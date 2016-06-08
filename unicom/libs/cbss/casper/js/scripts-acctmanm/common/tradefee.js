
var TradeFee = Class.create();

Object.extend(TradeFee.prototype , {
    
    TITLE : ["费用项:80","应缴款:55","实收款:55","挂帐:50","减免流水号:160", "减免原因:180"],
    TITLE_CODE : ["feeType", "oldfee", "fee" , "deferTag", "derateId", "derateRemark"],
    TITLE_TYPE : ["TEXT"   , "TEXT"  , "TEXT", "SELECT"  , "SELECT"  , "TEXT"],
    ID: "tradeFee",
    CHARGE: "charge",
    CASH: "paymoney0",
    DEFER:  "paymoneyA",
    FEESUM: "feeSum",
    DEFAULT_ROWS: 9,
    HEIGHT: "165px",
    WIDTH: "240px",
    
    initialize : function(parent){
        if (parent != undefined)
            this.parent = $(parent);
        
        if ($(this.ID) == null)
            this.table = this.createTable();
    },

    createTable : function(){
        
        var feeDiv = document.createElement("div");
        with(feeDiv.style){
            border="1px solid #7F9DB9";
            overflowX="auto";
            width=this.WIDTH;
        }
        
        var feeTable =document.createElement("table");
        feeDiv.insertBefore(feeTable);
        
        with(feeTable.style){
            width="100%";
            border="0";
            fontFamily="Verdana, Arial, Helvetica, sans-serif";
            fontSize="12px";
            bgcolor="#A6A6A6";
        }
        with(feeTable){
            cellPadding="0";
            cellSpacing="1";
            //borderSpacing="0";
        }

        var outWidth = feeTable.offsetWidth;

        feeHead=feeTable.createTHead();
        feeFoot=feeTable.createTFoot();

        feeHead.insertRow();
        feeHead.rows[0].bgColor= "#BDC6E7";
        feeHead.rows[0].height = 20;
        for(var i=0;i<this.TITLE.length;i++){
            var theTitle = this.TITLE[i];
            var titleName = theTitle.split(":")[0];
            var titleLength = isNaN(parseInt(theTitle.split(":")[1],10))?"auto":parseInt(theTitle.split(":")[1],10);
            var theCell=feeHead.rows[0].insertCell();
            theCell.innerText=titleName;
            theCell.style.width=titleLength;
            theCell.style.borderRight = "1px solid #A5A6AD";
            theCell.noWrap = true;
            theCell.align="center";
        }
        theCell=feeHead.rows[0].insertCell();
        //theCell.innerHTML = "<img src='/component/images/loading.gif' onclick=alert(\'好玩吧!^_^\')>";
        theCell.style.width="20px";
        theCell.noWrap = true;
        theCell.align="center";

        feeFoot.insertRow();
        var theCell=feeFoot.rows[0].insertCell();
        theCell.colSpan=this.TITLE.length-1;
        theCell=feeFoot.rows[0].insertCell();
        theCell.innerHTML="<span id='tradeFeeGlobal' style='display:none'>{}<span>";
        theCell=feeFoot.rows[0].insertCell();   
        theCell.width=20;
     
       
        var feeBody = feeTable.getElementsByTagName("TBODY")[0];
        if (feeBody==null)
        {
            feeBody = document.createElement("tbody");
            feeTable.appendChild(feeBody);
        }
        feeBody.insertRow();
        theCell=feeBody.rows[0].insertCell();
        theCell.colSpan=this.TITLE.length+1;
        var theMain = document.createElement("div");
        theCell.insertBefore(theMain);

        with(theMain.style){
            width="100%";
            height=this.HEIGHT;
            overflowY="auto";
            margin="0px";
            marginLeft="-1px";
        }
        
        feeHead.onselectstart=feeFoot.onselectstart=function(){return(false);}
        
        newFeeTable=document.createElement("table");
        theMain.insertBefore(newFeeTable);
        
        newFeeTable.id = this.ID;
        
        with(newFeeTable.style){
            border="0";
            fontFamily="Verdana, Arial, Helvetica, sans-serif";
            fontSize="12px";
            bgcolor="#A6A6A6";
        }
        with(newFeeTable){
            cellPadding="0";
            cellSpacing="1";
            //borderSpacing="0";
        }

        for(var i=0; i<this.DEFAULT_ROWS; i++){
            newFeeTable.insertRow();
            newFeeTable.rows[i].bgColor = (i%2==0)?"#F4F9FF":"#E9F1FE";
            newFeeTable.rows[i].height = 20;
            for(var j=0;j<this.TITLE.length;j++){
                theCell=newFeeTable.rows[i].insertCell();
                if (i==0){
                    theTitle = this.TITLE[j];
                    titleName = theTitle.split(":")[0];
                    titleLength = isNaN(parseInt(theTitle.split(":")[1],10))?"auto":parseInt(theTitle.split(":")[1],10);
                    theCell.style.width=titleLength;
                }
                theCell.style.borderRight = "1px solid #A5A6AD";
            }
            theCell=newFeeTable.rows[i].insertCell();
            theCell.id = "feeSub"+i;
            theCell.style.display="none";
        }

        this.parent.insertBefore(feeDiv);
        
        return newFeeTable;
    },
    
    getTable: function(){
        return $(this.ID);
    },
    
    findFeeItem: function(feeMode, feeTypeCode, buildWhenNoExist){
        var theTable = this.getTable();
        var rowCount = theTable.rows.length;
        for (var i=0; i<rowCount; i++){
            
            if ($("feeSub"+i).innerText.blank()) return {index:i, exist:false};
            
            var feeSub = $("feeSub"+i).innerText.evalJSON();
            
            if (feeSub.feeMode == feeMode && feeSub.feeTypeCode == feeTypeCode)
                return {index:i, exist:true};
            
        }
        
        if (buildWhenNoExist)
        {
            theTable.insertRow();
            theTable.rows[rowCount].bgColor = (rowCount%2==0)?"#F4F9FF":"#E9F1FE";
            theTable.rows[rowCount].height = 20;
            for(var j=0;j<this.TITLE.length;j++){
                theCell=theTable.rows[rowCount].insertCell();
            }
            theCell=theTable.rows[rowCount].insertCell();
            theCell.id = "feeSub"+rowCount;
            theCell.style.borderRight = "1px solid #A5A6AD";
            theCell.style.display="none";
        }
        
        return {index:rowCount, exist:false};
    },
    
    modifyTotal: function(oldMoney, newMoney){
        
        $(this.CASH, this.FEESUM).each(function(element){
            var newFee = 0;
            if (element.innerText)
            {
                newFee = parseFloat(element.innerText, 10) - parseFloat(oldMoney) + parseFloat(newMoney);
                element.innerText = newFee.toFixed(2);
            }
            else
            {
                newFee = parseFloat($F(element), 10) - parseFloat(oldMoney) + parseFloat(newMoney);
                $(element).value = newFee.toFixed(2);
            }
        });
        
    },
    
    modifyDefer: function(oldMoney, newMoney){
        
        $(this.DEFER, this.FEESUM).each(function(element){
            var newFee = 0;
            if (element.innerText)
            {
                newFee = parseFloat(element.innerText, 10) - parseFloat(oldMoney) + parseFloat(newMoney);
                element.innerText = newFee.toFixed(2);
            }
            else
            {
                newFee = parseFloat($F(element), 10) - parseFloat(oldMoney) + parseFloat(newMoney);
                $(element).value = newFee.toFixed(2);
            }
        });
        
    },
    
    extendFeeItem: function(feeSub){
        
        if (!feeSub.derateRemark) feeSub.derateRemark = "";
        
        if (!feeSub.feeType.blank()) return;
        
        if (feeSub.feeMode=="0")
            feeSub.feeType ="营业费用"+feeSub.feeTypeCode;
        else if (feeSub.feeMode=="1")
            feeSub.feeType ="欠费违约金"+feeSub.feeTypeCode;
        else if (feeSub.feeMode=="2")
            feeSub.feeType ="预存"+feeSub.feeTypeCode;
        
        return feeSub;
    },
    
    recordFeeItem:function(feeSub, index){
        
        var oldRow = $("feeSub"+index).parentNode;
        
        var newRow = document.createElement(oldRow.tagName);
        newRow.height = oldRow.height;
        newRow.bgColor = oldRow.bgColor;
        for(var j=0;j<this.TITLE.length;j++){
            theCell = document.createElement("TD");
            theCell.align="center";
            //theCell.style.borderRight = "1px solid #A5A6AD";
            newRow.appendChild(theCell);
            
            if (index == 0)
            {
                theTitle = this.TITLE[j];
                titleLength = isNaN(parseInt(theTitle.split(":")[1],10))?"auto":parseInt(theTitle.split(":")[1],10);
                theCell.style.width=titleLength;
            }
            
            switch(this.TITLE_TYPE[j])
            {
                case "TEXT":
                    {
                        if (feeSub[this.TITLE_CODE[j]])
                            theCell.innerText = feeSub[this.TITLE_CODE[j]];
                    }
                    break;
                case "SELECT":
                    if (this.TITLE_CODE[j] == "deferTag")
                    {
                        if (feeSub.oldDeferTag && feeSub.oldDeferTag=="1")
                        {
                            if (feeSub.deferTag && feeSub.deferTag == "1")
                                theCell.innerHTML = "<select class='box1' onchange=changeDeferTag(event)><option value='0' checked>No</option><option value='1' selected='selected'>Yes</option></select>"
                            else
                                theCell.innerHTML = "<select class='box1' onchange=changeDeferTag(event)><option value='0' checked>No</option><option value='1'>Yes</option></select>"
                        }
                        else
                            theCell.innerHTML = "没权限";
                    }
                    else if (this.TITLE_CODE[j] == "derateId")
                    {
                        if (feeSub["derateIdList"] && !feeSub["derateIdList"].blank())
                        {
                            derateArray = feeSub["derateIdList"].evalJSON();
                            if (derateArray.length > 0)
                            {
                                var derateOptions = "";
                                var optionValue = feeSub.derateId;
                                for(var i=0; i<derateArray.length; i++)
                                {
                                    if  (derateArray[i] == optionValue)
                                        derateOptions += "<option selected='selected'>" + derateArray[i] + "</option>";
                                    else
                                        derateOptions += "<option>" + derateArray[i] + "</option>";
                                }
                                theCell.innerHTML = "<select class='box1' onchange=changeDerateId(event)><option/>"+derateOptions+"</select>"
                            }
                        }
                    }
            }
        }
        
        theCell = document.createElement("TD");
        newRow.appendChild(theCell);
        theCell.id = "feeSub"+index;
        theCell.style.display="none";
        theCell.innerText = Object.toJSON(feeSub);
        
        oldRow.replaceNode(newRow);
        
        //判断是否删除
        if (parseFloat(feeSub.oldfee) == 0 && parseFloat(feeSub.fee) == 0 
            && !(feeSub.required||false)){
                
                newRow.style.display="none";
                
        }
        
    },
    
    /*查找费用项是否存在，不存在则新增;存在则增加金额*/
    addFeeItem: function(feeMode, feeTypeCode, feeType, fee ,Months, chargeSourceCode, required){
        
        var result  = this.findFeeItem(feeMode, feeTypeCode, true);
        
        var feeSub = {};
        if (result.exist) 
        {
            feeSub = $("feeSub"+result.index).innerText.evalJSON();
            feeSub.oldfee = parseFloat(feeSub.oldfee) + parseFloat(fee);
            feeSub.fee = parseFloat(feeSub.fee) + parseFloat(fee);
            feeSub.months = (Months==undefined)?feeSub.months:Months;
            feeSub.chargeSourceCode = (chargeSourceCode==undefined)?feeSub.chargeSourceCode:chargeSourceCode;
            feeSub.required = (required==undefined)?feeSub.required:required;
        }
        else
        {
            feeSub.feeMode = feeMode;
            feeSub.feeTypeCode = feeTypeCode;
            feeSub.feeType = feeType;
            feeSub.oldfee = fee;
            feeSub.fee = fee;
            feeSub.months = (Months==undefined)?0:Months;
            feeSub.chargeSourceCode = (chargeSourceCode==undefined)?0:chargeSourceCode;
            feeSub.required = required;
            feeSub.derateId = "";
            feeSub.derateType = "";
            feeSub.derateRemark = "";
            
            this.extendFeeItem(feeSub);
        }
        
        //
        if (feeSub.deferTag && feeSub.deferTag == "1")
            this.modifyDefer(0, fee);
        else
            this.modifyTotal(0, fee);
        
        //
        this.recordFeeItem(feeSub, result.index);

    },
    
    /*查找费用项是否存在，不存在则新增;存在则修改金额为指定值*/
    modifyFeeItem: function(feeMode, feeTypeCode, feeType, fee, Months, chargeSourceCode, required){
        var result  = this.findFeeItem(feeMode, feeTypeCode, true);
        
        var feeSub = {};
        if (result.exist) 
        {
            feeSub = $("feeSub"+result.index).innerText.evalJSON();
            
            //
            if (feeSub.deferTag && feeSub.deferTag == "1")
                this.modifyDefer(feeSub.fee, fee);
            else
                this.modifyTotal(feeSub.fee, fee);
            
            feeSub.oldfee = fee;
            feeSub.fee = fee;
            feeSub.months = (Months==undefined)?feeSub.months:Months;
            feeSub.chargeSourceCode = (chargeSourceCode==undefined)?feeSub.chargeSourceCode:chargeSourceCode;
            feeSub.required = (required==undefined)?feeSub.required:required;
        }
        else
        {
            feeSub.feeMode = feeMode;
            feeSub.feeTypeCode = feeTypeCode;
            feeSub.feeType = feeType;
            feeSub.oldfee = fee;
            feeSub.fee = fee;
            feeSub.months = (Months==undefined)?0:Months;
            feeSub.chargeSourceCode = (chargeSourceCode==undefined)?0:chargeSourceCode;
            feeSub.required = required;
            feeSub.derateId = "";
            feeSub.derateType = "";
            feeSub.derateRemark = "";
            
            this.extendFeeItem(feeSub);
            
            this.modifyTotal(0, fee);
            
        }
        
        //
        this.recordFeeItem(feeSub, result.index);
    },
    
    
    removeFeeItem: function(feeMode, feeTypeCode){
        
        feeTypeCode = feeTypeCode || "*";
        
        var theTable = this.getTable();
        var rowCount = theTable.rows.length;
        for (var i=0; i<rowCount; i++){
            
            if ($("feeSub"+i).innerText.blank()) continue;
            
            var feeSub = $("feeSub"+i).innerText.evalJSON();
            
            if (feeSub.feeMode == feeMode && (feeSub.feeTypeCode == feeTypeCode || feeTypeCode == "*")){
                
                feeSub.fee = "0";
                feeSub.oldfee = "0";
                feeSub.months = 0;
                feeSub.chargeSourceCode = 0;
                feeSub.derateId = "";
                feeSub.derateType = "";
                feeSub.derateRemark = "";
                
                this.recordFeeItem(feeSub, i);
            }
            
        }
        
    },
    
    addFee:function(obj){
        fee = obj;
        
        if (fee == "null") return;
        if (typeof fee == 'string') fee = fee.evalJSON();
        
        if (fee.constructor == Array){
            for(var i=0; i<fee.length; i++)
                this.addFee(fee[i]);
            return;
        }
        
        this.modifyTotal(0, fee.fee);
        
        var result  = this.findFeeItem(fee.feeMode, fee.feeTypeCode, true);

        this.recordFeeItem(fee, result.index);
    },
    
    encode:function(){
        
        var encodeTab = new StrTable();
        
        //费用子串TfSb(11 费用属性+费用类型编码+应缴金额+实缴金额+减免流水号+减免原因+开始时间+月份数+费用来源+欠费违约金/预存可退日期+限额)
        encodeTab.addTable("TfSb", 11);
        
        //挂帐子串TfDf(4 费用属性+费用类型编码+挂帐金额+挂帐帐目)
        encodeTab.addTable("TfDf", 4);
        
        var theTable = this.getTable();
        var rowCount = theTable.rows.length;
        for (var i=0; i<rowCount; i++){
            
            if ($("feeSub"+i).innerText.blank()) continue;
            
            var feeSub = $("feeSub"+i).innerText.evalJSON();
            
            if (parseFloat(feeSub.oldfee) != 0 || parseFloat(feeSub.fee) != 0)
            {
                var oldfee = parseFloat(feeSub.oldfee)*100;
                var fee = parseFloat(feeSub.oldfee)*100;
                
                encodeTab.addField("TfSb",  feeSub.feeMode,
                                            feeSub.feeTypeCode,
                                            oldfee.toFixed(0),
                                            fee.toFixed(0),
                                            feeSub.derateId||"",
                                            feeSub.derateRemark||"",
                                            feeSub.startDate||"",
                                            feeSub.months||"0",
                                            feeSub.chargeSourceCode||"0",
                                            feeSub.dpstRtnDate||"",
                                            feeSub.limitFee||"" );
                                            
                if (feeSub.deferTag && feeSub.deferTag == "1"){
                    
                    encodeTab.addField("TfDf", feeSub.feeMode,
                                            feeSub.feeTypeCode,
                                            fee.toFixed(0), "");
                    
                }
            }
            
        }
        
        //付款子串TfPm(2 付款子类型+实缴金额)
        encodeTab.addTable("TfPm", 2);
        
        theTable = $(this.CHARGE);
        rowCount = theTable.rows.length;
        for(var i =1; i< rowCount; i++){
            
            var paymoney = theTable.rows[i].cells[1];
            
            if  (!paymoney.id || !paymoney.id.startsWith("paymoney")) continue;
            
            paycode = paymoney.id.substring("paymoney".length)
            money = parseFloat(paymoney.innerText)*100;
            
            if (money != 0)
                encodeTab.addField("TfPm", paycode, money.toFixed(0));
            
        }

        return encodeTab.inspect();
    }
    
});

function changeDerateId(event){
    element = Event.element(event);
    
    var id = element.parentNode.parentNode.lastChild.id;
    var feeItem = element.parentNode.parentNode.lastChild.innerHTML.evalJSON();
    feeItem.derateId = element.getValue();
    var i = feeItem.derateIdList.evalJSON().indexOf(feeItem.derateId);
    feeItem.derateRemark = feeItem.derateRemarkList.evalJSON()[i];
    feeItem.derateFee = feeItem.derateFeeList.evalJSON()[i];
    feeItem.derateType = feeItem.derateTypeList.evalJSON()[i];
    if (i == -1)
        feeItem.derateRemark = "";
    
    var fee = new TradeFee();
    
    if (feeItem.derateType == "0")
    {
        var money = parseFloat(feeItem.oldfee) - parseFloat(feeItem.derateFee)/100.0;
        if (money < 0 && money>-10000) money = 0;
        
        if (feeItem.deferTag != "1")
            fee.modifyTotal(feeItem.fee, money);
        
        feeItem.fee = money.toFixed(2);
    }
    else if (feeItem.derateType == "1")
    {
        var money = parseFloat(feeItem.oldfee) * (1 - parseFloat(feeItem.derateFee)/100.0);
        
        if (feeItem.deferTag != "1")
            fee.modifyTotal(feeItem.fee, money);
        
        feeItem.fee = money.toFixed(2);
    }
    else
    {
        if (feeItem.deferTag != "1")
            fee.modifyTotal(feeItem.fee, feeItem.oldfee);
        
        feeItem.fee = feeItem.oldfee;
    }
    
    fee.recordFeeItem(feeItem, id.split("feeSub")[1]);

}

function changeDeferTag(event) {
    element = Event.element(event);
    
    var id = element.parentNode.parentNode.lastChild.id;
    var feeItem = element.parentNode.parentNode.lastChild.innerHTML.evalJSON();
    feeItem.deferTag = element.getValue();
    
    var fee = new TradeFee();
    if (feeItem.deferTag == "1"){
        fee.modifyTotal(feeItem.fee, 0);
        fee.modifyDefer(0, feeItem.fee);
    }else if (feeItem.deferTag == "0") {
        fee.modifyTotal(0, feeItem.fee);
        fee.modifyDefer(feeItem.fee, 0);
    }
    
    fee.recordFeeItem(feeItem, id.split("feeSub")[1]);
}


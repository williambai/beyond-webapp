/**************************************************************************
           Created By tangzhi@2007-9-9 14:25

说明:(表名(长度TABLE_NAME_LEN)+行数(长度ROW_COUNT_LEN)+列数(长度COL_COUNT_LEN)+(列字段长度(长度COL_SIZE_LEN)+列字段内容)*)*

For Example:
    var tab = new StrTable();
    tab.addTable("Tabs", 1);
    tab.addField("Tabs","td_s_tradetype");
    tab.addField("Tabs","td_s_cparam");
    tab.addField("Tabs","td_s_netcode", "td_b_bank");
    var str = tab.inspect();
    tab.clear();
    tab.decodeString(str);
    alert(tab.inspect());
**************************************************************************/
var StrTable = Class.create();

Object.extend(StrTable.prototype , {
    
    TABLE_NAME_LEN: 4,
    ROW_COUNT_LEN:  3,
    COL_COUNT_LEN:  2,
    COL_SIZE_LEN:   4,
    
    initialize: function(str) {
        
        this.tables = $H();
        
        if (typeof str == 'string') {
            this.decodeString(str);
        }
    },
  
    
    include:function(tabName){
        return this.tables.keys().include(tabName);
    },
    
    getTableByName :function(tabName){
        return this.tables.find(function(table){
            return table.key == tabName
            }).value;
    },
    
    addTable: function( tabName, cols) {

        if (tabName.length != this.TABLE_NAME_LEN)  
           throw new Error("表名称编码长度错误");
 
        if (this.include(tabName)) return;
        
        var table = { colCount:cols, rowCount:0, colIndex:0, values:[]};
        
        this.tables[tabName] = table;
    },
    
    addField: function(tabName, fieldValue){
        
        if (arguments.length>2)
        {
            for (var fieldCount = 1; fieldCount < arguments.length; fieldCount++)
            {
                this.addField(tabName, arguments[fieldCount]);
            }
            return;
        }
        
        if (!this.include(tabName)) 
            throw new Error("表["+tabName+"]不存在!");
        
        var tab = this.getTableByName(tabName);
        
        if  (tab.colIndex == 0)
        {
            var cols = [ fieldValue ];
            tab.values.push(cols);
            tab.rowCount++;
        }
        else
        {
            var cols = tab.values[tab.values.length-1];
            cols = cols.push(fieldValue);
        }
        
        tab.colIndex ++;
        
        if  (tab.colIndex >= tab.colCount)
            tab.colIndex = 0;
    },
    
    inspect:function(){
        var rowCountLen = this.ROW_COUNT_LEN;
        var colCountLen = this.COL_COUNT_LEN;
        var colSizeLen = this.COL_SIZE_LEN;
        return this.tables.map(function(pair){
            
            if (pair.value.colIndex != 0) throw new Error("表["+pair.key+"]中字段不完整");
            if (pair.value.rowCount == 0) return "";
            
            var rowCount = ("0".times(rowCountLen)+pair.value.rowCount).slice(-1*rowCountLen);

            var colCount = ("0".times(colCountLen)+pair.value.colCount).slice(-1*colCountLen);

            var valueContent = "";
            for(var i =0; i<pair.value.rowCount; i++)
            {
                for(var j=0; j<pair.value.colCount; j++)
                {
                    var field = pair.value.values[i][j];
                    var fieldLength = ("0".times(colSizeLen)+field.length).slice(-1*colSizeLen);
                    valueContent += fieldLength + field;
                }
            }
            
            return pair.key+rowCount+colCount+valueContent;
            }).join('');
        
    },
    
    clear:function(){
        this.tables = $H();
    },
    
    decodeString: function(srcStr, rowCountLen, colCountLen){
        
        rowCountLen = rowCountLen || this.ROW_COUNT_LEN;
        colCountLen = colCountLen || this.COL_COUNT_LEN;
        
        if (srcStr.blank()) return;
        
        var theStr = srcStr.strip();
        
        while(theStr.length > 0) {
            
            var tabName = theStr.substring(0, this.TABLE_NAME_LEN);
            var rowCount = parseInt(theStr.substring(this.TABLE_NAME_LEN, this.TABLE_NAME_LEN+rowCountLen), 10);
            var colCount = parseInt(theStr.substring(this.TABLE_NAME_LEN+rowCountLen, this.TABLE_NAME_LEN+rowCountLen+colCountLen), 10);
            
            this.addTable(tabName, colCount);
            
            theStr = theStr.substring(this.TABLE_NAME_LEN+rowCountLen+colCountLen);
            
            for (var i=0; i<rowCount*colCount; i++){
                
                var valueLen = parseInt(theStr.substring(0, this.COL_SIZE_LEN), 10);
                var value = theStr.substring(this.COL_SIZE_LEN, this.COL_SIZE_LEN+valueLen);
                
                this.addField(tabName, value);
                
                theStr = theStr.substring(this.COL_SIZE_LEN+valueLen);
            }
        }
        
        return this;
    }
});

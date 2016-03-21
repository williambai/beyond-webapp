/** table edit */
function TableEdit(tableName, encode) {
	this.tableName = tableName;
	this.table = getElement(tableName);
	this.header = this.table.rows[0];
	this.rowIndex = 0;
	this.isSelected = false;
	this.encode = encode == null ? false : encode;
	this.isChanged = false;
	
	/** inner text */
	this.setCellValue = function(hcell, cell, content) {
		cell.id = hcell.id;
		cell.style.display = hcell.style.display;
		content = this.encodeCellValue(content);
		cell.innerHTML = content;
	}
	/** encode content */
	this.encodeCellValue = function(content) {
		if (this.encode && content != null) {
			content = content.replace("&", "&amp;");
			content = content.replace("<", "&lt;");
			content = content.replace(">", "&gt;");
		}
		return content;
	}
	/** decode content */
	this.decodeCellValue = function(content) {
		if (this.encode && content != null) {
			content = content.replace("&lt;", "<");
			content = content.replace("&gt;", ">");
			content = content.replace("&amp;", "&");
		}
		return content;
	}
	/** get cell */
	this.getCell = function(row, cellName) {
		var hcells = this.header.cells;
		for (var i=0; i<hcells.length; i++) {
			var cell = row.cells[i];
			if (hcells[i].id == "col_" + cellName) return cell;
		}
		return null;
	}
	/** trigger cell */
	this.triggerCell = function(cellName, cellValue) {
		var row = getElementByTag(window.event.srcElement, "tr");
		var cell = this.getCell(row, cellName);
		var x_tag = this.getCell(row, "X_TAG");
	
		cell.innerHTML = cellValue;
		if (x_tag.innerHTML == "") {
			x_tag.innerHTML = "2";
		}
	}
	/**modify by hujia 20070808*/
	/** verify table */
	this.verifyTable = function(changed) {
		/*changed=true 表示校验表格数据是否修改过*/
		if (changed != null && changed) {
			if (!this.isChanged) {
				alert('表格数据没有更新！');
				return false;
			}else {
				return true;
			}
		}else {
			if (!this.isSelected) {
				alert('请选择表格！');
				return false;
			}
		}
		return true;
	}
	/**modify by hujia 20070808*/
	/** check row */
	/** isupdate=true 表示修改时判断，key:修改时判断主键不能被修改  */
	this.checkRow = function(cellName,isupdate,key) {
		var cellNames = cellName.split(",");
		var keys = key != null ? key.split(",") : "";
		
		for (var i=1; i<this.table.rows.length; i++) {
			var row = this.table.rows[i];
			if (row.style.display == "none") continue;
			
			for (var k=0; k<this.header.cells.length; k++) {
				if (isupdate != null && isupdate && i == this.rowIndex) {
					for (var n=0; n<keys.length; n++) {				
						if(keys[n] == this.header.cells[k].id.substring("col_".length)) {
							var fieldValue = getElementValue(keys[n]);
							if(fieldValue != this.decodeCellValue(trim(row.cells[k].innerHTML))){
								var error = this.header.cells[k].innerHTML+"是主键不能修改！";
								alert(error);
								return false;
							}
						}						
			  		}
			  		continue;					
				}
				
				for (var j=0; j<cellNames.length; j++) { 
    				var fieldValue = getElementValue(cellNames[j]);
    				var info = this.getCell(this.header, cellNames[j]).innerText + "已经存在！";
					if (this.getCell(row, cellNames[j]).innerText == fieldValue) {
						alert(info);
						return false;
					}
				}
			}
		}
		return true;
	}
	/** insert row */
	this.insertRow = function() {
		var row = this.table.insertRow(this.table.rows.length);
	
		var hcells = this.header.cells;
		for (var i=0; i<hcells.length; i++) {
			if (hcells[i].id == null || !startsWith(hcells[i].id, "col_")) continue;

			var cell = row.insertCell(i);
			var cellName = hcells[i].id.substring("col_".length);
			var field = getElement(cellName);
		
			if (cellName == "X_TAG") {
				this.setCellValue(hcells[i], cell, "0");
			} else {
				if (field != null) {
					this.setCellValue(hcells[i], cell, field.value);
					field.value = '';
				} else {
					this.setCellValue(hcells[i], cell, '');
				}
			}
		}
	}
	/** update row */
	this.updateRow = function() {
		var row = this.table.rows[this.rowIndex];
	
		var hcells = this.header.cells;
		for (var i=0; i<hcells.length; i++) {
			if (hcells[i].id == null || !startsWith(hcells[i].id, "col_")) continue;

			var cell = row.cells[i];
			var cellName = hcells[i].id.substring("col_".length);
			var field = getElement(cellName);
		
			if (cellName == "X_TAG" && cell.innerText == "") {
				this.setCellValue(hcells[i], cell, "2");
			} else {
				if (field != null) {
					this.setCellValue(hcells[i], cell, field.value);
					field.value = '';
				}
			}
		}
	}
	/** del row */
	this.deleteRow = function() {
		var row = this.table.rows[this.rowIndex];
	
		var isDelete = true;
		var hcells = this.header.cells;
		for (var i=0; i<hcells.length; i++) {
			if (hcells[i].id == null || !startsWith(hcells[i].id, "col_")) continue;

			var cell = row.cells[i];
			var cellName = hcells[i].id.substring("col_".length);
			var field = getElement(cellName);

			if (cellName == "X_TAG") {
				if (cell.innerText == "" || cell.innerText == "2") {
					this.setCellValue(hcells[i], cell, "1");
					isDelete = false;
				}
			} else {
				if (field != null) {
					field.value = '';
				}
			}
		}

		if (isDelete) {
			this.table.deleteRow(this.rowIndex);
		} else {
			row.style.display = "none";
		}
		this.isSelected = false;
	}
	/** click row */
	this.clickRow = function() {
		for (var i=1; i<this.table.rows.length; i++) {
			this.table.rows[i].className = "row_even";
		}

		var row = getElementByTag(window.event.srcElement, "tr");
		if (row == null || row.rowIndex == 0) return;

		row.className = "row_select";
		this.rowIndex = row.rowIndex;
		this.isSelected = true;

		for (var i=0; i<this.header.cells.length; i++) {
			var cellName = this.header.cells[i].id.substring("col_".length);
			var field = getElement(cellName);
			if (field != null) {
				var fieldValue = this.decodeCellValue(trim(row.cells[i].innerHTML));
				if (field.tagName == "INPUT" && field.type != null && (field.type.toUpperCase() == "CHECKBOX" || field.type.toUpperCase() == "RADIO")) {
					field.checked = fieldValue == field.value;
				} else {
					field.value = fieldValue;
				}
			}
		}
	}
	/** get cols value */
	this.getColsValue = function(cols, flag) {
		var str = "";
		
		var rows = this.table.rows;
		for (var i=1; i<rows.length; i++) {
			var cell = this.getCell(rows[i], cols);
			if (cell == null) alert("column " + cols + " not found");
			str = (flag == true) ? str + cell.innerText + "," : str + cell.innerText;
		}
		
		return str;
	}
	/** encode value */
	this.encodeValue = function(num, key, cols, def, flag) {
		var str = "";
		
		var rows = this.table.rows;
		for (var i=0; i<num; i++) {
			str = (flag != true) ? str + def  : str + "," + def;
		}
		for (var j=1; j<rows.length; j++) {
			var key_value = this.getCell(rows[j], key);
			var cols_value = this.getCell(rows[j], cols);
			if (!key_value) alert("column " + key + " not found");
			if (!cols_value) alert("column " + cols + " not found");
			str = str.substring(0, key_value.innerText - 1) + cols_value.innerText + str.substring(key_value.innerText, num);
		}
		
		return str;
	}
	/** encode table */
	this.encodeTable = function(headstr) {
		var str = "";
		var rowcount = 0;

		var rows = this.table.rows;
		var hcells = this.header.cells;
		var encodehead = headstr.split(",");

		for (var i=1; i<rows.length; i++) {
			if (this.getCell(rows[i], "X_TAG").innerText == "") continue;

			var row = rows[i];
			for (var j=0; j<encodehead.length; j++) {
				var cell = this.getCell(row, encodehead[j]);
				if (cell == null) alert("column " + encodehead[j] + " not found！");

				str += getStrByPadLength(cell.innerText, true);
			}

			rowcount ++;
		}
		if(rowcount > 0) this.isChanged = true;
		return this.tableName.substr(0, 4) + getStrByPadPrefix(rowcount) + getStrByPadPrefix(encodehead.length, 3) + str;
	}
	
	/** get row num */
	this.getRowNum = function () {
		return this.table.rows.length;
	}
	
	/** move row */
	this.moveRow = function (index1, index2) {
		if (this.rowIndex == null || this.rowIndex == 0)
			return ;
			
		var rows = this.table.rows;
		if (index2 <=0 || index2 >= rows.length) return ;
		
		var row1 = rows[index1].cells;
		var row2 = rows[index2].cells;
		
		for (var i=0; i<row1.length; i++) {
			var temp = row1[i].innerHTML;
			row1[i].innerHTML = row2[i].innerHTML;
			row2[i].innerHTML = temp;
		}
		this.rowIndex = index2;
		this.table.rows[index1].className = "";
		this.table.rows[index2].className = "row_select";
		this.isSelected = true;
	}
	
	/** move up */
	this.moveUp = function () {
		this.moveRow(this.rowIndex, this.rowIndex-1);
	}
	
	/** move down */
	this.moveDown = function () {
		this.moveRow(this.rowIndex, this.rowIndex+1);
	}
	
	/** move first */
	this.moveFirst = function () {
		this.moveRow(this.rowIndex, 1);
	}
	
	/** move last */
	this.moveLast = function () {
		this.moveRow(this.rowIndex, this.getRowNum()-1);
	}
}
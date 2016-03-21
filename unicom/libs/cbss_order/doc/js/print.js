/********************************************************************************************
* HTML Print
* setNeedBorder:是否包含边框，默认包含边框
* printRow("table");打印指定表格原始内容
* print("table"),打印表格所有内容
* print("table", 'CODE,TYPE'),打印表格指定列所有内容（不需要打印的列名放入第二个参数，对应的td id="col_CODE"等，需要加上col_）
* print("table", 'CODE,TYPE', '100,200'),打印表格指定列所有/指定内容，并指定列宽
* print("table", 'CODE,TYPE', '100,200', true),打印表格列，其中参数四表示是否删除/保留列（为true表示删除参数二指定的列，为false表示只显示参数二指定的列，默认为false:保留）
* print("table", 'CODE,TYPE', '100,200', true, true),打印表格所有/指定内容,参数五可以指定是否去掉表头，默认为不去
* print("table", 'CODE', '100,200', true, true, title),打印表格所有/指定内容,参数6是加上标题
* print('table_list', 'TYPE', '100,200', true, true, '打印标题', 'SUPERUSR 2005-06-02 12:12:12'); 打印表格所有/指定内容，参数7 指定标题下面的信息
* @参数一：表名
* @参数二：列名，多个用,号分开
* @参数三：列宽，与列名对应
* @参数四：列操作类型，false|true，false表示参数二为要删除的列名，true表示参数二为要显示的列名，默认为显示列名(false)
* @参数五：是否去掉表头,默认false
* @参数五：是否去掉表头,默认false
* @参数六：标题内容
* @参数七：页尾内容
*/

/** html print */
function HtmlPrint() {
	this.hkey_root = "HKEY_CURRENT_USER";
	this.hkey_path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
	this.need_border = true;
	this.printframe = getFrame("printframe");
	
	/** clear header and footer  */
	this.clearHeaderAndFooter = function() {
		this.setHeaderAndFooter("", "");
	}
	/** set default header and footer */
	this.setHeaderAndFooter = function() {
		this.setHeaderAndFooter("&w&b页码，&p/&P", "&u&b&d");
	}
	/** set header and footer */
	this.setHeaderAndFooter = function(header, footer) {
		try {
			var regwsh = new ActiveXObject("WScript.Shell");
			var hkey_key = "header";    
			regwsh.RegWrite(this.hkey_root + this.hkey_path + hkey_key, header);
			hkey_key = "footer";
			regwsh.RegWrite(this.hkey_root + this.hkey_path + hkey_key, footer);
		} catch (e) {
		}
	}
	/** set need border */
	this.setNeedBorder = function (need_border) {
		this.need_border = need_border;
	}
	/** get print object */
	this.getPrintObject = function (objname) {
		this.clearHeaderAndFooter();
		
		this.printframe.document.body.innerHTML = "";
		this.printframe.document.body.insertAdjacentHTML("afterBegin", "");
		this.printframe.document.body.insertAdjacentHTML("beforeEnd", document.getElementById(objname).outerHTML);
	
		return this.printframe.document.getElementById(objname);
	}
	/** print raw */
	this.printRaw = function (objname) {
		if (window.confirm("确定打印吗？")) {
			var newobj = this.getPrintObject(objname);
			newobj.style.display = "";
			if (this.need_border) {
				newobj.style.borderCollapse = "collapse";
				newobj.borderColor = "#000000";
			}
			newobj.bgColor = "#FFFFFF";
			newobj.style.fontSize = "12px";
						
			this.printframe.focus();
			this.printframe.print();
		}
	}
	/** 
	 * print table
	 * @param objname<table name>
	 * @param encode<table column>
	 * @param isdelete<is delete column(default false)>
	 * @param removehead<remove header>
	 * @param title
	 * @param info
	 * @param footer
	 */
	this.print = function (objname, encodehead, encodewidth, isdelete, removehead, title, info, footer) {
		if (window.confirm("确定打印吗？")) {
			var newobj = this.getPrintObject(objname);
			newobj.style.display = "";
			if (this.need_border) {
				newobj.border = "1";
				newobj.style.borderCollapse = "collapse";
			}
			newobj.borderColor = "#000000";
			newobj.bgColor = "#FFFFFF";
			newobj.style.fontSize = "12px";
			
			var header = newobj.rows[0];
			header.style.textAlign = "center";
			
			var hcells = header.cells;
			var celllength = hcells.length;
			var headlength = encodehead && encodehead != "" ? encodehead.split(",").length : 0;
			var colspan = isdelete ? celllength - headlength : headlength != 0 ? headlength : celllength;
	
			if (encodehead && encodehead != "") {
				var rows = newobj.rows;
				var heads = encodehead.split(",");
				var widths = encodewidth && encodewidth != '' ? encodewidth.split(",") : null;
				for (var i=0; i<rows.length; i++) {
					var row = rows[i];
					if (isdelete) {
						for (var j=0; j<heads.length; j++) {
							var cells = row.cells;
							for (var k=0; k<cells.length; k++) {
								var cell = cells[k];
								cell.id = hcells[k].id;
								if (cell.id == "col_" + heads[j]) {
									cell.style.display = "none";
									break;
								}
							}
						}
					} else {
						var cells = row.cells;
						for (var j=0; j<cells.length; j++) {
							var cell = cells[j];
							cell.id = hcells[j].id;
							var width = cell.width;
							var isexist = false;
							for (var k=0; k<heads.length; k++) {
								if (cell.id == "col_" + heads[k]) {
									isexist = true;
									if (widths && widths[k] != "") width = widths[k];
									break;
								}
							}
							if (!isexist) {
								cell.style.display = "none";
							} else {
								cell.width = width;
							}
						}
					}
				}
			}
		
			if (removehead) newobj.deleteRow(0);
			if (info && info != '') {
				var inforow = newobj.insertRow(0);
				var infocell = inforow.insertCell(0);
				infocell.innerHTML = info;
				infocell.colSpan = colspan;
			}
			if (title && title != '') {
				var titlerow = newobj.insertRow(0);
				var titlecell = titlerow.insertCell(0);
				titlecell.innerHTML = title;
				titlecell.colSpan = colspan;
				titlecell.align = "center";
				titlecell.height = "20";
				titlecell.style.fontSize = "20px";
				titlecell.style.fontWeight = "bold";
			}
			
			if (footer) {
				var footerrow = newobj.insertRow(newobj.rows.length);
				var footercell = footerrow.insertCell(0);
				footercell.innerHTML = footer;
				footercell.colSpan = colspan;
				footercell.height = "100";
			}
			
			this.printframe.focus();
			this.printframe.print();
		}
	}
}
/** print raw */
function printRaw(objname) {
	new HtmlPrint().printRaw(objname);
}
/** print */
function print(objname, encodehead, encodewidth, isdelete, removehead, title, info, footer) {
	new HtmlPrint().print(objname, encodehead, encodewidth, isdelete, removehead, title, info, footer);
}
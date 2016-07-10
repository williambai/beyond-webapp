Object
		.extend(
				TableEdit.prototype,
				{
					/** add by chenjuewei 2007-11-14* */
					setSelected : function(select) {
						this.isSelected = select;
					},

					/**
					 * 有主次表的时候，被选中表格的背景色变化 不过目前这个函数没有用到
					 */
					mainSubTabSelColor : function(/* 是否选中 */sel) {
						var selBackColor;
						if (sel) {
							selBackColor = "row_highLight";
						} else {
							selBackColor = "row_even";
						}
						for ( var i = 1; i < this.table.rows.length; i++) {
							this.table.rows[i].className = selBackColor;
						}
						this.table.rows[this.rowIndex].className = "row_select";
					},

					/**
					 * 当已经设置了table的rowIndex后，调用这个函数，让选中那行的记录填充到对应的编辑区里面
					 * 
					 * @author chenjw
					 */
					clickRowByDefaultIndex : function() {
						for ( var i = 1; i < this.table.rows.length; i++) {
							this.table.rows[i].className = "row_even";
						}
						var row = this.table.rows[this.rowIndex];
						if (row == null || row.rowIndex == 0) {
							return;
						}
						row.className = "row_select";
						this.rowIndex = row.rowIndex;
						this.isSelected = true;
						for ( var i = 0; i < this.header.cells.length; i++) {
							var cellName = this.header.cells[i].id
									.substring("col_".length);
							var field = getElement(cellName);
							if (field != null) {
								var fieldValue = this
										.decodeCellValue(trim(row.cells[i].innerHTML));
								if (field.tagName == "INPUT"
										&& field.type != null
										&& (field.type.toUpperCase() == "CHECKBOX" || field.type
												.toUpperCase() == "RADIO")) {
									field.checked = fieldValue == field.value;
								} else if (field.tagName == "SELECT") {
									for ( var j = 0; j < field.options.length; j++) {
										if (field.options[j].value == fieldValue) {
											field.options[j].selected = true;
											break;
										}
									}
								} else {
									field.value = fieldValue;
								}
								// 下面这段代码，是特意为RadioSelect组件用的
								// 在点击一行时，要根据这行的值，确定RadioSelect组件中的哪个radio选中，哪个option选中
								if (field.getAttribute("isRadioSelect") == "true") {
									if (!getElement('col_' + cellName + '_SHOW')) {
										alert("您采用了RadioSelect组件，那么在表格里面要有"
												+ 'col_' + cellName + '_SHOW'
												+ "一列！");
										return false;
									} else {
										putValueForRadioSelect(cellName,
												fieldValue,
												this.getCurrentCell(cellName
														+ "_SHOW").innerText
														.trim());
									}
								}
							}
						}
					},

					/**
					 * 将index对应的那行记录选中，并将这行记录填充到对应的编辑区里面 效果同用鼠标点击这一行一样
					 * 
					 * @author chenjw
					 */
					selectRow : function(/* 选中那行的索引 */index) {

						for ( var i = 1; i < this.table.rows.length; i++) {
							this.table.rows[i].className = "row_even";
						}
						this.table.rows[index].className = "row_select";
						this.rowIndex = index;
						this.isSelected = true;
						this.clickRowByDefaultIndex();
					},

					rowSize : function() {
						return this.table.rows.length;
					},

					/** 取表头串* */
					/** add by fancj* */
					getHeadStr : function() {
						var strHead = "";
						var hcells = this.header.cells;
						for ( var i = 0; i < hcells.length; i++) {
							if (i == hcells.length - 1)
								strHead += hcells[i].id
										.substring("col_".length)
							else
								strHead += hcells[i].id
										.substring("col_".length)
										+ ",";
						}
						return strHead;
					},

					/** encode table */

					/** add by shiqz 2007-12-3* */

					encodeTableAcctByTag : function(headstr, strTag) {
						var str = "";
						var rowcount = 0;
						var rows = this.table.rows;
						var hcells = this.header.cells;
						var encodehead = headstr.split(",");
						for ( var i = 1; i < rows.length; i++) {
							if (this.getCell(rows[i], strTag).innerText == "")
								continue;
							var row = rows[i];
							for ( var j = 0; j < encodehead.length; j++) {
								var cell = this.getCell(row, encodehead[j]);
								if (cell == null)
									alert("column " + encodehead[j]
											+ " not found！");

								str += getStrByPadLength(
										cell.innerText.strip(), false);
							}
							rowcount++;
						}

						if (rowcount > 0)
							this.isChanged = true;

						return this.tableName.substr(0, 4)
								+ getStrByPadPrefix(rowcount)
								+ getStrByPadPrefix(encodehead.length, 3) + str;

					},

					/**
					 * insertRow WithCheckBox
					 * 
					 * @param obj
					 *            true或false。为true时，在新增一行后，保留编辑区域的值
					 * @param tagName
					 *            标识列id，帐务为X_TAG，信用为X_MANAGEMODE。默认为帐务的
					 * @author chenjuewei 2007-11-14
					 */
					insertRowWithCheckBox : function(/* 是否保留编辑区域的值 */obj, /* 标识列的id */
							tagName) {
						var tagName = tagName == null ? "X_TAG" : tagName;
						var row = this.table.insertRow(this.table.rows.length);
						var hcells = this.header.cells;
						for ( var i = 0; i < hcells.length; i++) {
							if (hcells[i].id == null
									|| !startsWith(hcells[i].id, "col_")) {
								continue;
							}
							var cell = row.insertCell(i);
							var cellName = hcells[i].id
									.substring("col_".length);
							var field = getElement(cellName);
							if (cellName == tagName) {
								this.setCellValue(hcells[i], cell, "0");
							} else {
								if (cellName == "ctrl") {
									cell.innerHTML = "<td class=\"signbj\"><input type=\"checkbox\" name=\"sches\" value=\"1\" /></td>";
								} else {
									if (field != null
											&& field.tagName.toUpperCase() == "SELECT") {
										this.setCellValue(hcells[i], cell,
												field.value);
										// at the same time, set the hidden
										// value
										if ((hcells[i + 1].id) == hcells[i].id
												+ "_SHOW") {

											cell = row.insertCell(++i);
											this
													.setCellValue(
															hcells[i],
															cell,
															field.options[field.selectedIndex].text);
										}

									} else if (field != null
											&& field.type.toUpperCase() == "CHECKBOX") {
										if (field.checked == true) {
											if (field.value == '1')
												this.setCellValue(hcells[i],
														cell, "1");
											else
												this.setCellValue(hcells[i],
														cell, "是");
										} else {
											if (field.value == '1')
												this.setCellValue(hcells[i],
														cell, "0");
											else
												this.setCellValue(hcells[i],
														cell, "否");
										}
										field.checked = false;
									} else if (field != null) {
										this.setCellValue(hcells[i], cell,
												field.value);
										if (obj == null || !obj)
											field.value = "";
									} else {
										this.setCellValue(hcells[i], cell, "");
									}
								}
							}
						}
						// 将对象滚动到可见范围内，将其排列到窗口顶部或底部
						row.scrollIntoView(false);
						return row;
					},
					/**
					 * 插入一行数据，按照参数的个数和位置，一次创建列 有多少个参数，就有多少列，少的用""代替，多的也显示
					 * 新增加的这一行的display属性和第一行一样
					 * 参数可以是字符串，也可以是String数组，函数会将所有数组和字符串拼接成一个数据
					 */
					insertRowByValues : function() {
						var arr = new Array();
						if (arguments.length <= 0) {
							throw new Error("没有参数！");
						}
						for ( var i = 0; i < arguments.length; i++) {
							if (arguments[i] instanceof Array) {
								arr = arr.concat(arguments[i]);
							} else {
								arr.push(arguments[i]);
							}
						}
						var row = this.table.insertRow(this.table.rows.length);
						var hcells = this.header.cells;
						for ( var i = 0; i < arr.length; i++) {
							var cell = row.insertCell(i);
							this.setCellValue(hcells[i], cell, arr[i]);
							// cell.innerHTML = arguments[i];
						}
						// 将对象滚动到可见范围内，将其排列到窗口顶部或底部
						row.scrollIntoView(false);
						return row;
					},
					/**
					 * 插入一行数据
					 */
					insertAllRow : function(row) {
						var a = new Array();
						for ( var j = 0; j < row.cells.length; j++) {
							a.push(row.cells[j].innerHTML.strip());
						}

						this.insertRowByValues(a);
					},

					/** update row if exists checkbox and select */
					/** add by chenjuewei 2007-11-14* */
					updateRowWithCheckBox : function(obj, /* 不用改变的列 */
							notChangeStr) {
						var row = this.table.rows[this.rowIndex];
						var hcells = this.header.cells;
						for ( var i = 0; i < hcells.length; i++) {
							if (hcells[i].id == null
									|| !startsWith(hcells[i].id, "col_")) {
								continue;
							}

							var cell = row.cells[i];
							var cellName = hcells[i].id
									.substring("col_".length);

							if (notChangeStr != null
									&& notChangeStr.indexOf("," + cellName
											+ ",") != -1) {
								if (this.getCellValue("X_TAG") != "0")
									continue;
							}

							var field = getElement(cellName);
							if (cellName == "X_TAG" && cell.innerText == "") {
								this.setCellValue(hcells[i], cell, "2");
							} else {
								if (field != null
										&& field.tagName.toUpperCase() == "SELECT") {
									this.setCellValue(hcells[i], cell,
											field.value);

									// at the same time, set the hidden value
									if ((hcells[i + 1].id) == hcells[i].id
											+ "_SHOW") {

										++i;
										var cell = row.cells[i];
										this
												.setCellValue(
														hcells[i],
														cell,
														field.options[field.selectedIndex].text);
									}

								}
								if (field != null
										&& field.type.toUpperCase() != "CHECKBOX"
										&& field.tagName.toUpperCase() != "SELECT") {
									this.setCellValue(hcells[i], cell,
											field.value);
									if (obj == null || !obj)
										field.value = "";
								}
								if (field != null
										&& field.type.toUpperCase() == "CHECKBOX") {
									if (field.checked == true) {
										if (field.value == '1')
											this.setCellValue(hcells[i], cell,
													"1");
										else
											this.setCellValue(hcells[i], cell,
													"是");
									} else {
										if (field.value == '1')
											this.setCellValue(hcells[i], cell,
													"0");
										else
											this.setCellValue(hcells[i], cell,
													"否");
									}
									if (obj == null || !obj)
										field.checked = false;
								}
							}
						}
					},

					/** del row By Row Object */
					/** add by chenjuewei 2007-11-14 * */
					deleteRowByRowObject : function(row, flag) {
						// 如果row是表头，则不进行删除，直接返回
						if (row.rowIndex == 0)
							return;

						var isDelete = true;
						var hcells = this.header.cells;
						for ( var i = 0; i < hcells.length; i++) {
							if (hcells[i].id == null
									|| !startsWith(hcells[i].id, "col_"))
								continue;

							var cell = row.cells[i];
							var cellName = hcells[i].id
									.substring("col_".length);
							var field = getElement(cellName);

							if (cellName == "X_TAG") {
								if (cell.innerText == ""
										|| cell.innerText == "2") {
									this.setCellValue(hcells[i], cell, "1");
									isDelete = false;
								}
							} else {
								if (!flag) {
									if (field != null) {
										field.value = '';
									}
								}
							}
						}

						if (isDelete) {
							this.table.deleteRow(row.rowIndex);
						} else {
							row.style.display = "none";
						}
						this.isSelected = false;
					},
					deleteRowWithCheckBox: function() {
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
								if (field != null
										&& field.type.toUpperCase() == "CHECKBOX") {
								} else if (field != null) {
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
					},
					/**
					 * 删除表格所有内容，除了标题头，这个方法没有对X_TAG进行处理，不适合于对table的编辑，只是为了清空表格
					 */
					deleteAllData : function() {
						var rows = this.table.rows;
						for ( var i = 1; i < rows.length; i++) {
							var parentNode = rows[i].parentNode;
							parentNode.removeChild(rows[i--]);
						}
					},
					/** add by LiuYi 2007-11-14 * */
					clickRowWithInnerText_PayFee : function() {
						for ( var i = 1; i < this.table.rows.length; i++) {
							this.table.rows[i].className = "row_even";
						}
						var row = getElementByTag(window.event.srcElement, "tr");
						if (row == null || row.rowIndex == 0) {
							return;
						}
						row.className = "row_select";
						this.rowIndex = row.rowIndex;
						this.isSelected = true;
						for ( var i = 0; i < this.header.cells.length; i++) {
							var cellName = this.header.cells[i].id
									.substring("col_".length);
							var field = getElement(cellName);
							if (field != null) {
								var fieldValue = this
										.decodeCellValue(trim(row.cells[i].innerText));
								if (field.tagName == "INPUT"
										&& field.type != null
										&& (field.type.toUpperCase() == "CHECKBOX" || field.type
												.toUpperCase() == "RADIO")) {
									field.checked = fieldValue == field.value;
								} else if (field.tagName == "SELECT") {
									for ( var j = 0; j < field.options.length; j++) {
										if (field.options[j].value == fieldValue) {
											field.options[j].selected = true;
											break;
										}
									}
								} else {
									field.value = fieldValue;
								}
								// 下面这段代码，是特意为RadioSelect组件用的
								// 在点击一行时，要根据这行的值，确定RadioSelect组件中的哪个radio选中，哪个option选中
								if (field.getAttribute("isRadioSelect") == "true") {
									if (!getElement('col_' + cellName + '_SHOW')) {
										alert("您采用了RadioSelect组件，那么在表格里面要有"
												+ 'col_' + cellName + '_SHOW'
												+ "一列！");
										return false;
									} else {
										putValueForRadioSelect(cellName,
												fieldValue,
												this.getCurrentCell(cellName
														+ "_SHOW").innerText
														.trim());
									}
								}
							}
						}
						if ($('cond_POINT_MONTH').checked == true)

						{

							var sn = tableedit.getCellValue("SN");// 序号
																	// 判断是不是月份欠费数据使用
							var fee = tableedit.getCellValue("X_ASPAY_FEE");
							$('cond_TRADE_FEE').value = fee;
							if (sn == '') {
								alert('用户总欠费' + tableedit
										.getCellValue("X_ASPAY_FEE") + '元');
								$('cond_MONTH_PAYYFEE_START_CYCID').value = "0";
								$('cond_MONTH_PAYYFEE_END_CYCID').value = "0";
							} else {
								
								alert('用户' + tableedit.getCellValue("CYCLE_ID")
										+ '月份欠费'
										+ tableedit.getCellValue("X_ASPAY_FEE")
										+ '元');
								$('cond_MONTH_PAYYFEE_START_CYCID').value = tableedit.getCellValue("CYCLE_ID");
								$('cond_MONTH_PAYYFEE_END_CYCID').value = tableedit.getCellValue("CYCLE_ID");
								
								//alert($('cond_MONTH_PAYYFEE_START_CYCID').value);
							}

						} else {

						}

					},

					/** click row WithInnerText */
					/** add by chenjuewei 2007-11-14 * */
					/** also support for select * */
					clickRowWithInnerText : function() {
						for ( var i = 1; i < this.table.rows.length; i++) {
							this.table.rows[i].className = "row_even";
						}
						var row = getElementByTag(window.event.srcElement, "tr");
						if (row == null || row.rowIndex == 0) {
							return;
						}
						row.className = "row_select";
						this.rowIndex = row.rowIndex;
						this.isSelected = true;
						for ( var i = 0; i < this.header.cells.length; i++) {
							var cellName = this.header.cells[i].id
									.substring("col_".length);
							var field = getElement(cellName);
							if (field != null) {
								var fieldValue = this
										.decodeCellValue(trim(row.cells[i].innerText));
								if (field.tagName == "INPUT"
										&& field.type != null
										&& (field.type.toUpperCase() == "CHECKBOX" || field.type
												.toUpperCase() == "RADIO")) {
									field.checked = fieldValue == field.value;
								} else if (field.tagName == "SELECT") {
									for ( var j = 0; j < field.options.length; j++) {
										if (field.options[j].value == fieldValue) {
											field.options[j].selected = true;
											break;
										}
									}
								} else {
									field.value = fieldValue;
								}
								// 下面这段代码，是特意为RadioSelect组件用的
								// 在点击一行时，要根据这行的值，确定RadioSelect组件中的哪个radio选中，哪个option选中
								if (field.getAttribute("isRadioSelect") == "true") {
									if (!getElement('col_' + cellName + '_SHOW')) {
										alert("您采用了RadioSelect组件，那么在表格里面要有"
												+ 'col_' + cellName + '_SHOW'
												+ "一列！");
										return false;
									} else {
										putValueForRadioSelect(cellName,
												fieldValue,
												this.getCurrentCell(cellName
														+ "_SHOW").innerText
														.trim());
									}
								}
							}
						}
					},
					/** click row WithInnerText */
					/** add by gongp 2009-12-08 * */
					/** also support for select * */
					clickRowWithInnerText_with_alert : function() {
						for ( var i = 1; i < this.table.rows.length; i++) {
							this.table.rows[i].className = "row_even";
						}
						var row = getElementByTag(window.event.srcElement, "tr");
						if (row == null || row.rowIndex == 0) {
							return;
						}
						row.className = "row_select";
						this.rowIndex = row.rowIndex;
						this.isSelected = true;
						for ( var i = 0; i < this.header.cells.length; i++) {
							var cellName = this.header.cells[i].id
									.substring("col_".length);
							var fieldValue = this
										.decodeCellValue(trim(row.cells[i].innerText));
							if(cellName == "X_DEAL_TAG"){
								if("1" != fieldValue){
									if("0" == fieldValue){
									    alert($('X_ALERT_INFO_0').value);
									    row.className = "";
										this.rowIndex = row.rowIndex;
										this.isSelected = false;
									    return;
									}else if("2" == fieldValue){
										alert($('X_ALERT_INFO_2').value);
										row.className = "row_select";
										this.isSelected = false;
										return;
									}else {
										alert(this.getCellValue("DEAL_TAG",row));
									    row.className = "";
										this.rowIndex = row.rowIndex;
										this.isSelected = false;
									    return;
									}
								}
							}
							var field = getElement(cellName);
							if (field != null) {
								
								if (field.tagName == "INPUT"
										&& field.type != null
										&& (field.type.toUpperCase() == "CHECKBOX" || field.type
												.toUpperCase() == "RADIO")) {
									field.checked = fieldValue == field.value;
								} else if (field.tagName == "SELECT") {
									for ( var j = 0; j < field.options.length; j++) {
										if (field.options[j].value == fieldValue) {
											field.options[j].selected = true;
											break;
										}
									}
								} else {
									field.value = fieldValue;
								}
								// 下面这段代码，是特意为RadioSelect组件用的
								// 在点击一行时，要根据这行的值，确定RadioSelect组件中的哪个radio选中，哪个option选中
								if (field.getAttribute("isRadioSelect") == "true") {
									if (!getElement('col_' + cellName + '_SHOW')) {
										alert("您采用了RadioSelect组件，那么在表格里面要有"
												+ 'col_' + cellName + '_SHOW'
												+ "一列！");
										return false;
									} else {
										putValueForRadioSelect(cellName,
												fieldValue,
												this.getCurrentCell(cellName
														+ "_SHOW").innerText
														.trim());
									}
								}
							}
						}
					},

					/** encode table */
	/** add by zhouwx 2009-6-18**/	
	encodeTableDepartLimit:function (headstr, cellName, cellValue) {
		var str = "";
		var rowcount = 0;
		var rows = this.table.rows;
		var hcells = this.header.cells;
		var encodehead = headstr.split(",");
		for (var i = 1; i < rows.length; i++) {
			if (cellName != null && cellValue != null) {
				if (this.getCell(rows[i], cellName).innerText.trim() != cellValue) continue;
				if (this.getCell(rows[i], cellName).firstChild==null || 
						this.getCell(rows[i], cellName).firstChild.checked == false) 
							continue;
			}
			var row = rows[i];
			for (var j = 0; j < encodehead.length; j++) {
				var cell = this.getCell(row, encodehead[j]);
				if (cell == null) {
					alert("column " + encodehead[j] + " not found\xa3\xa1");
				}
				str += getStrByPadLength(cell.innerText.trim(), false);
			}
			rowcount++;
		}
		//表示是否有数据提交
		if(rowcount > 0) this.isChanged = true;
		return this.tableName.substr(0, 4) + getStrByPadPrefix(rowcount) + getStrByPadPrefix(encodehead.length, 3) + str;
	},

					// add by weiz
					clickRowWithInnerTextEx : function() {
						for ( var i = 1; i < this.table.rows.length; i++) {
							this.table.rows[i].className = "row_even";
						}
						var row = getElementByTag(window.event.srcElement, "tr");
						if (row == null || row.rowIndex == 0) {
							return;
						}
						row.className = "row_select";
						this.rowIndex = row.rowIndex;
						this.isSelected = true;
						for ( var i = 0; i < this.header.cells.length; i++) {
							var cellName = this.header.cells[i].id
									.substring("col_".length);
							var field = getElement(cellName);
							if (field != null) {
								var fieldValue = this
										.decodeCellValue(trim(row.cells[i].innerText));
								if (field.tagName == "INPUT"
										&& field.type != null
										&& (field.type.toUpperCase() == "CHECKBOX" || field.type
												.toUpperCase() == "RADIO")) {
									field.checked = fieldValue == field.value;
								} else if (field.tagName == "SELECT") {
									for ( var j = 0; j < field.options.length; j++) {
										if (field.options[j].value == fieldValue) {
											field.options[j].selected = true;
											break;
										}
									}
								} else {
									field.value = fieldValue;
								}
								// 下面这段代码，是特意为RadioSelect组件用的
								// 在点击一行时，要根据这行的值，确定RadioSelect组件中的哪个radio选中，哪个option选中
								if (field.getAttribute("isRadioSelect") == "true") {
									if (!getElement('col_' + cellName + '_SHOW')) {
										alert("您采用了RadioSelect组件，那么在表格里面要有"
												+ 'col_' + cellName + '_SHOW'
												+ "一列！");
										return false;
									} else {
										putValueForRadioSelect(cellName,
												fieldValue,
												this.getCurrentCell(cellName
														+ "_SHOW").innerText
														.trim());
									}
								}
							}
						}
						ajaxdo('linkExample', '&policyType='
								+ getElement('TYPE').value + '&contentValue='
								+ getElement('CONTENT').value);
					},

					/** table all * */
					/** add for mengfanli 2007-11-14 * */
					/**
					 * 如果没有cellName,cellValue参数，那么就是把所有记录都提交到后台
					 * 如果cellName,cellValue都有，那么就是将cellName这一列的内容等于cellValue的行，编码传到后台
					 * modified by chenjuewei 2008-07-10
					 */
					encodeTable1 : function(headstr, cellName, cellValue) {
						var str = "";
						var rowcount = 0;
						var rows = this.table.rows;
						var hcells = this.header.cells;
						var encodehead = headstr.split(",");
						for ( var i = 1; i < rows.length; i++) {
							if (cellName != null && cellValue != null) {
								if (this.getCell(rows[i], cellName).innerText
										.trim() != cellValue)
									continue;
							}
							var row = rows[i];
							for ( var j = 0; j < encodehead.length; j++) {
								var cell = this.getCell(row, encodehead[j]);
								if (cell == null) {
									alert("column " + encodehead[j]
											+ " not found\xa3\xa1");
								}
								str += getStrByPadLength(cell.innerText.trim(),
										false);
							}
							rowcount++;
						}
						// modified by chenjuewei 2008-07-10
						// 表示是否有数据提交
						if (rowcount > 0)
							this.isChanged = true;
						return this.tableName.substr(0, 4)
								+ getStrByPadPrefix(rowcount)
								+ getStrByPadPrefix(encodehead.length, 3) + str;
					},

					/** encode table */
					/** add by wuwei 2007-12-3* */
					encodeTableAcct : function(headstr) {
						var str = "";
						var rowcount = 0;
						var rows = this.table.rows;
						var hcells = this.header.cells;
						var encodehead = headstr.split(",");

						for ( var i = 1; i < rows.length; i++) {
							if (this.getCell(rows[i], "X_TAG").innerText == "")
								continue;

							var row = rows[i];
							for ( var j = 0; j < encodehead.length; j++) {
								var cell = this.getCell(row, encodehead[j]);
								if (cell == null)
									alert("column " + encodehead[j]
											+ " not found！");

								str += getStrByPadLength(
										cell.innerText.strip(), false);
							}

							rowcount++;
						}
						if (rowcount > 0)
							this.isChanged = true;
						return this.tableName.substr(0, 4)
								+ getStrByPadPrefix(rowcount)
								+ getStrByPadPrefix(encodehead.length, 3) + str;
					},

					/** encode table wangfeng add */
					/** add by wuwei 2008-12-30* */
					encodeTableAcctwf : function(headstr) {
						var str = "";
						var rowcount = 0;
						var rows = this.table.rows;
						var hcells = this.header.cells;
						var encodehead = headstr.split(",");

						for ( var i = 1; i < rows.length; i++) {
							if (this.getCell(rows[i], "X_TAG").innerText == "0")
								continue;

							var row = rows[i];
							for ( var j = 0; j < encodehead.length; j++) {
								var cell = this.getCell(row, encodehead[j]);
								if (cell == null)
									alert("column " + encodehead[j]
											+ " not found！");

								str += getStrByPadLength(
										cell.innerText.strip(), false);
							}

							rowcount++;
						}
						if (rowcount > 0)
							this.isChanged = true;
						return this.tableName.substr(0, 4)
								+ getStrByPadPrefix(rowcount)
								+ getStrByPadPrefix(encodehead.length, 3) + str;
					},
					/** encode table 添加列导出时候导出选择的状态*/
					/** add by liuyi 2009-10-19* */
					encodeTableAcct2 : function(headstr) {
						var str = "";
						var rowcount = 0;
						var rows = this.table.rows;
						var hcells = this.header.cells;
						var encodehead = headstr.split(",");
						for ( var i = 1; i < rows.length; i++) {
							if (this.getCell(rows[i], "FILTER_TAG").firstChild.checked == false) {
								
								this.getCell(rows[i], "FILTER_STATE").innerText='未选择';
							
							}else if(this.getCell(rows[i], "FILTER_TAG").firstChild.checked == true)
							{
								this.getCell(rows[i], "FILTER_STATE").innerText='选择';
							}
							else{
								this.getCell(rows[i], "FILTER_STATE").innerText='未知';
							}
							var row = rows[i];
							for ( var j = 0; j < encodehead.length; j++) {
								var cell = this.getCell(row, encodehead[j]);
								if (cell == null)
									alert("column " + encodehead[j]
											+ " not found！");

								str += getStrByPadLength(
										cell.innerText.strip(), false);
							}

							rowcount++;
						}

						if (rowcount > 0)
							this.isChanged = true;
						return this.tableName.substr(0, 4)
								+ getStrByPadPrefix(rowcount)
								+ getStrByPadPrefix(encodehead.length, 3) + str;
					},

					/** encode table */
					/** add by gaoj 2007-12-25* */
					encodeTableAcct1 : function(headstr) {
						var str = "";
						var rowcount = 0;
						var rows = this.table.rows;
						var hcells = this.header.cells;
						var encodehead = headstr.split(",");

						for ( var i = 1; i < rows.length; i++) {
							if (this.getCell(rows[i], "FILTER_TAG").firstChild == null
									|| this.getCell(rows[i], "FILTER_TAG").firstChild.checked == false)
								continue;

							var row = rows[i];
							for ( var j = 0; j < encodehead.length; j++) {
								var cell = this.getCell(row, encodehead[j]);
								if (cell == null)
									alert("column " + encodehead[j]
											+ " not found！");

								str += getStrByPadLength(
										cell.innerText.strip(), false);
							}

							rowcount++;
						}

						if (rowcount > 0)
							this.isChanged = true;
						return this.tableName.substr(0, 4)
								+ getStrByPadPrefix(rowcount)
								+ getStrByPadPrefix(encodehead.length, 3) + str;
					},

					/**
					 * 只编码选中的那行记录，如果一行都没有选中，那么就是第一行
					 */
					encodeTableJustSelected : function(headstr) {
						var str = "";
						var rowcount = 1;
						var rows = this.table.rows;
						var hcells = this.header.cells;
						var encodehead = headstr.split(",");
						this.rowIndex = this.rowIndex == 0 ? 1 : this.rowIndex;
						var row = rows[this.rowIndex];
						for ( var j = 0; j < encodehead.length; j++) {
							var cell = this.getCell(row, encodehead[j]);
							if (cell == null) {
								alert("column " + encodehead[j]
										+ " not found\xa3\xa1");
							}

							str += getStrByPadLength(cell.innerText.strip(),
									false);
						}
						return this.tableName.substr(0, 4)
								+ getStrByPadPrefix(rowcount)
								+ getStrByPadPrefix(encodehead.length, 3) + str;
					},
					/** trigger cell */
					triggerCell1 : function(cellName, cellValue) {
						var row = getElementByTag(window.event.srcElement, "tr");
						var cell = this.getCell(row, cellName);
						cell.innerHTML = cellValue;
					},

					triggerCellByDefaultIndex : function(cellName, cellValue) {
						var row = this.table.rows[this.rowIndex];
						var cell = this.getCell(row, cellName);
						var x_tag = this.getCell(row, "X_TAG");

						cell.innerHTML = cellValue;
						if (x_tag.innerHTML == "") {
							x_tag.innerHTML = "2";
						}
					},
					/** click row with select */
					/** add by chenjuewei 2007-11-14 * */
					/** add support for select * */
					clickRowWithSelect : function() {
						for ( var i = 1; i < this.table.rows.length; i++) {
							this.table.rows[i].className = "row_even";
						}
						var row = getElementByTag(window.event.srcElement, "tr");
						if (row == null || row.rowIndex == 0) {
							return;
						}
						row.className = "row_select";
						this.rowIndex = row.rowIndex;
						this.isSelected = true;
						for ( var i = 0; i < this.header.cells.length; i++) {
							var cellName = this.header.cells[i].id
									.substring("col_".length);
							var field = getElement(cellName);
							if (field != null) {
								var fieldValue = this
										.decodeCellValue(trim(row.cells[i].innerHTML));
								if (field.tagName == "INPUT"
										&& field.type != null
										&& (field.type.toUpperCase() == "CHECKBOX" || field.type
												.toUpperCase() == "RADIO")) {
									field.checked = fieldValue == field.value;
								} else if (field.tagName == "SELECT") {
									for ( var j = 0; j < field.options.length; j++) {
										if (field.options[j].value == fieldValue) {
											field.options[j].selected = true;
											break;
										}
									}
								} else {
									field.value = fieldValue;
								}
								// 下面这段代码，是特意为RadioSelect组件用的
								// 在点击一行时，要根据这行的值，确定RadioSelect组件中的哪个radio选中，哪个option选中
								if (field.getAttribute("isRadioSelect") == "true") {
									if (!getElement('col_' + cellName + '_SHOW')) {
										alert("您采用了RadioSelect组件，那么在表格里面要有"
												+ 'col_' + cellName + '_SHOW'
												+ "一列！");
										return false;
									} else {
										putValueForRadioSelect(cellName,
												fieldValue,
												this.getCurrentCell(cellName
														+ "_SHOW").innerText
														.trim());
									}
								}
							}
						}
					},
					/**
					 * 根据列名，得到这一列是哪一列 ，第1列？还是第2列等。
					 * 
					 * @author chenjw
					 */
					getCellIndex : function(cellName) {
						var hcells = this.header.cells;
						var rows = this.table.rows;
						var row = rows[0];
						for ( var i = 0; i < hcells.length; i++) {
							var cell = row.cells[i];
							if (hcells[i].id == "col_" + cellName)
								return i;
						}
						return -1;
					},
					/**
					 * 返回某一行某一个单元格的值，如果没有指定某一行，那么就是选中的那一行 如果一行也没有选中，抛出异常
					 */
					getCellValue : function(cellName, row) {
						var cell = this.getCurrentCell(cellName, row);
						if (cell.firstChild
								&& cell.firstChild.tagName
								&& cell.firstChild.tagName.toUpperCase() == "INPUT") {
							if (cell.firstChild.type.toUpperCase() == "RADIO"
									|| cell.firstChild.type.toUpperCase() == "CHECKBOX") {
								return cell.firstChild.checked;
							} else {
								return cell.firstChild.value.strip();
							}
						}
						return cell.innerText.strip();
					},

					/**
					 * 根据cellName这一列的值，来确定某一行，
					 * 如果某一行的cellName这一列的值，同cellValue相等，那么返回这一行，如果有多行相等，则返回最上面的那一行。
					 */
					getRowByCellValue : function(cellName, cellValue) {
						for ( var i = 1; i < this.table.rows.length; i++) {
							var row = this.table.rows[i];
							var nowValue = this.getCellValue(cellName, row);
							if (nowValue == cellValue) {
								return row;
							}
						}
						return null;
					},
					/**
					 * 返回第一行某一个单元格的值，如果表格是空的，则抛出异常
					 */
					getFirstRowCellValue : function(/* 单元格名称 */cellName) {
						if (this.table.rows.length <= 1) {
							return 0;
						}
						return this.getCellValue(cellName, this.table.rows[1]);
					},
					/**
					 * 返回最后一行某一个单元格的值，如果表格是空的，则抛出异常
					 */
					getLastRowCellValue : function(/* 单元格名称 */cellName) {
						if (this.table.rows.length <= 1) {
							return 0;
						}
						return this.getCellValue(cellName,
								this.table.rows[this.table.rows.length - 1]);
					},
					/**
					 * 返回当前选中行的某一列单元格,如果没有指定某一行，那么就是选中的那一行
					 */
					getCurrentCell : function(cellName, row) {
						var i = row ? row.rowIndex : this.rowIndex;
						if (i <= 0) {
							throw new Error("请选中一条记录！");
						}
						var cell = this.getCell(this.table.rows[i], cellName);
						return cell;
					},
					/**
					 * 根据列名，选出选中的那几行的这几个单元格
					 */
					getCellsByNameAndChecked : function(cellName, checkBoxName) {
						var arr = new Array();
						var rows = this.table.rows;
						var index = this.getCellIndex(cellName);
						var indexC = this.getCellIndex(checkBoxName);
						for ( var i = 1; i < rows.length; i++) {
							var cellC = rows[i].cells[indexC];
							var cell = rows[i].cells[index];
							if (cellC.firstChild != null
									&& cellC.firstChild.tagName != null
									&& cellC.firstChild.tagName.toUpperCase() == "INPUT"
									&& cellC.firstChild.type.toUpperCase() == "CHECKBOX") {
								if (cellC.firstChild.checked)
									arr.push(cell);
							}
						}
						return arr;
					},
					/**
					 * 将某一列的内容都改为指定的值，如果没有指定，那么就是"" 不包括表格的题头 如果某一列是
					 * col_SN，那么当某一行的col_SN列内容为“”的时候，不进行changeValue操作
					 * 主要是为了针对“合计”这样的行
					 */
					changeColumnValue : function(cellName, value) {
						var v = value ? value : "";
						var index = this.getCellIndex(cellName);
						var rows = this.table.rows;
						for ( var i = 1; i < rows.length; i++) {
							var cell = rows[i].cells[index];
							// alert(rows[i].cells[this.getCellIndex('SN')].innerHTML.length+"，是否为空："+(rows[i].cells[this.getCellIndex('SN')].innerHTML.strip()==""));

							if (cell.firstChild != null
									&& cell.firstChild.tagName != null
									&& cell.firstChild.tagName.toUpperCase() == "INPUT") {
								cell.firstChild.value = value;
							} else if (this.getCellIndex('SN') != -1
									&& rows[i].cells[this.getCellIndex('SN')].innerHTML
											.strip() == "") {

							} else {
								cell.innerHTML = value;
							}
						}
					},
					/**
					 * 将cellName2的内容，原样按照一行一行的形式，付给 cellName1
					 */
					copyColumn : function(cellName1, cellName2) {
						var index1 = this.getCellIndex(cellName1);
						var index2 = this.getCellIndex(cellName2);
						var rows = this.table.rows;
						for ( var i = 1; i < rows.length; i++) {
							var cell1 = rows[i].cells[index1];
							var cell2 = rows[i].cells[index2];
							cell1.innerHTML = cell2.innerHTML;
						}
					},
					/**
					 * 将cellName2的内容，原样按照一行一行的形式，付给
					 * cellName1,针对cellName1列是文本框的情况
					 */
					copyColumnValue : function(cellName1, cellName2) {
						var index1 = this.getCellIndex(cellName1);
						var index2 = this.getCellIndex(cellName2);
						var rows = this.table.rows;
						for ( var i = 1; i < rows.length; i++) {
							var cell1 = rows[i].cells[index1];
							var cell2 = rows[i].cells[index2];
							if (cell1.firstChild != null
									&& cell1.firstChild.tagName != null
									&& cell1.firstChild.tagName.toUpperCase() == "INPUT") {
								cell1.firstChild.value = cell2.innerText;
							}
						}
					},
					/**
					 * 修改指定列的题头
					 */
					changeColumnTitle : function(cellName, value) {
						var v = value ? value : "";
						var index = this.getCellIndex(cellName);
						var row = this.header;
						var cell = row.cells[index];
						cell.innerHTML = value;
					},
					/**
					 * 隐藏具体的某一列
					 * 
					 * @author chenjw
					 */
					hideColumn : function(cellName) {
						var index = this.getCellIndex(cellName);
						var rows = this.table.rows;
						for ( var i = 0; i < rows.length; i++) {
							var cell = rows[i].cells[index];
							cell.style.display = "none";
						}
					},

					/**
					 * 隐藏所有数据
					 */
					hideAllData : function() {
						var rows = this.table.rows;
						for ( var i = 1; i < rows.length; i++) {
							rows[i].style.display = 'none';
						}
					},
					/**
					 * 显示某一列
					 * 
					 * @author chenjw
					 */
					showColumn : function(cellName) {
						var index = this.getCellIndex(cellName);
						var rows = this.table.rows;
						for ( var i = 0; i < rows.length; i++) {
							var cell = rows[i].cells[index];
							cell.style.display = "block";
						}
					},
					/**
					 * 是否表格内所有记录都被隐藏了
					 */
					isAllDataHide : function() {
						var rows = this.table.rows;
						for ( var i = 1; i < rows.length; i++) {
							if (rows[i].style.display != 'none') {
								return false;
							}
						}
						return true;
					},
					/**
					 * 判断表格是否有数据，隐藏的也算有数据
					 */
					isEmpty : function() {
						if (this.table.rows.length <= 1) {
							return true;
						}
						return false;
					},
					/**
					 * 将本单元格内文本框的记录，放到指定col_id的同一行单元格内
					 */
					checkTradeFeeAndTrigger : function(obj/*文本框对象*/,cellId/*指定的单元格id*/){
						var tradeFee = obj.value.trim();
					    if (tradeFee == "" || tradeFee =="0.00" || parseFloat(tradeFee) == 0)
						{
						      obj.value = "0.00";
						      this.triggerCell(cellId, obj.value);
						      return false;
						} 
						if (!isMoney(tradeFee))
						{
						    alert("交费金额输入格式错误或含有非法字符！");
						    obj.value = "0.00";
						    this.triggerCell(cellId, obj.value);
						    return false;
						}
						if (Math.abs(parseFloat(tradeFee)* 100) < 1) 
						{
						      alert('交费金额必须大于等于0.01元!');
						      obj.value = "0.00";
						      this.triggerCell(cellId, obj.value);
						      return false;    
						}
						if (parseFloat(tradeFee)>parseFloat(obj.maxValue)) {
							alert("金额不能大于申请金额~！");
							obj.value = obj.maxValue;
							return false;
						}
					   obj.value = formatRatio(tradeFee,0);
					   
					   this.triggerCell(cellId, obj.value); 
					}
				});
/**
 * 为RadioSelect组件所用 确定RadioSelect组件中的哪个radio选中，哪个option选中
 * 
 * @param name
 * @param value
 * @author chenjuewei
 */
function putValueForRadioSelect(/* 组件的id */name, /* 该组件的值 */value,/* label中文的内容 */
		labelValue) {
	var radios = document.getElementsByName(name + "_RADIO");
	var selectObj = $(name + "_SELECT");
	var ops = selectObj.options;
	var tempValue = parseInt(value);
	// 因为有可能有多行的value一样，所以还要查看下label
	var tempOpsV;
	for ( var i = 0; i < ops.length; i++) {
		tempOpsV = parseInt(ops[i].value);
		if (tempOpsV == tempValue - 1 && labelValue == "大于" + ops[i].text) {
			radios[0].checked = true;
			ops[i].selected = true;
			return;
		} else if (tempOpsV == tempValue && labelValue == "等于" + ops[i].text) {
			radios[1].checked = true;
			ops[i].selected = true;
			return;
		} else if (tempOpsV == tempValue + 1
				&& labelValue == "小于" + ops[i].text) {
			radios[2].checked = true;
			ops[i].selected = true;
			return;
		}
	}
	radios[0].checked = false;
	radios[1].checked = false;
	radios[2].checked = false;
}
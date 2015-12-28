var expect = require('expect.js');
var xlsx = require('xlsx');
var path = require('path');

describe('XLSX lib study', function() {
	it('lib is ready.', function() {
		expect(xlsx.readFile).to.be.an(Function);
	});
	it('read and parse xlsx file', function() {
		var workBook = xlsx.readFile(path.join(__dirname,'customer.xlsx'));
		var sheetName = workBook.SheetNames[0];
		var workSheet = workBook.Sheets[sheetName];
		var cell = workSheet['A1'];
		expect(cell.v).to.be.equal('name');
		expect(workSheet['A2'].v).to.be.equal('张三');
	});
	it('XLSX.utils.sheet_to_json()', function() {
		var workBook = xlsx.readFile(path.join(__dirname,'customer.xlsx'));
		var sheetName = workBook.SheetNames[0];
		var workSheet = workBook.Sheets[sheetName];
		expect(workSheet['A1'].v).to.be.equal('name');//raw value (see Data Types section for more info)
		expect(workSheet['A1'].t).to.be.equal('s');//cell type: b Boolean, n Number, e error, s String, d Date
		expect(workSheet['A1'].r).to.be.equal('<t>name</t><phoneticPr fontId="1" type="noConversion"/>');//rich text encoding (if applicable)
		expect(workSheet['A1'].h).to.be.equal('name');//HTML rendering of the rich text (if applicable)
		expect(workSheet['A1'].w).to.be.equal('name');//formatted text (if applicable)
		var json = xlsx.utils.sheet_to_json(workSheet);
		// console.log(json)
	});
	it('XLSX.write()',function(){
		var workBook = xlsx.readFile(path.join(__dirname,'customer.xlsx'));
		var sheetName = workBook.SheetNames[0];
		var workSheet = workBook.Sheets[sheetName];
		console.log(workSheet)
		var json = xlsx.utils.sheet_to_json(workSheet);
		xlsx.writeFile(workBook,path.join(__dirname,'customer_o.xlsx'));
	});
});
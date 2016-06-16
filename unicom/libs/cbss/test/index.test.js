var expect = require('expect.js');
var cbss = require('../index');

describe('CBSS 功能：', function() {
	it('.getAccountCities()', function() {
		var accounts = require('../../../config/cbss').accounts;
		var cities = cbss.getAccountCities(accounts);
		console.log(cities);
	});
	it('.getAccountByCity()', function() {
		var accounts = require('../../../config/cbss').accounts;
		var account = cbss.getAccountByCity(accounts,'贵阳');
		console.log(account);
	});
});

exports.login = require('./lib/login');
exports.refreshCookie = require('./lib/cookie');
exports.orderFlux = require('./lib/order.flux');

var escapeRegExp = function(str) { 
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); 
};

exports.getAccountCities = function(accounts){
	accounts = (accounts instanceof Array) ? accounts : [accounts];
	var cities = [];
	accounts.forEach(function(account){
		if(account.city) cities.push((account.city).trim());
	});
	return cities;
};

exports.getAccountByCity = function(accounts, city){
	accounts = (accounts instanceof Array) ? accounts : [accounts || {}];
	var acc;
	accounts.forEach(function(account){
		var cityRegex = new RegExp(escapeRegExp((account.city).trim()));
		if(cityRegex.test(city)){
			acc = account;
		}
	});
	return (acc || {});	
};

module.exports = exports;
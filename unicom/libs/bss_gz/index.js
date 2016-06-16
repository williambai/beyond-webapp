/**
 * 贵州联通BSS接口
 * @type {[type]}
 */
exports.getUserInfo = require('./lib/getUserInfo');
exports.getOrders = require('./lib/getOrders');
exports.addOrder = require('./lib/addOrder');
exports.removeOrder = require('./lib/removeOrder');

var _ = require('underscore');

/**
 * 获取BSS访问URL地址
 * @param  {String} mode 运行模式
 * mode = prod: 生成环境
 * mode = test: 开发测试环境
 * @return {String}      url
 */
exports.getBssUrl = function(mode){
	var bssConfig = require('../../config/bss');
	if(mode == 'prod'){
		return bssConfig.url;
	}else{
		return bssConfig.url_test;
	}
};
//** 获取BSS账户信息
exports.getAccountByCity = function(city){
	var bssAccounts = require('../../config/bss').accounts || [];
	var account = _.find(bssAccounts, function(acc){
			if(acc.status == '有效'){
				var regex = new RegExp((acc.city).trim() || '未知');
				return regex.test(city);
			}else{
				return false;
			}
		});
	return (account || {});
};

//** 获取城市列表
exports.getAccountCities = function(){
	var bssAccounts = require('../../config/bss').accounts || [];
	var cities = [];
	bssAccounts.forEach(function(account){
		if(account.city && account.status == '有效') cities.push((account.city).trim());
	});
	return cities;
};

module.exports = exports;

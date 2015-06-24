var config = require('../config/weixin');
var mpApi = require('../libs/weixin_api').mpApi;
var path = require('path');
var async = require('async');
var jf = require('jsonfile');

async.waterfall(
	[
		//更新菜单
		function(callback){
			var menu = jf.readFileSync(path.join(__dirname,'./weixin/menu.json'));
			mpApi.createMenu(menu,callback);
		},
		// 新增素材
		// function(callback){
		// 	var about_us = jf.readFileSync(path.join(__dirname,'./weixin/about_us.json'));
		// 	mpApi.uploadNewsMaterial(about_us,callback);
		// }
	]
	,function _result(err,results){
		if(err){
			console.log(err);
			return;
		}
		console.log(results);
	}
);

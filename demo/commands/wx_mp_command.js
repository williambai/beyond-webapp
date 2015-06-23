var config = require('../config/weixin');
var mpApi = require('../libs/weixin_api').mpApi;
var async = require('async');

var menu = require('./weixin/menu');

async.waterfall(
	[
		//更新菜单
		function(callback){
			mpApi.createMenu(menu,callback);
		},
	]
	,function _result(err,results){
		if(err){
			console.log(err);
			return;
		}
		console.log(results);
	}
);

var config = require('../config/weixin');
var qyApi = require('../libs/weixin_api').qyApi;
var async = require('async');

var menu = require('./weixin/menu');

async.waterfall(
	[
		//更新菜单
		function(callback){
			qyApi.createMenu(menu,callback);
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

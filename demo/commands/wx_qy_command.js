var path = require('path');
var config = require('../config/weixin');
var qyApi = require('../libs/weixin_api').qyApi;
var async = require('async');

var menu = require('./weixin/menu');

async.waterfall(
	[
		//获取永久素材
		function(callback){
			qyApi.uploadMedia(path.join(__dirname,'../public/upload/1433476308259.png'),'image',function(err,result){
				if(err){
					callback(err);
					return;
				}
				fs.writeFileSync(path.join(__dirname,'./weixin/upload_media_image.json'));
				callback(null,result);
			});
		},
		//更新菜单
		// function(callback){
		// 	qyApi.createMenu(menu,callback);
		// },
	]
	,function _result(err,results){
		if(err){
			console.log(err);
			return;
		}
		console.log(results);
	}
);

var _ = require('underscore');

var config = require('../../../conf');

_.extend(config,{
	app: {
		name: '渠道销售移动客户端',
		nickname: 'channel',
		description: '',
	},
	menu: [{
		"id": 1,
		"name": "首页",
		"hash": "index",
		"features": [],
	},{
		"id": 2,
		"name": "热门产品",
		"hash": "product/hots",
		"features": [],
	},{
		"id": 3,
		"name": "所有产品",
		"hash": "category/index",
		"features": [],
	},{
	// 	"id": 4,
	// 	"name": "内容推荐",
	// 	"hash": "push/index",
	// 	"features": [],
	// },{
	// 	"id": 5,
	// 	"name": "号卡产品",
	// 	"hash": "card/index",
	// 	"features": [],
	// },{
	// 	"id": 6,
	// 	"name": "销售记录",
	// 	"hash": "order/index",
	// 	"features": [],
	// },{
		"id": 7,
		"name": "销售线索",
		"hash": "sale/lead/index",
		"features": [],
	},{
		"id": 8,
		"name": "我的客户",
		"hash": "customer/index",
		"features": [],
	},{
		"id": 9,
		"name": "个人中心",
		"hash": "me/index",
		"features": [],
	},{
		"id": 11,
		"name": "帮助中心",
		"hash": "help/index",
		"features": [],
	},{
		"id": 12,
		"name": "同事圈",
		"hash": "activity/index",
		"features": [],
	},{
		"id": 13,
		"name": "我的资料",
		"hash": "profile/me",
		"features": [],
	}]	
});

exports = module.exports = config;
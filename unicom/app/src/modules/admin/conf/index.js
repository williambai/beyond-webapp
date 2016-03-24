var _ = require('underscore');

var config = require('../../../conf');

_.extend(config,{
	
	app: {
		name: '管理后台',
		nickname: 'admin',
		description: '',
	},

	menu: [{
		"id": 1,
		"name": "首页",
		"hash": "index",
		"features": [],
	}, {
		"id": 2,
		"name": "产品管理",
		"hash": "product/direct/index",
		"features": ["product_direct"],
	// }, {
	// 	"id": 2,
	// 	"name": "号卡产品管理",
	// 	"hash": "product/card/package/index",
	// 	"features": ["product_card_package"],
	// }, {
	// 	"id": 2,
	// 	"name": "终端产品管理",
	// 	"hash": "product/phone/index",
	// 	"features": ["product_phone"],
	// }, {
	// 	"id": 2,
	// 	"name": "号卡管理",
	// 	"hash": "product/card/index",
	// 	"features": ["product_card"],
	}, {
		"id": 2,
		"name": "客户管理",
		"hash": "customer/index",
		"features": ["customer"],
	}, {
		"id": 2,
		"name": "订单管理",
		"hash": "order/index",
		"features": ["admin_order"],
	}, {
		"id": 2,
		"name": "用户管理",
		"hash": "account/index",
		"features": ["platform_account"],
	}, {
		"id": 2,
		"name": "金币管理",
		"hash": "revenue/index",
		"features": ["revenue"],
	}, {
		"id": 2,
		"name": "角色管理",
		"hash": "role/index",
		"features": ["platform_role"],
	}, {
		"id": 2,
		"name": "物料管理",
		"hash": "goods/index",
		"features": ["goods"],
	}, {
		"id": 2,
		"name": "营业厅管理",
		"hash": "department/index",
		"features": ["department"],
	}, {
	// 	"id": 2,
	// 	"name": "客户端功能设置",
	// 	"hash": "channel/category/index",
	// 	"features": ["channel_category"],
	// }, {
		"id": 2,
		"name": "媒体文件管理",
		"hash": "media/index",
		"features": ["media"],
	}, {
		"id": 2,
		"name": "首页轮播管理",
		"hash": "carousel/index",
		"features": ["carousel"],
	}, {
	// 	"id": 2,
	// 	"name": "静态网页管理",
	// 	"hash": "page/static/index",
	// 	"features": ["platform_page"],
	// }, {
	// 	"id": 2,
	// 	"name": "动态网页管理",
	// 	"hash": "page/dynamic/index",
	// 	"features": ["platform_page"],
	// }, {
		"id": 2,
		"name": "用户反馈",
		"hash": "feedback/index",
		"features": ["platform_feedback"],
	}, {
		"id": 2,
		"name": "我的资料",
		"hash": "profile/me",
		"features": ["account"],
	}]
});

exports = module.exports = config;
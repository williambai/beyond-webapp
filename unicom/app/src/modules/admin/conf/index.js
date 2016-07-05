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
		"features": ["protect_product_direct"],
	}, {
		"id": 2,
		"name": "订单管理",
		"hash": "order/index",
		"features": ["protect_order"],
	}, {
		"id": 2,
		"name": "用户管理",
		"hash": "account/index",
		"features": ["protect_account","protect_role","protect_app"],
	}, {
		"id": 2,
		"name": "佣金管理",
		"hash": "bonus/index",
		"features": ["protect_finance_bonus"],
	}, {
		"id": 2,
		"name": "SMS管理",
		"hash": "sms/index",
		"features": ["protect_sms"],
	}, {
		"id": 2,
		"name": "银行卡管理",
		"hash": "bank/index",
		"features": ["protect_finance_bank"],
	}, {
		"id": 2,
		"name": "统计管理",
		"hash": "stats/index",
		"features": [],
	}, {
		"id": 2,
		"name": "物料管理",
		"hash": "goods/index",
		"features": ["protect_goods"],
	}, {
		"id": 2,
		"name": "渠道管理",
		"hash": "department/index",
		"features": ["protect_department"],
	}, {
	// 	"id": 2,
	// 	"name": "客户端功能设置",
	// 	"hash": "channel/category/index",
	// 	"features": ["protect_channel_category"],
	// }, {
		"id": 2,
		"name": "媒体文件管理",
		"hash": "media/index",
		"features": ["protect_media"],
	}, {
		"id": 2,
		"name": "首页轮播管理",
		"hash": "carousel/index",
		"features": ["protect_carousel"],
	}, {
	// 	"id": 2,
	// 	"name": "静态网页管理",
	// 	"hash": "page/static/index",
	// 	"features": ["pretect_page"],
	// }, {
	// 	"id": 2,
	// 	"name": "动态网页管理",
	// 	"hash": "page/dynamic/index",
	// 	"features": ["pretect_page"],
	// }, {
		"id": 2,
		"name": "用户反馈",
		"hash": "feedback/index",
		"features": [],
	}, {
	// 	"id": 2,
	// 	"name": "终端产品管理",
	// 	"hash": "product/phone/index",
	// 	"features": ["product_phone"],
	// }, {
	// 	"id": 2,
	// 	"name": "号卡管理",
	// 	"hash": "product/card/index",
	// 	"features": ["product_card"],
	// }, {
	// 	"id": 2,
	// 	"name": "客户管理",
	// 	"hash": "customer/index",
	// 	"features": ["protect_customer"],
	// }, {
		"id": 2,
		"name": "我的资料",
		"hash": "profile/me",
		"features": [],
	}]
});

exports = module.exports = config;
var _ = require('underscore');

var config = require('../../../conf');

_.extend(config,{
	app: {
		name: '系统管理员',
		nickname: 'superadmin',
		description: '',
	},
	menu: [{
		"id": 1,
		"name": "首页",
		"hash": "index",
		"features": [],
	}, {
		"id": 2,
		"name": "资源管理",
		"hash": "feature/index",
		"features": ["protect_feature"],
	}, {
		"id": 2,
		"name": "应用管理",
		"hash": "app/index",
		"features": ["protect_app"],
	}, {
		"id": 2,
		"name": "角色管理",
		"hash": "role/index",
		"features": ["protect_role"],
	}, {
		"id": 2,
		"name": "用户管理",
		"hash": "account/index",
		"features": ["protect_account","protect_role","protect_app"],
	}, {
		"id": 2,
		"name": "会话管理",
		"hash": "session/index",
		"features": ["protect_session"],
	}, {
		"id": 2,
		"name": "CBSS账户管理",
		"hash": "cbss/account/index",
		"features": ["protect_cbss_account"],
	}, {
		"id": 2,
		"name": "微信客户管理",
		"hash": "wechat/customer/index",
		"features": ["protect_wechat_customer"],
	}, {
		"id": 2,
		"name": "微信设置",
		"hash": "wechat/index",
		"features": ["protect_wechat","protect_wechat_menu"],
	}, {
		"id": 2,
		"name": "运营监控",
		"hash": "monitor/index",
		"features": ["protect_monitor"],
	}, {
		"id": 2,
		"name": "文件管理",
		"hash": "file/index",
		"features": ["protect_file"],
	}, {
		"id": 2,
		"name": "数据维护",
		"hash": "database/index",
		"features": ["protect_database"],
	}, {
		"id": 2,
		"name": "我的资料",
		"hash": "profile/me",
		"features": [],
	}]
});

exports = module.exports = config;
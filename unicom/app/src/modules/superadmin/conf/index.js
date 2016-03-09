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
		"features": ["platform_feature"],
	}, {
		"id": 2,
		"name": "应用管理",
		"hash": "app/index",
		"features": ["platform_app"],
	}, {
		"id": 2,
		"name": "权限管理",
		"hash": "role/index",
		"features": ["platform_role"],
	}, {
		"id": 2,
		"name": "用户管理",
		"hash": "account/index",
		"features": ["platform_account"],
	}, {
		"id": 2,
		"name": "会话管理",
		"hash": "session/index",
		"features": ["platform_session"],
	}, {
		"id": 2,
		"name": "CBSS账户管理",
		"hash": "cbss/account/index",
		"features": ["cbss_account"],
	}, {
		"id": 2,
		"name": "SMS管理",
		"hash": "sms/index",
		"features": ["platform_sms"],
	}, {
		"id": 2,
		"name": "微信客户管理",
		"hash": "wechat/customer/index",
		"features": ["platform_wechat_customer"],
	}, {
		"id": 2,
		"name": "微信设置",
		"hash": "wechat/index",
		"features": ["platform_wechat"],
	}, {
		"id": 2,
		"name": "运营监控",
		"hash": "monitor/index",
		"features": ["platform_monitor"],
	}, {
		"id": 2,
		"name": "文件管理",
		"hash": "file/index",
		"features": ["platform_database"],
	}, {
		"id": 2,
		"name": "数据维护",
		"hash": "database/index",
		"features": ["platform_database"],
	}, {
		"id": 2,
		"name": "我的资料",
		"hash": "profile/me",
		"features": ["account"],
	}]
});

exports = module.exports = config;
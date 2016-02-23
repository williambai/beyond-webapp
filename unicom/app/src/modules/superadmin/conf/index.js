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
		"name": "功能管理",
		"hash": "feature/index",
		"features": [],
	}, {
		"id": 2,
		"name": "应用管理",
		"hash": "app/index",
		"features": [],
	}, {
		"id": 2,
		"name": "角色管理",
		"hash": "role/index",
		"features": [],
	}, {
		"id": 2,
		"name": "用户管理",
		"hash": "account/index",
		"features": [],
	}, {
		"id": 2,
		"name": "会话管理",
		"hash": "session/index",
		"features": [],
	}, {
		"id": 2,
		"name": "CBSS账户管理",
		"hash": "cbss/account/index",
		"features": [],
	}, {
		"id": 2,
		"name": "SMS管理",
		"hash": "sms/index",
		"features": [],
	}, {
		"id": 2,
		"name": "微信客户管理",
		"hash": "wechat/customer/index",
		"features": [],
	}, {
		"id": 2,
		"name": "微信设置",
		"hash": "wechat/index",
		"features": [],
	}, {
		"id": 2,
		"name": "运营监控",
		"hash": "monitor/index",
		"features": [],
	}, {
		"id": 2,
		"name": "数据维护",
		"hash": "database/index",
		"features": [],
	}, {
		"id": 2,
		"name": "我的资料",
		"hash": "profile/me",
		"features": [],
	}]
});

exports = module.exports = config;
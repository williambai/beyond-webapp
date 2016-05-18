var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
	email: {
		type: String,//** 账户登录名，包括email和电话号码
		unique: true
	},
	password: String,
	username: String, //** 用户姓名
	birthday: {
		day: {
			type: Number,
			min: 1,
			max: 31,
			required: false
		},
		month: {
			type: Number,
			min: 1,
			max: 12,
			required: false
		},
		year: {
			type: Number
		}
	},
	avatar: String,
	biography: String,
	registerCode: String, //注册验证码

	histroies: [],
	status: {
		code: {
			type: Number,
			enum: [-1, 0], //账号的有效性；-1：注册但不能登录；0：正常可登陆
		},
		message: String,
	},
	createby: {
		uid: String,
		username: String,
		avatar: String,
	},
	lastupdatetime: Date
});

schema.set('collection', 'accounts');

exports = module.exports = function(connection) {
	connection = connection || mongoose;
	return connection.model('Account', schema);
};
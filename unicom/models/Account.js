var mongoose = require('mongoose');
var mongooseToCsv = require('mongoose-to-csv');
var CSV = require('comma-separated-values');
var async = require('async');
var crypto = require('crypto');

var schema = new mongoose.Schema({
	email: {
		type: String,
		unique: true
	},
	openid: String, //wechat openid
	password: String,
	username: String,
	apps: [],//** superadmin/admin/channel
	roles: [],
	department: {
		id: String, 
		name: String,//** 渠道名称
		nickname: String, //** 渠道编码
		city: String, //** 城市名称
		grid: String, //** 网格
		district: String, //** 地区
	},
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
	status: {
		type: String,
		enum: {
			values: '未验证|正常|禁用'.split('|'),//账号的有效性；注册但不能登录；正常登陆；禁止登录
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
	creator: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
		},
		username: String,
		avatar: String,
	},
	histories: [],
	lastupdatetime: Date
});

schema.set('collection', 'accounts');

//** 导出csv
schema.plugin(mongooseToCsv, {
	headers: '用户姓名 手机号码 密码 渠道名称 渠道编码 所在城市 所在地区 所在网格 状态',
	constraints: {
		'用户姓名': 'username',
		'手机号码': 'email',
		'密码': 'password',
		'状态': 'status',
	},
	virtuals: {
		'渠道名称': function(doc){
			return doc.department.name;
		},
		'渠道编码': function(doc){
			return doc.department.nickname;
		},
		'所在城市': function(doc){
			return doc.department.city;
		},
		'所在地区': function(doc){
			return doc.department.district;
		},
		'所在网格': function(doc){
			return doc.department.grid;
		},
	},
});

module.exports = exports = function(connection) {
	connection = connection || mongoose;

	/**
	 * 导入数据
	 * @param  {[type]}   csv  [description]
	 * @param  {Function} done [description]
	 * @return {[type]}        [description]
	 */
	schema.statics.importCSV = function(data, done) {
		var csv = new CSV(data, {
			header: ['username', 'email', 'password', 'department.name', 'department.nickname', 'department.city', 'department.district', 'department.grid', 'status'],
			lineDelimiter: '\n',
			cellDelimiter: ',',
		});
		var json = csv.parse();

		var Account = connection.model('Account');
		async.each(json, function(record, cb) {
			//** 跳过标题行
			if(record.email == '手机号码' || record.email == 'email') return cb();
			//** 跳过管理员用户
			if(/@/.test(record.email)) return cb();
			//** 设置应用
			record.apps = ['channel'];
			if(record.password){
				record.password = crypto.createHash('sha256').update(record.password).digest('hex');
			}
			//** 更新数据
			Account.findOneAndUpdate({
				email: record.email,
			}, {
				$set: record
			}, {
				'upsert': true,
			}, function(err) {
				if (err) console.log(err);
				cb(err);
			});
		}, done);
	};

	return connection.model('Account', schema);
};
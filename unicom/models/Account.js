var mongoose = require('mongoose');
var connection = mongoose;
var async = require('async');
var _ = require('underscore');
var crypto = require('crypto');
var Excel = require('exceljs');

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

//** Excel 头
var columns = [{
                header: '序号',
                key: 'id'
            }, {
                header: '姓名',
                key: 'username',
                width: 10
            }, {
                header: '手机号码',
                key: 'email',
                width: 10,
            }, {
                header: '初始密码',
                key: 'password',
                width: 10,
            }, {
                header: '渠道名称',
                key: 'departmentName',
                width: 20,
            }, {
                header: '渠道编码',
                key: 'departmentNickname',
                width: 10,
            }, {
                header: '所在网格',
                key: 'departmentGrid',
                width: 10,
            }, {
                header: '所在地区',
                key: 'departmentDistrict',
                width: 10,
            }, {
                header: '所在城市',
                key: 'departmentCity',
                width: 10,
            }, {
                header: '状态',
                key: 'status',
                width: 10,
            }];

//** Excel模板
schema.statics.toExcelTemplate = function(done){
    var workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet('sheet1');
    sheet.columns = columns;
    done(null, workbook);
};

schema.statics.toExcel = function(query, done) {
    query = query || {};
    var Account = connection.model('Account');
    Account
        .find(query)
        .exec(function(err, doc) {
            var workbook = new Excel.Workbook();
            var sheet = workbook.addWorksheet('sheet1');
            sheet.columns = columns;
            for (var i = 0; i < doc.length; i++) {
            	//** 不导出@管理员账号
				if(!/@/.test(doc[i].email)){
	                sheet.addRow({
	                    id: i,
	                    username: doc[i].username,
	                    email: doc[i].email,
	                    password: '',
	                    departmentName: doc[i].department.name,
	                    departmentNickname: doc[i].department.nickname,
	                    departmentGrid: doc[i].department.grid,
	                    departmentDistrict: doc[i].department.district,
	                    departmentCity: doc[i].department.city,
	                    status: doc[i].status,
	                });
	            }
            }
            done(null, workbook);
        });
};

schema.statics.fromExcel = function(filename,done){
	var Account = connection.model('Account');
	var workbook = new Excel.Workbook();
	workbook.xlsx.readFile(filename)
		.then(function(){
			var sheets = [];
			workbook.eachSheet(function(sheet,sheetId){
				sheets[sheetId] = sheet;
			});
			var sets = [];
			for(var i in sheets){
				sheets[i].eachRow(function(row,rowNumber){
					// console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
					var set = {
					    username: row.values[2],
					    email: row.values[3],
					    password: row.values[4],
					    department: {
					    	name: row.values[5],
					    	nickname: row.values[6],
					    	grid: row.values[7],
					    	district: row.values[8],
					    	city: row.values[9],
					    },
					    status: row.values[10],
					};
					//** 过滤标题行
					if (!(set.username == '姓名' || set.email == '手机号码')) {
					    if (set.email) {
					        sets.push(set);
					    }
					}
				});
			}
			//** 记录无法更新的数据集合
			var wrongSets = [];
			async.eachSeries(sets, function(set, cb) {
			    console.log(set)
				//** 跳过管理员用户
				if(/@/.test(set.email)) return cb();
				//** 设置应用
				set.apps = ['channel'];
				//** 设置密码加密
				if(set.password){
					set.password = crypto.createHash('sha256').update(set.password).digest('hex');
				}else{
					_.omit(set,'password');
				}
				//** 更新数据
			    Account
			        .findOneAndUpdate({
			            email: set.email,
			        }, {
			            $set: set
			        }, {
			            'upsert': true,
			            'new': true,
			        }, function(err, result) {
			        	if(err) console.log(err);
			            if (err) wrongSets.push(set);
			            cb(null);
			        });
			}, function(err, result) {
			    if (err) return done(err);
			    done(null, {
			        wrongSets: wrongSets
			    });
			});
		});
};

module.exports = exports = function(conn) {
	connection = conn || mongoose;
	return connection.model('Account', schema);
};


// var mongooseToCsv = require('mongoose-to-csv');
// var CSV = require('comma-separated-values');

// //** 导出csv
// schema.plugin(mongooseToCsv, {
// 	headers: '用户姓名 手机号码 密码 渠道名称 渠道编码 所在城市 所在地区 所在网格 状态',
// 	constraints: {
// 		'用户姓名': 'username',
// 		'手机号码': 'email',
// 		'密码': 'password',
// 		'状态': 'status',
// 	},
// 	virtuals: {
// 		'渠道名称': function(doc){
// 			return doc.department.name;
// 		},
// 		'渠道编码': function(doc){
// 			return doc.department.nickname;
// 		},
// 		'所在城市': function(doc){
// 			return doc.department.city;
// 		},
// 		'所在地区': function(doc){
// 			return doc.department.district;
// 		},
// 		'所在网格': function(doc){
// 			return doc.department.grid;
// 		},
// 	},
// });

// 	/**
// 	 * 导入数据
// 	 * @param  {[type]}   csv  [description]
// 	 * @param  {Function} done [description]
// 	 * @return {[type]}        [description]
// 	 */
// 	schema.statics.importCSV = function(data, done) {
// 		var csv = new CSV(data, {
// 			header: ['username', 'email', 'password', 'department.name', 'department.nickname', 'department.city', 'department.district', 'department.grid', 'status'],
// 			lineDelimiter: '\n',
// 			cellDelimiter: ',',
// 		});
// 		var json = csv.parse();

// 		var Account = connection.model('Account');
// 		async.each(json, function(record, cb) {
// 			//** 跳过标题行
// 			if(record.email == '手机号码' || record.email == 'email') return cb();
// 			//** 跳过管理员用户
// 			if(/@/.test(record.email)) return cb();
// 			//** 设置应用
// 			record.apps = ['channel'];
// 			if(record.password){
// 				record.password = crypto.createHash('sha256').update(record.password).digest('hex');
// 			}
// 			//** 更新数据
// 			Account.findOneAndUpdate({
// 				email: record.email,
// 			}, {
// 				$set: record
// 			}, {
// 				'upsert': true,
// 			}, function(err) {
// 				if (err) console.log(err);
// 				cb(err);
// 			});
// 		}, done);
// 	};

/**
 * 财务模块
 * - 用户银行卡
 */
var mongoose = require('mongoose');
var async = require('async');
var Excel = require('exceljs');
var connection = mongoose;

var schema = new mongoose.Schema({
	uid: String, //** 用户Id
	username: String, //** 用户姓名
	mobile: String, //** 用户手机号
	bankName: String, //** 银行名称
	bankCode: String, //** 银行代码
	bankAddr: String, //** 银行地址
	accountName: String, //** 银行卡姓名
	accountNo: String, //** 银行卡卡号
	cardId: String, //** 身份证号码
	expired: String, //** 有效期
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
});

schema.set('collection', 'finance.banks');

//** Excel 头
var columns = [{
                header: '序号',
                key: 'id'
            }, {
                header: '用户姓名',
                key: 'username',
                width: 15
            }, {
                header: '手机号码',
                key: 'mobile',
                width: 15
            }, {
                header: '银行卡姓名',
                key: 'accountName',
                width: 20,
            }, {
                header: '银行卡号码',
                key: 'accountNo',
                width: 30,
            }, {
                header: '银行卡有效期',
                key: 'expired',
                width: 10,
            }, {
                header: '身份证号码',
                key: 'cardId',
                width: 10,
            }, {
                header: '银行名称',
                key: 'bankName',
                width: 20,
            }, {
                header: '银行代码',
                key: 'bankCode',
                width: 20,
            }, {
                header: '银行地址',
                key: 'bankAddr',
                width: 30,
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
    var FinanceBank = connection.model('FinanceBank');
    FinanceBank
        .find(query)
        .exec(function(err, doc) {
            var workbook = new Excel.Workbook();
            var sheet = workbook.addWorksheet('sheet1');
            sheet.columns = columns;
            for (var i = 0; i < doc.length; i++) {
                sheet.addRow({
                    id: i,
                    username: doc[i].username,
                    mobile: doc[i].mobile,
                    accountName: doc[i].accountName,
                    accountNo: doc[i].accountNo,
                    expired: doc[i].expired,
                    cardId: doc[i].cardId,
                    bankName: doc[i].bankName,
                    bankCode: doc[i].bankCode,
                    bankAddr: doc[i].bankAddr,
                });
            }
            done(null, workbook);
        });
};

schema.statics.fromExcel = function(filename,done){
	var FinanceBank = connection.model('FinanceBank');
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
					    mobile: row.values[3],
					    accountName: row.values[4] || '',
					    accountNo: row.values[5] || '',
					    expired: row.values[6] || '',
					    cardId: row.values[7] || '',
					    bankName: row.values[8] || '',
					    bankCode: row.values[9] || '',
					    bankAddr: row.values[10] || '',
					};
					//** 过滤标题行
					if (!(set.mobile == '手机号码' || set.username == '用户姓名')) {
					    if (set.mobile) {
					        sets.push(set);
					    }
					}
				});
			}
			//** 记录无法更新的数据集合
			var wrongSets = [];
			async.eachSeries(sets, function(set, cb) {
			    FinanceBank
			        .findOneAndUpdate({
			            mobile: set.mobile,
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

module.exports = exports = function(conn){
	connection = conn || mongoose;
	return connection.model('FinanceBank', schema);
};

// var mongooseToCsv = require('mongoose-to-csv');
// var CSV = require('comma-separated-values');
// //** 导出csv
// schema.plugin(mongooseToCsv,{
// 	headers: '手机号码 银行名称 银行代码 开户地址 银行卡主姓名 银行卡号码 身份证号码 有效期',
// 	constraints: {
// 		'手机号码': 'mobile',
// 		'银行名称': 'bankName',
// 		'银行代码': 'bankCode',
// 		'开户地址': 'bankAddr',
// 		'银行卡主姓名': 'accountName',
// 		'银行卡号码': 'accountNo',
// 		'身份证号码': 'cardId',
// 		'有效期': 'expired',
// 	}
// });


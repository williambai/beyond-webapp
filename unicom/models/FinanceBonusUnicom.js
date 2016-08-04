/**
 * 局方导入的对账单
 * 
 */
var mongoose = require('mongoose');
var async = require('async');
var Excel = require('exceljs');
var connection = mongoose;
var regexp = require('../libs/regexp');
var utils = require('../libs/utils');

var schema = new mongoose.Schema({
	month: String,//**账期
	city: String,//** 地市
	userCode: String,//** 用户ID
	mobile: String,//** 用户号码
	mainProductCode: String,//** 当前套餐编码
	mainProductName: String,//** 当前套餐名称
	originProductCode: String,//** 入网套餐编码
	originproductName: String,//** 入网套餐名称
	originTime: String,//** 入网时间
	vandorCode: String,//** 发展人编码
	vandorName: String,//** 发展人名称
	vandorChannelCode: String,//** 发展渠道编码
	vandorChannelName: String,//** 发展渠道名称
	paymentChannelCode: String,//** 支付渠道编码
	paymentChannelName: String,//** 支付渠道名称
	policyName: String,//** 政策名称
	createDate: String,//** 受理时间
	bonusType: String,//** 佣金类型
	bonusNet: Number,//** 佣金净额
	bonusTax: Number,//** 佣金税额
	bonusTotal: Number,//** 佣金总额
	productCode: String,//** 增值业务产品编码
	productName: String,//** 增值业务产品名称
	sellerName: String, //** Wo助手销售该产品的用户名称
	sellerMobile: String, //** Wo助手销售该产品的用户手机号
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
});

schema.set('collection', 'finance.bonus.unicom');

//** Excel 头
var columns = [{
                header: '账期',
                key: 'month',
                width: 10
            }, {
                header: '城市',
                key: 'city',
                width: 10,
            }, {
                header: '用户ID',
                key: 'userCode',
                width: 10,
            }, {
                header: '号码',
                key: 'mobile',
                width: 20,
            }, {
                header: '当前套餐编码',
                key: 'mainProductCode',
                width: 10,
            }, {
                header: '当前套餐名称',
                key: 'mainProductName',
                width: 10,
            }, {
                header: '入网套餐编码',
                key: 'originProductCode',
                width: 10,
            }, {
                header: '入网套餐名称',
                key: 'originproductName',
                width: 10,
            }, {
                header: '入网时间',
                key: 'originTime',
                width: 15,
             }, {
                header: '发展人编码',
                key: 'vandorCode',
                width: 20,
            }, {
                header: '发展人名称',
                key: 'vandorName',
                width: 20,
            }, {
                header: '发展渠道编码',
                key: 'vandorChannelCode',
                width: 20,
            }, {
                header: '发展渠道名称',
                key: 'vandorChannelName',
                width: 10,
            }, {
                header: '支付渠道编码',
                key: 'paymentChannelCode',
                width: 10,
            }, {
                header: '支付渠道名称',
                key: 'paymentChannelName',
                width: 20,
            }, {
                header: '政策名称',
                key: 'policyName',
                width: 20,
            }, {
                header: '受理时间',
                key: 'createDate',
                width: 10,
            }, {
                header: '佣金类型',
                key: 'bonusType',
                width: 10,
            }, {
                header: '佣金净额',
                key: 'bonusNet',
                width: 10,
            }, {
                header: '佣金税额',
                key: 'bonusTax',
                width: 10,
            }, {
                header: '佣金总额',
                key: 'bonusTotal',
                width: 10,
            }, {
                header: '增值业务产品编码',
                key: 'productCode',
                width: 20,
            }, {
                header: '增值业务产品名称',
                key: 'productName',
                width: 20,
            }, {
                header: '营业员姓名',
                key: 'sellerName',
                width: 10,
            }, {
                header: '营业员手机',
                key: 'sellerMobile',
                width: 10,
            }, {
                header: '更新时间',
                key: 'lastupdatetime',
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
    var FinanceBonusUnicom = connection.model('FinanceBonusUnicom');
    FinanceBonusUnicom
        .find(query)
        .exec(function(err, doc) {
        	if(err) return done(err);
            var workbook = new Excel.Workbook();
            var sheet = workbook.addWorksheet('sheet1');
            sheet.columns = columns;
            for (var i = 0; i < doc.length; i++) {
                sheet.addRow({
                    month: doc[i].month,
                    city: doc[i].city,
	                userCode: doc[i].userCode,
                    mobile: doc[i].mobile,
                    mainProductCode: doc[i].mainProductCode,
                    mainProductName: doc[i].mainProductName,
                    originProductCode: doc[i].originProductCode,
                    originproductName: doc[i].originproductName,
                    originTime: doc[i].originTime,
                    vandorCode: doc[i].vandorCode,
                    vandorName: doc[i].vandorName,
                    vandorChannelCode: doc[i].vandorChannelCode,
                    vandorChannelName: doc[i].vandorChannelName,
                    paymentChannelCode: doc[i].paymentChannelCode,
                    paymentChannelName: doc[i].paymentChannelName,
                    policyName: doc[i].policyName,
                    createDate: doc[i].createDate,
                    bonusType: doc[i].bonusType,
                    bonusNet: doc[i].bonusNet,
                    bonusTax: doc[i].bonusTax,
                    bonusTotal: doc[i].bonusTotal,
                    productCode: doc[i].productCode,
                    productName: doc[i].productName, 
                    sellerName: doc[i].sellerName,
                    sellerMobile: doc[i].sellerMobile,
                    lastupdatetime: utils.dateFormat(doc[i].lastupdatetime, 'yyyy-MM-dd:hh:mm:ss'),
                });
            }
            done(null, workbook);
        });
};

schema.statics.fromExcel = function(filename, done) {
    var FinanceBonusUnicom = connection.model('FinanceBonusUnicom');
    var Order = connection.model('Order');
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename)
        .then(function() {
        	//** 所有的sheets
        	var sheets = {};
            workbook.eachSheet(function(sheet, sheetId) {
            	sheets[sheetId] = sheet;
            });
            //** 所有的数据
            var sets = [];
            for(var i in sheets){
                sheets[i].eachRow(function(row, rowNumber) {
                    // console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                    var set = {
                        month: String(row.values[1]) || '',
                        city: String(row.values[2]) || '',
                        userCode: String(row.values[3]) || '',
                        mobile: String(row.values[4]) || '',
                        mainProductCode: String(row.values[5]) || '',
                        mainProductName: String(row.values[6]) || '',
                        originProductCode: String(row.values[7]) || '',
                        originproductName: String(row.values[8]) || '',
                        originTime: String(row.values[9]) || '',
                        vandorCode: String(row.values[10]) || '',
                        vandorName: String(row.values[11]) || '',
                        vandorChannelCode: String(row.values[12]) || '',
                        vandorChannelName: String(row.values[13]) || '',
                        paymentChannelCode: String(row.values[14]) || '',
                        paymentChannelName: String(row.values[15]) || '',
                        policyName: String(row.values[16]) || '',
                        createDate: String(row.values[17]) || '',
                        bonusType: String(row.values[18]) || '',
                        bonusNet: String(row.values[19]) || '',
                        bonusTax: String(row.values[20]) || '',
                        bonusTotal: String(row.values[21]) || '',
                        productCode: String(row.values[22]) || '',
                        productName: String(row.values[23]) || '',
                    };
                    //** 过滤标题行
                    if (!(set.month == '账期' || set.city == '城市')) {
                        sets.push(set);
                    }
                });
            }
            //** 记录无法更新的数据集合
            var wrongSets = [];
			async.eachSeries(sets, function(record, cb) {
				//** 跳过标题行
				if(record.month == '账期') return cb();
				//** 开始日期
				var createDate = (record.createDate || '').match(/\d+/g) || [];
				var days = createDate[0] || 0;
				var month = (createDate[1] || 1) - 1;
				var year = (createDate[2] || 100) < 100 ? (2000 + parseInt(createDate[2])) : parseInt(createDate[2]); 

                //** 缩小时间范围
				var prevDay = new Date((new Date(year,month,days)).getTime() - 1000*60*60*24); //** 前一天
                var nextDay = new Date((new Date(year,month,days)).getTime() + 1000*60*60*24); //** 后一天

                //** 对账编码
                var packageCodeRegex = new RegExp(regexp.escape('e' + record.productCode), 'i');

				//** 关联到订单
				Order.findOne({
					'customer.mobile': record.mobile,
                    'status': '成功',
					'goods.packageCode': {
						$regex: packageCodeRegex
					},
					'lastupdatetime': {
						'$gt': prevDay,
						'$lt': nextDay,
					}
				}, function(err,order){
					if(err) console.log(err);
					order = order || {};
					record.sellerName = order.createBy && order.createBy.username || '';
					record.sellerMobile = order.createBy && order.createBy.mobile || '';

					//** 找到并更新对账单中的推荐人信息
					FinanceBonusUnicom.findOneAndUpdate({
						month: record.month,
						userCode: record.userCode,
						createDate: record.createDate,
					}, {
						$set: record
					}, {
						'upsert': true,
                        'new': true,
					}, function(err) {
                        if (err) wrongSets.push(set);
                        cb();
					});
				});
			}, function(err) {
                if (err) return done(err);
                done(null, {
                    wrongSets: wrongSets
                });
            });
        });
};

module.exports = exports = function(conn){
	connection = conn || mongoose;
	return connection.model('FinanceBonusUnicom', schema);
};

// var mongooseToCsv = require('mongoose-to-csv');
// var CSV = require('comma-separated-values');

// /**
//  * 导入局方提供的对账数据
//  * @param  {[type]}   csv  [description]
//  * @param  {Function} done [description]
//  * @return {[type]}        [description]
//  */
// schema.statics.importCSV = function(data, done) {
// 	var newData = data.replace(/;/g,',');
// 	newData = newData.replace(/(\r|\r\n)/g,'\n');
// 	var csv = new CSV(newData, {
// 		header: ['month', 'city', 'userCode', 'mobile', 'mainProductCode', 'mainProductName', 'originProductCode', 'originproductName', 'originTime', 'vandorCode','vandorName','vandorChannelCode','vandorChannelName','paymentChannelCode','paymentChannelName','policyName','createDate','bonusType','bonusNet','bonusTax','bonusTotal','productCode','productName'],
// 		lineDelimiter: '\n',
// 		cellDelimiter: ',',
// 	});
// 	var json = csv.parse();

// 	var FinanceBonusUnicom = connection.model('FinanceBonusUnicom');
// 	var Order = connection.model('Order');

// 	async.eachSeries(json, function(record, cb) {
// 		//** 跳过标题行
// 		if(record.month == '账期') return cb();
// 		//** 开始日期
// 		var createDate = (record.createDate || '').match(/\d+/g) || [];
// 		var days = createDate[0] || 0;
// 		var month = (createDate[1] || 1) - 1;
// 		var year = (createDate[2] || 100) < 100 ? (2000 + createDate[2]) : 0; 

// 		//** 关联到订单
// 		Order.findOne({
// 			'customer.mobile': record.mobile,
// 			// 'goods.barcode': record.productCode,
// 			'status': '成功',
// 			'lastupdatetime': {
// 				'$gt': new Date(year,month,days),
// 				'$lt': new Date(year,month,days + 1),
// 			}
// 		}, function(err,order){
// 			if(err) return cb(err);
// 			order = order || {};
// 			record.sellerName = order.createBy && order.createBy.username || '';
// 			record.sellerMobile = order.createBy && order.createBy.mobile || '';
// 			//** 更新数据
// 			FinanceBonusUnicom.findOneAndUpdate({
// 				month: record.month,
// 				userCode: record.userCode,
// 				createDate: record.createDate,
// 			}, {
// 				$set: record
// 			}, {
// 				'upsert': true,
// 			}, function(err) {
// 				if (err) console.log(err);
// 				cb(err);
// 			});
// 		});
// 	}, done);
// };

// //** 导出csv
// schema.plugin(mongooseToCsv, {
// 	headers: '账期 地市 营业员姓名 营业员手机 用户ID 号码 当前套餐编码 当前套餐名称 入网套餐编码 入网套餐名称 入网时间 发展人编码 发展人名称 发展渠道编码 发展渠道名称 支付渠道编码 支付渠道名称 政策名称 受理时间 佣金类型 佣金净额 佣金税额 佣金总额 增值业务产品编码 增值业务产品名称',
// 	constraints: {
// 	},
// 	virtuals: {
// 		'账期': function(doc){
// 			return doc.month;
// 		},
// 		'地市': function(doc){
// 			return doc.city;
// 		},
// 		'营业员姓名': function(doc){
// 			return doc.sellerName;
// 		},
// 		'营业员手机': function(doc){
// 			return doc.sellerMobile;
// 		},
// 		'用户ID': function(doc){
// 			return doc.userCode;
// 		},
// 		'号码': function(doc){
// 			return doc.mobile;
// 		},
// 		'当前套餐编码': function(doc){
// 			return doc.mainProductCode;
// 		},
// 		'当前套餐名称': function(doc){
// 			return doc.mainProductName;
// 		},
// 		'入网套餐编码': function(doc){
// 			return doc.originProductCode;
// 		},
// 		'入网套餐名称': function(doc){
// 			return doc.originproductName;
// 		},
// 		'入网时间': function(doc){
// 			return doc.originTime;
// 		},
// 		'发展人编码': function(doc){
// 			return doc.vandorCode;
// 		},
// 		'发展人名称': function(doc){
// 			return doc.vandorName;
// 		},
// 		'发展渠道编码': function(doc){
// 			return doc.vandorChannelCode;
// 		},
// 		'发展渠道名称': function(doc){
// 			return doc.vandorChannelName;
// 		},
// 		'支付渠道编码': function(doc){
// 			return doc.paymentChannelCode;
// 		},
// 		'支付渠道名称': function(doc){
// 			return doc.paymentChannelName;
// 		},
// 		'政策名称': function(doc){
// 			return doc.policyName;
// 		},
// 		'受理时间': function(doc){
// 			return doc.createDate;
// 		},
// 		'佣金类型': function(doc){
// 			return doc.bonusType;
// 		},
// 		'佣金净额': function(doc){
// 			return doc.bonusNet;
// 		},
// 		'佣金税额': function(doc){
// 			return doc.bonusTax;
// 		},
// 		'佣金总额': function(doc){
// 			return doc.bonusTotal;
// 		},
// 		'增值业务产品编码': function(doc){
// 			return doc.productCode;
// 		},
// 		'增值业务产品名称': function(doc){
// 			return doc.productName;
// 		}
// 	}
// });

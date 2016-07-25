/**
 * 电子商务中的产品
 * 
 */
var mongoose = require('mongoose');
var connection = mongoose;
var async = require('async');
var Excel = require('exceljs');

var schema = new mongoose.Schema({
    name: String, //** 产品名称
    description: String, //** 产品描述
    category: String, //** 产品分类，4G
    barcode: String, //** 产品编码，唯一编码
    smscode: String, //** 业务编码，sms短信
    packagecode: String, //** 联通系统中对应的product_id, package_id, element_id组成的集合，多个以|分割 
    price: Number, //** 产品建议价格
    unit: String, //** 产品价格单位
    quantity: Number, //** 产品库存：库存量
    scope: String, //** 产品适用区域
    bonus: { //** 单个佣金
        type: Number,
        default: 0,
    },
    paymenttype: { //** 佣金发放分配方式
        type: Number,
        enum: {
            values: '1|2|3'.split('|'), //** 0: 2/4(二次), 1: 2(一次), 2: 2/4/7(三次)
            message: 'enum validator failed for path {PATH} with value {VALUE}',
        },
        default: 2
    },
    status: {
        type: String,
        enum: {
            values: '有效|无效'.split('|'),
            message: 'enum validator failed for path {PATH} with value {VALUE}',
        }
    },
});

schema.set('collection', 'goods');

//** Excel 标题头
var columns = [{
                header: '序号',
                key: 'id'
            }, {
                header: '产品名称',
                key: 'name',
                width: 32
            }, {
                header: '产品分类',
                key: 'category',
                width: 10,
            }, {
                header: '订购编码',
                key: 'barcode',
                width: 20,
            }, {
                header: '业务编码',
                key: 'smscode',
                width: 20,
            }, {
                header: '产品编码',
                key: 'packagecode',
                width: 20,
            }, {
                header: '价格',
                key: 'price',
                width: 10,
            }, {
                header: '价格单位',
                key: 'unit',
                width: 10,
            }, {
                header: '库存数量',
                key: 'quantity',
                width: 10,
            }, {
                header: '适用地区',
                key: 'scope',
                width: 10,
            }, {
                header: '佣金',
                key: 'bonus',
                width: 10,
            }, {
                header: '佣金发放方式',
                key: 'paymenttype',
                width: 10,
            }, {
                header: '状态',
                key: 'status',
                width: 10,
            }, {
                header: '产品描述',
                key: 'description',
                width: 50,
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
    var Goods = connection.model('Goods');
    Goods
        .find(query)
        .exec(function(err, goods) {
            var workbook = new Excel.Workbook();
            var sheet = workbook.addWorksheet('sheet1');
            sheet.columns = columns;
            for (var i = 0; i < goods.length; i++) {
                sheet.addRow({
                    id: i,
                    name: goods[i].name,
                    category: goods[i].category,
                    barcode: goods[i].barcode,
                    smscode: goods[i].smscode,
                    packagecode: goods[i].packagecode,
                    price: goods[i].price,
                    unit: goods[i].unit,
                    quantity: goods[i].quantity,
                    scope: goods[i].scope,
                    bonus: goods[i].bonus,
                    paymenttype: goods[i].paymenttype,
                    status: goods[i].status,
                    description: goods[i].description,
                });
            }
            done(null, workbook);
        });
};

schema.statics.fromExcel = function(filename, done) {
    var Goods = connection.model('Goods');
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
                        name: row.values[2],
                        category: row.values[3],
                        barcode: row.values[4],
                        smscode: row.values[5],
                        packagecode: row.values[6],
                        price: parseInt(row.values[7]) || 0,
                        unit: row.values[8] || '元',
                        quantity: parseInt(row.values[9]) || 0,
                        scope: row.values[10],
                        bonus: parseInt(row.values[11]) || 0,
                        paymenttype: parseInt(row.values[12]) || 2,
                        status: (row.values[13] == '有效') ? '有效' : '无效',
                        description: row.values[14],
                    };
                    //** 过滤标题行
                    if (!(set.name == '产品名称' || set.category == '产品分类')) {
                        if (set.barcode) {
                            sets.push(set);
                        }
                    }
                });
            }
            //** 记录无法更新的数据集合
            var wrongSets = [];
            async.eachSeries(sets, function(set, cb) {
                // console.log(set)
                Goods
                    .findOneAndUpdate({
                        barcode: set.barcode,
                    }, {
                        $set: set
                    }, {
                        'upsert': true,
                        'new': true,
                    }, function(err, result) {
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
    return connection.model('Goods', schema);
};


// var mongooseToCsv = require('mongoose-to-csv');
// // var CSV = require('comma-separated-values');
// var CSV = require('csv2json').Converter;
// //** 导出csv
// schema.plugin(mongooseToCsv, {
//     headers: '产品名称 产品分类 订购编码 业务编码 产品编码 价格 价格单位 库存数量 适用地区 佣金 佣金发放方式 状态 产品描述',
//     constraints: {
//         '产品名称': 'name',
//         '产品分类': 'category',
//         '订购编码': 'barcode',
//         '业务编码': 'smscode',
//         '产品编码': 'packagecode',
//         '价格': 'price',
//         '价格单位': 'unit',
//         '库存数量': 'quantity',
//         '适用地区': 'scope',
//         '佣金': 'bonus',
//         '佣金发放方式': 'paymenttype',
//         '状态': 'status',
//         '产品描述': 'description',
//     }
// });
// /**
//  * 导入csv
//  * @param  {[type]}   csv  [description]
//  * @param  {Function} done [description]
//  * @return {[type]}        [description]
//  */
// schema.statics.importCSV = function(data, done) {
//     var newData = data.replace(/;/g, ',');
//     newData = newData.replace(/(\r|\r\n)/g, '\n');
//     console.log(newData)
//     var csv = new CSV(newData, {
//         header: ['name', 'category', 'barcode', 'smscode', 'packagecode', 'price', 'unit', 'quantity', 'bonus', 'paymenttype', 'status', 'description'],
//         lineDelimiter: '\n',
//         cellDelimiter: ',',
//     });
//     var json = csv.parse();

//     var Goods = connection.model('Goods');
//     async.eachSeries(json, function(record, cb) {
//         //** 跳过标题行
//         if (record.barcode == '订购编码') return cb();
//         //** 更新数据
//         Goods.findOneAndUpdate({
//             barcode: record.barcode,
//         }, {
//             $set: record
//         }, {
//             'upsert': true,
//         }, function(err) {
//             if (err) console.log(err);
//             cb(err);
//         });
//     }, done);
// };

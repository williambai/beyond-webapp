var mongoose = require('mongoose');
var connection = mongoose;
var Excel = require('exceljs');
var async = require('async');

var schema = new mongoose.Schema({
	name: String,
	nickname: String,
	city: String, //** 城市名称
	grid: String, //** 网格编码
	district: String, //** 地区编码
	description: String,
	address: String,
	zipcode: String,
	manager: String,
	phone: String,
	website: String,
});

schema.set('collection', 'departments');

//** Excel 头
var columns = [{
                header: '序号',
                key: 'id'
            }, {
                header: '渠道名称',
                key: 'name',
                width: 32
            }, {
                header: '渠道编码',
                key: 'nickname',
                width: 10,
            }, {
                header: '所在网格',
                key: 'grid',
                width: 20,
            }, {
                header: '所在地区',
                key: 'district',
                width: 20,
            }, {
                header: '所在城市',
                key: 'city',
                width: 20,
            }, {
                header: '通讯地址',
                key: 'address',
                width: 30,
            }, {
                header: '邮政编码',
                key: 'zipcode',
                width: 10,
            }, {
                header: '负责人',
                key: 'manager',
                width: 10,
            }, {
                header: '联系电话',
                key: 'phone',
                width: 10,
            }, {
                header: '网站地址',
                key: 'website',
                width: 10,
            }, {
                header: '备注',
                key: 'description',
                width: 30,
            }];

//** Excel模板
schema.statics.toExcelTemplate = function(done){
    var workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet('sheet1');
    sheet.columns = columns;
    done(null, workbook);
};

schema.statics.fromExcel = function(filename,done){
	var Department = connection.model('Department');
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
					    name: String(row.values[2]) || '',
					    nickname: String(row.values[3]) || '',
					    grid: String(row.values[4]) || '',
					    district: String(row.values[5]) || '',
					    city: String(row.values[6]) || '',
					    address: String(row.values[7]) || '',
					    zipcode: String(row.values[8]) || '',
					    manager: String(row.values[9]) || '',
					    phone:  String(row.values[10]) || '',
                        website: String(row.values[11]) || '',
					    description:  String(row.values[12]) || '',
					};
					//** 过滤标题行
					if (!(set.name == '渠道名称' || set.nickname == '渠道编码')) {
					    if (set.nickname) {
					        sets.push(set);
					    }
					}
				});
			}
			//** 记录无法更新的数据集合
			var wrongSets = [];
			async.eachSeries(sets, function(set, cb) {
			    Department
			        .findOneAndUpdate({
			            nickname: set.nickname,
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


schema.statics.toExcel = function(query, done) {
    query = query || {};
    var Department = connection.model('Department');
    Department
        .find(query)
        .exec(function(err, doc) {
            var workbook = new Excel.Workbook();
            var sheet = workbook.addWorksheet('sheet1');
            sheet.columns = columns;
            for (var i = 0; i < doc.length; i++) {
                sheet.addRow({
                    id: i,
                    name: doc[i].name,
                    nickname: doc[i].nickname,
                    grid: doc[i].grid,
                    district: doc[i].district,
                    city: doc[i].city,
                    address: doc[i].address,
                    zipcode: doc[i].zipcode,
                    manager: doc[i].manager,
                    phone: doc[i].phone,
                    website: doc[i].website,
                    description: doc[i].description,
                });
            }
            done(null, workbook);
        });
};

module.exports = exports = function(conn) {
	connection = conn || mongoose;
	return connection.model('Department', schema);
};

// var mongooseToCsv = require('mongoose-to-csv');
// var CSV = require('comma-separated-values');

// //** 导出csv
// schema.plugin(mongooseToCsv, {
// 	headers: '渠道名称 渠道编码 所在城市 所在地区 所在网格 所在地址 邮政编码 负责人 联系电话 网站地址 渠道描述',
// 	constraints: {
// 		'渠道名称': 'name',
// 		'渠道编码': 'nickname',
// 		'所在城市': 'city',
// 		'所在地区': 'district',
// 		'所在网格': 'grid',
// 		'所在地址': 'address',
// 		'邮政编码': 'zipcode',
// 		'负责人': 'manager',
// 		'联系电话': 'phone',
// 		'网站地址': 'website',
// 		'渠道描述': 'description'
// 	}
// });

// /**
//  * 导入数据
//  * @param  {[type]}   csv  [description]
//  * @param  {Function} done [description]
//  * @return {[type]}        [description]
//  */
// schema.statics.importCSV = function(data, done) {
// 	var csv = new CSV(data, {
// 		header: ['name', 'nickname', 'city', 'district', 'grid', 'address', 'zipcode', 'manager', 'phone', 'website', 'description'],
// 		lineDelimiter: '\n',
// 		cellDelimiter: ',',
// 	});
// 	var json = csv.parse();

// 	var Department = connection.model('Department');
// 	async.each(json, function(record, cb) {
// 		//** 跳过标题行
// 		if(record.nickname == '渠道编码') return cb();
// 		//** 更新数据
// 		Department.findOneAndUpdate({
// 			nickname: record.nickname,
// 		}, {
// 			$set: record
// 		}, {
// 			'upsert': true,
// 		}, function(err) {
// 			if (err) console.log(err);
// 			cb(err);
// 		});
// 	}, done);
// };

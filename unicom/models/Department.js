var mongoose = require('mongoose');
var mongooseToCsv = require('mongoose-to-csv');
var CSV = require('comma-separated-values');
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

//** 导出csv
schema.plugin(mongooseToCsv, {
	headers: '渠道名称 渠道编码 所在城市 所在地区 所在网格 所在地址 邮政编码 负责人 联系电话 网站地址 渠道描述',
	constraints: {
		'渠道名称': 'name',
		'渠道编码': 'nickname',
		'所在城市': 'city',
		'所在地区': 'district',
		'所在网格': 'grid',
		'所在地址': 'address',
		'邮政编码': 'zipcode',
		'负责人': 'manager',
		'联系电话': 'phone',
		'网站地址': 'website',
		'渠道描述': 'description'
	}
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
			header: ['name', 'nickname', 'city', 'district', 'grid', 'address', 'zipcode', 'manager', 'phone', 'website', 'description'],
			lineDelimiter: '\n',
			cellDelimiter: ',',
		});
		var json = csv.parse();

		var Department = connection.model('Department');
		async.each(json, function(record, cb) {
			//** 跳过标题行
			if(record.nickname == '渠道编码') return cb();
			//** 更新数据
			Department.findOneAndUpdate({
				nickname: record.nickname,
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

	return connection.model('Department', schema);
};
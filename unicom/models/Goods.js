/**
 * 电子商务中的产品
 * 
 */
var mongoose = require('mongoose');
var mongooseToCsv = require('mongoose-to-csv');
var CSV = require('comma-separated-values');
var async = require('async');

var schema = new mongoose.Schema({
	name: String, //** 产品名称
	description: String, //** 产品描述
	category: String, //** 产品分类，4G
	barcode: String, //** 产品编码，唯一编码
	smscode: String, //** 业务编码，sms短信
	price: Number, //** 产品建议价格
	unit: String, //** 产品价格单位
	quantity: Number, //** 产品库存：库存量
	scope: String, //** 产品适用区域
	bonus: { //** 单个佣金
		type: Number,
		default: 0,
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

//** 导出csv
schema.plugin(mongooseToCsv,{
	headers: '产品名称 产品分类 产品编码 业务编码 价格 价格单位 产品库存数量 佣金 状态 产品描述',
	constraints: {
		'产品名称': 'name',
		'产品分类': 'category',
		'产品编码': 'barcode',
		'业务编码': 'smscode',
		'价格': 'price',
		'价格单位': 'unit',
		'产品库存数量': 'quantity',
		'佣金': 'bonus',
		'状态': 'status',
		'产品描述': 'description',
	}
});

module.exports = exports = function(connection){
	connection = connection || mongoose;
	/**
	 * 导入数据
	 * @param  {[type]}   csv  [description]
	 * @param  {Function} done [description]
	 * @return {[type]}        [description]
	 */
	schema.statics.importCSV = function(data, done) {
		var csv = new CSV(data, {
			header: ['name', 'category', 'barcode', 'smscode', 'price', 'unit', 'quantity', 'bonus', 'status', 'description'],
			lineDelimiter: '\n',
			cellDelimiter: ',',
		});
		var json = csv.parse();

		var Goods = connection.model('Goods');
		async.each(json, function(record, cb) {
			//** 跳过标题行
			if(record.barcode == '产品编码') return cb();
			//** 更新数据
			Goods.findOneAndUpdate({
				barcode: record.barcode,
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

	return connection.model('Goods', schema);
};


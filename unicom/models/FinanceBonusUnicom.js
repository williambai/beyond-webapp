/**
 * 局方导入的对账单
 * 
 */
var mongoose = require('mongoose');
var mongooseToCsv = require('mongoose-to-csv');
var CSV = require('comma-separated-values');
var async = require('async');
var connection = mongoose;
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

/**
 * 导入局方提供的对账数据
 * @param  {[type]}   csv  [description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
schema.statics.importCSV = function(data, done) {
	var newData = data.replace(/;/g,',');
	newData = newData.replace(/(\r|\r\n)/g,'\n');
	var csv = new CSV(newData, {
		header: ['month', 'city', 'userCode', 'mobile', 'mainProductCode', 'mainProductName', 'originProductCode', 'originproductName', 'originTime', 'vandorCode','vandorName','vandorChannelCode','vandorChannelName','paymentChannelCode','paymentChannelName','policyName','createDate','bonusType','bonusNet','bonusTax','bonusTotal','productCode','productName'],
		lineDelimiter: '\n',
		cellDelimiter: ',',
	});
	var json = csv.parse();

	var FinanceBonusUnicom = connection.model('FinanceBonusUnicom');
	var Order = connection.model('Order');

	async.eachSeries(json, function(record, cb) {
		//** 跳过标题行
		if(record.month == '账期') return cb();
		//** 开始日期
		var createDate = (record.createDate || '').match(/\d+/g) || [];
		var days = createDate[0] || 0;
		var month = (createDate[1] || 1) - 1;
		var year = (createDate[2] || 100) < 100 ? (2000 + createDate[2]) : 0; 

		//** 关联到订单
		Order.findOne({
			'customer.mobile': record.mobile,
			// 'goods.barcode': record.productCode,
			'status': '成功',
			'lastupdatetime': {
				'$gt': new Date(year,month,days),
				'$lt': new Date(year,month,days + 1),
			}
		}, function(err,order){
			if(err) return cb(err);
			order = order || {};
			record.sellerName = order.createBy && order.createBy.username || '';
			record.sellerMobile = order.createBy && order.createBy.mobile || '';
			//** 更新数据
			FinanceBonusUnicom.findOneAndUpdate({
				month: record.month,
				userCode: record.userCode,
				createDate: record.createDate,
			}, {
				$set: record
			}, {
				'upsert': true,
			}, function(err) {
				if (err) console.log(err);
				cb(err);
			});
		});
	}, done);
};

//** 导出csv
schema.plugin(mongooseToCsv, {
	headers: '账期 地市 营业员姓名 营业员手机 用户ID 号码 当前套餐编码 当前套餐名称 入网套餐编码 入网套餐名称 入网时间 发展人编码 发展人名称 发展渠道编码 发展渠道名称 支付渠道编码 支付渠道名称 政策名称 受理时间 佣金类型 佣金净额 佣金税额 佣金总额 增值业务产品编码 增值业务产品名称',
	constraints: {
	},
	virtuals: {
		'账期': function(doc){
			return doc.month;
		},
		'地市': function(doc){
			return doc.city;
		},
		'营业员姓名': function(doc){
			return doc.sellerName;
		},
		'营业员手机': function(doc){
			return doc.sellerMobile;
		},
		'用户ID': function(doc){
			return doc.userCode;
		},
		'号码': function(doc){
			return doc.mobile;
		},
		'当前套餐编码': function(doc){
			return doc.mainProductCode;
		},
		'当前套餐名称': function(doc){
			return doc.mainProductName;
		},
		'入网套餐编码': function(doc){
			return doc.originProductCode;
		},
		'入网套餐名称': function(doc){
			return doc.originproductName;
		},
		'入网时间': function(doc){
			return doc.originTime;
		},
		'发展人编码': function(doc){
			return doc.vandorCode;
		},
		'发展人名称': function(doc){
			return doc.vandorName;
		},
		'发展渠道编码': function(doc){
			return doc.vandorChannelCode;
		},
		'发展渠道名称': function(doc){
			return doc.vandorChannelName;
		},
		'支付渠道编码': function(doc){
			return doc.paymentChannelCode;
		},
		'支付渠道名称': function(doc){
			return doc.paymentChannelName;
		},
		'政策名称': function(doc){
			return doc.policyName;
		},
		'受理时间': function(doc){
			return doc.createDate;
		},
		'佣金类型': function(doc){
			return doc.bonusType;
		},
		'佣金净额': function(doc){
			return doc.bonusNet;
		},
		'佣金税额': function(doc){
			return doc.bonusTax;
		},
		'佣金总额': function(doc){
			return doc.bonusTotal;
		},
		'增值业务产品编码': function(doc){
			return doc.productCode;
		},
		'增值业务产品名称': function(doc){
			return doc.productName;
		}
	}
});


module.exports = exports = function(conn){
	connection = conn || mongoose;
	return connection.model('FinanceBonusUnicom', schema);
};
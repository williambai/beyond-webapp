/**
 * 客户在wo中的信息
 * @type {[type]}
 */
var _ = require('underscore');
var mongoose = require('mongoose');
var connection = mongoose;
var BSS = require('../libs/bss_gz');//** 贵州联通BSS系统

var schema = new mongoose.Schema({
	mobile: String, //** 客户手机号
	name: String, //** 客户姓名
	category: String, //** 类型
	info: {},//** wo系统信息
	status: {
		type: String,
		enum: {
			values: '新建|有效|无效'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		},
		default: '新建'
	},
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
});

schema.set('collection', 'customer.phones');

schema.statics.getInfoByPhone = function(options, done){
	if(!(/^1\d{10}$/.test(options.mobile))) return done({code: 404122, errmsg: '查无此号码'});
	var CustomerPhone = connection.model('CustomerPhone');
	CustomerPhone.findOneAndUpdate({
		mobile: options.mobile || ''
	}, {
		$set: {
		}
	}, {
		'upsert': true,
		'new': true,
	},function(err,customerPhone){
		if(err) return done(err);
		customerPhone = customerPhone || {};
		var status = customerPhone.status || '';
		//** 符合条件，直接返回
		if(status == '无效') return done({code: 404123, errmsg: '查无此号码'});
		if(status == '有效') {
			customerPhone = _.omit(customerPhone,'custName');
			return done(null, customerPhone);
		}
		BSS.getUserInfo({
			url: BSS.getBssUrl('prod'), //** 生产地址
			requestId: String(customerPhone._id),//** 请求Id
			AccProvince: '85',
			AccCity: '850',
			Code: '0851',
			NetType: '02',
			UserNumber: options.mobile || '',
		}, function(err,result){
			if(err) return done(err);
			result = result || {};
			status = '有效';
			//** 保存
			CustomerPhone.findOneAndUpdate({
				mobile: options.mobile || '',
			}, {
				$set: {
					info: result,
					status: status,
					lastupdatetime: new Date(),
				}
			}, {
				'upsert': false,
				'new': true,
			}, function(err, newCustomerPhone){
				if(err) return done(err);
				newCustomerPhone = newCustomerPhone || {};
				newCustomerPhone = _.omit(newCustomerPhone,'custName');
				return done(null, newCustomerPhone);
			});
		});
	});
};

module.exports = exports = function(conn){
	connection = conn || mongoose;
	return connection.model('CustomerPhone', schema);
};
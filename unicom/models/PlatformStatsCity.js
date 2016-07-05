/**
 * 城市按自然月统计模块
 * - 用户数
 * - 活跃用户数
 * - 订单数
 * - 成功订单数
 * - 失败订单数
 */
var mongoose = require('mongoose');
var async = require('async');
var connection = mongoose;

var schema = new mongoose.Schema({
	city: String, //** 城市名称
	year: Number, //** 年份
	month: Number, //** 月份
	userCount: Number, //** 注册用户数
	userActivityCount: Number, //** 活跃用户数
	orderCount: Number, //** 订单数
	orderSuccessCount: Number, //** 成功订单数
	orderFailureCount: Number, //** 失败订单数
	orderRevenue: String, //** 当月收入
	orderBonus: String, //** 当月佣金
	status: {
		type: String,
		enum: {
			values: '未核算|已核算'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		},
		default: '未核算',
	},
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
});

schema.set('collection', 'platform.stats.cities');

//** 按月统计各城市用户数
schema.statics.statAccountByMonthly = function(options, done){
	if(options instanceof Function){
		done = options;
		options = {};
	}
	var now = new Date();
	options.month = options.month || (now.getMonth() + 1);
	if(options.month < 1 || options.month > 12) options.month = now.getMonth() + 1;
	options.year = options.year || now.getFullYear();
	console.log(options);
	var Account = connection.model('Account');
	var StatsCity = connection.model('PlatformStatsCity');
	var aggregate = Account.aggregate();
	//** 按department.city分组
	aggregate.append({
		$group: {
			_id: '$department.city',
			userCount: {
				'$sum': 1
			}
		},
	});
	//** 逐个处理数据
	aggregate.exec(function(err,docs){
		if(err) return done(err);
		async.eachSeries(
			docs,
			function(doc,cb){
				StatsCity.findOneAndUpdate({
					city: doc._id,
					year: options.year,
					month: options.month,
				},{
					$set: {
						city: doc._id,
						year: options.year,
						month: options.month,
						userCount: doc.userCount || 0,
						lastupdatetime: new Date
					}
				},{
					'upsert': true,//** 不存在就创建
					'new': true,
				},function(err){
					if(err) return cb(err);
					cb();
				});
			},
			done);
	});	
};

schema.statics.statOrderByMonthly = function(options, done){
	if(options instanceof Function){
		done = options;
		options = {};
	}
	var now = new Date();
	options.month = options.month || (now.getMonth() + 1);
	if(options.month < 1 || options.month > 12) options.month = now.getMonth() + 1;
	options.year = options.year || now.getFullYear();
	console.log(options);
	var Order = connection.model('Order');
	var StatsCity = connection.model('PlatformStatsCity');
	var aggregate = Order.aggregate();
	//** 匹配当月成功订单
	aggregate.append({
		$match: {
			lastupdatetime: {
				$gte: new Date(options.year,options.month-1,1),
				$lt: options.month == 12 ? new Date(options.year + 1, 0, 1) : new Date(options.year,options.month, 1),
			},
			status: '成功',
		}
	});
	//** 按department.city分组
	aggregate.append({
		$group: {
			_id: '$department.city',
			orderCount: {
				'$sum': 1,
			},
			orderRevenue: {
				'$sum': '$total',
			},
		},
	});
	//** 逐个处理数据
	aggregate.exec(function(err,docs){
		if(err) return done(err);
		async.eachSeries(
			docs,
			function(doc,cb){
				StatsCity.findOneAndUpdate({
					city: doc._id,
					year: options.year,
					month: options.month,
				},{
					$set: {
						city: doc._id,
						year: options.year,
						month: options.month,
						orderCount: doc.orderCount || 0,
						orderRevenue: doc.orderRevenue || 0,
						lastupdatetime: new Date
					}
				},{
					'upsert': true,//** 不存在就创建
					'new': true,
				},function(err){
					if(err) return cb(err);
					cb();
				});
			},
			done);
	});	
};

module.exports = exports = function(conn){
	connection = conn || mongoose;
	return connection.model('PlatformStatsCity', schema);
};



/**
 * 财务模块
 * - 用户佣金发放
 */
var mongoose = require('mongoose');
var async = require('async');

var schema = new mongoose.Schema({
	uid: String, //** 用户ID
	name: String, //** 用户名
	mobile: String, //** 用户手机号
	year: Number, //** 年份
	month: Number, //** 月份
	amount: Number, //** 业务数额
	tax: Number, //** 税收
	cash: Number, //** 实际派发数额
	reason: String, //** 调整原因
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

schema.set('collection', 'finance.bonuses');

module.exports = exports = function(connection){
	connection = connection || mongoose;

	/**
	 * 统计指定月份的佣金数额
	 * @param  {[type]}   options [description]
	 * @param  {Function} done    [description]
	 * @return {[type]}           [description]
	 * 注意：options.month 月份[1~12]，而new Date()月份[0-11]
	 */
	schema.statics.statByMonthly = function(options,done){
		if(typeof options == 'function'){
			done = options;
			options = {};
		}
		var now = new Date();
		options.month = options.month || (now.getMonth() + 1);
		if(options.month < 1 || options.month > 12) options.month = now.getMonth() + 1;
		options.year = options.year || now.getFullYear();
		console.log(options);
		var Bonus = connection.model('FinanceBonus');
		var Order = connection.model('Order');
		var Account = connection.model('Account');

		var aggregate = Order.aggregate();

		//** 匹配当月成功订单
		aggregate.append({
			$match: {
				lastupdatetime: {
					$gte: new Date(options.year,options.month-1,1),
					$lt: options.month == 12 ? new Date(options.year + 1, 0, 1) : new Date(options.year,options.month, 1),
				},
				// status: '成功',
			}
		});

		//** 缩小数据量
		aggregate.append({
			$project: {
				quantity: 1,
				total: 1,
				bonus: 1,
				createBy:1,
				department: 1,
				status: 1,
				lastupdatetime: 1,
			}
		});

		//** 按createBy.mobile分组
		aggregate.append({
			$group: {
				_id: '$createBy.mobile',
				quantity: {
					'$sum': '$quantity',
				},
				total: {
					'$sum': '$total',
				},
				bonus: {
					'$sum': '$bonus',
				},
				count: {
					'$sum': 1
				}
			},
		});

		//** 逐个处理数据
		aggregate.exec(function(err,docs){
			if(err) return done(err);
			async.each(
				docs,
				function(doc,cb){
					Account
						.findOne(
							{
								email: doc._id,
							},
							function(err,account){
								if(err) return cb(err);
								if(!account) return cb();

								Bonus.findOneAndUpdate({
									mobile: account.email,
									year: options.year,
									month: options.month,
								},{
									$set: {
										uid: account._id,
										name: account.username,
										mobile: account.email,
										year: options.year,
										month: options.month,
										amount: doc.bonus,
										lastupdatetime: new Date
									}
								},{
									'upsert': true,//** 不存在就创建
									'new': true,
								},function(err){
									if(err) return cb(err);
									cb();
								});
							});
				},
				done);
		});

	};

	return connection.model('FinanceBonus', schema);
};
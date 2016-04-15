var mongoose = require('mongoose');
//** SP配置文件
var spConfig = require('../config/sp').SGIP12;
var _ = require('underscore');
var async = require('async');

var schema = new mongoose.Schema({
	customer: { //** 客户
		mobile: String, //** 客户手机号
		id: String, //** 客户Id(customer._id)
		name: String, //** 客户姓名
		idNo: String, //** 客户身份证号码
		idType: String, //** 客户身份证类型
		idAddress: String, //** 客户身份证地址
		address: String, //** 客户通讯地址
		phone: String, //** 客户备用联系电话
		location: String, //** 客户地理位置
	},
	goods: { //** 产品
		name: String, //** 产品名称(goods.name)
		id: String, //** 产品id(goods._id)
		category: String, //** 产品分类(goods.category)
		barcode: String, //** 产品编码(goods.barcode)
		smscode: String, //** 业务(SMS)编码(goods.smscode)
		price: Number, //** 产品单价(product.price)
		bonus: Number, //** 单个产品佣金
	},
	effect: { //** 生效方式
		type: String,
		enum: {
			values: '次月生效|立即生效'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
	thumbnail: String, //** 商品图标
	quantity: { //** 商品数量(product.quantity)
		type: Number,
		default: 0,
	},
	total: { //** 订单总价
		type: Number,
		default: 0,
	},
	bonus: { //** 订单佣金
		type: Number,
		default: 0,
	},
	createBy: { //** 订单创建者
		id: String,
		username: String,
		mobile: String,
		avatar: String,
	},
	department: {
		id: String,
		name: String, //** 营业厅名称
		city: String, //** 城市名称
		grid: String, //** 网格编码
		district: String, //** 地区编码			
	},
	status: { //** 订单状态
		type: String,
		enum: {
			values: '新建|已确认|已处理|成功|失败'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
	histories: [], //** 订单修改记录
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
});

schema.set('collection', 'orders');

module.exports = exports = function(connection){
	connection = connection || mongoose;

	/**
	 * 新增订单
	 * @param {[type]}   options [description]
	 * @param {Function} done    [description]
	 */
	schema.statics.add = function(options,done){
		var product = options.product;
		var mobiles = options.mobiles;
		var effect = options.effect;
		var account = options.account;

		var ProductDirect = connection.model('ProductDirect');
		var Order = connection.model('Order');
		var PlatformSms = connection.model('PlatformSms');
		var AccountActivity = connection.model('AccountActivity');
		//** 按单个手机执行
		async.each(
			mobiles,
			function(mobile,done){
				async.waterfall(
					[
						function getProduct(callback) {
							ProductDirect
								.findById(product._id)
								.exec(function(err, prod){
									if(err || !prod) return callback(err);
									var goods = prod.goods || {};
									var order = {
											customer: {
												mobile: mobile,
											},
											goods: goods,
											effect: effect,
											thumbnail: prod.thumbnail_url,
											quantity: 1,
											total: goods.price, 
											bonus: goods.bonus, 
											createBy: {//** 创建订单的用户
												id: account.accountId,
												username: account.username,
												mobile: account.email,
												avatar: account.avatar,
											},
											department: account.department,//** 创建订单的用户营业厅
											status: '新建',
										};
									callback(null,order);
								});
						},
						function createOrder(order,callback) {
							//** 查找3分钟前是否有类似订单，否则不创建
							var lastOrderDate = new Date(Date.now()-180000);
							Order
								.findOne({
									'customer.mobile': order.customer.mobile,
									'goods.barcode': order.goods.barcode,
									'lastupdatetime': {
										'$gt': lastOrderDate
									},
								})
								.exec(function(err,existOrder){
									if(err) return callback(err);
									//** 在3分钟内存在订单，则返回错误
									if(existOrder){
										return callback({code: 405123, errmsg: '同一客户、同一产品重复下单时间间隔不得小于3分钟'});
									}
									Order.create(order, function(err){
										if(err) return callback(err);
										callback(null,order);
									});
								});
						},
						function createSms(order,callback){
							var sms = {};
							//** sms业务代码部分
							sms.sender = String(order.goods && order.goods.smscode).replace(/\D/g,''); 
							sms.receiver = order.customer.mobile;
							sms.content = '订购'+ order.goods.name + '，回复Y，确认订购。';
							sms.status = '新建';
							PlatformSms
								.create(sms, function(err){
									if(err) return callback(err);
									callback(null);
								});
						},
						function createActivity(callback) {
							var activity = {
								uid: account.accountId,
								username: account.username,
								avatar: account.avatar || '/images/avatar.jpg',
								type: 'text',
								content: {
									body: '向朋友推荐了<u>' + product.name + '</u>产品',
								}
							};
							AccountActivity
								.create(activity, callback);
						}
					],
					function(err, result) {
						if (err) return done(err);
						done(null);
					});
			},
			done
		);
	};
	
	/**
	 * 处理2G/3G订单
	 * SMS状态：由收到 转化为 已处理
	 * Order状态：由新建 转化为 已处理
	 * @param {Function} callback [description]
	 */
	schema.statics.process2G_3G = function(options,done){
		if(arguments.length < 1) throw new Error('参数不足：function(options,done)');
		if(options instanceof Function) {
			done = options;
			options = {};
		}
		var SPNumber = options.SPNumber || spConfig.options.SPNumber;
		var PlatformSms = connection.model('PlatformSms');
		var Order = connection.model('Order');
		var _process = function(){
				//** find the order
				Order
					.findOneAndUpdate({
						'goods.category': {
							$in: ['2G','3G']
						},
						'status': '已确认',
					}, {
						$set: {
							status: '已处理',
						}
					}, {
						'upsert': false,
						'new': true,
					}, function(err, order) {
						if (err || !order) return done(err);
						//** TODO process 2G/3G order
						
						//** 发送业务“正在处理”短信
						_process(); //** 处理下一个
					});
			};
		_process();
	};
	/**
	 * 2G/3G 订单确认检查
	 * Order状态：由已处理转化为成功或失败
	 * @param {Function} callback [description]
	 */
	schema.statics.confirm2G_3G = function(options,done){
		if(arguments.length < 1) throw new Error('参数不足：function(options,done)');
		if(options instanceof Function) {
			done = options;
			options = {};
		}
		var Order = connection.model('Order');
		var _confirm = function() {
				Order
					.findOne({
						'goods.category': {
							$in: ['2G','3G']
						},
						status: '已处理',
					})
					.exec(function(err, order) {
						if (err) return done(err);
						if (!order) return done(null);
						//** check 2G/3G order
						VMSS.soap(function() {

						});
						var status = success ? '失败' : '成功';

						Order
							.findByIdAndUpdate(order._id, {
									$set: {
										status: status,
									}
								}, {
									'upsert': false,
									'new': true,
								},
								function(err, doc) {
									if (err || !doc) return done(err);
									_confirm();
								});

					});
				};
			_confirm();
		};

	/**
	 * 订单按人排名
	 * @param  {[type]}   options [description]
	 * @param  {Function} done    [description]
	 * @return {[type]}           [description]
	 */
	schema.statics.rankByPerson = function(options,done){
		var days = options.days;
		var place = options.place;
		var department = options.department;
		var per = options.per;
		var page = options.page;
		//** 计算时间跨度
		var now = new Date();
		var begin = new Date(now.getTime() - (days-1) * 24 * 3600 * 1000); 
		var beginYear = begin.getFullYear();
		var beginMonth = begin.getMonth();
		var beginDate = begin.getDate();
		//** 开始日期
		var startDate = new Date(beginYear, beginMonth, beginDate); 
		var nowYear = now.getFullYear();
		var nowMonth = now.getMonth();
		var nowDate = now.getDate() + 1;
		//** 截止日期
		var endDate = new Date(nowYear, nowMonth, nowDate); 

		var Order = connection.model('Order');
		var Account = connection.model('Account');
		var aggregate = Order.aggregate();

		switch(place){
			case 'city':
				//** 过滤时间段和department.city字段
				var city = (department && department.city) || '';
				aggregate.append({
					$match: {
						lastupdatetime: {
							$gte: startDate,
							// $lt: endDate,
						},
						'department.city': city,
					}
				});
				break;
			case 'grid':
				//** 过滤时间段和department.grid字段
				var grid = (department && department.grid) || '';
				aggregate.append({
					$match: {
						lastupdatetime: {
							$gte: startDate,
							// $lt: endDate,
						},
						'department.grid': grid,
					}
				});
				break;
			case 'district':
				//** 过滤时间段和department.distric字段
				var district = (department && department.district) || '';
				aggregate.append({
					$match: {
						lastupdatetime: {
							$gte: startDate,
							// $lt: endDate,
						},
						'department.district': district,
					}
				});
				break;
			case 'department':
			default:
				//** 过滤时间段和department.name字段
				var departmentName = (department && department.name) || '';
				aggregate.append({
					$match: {
						lastupdatetime: {
							$gte: startDate,
							// $lt: endDate,
						},
						'department.name': departmentName,
					}
				});
				break;
		}
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
		//** 按数量降序排列
		aggregate
			.sort({quantity: -1})
			.skip(per * page)
			.limit(per)
			.exec(function(err,docs){
				if(err) return done(err);
				//** 已获取按20个用户的统计信息
				//** 20个用户的_id
				var mobiles = [];
				// _.each(docs,function(doc){
				// 	mobiles.push(_.pick(doc,'_id'))
				// });
				mobiles = _.pluck(docs,'_id');
				//** 没有数据了
				if(mobiles.length == 0) return done(null,[]);
				//** 还有有数据
				Account
					.find({
						email: {
							$in: mobiles
						}
					})
					.select({
						username: 1,
						email: 1,
						department: 1,
					})
					// .select({}) //** 过滤信息
					.exec(function(err,users){
						if(err) return done(err);
						if(!users) return done(null,[]);
						var newUsers = [];
						_.each(users,function(user){
							var newUser = user.toJSON();
							//** 找到统计数组(mobile)中对应user的对象(email)
							var email = String(user.email);//** email = mobile
							var orderStat = _.findWhere(docs,{_id: email});
							//** 扩展对应user的统计信息
							newUser = _.defaults(newUser,orderStat);
							newUsers.push(newUser);
						});
						//** 返回带统计信息的用户数组
						done(null,_.sortBy(newUsers,'total').reverse());
					});
			});
	};
	/**
	 * 订单按营业厅排名
	 * @param  {[type]}   options [description]
	 * @param  {Function} done    [description]
	 * @return {[type]}           [description]
	 */
	schema.statics.rankByDepartment = function(options,done){
		var days = options.days;
		var place = options.place;
		var department = options.department;
		var per = options.per;
		var page = options.page;
		//** 计算时间跨度
		var now = new Date();
		var begin = new Date(now.getTime() - (days-1) * 24 * 3600 * 1000); 
		var beginYear = begin.getFullYear();
		var beginMonth = begin.getMonth();
		var beginDate = begin.getDate();
		//** 开始日期
		var startDate = new Date(beginYear, beginMonth, beginDate); 
		var nowYear = now.getFullYear();
		var nowMonth = now.getMonth();
		var nowDate = now.getDate() + 1;
		//** 截止日期
		var endDate = new Date(nowYear, nowMonth, nowDate); 

		var Order = connection.model('Order');
		var Account = connection.model('Account');
		var aggregate = Order.aggregate();

		switch(place){
			case 'city':
				//** 过滤时间段和department.city字段
				var city = (department && department.city) || '';
				aggregate.append({
					$match: {
						lastupdatetime: {
							$gte: startDate,
							// $lt: endDate,
						},
						'department.city': city,
					}
				});
				break;
			case 'district':
				//** 过滤时间段和department.distric字段
				var district = (department && department.district) || '';
				aggregate.append({
					$match: {
						lastupdatetime: {
							$gte: startDate,
							// $lt: endDate,
						},
						'department.district': district,
					}
				});
				break;

			case 'grid':
			default:
				//** 过滤时间段和department.grid字段
				var grid = (department && department.grid) || '';
				aggregate.append({
					$match: {
						lastupdatetime: {
							$gte: startDate,
							// $lt: endDate,
						},
						'department.grid': grid,
					}
				});
				break;
		}
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
		//** 按department.name分组
		aggregate.append({
			$group: {
				_id: '$department.name',
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
		//** 按数量降序排列
		aggregate
			.sort({quantity: -1})
			.skip(per * page)
			.limit(per)
			.exec(function(err,docs){
				if(err) return done(err);
				//** 已获取按20个department.name的统计信息
				return done(null,docs);
				//** 20个用户的_id
				var mobiles = [];
				// _.each(docs,function(doc){
				// 	mobiles.push(_.pick(doc,'_id'))
				// });
				mobiles = _.pluck(docs,'_id');
				//** 没有数据了
				if(mobiles.length == 0) return done(null,[]);
				//** 还有有数据
				Account
					.find({
						email: {
							$in: mobiles
						}
					})
					.select({
						username: 1,
						email: 1,
					})
					// .select({}) //** 过滤信息
					.exec(function(err,users){
						if(err) return done(err);
						if(!users) return done(null,[]);
						var newUsers = [];
						_.each(users,function(user){
							var newUser = user.toJSON();
							//** 找到统计数组(mobile)中对应user的对象(email)
							var email = String(user.email);//** email = mobile
							var orderStat = _.findWhere(docs,{_id: email});
							//** 扩展对应user的统计信息
							newUser = _.defaults(newUser,orderStat);
							newUsers.push(newUser);
						});
						//** 返回带统计信息的用户数组
						done(null,_.sortBy(newUsers,'total').reverse());
					});
			});
	};

	return connection.model('Order', schema);
};


// //Deprecated!!
// customerInfo: { //** 客户其他信息
// 	name: String,
// 	idNo: String, //** 客户身份证号码
// 	idType: String, //** 客户身份证类型
// 	idAddress: String, //** 客户身份证地址
// 	address: String, //** 客户通讯地址
// 	phone: String,//** 客户备用联系电话
// 	location: String, //** 客户地理位置
// },
// //Deprecated!!
// name: String, //** 订单编码
// description: String, //** 订单描述
// category: { //** 订单分类
// 	type: String,
// 	enum: {
// 		values: '数据订购|传统增值|内容推荐|活动推荐|号卡|终端|金币兑换'.split('|'),
// 		message: 'enum validator failed for path {PATH} with value {VALUE}',
// 	}
// },
// bonus: { //** 佣金情况
// income: Number,
// times: Number,
// points: {
// 	type: Number,
// 	default: 0
// },
// cash: {
// 	type: Number,
// 	default: 0
// },
// cashStatus: {
// 	type: String,
// 	enum: {
// 		values: '冻结|一次解冻|二次解冻|三次解冻|全部解冻'.split('|'),
// 		message: 'enum validator failed for path {PATH} with value {VALUE}',
// 	},
// 	default: '冻结',
// },			
// },
// place: {
// 	name: String,//** 订单发生地
// },
// dispatch: { //** 订单配送
// 	method: {
// 		type: String,
// 		enum: {
// 			values: '自提|物流'.split('|'),
// 			message: 'enum validator failed for path {PATH} with value {VALUE}',
// 		}
// 	},
// 	phone: String,
// 	address: String,
// },

// 	PlatformSms
// 		.findOneAndUpdate({
// 			status: '收到',
// 			category: {
// 				$in: ['2G','3G']
// 			}
// 		}, {
// 			$set: {
// 				status: '已处理',
// 			}
// 		}, {
// 			'upsert': false,
// 			'new': true,
// 		}, function(err, doc) {
// 			if (err || !doc) return done(err);
// 			var content = doc.content || '';
// 			//** 只要不是明确回复N（全角半角都算）或否，或不，或不回复，都订上
// 			if(!/[N|n|Ｎ|ｎ|不|否]/.test(content)){
// 				//** 提取客户号码，去除最前面的86
// 				var mobile = (doc.sender || '').replace(/^86/, '');
// 				//** 提取业务(短信)代码，去除SPNumber(10655836)部分
// 				var regexSmscode = new RegExp('^' + SPNumber, 'i');
// 				var smscode = (doc.receiver || '').replace(regexSmscode,'');
// 				//** find the order
// 				Order
// 					.findOneAndUpdate({
// 						'customer.mobile': mobile,
// 						'goods.smscode': smscode,
// 						'goods.category': {
// 							$in: ['2G','3G']
// 						},
// 						'status': '已确认',
// 					}, {
// 						$set: {
// 							status: '已处理',
// 						}
// 					}, {
// 						'upsert': false,
// 						'new': true,
// 					}, function(err, order) {
// 						if (err || !order) return done(err);
// 						//** TODO process 2G/3G order
						
// 						//** 发送业务“正在处理”短信
// 						_process(); //** 处理下一个
// 					});
// 			}
// 		});	
// };
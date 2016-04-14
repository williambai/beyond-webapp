var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(), __filename));

//** SP 短信配置
var configSp = require('../config/sp').SGIP12;

exports = module.exports = function(app, models) {
	var _ = require('underscore');
	var async = require('async');

	var add = function(req, res) {
		var product = req.body.product || {};
		var mobiles = req.body.mobile || [];
		mobiles = _.without(mobiles, '');
		//** 按单个手机执行
		async.each(
			mobiles,
			function(mobile,done){
				async.waterfall(
					[
						function getProduct(callback) {
							models.ProductDirect
								.findById(product._id)
								.exec(function(err, prod){
									if(err || !prod) return callback(err);
									var goods = prod.goods || {};
									var order = {
											customer: {
												mobile: mobile,
											},
											goods: goods,
											thumbnail: prod.thumbnail_url,
											quantity: 1,
											total: goods.price, 
											bonus: goods.bonus, 
											createBy: {//** 创建订单的用户
												id: req.session.accountId,
												username: req.session.username,
												mobile: req.session.email,
												avatar: req.session.avatar,
											},
											department: req.session.department,//** 创建订单的用户营业厅
											status: '新建',
										};
									callback(null,order);
								});
						},
						function createOrder(order,callback) {
							//** 查找3分钟前是否有类似订单，否则不创建
							var lastOrderDate = new Date(Date.now()-180000);
							models.Order
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
									models.Order.create(order, function(err){
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
							models.PlatformSms
								.create(sms, function(err){
									if(err) return callback(err);
									callback(null);
								});
						},
						function createActivity(callback) {
							var activity = {
								uid: req.session.accountId,
								username: req.session.username,
								avatar: req.session.avatar || '/images/avatar.jpg',
								type: 'text',
								content: {
									body: '向朋友推荐了<u>' + product.name + '</u>产品',
								}
							};
							models.AccountActivity
								.create(activity, callback);
						}
					],
					function(err, result) {
						if (err) return done(err);
						done(null);
					});
			},
			function(err){
				if (err) return res.send(err);
				res.send({});
			}
		);

	};
	var getOne = function(req, res) {
		var id = req.params.id;
		models.Order
			.findById(id)
			.exec(function(err, doc) {
				if (err) return res.send(err);
				res.send(doc);
			});
	};
	var getMore = function(req, res) {
		var action = req.query.action || '';
		var per = req.query.per || 20;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;
		switch (action) {
			case 'rankp': //** 个人排行
				var days = parseInt(req.query.days || 1); //** 向前天数
				var place = req.query.place || 'department'; //** 数据过滤/切分类型

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

				var aggregate = models.Order.aggregate();

				switch(place){
					case 'city':
						//** 过滤时间段和department.city字段
						var city = (req.session.department && req.session.department.city) || '';
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
						var grid = (req.session.department && req.session.department.grid) || '';
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
						var district = (req.session.department && req.session.department.district) || '';
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
						var departmentName = (req.session.department && req.session.department.name) || '';
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
						if(err) return res.send(err);
						//** 已获取按20个用户的统计信息
						//** 20个用户的_id
						var mobiles = [];
						// _.each(docs,function(doc){
						// 	mobiles.push(_.pick(doc,'_id'))
						// });
						mobiles = _.pluck(docs,'_id');
						//** 没有数据了
						if(mobiles.length == 0) return res.send([]);
						//** 还有有数据
						models.Account
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
								if(err || !users) return res.send(err || []);
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
								res.send(_.sortBy(newUsers,'total').reverse());
							});
					});
				break;
			case 'rankg': //** 营业厅排行
				var days = parseInt(req.query.days || 1); //** 向前天数
				var place = req.query.place || 'grid'; //** 数据过滤/切分类型

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

				var aggregate = models.Order.aggregate();

				switch(place){
					case 'city':
						//** 过滤时间段和department.city字段
						var city = (req.session.department && req.session.department.city) || '';
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
						var district = (req.session.department && req.session.department.district) || '';
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
						var grid = (req.session.department && req.session.department.grid) || '';
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
						if(err) return res.send(err);
						//** 已获取按20个department.name的统计信息
						return res.send(docs);
						//** 20个用户的_id
						var mobiles = [];
						// _.each(docs,function(doc){
						// 	mobiles.push(_.pick(doc,'_id'))
						// });
						mobiles = _.pluck(docs,'_id');
						//** 没有数据了
						if(mobiles.length == 0) return res.send([]);
						//** 还有有数据
						models.Account
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
								if(err || !users) return res.send(err || []);
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
								res.send(_.sortBy(newUsers,'total').reverse());
							});
					});
				break;
			case 'search':
				var searchStr = req.query.searchStr || '';
				var searchRegex = new RegExp(searchStr, 'i');
				var status = req.query.status;
				var query = models.Order.find({
					$or: [{
						'name': {
							$regex: searchRegex
						}
					}, {
						'url': {
							$regex: searchRegex
						}
					}]
				});
				if (!_.isEmpty(status)) {
					query.where({
						status: status
					});
				}
				query.sort({
						_id: -1
					})
					.skip(per * page)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
				break;
			case 'category':
				models.Order
					.find({
						category: req.query.category,
						status: '有效',
					})
					.skip(per * page)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
				break;
			default:
				models.Order
					.find({})
					.sort({_id: -1})
					.skip(per * page)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
		}
	};
	/**
	 * router outline
	 */
	/**
	 * add public/orders
	 * action:
	 *     
	 */
	app.post('/public/orders', app.isLogin, add);

	/**
	 * get public/orders
	 */
	app.get('/public/orders/:id', app.isLogin, getOne);

	/**
	 * get public/orders
	 * action:
	 * 	    //** 
	 *      action=rankp&days=?&categoy=? //** 个人排行：查看在指定天数days内，指定category类型的所有按“用户名”订单的汇总，如 ?days=7&category=city
	 *      action=rankg&days=?&category=? //** 团队排行：查看在指定天数days内，指定category类型，指定分类content的所有"部门"department订单的汇总
	 */
	app.get('/public/orders', app.isLogin, getMore);
};
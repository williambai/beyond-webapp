var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(), __filename));

exports = module.exports = function(app, models) {
	var _ = require('underscore');
	var async = require('async');

	var add = function(req, res) {
		var product = req.body.product || {};
		var mobiles = req.body.mobile || [];
		mobiles = _.without(mobiles, '');
		async.waterfall(
			[
				function product(callback) {
					models.ProductDirect
						.findById(product._id)
						.exec(function(err,prod){
							if(err) return callback(err);
							var goods = prod.goods || {};
							var orders = [];
							_.each(mobiles, function(mobile) {
								orders.push({
									customer: {
										mobile: mobile,
									},
									goods: goods,
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
								});
							});
							callback(null,orders);
						});
				},
				function order(orders,callback) {
					models.Order.create(orders, function(err){
						if(err) return callback(err);
						callback(null);
					});
				},
				// function activity(docs, callback) {
				// 	var activity = {
				// 		uid: req.session.accountId,
				// 		username: req.session.username,
				// 		avatar: req.session.avatar || '/images/avatar.jpg',
				// 		type: 'text',
				// 		content: {
				// 			body: '向朋友推荐了<u>' + product.name + '</u>产品',
				// 		}
				// 	};
				// 	models.AccountActivity.create(activity, callback);
				// }
			],
			function(err, result) {
				if (err) return res.send(err);
				res.send({});
			});
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
				var days = parseInt(req.query.days || 0); //** 向前天数
				var category = req.query.category || 'city'; //** 数据过滤/切分类型
				// var content = req.query.content || ''; //** 用户session中对应的"所在Xx"
				var now = new Date();
				var nowYear = now.getFullYear();
				var nowMonth = now.getMonth();
				var nowDate = now.getDate() + 1;
				var begin = new Date(now.getTime() + days * 24 * 3600 * 1000); //** 开始时间
				var beginYear = begin.getFullYear();
				var beginMonth = begin.getMonth();
				var beginDate = begin.getDate() + days;
				var startDate = new Date(beginYear, beginMonth, beginDate); //开始日期
				var endDate = new Date(nowYear, nowMonth, nowDate); // 截止日期

				var aggregate = models.Order.aggregate();
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
				switch(category){
					case 'city':
						//** 过滤时间段和department.city字段
						aggregate.append({
							$match: {
								lastupdatetime: {
									$gte: startDate,
									$lt: endDate,
								},
								'department.city': req.session.department.city || '',
							}
						});
						break;
					case 'grid':
						//** 过滤时间段和department.grid字段
						aggregate.append({
							$match: {
								lastupdatetime: {
									$gte: startDate,
									$lt: endDate,
								},
								'department.grid': req.session.department.grid || '',
							}
						});
						break;
					case 'district':
						//** 过滤时间段和department.distric字段
						aggregate.append({
							$match: {
								lastupdatetime: {
									$gte: startDate,
									$lt: endDate,
								},
								'department.district': req.session.department.district || '',
							}
						});
						break;
					case 'department':
					default:
						//** 过滤时间段和department.name字段
						aggregate.append({
							$match: {
								lastupdatetime: {
									$gte: startDate,
									$lt: endDate,
								},
								'department.name': req.session.department.name || '',
							}
						});
						break;
				}
				//** 按用户名分组
				aggregate.append({
					$group: {
						_id: '$createBy.id',
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
						var userIds = _.pluck(docs,'_id');
						models.Account
							.find({
								_id: {
									$or: userIds 
								}
							})
							// .select({}) //** 过滤信息
							.exec(function(err,users){
								if(err) return res.send(err);
								_.each(users,function(user){
									//** 找到统计数组中对应user的对象
									var orderStat = _.findWhere(docs,{_id: user._id});
									//** 扩展对应user的统计信息
									_.extend(user,orderStat);
								});
								//** 返回带统计信息的用户数组
								res.send(users);
							});
					});
				break;
			case 'rankg': //** 营业厅排行
				res.send([]);
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
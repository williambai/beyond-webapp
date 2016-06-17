var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(), __filename));
var regexp = require('../libs/regexp');

//** SP 短信配置
var configSp = require('../config/sp').SGIP12;
var _ = require('underscore');

exports = module.exports = function(app, models) {

	var add = function(req, res) {
		var product = req.body.product || {};
		var mobiles = req.body.mobile || [];
		var effect = req.body.effect || '次月生效';
		mobiles = _.without(mobiles, '');
		models.Order
			.add({
				product: product,
				mobiles: mobiles,
				effect: effect,
				account: req.session,
			},function(err){
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
				var days = parseInt(req.query.days || 1); //** 向前天数
				var place = req.query.place || 'department'; //** 数据过滤/切分类型
				models.Order.rankByPerson({
					days: days,
					place: place,
					department: req.session.department || {},
					per: per,
					page: page,
				}, function(err,docs){
					if(err) return res.send(err);
					res.send(docs);
				});
				break;
			case 'rankg': //** 营业厅排行
				var days = parseInt(req.query.days || 1); //** 向前天数
				var place = req.query.place || 'grid'; //** 数据过滤/切分类型
				models.Order.rankByPerson({
					days: days,
					place: place,
					department: req.session.department || {},
					per: per,
					page: page,
				}, function(err,docs){
					if(err) return res.send(err);
					res.send(docs);
				});
				break;
			case 'search':
				var searchStr = req.query.searchStr || '';
				var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
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
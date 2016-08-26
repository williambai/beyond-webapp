var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var regexp = require('../libs/regexp');
var _ = require('underscore');
var async = require('async');

 exports = module.exports = function(app, models) {

	var add = function(req, res) {
		var email = req.query.uid || '';
		models.Account
			.findOne({
				email: email
			}, function(err,account){
				if(err) return res.send(err);
				//** 如果用户不存在，因有地区差异，不能用默认用户订购，只能返回错误
				if(!account) return res.send({code: 401123, errmsg: '业务员账号不存在，无法订购，请您的联系业务员。'});
				var product = req.body.product || {};
				var mobiles = req.body.mobile || [];
				var action = 'order'; 
				var effect = req.body.effect || '次月生效';
				mobiles = _.without(mobiles, '');
				models.Order
					.add({
						action: action, 
						product: product,
						mobiles: mobiles,
						effect: effect,
						account: account,
					},function(err){
						if (err) return res.send(err);
						res.send({});
					});
			});
	};
	var getOne = function(req, res) {
 		var id = req.params.id;
 		models.ProductDirect
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
 		//** 找到用户的Account的email，确定其所在的城市
 		var email = req.query.uid;
 		if(!email) return res.send([]);
 		models.Account.findOne({
 			email: email
 		},function(err,account){
 			if(err) return res.send(err);
 			if(!account) return res.send([]);
	 		//** 根据用户的department.city属性，显示限定区域的产品
			var scopeRegex = new RegExp('(全省' + ((account && account.department && account.department.city) ? ('|' + (account.department.city)) : '|全省') + ')','i');
	 		switch(action){
	 			case 'category':
					var searchStr = decodeURIComponent(req.query.category) || '';
					var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
	 				models.ProductDirect
	 					.find({
	 						scope: {
	 							$regex: scopeRegex
	 						},
	 						category: {
	 							$regex: searchRegex
	 						},
	 						status: '有效',
	 					})
			 			.sort({display_sort: -1})
			 			.skip(per * page)
			 			.limit(per)
			 			.exec(function(err, docs) {
			 				if (err) return res.send(err);
			 				res.send(docs);
			 			});
	 				break;
	 			case 'hot':
	 				res.send([]);
	 				break;
	 			default:
			 		models.ProductDirect
			 			.find({
	 						scope: {
	 							$regex: scopeRegex
	 						},
			 				status: '有效',
			 			})
			 			.sort({display_sort: -1})
			 			.skip(per * page)
			 			.limit(per)
			 			.exec(function(err, docs) {
			 				if (err) return res.send(err);
			 				res.send(docs);
			 			});
	 		}

 		});


  	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * post public/products
 	 */
 	app.post('/public/products1', add);
 	/**
 	 * get public/products
 	 */
 	app.get('/public/products1/:id', getOne);

 	/**
 	 * get public/products
 	 * action:
 	 *      action=category&category=xxx
 	 */
 	app.get('/public/products1', getMore);
 };
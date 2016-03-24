var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

 exports = module.exports = function(app, models) {
	var _ = require('underscore');
 	var async = require('async');

 	// var add = function(req, res) {
 	// 	var product = req.body.product || {};
 	// 	var mobiles = req.body.mobile || [];
 	// 	mobiles = _.without(mobiles,'');
 	// 	var docs = [];
 	// 	_.each(mobiles, function(mobile){
 	// 		docs.push({
 	// 			name: product.name || '',
 	// 			description: product.description || '',
 	// 			category: '数据订购',
 	// 			items: [{
 	// 				id: product._id,
 	// 				model: 'ProductGoods',
 	// 				name: product.name || '',
 	// 				price: product.price || 0,
 	// 				quantity: 1,
 	// 				category: product.category || '',
 	// 				source: product.goods || {},
 	// 			}],
 	// 			total: product.price || 0,
 	// 			dispatch: '自提',
		// 		customer: {
		// 			id: mobile,
		// 		},
		// 		status: '新建',
 	// 			createBy: {
 	// 				id: req.session.accountId,
 	// 				username: req.session.username,
 	// 				mobile: req.session.email,
		// 			avatar: req.session.avatar,
 	// 			},
 	// 			bonus: product.bonus,
 	// 		});
 	// 	});
 	// 	async.waterfall(
 	// 		[
 	// 			function(callback){
		// 			models.Order.create(docs,callback);
 	// 			},
 	// 			function(docs,callback){
 	// 				var activity = {
 	// 					uid: req.session.accountId,
 	// 					username: req.session.username,
 	// 					avatar: req.session.avatar || '/images/avatar.jpg',
 	// 					type: 'text',
 	// 					content: {
 	// 						body: '向朋友推荐了<u>' + product.name + '</u>产品',
 	// 					}
 	// 				};
 	// 				models.AccountActivity.create(activity,callback);
 	// 			}
 	// 		],function(err,result) {
 	// 		if (err) return res.send(err);
 	// 		res.send({});
 	// 	});
 	// };
 	// var remove = function(req,res){
		// res.send({});
 	// };
 	// var update = function(req, res) {
		// res.send({});
 	// };
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
 		switch(action){
 			case 'category':
				var category = req.query.category || '';
				var searchRegex = new RegExp(category, 'i');
 				models.ProductDirect
 					.find({
 						category: {
 							$regex: searchRegex
 						},
 						// status: '有效',
 					})
		 			.skip(per * page)
		 			.limit(per)
		 			.exec(function(err, docs) {
		 				if (err) return res.send(err);
		 				res.send(docs);
		 			});
 				break;
 			default:
		 		models.ProductDirect
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
 	 * get public/products
 	 */
 	app.get('/public/products/:id', app.isLogin, getOne);

 	/**
 	 * get public/products
 	 * action:
 	 *      action=category&category=xxx
 	 */
 	app.get('/public/products', app.isLogin, getMore);
 };
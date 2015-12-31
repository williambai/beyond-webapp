var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:channel.product.direct');
logger.setLevel('INFO');

 exports = module.exports = function(app, models) {
	var _ = require('underscore');
 	var async = require('async');

 	var add = function(req, res) {
 		var product = req.body.product || {};
 		var mobiles = req.body.mobile || [];
 		mobiles = _.without(mobiles,'');
 		var docs = [];
 		_.each(mobiles, function(mobile){
 			docs.push({
 				name: product.subject || '',
 				description: product.description || '',
 				category: '数据订购',
 				items: [{
 					id: product._id,
 					model: 'ProductGoods',
 					name: product.subject,
 					price: product.price || 0,
 					quantity: 1,
 					category: product.category || '',
 					source: product.goods || {},
 				}],
 				total: product.price || 0,
 				dispatch: '自提',
				customer: {
					id: mobile,
				},
				status: '新建',
 				createBy: {
 					id: req.session.accountId,
 					username: req.session.username,
 					mobile: req.session.email,
					avatar: req.session.avatar,
 				}
 			});
 		});
 		async.waterfall(
 			[
 				function(callback){
					models.Order.create(docs,callback);
 				},
 				function(docs,callback){
 					var activity = {
 						uid: req.session.accountId,
 						username: req.session.username,
 						avatar: req.session.avatar || '/images/avatar.jpg',
 						type: 'text',
 						content: {
 							body: '向朋友推荐了<u>' + product.subject + '</u>产品',
 						}
 					};
 					models.AccountActivity.create(activity,callback);
 				}
 			],function(err,result) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
		res.send({});
 	};
 	var update = function(req, res) {
		res.send({});
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
 		var type = req.query.type || '';
 		var per = req.query.per || 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		switch(type){
 			case 'category':
 				models.ProductDirect
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
 	 * add channel/product/goods
 	 * type:
 	 *     
 	 */
 	app.post('/channel/product/goods', app.grant, add);
 	/**
 	 * update channel/product/goods
 	 * type:
 	 *     
 	 */
 	app.put('/channel/product/goods/:id', update);

 	/**
 	 * delete channel/product/goods
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/product/goods/:id', remove);
 	/**
 	 * get channel/product/goods
 	 */
 	app.get('/channel/product/goods/:id', app.grant, getOne);

 	/**
 	 * get channel/product/goods
 	 * type:
 	 *      type=category&category=xxx
 	 */
 	app.get('/channel/product/goods', app.grant, getMore);
 };
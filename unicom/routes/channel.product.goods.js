var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:channel.product.goods');
logger.setLevel('INFO');

 exports = module.exports = function(app, models) {
	var _ = require('underscore');
 	var async = require('async');

 	var add = function(req, res) {
 		var mobiles = req.body.mobile || [];
 		mobiles = _.without(mobiles,'');
 		var docs = [];
 		_.each(mobiles, function(mobile){
 			docs.push({
 				customer: {
 					mobile: mobile,
 				},
 				product: req.body.product || {},
 				goods: req.body.goods || {},
 				status: '新建',
 				createBy: {
 					id: req.session.accountId,
 					name: req.session.username,
 					mobile: req.session.email,
 				}
 			});
 		});
 		async.waterfall(
 			[
 				function(callback){
					models.WoOrder.create(docs,callback);
 				},
 				function(docs,callback){
 					var activity = {
 						uid: req.session.accountId,
 						username: req.session.username,
 						avatar: req.session.avatar || '/images/avatar.jpg',
 						type: 'text',
 						content: {
 							body: '向朋友推荐了<u>' + req.body.product.name + '</u>产品',
 						}
 					};
 					models.AccountActivity.create(activity,callback);
 				}
 			],function(err,result) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
  	// var add = function(req, res) {
 	// 	var doc = new models.PromoteProduct(req.body);
 	// 	doc.save(function(err) {
 	// 		if (err) return res.send(err);
 	// 		res.send({});
 	// 	});
 	// };
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.PromoteProduct.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.PromoteProduct.findByIdAndUpdate(id, {
 				$set: set
 			}, {
 				'upsert': false,
 				'new': true,
 			},
 			function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			}
 		);
 	};
 	var getOne = function(req, res) {
 		var id = req.params.id;
 		models.PromoteProduct
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
 				models.PromoteProduct
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
		 		models.PromoteProduct
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
 	app.post('/channel/product/goods', add);
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
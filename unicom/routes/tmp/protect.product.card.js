var _ = require('underscore');
var async = require('async');
var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var regexp = require('../libs/regexp');

 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var action = req.body.action || '';
 		switch (action) {
 			case 'import':
 				// importData(req, res);
 				break;
 			default:
				var doc = req.body;
		 		models.ProductCard.create(doc, function(err) {
		 			if (err) return res.send(err);
		 			res.send({});
		 		});
		  		break;
 		}
 	};

 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ProductCard.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.ProductCard.findByIdAndUpdate(id, {
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
 		models.ProductCard
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
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
 				var status = req.query.status;
 				var query = models.ProductCard.find({
 					$or: [{
 						'name': {
 							$regex: searchRegex
 						}
 					}, {
 						'goods.name': {
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
 				models.ProductCard
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
 			case 'export': 
 				// exportData(req,res);
 				break;
 			default:
		 		models.ProductCard
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
 	 * add product/cards
 	 * action:
 	 *     
 	 */
 	app.post('/product/cards', app.grant, add);
 	/**
 	 * update product/cards
 	 * action:
 	 *     
 	 */
 	app.put('/product/cards/:id', app.grant, update);

 	/**
 	 * delete product/cards
 	 * action:
 	 *     
 	 */
 	app.delete('/product/cards/:id', app.grant, remove);
 	/**
 	 * get product/cards
 	 */
 	app.get('/product/cards/:id', app.grant, getOne);

 	/**
 	 * get product/cards
 	 * action:
 	 *      action=category&category=xxx
 	 */
 	app.get('/product/cards', app.grant, getMore);
 };
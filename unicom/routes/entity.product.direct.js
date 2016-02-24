var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:product.direct');
logger.setLevel('INFO');

 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var add = function(req, res) {
 		var doc = new models.ProductDirect(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ProductDirect.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.ProductDirect.findByIdAndUpdate(id, {
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
 			case 'search':
	 			var searchStr = req.query.searchStr || '';
	 			var searchRegex = new RegExp(searchStr, 'i');
	 			var status = req.query.status;
	 			var category = req.query.category;
	 			var query = models.ProductDirect.find({
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
	 				query.where({status: status});
	 			}
	 			if(!_.isEmpty(category)){
	 				query.where({category: category});
	 			};
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
 	 * add product/directs
 	 * action:
 	 *     
 	 */
 	app.post('/product/directs', app.grant, add);
 	/**
 	 * update product/directs
 	 * action:
 	 *     
 	 */
 	app.put('/product/directs/:id', app.grant, update);

 	/**
 	 * delete product/directs
 	 * action:
 	 *     
 	 */
 	app.delete('/product/directs/:id', app.grant, remove);
 	/**
 	 * get product/directs
 	 */
 	app.get('/product/directs/:id', app.grant, getOne);

 	/**
 	 * get product/directs
 	 * action:
 	 *      action=category&category=xxx
 	 */
 	app.get('/product/directs', app.grant, getMore);
 };
var regexp = require('../libs/regexp');

exports = module.exports = function(app, models) {
 	var _ = require('underscore');
 	
 	var add = function(req, res) {
 		var doc = new models.ProductExchange(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ProductExchange.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.ProductExchange.findByIdAndUpdate(id, {
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
 		models.ProductExchange
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var action = req.query.action || '';
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		var per = 20;

 		switch (action) {
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
 				var status = req.query.status;
 				var query = models.ProductExchange.find({
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
 			default:
 				models.ProductExchange
 					.find({})
 					.sort({
 						_id: -1
 					})
 					.skip(per * page)
 					.limit(per)
 					.exec(function(err, docs) {
 						if (err) return res.send(err);
 						res.send(docs);
 					});
 				break;
 		}
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add product/exchanges
 	 * type:
 	 *     
 	 */
 	app.post('/product/exchanges', add);
 	/**
 	 * update product/exchanges
 	 * type:
 	 *     
 	 */
 	app.put('/product/exchanges/:id', update);

 	/**
 	 * delete product/exchanges
 	 * type:
 	 *     
 	 */
 	app.delete('/product/exchanges/:id', remove);
 	/**
 	 * get product/exchanges
 	 */
 	app.get('/product/exchanges/:id', getOne);

 	/**
 	 * get product/exchanges
 	 * type:
 	 */
 	app.get('/product/exchanges', getMore);
 };
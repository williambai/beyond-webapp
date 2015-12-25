var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:promote.product');
logger.setLevel('INFO');

 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.PromoteProduct(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
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
 	 * add promote/products
 	 * type:
 	 *     
 	 */
 	app.post('/promote/products', add);
 	/**
 	 * update promote/products
 	 * type:
 	 *     
 	 */
 	app.put('/promote/products/:id', update);

 	/**
 	 * delete promote/products
 	 * type:
 	 *     
 	 */
 	app.delete('/promote/products/:id', remove);
 	/**
 	 * get promote/products
 	 */
 	app.get('/promote/products/:id', app.grant, getOne);

 	/**
 	 * get promote/products
 	 * type:
 	 *      type=category&category=xxx
 	 */
 	app.get('/promote/products', app.grant, getMore);
 };
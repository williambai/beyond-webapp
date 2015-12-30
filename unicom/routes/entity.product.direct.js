var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:product.direct');
logger.setLevel('INFO');

 exports = module.exports = function(app, models) {

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
 	 * add product/directs
 	 * type:
 	 *     
 	 */
 	app.post('/product/directs', add);
 	/**
 	 * update product/directs
 	 * type:
 	 *     
 	 */
 	app.put('/product/directs/:id', update);

 	/**
 	 * delete product/directs
 	 * type:
 	 *     
 	 */
 	app.delete('/product/directs/:id', remove);
 	/**
 	 * get product/directs
 	 */
 	app.get('/product/directs/:id', getOne);

 	/**
 	 * get product/directs
 	 * type:
 	 *      type=category&category=xxx
 	 */
 	app.get('/product/directs', getMore);
 };
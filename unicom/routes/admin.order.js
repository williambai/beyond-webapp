var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:promote.product');
logger.setLevel('INFO');

 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
		res.send({});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.Order.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Order.findByIdAndUpdate(id, {
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
 		models.Order
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
 	 * add admin/orders
 	 * type:
 	 *     
 	 */
 	app.post('/admin/orders', add);
 	/**
 	 * update admin/orders
 	 * type:
 	 *     
 	 */
 	app.put('/admin/orders/:id', update);

 	/**
 	 * delete admin/orders
 	 * type:
 	 *     
 	 */
 	app.delete('/admin/orders/:id', remove);
 	/**
 	 * get admin/orders
 	 */
 	app.get('/admin/orders/:id', getOne);

 	/**
 	 * get admin/orders
 	 * type:
 	 */
 	app.get('/admin/orders', getMore);
 };
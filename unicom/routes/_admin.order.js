 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var add = function(req, res) {
 		var doc = new models.Order(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.Order.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
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
 		var action = req.query.action || '';
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		var per = 20;

 		switch (action) {
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(searchStr, 'i');
 				var status = req.query.status;
 				var query = models.Order.find({
 					$or: [{
 						'name': {
 							$regex: searchRegex
 						}
 					}, {
 						'category': {
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
 				models.Order
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
 	 * add admin/orders
 	 * action:
 	 *     
 	 */
 	app.post('/admin/orders', add);
 	/**
 	 * update admin/orders
 	 * action:
 	 *     
 	 */
 	app.put('/admin/orders/:id', update);

 	/**
 	 * delete admin/orders
 	 * action:
 	 *     
 	 */
 	app.delete('/admin/orders/:id', remove);
 	/**
 	 * get admin/orders
 	 */
 	app.get('/admin/orders/:id', getOne);

 	/**
 	 * get admin/orders
 	 * action:
 	 */
 	app.get('/admin/orders', getMore);
 };
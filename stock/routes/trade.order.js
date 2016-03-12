 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.TradeOrder(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.TradeOrder.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.TradeOrder.findByIdAndUpdate(id, {
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
 		models.TradeOrder
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.TradeOrder
 			.find({})
 			.skip(per * page)
 			.limit(per)
 			.exec(function(err, docs) {
 				if (err) return res.send(err);
 				res.send(docs);
 			});
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add trade/orders
 	 * type:
 	 *     
 	 */
 	app.post('/trade/orders', add);
 	/**
 	 * update trade/orders
 	 * type:
 	 *     
 	 */
 	app.put('/trade/orders/:id', update);

 	/**
 	 * delete trade/orders
 	 * type:
 	 *     
 	 */
 	app.delete('/trade/orders/:id', remove);
 	/**
 	 * get trade/orders
 	 */
 	app.get('/trade/orders/:id', getOne);

 	/**
 	 * get trade/orders
 	 * type:
 	 */
 	app.get('/trade/orders', getMore);
 };
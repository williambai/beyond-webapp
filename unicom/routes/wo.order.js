 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.WoOrder(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.WoOrder.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.WoOrder.findByIdAndUpdate(id, {
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
 		models.WoOrder
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

 		models.WoOrder
 			.find({})
 			.sort({_id: -1})
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
 	 * add wo/orders
 	 * type:
 	 *     
 	 */
 	app.post('/wo/orders', add);
 	/**
 	 * update wo/orders
 	 * type:
 	 *     
 	 */
 	app.put('/wo/orders/:id', update);

 	/**
 	 * delete wo/orders
 	 * type:
 	 *     
 	 */
 	app.delete('/wo/orders/:id', remove);
 	/**
 	 * get wo/orders
 	 */
 	app.get('/wo/orders/:id', getOne);

 	/**
 	 * get wo/orders
 	 * type:
 	 */
 	app.get('/wo/orders', getMore);
 };
 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.OrderCard(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.OrderCard.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.OrderCard.findByIdAndUpdate(id, {
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
 		models.OrderCard
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

 		models.OrderCard
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
 	 * add order/cards
 	 * type:
 	 *     
 	 */
 	app.post('/order/cards', add);
 	/**
 	 * update order/cards
 	 * type:
 	 *     
 	 */
 	app.put('/order/cards/:id', update);

 	/**
 	 * delete order/cards
 	 * type:
 	 *     
 	 */
 	app.delete('/order/cards/:id', remove);
 	/**
 	 * get order/cards
 	 */
 	app.get('/order/cards/:id', getOne);

 	/**
 	 * get order/cards
 	 * type:
 	 */
 	app.get('/order/cards', getMore);
 };
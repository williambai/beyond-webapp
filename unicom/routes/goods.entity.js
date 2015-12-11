 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.GoodsEntity(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.GoodsEntity.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.GoodsEntity.findByIdAndUpdate(id, {
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
 		models.GoodsEntity
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

 		models.GoodsEntity
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
 	 * add goods/entities
 	 * type:
 	 *     
 	 */
 	app.post('/goods/entities', add);
 	/**
 	 * update goods/entities
 	 * type:
 	 *     
 	 */
 	app.put('/goods/entities/:id', update);

 	/**
 	 * delete goods/entities
 	 * type:
 	 *     
 	 */
 	app.delete('/goods/entities/:id', remove);
 	/**
 	 * get goods/entities
 	 */
 	app.get('/goods/entities/:id', getOne);

 	/**
 	 * get goods/entities
 	 * type:
 	 */
 	app.get('/goods/entities', getMore);
 };
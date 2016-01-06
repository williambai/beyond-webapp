 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.Goods(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.Goods.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Goods.findByIdAndUpdate(id, {
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
 		models.Goods
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

 		models.Goods
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
 	 * add goods
 	 * type:
 	 *     
 	 */
 	app.post('/goods', add);
 	/**
 	 * update goods
 	 * type:
 	 *     
 	 */
 	app.put('/goods/:id', update);

 	/**
 	 * delete goods
 	 * type:
 	 *     
 	 */
 	app.delete('/goods/:id', remove);
 	/**
 	 * get goods
 	 */
 	app.get('/goods/:id', getOne);

 	/**
 	 * get goods
 	 * type:
 	 */
 	app.get('/goods', getMore);
 };
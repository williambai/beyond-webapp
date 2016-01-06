 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.ProductCardPackage(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ProductCardPackage.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.ProductCardPackage.findByIdAndUpdate(id, {
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
 		models.ProductCardPackage
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

 		models.ProductCardPackage
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
 	 * add product/card/packages
 	 * type:
 	 *     
 	 */
 	app.post('/product/card/packages', add);
 	/**
 	 * update product/card/packages
 	 * type:
 	 *     
 	 */
 	app.put('/product/card/packages/:id', update);

 	/**
 	 * delete product/card/packages
 	 * type:
 	 *     
 	 */
 	app.delete('/product/card/packages/:id', remove);
 	/**
 	 * get product/card/packages
 	 */
 	app.get('/product/card/packages/:id', getOne);

 	/**
 	 * get product/card/packages
 	 * type:
 	 */
 	app.get('/product/card/packages', getMore);
 };
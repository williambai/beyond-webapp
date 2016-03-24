 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.ProductCategory(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.ProductCategory.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.ProductCategory.findByIdAndUpdate(id, {
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
 		if (id.length != 24) {
 			models.ProductCategory
 				.findOne({
 					nickname: id,
 				})
 				.exec(function(err, doc) {
 					if (err) return res.send(err);
 					res.send(doc);
 				});
 			return;
 		}
 		models.ProductCategory
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

 		models.ProductCategory
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
 	 * add protect/product/categories
 	 * type:
 	 *     
 	 */
 	app.post('/protect/product/categories',  add);
 	/**
 	 * update protect/product/categories
 	 * type:
 	 *     
 	 */
 	app.put('/protect/product/categories/:id',  update);

 	/**
 	 * delete protect/product/categories
 	 * type:
 	 *     
 	 */
 	app.delete('/protect/product/categories/:id',  remove);
 	/**
 	 * get protect/product/categories
 	 */
 	app.get('/protect/product/categories/:id', getOne);

 	/**
 	 * get protect/product/categories
 	 * type:
 	 */
 	app.get('/protect/product/categories', getMore);
 };
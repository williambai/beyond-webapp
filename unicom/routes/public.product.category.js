 exports = module.exports = function(app, models) {

 	var getOne = function(req, res) {
 		var id = req.params.id;
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
 			.find({
 				'status': '有效'
 			})
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
 	 * get protect/product/categories
 	 */
 	app.get('/public/product/categories/:id', app.isLogin, getOne);

 	/**
 	 * get public/product/categories
 	 * type:
 	 */
 	app.get('/public/product/categories', app.isLogin, getMore);
 };
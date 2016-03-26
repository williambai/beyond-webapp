 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.PlatformCarousel(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.PlatformCarousel.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.PlatformCarousel.findByIdAndUpdate(id, {
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
 			models.PlatformCarousel
 				.findOne({
 					nickname: id,
 				})
 				.exec(function(err, doc) {
 					if (err) return res.send(err);
 					res.send(doc);
 				});
 			return;
 		}
 		models.PlatformCarousel
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

 		models.PlatformCarousel
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
 	 * add protect/carousels
 	 * type:
 	 *     
 	 */
 	app.post('/protect/carousels', app.grant, add);
 	/**
 	 * update protect/carousels
 	 * type:
 	 *     
 	 */
 	app.put('/protect/carousels/:id', app.grant, update);

 	/**
 	 * delete protect/carousels
 	 * type:
 	 *     
 	 */
 	app.delete('/protect/carousels/:id', app.grant, remove);
 	/**
 	 * get protect/carousels
 	 */
 	app.get('/protect/carousels/:id', app.grant, getOne);

 	/**
 	 * get protect/carousels
 	 * type:
 	 */
 	app.get('/protect/carousels', app.isLogin, getMore);
 };
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
 	 * add carousels
 	 * type:
 	 *     
 	 */
 	app.post('/carousels', add);
 	/**
 	 * update carousels
 	 * type:
 	 *     
 	 */
 	app.put('/carousels/:id', update);

 	/**
 	 * delete carousels
 	 * type:
 	 *     
 	 */
 	app.delete('/carousels/:id', remove);
 	/**
 	 * get carousels
 	 */
 	app.get('/carousels/:id', getOne);

 	/**
 	 * get carousels
 	 * type:
 	 */
 	app.get('/carousels', getMore);
 };
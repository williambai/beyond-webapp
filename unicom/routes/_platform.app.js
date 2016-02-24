 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.PlatformApp(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.PlatformApp.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.PlatformApp.findByIdAndUpdate(id, {
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
 			models.PlatformApp
 				.findOne({
 					nickname: id,
 				})
 				.exec(function(err, doc) {
 					if (err) return res.send(err);
 					res.send(doc);
 				});
 			return;
 		}
 		models.PlatformApp
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

 		models.PlatformApp
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
 	 * add platform/apps
 	 * type:
 	 *     
 	 */
 	app.post('/platform/apps', app.grant, add);
 	/**
 	 * update platform/apps
 	 * type:
 	 *     
 	 */
 	app.put('/platform/apps/:id', app.grant, update);

 	/**
 	 * delete platform/apps
 	 * type:
 	 *     
 	 */
 	app.delete('/platform/apps/:id', app.grant, remove);
 	/**
 	 * get platform/apps
 	 */
 	app.get('/platform/apps/:id', app.grant, getOne);

 	/**
 	 * get platform/apps
 	 * type:
 	 */
 	app.get('/platform/apps', app.isLogin, getMore);
 };
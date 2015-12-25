 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.PlatformFeature(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.PlatformFeature.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.PlatformFeature.findByIdAndUpdate(id, {
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
 		models.PlatformFeature
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

 		models.PlatformFeature
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
 	 * add platform/features
 	 * type:
 	 *     
 	 */
 	app.post('/platform/features', add);
 	/**
 	 * update platform/features
 	 * type:
 	 *     
 	 */
 	app.put('/platform/features/:id', update);

 	/**
 	 * delete platform/features
 	 * type:
 	 *     
 	 */
 	app.delete('/platform/features/:id', remove);
 	/**
 	 * get platform/features
 	 */
 	app.get('/platform/features/:id', getOne);

 	/**
 	 * get platform/features
 	 * type:
 	 */
 	app.get('/platform/features', getMore);
 };
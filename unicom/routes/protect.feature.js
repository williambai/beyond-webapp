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
 		var action = req.query.action || '';
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		switch(action){
 			case 'all':
		 		models.PlatformFeature
		 			.find({})
		 			.exec(function(err, docs) {
		 				if (err) return res.send(err);
		 				res.send(docs);
		 			});
 				break;
 			default:
		 		models.PlatformFeature
		 			.find({})
		 			.skip(per * page)
		 			.limit(per)
		 			.exec(function(err, docs) {
		 				if (err) return res.send(err);
		 				res.send(docs);
		 			});
 				break;
 		}
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add protect/features
 	 * action:
 	 *     
 	 */
 	app.post('/protect/features', app.grant, add);
 	/**
 	 * update protect/features
 	 * action:
 	 *     
 	 */
 	app.put('/protect/features/:id', app.grant, update);

 	/**
 	 * delete protect/features
 	 * action:
 	 *     
 	 */
 	app.delete('/protect/features/:id', app.grant, remove);
 	/**
 	 * get protect/features
 	 */
 	app.get('/protect/features/:id', app.grant, getOne);

 	/**
 	 * get protect/features
 	 * action:
 	 */
 	app.get('/protect/features', app.isLogin, getMore);
 };
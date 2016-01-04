 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.Revenue(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.Revenue.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Revenue.findByIdAndUpdate(id, {
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
 		models.Revenue
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

 		models.Revenue
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
 	 * add revenues
 	 * type:
 	 *     
 	 */
 	app.post('/revenues', add);
 	/**
 	 * update revenues
 	 * type:
 	 *     
 	 */
 	app.put('/revenues/:id', update);

 	/**
 	 * delete revenues
 	 * type:
 	 *     
 	 */
 	app.delete('/revenues/:id', remove);
 	/**
 	 * get revenues
 	 */
 	app.get('/revenues/:id', getOne);

 	/**
 	 * get revenues
 	 * type:
 	 */
 	app.get('/revenues', getMore);
 };
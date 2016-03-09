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
 	 * add channel/revenues
 	 * type:
 	 *     
 	 */
 	app.post('/channel/revenues', add);
 	/**
 	 * update channel/revenues
 	 * type:
 	 *     
 	 */
 	app.put('/channel/revenues/:id', update);

 	/**
 	 * delete channel/revenues
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/revenues/:id', remove);
 	/**
 	 * get channel/revenues
 	 */
 	app.get('/channel/revenues/:id', getOne);

 	/**
 	 * get channel/revenues
 	 * type:
 	 */
 	app.get('/channel/revenues', getMore);
 };
 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.PageRecommend(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.PageRecommend.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.PageRecommend.findByIdAndUpdate(id, {
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
 		models.PageRecommend
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

 		models.PageRecommend
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
 	 * add page/recommends
 	 * type:
 	 *     
 	 */
 	app.post('/page/recommends', add);
 	/**
 	 * update page/recommends
 	 * type:
 	 *     
 	 */
 	app.put('/page/recommends/:id', update);

 	/**
 	 * delete page/recommends
 	 * type:
 	 *     
 	 */
 	app.delete('/page/recommends/:id', remove);
 	/**
 	 * get page/recommends
 	 */
 	app.get('/page/recommends/:id', getOne);

 	/**
 	 * get page/recommends
 	 * type:
 	 */
 	app.get('/page/recommends', getMore);
 };
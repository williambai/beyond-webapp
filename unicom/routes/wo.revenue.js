 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.WoRevenue(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.WoRevenue.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.WoRevenue.findByIdAndUpdate(id, {
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
 		models.WoRevenue
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

 		models.WoRevenue
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
 	 * add wo/revenues
 	 * type:
 	 *     
 	 */
 	app.post('/wo/revenues', add);
 	/**
 	 * update wo/revenues
 	 * type:
 	 *     
 	 */
 	app.put('/wo/revenues/:id', update);

 	/**
 	 * delete wo/revenues
 	 * type:
 	 *     
 	 */
 	app.delete('/wo/revenues/:id', remove);
 	/**
 	 * get wo/revenues
 	 */
 	app.get('/wo/revenues/:id', getOne);

 	/**
 	 * get wo/revenues
 	 * type:
 	 */
 	app.get('/wo/revenues', getMore);
 };
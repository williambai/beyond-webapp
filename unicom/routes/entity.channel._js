 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.Channel(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.Channel.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Channel.findByIdAndUpdate(id, {
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
 		models.Channel
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

 		models.Channel
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
 	 * add channels
 	 * type:
 	 *     
 	 */
 	app.post('/channels', add);
 	/**
 	 * update channels
 	 * type:
 	 *     
 	 */
 	app.put('/channels/:id', update);

 	/**
 	 * delete channels
 	 * type:
 	 *     
 	 */
 	app.delete('/channels/:id', remove);
 	/**
 	 * get channels
 	 */
 	app.get('/channels/:id', getOne);

 	/**
 	 * get channels
 	 * type:
 	 */
 	app.get('/channels', getMore);
 };
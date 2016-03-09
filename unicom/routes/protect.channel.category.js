 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.ChannelCategory(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ChannelCategory.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.ChannelCategory.findByIdAndUpdate(id, {
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
 		models.ChannelCategory
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

 		models.ChannelCategory
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
 	 * add channel/categories
 	 * type:
 	 *     
 	 */
 	app.post('/channel/categories', app.grant, add);
 	/**
 	 * update channel/categories
 	 * type:
 	 *     
 	 */
 	app.put('/channel/categories/:id', app.grant, update);

 	/**
 	 * delete channel/categories
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/categories/:id', app.grant, remove);
 	/**
 	 * get channel/categories
 	 */
 	app.get('/channel/categories/:id', app.grant, getOne);

 	/**
 	 * get channel/categories
 	 * type:
 	 */
 	app.get('/channel/categories', app.grant, getMore);
 };
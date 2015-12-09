 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.ChannelEntity(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ChannelEntity.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.ChannelEntity.findByIdAndUpdate(id, {
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
 		models.ChannelEntity
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

 		models.ChannelEntity
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
 	 * add channel/entities
 	 * type:
 	 *     
 	 */
 	app.post('/channel/entities', add);
 	/**
 	 * update channel/entities
 	 * type:
 	 *     
 	 */
 	app.put('/channel/entities/:id', update);

 	/**
 	 * delete channel/entities
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/entities/:id', remove);
 	/**
 	 * get channel/entities
 	 */
 	app.get('/channel/entities/:id', getOne);

 	/**
 	 * get channel/entities
 	 * type:
 	 */
 	app.get('/channel/entities', getMore);
 };
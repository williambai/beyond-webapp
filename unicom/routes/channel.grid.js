 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.ChannelGrid(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ChannelGrid.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.ChannelGrid.findByIdAndUpdate(id, {
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
 		models.ChannelGrid
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

 		models.ChannelGrid
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
 	 * add channel/grids
 	 * type:
 	 *     
 	 */
 	app.post('/channel/grids', add);
 	/**
 	 * update channel/grids
 	 * type:
 	 *     
 	 */
 	app.put('/channel/grids/:id', update);

 	/**
 	 * delete channel/grids
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/grids/:id', remove);
 	/**
 	 * get channel/grids
 	 */
 	app.get('/channel/grids/:id', getOne);

 	/**
 	 * get channel/grids
 	 * type:
 	 */
 	app.get('/channel/grids', getMore);
 };
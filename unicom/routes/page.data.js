 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.PageData(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.PageData.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.PageData.findByIdAndUpdate(id, {
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
 		models.PageData
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

 		models.PageData
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
 	 * add page/data
 	 * type:
 	 *     
 	 */
 	app.post('/page/data', add);
 	/**
 	 * update page/data
 	 * type:
 	 *     
 	 */
 	app.put('/page/data/:id', update);

 	/**
 	 * delete page/data
 	 * type:
 	 *     
 	 */
 	app.delete('/page/data/:id', remove);
 	/**
 	 * get page/data
 	 */
 	app.get('/page/data/:id', getOne);

 	/**
 	 * get page/data
 	 * type:
 	 */
 	app.get('/page/data', getMore);
 };
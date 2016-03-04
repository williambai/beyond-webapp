 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.Page(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.Page.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Page.findByIdAndUpdate(id, {
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
 		models.Page
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

 		models.Page
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
 	 * add pages
 	 * type:
 	 *     
 	 */
 	app.post('/pages', add);
 	/**
 	 * update pages
 	 * type:
 	 *     
 	 */
 	app.put('/pages/:id', update);

 	/**
 	 * delete pages
 	 * type:
 	 *     
 	 */
 	app.delete('/pages/:id', remove);
 	/**
 	 * get pages
 	 */
 	app.get('/pages/:id', getOne);

 	/**
 	 * get pages
 	 * type:
 	 */
 	app.get('/pages', getMore);
 };
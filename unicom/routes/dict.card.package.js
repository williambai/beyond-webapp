 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.DictCardPackage(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.DictCardPackage.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.DictCardPackage.findByIdAndUpdate(id, {
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
 		models.DictCardPackage
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

 		models.DictCardPackage
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
 	 * add dict/card/packages
 	 * type:
 	 *     
 	 */
 	app.post('/dict/card/packages', add);
 	/**
 	 * update dict/card/packages
 	 * type:
 	 *     
 	 */
 	app.put('/dict/card/packages/:id', update);

 	/**
 	 * delete dict/card/packages
 	 * type:
 	 *     
 	 */
 	app.delete('/dict/card/packages/:id', remove);
 	/**
 	 * get dict/card/packages
 	 */
 	app.get('/dict/card/packages/:id', getOne);

 	/**
 	 * get dict/card/packages
 	 * type:
 	 */
 	app.get('/dict/card/packages', getMore);
 };
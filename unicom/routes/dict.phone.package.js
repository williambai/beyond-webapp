 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.DictPhonePackage(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.DictPhonePackage.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.DictPhonePackage.findByIdAndUpdate(id, {
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
 		models.DictPhonePackage
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

 		models.DictPhonePackage
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
 	 * add dict/phone/packages
 	 * type:
 	 *     
 	 */
 	app.post('/dict/phone/packages', add);
 	/**
 	 * update dict/phone/packages
 	 * type:
 	 *     
 	 */
 	app.put('/dict/phone/packages/:id', update);

 	/**
 	 * delete dict/phone/packages
 	 * type:
 	 *     
 	 */
 	app.delete('/dict/phone/packages/:id', remove);
 	/**
 	 * get dict/phone/packages
 	 */
 	app.get('/dict/phone/packages/:id', getOne);

 	/**
 	 * get dict/phone/packages
 	 * type:
 	 */
 	app.get('/dict/phone/packages', getMore);
 };
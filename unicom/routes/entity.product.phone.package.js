 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var pid = req.params.pid;
		models.ProductPhone.findByIdAndUpdate(pid, {
				$push: {
					'packages': req.body
				}
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
 	var remove = function(req,res){
 		var pid = req.params.pid;
 		var id = req.params.id;
		models.ProductPhone.findByIdAndUpdate(pid, {
				$pull: {
					'packages': {
						_id: id
					},
				}
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
 	var update = function(req, res) {
 		var pid = req.params.pid;
 		var id = req.params.id;
 		var set = req.body;
 		models.ProductPhone.findByIdAndUpdate(pid, {
 				$set: {
 					// 'packages['+ 'id]': set
 				}
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
 		models.ProductPhonePackage
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var pid = req.params.pid;
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.ProductPhone
 			.findOne({_id: pid})
 			.select({packages: 1})
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc.packages.slice(per*page,per));
 			});
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add product/phone/:pid/packages
 	 * type:
 	 *     
 	 */
 	app.post('/product/phone/:pid/packages', add);
 	/**
 	 * update product/phone/:pid/packages
 	 * type:
 	 *     
 	 */
 	app.put('/product/phone/:pid/packages/:id', update);

 	/**
 	 * delete product/phone/:pid/packages
 	 * type:
 	 *     
 	 */
 	app.delete('/product/phone/:pid/packages/:id', remove);
 	/**
 	 * get product/phone/:pid/packages
 	 */
 	app.get('/product/phone/:pid/packages/:id', getOne);

 	/**
 	 * get product/phone/:pid/packages
 	 * type:
 	 */
 	app.get('/product/phone/:pid/packages', getMore);
 };
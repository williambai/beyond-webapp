 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.Customer(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.Customer.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Customer.findByIdAndUpdate(id, {
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
 		models.Customer
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

 		models.Customer
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
 	 * add customers
 	 * type:
 	 *     
 	 */
 	app.post('/customers', add);
 	/**
 	 * update customers
 	 * type:
 	 *     
 	 */
 	app.put('/customers/:id', update);

 	/**
 	 * delete customers
 	 * type:
 	 *     
 	 */
 	app.delete('/customers/:id', remove);
 	/**
 	 * get customers
 	 */
 	app.get('/customers/:id', getOne);

 	/**
 	 * get customers
 	 * type:
 	 */
 	app.get('/customers', getMore);
 };
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
 	 * add channel/customers
 	 * type:
 	 *     
 	 */
 	app.post('/channel/customers', app.grant, add);
 	/**
 	 * update channel/customers
 	 * type:
 	 *     
 	 */
 	app.put('/channel/customers/:id', app.grant, update);

 	/**
 	 * delete channel/customers
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/customers/:id', app.grant, remove);
 	/**
 	 * get channel/customers
 	 */
 	app.get('/channel/customers/:id', app.grant, getOne);

 	/**
 	 * get channel/customers
 	 * type:
 	 */
 	app.get('/channel/customers', app.grant, getMore);
 };
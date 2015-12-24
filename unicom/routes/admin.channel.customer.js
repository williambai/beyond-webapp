 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.ChannelCustomer(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ChannelCustomer.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.ChannelCustomer.findByIdAndUpdate(id, {
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
 		models.ChannelCustomer
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

 		models.ChannelCustomer
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
 	app.post('/channel/customers', add);
 	/**
 	 * update channel/customers
 	 * type:
 	 *     
 	 */
 	app.put('/channel/customers/:id', update);

 	/**
 	 * delete channel/customers
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/customers/:id', remove);
 	/**
 	 * get channel/customers
 	 */
 	app.get('/channel/customers/:id', getOne);

 	/**
 	 * get channel/customers
 	 * type:
 	 */
 	app.get('/channel/customers', getMore);
 };
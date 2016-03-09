 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.OrderExchange(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.OrderExchange.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.OrderExchange.findByIdAndUpdate(id, {
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
 		models.OrderExchange
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var type = req.query.type || '';
 		var per = req.query.per || 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		switch(type){
 			case 'category':
 				models.OrderExchange
 					.find({
 						category: req.query.category,
 						status: '有效',
 					})
		 			.skip(per * page)
		 			.limit(per)
		 			.exec(function(err, docs) {
		 				if (err) return res.send(err);
		 				res.send(docs);
		 			});
 				break;
 			default:
		 		models.OrderExchange
		 			.find({})
		 			.skip(per * page)
		 			.limit(per)
		 			.exec(function(err, docs) {
		 				if (err) return res.send(err);
		 				res.send(docs);
		 			});
 		}
  	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add channel/order/exchanges
 	 * type:
 	 *     
 	 */
 	app.post('/channel/order/exchanges', add);
 	/**
 	 * update channel/order/exchanges
 	 * type:
 	 *     
 	 */
 	app.put('/channel/order/exchanges/:id', update);

 	/**
 	 * delete channel/order/exchanges
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/order/exchanges/:id', remove);
 	/**
 	 * get channel/order/exchanges
 	 */
 	app.get('/channel/order/exchanges/:id', getOne);

 	/**
 	 * get channel/order/exchanges
 	 * type:
 	 *      type=category&category=xxx
 	 */
 	app.get('/channel/order/exchanges', getMore);
 };
 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.PlatformWeChatCustomer(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.PlatformWeChatCustomer.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.PlatformWeChatCustomer.findByIdAndUpdate(id, {
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
 		if (id.length != 24) {
 			models.PlatformWeChatCustomer
 				.findOne({
 					nickname: id,
 				})
 				.exec(function(err, doc) {
 					if (err) return res.send(err);
 					res.send(doc);
 				});
 			return;
 		}
 		models.PlatformWeChatCustomer
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

 		models.PlatformWeChatCustomer
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
 	 * add platform/wechat/customers
 	 * type:
 	 *     
 	 */
 	app.post('/platform/wechat/customers', app.grant, add);
 	/**
 	 * update platform/wechat/customers
 	 * type:
 	 *     
 	 */
 	app.put('/platform/wechat/customers/:id', app.grant, update);

 	/**
 	 * delete platform/wechat/customers
 	 * type:
 	 *     
 	 */
 	app.delete('/platform/wechat/customers/:id', app.grant, remove);
 	/**
 	 * get platform/wechat/customers
 	 */
 	app.get('/platform/wechat/customers/:id', app.grant, getOne);

 	/**
 	 * get platform/wechat/customers
 	 * type:
 	 */
 	app.get('/platform/wechat/customers', app.grant, getMore);
 };
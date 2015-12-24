 exports = module.exports = function(app, models) {

 	var products = require('../models/ProductCardPackage');
 	
 	var add = function(req, res) {
 		var model = req.body;
 		var product = model.product;
 		model.items = [];
 		for(var i in product){
 			var item = products[product[i]];
 			item.quantity = 1,
 			model.items.push(item);
 		}
 		res.send(model);
 		// var doc = new models.Order(model);
 		// doc.save(function(err) {
 		// 	if (err) return res.send(err);
 		// 	res.send({});
 		// });
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.Order.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Order.findByIdAndUpdate(id, {
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
 		models.Order
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

 		models.Order
 			.find({
 				'category': '号卡'
 			})
 			.sort({_id: -1})
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
 	 * add admin/order/cards
 	 * type:
 	 *     
 	 */
 	app.post('/admin/order/cards', add);
 	/**
 	 * update admin/order/cards
 	 * type:
 	 *     
 	 */
 	app.put('/admin/order/cards/:id', update);

 	/**
 	 * delete admin/order/cards
 	 * type:
 	 *     
 	 */
 	app.delete('/admin/order/cards/:id', remove);
 	/**
 	 * get admin/order/cards
 	 */
 	app.get('/admin/order/cards/:id', getOne);

 	/**
 	 * get admin/order/cards
 	 * type:
 	 */
 	app.get('/admin/order/cards', getMore);
 };
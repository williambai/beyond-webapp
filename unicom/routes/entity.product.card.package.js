 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var add = function(req, res) {
 		var doc = new models.ProductCardPackage(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ProductCardPackage.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.ProductCardPackage.findByIdAndUpdate(id, {
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
 		models.ProductCardPackage
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var action = req.query.action || '';
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		var per = 20;

 		switch (action) {
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(searchStr, 'i');
 				var status = req.query.status;
 				var query = models.ProductCardPackage.find({
 					$or: [{
 						'name': {
 							$regex: searchRegex
 						}
 					}, {
 						'category': {
 							$regex: searchRegex
 						}
 					}]
 				});
 				if (!_.isEmpty(status)) {
 					query.where({
 						status: status
 					});
 				}
 				query.sort({
 						_id: -1
 					})
 					.skip(per * page)
 					.limit(per)
 					.exec(function(err, docs) {
 						if (err) return res.send(err);
 						res.send(docs);
 					});
 				break;
 			case 'cardType':
 				var cardType = req.query.cardType || '';
 				models.ProductCardPackage
 					.find({
 						cardType: {
 							$in: [cardType]
 						},
 						status: '有效',
 					})
 					.select({cardType:0})
 					.exec(function(err,docs){
 						if (err) return res.send(err);
 						res.send(docs);
 					});
 				break;	
 			default:
 				models.ProductCardPackage
 					.find({})
 					.sort({
 						_id: -1
 					})
 					.skip(per * page)
 					.limit(per)
 					.exec(function(err, docs) {
 						if (err) return res.send(err);
 						res.send(docs);
 					});
 				break;
 		};
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add product/card/packages
 	 * action:
 	 *     
 	 */
 	app.post('/product/card/packages', add);
 	/**
 	 * update product/card/packages
 	 * action:
 	 *     
 	 */
 	app.put('/product/card/packages/:id', update);

 	/**
 	 * delete product/card/packages
 	 * action:
 	 *     
 	 */
 	app.delete('/product/card/packages/:id', remove);
 	/**
 	 * get product/card/packages
 	 */
 	app.get('/product/card/packages/:id', getOne);

 	/**
 	 * get product/card/packages
 	 * action:
 	 *       action=search&searchStr=
 	 *       action=cardType&cardType=
 	 */
 	app.get('/product/card/packages', getMore);
 };
var log4js = require('log4js'); 
var path = require('path');
log4js.configure(path.join(__dirname,'../config/log4js.json'));
var logger = log4js.getLogger('server');
logger.setLevel('DEBUG');

exports = module.exports = function(app, models) {
 	var add = function(req, res) {
 		var doc = new models.WoOrder(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.WoOrder.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.WoOrder.findByIdAndUpdate(id, {
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
 		models.WoOrder
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var type = req.query.type || '';
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		switch (type) {
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(searchStr, 'i');
 				Account.find({
 						$or: [{
 							'customer.name': {
 								$regex: searchRegex
 							}
 						}, {
 							'customer.mobile': {
 								$regex: searchRegex
 							}
 						}]
 					})
 					.skip(per * page)
 					.limit(per)
 					.exec(function(err, docs) {
 						if (err) return res.send(err);
 						res.send(docs);
 					});
 				break;
 			case 'stat':
 				break;
 			default:
 				models.WoOrder
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
 		}
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add channel/orders
 	 * type:
 	 *     
 	 */
 	app.post('/channel/orders', app.grant, add);
 	/**
 	 * update channel/orders
 	 * type:
 	 *     
 	 */
 	app.put('/channel/orders/:id', update);

 	/**
 	 * delete channel/orders
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/orders/:id', remove);
 	/**
 	 * get channel/orders
 	 */
 	app.get('/channel/orders/:id', getOne);

 	/**
 	 * get channel/orders
 	 * type:
 	 * 	    type=search&searchStr=
 	 *      type=stat
 	 */
 	app.get('/channel/orders', app.grant, getMore);
 };
var log4js = require('log4js'); 
var logger = log4js.getLogger('route:channel.order');


exports = module.exports = function(app, models) {
 	var add = function(req, res) {
		res.send({});
 	};
 	var remove = function(req, res) {
		res.send({});
 	};
 	var update = function(req, res) {
		res.send({});
 	};
 	var getOne = function(req, res) {
		res.send({});
 	};
 	var getMore = function(req, res) {
 		var type = req.query.type || '';
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		switch (type) {
 			case 'stat':
 				res.send({});
 				break;
 			default:
 				models.Order
 					.find({
 						'createBy.id': req.session.accountId,
 					})
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
 	app.put('/channel/orders/:id', app.grant, update);

 	/**
 	 * delete channel/orders
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/orders/:id', app.grant, remove);
 	/**
 	 * get channel/orders
 	 */
 	app.get('/channel/orders/:id', app.grant, getOne);

 	/**
 	 * get channel/orders
 	 * type:
 	 * 	    type=search&searchStr=
 	 *      type=stat
 	 */
 	app.get('/channel/orders', app.grant, getMore);
 };
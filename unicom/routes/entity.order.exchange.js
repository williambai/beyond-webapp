var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:order.exchange');
logger.setLevel('INFO');

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
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.OrderExchange
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
 	 * add order/exchanges
 	 * type:
 	 *     
 	 */
 	app.post('/order/exchanges', add);
 	/**
 	 * update order/exchanges
 	 * type:
 	 *     
 	 */
 	app.put('/order/exchanges/:id', update);

 	/**
 	 * delete order/exchanges
 	 * type:
 	 *     
 	 */
 	app.delete('/order/exchanges/:id', remove);
 	/**
 	 * get order/exchanges
 	 */
 	app.get('/order/exchanges/:id', getOne);

 	/**
 	 * get order/exchanges
 	 * type:
 	 */
 	app.get('/order/exchanges', getMore);
};
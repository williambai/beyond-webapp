var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var _ = require('underscore');

 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.TradeStrategy(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.TradeStrategy.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		set = _.omit(set, '_id');
 		models.TradeStrategy.findByIdAndUpdate(id, {
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
 		models.TradeStrategy
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

 		models.TradeStrategy
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
 	 * add trade/strategies
 	 * type:
 	 *     
 	 */
 	app.post('/trade/strategies', add);
 	/**
 	 * update trade/strategies
 	 * type:
 	 *     
 	 */
 	app.put('/trade/strategies/:id', update);

 	/**
 	 * delete trade/strategies
 	 * type:
 	 *     
 	 */
 	app.delete('/trade/strategies/:id', remove);
 	/**
 	 * get trade/strategies
 	 */
 	app.get('/trade/strategies/:id', getOne);

 	/**
 	 * get trade/strategies
 	 * type:
 	 */
 	app.get('/trade/strategies', getMore);
 };
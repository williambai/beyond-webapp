var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));

exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.TradePortfolioHistory(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.TradePortfolioHistory.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.TradePortfolioHistory.findByIdAndUpdate(id, {
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
 		models.TradePortfolioHistory
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

 		models.TradePortfolioHistory
 			.find({})
 			.skip(per * page)
 			.limit(per)
 			.select({
 				'backup.transactions': 0
 			})
 			.exec(function(err, docs) {
 				if (err) return res.send(err);
 				res.send(docs);
 			});
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add trade/portfolio/histroies
 	 * type:
 	 *     
 	 */
 	app.post('/trade/portfolio/histroies', add);
 	/**
 	 * update trade/portfolio/histroies
 	 * type:
 	 *     
 	 */
 	app.put('/trade/portfolio/histroies/:id', update);

 	/**
 	 * delete trade/portfolio/histroies
 	 * type:
 	 *     
 	 */
 	app.delete('/trade/portfolio/histroies/:id', remove);
 	/**
 	 * get trade/portfolio/histroies
 	 */
 	app.get('/trade/portfolio/histroies/:id', getOne);

 	/**
 	 * get trade/portfolio/histroies
 	 * type:
 	 */
 	app.get('/trade/portfolio/histroies', getMore);
 };
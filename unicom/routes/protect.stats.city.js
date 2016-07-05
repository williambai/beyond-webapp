var regexp = require('../libs/regexp');

exports = module.exports = function(app, models) {

 	var getOne = function(req, res) {
 		var id = req.params.id;
 		models.PlatformStatsCity
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
 				var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
 				models.PlatformStatsCity.find({
						'_id': {
							$regex: searchRegex
						}
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
 				break;
 			default:
 				models.PlatformStatsCity
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
 	 * get protect/stats/cities
 	 */
 	app.get('/protect/stats/cities/:id', app.grant, getOne);

 	/**
 	 * get protect/stats/cities
 	 * type:
 	 */
 	app.get('/protect/stats/cities', app.grant, getMore);
 };
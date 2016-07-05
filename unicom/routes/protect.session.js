var regexp = require('../libs/regexp');

exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		res.send({});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.PlatformSession.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.PlatformSession.findByIdAndUpdate(id, {
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
 		models.PlatformSession
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
 				models.PlatformSession.find({
						$or:[{
								'_id': {
									$regex: searchRegex
								}
	 						},{
	 							'session':{
	 								$regex: searchRegex
	 							}
	 						}
						]
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
 				models.PlatformSession
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
 	 * add protect/sessions
 	 * type:
 	 *     
 	 */
 	app.post('/protect/sessions', app.grant, add);
 	/**
 	 * update protect/sessions
 	 * type:
 	 *     
 	 */
 	app.put('/protect/sessions/:id', app.grant, update);

 	/**
 	 * delete protect/sessions
 	 * type:
 	 *     
 	 */
 	app.delete('/protect/sessions/:id', app.grant, remove);
 	/**
 	 * get protect/sessions
 	 */
 	app.get('/protect/sessions/:id', app.grant, getOne);

 	/**
 	 * get protect/sessions
 	 * type:
 	 */
 	app.get('/protect/sessions', app.grant, getMore);
 };
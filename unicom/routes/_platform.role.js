 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var add = function(req, res) {
 		var doc = req.body;
 		var grant = req.body.grant;
 		var keys = _.keys(grant);
 		var grant_new = {};
 		_.each(keys,function(key){
 			var feature = grant[key];
 			if(feature.getOne || feature.getMore || feature.add || feature.remove || feature.update){
 				grant_new[key] = grant[key];
 			}
 		});
 		doc.grant = grant_new;
 		doc.creator = {
 			id: req.session.accountId,
 		};
  		models.PlatformRole.create(doc,function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.PlatformRole.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		var grant = req.body.grant;
 		var keys = _.keys(grant);
 		var grant_new = {};
 		_.each(keys,function(key){
 			var feature = grant[key];
 			if(feature.getOne || feature.getMore || feature.add || feature.remove || feature.update){
 				grant_new[key] = grant[key];
 			}
 		});
 		set.grant = grant_new;
 		models.PlatformRole.findByIdAndUpdate(id, {
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
 		models.PlatformRole
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

 		models.PlatformRole
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
 	 * add platform/roles
 	 * type:
 	 *     
 	 */
 	app.post('/platform/roles', add);
 	/**
 	 * update platform/roles
 	 * type:
 	 *     
 	 */
 	app.put('/platform/roles/:id', update);

 	/**
 	 * delete platform/roles
 	 * type:
 	 *     
 	 */
 	app.delete('/platform/roles/:id', remove);
 	/**
 	 * get platform/roles
 	 */
 	app.get('/platform/roles/:id', getOne);

 	/**
 	 * get platform/roles
 	 * type:
 	 */
 	app.get('/platform/roles', getMore);
 };
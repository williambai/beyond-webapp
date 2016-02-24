 exports = module.exports = function(app, models) {

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
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.PlatformRole.findOneAndRemove({
 			_id: id,
 			'createBy.id': req.session.accountId
 		}, function(err, doc) {
 			if (err) return res.send(err);
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
 		models.PlatformRole.findOneAndUpdate({
 				_id: id,
 				'createBy.id': req.session.accountId
 			}, {
 				$set: set
 			}, {
 				'upsert': false,
 				'new': true,
 			},
 			function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc || {});
 			}
 		);
 	};
 	var getOne = function(req, res) {
 		var id = req.params.id;
 		models.PlatformRole
 			.findOne({
 				_id: id,
 				$or: [{
 					'createBy.id': req.session.accountId,
 				}, {
 					'nickname': {
 						$regex: /^admin_*/i,
 					}
 				}]
 			})
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc || {});
 			});
 	};
 	var getMore = function(req, res) {
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.PlatformRole
 			.find({
 				$or: [{
 					'createBy.id': req.session.accountId,
 				}, {
 					'nickname': {
 						$regex: /^admin_*/i,
 					}
 				}]
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
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add admin/roles
 	 * type:
 	 *     
 	 */
 	app.post('/admin/roles', app.grant, add);
 	/**
 	 * update admin/roles
 	 * type:
 	 *     
 	 */
 	app.put('/admin/roles/:id',app.grant,  update);

 	/**
 	 * delete admin/roles
 	 * type:
 	 *     
 	 */
 	app.delete('/admin/roles/:id', app.grant, remove);
 	/**
 	 * get admin/roles
 	 */
 	app.get('/admin/roles/:id', app.grant, getOne);

 	/**
 	 * get admin/roles
 	 * type:
 	 */
 	app.get('/admin/roles',app.grant, getMore);
 };
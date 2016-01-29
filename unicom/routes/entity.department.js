 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var add = function(req, res) {
 		var doc = req.body;
 		//transform doc
 		if (_.isEmpty(doc.parent)) doc = _.omit(doc, 'parent');
 		if (_.isEmpty(doc.path)) {
 			doc.path += doc.name;
 		} else {
 			doc.path += ' >> ' + doc.name;
 		}
 		models.Department.create(doc, function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.Department.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var doc = req.body;
 		//transform doc
 		if (_.isEmpty(doc.parent)) doc = _.omit(doc, 'parent');
 		var regex = new RegExp(doc.name, 'i');
 		if (_.isEmpty(doc.path)) {
 			doc.path += doc.name;
 		} else {
 			if (!regex.test(doc.path)) doc.path += ' >> ' + doc.name;
 		}

 		models.Department.findByIdAndUpdate(id, {
 				$set: doc
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
 		models.Department
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var action = req.query.type;
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		switch (action) {
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(searchStr, 'i');
 				var status = req.query.status;
 				var query = models.Department.find({
 					$or: [{
 						'name': {
 							$regex: searchRegex
 						}
 					}, {
 						'path': {
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
 			default:
 				models.Department
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
 		}
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add departments
 	 * type:
 	 *     
 	 */
 	app.post('/departments', add);
 	/**
 	 * update departments
 	 * type:
 	 *     
 	 */
 	app.put('/departments/:id', update);

 	/**
 	 * delete departments
 	 * type:
 	 *     
 	 */
 	app.delete('/departments/:id', remove);
 	/**
 	 * get departments
 	 */
 	app.get('/departments/:id', getOne);

 	/**
 	 * get departments
 	 * type:
 	 */
 	app.get('/departments', getMore);
 };
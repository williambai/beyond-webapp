 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var add = function(req, res) {
 		var pid = req.params.pid;
 		var phonePackage = _.omit(req.body, '_id');

 		models.ProductPhone.findByIdAndUpdate(pid, {
 				$push: {
 					'packages': phonePackage
 				}
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
 	var remove = function(req, res) {
 		var pid = req.params.pid;
 		var id = req.params.id;
 		models.ProductPhone.findByIdAndUpdate(pid, {
 				$pull: {
 					'packages': {
 						_id: id
 					},
 				}
 			}, {
 				'upsert': false,
 				'new': true,
 			},
 			function(err, doc) {
 				if (err) return res.send(err);
 				res.send({});
 			}
 		);
 	};
 	var update = function(req, res) {
 		var pid = req.params.pid;
 		var id = req.params.id;
 		//** pull out
 		models.ProductPhone.findByIdAndUpdate(pid, {
 				$pull: {
 					'packages': {
 						_id: id
 					},
 				}
 			}, {
 				'upsert': false,
 				'new': true,
 			},
 			function(err, doc) {
 				if (err) return res.send(err);
 				//** push into
 				var phonePackage = req.body;
 				phonePackage._id = id;
 				models.ProductPhone.findByIdAndUpdate(pid, {
 						$push: {
 							'packages': phonePackage
 						}
 					}, {
 						'upsert': false,
 						'new': true,
 					},
 					function(err, doc) {
 						if (err) return res.send(err);
 						res.send({});
 					}
 				);
 			}
 		);
 	};
 	var getOne = function(req, res) {
 		var pid = req.params.pid;
 		var id = req.params.id;
 		models.ProductPhone
 			.findOne({
 				'packages._id': id
 			})
 			.select({
 				packages: 1
 			})
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				var pkg = doc.packages || [];
 				res.send(_.findWhere(pkg, {
 					id: id
 				}));
 			});
 	};
 	var getMore = function(req, res) {
 		var pid = req.params.pid;
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.ProductPhone
 			.findOne({
 				_id: pid
 			})
 			.select({
 				packages: 1
 			})
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc.packages.slice(per * page, per));
 			});
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add product/phone/:pid/packages
 	 * type:
 	 *     
 	 */
 	app.post('/product/phone/:pid/packages', app.grant, add);
 	/**
 	 * update product/phone/:pid/packages
 	 * type:
 	 *     
 	 */
 	app.put('/product/phone/:pid/packages/:id', app.grant, update);

 	/**
 	 * delete product/phone/:pid/packages
 	 * type:
 	 *     
 	 */
 	app.delete('/product/phone/:pid/packages/:id', app.grant, remove);
 	/**
 	 * get product/phone/:pid/packages
 	 */
 	app.get('/product/phone/:pid/packages/:id', app.grant, getOne);

 	/**
 	 * get product/phone/:pid/packages
 	 * type:
 	 */
 	app.get('/product/phone/:pid/packages', app.grant, getMore);
 };
var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var regexp = require('../libs/regexp');

exports = module.exports = function(app, models) {
	var _ = require('underscore');

	var add = function(req, res) {
		var doc = req.body;
		doc.packages = [];
		models.ProductPhone.create(doc,function(err) {
			if (err) return res.send(err);
			res.send({});
		});
	};
	var remove = function(req, res) {
		var id = req.params.id;
		models.ProductPhone.findByIdAndRemove(id, function(err, doc) {
			if (err) return res.send(err);
			res.send(doc);
		});
	};
	var update = function(req, res) {
		var id = req.params.id;
		var action = req.body.action || '';
		switch (action) {
			case 'addpackage':
				models.ProductPhone.findByIdAndUpdate(id, {
						$push: {
							'packages': req.body.package
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
				break;
			case 'removepackage':
				models.ProductPhone.findByIdAndUpdate(id, {
						$pull: {
							'packages': {
								_id: req.body.id
							},
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
				break;
			default:
				var set = req.body;
				set = _.omit(set,'packages');
				models.ProductPhone.findByIdAndUpdate(id, {
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
				break;
		}
	};
	var getOne = function(req, res) {
		var id = req.params.id;
		models.ProductPhone
			.findById(id)
			.exec(function(err, doc) {
				if (err) return res.send(err);
				res.send(doc);
			});
	};
	var getMore = function(req, res) {
		var action = req.query.action || '';
		var per = req.query.per || 20;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;
		switch (action) {
 			case 'search':
	 			var searchStr = req.query.searchStr || '';
	 			var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
	 			var status = req.query.status;
	 			var category = req.query.category;
	 			var query = models.ProductPhone.find({
 						$or: [{
 							'name': {
 								$regex: searchRegex
 							}
 						}, {
 							'goods.name': {
 								$regex: searchRegex
 							}
 						}]
 					});
	 			if (!_.isEmpty(status)) {
	 				query.where({status: status});
	 			}
	 			if(!_.isEmpty(category)){
	 				query.where({category: category});
	 			};
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
			case 'category':
				models.ProductPhone
					.find({
						category: req.query.category,
						status: '有效',
					})
					.skip(per * page)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
				break;
			default:
				models.ProductPhone
					.find({})
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
	 * add product/phones
	 * action:
	 *     
	 */
	app.post('/product/phones', app.grant, add);
	/**
	 * update product/phones
	 * action:
	 *     
	 */
	app.put('/product/phones/:id', app.grant, update);

	/**
	 * delete product/phones
	 * action:
	 *     
	 */
	app.delete('/product/phones/:id', app.grant, remove);
	/**
	 * get product/phones
	 */
	app.get('/product/phones/:id', app.grant, getOne);

	/**
	 * get product/phones
	 * action:
	 *      action=category&category=xxx
	 */
	app.get('/product/phones', app.grant, getMore);
};
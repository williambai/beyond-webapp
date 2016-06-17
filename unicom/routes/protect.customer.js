var _ = require('underscore');
var async = require('async');
var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var regexp = require('../libs/regexp');

exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		logger.debug('req.body: ' + JSON.stringify(req.body));
 		var type = req.body.type || '';
 		switch (type) {
 			case 'import':
 				// importData(req, res);
 				break;
 			default:
 				var doc = new models.Customer(req.body);
 				doc.save(function(err) {
 					if (err) return res.send(err);
 					res.send({});
 				});
 				break;
 		}
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.Customer.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Customer.findByIdAndUpdate(id, {
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
 		models.Customer
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
				logger.debug('search status: ' + req.query.status);
				var status = req.query.status;
				var query = models.Customer.find({
							$or: [{
								'name': {
									$regex: searchRegex
								}
							}, {
								'mobile': {
									$regex: searchRegex
								}
							}]
						});
				if (!_.isEmpty(status)) {
					query.where({status: status});
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
			case 'export':
 				var department = req.query.department;
 				var grid = req.query.grid;
 				var channel = req.query.channel;
 				models.Customer
 					.find({})
 					.exec(function(err, docs) {
 						if (err) return res.send(err);
 						// exportData(req, res, docs);
 					});
 				break;
 			default:
 				models.Customer
 					.find({})
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
 	 * add protect/customers
 	 * type:
 	 *     
 	 */
 	app.post('/protect/customers', app.grant, add);
 	/**
 	 * update protect/customers
 	 * type:
 	 *     
 	 */
 	app.put('/protect/customers/:id', app.grant, update);

 	/**
 	 * delete protect/customers
 	 * type:
 	 *     
 	 */
 	app.delete('/protect/customers/:id', app.grant, remove);
 	/**
 	 * get protect/customers
 	 */
 	app.get('/protect/customers/:id', app.grant, getOne);

 	/**
 	 * get protect/customers
 	 * type:
 	 */
 	app.get('/protect/customers', app.grant, getMore);
 };
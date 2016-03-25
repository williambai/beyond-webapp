var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

exports = module.exports = function(app, models) {
 	var _ = require('underscore');
 	var async = require('async');
 	var xlsx = require('xlsx');
 	var path = require('path');

	var _buildWorkSheet = function(workSheet, docs){
 		workSheet['!ref'] = 'A1:AA' + docs.length + 1;
 		//** build title
 		workSheet['A1'] = {
 			t: 's',
 			v: 'name',
 			h: 'name',
 			w: 'name',
 		};
 		workSheet['B1'] = {
 			t: 's',
 			v: 'category',
 			h: 'category',
 			w: 'category',
 		};
 		workSheet['C1'] = {
 			t: 's',
 			v: 'status',
 			h: 'status',
 			w: 'status',
 		};
 		workSheet['D1'] = {
 			t: 's',
 			v: 'total',
 			h: 'total',
 			w: 'total',
 		};
 		workSheet['E1'] = {
 			t: 's',
 			v: 'bonus_income',
 			h: 'bonus_income',
 			w: 'bonus_income',
 		};
 		workSheet['F1'] = {
 			t: 's',
 			v: 'bonus_cashStatus',
 			h: 'bonus_cashStatus',
 			w: 'bonus_cashStatus',
 		};
 		workSheet['G1'] = {
 			t: 's',
 			v: 'bonus_times',
 			h: 'bonus_times',
 			w: 'bonus_times',
 		};
 		workSheet['H1'] = {
 			t: 's',
 			v: 'bonus_cash',
 			h: 'bonus_cash',
 			w: 'bonus_cash',
 		};
 		workSheet['I1'] = {
 			t: 's',
 			v: 'bonus_points',
 			h: 'bonus_points',
 			w: 'bonus_points',
 		};
 		workSheet['J1'] = {
 			t: 's',
 			v: 'createBy_mobile',
 			h: 'createBy_mobile',
 			w: 'createBy_mobile',
 		};
 		_.each(docs, function(doc, i) {
 			workSheet['A' + (2 + i)] = {
 				t: 's',
 				v: doc.name,
 				h: doc.name,
 				w: doc.name,
 			};
 			workSheet['B' + (2 + i)] = {
 				t: 's',
 				v: doc.category,
 				h: doc.category,
 				w: doc.category,
 			};
 			workSheet['C' + (2 + i)] = {
 				t: 's',
 				v: doc.status,
 				h: doc.status,
 				w: doc.status,
 			};
 			workSheet['D' + (2 + i)] = {
 				t: 's',
 				v: doc.total,
 				h: doc.total,
 				w: doc.total,
 			};
 			workSheet['E' + (2 + i)] = {
 				t: 's',
 				v: doc.bonus.income,
 				h: doc.bonus.income,
 				w: doc.bonus.income,
 			};
 			workSheet['F' + (2 + i)] = {
 				t: 's',
 				v: doc.bonus.cashStatus,
 				h: doc.bonus.cashStatus,
 				w: doc.bonus.cashStatus,
 			};
 			workSheet['G' + (2 + i)] = {
 				t: 's',
 				v: doc.bonus.times,
 				h: doc.bonus.times,
 				w: doc.bonus.times,
 			};
 			workSheet['H' + (2 + i)] = {
 				t: 's',
 				v: doc.bonus.cash,
 				h: doc.bonus.cash,
 				w: doc.bonus.cash,
 			};
 			workSheet['I' + (2 + i)] = {
 				t: 's',
 				v: doc.bonus.points,
 				h: doc.bonus.points,
 				w: doc.bonus.points,
 			};
 			workSheet['J' + (2 + i)] = {
 				t: 's',
 				v: doc.createBy.mobile,
 				h: doc.createBy.mobile,
 				w: doc.createBy.mobile,
 			};
 		});
 	};

	var exportData = function(req,res){
 		var _template = path.join(__dirname, '../config/customer.xlsx');
 		var _tempFile = path.join(__dirname, '../public/_tmp/order.xlsx');
 		var workBook = xlsx.readFile(_template);
 		var sheetName = workBook.SheetNames[0];
 		var workSheet = workBook.Sheets[sheetName];
 		var _exportData = function(docs){
 			_buildWorkSheet(workSheet,docs);
	 		logger.debug('export workSheet: ' + JSON.stringify(workSheet));
	 		xlsx.writeFile(workBook, _tempFile);
	 		process.nextTick(function() {
	 			if (require('fs').existsSync(_tempFile)) {
	 				logger.debug('export _tempFile: ' + _tempFile);
	 				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	 				res.setHeader("Content-Disposition", "attachment; filename=order.xlsx");
	 				// res.attachment(_tempFile);
	 				res.sendFile(_tempFile);
	 			}
	 		});
 		};

 		models
 			.Order
 			.find({

 			})
 			.exec(function(err,docs){
 				if(err) return res.send(err);
 				// console.log(docs)
 				_exportData(docs);
 			});
 	};

 	var add = function(req, res) {
 		var doc = new models.Order(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.Order.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Order.findByIdAndUpdate(id, {
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
 		models.Order
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};

 	var getMore = function(req, res) {
 		var action = req.query.action || '';
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		var per = 20;

 		switch (action) {
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(searchStr, 'i');
 				var status = req.query.status;
 				var query = models.Order.find({
 					$or: [{
 						'name': {
 							$regex: searchRegex
 						}
 					}, {
 						'category': {
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

 			case 'export': 
 				exportData(req,res);
 				break;

 			default:
 				models.Order
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
 	 * add protect/orders
 	 * action:
 	 *     
 	 */
 	app.post('/protect/orders', app.grant, add);
 	/**
 	 * update protect/orders
 	 * action:
 	 *     
 	 */
 	app.put('/protect/orders/:id', app.grant, update);

 	/**
 	 * delete protect/orders
 	 * action:
 	 *     
 	 */
 	app.delete('/protect/orders/:id', app.grant, remove);
 	/**
 	 * get protect/orders
 	 */
 	app.get('/protect/orders/:id', app.grant, getOne);

 	/**
 	 * get protect/orders
 	 * action:
 	 */
 	app.get('/protect/orders',app.grant,  getMore);
 };
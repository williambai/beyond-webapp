var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:entity.product.card');
logger.setLevel('DEBUG');

 exports = module.exports = function(app, models) {
 	var _ = require('underscore');
 	var async = require('async');
 	var xlsx = require('xlsx');
 	var path = require('path');

 	var importData = function(req, res) {
 		var attachments;
 		if(typeof req.body.attachment == 'string'){
 			attachments = [];
			attachments.push(req.body.attachment);
 		}else{
 			attachments = req.body.attachment;
 		} 
 		attachments = attachments || [];
 		logger.debug('attachments:' + attachments);
 		var docs = [];
 		async.each(attachments, function(attachment, cb) {
 			var file = path.join(__dirname,'../public',attachment);
 			if(!require('fs').existsSync(file)){
 				return cb({code: 40440, msg: '文件不存在'});
 			}
 			logger.debug('file: ' + file);
 			var workBook = xlsx.readFile(file);
 			var sheetName = workBook.SheetNames[0];
 			var workSheet = workBook.Sheets[sheetName];
 			var docs = xlsx.utils.sheet_to_json(workSheet);
 			logger.debug('docs: ' + JSON.stringify(docs));
 			async.each(docs, function(doc, callback) {
 				models.ProductCard.findOneAndUpdate({
 						name: doc.name
 					}, {
 						$set: doc
 					}, {
 						'upsert': true,
 						'new': true,
 					},
 					function(err, doc) {
 						if (err) return callback(err);
 						callback(null);
 					}
 				);
 			}, function(err, result) {
 				if (err) return cb(err);
 				cb(null, result);
 			});
 		}, function(err, rlt) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};

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
 			v: 'price',
 			h: 'price',
 			w: 'price',
 		};
 		workSheet['D1'] = {
 			t: 's',
 			v: 'unit',
 			h: 'unit',
 			w: 'unit',
 		};
		//** build data
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
 				v: doc.price,
 				h: doc.price,
 				w: doc.price,
 			};
 			workSheet['D' + (2 + i)] = {
 				t: 's',
 				v: doc.unit,
 				h: doc.unit,
 				w: doc.unit,
 			};
		});
 	};

 	var exportData = function(req,res){
 		var _template = path.join(__dirname, '../config/customer.xlsx');
 		var _tempFile = path.join(__dirname, '../public/_tmp/cards.xlsx');
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
	 				res.setHeader("Content-Disposition", "attachment; filename=cards.xlsx");
	 				// res.attachment(_tempFile);
	 				res.sendFile(_tempFile);
	 			}
	 		});
 		};

 		var categories = (typeof req.query.category == 'string') ? [req.query.category] : req.query.category;
 		// console.log(categories)
 		models
 			.ProductCard
 			.find({
 				'category': {
 					$in: categories,
 				}
 			})
 			.exec(function(err,docs){
 				if(err) return res.send(err);
 				console.log(docs.length)
 				_exportData(docs);
 			});
 	};

 	var add = function(req, res) {
 		var action = req.body.action || '';
 		switch (action) {
 			case 'import':
 				importData(req, res);
 				break;
 			default:
				var doc = req.body;
		 		models.ProductCard.create(doc, function(err) {
		 			if (err) return res.send(err);
		 			res.send({});
		 		});
		  		break;
 		}
 	};

 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ProductCard.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.ProductCard.findByIdAndUpdate(id, {
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
 		models.ProductCard
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
 		switch(action){
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(searchStr, 'i');
 				var status = req.query.status;
 				var query = models.ProductCard.find({
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
 			case 'category':
 				models.ProductCard
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
 			case 'export': 
 				exportData(req,res);
 				break;
 			default:
		 		models.ProductCard
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
 	 * add product/cards
 	 * action:
 	 *     
 	 */
 	app.post('/product/cards', app.grant, add);
 	/**
 	 * update product/cards
 	 * action:
 	 *     
 	 */
 	app.put('/product/cards/:id', app.grant, update);

 	/**
 	 * delete product/cards
 	 * action:
 	 *     
 	 */
 	app.delete('/product/cards/:id', app.grant, remove);
 	/**
 	 * get product/cards
 	 */
 	app.get('/product/cards/:id', app.grant, getOne);

 	/**
 	 * get product/cards
 	 * action:
 	 *      action=category&category=xxx
 	 */
 	app.get('/product/cards', app.grant, getMore);
 };
var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

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
 				models.Goods.findOneAndUpdate({
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
 			v: 'description',
 			h: 'description',
 			w: 'description',
 		};
 		workSheet['D1'] = {
 			t: 's',
 			v: 'price',
 			h: 'price',
 			w: 'price',
 		};
 		workSheet['E1'] = {
 			t: 's',
 			v: 'quantity',
 			h: 'quantity',
 			w: 'quantity',
 		};
 		workSheet['F1'] = {
 			t: 's',
 			v: 'unit',
 			h: 'unit',
 			w: 'unit',
 		};
 		workSheet['G1'] = {
 			t: 's',
 			v: 'foreigner',
 			h: 'foreigner',
 			w: 'foreigner',
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
 				v: doc.description,
 				h: doc.description,
 				w: doc.description,
 			};
 			workSheet['D' + (2 + i)] = {
 				t: 's',
 				v: doc.price,
 				h: doc.price,
 				w: doc.price,
 			};
 			workSheet['E' + (2 + i)] = {
 				t: 's',
 				v: doc.quantity,
 				h: doc.quantity,
 				w: doc.quantity,
 			};
 			workSheet['F' + (2 + i)] = {
 				t: 's',
 				v: doc.unit,
 				h: doc.unit,
 				w: doc.unit,
 			};
 			workSheet['G' + (2 + i)] = {
 				t: 's',
 				v: doc.foreigner,
 				h: doc.foreigner,
 				w: doc.foreigner,
 			};
 		});
 	};

 	var exportData = function(req,res){
 		var _template = path.join(__dirname, '../config/customer.xlsx');
 		var _tempFile = path.join(__dirname, '../public/_tmp/goods.xlsx');
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
	 				res.setHeader("Content-Disposition", "attachment; filename=goods.xlsx");
	 				// res.attachment(_tempFile);
	 				res.sendFile(_tempFile);
	 			}
	 		});
 		};

 		models
 			.Goods
 			.find({
 			})
 			.exec(function(err,docs){
 				if(err) return res.send(err);
 				// console.log(docs)
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
		 		models.Goods.create(doc, function(err) {
		 			if (err) return res.send(err);
		 			res.send({});
		 		});
		  		break;
 		}
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.Goods.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Goods.findByIdAndUpdate(id, {
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
 		models.Goods
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
 				var query = models.Goods.find({
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
 				models.Goods
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
 	 * add goods
 	 * action:
 	 *     
 	 */
 	app.post('/goods', app.grant, add);
 	/**
 	 * update goods
 	 * action:
 	 *     
 	 */
 	app.put('/goods/:id', app.grant, update);

 	/**
 	 * delete goods
 	 * action:
 	 *     
 	 */
 	app.delete('/goods/:id', app.grant, remove);
 	/**
 	 * get goods
 	 */
 	app.get('/goods/:id', app.grant, getOne);

 	/**
 	 * get goods
 	 * action:
 	 */
 	app.get('/goods', app.isLogin, getMore);
 };
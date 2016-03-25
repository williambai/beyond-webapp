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
 				models.Customer.findOneAndUpdate({
 						mobile: doc.mobile
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

 	var exportData = function(req, res, docs) {
 		// console.log(docs)
 		var workBook = xlsx.readFile(path.join(__dirname, '../config/customer.xlsx'));
 		var sheetName = workBook.SheetNames[0];
 		var workSheet = workBook.Sheets[sheetName];
 		workSheet['!ref'] = 'A1:E' + docs.length + 1;
 		workSheet['A1'] = {
 			t: 's',
 			v: 'name',
 			h: 'name',
 			w: 'name',
 		};
 		workSheet['B1'] = {
 			t: 's',
 			v: 'mobile',
 			h: 'mobile',
 			w: 'mobile',
 		};
 		workSheet['C1'] = {
 			t: 's',
 			v: 'department',
 			h: 'department',
 			w: 'department',
 		};
 		workSheet['D1'] = {
 			t: 's',
 			v: 'account_name',
 			h: 'account_name',
 			w: 'account_name',
 		};
 		workSheet['E1'] = {
 			t: 's',
 			v: 'account_mobile',
 			h: 'account_mobile',
 			w: 'account_mobile',
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
 				v: doc.mobile,
 				h: doc.mobile,
 				w: doc.mobile,
 			};
 			workSheet['C' + (2 + i)] = {
 				t: 's',
 				v: doc.department,
 				h: doc.department,
 				w: doc.department,
 			};
 			workSheet['D' + (2 + i)] = {
 				t: 's',
 				v: doc.account_name,
 				h: doc.account_name,
 				w: doc.account_name,
 			};
 			workSheet['E' + (2 + i)] = {
 				t: 's',
 				v: doc.account_mobile,
 				h: doc.account_mobile,
 				w: doc.account_mobile,
 			};
 		});
 		logger.debug('export workSheet: ' + JSON.stringify(workSheet));
 		xlsx.writeFile(workBook, path.join(__dirname, '../public/_tmp/customer.xlsx'));
 		process.nextTick(function() {
 			var filename = path.join(__dirname, '../public/_tmp/customer.xlsx');
 			if (require('fs').existsSync(filename)) {
 				logger.debug('export filename: ' + filename);
 				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
 				res.setHeader("Content-Disposition", "attachment; filename=customer.xlsx");
 				// res.attachment(filename);
 				res.sendFile(filename);
 			}
 		});
 	};

 	var add = function(req, res) {
 		logger.debug('req.body: ' + JSON.stringify(req.body));
 		var type = req.body.type || '';
 		switch (type) {
 			case 'import':
 				importData(req, res);
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
				var searchRegex = new RegExp(searchStr, 'i');
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
 						exportData(req, res, docs);
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
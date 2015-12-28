 exports = module.exports = function(app, models) {
 	var _ = require('underscore');
 	var async = require('async');
 	var xlsx = require('xlsx');
 	var path = require('path');

 	var importData = function(req, res) {
 		var attachments;
 		if(_.isString(req.body.attachment)){
 			attachments = [];
			attachments.push(req.body.attachment);
 		}else{
 			attachments = req.body.attachment;
 		} 
 		attachments = attachments || [];
 		var docs = [];
 		async.each(attachments, function(attachment, cb) {
 			var file = path.join(__dirname,'../public',attachment);
 			if(!require('fs').existsSync(file)){
 				return cb({code: 40440, msg: '文件不存在'});
 			}
 			var workBook = xlsx.readFile(file);
 			var sheetName = workBook.SheetNames[0];
 			var workSheet = workBook[sheetName];
 			var docs = xlsx.utils.sheet_to_json(workSheet);
 			async.each(docs, function(doc, callback) {
 				models.Customer.findByOneAndUpdate({
 						mobile: doc.mobile
 					}, {
 						$set: doc
 					}, {
 						'upsert': false,
 						'new': true,
 					},
 					function(err, doc) {
 						if (err) return callback(err);
 						callback(null, doc);
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
 		workSheet['!ref'] = 'A1:E' + docs.length;
 		workSheet['A0'] = {
 			t: 's',
 			v: '客户姓名',
 			h: '客户姓名',
 			w: '客户姓名',
 		};
 		workSheet['B0'] = {
 			t: 's',
 			v: '客户手机',
 			h: '客户手机',
 			w: '客户手机',
 		};
 		workSheet['C0'] = {
 			t: 's',
 			v: '管理部门',
 			h: '管理部门',
 			w: '管理部门',
 		};
 		workSheet['D0'] = {
 			t: 's',
 			v: '渠道名称',
 			h: '渠道名称',
 			w: '渠道名称',
 		};
 		workSheet['E0'] = {
 			t: 's',
 			v: '网格名称',
 			h: '网格名称',
 			w: '网格名称',
 		};
 		_.each(docs, function(doc, i) {
 			workSheet['A' + (1 + i)] = {
 				t: 's',
 				v: doc.name,
 				h: doc.name,
 				w: doc.name,
 			};
 			workSheet['B' + (1 + i)] = {
 				t: 's',
 				v: doc.mobile,
 				h: doc.mobile,
 				w: doc.mobile,
 			};
 			workSheet['C' + (1 + i)] = {
 				t: 's',
 				v: doc.department,
 				h: doc.department,
 				w: doc.department,
 			};
 			workSheet['D' + (1 + i)] = {
 				t: 's',
 				v: doc.channel,
 				h: doc.channel,
 				w: doc.channel,
 			};
 			workSheet['E' + (1 + i)] = {
 				t: 's',
 				v: doc.grid,
 				h: doc.grid,
 				w: doc.grid,
 			};
 		});
 		// console.log(workSheet)
 		xlsx.writeFile(workBook, path.join(__dirname, '../public/_tmp/customer.xlsx'));
 		process.nextTick(function() {
 			var filename = path.join(__dirname, '../public/_tmp/customer.xlsx');
 			if (require('fs').existsSync(filename)) {
 				// console.log(filename);
 				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
 				res.setHeader("Content-Disposition", "attachment; filename=customer.xlsx");
 				// res.attachment(filename);
 				res.sendFile(filename);
 			}
 		});
 	};

 	var add = function(req, res) {
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
 			case 'export':
 				var department = req.query.department;
 				var grid = req.query.grid;
 				var channel = req.query.channel;
 				models.Customer
 					.find({})
 					.exec(function(err, docs) {
 						if (err) return res.send(err);
 						// console.log(docs);
 						// res.locals.docs = docs;
 						// res.send(docs);
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
 	 * add customers
 	 * type:
 	 *     
 	 */
 	app.post('/customers', add);
 	/**
 	 * update customers
 	 * type:
 	 *     
 	 */
 	app.put('/customers/:id', update);

 	/**
 	 * delete customers
 	 * type:
 	 *     
 	 */
 	app.delete('/customers/:id', remove);
 	/**
 	 * get customers
 	 */
 	app.get('/customers/:id', getOne);

 	/**
 	 * get customers
 	 * type:
 	 */
 	app.get('/customers', getMore);
 };
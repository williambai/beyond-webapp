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
 				models.Department.findOneAndUpdate({
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
 			v: 'nickname',
 			h: 'nickname',
 			w: 'nickname',
 		};
 		workSheet['C1'] = {
 			t: 's',
 			v: 'description',
 			h: 'description',
 			w: 'description',
 		};
 		workSheet['D1'] = {
 			t: 's',
 			v: 'address',
 			h: 'address',
 			w: 'address',
 		};
 		workSheet['E1'] = {
 			t: 's',
 			v: 'zipcode',
 			h: 'zipcode',
 			w: 'zipcode',
 		};
 		workSheet['F1'] = {
 			t: 's',
 			v: 'manager',
 			h: 'manager',
 			w: 'manager',
 		};
 		workSheet['G1'] = {
 			t: 's',
 			v: 'phone',
 			h: 'phone',
 			w: 'phone',
 		};
 		workSheet['H1'] = {
 			t: 's',
 			v: 'website',
 			h: 'website',
 			w: 'website',
 		};
 		workSheet['I1'] = {
 			t: 's',
 			v: 'path',
 			h: 'path',
 			w: 'path',
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
 				v: doc.nickname,
 				h: doc.nickname,
 				w: doc.nickname,
 			};
 			workSheet['C' + (2 + i)] = {
 				t: 's',
 				v: doc.description,
 				h: doc.description,
 				w: doc.description,
 			};
 			workSheet['D' + (2 + i)] = {
 				t: 's',
 				v: doc.address,
 				h: doc.address,
 				w: doc.address,
 			};
 			workSheet['E' + (2 + i)] = {
 				t: 's',
 				v: doc.zipcode,
 				h: doc.zipcode,
 				w: doc.zipcode,
 			};
 			workSheet['F' + (2 + i)] = {
 				t: 's',
 				v: doc.manager,
 				h: doc.manager,
 				w: doc.manager,
 			};
 			workSheet['G' + (2 + i)] = {
 				t: 's',
 				v: doc.phone,
 				h: doc.phone,
 				w: doc.phone,
 			};
 			workSheet['H' + (2 + i)] = {
 				t: 's',
 				v: doc.website,
 				h: doc.website,
 				w: doc.website,
 			};
 			workSheet['I' + (2 + i)] = {
 				t: 's',
 				v: doc.path,
 				h: doc.path,
 				w: doc.path,
 			};
 		});
 	};

 	var exportData = function(req,res){
 		var _template = path.join(__dirname, '../config/customer.xlsx');
 		var _tempFile = path.join(__dirname, '../public/_tmp/department.xlsx');
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
	 				res.setHeader("Content-Disposition", "attachment; filename=department.xlsx");
	 				// res.attachment(_tempFile);
	 				res.sendFile(_tempFile);
	 			}
	 		});
 		};

		var pathRegex = new RegExp(req.query.path || '', 'i');

 		models
 			.Department
 			.find({
 				'path': {
 					$regex: pathRegex,
 				}
 			})
 			.exec(function(err,docs){
 				if(err) return res.send(err);
 				// console.log(docs)
 				_exportData(docs);
 			});
 	};

 	var add = function(req, res) {
 		var type = req.body.type || '';
 		switch (type) {
 			case 'import':
 				importData(req, res);
 				break;
 			default:
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
		  		break;
 		}
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
 			case 'export': 
 				exportData(req,res);
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
 	 * add protect/departments
 	 * type:
 	 *     
 	 */
 	app.post('/protect/departments', app.grant, add);
 	/**
 	 * update protect/departments
 	 * type:
 	 *     
 	 */
 	app.put('/protect/departments/:id', app.grant, update);

 	/**
 	 * delete protect/departments
 	 * type:
 	 *     
 	 */
 	app.delete('/protect/departments/:id', app.grant, remove);
 	/**
 	 * get protect/departments
 	 */
 	app.get('/protect/departments/:id', app.grant, getOne);

 	/**
 	 * get protect/departments
 	 * type:
 	 */
 	app.get('/protect/departments', getMore);
 };
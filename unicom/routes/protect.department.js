var util = require('util');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var regexp = require('../libs/regexp');

exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var type = req.body.type || '';
 		switch (type) {
 			case 'import':
	 			var attachments;
	 			if (typeof req.body.attachment == 'string') {
	 				attachments = [];
	 				attachments.push(req.body.attachment);
	 			} else {
	 				attachments = req.body.attachment;
	 			}
	 			attachments = attachments || [];
	 			logger.debug('attachments:' + attachments);
	 			var docs = [];
	 			async.each(attachments, function(attachment, cb) {
	 				var file = path.join(__dirname, '../public', attachment);
	 				if (!fs.existsSync(file)) {
	 					return cb({
	 						code: 40440,
	 						msg: '文件不存在'
	 					});
	 				}
	 				logger.debug('file: ' + file);
	 				//** 导入csv
	 				var data = fs.readFileSync(file,{encoding: 'utf8'});
	 				models.Department.importCSV(data,function(err){
	 					if(err) return cb({
	 								code: 500110,
	 								errmsg: '导入数据格式不规范，请检查数据。'
	 							});
	 					cb(null);
	 				});
	 			}, function(err, result) {
	 				if (err) return res.send(err);
	 				res.send({});
	 			}); 
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
 		var regex = new RegExp(regexp.escape(doc.name), 'i');
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
 				var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
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
				res.writeHead(200, {
					'Content-Type': 'text/csv;charset=utf-8',
					'Content-Disposition': 'attachment; filename=departments.csv'
				});
				models.Department
					.findAndStreamCsv({})
					.pipe(res);
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

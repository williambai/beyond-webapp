var util = require('util');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(), __filename));
var regexp = require('../libs/regexp');
var iconv = require('iconv-lite');

exports = module.exports = function(app, models) {

	var add = function(req, res) {
		var action = req.body.action || '';
		switch (action) {
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
				if(attachments.length == 0){
					return res.send({
						code: 40441,
						errmsg: '请选择要导入的文件'
					});
				}
				async.eachSeries(attachments, function(attachment, cb) {
					var file = path.join(__dirname, '../public', attachment);
					if (!fs.existsSync(file)) {
						return cb({
							code: 40440,
							errmsg: '文件不存在'
						});
					}
					logger.debug('file: ' + file);
					//** 导入excel
					models.Goods.fromExcel(file, function(err,result){
						if(err) return cb(err);
						cb(null,result);
					});
	 				// //** 导入csv
	 				// var data = fs.readFileSync(file,{encoding: 'utf8'});
	 				// models.Goods.importCSV(data,function(err){
	 				// 	if(err) return cb({
	 				// 				code: 500110,
	 				// 				errmsg: '导入数据格式不规范，请检查数据。'
	 				// 			});
	 				// 	cb(null);
	 				// });
				}, function(err, result) {
					if (err) return res.send(err);
					res.send({});
				});
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
				try {
					var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
					var status = req.query.status;
					var query = models.Goods.find({
						$or: [{
							'name': {
								$regex: searchRegex
							}
						},{
							'barcode': {
								$regex: searchRegex
							}
						},{
							'smscode': {
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

				} catch (e) {
					logger.error('正则表达式错误：' + e);
					res.send({});
				}
				break;
			case 'exportTpl':
 				var filename = 'goods.xlsx';
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + filename);
				models.Goods
					.toExcelTemplate(function(err,workbook){
						if(err) return res.send(err);
						workbook.xlsx
							.write(res)
							.then(function(){
								res.end();
							});
					});
				break;
			case 'export':
 				var filename = 'goods.xlsx';
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + filename);
				models.Goods
					.toExcel({},function(err,workbook){
						if(err) return res.send(err);
						workbook.xlsx
							.write(res)
							.then(function(){
								res.end();
							});
					});
				// res.writeHead(200, {
				// 	'Content-Type': 'text/csv;charset=utf-8',
				// 	'Content-Disposition': 'attachment; filename=goods.csv'
				// });
				// models.Goods
				// 	.findAndStreamCsv({})
 			// 		.pipe(iconv.encodeStream('GBK'))
				// 	.pipe(res);
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
	 * add protect/goods
	 * action:
	 *     
	 */
	app.post('/protect/goods', app.grant, add);
	/**
	 * update protect/goods
	 * action:
	 *     
	 */
	app.put('/protect/goods/:id', app.grant, update);

	/**
	 * delete protect/goods
	 * action:
	 *     
	 */
	app.delete('/protect/goods/:id', app.grant, remove);
	/**
	 * get protect/goods
	 */
	app.get('/protect/goods/:id', app.grant, getOne);

	/**
	 * get protect/goods
	 * action:
	 */
	app.get('/protect/goods', app.isLogin, getMore);
};


// var xlsx = require('xlsx');
	//** 导入csv
	// var importCSV = function(req, res) {
	// 	var attachments;
	// 	if (typeof req.body.attachment == 'string') {
	// 		attachments = [];
	// 		attachments.push(req.body.attachment);
	// 	} else {
	// 		attachments = req.body.attachment;
	// 	}
	// 	attachments = attachments || [];
	// 	logger.debug('attachments:' + attachments);
	// 	var docs = [];
	// 	async.each(attachments, function(attachment, cb) {
	// 		var file = path.join(__dirname, '../public', attachment);
	// 		if (!require('fs').existsSync(file)) {
	// 			return cb({
	// 				code: 40440,
	// 				msg: '文件不存在'
	// 			});
	// 		}
	// 		logger.debug('file: ' + file);
	// 		//** 导入csv
	// 		try {
	// 			band({
	// 				file: file,
	// 				model: models.Goods,
	// 				// columns: ['name','barcode'],
	// 				// types: [String,String],
	// 				columns: ['name', 'category', 'barcode', 'smscode', 'price', 'unit', 'bonus'],
	// 				types: [String, String, String, String, Number, String, Number],
	// 			}, function(err) {
	// 				cb(err);
	// 			});
	// 		} catch (e) {
	// 			return cb({
	// 				code: 500110,
	// 				errmsg: '导入数据格式不规范，请检查数据。'
	// 			});
	// 		}
	// 	}, function(err, result) {
	// 		if (err) return res.send(err);
	// 		res.send({});
	// 	});

	// };

// var importData = function(req, res) {
// 	var attachments;
// 	if(typeof req.body.attachment == 'string'){
// 		attachments = [];
// 	attachments.push(req.body.attachment);
// 	}else{
// 		attachments = req.body.attachment;
// 	} 
// 	attachments = attachments || [];
// 	logger.debug('attachments:' + attachments);
// 	var docs = [];
// 	async.each(attachments, function(attachment, cb) {
// 		var file = path.join(__dirname,'../public',attachment);
// 		if(!require('fs').existsSync(file)){
// 			return cb({code: 40440, msg: '文件不存在'});
// 		}
// 		logger.debug('file: ' + file);
// 		var workBook = xlsx.readFile(file);
// 		var sheetName = workBook.SheetNames[0];
// 		var workSheet = workBook.Sheets[sheetName];
// 		var docs = xlsx.utils.sheet_to_json(workSheet);
// 		logger.debug('docs: ' + JSON.stringify(docs));
// 		async.each(docs, function(doc, callback) {
// 			models.Goods.findOneAndUpdate({
// 					name: doc.name
// 				}, {
// 					$set: doc
// 				}, {
// 					'upsert': true,
// 					'new': true,
// 				},
// 				function(err, doc) {
// 					if (err) return callback(err);
// 					callback(null);
// 				}
// 			);
// 		}, function(err, result) {
// 			if (err) return cb(err);
// 			cb(null, result);
// 		});
// 	}, function(err, rlt) {
// 		if (err) return res.send(err);
// 		res.send({});
// 	});
// };

// var _buildWorkSheet = function(workSheet, docs){
// 	workSheet['!ref'] = 'A1:AA' + docs.length + 1;
// 	//** build title
// 	workSheet['A1'] = {
// 		t: 's',
// 		v: 'name',
// 		h: 'name',
// 		w: 'name',
// 	};
// 	workSheet['B1'] = {
// 		t: 's',
// 		v: 'category',
// 		h: 'category',
// 		w: 'category',
// 	};
// 	workSheet['C1'] = {
// 		t: 's',
// 		v: 'description',
// 		h: 'description',
// 		w: 'description',
// 	};
// 	workSheet['D1'] = {
// 		t: 's',
// 		v: 'price',
// 		h: 'price',
// 		w: 'price',
// 	};
// 	workSheet['E1'] = {
// 		t: 's',
// 		v: 'quantity',
// 		h: 'quantity',
// 		w: 'quantity',
// 	};
// 	workSheet['F1'] = {
// 		t: 's',
// 		v: 'unit',
// 		h: 'unit',
// 		w: 'unit',
// 	};
// 	workSheet['G1'] = {
// 		t: 's',
// 		v: 'barcode',
// 		h: 'barcode',
// 		w: 'barcode',
// 	};
// 	//** build data
// 	_.each(docs, function(doc, i) {
// 		workSheet['A' + (2 + i)] = {
// 			t: 's',
// 			v: doc.name,
// 			h: doc.name,
// 			w: doc.name,
// 		};
// 		workSheet['B' + (2 + i)] = {
// 			t: 's',
// 			v: doc.category,
// 			h: doc.category,
// 			w: doc.category,
// 		};
// 		workSheet['C' + (2 + i)] = {
// 			t: 's',
// 			v: doc.description,
// 			h: doc.description,
// 			w: doc.description,
// 		};
// 		workSheet['D' + (2 + i)] = {
// 			t: 's',
// 			v: doc.price,
// 			h: doc.price,
// 			w: doc.price,
// 		};
// 		workSheet['E' + (2 + i)] = {
// 			t: 's',
// 			v: doc.quantity,
// 			h: doc.quantity,
// 			w: doc.quantity,
// 		};
// 		workSheet['F' + (2 + i)] = {
// 			t: 's',
// 			v: doc.unit,
// 			h: doc.unit,
// 			w: doc.unit,
// 		};
// 		workSheet['G' + (2 + i)] = {
// 			t: 's',
// 			v: doc.barcode,
// 			h: doc.barcode,
// 			w: doc.barcode,
// 		};
// 	});
// };

// var exportData = function(req,res){
// 	var _template = path.join(__dirname, '../config/customer.xlsx');
// 	var _tempFile = path.join(__dirname, '../public/_tmp/goods.xlsx');
// 	var workBook = xlsx.readFile(_template);
// 	var sheetName = workBook.SheetNames[0];
// 	var workSheet = workBook.Sheets[sheetName];
// 	var _exportData = function(docs){
// 		_buildWorkSheet(workSheet,docs);
// 		logger.debug('export workSheet: ' + JSON.stringify(workSheet));
// 		xlsx.writeFile(workBook, _tempFile);
// 		process.nextTick(function() {
// 			if (require('fs').existsSync(_tempFile)) {
// 				logger.debug('export _tempFile: ' + _tempFile);
// 				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
// 				res.setHeader("Content-Disposition", "attachment; filename=goods.xlsx");
// 				// res.attachment(_tempFile);
// 				res.sendFile(_tempFile);
// 			}
// 		});
// 	};

// 	models
// 		.Goods
// 		.find({
// 		})
// 		.exec(function(err,docs){
// 			if(err) return res.send(err);
// 			// console.log(docs)
// 			_exportData(docs);
// 		});
// };
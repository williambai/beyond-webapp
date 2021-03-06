var util = require('util');
var _ = require('underscore');
var async = require('async');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var regexp = require('../libs/regexp');
var iconv = require('iconv-lite');

exports = module.exports = function(app, models) {

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
 		var set = {
 			'goods.packagecode': req.body.packagecode || '',
 			'department.name': req.body.department_name || '',
 			'department.city': req.body.department_city || '贵阳',
 			'department.district': req.body.department_district || '',
 			'department.grid': req.body.department_grid || '',
 			'status': req.body.status,
 		};
 		// var history = '';
 		// if(req.body.packagecode != req.body.goods.pakcagecode){
 		// 	history += '对账编码：' + req.body.goods.packagecode + ' => ' + req.body.packagecode;
 		// }
 		// if(req.body.department_name != req.body.department.name){
 		// 	history += '部门名称：' + req.body.department.name + ' => ' + req.body.department_name;
 		// }
 		// if(req.body.department_city != req.body.department.city){
 		// 	history += '城市：' + req.body.department.city + ' => ' + req.body.department_city;
 		// }
 		// if(req.body.department_district != req.body.department.district){
 		// 	history += '地区：' + req.body.department.district + ' => ' + req.body.department_district;
 		// }
 		// if(req.body.department_grid != req.body.department.grid){
 		// 	history += '网格：' + req.body.department.grid + ' => ' + req.body.department_grid;
 		// }
 		// if(req.body._status != req.body.status){
 		// 	history += '状态：' + req.body.status + ' => ' + req.body._status;
 		// }
 		// //** 没改变
 		// if(history == '') return res.send({}); 			
 		models.Order.findByIdAndUpdate(id, {
 				$set: set,
 				// $push: {
 				// 	'histories': history,
 				// }
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
 			case 'count':
 			case 'search':
 				//** 查询起始时间
 				var from = new Date(req.query.from || 0);
 				//** 查询结束时间
 				var to = new Date(req.query.to || Date.now());
 				to = new Date(to.getTime() + 1000 * 3600 * 24);
 				//** 搜索字符串
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
 				var city = req.query.city;
 				var district = req.query.district;
 				var grid = req.query.grid;
 				var status = req.query.status;
 				var query = models.Order.find({
 					$or: [{
 						'customer.mobile': {
 							$regex: searchRegex
 						}
 					}, {
 						'createBy.mobile': {
 							$regex: searchRegex
 						}
 					}]
 				});
 				query.where({
 					'lastupdatetime': {
 						$gt: from,
 						$lte: to
 					}
 				});
 				if (!_.isEmpty(grid)) {
	 				var gridStr = grid || '';
	 				var gridRegex = new RegExp(regexp.escape(gridStr), 'i');
 					query.where({
 						'department.grid': gridRegex
 					});
 				}
 				if (!_.isEmpty(district)) {
	 				var districtStr = district || '';
	 				var districtRegex = new RegExp(regexp.escape(districtStr), 'i');
 					query.where({
 						'department.district': districtRegex
 					});
 				}
 				if (!_.isEmpty(city)) {
	 				var cityStr = city || '';
	 				var cityRegex = new RegExp(regexp.escape(cityStr), 'i');
 					query.where({
 						'department.city': cityRegex
 					});
 				}
 				if (!_.isEmpty(status)) {
 					query.where({
 						'status': status
 					});
 				}
 				console.log(JSON.stringify(query.getQuery()));
 				if(action == 'count'){
 					query.count(function(err,total){
 						if(err) return res.send(err);
 						res.send({total: total});
 					});
 				}else{
 					query.sort({
 							_id: -1
 						})
 						.skip(per * page)
 						.limit(per)
 						.exec(function(err, docs) {
 							if (err) return res.send(err);
 							res.send(docs);
 						});
 				}
 				break;
 			case 'exportTpl': 
 				var filename = 'order.xlsx';
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + filename);
				models.Order
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
 				var filename = 'order.xlsx';
 				//** 查询起始时间
 				var from = new Date(req.query.from || 0);
 				//** 查询结束时间
 				var to = new Date(req.query.to || Date.now());
 				to = new Date(to.getTime() + 1000 * 3600 * 24);
 				var city = req.query.city;
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + filename);
				if(_.isEmpty(city)){
					models.Order
						.toExcel({
							'lastupdatetime': {
								$gt: from,
								$lte: to
							}							
						},function(err,workbook){
							if(err) return res.send(err);
							workbook.xlsx
								.write(res)
								.then(function(){
									res.end();
								});
						});
				}else{
					var cityStr = city || '';
					var cityRegex = new RegExp(regexp.escape(cityStr), 'i');
					models.Order
						.toExcel({
							'lastupdatetime': {
								$gt: from,
								$lte: to
							},
	 						'department.city': cityRegex,
						},function(err,workbook){
							if(err) return res.send(err);
							workbook.xlsx
								.write(res)
								.then(function(){
									res.end();
								});
						});
				}
				// res.writeHead(200, {
				// 	'Content-Type': 'text/csv;charset=utf-8',
				// 	'Content-Disposition': 'attachment; filename=orders.csv'
				// });
 			// 	if (_.isEmpty(city)) {
	 		// 		models.Order
	 		// 			.findAndStreamCsv({
	 		// 				'lastupdatetime': {
	 		// 					$gt: from,
	 		// 					$lte: to
	 		// 				}
	 		// 			})
	 		// 			.pipe(iconv.encodeStream('GBK'))
	 		// 			.pipe(res);
 			// 	}else{
	 		// 		var cityStr = city || '';
	 		// 		var cityRegex = new RegExp(regexp.escape(cityStr), 'i');
				// 	models.Order
				// 		.findAndStreamCsv({
	 		// 				'department.city': cityRegex,
				// 			'lastupdatetime': {
				// 				$gt: from,
				// 				$lte: to
				// 			}
				// 		})
				// 		.pipe(iconv.encodeStream('GBK'))
				// 		.pipe(res);
 			// 	}
 				break;
 			default:
 				// var cityStr = req.session.department.city || '';
 				// var cityRegex = new RegExp(regexp.escape(cityStr), 'i');
 				models.Order
 					.find({
 					})
 					.sort({
 						lastupdatetime: -1
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

 /**
 
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

  */
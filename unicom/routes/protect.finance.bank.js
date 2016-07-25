var util = require('util');
var path = require('path');
var fs = require('fs');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var _ = require('underscore');
var async = require('async');
var regexp = require('../libs/regexp');

exports = module.exports = function(app, models) {

 	var add = function(req, res) {
	 		var action = req.body.action || '';
	 		switch(action){
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
		 			async.each(attachments, function(attachment, cb) {
		 				var file = path.join(__dirname, '../public', attachment);
		 				if (!fs.existsSync(file)) {
		 					return cb({
		 						code: 40440,
		 						msg: '文件不存在'
		 					});
		 				}
		 				logger.debug('file: ' + file);
		 				//** 导入excel
		 				models.FinanceBank.fromExcel(file, function(err,result){
		 					if(err) return cb(err);
		 					cb(null,result);
		 				});
			 			}, function(err, result) {
		 				if (err) return res.send(err);
		 				res.send({});
		 			}); 
 				break;
 			default:
 				res.send({});
 				break;
 		}
 	};
 	var getOne = function(req,res){
 		var id = req.params.id;
 		models.FinanceBank
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var action = req.query.action || '';
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		switch (action) {
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
 				var query = models.FinanceBank.find({
 					$or: [{
 						'accountName': {
 							$regex: searchRegex
 						}
 					}, {
 						'mobile': {
 							$regex: searchRegex
 						}
 					}]
 				});
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
			case 'exportTpl':
 				var filename = 'bank.xlsx';
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + filename);
				models.FinanceBank
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
 				var filename = 'bank.xlsx';
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + filename);
				models.FinanceBank
					.toExcel({},function(err,workbook){
						if(err) return res.send(err);
						workbook.xlsx
							.write(res)
							.then(function(){
								res.end();
							});
					});
 				break;
 			default:
 				models.FinanceBank
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
 	 * add protect/finance/banks
 	 */
 	app.post('/protect/finance/banks', app.grant, add);

 	/**
 	 * get protect/finance/banks
 	 */
 	app.get('/protect/finance/banks/:id', app.grant, getOne);

 	/**
 	 * get protect/finance/banks
 	 * action:
 	 * 	     action=search&searchStr=?
 	 */
 	app.get('/protect/finance/banks', app.grant, getMore);
 };
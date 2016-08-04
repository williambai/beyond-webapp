var fs = require('fs');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var regexp = require('../libs/regexp');
var async = require('async');
var iconv = require('iconv-lite');
var utils = require('../libs/utils');
var _ = require('underscore');

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
	 						msg: '文件不存在'
	 					});
	 				}
	 				logger.debug('file: ' + file);
					//** 导入excel
					models.FinanceBonusUnicom.fromExcel(file, function(err,result){
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
	 	}
	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.FinanceBonusUnicom.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};

 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		set = _.pick(set,'sellerName','sellerMobile');//** 只允许修改的参数
 		set.lastupdatetime = new Date();
 		models.FinanceBonusUnicom.findByIdAndUpdate(id,
 			{
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
 		models.FinanceBonusUnicom
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var now = new Date();
 		var action = req.query.action || '';
 		var year = req.query.year || now.getFullYear();
 		var month = req.query.month || (now.getMonth() + 1);
 		var status = req.query.status || '';
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		switch(action){
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(regexp.escape(searchStr),'i');
 				var query = models.FinanceBonusUnicom.find({
 						month: utils.dateFormat(new Date(year,month-1), 'yyyyMM'),
	 					$or: [{
	 						'sellerMobile': {
	 							$regex: searchRegex
	 						}
	 					}, {
	 						'sellerName': {
	 							$regex: searchRegex
	 						}
	 					}, {
	 						'mobile': {
	 							$regex: searchRegex
	 						}
	 					}]
	 				});
 				if (!_.isEmpty(status)) {
 					query.where({
 						status:status,
 					});
 				}
 				query.skip(per * page)
		 			.limit(per)
		 			.exec(function(err, docs) {
		 				if (err) return res.send(err);
		 				res.send(docs);
		 			});
 				break;
			case 'export':
				//** 导出对账单
 				var filename = 'statement'+ utils.dateFormat(new Date(year,month-1), 'yyyyMM') +'.xlsx';
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + filename);
				models.FinanceBonusUnicom
					.toExcel({
						month: utils.dateFormat(new Date(year,month-1), 'yyyyMM'),						
					},function(err,workbook){
						if(err) return res.send(err);
						workbook.xlsx
							.write(res)
							.then(function(){
								res.end();
							});
					});
 				break;
 			default:
		 		models.FinanceBonusUnicom
		 			.find({})
		 			.sort({lastupdatetime: -1})
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
 	 * add protect/finance/statements
 	 * action:
 	 *     
 	 */
 	app.post('/protect/finance/statements', app.grant, add);
 	/**
 	 * update protect/finance/statements
 	 * action:
 	 *     
 	 */
 	app.put('/protect/finance/statements/:id', app.grant, update);

 	/**
 	 * delete protect/finance/statements
 	 * action:
 	 *     
 	 */
 	app.delete('/protect/finance/statements/:id', app.grant, remove);
 	/**
 	 * get protect/finance/statements
 	 */
 	app.get('/protect/finance/statements/:id', app.grant, getOne);

 	/**
 	 * get protect/finance/statements
 	 *      ?year=#&month=#
 	 * action:
 	 * 		?action=search&searchStr=#&year=#&month=#
 	 */
 	app.get('/protect/finance/statements', app.grant, getMore);
 };
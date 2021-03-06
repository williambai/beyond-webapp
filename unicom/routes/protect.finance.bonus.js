var fs = require('fs');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var regexp = require('../libs/regexp');
var async = require('async');
var iconv = require('iconv-lite');
var utils = require('../libs/utils');

exports = module.exports = function(app, models) {

 	var _ = require('underscore');

	var add = function(req, res) {
 		var type = req.body.type || '';
 		switch (type) {
 			case 'bonusExec':
 				//** 核算汇总佣金
 				res.send({});
 				break;
 			case 'bonusStatus':
 				//** 按月批量修改佣金状态为“已发放”
 				res.send({});
 				break;
 			default:
 				res.send({});
		 		// var doc = req.body;
		 		// models.FinanceBonus.create(doc,function(err) {
		 		// 	if (err) return res.send(err);
		 		// 	res.send({});
		 		// });
	 	}
	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.FinanceBonus.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};

 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		set = _.pick(set,'tax','cash','reason','status');//** 只允许修改的参数
 		set.lastupdatetime = new Date();
 		models.FinanceBonus.findByIdAndUpdate(id,
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
 		models.FinanceBonus
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
 				var query = models.FinanceBonus.find({
 						year: year,
 						month: month,
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
			case 'bonusExport':
 				//** 导出佣金
 				var filename = 'bonus'+ utils.dateFormat(new Date(year,month-1), 'yyyyMM') +'.xlsx';
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + filename);
				models.FinanceBonus
					.toExcel({
						year: utils.dateFormat(new Date(year,month-1), 'yyyy'),
						month: utils.dateFormat(new Date(year,month-1), 'MM'),						
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
		 		models.FinanceBonus
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
 	 * add protect/finance/bonuses
 	 * action:
 	 *     
 	 */
 	app.post('/protect/finance/bonuses', app.grant, add);
 	/**
 	 * update protect/finance/bonuses
 	 * action:
 	 *     
 	 */
 	app.put('/protect/finance/bonuses/:id', app.grant, update);

 	/**
 	 * delete protect/finance/bonuses
 	 * action:
 	 *     
 	 */
 	app.delete('/protect/finance/bonuses/:id', app.grant, remove);
 	/**
 	 * get protect/finance/bonuses
 	 */
 	app.get('/protect/finance/bonuses/:id', app.grant, getOne);

 	/**
 	 * get protect/finance/bonuses
 	 *      ?year=#&month=#
 	 * action:
 	 * 		?action=search&searchStr=#&year=#&month=#
 	 */
 	app.get('/protect/finance/bonuses', app.grant, getMore);
 };
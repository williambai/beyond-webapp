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
	 			async.eachSeries(attachments, function(attachment, cb) {
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
	 				models.FinanceBonusUnicom.importCSV(data,function(err){
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
		 		models.FinanceBonus.create(doc,function(err) {
		 			if (err) return res.send(err);
		 			res.send({});
		 		});
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
 			case 'export': 
				res.writeHead(200, {
					'Content-Type': 'text/csv;charset=utf-8',
					'Content-Disposition': 'attachment; filename=bonus.csv'
				});
				models.FinanceBonusUnicom
					.findAndStreamCsv({
		 				month: utils.dateFormat(new Date(year,month-1), 'yyyyMM'),						
					})
					.pipe(iconv.encodeStream('GBK'))
					.pipe(res);
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
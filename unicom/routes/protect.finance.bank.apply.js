var _ = require('underscore');
var regexp = require('../libs/regexp');

exports = module.exports = function(app, models) {

 	var update = function(req, res) {
 		var id = req.params.id || '';
 		var status = req.body.status || '';
 		if(!(status == '通过' || status == '放弃')) return res.send({'message': '命令不存在'});
 		//** 更新申请项的状态
 		models.FinanceBankApply.findByIdAndUpdate(id,
 			{
 				$set: {
 					status: status,
 				}
 			},
 			{
 				'upsert': false,
 				'new': true,
 			},
 			function(err,bank){
	 			if(err) return res.send(err);
	 			if(status == '通过'){
	 				set = _.pick(bank,'mobile','username','bankName','bankCode','bankAddr','accountName','accountNo','cardId','expired');//** 只允许修改的参数
	 				set.lastupdatetime = new Date();
	 				//** 更新银行卡信息
					models.FinanceBank.findOneAndUpdate({
							uid: bank.uid,
			 		},
						{
							$set: set
						}, {
							'upsert': true,
							'new': true,
						},
						function(err, doc) {
							if (err) return res.send(err);
							res.send({'message': '已更新'});
						}
					);
	 			}else{
	 				res.send({'message': '没有更新'});
	 			}
 		});
 	};

 	var getOne = function(req, res) {
 		var id = req.params.id;
 		models.FinanceBankApply
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
 				var query = models.FinanceBankApply.find({
 					$or: [{
 						'username': {
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
 			// case 'export': 
				// res.writeHead(200, {
				// 	'Content-Type': 'text/csv;charset=utf-8',
				// 	'Content-Disposition': 'attachment; filename=banks.csv'
				// });
				// models.FinanceBankApply
				// 	.findAndStreamCsv({})
				// 	.pipe(res);
 			// 	break;
 			default:
 				models.FinanceBankApply
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
 	 * update protect/finance/bank/applys
 	 */
 	app.put('/protect/finance/bank/applys/:id', app.grant, update);

 	/**
 	 * get protect/finance/bank/applys
 	 */
 	app.get('/protect/finance/bank/applys/:id', app.grant, getOne);

 	/**
 	 * get protect/finance/bank/applys
 	 * action:
 	 * 	     action=search&searchStr=?
 	 */
 	app.get('/protect/finance/bank/applys', app.grant, getMore);
 };
 exports = module.exports = function(app, models) {

 	var getOne = function(req, res) {
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
 				var searchRegex = new RegExp(searchStr, 'i');
 				var query = models.FinanceBank.find({
 					'accountName': {
 						$regex: searchRegex
 					}
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
 	 * get protect/finance/banks
 	 */
 	app.get('/protect/finance/banks/:id', app.isLogin, getOne);

 	/**
 	 * get protect/finance/banks
 	 * action:
 	 * 	     action=search&searchStr=?
 	 */
 	app.get('/protect/finance/banks', app.isLogin, getMore);
 };
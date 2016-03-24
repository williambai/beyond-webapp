 exports = module.exports = function(app, models) {

 	var getOne = function(req, res) {
 		var id = req.params.id;
 		models.FinanceBonus
 			.findById({
 				_id: id,
 				uid: req.session.accountId, //** 只能看自己的 			 				
 			})
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.FinanceBonus
 			.find({
 				uid: req.session.accountId, //** 只能看自己的 			 				
 			})
 			.skip(per * page)
 			.limit(per)
 			.exec(function(err, docs) {
 				if (err) return res.send(err);
 				res.send(docs);
 			});
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * get private/finance/bonuses
 	 */
 	app.get('/private/finance/bonuses/:id', app.isLogin, getOne);

 	/**
 	 * get private/finance/bonuses
 	 * type:
 	 */
 	app.get('/private/finance/bonuses', app.isLogin, getMore);
 };
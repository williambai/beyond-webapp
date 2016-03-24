 exports = module.exports = function(app, models) {

 	var _ = require('underscore');

 	var add = function(req, res) {
		res.send({});
 	};
 	var remove = function(req,res){
 			res.send({});
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
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		switch(action){
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var regex = new RegExp(searchStr,'i');
 				models.FinanceBonus
 					find({
 						year: year,
 						month: month,
 						$or: [{
  							name: {
 								$regex: regex,
 							},
 						},{
 							mobile: {
 								$regex: regex,
 							}
 						}],
 					})
		 			.skip(per * page)
		 			.limit(per)
		 			.exec(function(err, docs) {
		 				if (err) return res.send(err);
		 				res.send(docs);
		 			});
 				break;
 			default:
		 		models.FinanceBonus
		 			.find({
		 				year: year,
		 				month: month
		 			})
		 			.sort({_id: -1})
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
 	app.post('/protect/finance/bonuses', app.isLogin, add);
 	/**
 	 * update protect/finance/bonuses
 	 * action:
 	 *     
 	 */
 	app.put('/protect/finance/bonuses/:id', app.isLogin, update);

 	/**
 	 * delete protect/finance/bonuses
 	 * action:
 	 *     
 	 */
 	app.delete('/protect/finance/bonuses/:id', app.isLogin, remove);
 	/**
 	 * get protect/finance/bonuses
 	 */
 	app.get('/protect/finance/bonuses/:id', app.isLogin, getOne);

 	/**
 	 * get protect/finance/bonuses
 	 *      ?year=#&month=#
 	 * action:
 	 * 		?action=search&searchStr=#&year=#&month=#
 	 */
 	app.get('/protect/finance/bonuses', app.isLogin, getMore);
 };
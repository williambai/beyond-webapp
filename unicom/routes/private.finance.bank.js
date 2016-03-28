var _ = require('underscore');

 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = req.body;
 		doc.uid = req.session.accountId;
 		doc.mobile = req.session.email;
 		models.FinanceBank
 			.create(doc,function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.FinanceBank
 			.findOneAndRemove({
 				_id: id,
 				uid: req.session.accountId, //** 只能删自己的
 			},function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var meId = req.session.accountId;
 		var set = req.body;
 		//** 移除id
 		set = _.omit(set,'_id');
 		set.uid = meId;
 		set.mobile = req.session.email;
 		models.FinanceBank
 			.findOneAndUpdate({
	 			uid: meId, //** 只能改自己的 			
	 		}, {
 				$set: set
 			}, {
 				'upsert': true,
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
 		models.FinanceBank
 			.findOne({
 				uid: req.session.accountId, //** 只能看自己的 			 				
 			})
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				if(!doc) return res.send({});
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.FinanceBank
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
 	 * add private/finance/banks
 	 * type:
 	 *     
 	 */
 	app.post('/private/finance/banks', app.isLogin, add);
 	/**
 	 * update private/finance/banks
 	 * type:
 	 *     
 	 */
 	app.put('/private/finance/banks/:id', app.isLogin, update);

 	/**
 	 * delete private/finance/banks
 	 * type:
 	 *     
 	 */
 	app.delete('/private/finance/banks/:id', app.isLogin, remove);
 	/**
 	 * get private/finance/banks
 	 */
 	app.get('/private/finance/banks/:id', app.isLogin, getOne);

 	/**
 	 * get private/finance/banks
 	 * type:
 	 */
 	app.get('/private/finance/banks', app.isLogin, getMore);
 };
/**
 * 用户申请、更新和查看收款银行卡信息
 * 
 */

var _ = require('underscore');

 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = req.body;
 		doc.uid = req.session.accountId;
 		doc.username = req.session.username;
 		doc.mobile = req.session.email;
 		doc.status = '新建';
 		models.FinanceBankApply
 			.create(doc,function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.FinanceBankApply
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
 		set = _.omit(set, '__v');
 		set.uid = meId;
 		set.username = req.session.username;
 		set.mobile = req.session.email;
 		set.status = '新建';
 		models.FinanceBankApply
 			.create(set,function(err) {
 				if (err) return res.send(err);
 				res.send({message: '申请成功。'});
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
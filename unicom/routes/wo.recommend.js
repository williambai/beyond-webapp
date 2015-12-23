var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:wo.recommend');
logger.setLevel('INFO');

exports = module.exports = function(app, models) {
 	var _ = require('underscore');
 	var async = require('async');

 	var add = function(req, res) {
 		var mobiles = req.body.mobile || [];
 		mobiles = _.without(mobiles,'');
 		var docs = [];
 		_.each(mobiles, function(mobile){
 			docs.push({
 				customer: {
 					mobile: mobile,
 				},
 				product: req.body.product || {},
 				goods: req.body.goods || {},
 				status: '新建',
 				createBy: {
 					id: req.session.accountId,
 					name: req.session.username,
 					mobile: req.session.email,
 				}
 			});
 		});
 		async.waterfall(
 			[
 				function(callback){
					models.WoOrder.create(docs,callback);
 				},
 				function(docs,callback){
 					var activity = {
 						uid: req.session.accountId,
 						username: req.session.username,
 						avatar: req.session.avatar || '/images/avatar.jpg',
 						type: 'text',
 						content: {
 							body: '向朋友推荐了<u>' + req.body.product.name + '</u>产品',
 						}
 					};
 					models.AccountActivity.create(activity,callback);
 				}
 			],function(err,result) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add wo/orders
 	 * type:
 	 *     
 	 */
 	app.post('/recommends', add);
 };
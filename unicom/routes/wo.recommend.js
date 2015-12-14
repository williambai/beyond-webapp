var log4js = require('log4js'); 
var path = require('path');
log4js.configure(path.join(__dirname,'../config/log4js.json'));
var logger = log4js.getLogger('server');
logger.setLevel('DEBUG');

exports = module.exports = function(app, models) {
 	var _ = require('underscore');
 	var async = require('async');

 	var add = function(req, res) {
 		var mobiles = req.body.mobile || [];
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
 						uid: 'uid',
 						username: 'username',
 						avatar: '/_tmp/1450013522516.jpg',
 						type: 'text',
 						content: {
 							body: 'content',
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
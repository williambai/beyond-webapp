 exports = module.exports = function(app, models) {
 	var async = require('async');
 	var _ = require('underscore');

 	var add = function(req, res) {
 		var id = req.params.id;
 		res.send({})
  	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		res.send({})
 	};
 	var update = function(req, res) {
 		var packageId = req.body.package.id;
 		if(!packageId) return res.send({code: 40400,errmsg: 'package[id] is null'});
 		var packages = req.body.packages || [];
 		var product = _.findWhere(packages, {_id: packageId});
 		if(!product) return res.send({code: 40401, errmsg: 'package[id] is not included in packages[]'});
 		var docs = [{
 				name: product.name || '',
 				description: product.description || '',
 				category: '终端',
 				items: [{
 					id: product._id,
 					model: 'ProductPhonePackage',
 					name: product.name,
 					price: product.price || 0,
 					quantity: 1,
 					category: product.category || '',
 					source: product.goods || {},
 				}],
 				total: product.price || 0,
 				dispatch: '自提',
				customer: req.body.customer,
				status: '新建',
 				createBy: {
 					id: req.session.accountId,
 					username: req.session.username,
 					mobile: req.session.email,
					avatar: req.session.avatar,
 				}
 			}
 		];
 		async.waterfall(
 			[
 				function(callback){
					models.Order.create(docs,callback);
 				},
 				function(docs,callback){
 					var activity = {
 						uid: req.session.accountId,
 						username: req.session.username,
 						avatar: req.session.avatar || '/images/avatar.jpg',
 						type: 'text',
 						content: {
 							body: '向朋友推荐了<u>' + product.name + '</u>产品',
 						}
 					};
 					models.AccountActivity.create(activity,callback);
 				}
 			],function(err,result) {
 			if (err) return res.send(err);
 			res.send({});
 		});
  	};
 	var getOne = function(req, res) {
 		var id = req.params.id;
 		models.ProductPhone
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.ProductPhone
 			.find({})
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
 	 * add channel/product/phones
 	 * type:
 	 *     
 	 */
 	app.post('/channel/product/phones', add);
 	/**
 	 * update channel/product/phones
 	 * type:
 	 *     
 	 */
 	app.put('/channel/product/phones/:id', update);

 	/**
 	 * delete channel/product/phones
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/product/phones/:id', remove);
 	/**
 	 * get channel/product/phones
 	 */
 	app.get('/channel/product/phones/:id', getOne);

 	/**
 	 * get channel/product/phones
 	 * type:
 	 */
 	app.get('/channel/product/phones', getMore);
 };
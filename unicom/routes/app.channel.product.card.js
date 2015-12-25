var log4js = require('log4js');
var logger = log4js.getLogger('route:channel.product.card');
logger.setLevel('INFO');

exports = module.exports = function(app, models) {
	var _ = require('underscore');
 	var async = require('async');

 	var add = function(req, res) {
 		var card = req.body.card || {};
 		var packages = req.body.packages || [];
 		var customer = req.body.customer || {};
 		var place = req.body.place || {};

 		var total = card.price;
 		var items = [];
 		//add card product
 		items.push({
 			id: card._id,
 			model: 'ProductCard',
 			name: card.cardNo,
 			price: card.price,
 			quantity: 1,
 			category: '号卡',
 			source: {
 				id: card.goodsId || '',
 				name: card.goodsName || '',
 			}
 		});
 		//add packages 
 		_.each(packages, function(pkg){
 			total += pkg.price;
 			items.push({
 				id: pkg.id,
 				model: 'ProductCardPackage',
 				name: pkg.name,
 				price: pkg.price,
 				quantity: 1,
 				category: pkg.category,
 				source: {
 					id: pkg.goodsId || '',
 					name: pkg.goodsName || '',
 				}
 			});
 		});
 		var docs = {
 				name: card.cardNo,
 				description: card.cardNo + '号卡预订',
 				category: '号卡',
 				items: items,
 				total: total,
 				place: place,
 				dispatch: '自提',
 				customer: {
 					id: customer.phone,
 					name: customer.name,
 				},
 				customerInfo: customer,
				// customer: {
				// 	name: req.body.customer.name || '',
				// 	idNo: req.body.customer.idNo || '',
				// 	idType: req.body.customer.idType || '',
				// 	idAddress: req.body.customer.idAddress || '',
				// 	address: req.body.customer.address || '',
				// 	mobile: mobile,
				// 	location: req.body.customer.location || '',
				// }, 				
				status: '新建',
 				createBy: {
 					id: req.session.accountId,
 					username: req.session.username,
 					mobile: req.session.email,
					avatar: req.session.avatar,
 				}
 			};
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
 							body: '向朋友推荐了价值<u>' + total.toFixed(2) +'</u>元的号卡产品',
 						}
 					};
 					models.AccountActivity.create(activity,callback);
 				}
 			],function(err,result) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
		res.send({});
 	};
 	var update = function(req, res) {
		res.send({});
 	};
 	var getOne = function(req, res) {
 		var id = req.params.id;
 		models.ProductCard
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

 		models.ProductCard
 			.find({})
 			.sort({_id: -1})
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
 	 * add channel/product/cards
 	 * type:
 	 *     
 	 */
 	app.post('/channel/product/cards', add);
 	/**
 	 * update channel/product/cards
 	 * type:
 	 *     
 	 */
 	app.put('/channel/product/cards/:id', update);

 	/**
 	 * delete channel/product/cards
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/product/cards/:id', remove);
 	/**
 	 * get channel/product/cards
 	 */
 	app.get('/channel/product/cards/:id', app.grant, getOne);

 	/**
 	 * get channel/product/cards
 	 * type:
 	 */
 	app.get('/channel/product/cards', app.grant, getMore);
 };
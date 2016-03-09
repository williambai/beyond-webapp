var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

exports = module.exports = function(app, models) {
	var _ = require('underscore');
 	var async = require('async');

 	var add = function(req, res) {
 		var card = req.body.card || {};
 		var packages = req.body.packages || [];
 		var customer = req.body.customer || {};
 		var place = req.body.place || {};
 		//** use max bonus
 		var bonus = {
 			income: 0,
 			times: 0,
 			points: 0,	
 		};
 		var total = card.price;
 		var items = [];
 		//add card product
 		items.push({
 			id: card._id,
 			model: 'ProductCard',
 			name: card.name,
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
 			//** sum price into total
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
 			//find max bonus
 			if(pkg.bonus && (pkg.bonus.income > bonus.income)) bonus.income = pkg.bonus.income;
 			if(pkg.bonus && (pkg.bonus.times > bonus.times)) bonus.times = pkg.bonus.times;
 			if(pkg.bonus && (pkg.bonus.points > bonus.points)) bonus.points = pkg.bonus.points;
 		});

 		var docs = {
 				name: card.name + '号卡预订',
 				description: '购买手机号码及套餐',
 				category: '号卡',
 				items: items,
 				total: total,
 				place: place,
 				dispatch: {
 					method: '自提',
 				},
 				customer: {
 					id: card.name,
 					name: customer.name,
 				},
 				customerInfo: customer,
				status: '新建',
 				createBy: {
 					id: req.session.accountId,
 					username: req.session.username,
 					mobile: req.session.email,
					avatar: req.session.avatar,
 				},
 				bonus: bonus,
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
 			.find({
 				status: '有效'
 			})
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
 	app.post('/channel/product/cards', app.grant, add);
 	/**
 	 * update channel/product/cards
 	 * type:
 	 *     
 	 */
 	app.put('/channel/product/cards/:id', app.grant, update);

 	/**
 	 * delete channel/product/cards
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/product/cards/:id', app.grant, remove);
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
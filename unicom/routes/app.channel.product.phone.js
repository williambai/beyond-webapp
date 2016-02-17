 exports = module.exports = function(app, models) {
 	var async = require('async');
 	var _ = require('underscore');

 	var add = function(req, res) {
		var phone = req.body.phone || {};
		var customer = req.body.customer || {};
		var place = req.body.place || {};
 		var packages = req.body.packages || [];
 		if(packages.length == 0) return res.send({code: 40401, errmsg: 'packages is not selected.'});

 		//** use max bonus
 		var bonus = {
 			income: 0,
 			times: 0,
 			points: 0,	
 		};
 		var total = 0;
 		var items = [];
 		//add phone product
 		items.push({
 			id: phone._id,
 			model: 'ProductPhone',
 			name: phone.name,
 			price: phone.price,
 			quantity: 1,
 			category: '终端',
 			source: {
 				id: phone.goodsId || '',
 				name: phone.goodsName || '',
 			}
 		});
 		//add packages 
 		_.each(packages, function(pkg){
 			//** sum price into total
 			total += pkg.price;
 			items.push({
 				id: pkg.id,
 				model: 'ProductPhonePackage',
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

 		var docs = [{
 				name: phone.name + '终端预订',
 				description: '购买终端产品及套餐',
 				category: '终端',
 				items: items,
 				total: total,
 				place: place,
 				dispatch: {
 					method: '自提',
 				},
 				customer: {
 					id: '',
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
 							body: '向朋友推荐了价值<u>' + total.toFixed(2) +'</u>元的终端产品',
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
 			.find({
 				status: '有效',
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
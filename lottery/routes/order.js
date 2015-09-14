exports = module.exports = function(app,models){
var crypto = require('crypto');
var _ = require('underscore');
var async = require('async');
var lottery = require('../libs/lottery');

var add = function(req,res){
		var order = req.body;
		order.customer = order.customer || {};
		order.game = order.game || {};
		order.game.playtype = 1;
		order.game.chipintype = 0;
		order.createby = {
			id: req.session.account._id,
			email: req.session.account.email,
			username: req.session.account.username,
		};
		order.records = [];
		order.status = 0;
		order.lastupdatetime = new Date();

		async.waterfall(
			[
				function _account(callback){
					var user = order.customer;
					if(!user.email || !user.username) return callback({code: 40100,message: '参数缺失'});
					models.Account.findOne(
						user,
						function(err,account){
							var user = order.customer;
							if(err){
								callback(err);
								return;
							}
							if(!account){
								user.createby = order.createby;
								user.password = crypto.createHash('sha256')
														.update((parseInt(1000000*Math.random())).toString())
														.digest('hex');
								user.roles = {
										admin: false,
										agent: false,
										user: true
									};
									
								user.business = {
									type: {
										SSQ: true,
										QLC: true,
										FC3D: true
									}
								};
								user.balance = 0;
								user.enable = true;
								var user = new models.Account(user);
								user.save(function(err){
									callback(err,user);
								});
							}else{
								callback(null,account);
							}
						}
					);
				},
				function _order(account,callback){
					order.customer.id = account._id;
					models.Order.create(order,callback);
				}
			],
			function(err,result){
				if(err){
					res.send(err);
					return;
				}
				res.send(result);
			}
		);
	};

var remove = function(req,res){
		var id = req.params.id;
		async.waterfall(
			[
				function(callback){
					models.Order.findByIdAndRemove(id,callback);
				}
			],
			function(err,result){
				if(err){
					res.send(err);
					return;
				}
				res.sendStatus(200);
			}
		);
	};

var buyNow = function(req,res){
		var orderid = req.params.id;
		async.waterfall(
			[
				function(callback){
					models.Order.findById(orderid,function(err,doc){
						if(err){
							callback(err);
							return;
						}
						if(!doc || !doc.game || !doc.customer){
							callback(new Error('not found!'));
							return;
						}
						var body = {
							ltype: doc.game.ltype,
							periodnum: doc.game.periodnum,
							username: doc.customer.username,
							idno: doc.customer.idno,
							mobile: doc.customer.mobile,
							records: {
								record: {
									orderno: doc._id,
									playtype: doc.game.playtype,
									chipintype: doc.game.chipintype,
									content: doc.game.content,
									orderamount: doc.game.orderamount
								}
							}
						};
						callback({body: body});
					});
				},
				function(body,callback){
					lottery.l1000(body,callback);
				},
				function(body,callback){
					models.Order.addMessage(orderid, body, callback);
				},
			],
			function(err,result){
				if(err){
					res.send(err);
					return;
				}
				res.sendStatus(200);
			}
		);
	};

	var update = function(req,res){
		var id = req.params.id;
		var orderSet = req.body;
		async.waterfall(
			[
				function(callback){
					models.Order.findByIdAndUpdate(
						id,
						{
							$set: orderSet
						},
						{
							'new': true,
							'select': {
								histroies: 0,
								records: 0
							}
						},
						callback
					);
				}
			],
			function(err,result){
				if(err){
					res.send(err);
					return;
				}
				res.send(result);
			}
		);
	};

var getById = function(req,res){
		var id = req.params.id;
		async.waterfall(
			[
				function(callback){
					models.Order.findById(id,callback);
				}
			],
			function(err,result){
				if(err){
					res.send(err);
					return;
				}
				res.send(result);
			}
		);
	};

var getOrders = function(req,res){
		var per = 20;
		var type = req.query.type || '';
		var page = req.query.page || 0;
		page = (!page || page < 0) ? 0 : page;
		var accountId = req.session.account._id;
		var roles = req.session.account.roles;
		switch(type){
			case 'search':
				var now = new Date();
				var from = new Date(req.query.from || 0);
				var to = new Date(req.query.to || now);
				var searchStr = req.query.searchStr || '';
				var searchRegex = new RegExp(searchStr,'i');
				var query = {
						lastupdatetime: {$gte: from, $lt: to},
						'createby.id': accountId,
						$or: [
								{'customer.username': {$regex: searchRegex}},
								{'customer.email': {$regex: searchRegex}}
							]
					};
				async.waterfall(
					[
						function(callback){
							if(roles.admin || roles.agent){
								models.Order.find(query)
									.skip(per*page)
									.limit(per)
									.exec(callback);
							}else{
								callback({code: 401001, message: '没有权限'});
							}
						},

					],function(err,result){
						if(err){
							res.send(err);
							return;
						}
						res.send(result);
					}
				);
				break;
			default:
				var query = {
						'createby.id': accountId,
					};
				async.waterfall(
					[
						function(callback){
							if(roles.admin || roles.agent){
								models.Order.find(query)
									.skip(per*page)
									.limit(per)
									.exec(callback);
							}else{
								callback({code: 401001, message: '没有权限'});
							}
						},				
					],
					function _result(err,result){
						if(err){
							res.send(err);
							return;
						}
						res.send(result);
					}
				);
				break;
		}

	};

var findByUser = function(req,res){
	var userid = req.session.account._id;
	var page = req.query.page || 0;
	async.waterfall(
		[
			function(callback){
				models.Order.findByCreator(userid, page, callback);
			}
		],
		function(err,result){
			if(err){
				res.send(err);
				return;
			}
			res.send(result);
		}
	);
};

/**
 * router outline
 */
 	/**
 	 * add order
 	 */
 	app.post('/orders', app.isLogined, add);

 	/**
 	 * remove order
 	 */
 	app.delete('/orders/:id', app.isLogined, remove);

	/**
 	 * update order info
 	 */
  	app.put('/orders/:id', app.isLogined, update);

	/**
 	 * request buy order right now
 	 */
  	app.post('/orders/:id/buynow', app.isLogined, buyNow);

  	/**
  	 * get orders
  	 */
  	app.get('/orders', app.isLogined, getOrders);

  	/**
  	 * get order by id
  	 */
  	app.get('/orders/:id', app.isLogined, getById);
};
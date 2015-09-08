exports = module.exports = function(app,models){
var async = require('async');
var lottery = require('../libs');

var add = function(req,res){
		var order = {
				customer: req.body.customer,
				game: {
					ltype: req.body.game.ltype,
					playtype: 1,
					chipintype: 0,
					content: req.body.game.content,
					periods: req.body.game.periods,
					sms: req.body.game.sms,
					remained: req.body.game.periods
				},
				createby: {
					id: req.session.account._id,
					email: req.session.account.email,
					username: req.session.account.username,
				},
				records: [],
				status: 0, //0: enable, -1: disable
				// expired: req.body.expired,
				lastupdatetime: new Date(),
			};
		// console.log(req.body)
		// console.log(order);		
		async.waterfall(
			[
				function _account(callback){
					models.Account.findOne({
						email: order.customer.email, 
						username:order.customer.username
					},
					{},
					function(err,account){
						if(err){
							callback(err);
							return;
						}
						if(!account){
							models.Account.register(
								order.customer.email,
								(parseInt(1000000*Math.random())).toString(),
								order.customer.username,
								'',
								function(err,newAccount){
								if(err){
									callback(err);
									return;
								}
								callback(null,newAccount);
							});
						}else{
							callback(null,account);
						}
					});
				},
				function _order(account,callback){
					order.customer.id = account._id.toString();
					order.customer.email = account.email;
					order.customer.username = account.username;
					models.Order.add(order,callback);
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

var remove = function(req,res){
		var id = req.params.id;
		console.log(id)
		async.waterfall(
			[
				function(callback){
					models.Order.remove(id,callback);
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
					models.Order.update(id,orderSet,callback);
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
		var type = req.query.type || '';
		var page = req.query.page || 0;
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
								models.Order.findAll(query,page,callback);
							}else{
								callback({errcode: 401001, errmsg: '没有权限'});
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
								models.Order.findAll(query,page,callback);
							}else{
								callback({errcode: 401001, errmsg: '没有权限'});
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
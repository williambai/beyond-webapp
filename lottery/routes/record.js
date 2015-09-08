exports = module.exports = function(app,models){
var async = require('async');
var lottery = require('../libs');

var add = function(req,res){
		var record = {
		};
				
		async.waterfall(
			[
				function(callback){
					models.Record.add(record,callback);
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
					models.Record.remove(id,callback);
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

	var update = function(req,res){
		var id = req.params.id;
		var orderSet = req.body;
		async.waterfall(
			[
				function(callback){
					models.Record.update(id,orderSet,callback);
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
					models.Record.findById(id,callback);
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

var getRecords = function(req,res){
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
								{'customer.email': {$regex: searchRegex}},
								{'game.periodnum': {$regex: searchRegex}}
							]
					};
				async.waterfall(
					[
						function(callback){
							if(roles.admin || roles.agent){
								models.Record.findAll(query,page,callback);
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
								models.Record.findAll(query,page,callback);
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

/**
 * router outline
 */
 	/**
 	 * add order
 	 */
 	app.post('/records', app.isLogined, add);

 	/**
 	 * remove order
 	 */
 	app.delete('/records/:id', app.isLogined, remove);

	/**
 	 * update order info
 	 */
  	app.put('/records/:id', app.isLogined, update);

  	/**
  	 * get records
  	 */
  	app.get('/records', app.isLogined, getRecords);

  	/**
  	 * get order by id
  	 */
  	app.get('/records/:id', app.isLogined, getById);
};
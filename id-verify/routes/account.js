 exports = module.exports = function(app,models){
 	var debug = require('debug')('account:router');
 	var async = require('async');
 	var path = require('path');
 	var fs = require('fs');

	var Account = models.Account;

	var add = function(req,res){
		var roles = req.session.account.roles;
		var creator = {
				id: (req.session.account && req.session.account._id),
				username: (req.session.account && req.session.account.username),
				avatar: (req.session.account && req.session.account.avatar)
			};
		var account = req.body;
		// var account = {
		// 		email: req.body.email,
		// 		password: req.body.password,
		// 		username: req.body.username,
		// 		roles: {
		// 			admin: req.body.roles['admin'] || false,
		// 			agent: req.body.roles['agent'] || false,
		// 			user: req.body.roles['user'] || false,
		// 			app: req.body.roles['app'] || false,
		// 		},
		// 		business: {
		// 			stage: req.body.stage || 'test',
		// 			type: {
		// 				verify: req.body.business['types']['verify'] || false,
		// 				base: req.body.business['types']['base'] || false,
		// 				whole: req.body.business['types']['whole'] || false
		// 			},
		// 			limit: req.body.limit || -1,
		// 			expired: req.body.expired || (new Date()).getTime() + 1000*60*60*24*3
		// 		},
		// 		balance: req.body.balance || 0,
		// 		enable: req.body.enable
		// 	};
		async.waterfall(
			[
				function _account(callback){
					if(roles.admin || roles.agent){
						Account.add(creator,account, callback);
					}else{
						callback({errcode: 401001, errmsg: '没有权限'});
					}
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

	var updateAccount = function(req,res){
			var roles = req.session.account.roles;
			var type = req.query.type || '';
			var meId = req.session.account._id;
			var accountId = req.params.id == 'me' 
								? meId
								: req.params.id;
			var account = req.body;
			switch(type){
				case 'times': 
					async.waterfall(
						[
							function(callback){
								if(roles.user){
									Account.updateTimes(accountId,account,callback);
								}else{
									callback({errcode: 401001, errmsg: '没有权限'});
								}
							},
						],
						function(err,result){
							if(err){
								res.send(err);
								return;
							}
							res.sendStatus(result);
						}
					);
					break;
				case 'balance': 
					async.waterfall(
						[
							function(callback){
								if(roles.user){
									Account.updateBalance(accountId,account,callback);
								}else{
									callback({errcode: 401001, errmsg: '没有权限'});
								}
							},
						],
						function(err,result){
							if(err){
								res.send(err);
								return;
							}
							res.sendStatus(result);
						}
					);
					break;
				case 'password': 
					async.waterfall(
						[
							function(callback){
								if(roles.user){
									account = _.pick(account,'password');
									Account.update(accountId,account,callback);
								}else{
									callback({errcode: 401001, errmsg: '没有权限'});
								}
							},
						],
						function(err,result){
							if(err){
								res.send(err);
								return;
							}
							res.sendStatus(result);
						}
					);
					break;
				case 'app': 
					async.waterfall(
						[
							function(callback){
								if(roles.admin || roles.agent){
									account = _.pick(account,'app');
									Account.update(accountId,account,callback);
								}else{
									callback({errcode: 401001, errmsg: '没有权限'});
								}
							},
						],
						function(err,result){
							if(err){
								res.send(err);
								return;
							}
							res.sendStatus(result);
						}
					);
					break;
				case 'avatar':
					async.waterfall(
						[
							function(callback){
								if(roles.user){
									// console.log(req.files);
									// res.writeHead(200, {'content-type': 'text/plain'});
									// res.write('received upload:\n\n');
									// var util = require('util');
									// res.end(util.inspect({files: req.files}));
									var file = req.files.files;
									var filename = app.randomHex() + '.' + file.extension;//file.name;
									var tmp_path = file.path;
									var new_path = path.join(__dirname, '../public/upload/',filename);
									var avatar = '/upload/' + filename;
									fs.rename(tmp_path,new_path,function(err){
										if(err) {
											console.log(err);
											res.sendStatus(400);
											return;
										}
										Account.updateAvatar(accountId,avatar, function(err){
											if(!err){
												res.end(avatar);
											}else{
												res.end();
											}
										});
									});
								}else{
									callback({errcode: 401001, errmsg: '没有权限'});
								}
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
					break;
				default:
					async.waterfall(
						[
							function(callback){
								if(roles.admin || roles.agent){
									Account.update(accountId,account,callback);
								}else{
									callback({errcode: 401001, errmsg: '没有权限'});
								}
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
					break;
			}
		// var account = {
		// 		email: req.body.email,
		// 		password: req.body.password,
		// 		username: req.body.username,
		// 		roles: {
		// 			admin: req.body.roles['admin'] || false,
		// 			agent: req.body.roles['agent'] || false,
		// 			user: req.body.roles['user'] || false,
		// 			app: req.body.roles['app'] || false,
		// 		},
		// 		business: {
		// 			stage: req.body.stage || 'test',
		// 			type: {
		// 				verify: req.body.types['verify'] || false,
		// 				base: req.body.types['base'] || false,
		// 				whole: req.body.types['whole'] || false
		// 			},
		// 			limit: req.body.limit || -1,
		// 			expired: req.body.expired || (new Date()).getTime() + 1000*60*60*24*3
		// 		},
		// 		balance: req.body.balance || 0,
		// 		enable: req.body.enable
		// 	};
			// if(req.body.username){
			// 	account.username = req.body.username;
			// }
			// if(req.body.password == req.body.password2){
			// 	account.password = req.body.password;
			// }
			// if(req.body.)
			// console.log(account);
		};

	var getAccount = function(req,res){
			var type = req.query.type || '';
			var meId = req.session.account._id;
			var accountId = req.params.id == 'me' 
								? meId
								: req.params.id;
			switch(type){
				default:
					async.waterfall(
						[
							function(callback){
								Account.findById(accountId, {}, callback);
							},
						],
						function(err,result){
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

	var getAccounts = function(req,res){
			var type = req.query.type || '';
			var page = req.query.page || 0;
			var accountId = req.session.account._id;
			var roles = req.session.account.roles;
			switch(type){
				case 'search':
					var searchStr = req.query.searchStr || '';
					async.waterfall(
						[
							function(callback){
								if(roles.admin || roles.agent){
									Account.findByString(accountId,searchStr,page,callback);
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
					async.waterfall(
						[
							function(callback){
								if(roles.admin || roles.agent){
									Account.findAll(accountId,page,callback);
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
 	 * add account
 	 */
 	app.post('/accounts', app.isLogined, add);
 	/**
 	 * update account
 	 * type: 
 	 *     times
 	 *     balance
 	 *     avatar
 	 *     password
 	 */
 	app.post('/accounts/:id', app.isLogined, updateAccount);
	/**
	 * query model
	 * type:
	 */
	app.get('/accounts/:id', app.isLogined,getAccount);
	// 
	/**
	 * query collection
	 * type: 
	 *      search
	 */
	app.get('/accounts', app.isLogined, getAccounts);
};
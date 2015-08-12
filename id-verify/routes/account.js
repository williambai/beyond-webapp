 exports = module.exports = function(app,models){
 	var debug = require('debug')('account:router');
 	var async = require('async');
 	var path = require('path');
 	var fs = require('fs');

	var Account = models.Account;

	var add = function(req,res){
		var creator = {
				id: (req.session.account && req.session.account._id),
				username: (req.session.account && req.session.account.username),
				avatar: (req.session.account && req.session.account.avatar)
			};
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
		// 			times: req.body.times || 10,
		// 			expired: req.body.expired
		// 		},
		// 	};
		var account = req.body;
		async.waterfall(
			[
				function _account(callback){
					Account.add(creator,account, function(account){
						if(!account){
							callback(400);
							return;
						}
						callback(null,account);
					});
				}
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.sendStatus(200);
			}
		);
	};

	var updateAvatar = function(req,res){
			var meId = req.session.accountId;
			var accountId = req.params.id == 'me' 
								? req.session.accountId
								: req.params.id;
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
		};

	var updateAccount = function(req,res){
			var meId = req.session.account._id;
			var accountId = req.params.id == 'me' 
								? meId
								: req.params.id;
			var account = req.body;
			// if(req.body.username){
			// 	account.username = req.body.username;
			// }
			// if(req.body.password == req.body.password2){
			// 	account.password = req.body.password;
			// }
			// if(req.body.)
			// console.log(account);
			Account.update(accountId,account);
			res.sendStatus(200);
		};

	var getAccount = function(req,res){
			var meId = req.session.account._id;
			var accountId = req.params.id == 'me' 
								? meId
								: req.params.id;

			async.waterfall(
				[
					function _account(callback){
						Account.findById(accountId, function(account){
							if(!account){
								callback(404);
								return;
							}
							callback(null,account);
						});
					}
				],
				function _result(err,result){
					if(err){
						res.sendStatus(err);
						return;
					}
					res.send(result);
				}
			);
		};

	var getAccounts = function(req,res){
			if(!req.query.type){
				res.sendStatus(400);
				return;
			}
			switch(req.query.type){
				case 'search': 
					_searchAccountsByString(req,res);
					break;
				default: 
					Account.findByString('',function(accounts){
						if(!accounts){
							res.sendStatus(404);
							return;
						}
						res.send(accounts);
					});
					break;
			}
		};

	var _searchAccountsByString = function(req,res){
			var accountId = req.session.account._id;
			var searchStr = req.query.searchStr;
			if(null == searchStr){
				res.sendStatus(400);
				return;
			}
			Account.findByString(accountId,searchStr,0,function(accounts){
				if(!accounts){
					res.sendStatus(404);
					return;
				}
				res.send(accounts);
			});
		};	

/**
 * router outline
 */
 	//add account
 	app.post('/accounts', app.isLogined, add);
 	//update account
 	app.post('/accounts/:id', app.isLogined, updateAccount);
 	//update avatar
 	app.post('/account/:id/avatar', app.isLogined, updateAvatar);
	//query model
	app.get('/accounts/:id', app.isLogined,getAccount);
	//query collection
	app.get('/accounts', app.isLogined, getAccounts);
};
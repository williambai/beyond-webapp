 exports = module.exports = function(app,models){
 	var debug = require('debug')('account:router');
 	var crypto = require('crypto');
 	var async = require('async');
 	var path = require('path');
 	var fs = require('fs');


 	var nodemailer = require('nodemailer');
	var smtpTransport = require('nodemailer-smtp-transport');
	var config = {
			mail: require('../config/mail')
		};		

	var Account = models.Account;

	var add = function(req,res){
			var roles = req.session.account.roles;
			var account = req.body;
			var password = account.password;
			if(account && account.password){
				account.password = crypto.createHash('sha256')
										.update(account.password)
										.digest('hex');
			}
			account.creator = {
					id: (req.session.account && req.session.account._id),
					username: (req.session.account && req.session.account.username),
					avatar: (req.session.account && req.session.account.avatar)
				};
			account.app = {
				app_id: crypto.randomBytes(8).toString('hex'),
				app_secret: crypto.randomBytes(16).toString('hex'),
				apis: {
					verify: false,
					base: false,
					whole: false
				}
			};
			account.business.times = {
				verify: 5,
				base: 1,
				whole: 1
			};

			account.business.prices = {
				verify: 2,
				base: 5,
				whole: 10
			};

			account.registerCode = crypto.createHash('sha256')
										.update(account.email + "beyond" + account.password)
										.digest('hex');	
			async.waterfall(
				[
					function _account(callback){
						if(roles.admin || roles.agent){
							Account.create(account,function(err){
								if(err){
									callback(err);
									return;
								}
								var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));

								smtpTransporter.sendMail(
									{
										from: 'cai@pdbang.cn',
										to: account.email,
										subject: '祝您好运计划',
										text: '您现在可以登录<a href="http://cai.pdbang.cn">祝您好运彩票系统</a>了。<br><br>' + 
												'用户名：' + account.email + '<br>' +
												'密码：' + password + '<br>'
									},
									callback
								);
							});
						}else{
							callback({code: 401001, message: '没有权限'});
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
										Account
											.findByIdAndUpdate(
												accountId,
												{
													$set: {avatar: avatar}
												},
												callback
											);
									});
								}else{
									callback({code: 401001, message: '没有权限'});
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
				case 'app': 
					async.waterfall(
						[
							function(callback){
								if(roles.admin || roles.agent){
									account = _.pick(account,'app');
									Account
										.findByIdAndUpdate(
											accountId,
											{
												$set: account
											},
											callback
										);
								}else{
									callback({code: 401001, message: '没有权限'});
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

				default:
					async.waterfall(
						[
							function(callback){
								if(roles.admin || roles.agent){
									if(account.password){
										var shaSum = crypto.createHash('sha256');
										shaSum.update(account.password);
										account.password = shaSum.digest('hex');
									}
									account.business.times = {
										verify: 5,
										base: 1,
										whole: 1
									};

									account.business.prices = {
										verify: 2,
										base: 5,
										whole: 10
									};
									delete account._id;
									Account
										.findByIdAndUpdate(
											accountId,
											{
												$set: account
											},
											callback
										);
								}else{
									callback({code: 401001, message: '没有权限'});
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
								Account
									.findById(accountId)
									.select({
										createby: 0,
										password: 0,
										registerCode: 0,
									})
									.exec(callback);
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
			var per = 20;
			var type = req.query.type || '';
			var page = req.query.page || 0;
			page = (!page || page<0) ? 0 : page;
			var accountId = req.session.account._id;
			var roles = req.session.account.roles;
			switch(type){
				case 'search':
					var searchStr = req.query.searchStr || '';
					var searchRegex = new RegExp(searchStr,'i');
					async.waterfall(
						[
							function(callback){
								if(roles.admin || roles.agent){
									Account
										.find({
											'createby.id': accountId,
											$or: [
												{'username': {$regex: searchRegex}},
												{'email': {$regex: searchRegex}}
											]
										})
										.skip(page*per)
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
					async.waterfall(
						[
							function(callback){
								if(roles.admin || roles.agent){
									Account
										.find({
											'createby.id': accountId
										})
										.select({
											createby: 0,
											password: 0,
											registerCode: 0,
										})
										.skip(page*per)
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
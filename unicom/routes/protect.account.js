var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var regexp = require('../libs/regexp');

exports = module.exports = function(app, models) {
	var _ = require('underscore');
	var async = require('async');
	var path = require('path');
	var fs = require('fs');
	var crypto = require('crypto');

	var Account = models.Account;

	var add = function(req, res) {
 		var type = req.body.type || '';
 		switch (type) {
 			case 'import':
	 			var attachments;
	 			if (typeof req.body.attachment == 'string') {
	 				attachments = [];
	 				attachments.push(req.body.attachment);
	 			} else {
	 				attachments = req.body.attachment;
	 			}
	 			attachments = attachments || [];
	 			logger.debug('attachments:' + attachments);
				if(attachments.length == 0){
					return res.send({
						code: 40441,
						errmsg: '请选择要导入的文件'
					});
				}
	 			async.each(attachments, function(attachment, cb) {
	 				var file = path.join(__dirname, '../public', attachment);
	 				if (!fs.existsSync(file)) {
	 					return cb({
	 						code: 40440,
	 						msg: '文件不存在'
	 					});
	 				}
	 				logger.debug('file: ' + file);
	 				//** 导入excel
	 				models.Account.fromExcel(file, function(err,result){
	 					if(err) return cb(err);
	 					cb(null,result);
	 				});
	 				// //** 导入csv
	 				// var data = fs.readFileSync(file,{encoding: 'utf8'});
	 				// models.Account.importCSV(data,function(err){
	 				// 	if(err) return cb({
	 				// 				code: 500110,
	 				// 				errmsg: '导入数据格式不规范，请检查数据。'
	 				// 			});
	 				// 	cb(null);
	 				// });
	 			}, function(err, result) {
	 				if (err) return res.send(err);
	 				res.send({});
	 			}); 
 				break;
 			default:
				var account = req.body;
				if(account.password){
					account.password = crypto.createHash('sha256').update(account.password).digest('hex');
				}
				// app
				var apps = account.apps;
				if (!_.isArray(apps)) apps = [];
				apps = _.without(apps, '');
				// role
				var roles = account.role;
				if (!_.isArray(roles)) roles = [];
				roles = _.without(roles, '');
				//set creator
				account.creator = {
					id: req.session.accountId,
					username: req.session.username,
					avatar: req.session.avatar,
				};

				models.Account.create(account, function(err) {
					if (err) return res.send(err);
					res.send({});
				});
				break;
			}
		};
	var remove = function(req, res) {
		var id = req.params.id;
		models.Account.findByIdAndRemove(id, function(err, doc) {
			if (err) return res.send(err);
			res.send(doc);
		});
	};

	var update = function(req, res) {
		var id = req.params.id;
		var type = req.query.type || '';
		var account = req.body;
		if(account.password){
			account.password = crypto.createHash('sha256').update(account.password).digest('hex');
		}
		account = _.omit(account, 'histories', 'registerCode', 'creator');

		switch (type) {
			case 'avatar':
				// console.log(req.files);
				// res.writeHead(200, {'content-type': 'text/plain'});
				// res.write('received upload:\n\n');
				// var util = require('util');
				// res.end(util.inspect({files: req.files}));
				var file = req.files.files;
				var filename = app.randomHex() + '.' + file.extension; //file.name;
				var tmp_path = file.path;
				var new_path = path.join(__dirname, '../public/_images/', filename);
				var avatar = '/_images/' + filename;
				fs.rename(tmp_path, new_path, function(err) {
					if (err) {
						console.log(err);
						return res.send(err);
					}
					Account.findByIdAndUpdate(id, {
							$set: {
								avatar: avatar,
							},
							$push: {
								'histories': {
									time: Date.now(),
									message: req.session.username + ' 更新了avatar.',
								}
							}
						}, {
							'new': true,
							'upsert': false,
						},
						function(err, doc) {
							if (err) return res.send(err);
							res.send({
								src: avatar
							});
						}
					);
				});
				break;
			case 'unbind': 
				Account.findByIdAndUpdate(id, {
						$unset: {
							'openid': 1
						},
						$push: {
							'histories': {
								time: Date.now(),
								message: req.session.username + ' 解除了用户微信绑定.',
							}
						}
					}, {
						'new': true,
						'upsert': false,
					},
					function(err, doc) {
						if (err) return res.send(err);
						res.send(doc || {});
					});
				break;
			default:
				Account.findByIdAndUpdate(id, {
						$set: account,
						$push: {
							'histories': {
								time: Date.now(),
								message: req.session.username + ' 更新了用户信息.',
							}
						}
					}, {
						'new': true,
						'upsert': false,
					},
					function(err, doc) {
						if (err) return res.send(err);
						res.send(doc || {});
					});
				break;
		}
	};

	var getOne = function(req, res) {
		var id = req.params.id;
		Account.findById(id)
			.select({
				password: 0,
			})
			.exec(function(err, doc) {
				if (err) return res.send(err);
				res.send(doc);
			});
	};

	var getMore = function(req, res) {
		var type = req.query.type || '';
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;
		var per = 20;

		switch (type) {
			case 'search':
				var searchStr = req.query.searchStr || '';
				var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
				logger.debug('search status: ' + req.query.status);
				var status = req.query.status;
				var query = Account.find({
					$or: [{
						'username': {
							$regex: searchRegex
						}
					}, {
						'email': {
							$regex: searchRegex
						}
					}]
				});
				if (!_.isEmpty(status)) {
					query.where({status:status});
				}
				query
					.sort({
						_id: -1
					})
					.skip(per * page)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
				break;
 			case 'exportTpl': 
 				var filename = 'account.xlsx';
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + filename);
				models.Account
					.toExcelTemplate(function(err,workbook){
						if(err) return res.send(err);
						workbook.xlsx
							.write(res)
							.then(function(){
								res.end();
							});
					});
 				break;
 			case 'export': 
 				var filename = 'account.xlsx';
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + filename);
				models.Account
					.toExcel({},function(err,workbook){
						if(err) return res.send(err);
						workbook.xlsx
							.write(res)
							.then(function(){
								res.end();
							});
					});
				// res.writeHead(200, {
				// 	'Content-Type': 'text/csv;charset=utf-8',
				// 	'Content-Disposition': 'attachment; filename=accounts.csv'
				// });
				// models.Account
				// 	.findAndStreamCsv({})
				// 	.pipe(res);
 				break;
			default:
				Account
					.find({})
					.sort({
						_id: -1
					})
					.skip(per * page)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
				break;
		}
	};

	/**
	 * router outline
	 */
	/**
	 * add protect/accounts
	 *     
	 */
	app.post('/protect/accounts', app.grant, add);
	/**
	 * update protect/accounts
	 * type:
	 *     avatar
	 *     
	 */
	app.put('/protect/accounts/:id', app.grant, update);

	/**
	 * delete protect/accounts
	 *     
	 */
	app.delete('/protect/accounts/:id', app.grant, remove);
	/**
	 * get protect/accounts
	 */
	app.get('/protect/accounts/:id', app.grant, getOne);

	/**
	 * get protect/accounts
	 * type:
	 *    search
	 */
	app.get('/protect/accounts', app.grant, getMore);
}
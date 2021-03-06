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
		var account = req.body;
		if(account.password){
			account.password = crypto.createHash('sha256').update(account.password).digest('hex');
		}
		// app
		var apps = account.apps;
		if (!_.isArray(apps)) apps = [];
		apps = _.without(apps, '');
		// remove apps that I did not belong to
		_.each(req.session.apps,function(app){
			apps = _.without(apps,app);
		});
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
	};
	var remove = function(req, res) {
		res.send({});
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
				if (_.isEmpty(status)) {
					Account.find({
							$or: [{
								'username': {
									$regex: searchRegex
								}
							}, {
								'email': {
									$regex: searchRegex
								}
							}]
						})
						.sort({
							_id: -1
						})
						.skip(per * page)
						.limit(per)
						.exec(function(err, docs) {
							if (err) return res.send(err);
							res.send(docs);
						});
				} else {
					Account.find({
							status: status,
							$or: [{
								'username': {
									$regex: searchRegex
								}
							}, {
								'email': {
									$regex: searchRegex
								}
							}]
						})
						.sort({
							_id: -1
						})
						.skip(per * page)
						.limit(per)
						.exec(function(err, docs) {
							if (err) return res.send(err);
							res.send(docs);
						});
				}
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
	}

 	/**
 	 * router outline
 	 */
 	/**
 	 * add admin/accounts
 	 *     
 	 */
 	app.post('/admin/accounts', app.grant, add);
 	/**
 	 * update admin/accounts
 	 * type:
 	 *     avatar
 	 *     
 	 */
 	app.put('/admin/accounts/:id', app.grant, update);

 	/**
 	 * delete admin/accounts
 	 *     
 	 */
 	app.delete('/admin/accounts/:id', app.grant, remove);
	/**
 	 * get admin/accounts
 	 */
 	app.get('/admin/accounts/:id', app.grant, getOne);

 	/**
 	 * get admin/accounts
 	 * type:
 	 *    search
 	 */
 	app.get('/admin/accounts', app.grant, getMore);
 }
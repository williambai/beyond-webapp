var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:platform.account');
logger.setLevel('DEBUG');

exports = module.exports = function(app, models) {
	var _ = require('underscore');
	var async = require('async');
	var path = require('path');
	var fs = require('fs');

	var Account = models.Account;

	var add = function(req, res) {
		var account = req.body;
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
				var new_path = path.join(__dirname, '../public/_tmp/', filename);
				var avatar = '/_tmp/' + filename;
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
				var searchRegex = new RegExp(searchStr, 'i');
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
	 * add platform/accounts
	 *     
	 */
	app.post('/platform/accounts', add);
	/**
	 * update platform/accounts
	 * type:
	 *     avatar
	 *     
	 */
	app.put('/platform/accounts/:id', update);

	/**
	 * delete platform/accounts
	 *     
	 */
	app.delete('/platform/accounts/:id', remove);
	/**
	 * get platform/accounts
	 */
	app.get('/platform/accounts/:id', getOne);

	/**
	 * get platform/accounts
	 * type:
	 *    search
	 */
	app.get('/platform/accounts', getMore);
}
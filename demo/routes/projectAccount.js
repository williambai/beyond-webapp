exports = module.exports = function(app, models) {
	var _ = require('underscore');
	var async = require('async');

	var add = function(req, res) {
		var pid = req.params.pid;
		var uid = req.body.uid;
		var member = req.body;
		var project = {};

		async.waterfall(
			[
				function(callback) {
					models.Project.findById(pid, function(err, doc) {
						if (err) return callback(err);
						if (_.isEmpty(doc)) return callback({
							code: 40100,
							errmsg: 'unauthorized.'
						});
						project = doc;
						callback(null, doc);
					});
				},

				function(doc, callback) {
					member.pid = pid;
					member.roles = ['attendee'];
					member.notification = true;
					member.removable = true;
					member.status = {
						code: 0,
						message: req.session.accountId + '邀请' + uid + '加入项目：' + project.name,
					};
					member.lastupdatetime = new Date();
					models.ProjectAccount
						.findOneAndUpdate({
								pid: pid,
								uid: uid,
								'status.code': {
									$ne: 1
								}
							}, {
								$set: member
							}, {
								upsert: true,
								new: true,
							},
							function(err, doc) {
								if (err) return callback(err);
								callback(null, doc);
							}
						);
				},
				function(projectAccount, callback) {
					var notification = {
						uid: uid,
						createby: {
							uid: req.session.accountId,
							username: req.session.username,
							avatar: req.session.avatar
						},
						type: 'invite' + '_' + pid,
						content: {
							subject: '项目邀请',
							body: req.session.username + '邀请你加入项目: ' + project.name,
						},
						actions: [{
							name: 'agree',
							url: '/accounts/project/' + projectAccount._id + '?type=agree',
							method: 'PUT',
							label: '接受',
							enable: true
						}],
						status: {
							code: 0,
							message: '等待处理'
						},
					};
					models.AccountNotification
						.create(notification, callback);

				}
			],
			function(err, result) {
				if (err) return res.send(err);
				res.sendStatus(200);
			}
		);
	};

	var update = function(req, res) {
		var type = req.query.type || '';
		var pid = req.params.pid;
		switch (type) {
			case 'agree':
				async.waterfall(
					[
						function(callback) {
							models.ProjectAccount
								.findOneAndUpdate({
										pid: pid,
										uid: req.session.accountId,
									}, {
										$set: {
											status: {
												code: 1,
												message: '同意加入项目'
											}
										}
									},
									callback
								);
						}
					],
					function(err, result) {
						if (err) return res.send(err);
						res.send(result);
					}
				);
				return;
			case 'deny':
				break;
			default:
				res.send({});
				break;
		}

	};

	var remove = function(req, res) {
		var id = req.params.id;
		async.waterfall(
			[
				function(callback) {
					models.ProjectAccount
						.findOneAndRemove({
								_id: id,
								removable: true,
							},
							callback
						);
				},
			],
			function(err, result) {
				if (err) return res.send(err);
				res.send(result);
			}
		);
	};

	var getProjectAccounts = function(req, res) {
		var type = req.query.type || '';
		var aid = req.session.accountId;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = isNaN(page) ? 0 : page;
		var per = 20;
		switch (type) {
			case 'project':
				var pid = req.query.pid || '';
				models.ProjectAccount.find({
						pid: pid
					})
					.skip(page * per)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						return res.send(docs);
					});
				break;
			case 'presenter':
				models.ProjectAccount
					.find({
						uid: aid,
						'status.code': 1,
						roles: {
							$in: ['presenter']
						}
					})
					.skip(page * per)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						if (!docs) return res.send([]);
						var pids = _.pluck(docs, 'pid');
						models.Project
							.find({
								_id: {
									$in: pids
								}
							})
							.exec(function(err, docs) {
								if (err) return res.send(err);
								res.send(docs);
							});
					});
				break;
			case 'attendee':
				models.ProjectAccount
					.find({
						uid: aid,
						'status.code': 1,
						roles: {
							$in: ['attendee']
						}
					})
					.skip(page * per)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						if (!docs) return res.send([]);
						var pids = _.pluck(docs, 'pid');
						models.Project
							.find({
								_id: {
									$in: pids
								}
							})
							.exec(function(err, docs) {
								if (err) return res.send(err);
								res.send(docs);
							});
					});
				break;
			case 'me':
				models.ProjectAccount
					.find({
						uid: aid,
						'status.code': 1,
					})
					// .skip(page*per)
					// .limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						if (!docs) return res.send(null);
						var pids = _.pluck(docs, 'pid');
						models.Project
							.find({
								_id: {
									$in: pids
								}
							})
							.exec(function(err, docs) {
								if (err) return res.send(err);
								res.send(docs);
							});
					});
				break;
			default:
				res.send({
					code: 40400,
					errmsg: 'not support.'
				});
				break;
		}

	};

	/**
	 * router outline
	 */

	/**
	 * add account for the project
	 */
	app.post('/project/accounts/:pid', app.isLogined, add);
	/**
	 * remove 
	 */
	app.delete('/project/accounts/:pid/:id', app.isLogined, remove);

	/**
	 * update project's member
	 * 
	 */
	app.put('/project/accounts', app.isLogined, update);
	app.put('/project/accounts/:pid', app.isLogined, update);

	/**
	 * get project accounts
	 */
	app.get('/project/accounts', app.isLogined, getProjectAccounts);

}
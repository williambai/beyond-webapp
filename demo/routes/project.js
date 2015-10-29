exports = module.exports = function(app, models) {
	var async = require('async');

	var Project = models.Project;
	var Account = models.Account;
	var ProjectAccount = models.ProjectAccount;

	var add = function(req, res) {
		async.waterfall(
			[
				function(callback){
					var project = req.body;
					project.createby = {
						uid: req.session.accountId,
						username: req.session.username,
						avatar: req.session.avatar,
					};
					project.members = 0;
					project.status = {
						code: 0,
						message: '正常',
					};
					callback(null, project);
				},
				function(project, callback) {
					Project.create(project, function(err, doc) {
						if (err) return callback(err);
						callback(null, doc);
					});
				},
				function(project, callback) {
					var member = {
						uid: req.session.accountId,
						pid: project._id,
						username: req.session.username,
						avatar: req.session.avatar,
						roles: ['presenter'],
						notification: true,
						removable: false,
						status: {
							code: 1,
							message: '初始主持人，成功加入项目',
						},
						lastupdatetime: new Date(),
					};
					models.ProjectAccount
						.findOneAndUpdate({
								pid: project._id,
								uid: req.session.accountId,
							}, {
								$set: member
							}, {
								upsert: true,
								new: true,
							},
							function(err, doc) {
								if (err) return callback(err);
								callback(null, project);
							}
						);
				}
			],
			function(err, result) {
				if (err) return res.send(err);
				res.send(result);
			}
		);
	};

	var remove = function(req, res) {

	};

	var update = function(req, res) {
		var type = req.query.type || '';
		var id = req.params.id;
		switch (type) {
			case 'close':
				async.waterfall(
					[
						function _project(callback) {
							Project
								.findByIdAndUpdate(
									id, {
										$set: {
											'status.code': 1,
											'status.message': '关闭',
											lastupdatetime: new Date(),
										}
									},
									callback
								);
						},
					],
					function _result(err, result) {
						if (err) return res.send(err);
						res.sendStatus(200);
					}
				);
				break;
			case 'open':
				async.waterfall(
					[
						function _project(callback) {
							Project
								.findByIdAndUpdate(
									id, {
										$set: {
											'status.code': 0,
											'status.message': '正常',
											lastupdatetime: new Date(),
										}
									},
									callback
								);
						},
					],
					function _result(err, result) {
						if (err) return res.send(err);
						res.sendStatus(200);
					}
				);
				break;
			default:
				res.sendStatus(200);
				break;
		}
	};

	var getMore = function(req, res) {
		var type = req.query.type || '';
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;
		var per = 20;
		var accountId = req.session.accountId;
		switch (type) {
			case 'search':
				var searchStr = req.query.searchStr || '';
				var searchRegex = new RegExp(searchStr, 'i');
				Project.find({
						'name': {
							$regex: searchRegex
						}
					}).sort({
						lastupdatetime: -1
					})
					.skip(page * per)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
				break;
			case 'hot':
				Project
					.find({})
					.sort({
						members: -1,
						lastupdatetime: -1
					})
					.skip(page * per)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});

				break;
			case 'top':
				Project
					.find({})
					.sort({
						lastupdatetime: -1
					})
					.skip(page * per)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});

				break;
			default:
				async.waterfall(
					[
						function(callback) {
							Project
								.find({})
								.sort({
									lastupdatetime: -1
								})
								.skip(page * per)
								.limit(per)
								.exec(callback);
						}
					],
					function(err, result) {
						if (err) {
							res.sendStatus(err);
							return;
						}
						res.send(result);
					}
				);
				break;
		}

	};

	var getOne = function(req, res) {
		var type = req.query.type || '';
		var id = req.params.id;
		switch (type) {
			default:
				async.waterfall(
					[
						function(callback) {
							Project.findById(id, callback);
						},
					],
					function(err, result) {
						if (err) return res.send(err);
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
	 * add project
	 * 
	 */
	app.post('/projects', app.isLogined, add);

	/**
	 * remove project
	 * 
	 */
	app.delete('/projects/:id', app.isLogined, remove);
	/**
	 * update project
	 *  type: 
	 *        open
	 *        close
	 *        contact_add
	 *        contact_remove
	 */
	app.put('/projects/:id', app.isLogined, update);

	/**
	 * get projects
	 */
	app.get('/projects', app.isLogined, getMore);

	/**
	 * get project
	 * 	   type: 
	 * 	      contact
	 */
	app.get('/projects/:id', app.isLogined, getOne);

};
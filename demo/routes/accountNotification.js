exports = module.exports = function(app, models) {
	var _ = require('underscore');

	var add = function(req, res) {
		if (!req.body.type)
			return res.send({
				code: 40100,
				errmsg: 'parameter missed: type.'
			});

		var type = req.body.type || '';
		var notification = {
			createby: {
				uid: req.session.accountId,
				username: req.session.username,
				avatar: req.session.avatar
			},
			status: {
				code: 0,
				message: '等待处理'
			},
		};

		switch (type) {
			case 'invite_friend':
				var fid = req.body.fid;

				_.extend(notification, {
					uid: fid,
					type: 'invite_friend',
					content: {
						subject: '好友邀请',
						body: req.session.username + '邀请你为好友',
					},
					actions: [{
						name: 'agree',
						url: '/friends/account/me/' + req.session.accountId + '?type=agree',
						method: 'PUT',
						label: '接受',
						enable: true
					}],
				});
				models.AccountNotification
					.create(notification, function(err,doc){
						if(err) return res.send(err);
						res.send(doc);
					});
				break;

			case 'invite_join_project':
				var uid = req.body.uid;
				var project = req.body.project || {};

				_.extend(notification, {
					uid: uid,
					type: 'invite_join_' + project.id,
					content: {
						subject: '项目邀请',
						body: req.session.username + '邀请你加入项目: ' + project.name,
					},
					actions: [{
						name: 'agree',
						url: '/accounts/project/' + project.id + '?type=agree',
						method: 'PUT',
						data: {
							pid: project.id
						},
						label: '接受',
						enable: true
					}],
				});
				models.AccountNotification
					.create(notification, function(err,doc){
						if(err) return res.send(err);
						res.send(doc);
					});
				break;
			default:
				break;
		}

	};

	var remove = function(req, res) {
		var id = req.params.id;

		models.AccountNotification
			.findOneAndRemove({
					_id: id,
					uid: req.session.accountId,
				},
				function(err, doc) {
					if (err) return res.send(err);
					res.send(doc);
				}
			);
	};

	var update = function(req, res) {
		var id = req.params.id;

		models.AccountNotification
			.findOneAndUpdate({
					_id: id,
					uid: req.session.accountId,
				}, {
					$set: req.body
				},
				function(err, doc) {
					if (err) return res.send(err);
					res.send(doc);
				}
			);
	};

	var getMore = function(req, res) {
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		isNaN(page) ? 0 : page;
		var per = 20;

		models.AccountNotification
			.find({
				uid: req.session.accountId,
			})
			.sort({
				_id: -1
			})
			.skip(page * per)
			.limit(per)
			.exec(function(err, docs) {
				if (err) return res.send(err);
				res.send(docs);
			});
	};

	/**
	 * router outline
	 */

	/* 
	 * add a notification
	 * type:
	 *       invite_friend
	 *       invite_join_project
	 */
	app.post('/notifications', app.isLogined, add);

	/**
	 * remove a notification
	 * 
	 */
	app.delete('/notifications/:id', app.isLogined, remove);

	/**
	 * update a notification
	 * 
	 */

	app.put('/notifications/:id', app.isLogined, update);
	/**
	 * get account's notifications
	 * 
	 */
	app.get('/notifications', app.isLogined, getMore);
}
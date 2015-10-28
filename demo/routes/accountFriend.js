exports = module.exports = function(app, models) {
	var async = require('async');

	var add = function(req, res) {
		if (req.params.aid != 'me')
			return res.send({
				code: 40100,
				message: 'not support.'
			});
		// if(req.params.aid == 'me' || req.params.aid == req.session.accountId) 
		// 	return res.send({code: 40100, message: 'not support.'});
		var fid = req.body.fid;
		var invitor = {
			uid: req.session.accountId,
			fid: fid, //friend id
			username: req.session.username,
			realname: req.session.username,
			avatar: req.session.avatar,
			status: {
				code: 0,
				message: '你邀请TA成为好友，等待同意'
			},
			lastupdatetime: new Date()
		};
		var invitee = {
			uid: fid, //friend id
			fid: req.session.accountId,
			username: req.session.username,
			realname: req.session.username,
			avatar: req.session.avatar,
			status: {
				code: 1,
				message: 'TA邀请您成为好友，请答复'
			},
			lastupdatetime: new Date()
		};
		async.waterfall(
			[
				function(callback) {
					models.AccountFriend
						.findOneAndUpdate({
								uid: req.session.accountId,
								fid: fid
							}, {
								$set: invitor
							}, {
								upsert: true,
								new: true,
							},
							callback
						);
				},
				function(friend, callback) {
					models.AccountFriend
						.findOneAndUpdate({
								uid: fid,
								fid: req.session.accountId
							}, {
								$set: invitee
							}, {
								upsert: true,
								new: true,
							},
							callback
						);
				},
				function(friend, callback) {
					var notification = {
						uid: fid,
						createby: {
							uid: req.session.accountId,
							username: req.session.username,
							avatar: req.session.avatar
						},
						type: 'invite',
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
				return res.send(result);
			}
		);

	};

	var remove = function(req, res) {
		if (req.params.aid != 'me')
			return res.send({
				code: 40100,
				message: 'not support.'
			});
		var uid = req.session.accountId;
		var fid = req.params.id;
		console.log(uid)
		console.log(fid)
		async.waterfall(
			[
				function(callback) {
					models.AccountFriend
						.findOneAndRemove({
								uid: uid,
								fid: fid
							},
							callback
						);
				},
				function(friend, callback) {
					models.AccountFriend
						.findOneAndRemove({
								uid: fid,
								fid: uid
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
	};

	var update = function(req, res) {
		if (req.params.aid != 'me')
			return res.send({
				code: 40100,
				message: 'not support.'
			});
		var uid = req.session.accountId;
		var fid = req.params.id;
		var type = req.query.type || '';
		switch (type) {
			case 'agree':
				async.waterfall(
					[
						function(callback) {
							models.AccountFriend
								.findOneAndUpdate({
										uid: uid,
										fid: fid
									}, {
										$set: {
											status: {
												code: 2,
												message: '互为好友'
											}
										}
									},
									callback
								);
						},
						function(friend, callback) {
							models.AccountFriend
								.findOneAndUpdate({
										uid: fid,
										fid: uid
									}, {
										$set: {
											status: {
												code: 2,
												message: '互为好友'
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

	var getMore = function(req, res) {
		if (req.params.aid != 'me')
			return res.send({
				code: 40100,
				message: 'not support.'
			});

		var aid = req.session.accountId;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;
		var per = 20;

		models.AccountFriend
			.find({
				uid: aid,
				'status.code': 2
			})
			// .skip(page*per)
			// .limit(per)
			.exec(function(err, docs) {
				if (err) return res.send(err);
				res.send(docs);
			});
	};
	/**
	 * router outline
	 */
	/**
	 * add a friend
	 */
	app.post('/friends/account/:aid', app.isLogined, add);

	/**
	 * remove friend relationship
	 * 
	 */
	app.delete('/friends/account/:aid/:id', app.isLogined, remove);

	/**
	 * update a friend
	 * 
	 */
	app.put('/friends/account/:aid/:id', app.isLogined, update);

	/**
	 * get account's friends
	 * 
	 */
	app.get('/friends/account/:aid', app.isLogined, getMore);
}
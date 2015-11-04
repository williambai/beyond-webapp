exports = module.exports = function(app, models) {
	var async = require('async');

	var add = function(req, res) {
		var fid = req.body.fid;
		async.waterfall(
			[
				function(callback) {
					var invitor = {
						uid: req.session.accountId,
						fid: fid, //friend id
						username: req.body.username,
						realname: req.body.username,
						avatar: req.body.avatar,
						status: {
							code: 0,
							message: '你邀请TA成为好友，等待同意'
						},
						lastupdatetime: new Date()
					};
					models.AccountFriend
						.findOneAndUpdate({
								uid: req.session.accountId,
								fid: fid,
								'status.code': {
									$ne: 2
								}
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
					var invitee = {
						uid: fid,
						fid: req.session.accountId, //friend id
						username: req.session.username,
						realname: req.session.username,
						avatar: req.session.avatar,
						status: {
							code: 1,
							message: 'TA邀请您成为好友，请答复'
						},
						lastupdatetime: new Date()
					};
					models.AccountFriend
						.findOneAndUpdate({
								uid: fid,
								fid: req.session.accountId,
								'status.code': {
									$ne: 2
								}
							}, {
								$set: invitee
							}, {
								upsert: true,
								new: true,
							},
							callback
						);
				},

			],
			function(err, result) {
				if (err) return res.send(err);
				return res.send(result);
			}
		);

	};

	var remove = function(req, res) {
		var uid = req.session.accountId;
		var fid = req.params.fid;
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
			],
			function(err, result) {
				if (err) return res.send(err);
				res.send(result);
			}
		);
	};

	var block = function() {
		/** 删除从而拒绝对方关注自己 */
		// function(friend, callback) {
		// 	models.AccountFriend
		// 		.findOneAndRemove({
		// 				uid: fid,
		// 				fid: uid
		// 			},
		// 			callback
		// 		);
		// }

	};

	var update = function(req, res) {
		var uid = req.session.accountId;
		var type = req.query.type || '';

		var fid = req.body.fid;

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
												message: '成为好友'
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
												message: '成为好友'
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
		var type = req.query.type || '';
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;
		var per = 20;
		switch (type) {
			case 'all':
				models.AccountFriend
					.find({
						uid: req.session.accountId,
						'status.code': 2
					})
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
				break;
			default:
				models.AccountFriend
					.find({
						uid: req.session.accountId,
						'status.code': 2
					})
					.skip(page * per)
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
	 * add a friend
	 */
	app.post('/account/friends', app.isLogined, add);

	/**
	 * remove friend relationship
	 * 
	 */
	app.delete('/account/friends/:fid', app.isLogined, remove);

	/**
	 * update a friend
	 * 
	 */
	app.put('/account/friends', app.isLogined, update);

	/**
	 * get account's friends
	 * 
	 */
	app.get('/account/friends', app.isLogined, getMore);
}
exports = module.exports = function(app, models) {
	var _ = require('underscore');

	var getMore = function(req, res) {
		var aid = req.session.accountId;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		isNaN(page) ? 0 : page;
		var per = 20;
		models.AccountFriend.find({
			uid: aid,
			'status.code': 2,
		}, function(err, friends) {
			if (err) return res.send(err);
			var uids = [];
			if (!_.isEmpty(friends)) {
				uids = _.pluck(friends, 'fid');
			}
			uids.push(aid);
			models.AccountStatus
				.find({
					uid: {
						$in: uids
					}
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

		});
	};
	/**
	 * @deprecated
	 */
	var getMore1 = function(req, res) {
		var aid = req.session.accountId;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		isNaN(page) ? 0 : page;
		var per = 20;
		models.AccountActivity
			.findOne({
				uid: aid
			})
			.slice('statuses', [per * page, per])
			.exec(function(err, doc) {
				if (err) return res.send(err);
				if (!doc) return res.send({
					code: 40400,
					errmsg: 'acount activity is not found.'
				});
				models.AccountStatus
					.find({
						_id: {
							$in: doc.statuses
						}
					})
					.sort({
						_id: -1
					})
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
			});
	};

	/**
	 * router outline
	 */
	/**
	 * get account's activities
	 * 
	 */
	app.get('/account/activities', app.isLogined, getMore);
}
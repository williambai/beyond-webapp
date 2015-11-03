 exports = module.exports = function(app, models) {
 	var async = require('async');
 	var _ = require('underscore');

 	var Account = models.Account;
 	var Status = models.AccountStatus;
 	var Activity = models.AccountActivity;
 	var Friend = models.AccountFriend;

 	var add = function(req, res) {
 		var message = req.body;
 		var accountId = req.session.accountId;
 		async.waterfall(
 			[
 				function(callback) {
 					Account.findById(
 						accountId,
 						function(err, account) {
 							if (err)
 								return callback(err);
 							if (!account)
 								return callback({
 									code: 40400,
 									errmsg: 'account not exist.'
 								});
 							return callback(null, account);
 						}
 					);
 				},
 				function(account, callback) {
 					message.uid = account._id;
 					message.username = account.username;
 					message.avatar = account.avatar;

 					Status.create(message, function(err, doc) {
 						if (err) return callback(err);
 						callback(null, doc);
 					});
 				},
 				function(doc, callback) {
 					Friend.find({
 							uid: accountId
 						},
 						function(err, friends) {
 							if (err) return callback(err);
 							var fids = [];
 							if (!_.isEmpty(friends)) {
 								fids = _.pluck(friends, 'fid');
 							}
 							fids.push(accountId);
 							Activity.update({
 									uid: {
 										$in: fids
 									}
 								}, {
 									$push: {
 										$at: 0,
 										statuses: doc._id
 									}
 								}, {
 									multi: true
 								},
 								function(err, result) {
 									if (err) return callback(err);
 									callback(null, doc);
 								}
 							);
 						}
 					);
 				}
 			],
 			function(err, result) {
 				if (err)
 					return res.send(err);
 				res.send(result);
 			}
 		);

 	};

 	var remove = function(req, res) {
 		res.send({
 			code: 00000,
 			errmsg: 'not implemented.'
 		});
 	};

 	var update = function(req, res) {
 		var id = req.params.id;
 		var type = req.query.type || '';
 		var accountId = req.session.accountId;
 		var username = req.session.username;
 		switch (type) {
 			case 'vote':
 				if (req.body.vote == 'good') {
 					var good = req.body.vote;
 					Status.findOneAndUpdate({
 							_id: id,
 							voters: {
 								$nin: [accountId]
 							}
 						}, {
 							$push: {
 								voters: accountId,
 								votes: {
 									accountId: accountId,
 									username: username,
 									vote: 'good'
 								}
 							},
 							$inc: {
 								good: 1,
 								score: 1
 							}
 						},
 						function(err, result) {
 							if (err) return res.send(err);
 							res.send(result);
 						}
 					);
 				} else if (req.body.vote == 'bad') {
 					var bad = req.body.vote;
 					Status
 						.findOneAndUpdate({
 								_id: id,
 								voters: {
 									$nin: [accountId]
 								}
 							}, {
 								$push: {
 									voters: accountId,
 									votes: {
 										accountId: accountId,
 										username: username,
 										vote: 'bad'
 									}
 								},
 								$inc: {
 									bad: 1,
 									score: -1
 								}
 							},
 							function(err, result) {
 								if (err) return res.send(err);
 								res.send(result);
 							}
 						);
 				} else {
 					res.send({
 						code: 40000,
 						errmsg: 'can not vote.'
 					});
 				}
 				break;
 			case 'comment':
 				var comment = req.body.comment || '';
 				if (comment.length < 1)
 					return res.send({
 						code: 40000,
 						errmsg: 'comment length is 0.'
 					});
 				Status
 					.findByIdAndUpdate(
 						id, {
 							$push: {
 								comments: {
 									accountId: accountId,
 									username: username,
 									comment: comment
 								}
 							}
 						},
 						function(err, result) {
 							if (err) return res.send(err);
 							res.send(result);
 						}
 					);
 				break;
 			default:
 				Status
 					.findByIdAndUpdate(
 						id, {
 							$set: req.body
 						},
 						function(err, result) {
 							if (err) return res.send(err);
 							res.send(result);
 						}
 					);
 				break;
 		}
 	};


 	var getOne = function(req, res) {
 		if (req.params.aid != 'me')
 			return res.send({
 				code: 40100,
 				errmsg: 'not support.'
 			});
 		res.send({
 			code: 00000,
 			errmsg: 'not implemented.'
 		});
 	};

 	var getMore = function(req, res) {

 		var accountId = req.query.uid != 'me' ? req.query.uid : req.session.accountId;

 		var page = req.query.page || 0;
 		var per = 20;
 		if (isNaN(page)) page = 0;

 		Account.findById(
 			accountId,
 			function(err, account) {
 				if (err) return res.send(err);
 				if (!account) return res.send({
 					code: 40400,
 					errmsg: 'account not exist.'
 				});
 				Status
 					.find({
 						uid: accountId
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
 			}
 		);
 	};

 	/**
 	 * router outline
 	 */
 	/**
 	 * add account's status
 	 */
 	app.post('/account/statuses', app.isLogined, add);

 	/**
 	 * remove account's status
 	 */
 	app.delete('/account/statuses/:id', app.isLogined, remove);

 	/**
 	 * update account's status
 	 * type:
 	 *     vote
 	 *     comment
 	 */
 	app.put('/account/statuses/:id', app.isLogined, update);
 	app.patch('/account/statuses/:id', app.isLogined, update);

 	/**
 	 * get account's status
 	 * 
 	 */
 	app.get('/account/statuses/:id', app.isLogined, getOne);

 	/**
 	 * get account's statuses
 	 * type:
 	 * 
 	 */
 	app.get('/account/statuses', app.isLogined, getMore);
 };
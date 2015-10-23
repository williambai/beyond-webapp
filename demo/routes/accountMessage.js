 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var Account = models.Account;
 	var Message = models.AccountMessage;

 	var add = function(req, res) {
 		if (req.params.aid == 'me' || req.params.aid == req.session.accountId)
 			return res.send({
 				code: 40100,
 				message: 'not support.'
 			});

 		var friendId = req.params.aid;
 		var message = req.body;
 		message.from = {
 			uid: req.session.accountId,
 			username: req.session.username,
 			avatar: req.session.avatar,
 		};
 		message.lastupdatetime = new Date();

 		Account.findById(
 			friendId,
 			function(err, account) {
 				if (err) return res.send(err);
 				if (!account) return res.send({
 					code: 40400,
 					message: 'account not exist.'
 				});
 				message.to = {
 					uid: account._id,
 					username: account.username,
 					avatar: account.avatar,
 				};

 				Message.create(message, function(err, doc) {
 					if (err) return res.send(err);
 					res.send(doc);
 				});
 			}
 		);
 	};

 	var remove = function(req, res) {
 		if (req.params.aid != 'me')
 			return res.send({
 				code: 40100,
 				message: 'not support.'
 			});
 		res.send({
 			code: 00000,
 			message: 'not implemented.'
 		});
 	};

 	var update = function(req, res) {
 		if (req.params.aid != 'me')
 			return res.send({
 				code: 40100,
 				message: 'not support.'
 			});
 		var type = req.query.type || '';

 		var id = req.params.id;
 		var accountId = req.session.accountId;
 		var username = req.session.username;
 		switch (type) {
 			case 'vote':
 				if (req.body.good) {
 					var good = req.body.good;
 					Message.findOneAndUpdate({
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
 				} else if (req.body.bad) {
 					var bad = req.body.bad;
 					Message
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
 						message: 'can not vote.'
 					});
 				}
 				break;
 			case 'comment':
 				var comment = req.body.comment || '';
 				if (comment.length < 1)
 					return res.send({
 						code: 40000,
 						message: 'comment length is 0.'
 					});
 				Message
 					.findByIdAndUpdate(
 						id, {
 							$push: {
 								comments: {
 									uid: accountId,
 									username: username,
 									content: comment
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
 				res.sendStatus(200);
 				break;
 		}
 	};


 	var getOne = function(req, res) {
 		if (req.params.aid != 'me')
 			return res.send({
 				code: 40100,
 				message: 'not support.'
 			});
 		res.send({
 			code: 00000,
 			message: 'not implemented.'
 		});
 	};

 	var getMore = function(req, res) {
 		var type = req.query.type || '';

 		var aid = req.query.aid || 'me';

 		var accountId = aid == 'me' ? req.session.accountId : req.query.aid;

 		var page = req.query.page || 0;
 		var per = 20;
 		if (isNaN(page)) page = 0;

 		models.AccountFriend.find({
 				uid: accountId
 			},
 			function(err, friends) {
 				if (err) return res.send(err);
 				if (_.isEmpty(friends)) return res.send([]);
 				var fids = _.pluck(friends, 'fid');
 				Message
 					.find({
 						$or: [{
 							'to.uid': accountId,
 							'from.uid': {
 								$in: fids
 							}
 						}, {
 							'from.uid': accountId,
 							'to.uid': {
 								$in: fids
 							}
 						}]
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
 	 * add account's message
 	 */
 	app.post('/messages/account/:aid', app.isLogined, add);

 	/**
 	 * remove account's message
 	 */
 	app.delete('/messages/account/:aid/:id', app.isLogined, remove);

 	/**
 	 * update account's message
 	 * type:
 	 *     vote
 	 *     comment
 	 */
 	app.put('/messages/account/:aid/:id', app.isLogined, update);
 	app.patch('/messages/account/:aid/:id', app.isLogined, update);

 	/**
 	 * get account's message
 	 * 
 	 */
 	app.get('/messages/account/:aid/:id', app.isLogined, getOne);

 	/**
 	 * get account's messages
 	 * type:
 	 * 
 	 */
 	app.get('/messages/account/:aid', app.isLogined, getMore);
 };
 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var Account = models.Account;
 	var Message = models.AccountMessage;

 	var add = function(req, res) {

 		var friendId = req.body.fid;
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
 					errmsg: 'account not exist.'
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
 		res.send({
 			code: 00000,
 			errmsg: 'not implemented.'
 		});
 	};

 	var update = function(req, res) {
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
 				errmsg: 'not support.'
 			});
 		res.send({
 			code: 00000,
 			errmsg: 'not implemented.'
 		});
 	};

 	var getMore = function(req, res) {
 		var type = req.query.type || '';

 		var accountId = req.session.accountId;
 		var page = req.query.page || 0;
 		var per = 20;
 		if (isNaN(page)) page = 0;
 		switch (type) {
 			case 'inbox':
 				Message.find({
 						'to.uid': accountId,
 					}).sort({
 						_id: -1
 					})
 					.skip(page * per)
 					.limit(per)
 					.exec(function(err, docs) {
 						if (err) return res.send(err);
 						res.send(docs);
 					});
 				break;
 			case 'outbox':
 				Message.find({
 						'from.uid': accountId,
 					}).sort({
 						_id: -1
 					})
 					.skip(page * per)
 					.limit(per)
 					.exec(function(err, docs) {
 						if (err) return res.send(err);
 						res.send(docs);
 					});
 				break;
 			default:
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
 				break;
 		}

 	};

 	/**
 	 * router outline
 	 */
 	/**
 	 * add account's message
 	 */
 	app.post('/account/messages', app.isLogined, add);

 	/**
 	 * remove account's message
 	 */
 	app.delete('/account/messages/:id', app.isLogined, remove);

 	/**
 	 * update account's message
 	 * type:
 	 *     vote
 	 *     comment
 	 */
 	app.put('/account/messages/:id', app.isLogined, update);
 	app.patch('/account/messages/:id', app.isLogined, update);

 	/**
 	 * get account's message
 	 * 
 	 */
 	app.get('/account/messages/:id', app.isLogined, getOne);

 	/**
 	 * get account's messages
 	 * type:
 	 * 
 	 */
 	app.get('/account/messages', app.isLogined, getMore);
 };
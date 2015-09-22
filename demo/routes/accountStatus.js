 exports = module.exports = function(app,models){
 	var async = require('async');
 	var _ = require('underscore');

	var Account = models.Account;
	var Status = models.AccountStatus;
	var Activity = models.AccountActivity;

	var add = function(req,res){
			if(req.params.aid != 'me') 
				return res.send({code: 40100, message: 'not support.'});

			var accountId = req.session.accountId;
			async.waterfall(
				[
					function(callback){
						Account.findById(
							accountId, 
							function(err,account){
								if(err) 
									return callback(err);
								if(!account) 
									return callback({code: 40400, message: 'account not exist.'});
								return callback(null,account);
							}
						);
					},
					function(account,callback){
						var message = {
								uid: account._id,
								username: account.username,
								avatar: account.avatar,
								subject: '',
								content: {
									MsgType: 'mixed',
									Content: req.body.status,
									Urls: req.body.attachments
								},
								tags: [],
								comments: [],
								weight: 0, // important index: 0~100
								voters:[],//accountId
								votes: [],//accountId,username,vote(good or bad)
								good: 0,
								bad: 0,
								score: 0,
								lastupdatetime: new Date()
							};

						Status.create(message, function(err,doc){
							if(err) return res.send(err);
							res.send(doc);
						});
					},
					function(doc,callback){
						Friend.find(
							{
								uid: accountId
							},
							function(err,friends){
								if(err) return callback(err);
								if(_.isEmpty(friends))
									return callback(null);
								var fids = _.pluck(friends,'fid');
								//TODO socket 通知
								//
								Activity.update(
									{
										_id: {
											$in: fids
										}
									},
									{
										$push: {
											statuses: doc
										}
									},
									callback
								);
							}
						);
					}
				],
				function(err,result){
					if(err)
						return res.send(err);
					rese.send(result);
				}
			);
				
		};

	var remove = function(req,res){
			if(req.params.aid != 'me') 
				return res.send({code: 40100, message: 'not support.'});
			res.send({code: 00000, message: 'not implemented.'});
		};

	var update = function(req,res){
			if(req.params.aid != 'me') 
				return res.send({code: 40100, message: 'not support.'});

			var id = req.params.id;
			var type = req.query.type || '';
			var accountId = req.session.accountId;
			var username = req.session.username;
			switch(type){
				case 'vote':
					if(req.body.good){
						var good = req.body.good;
						Status.findOneAndUpdate(
							{
								 _id: id,
								voters: {$nin: [accountId]}
							},
							{
								$push: {
									voters: accountId, 
									votes: {
										accountId: accountId,
										username: username,
										vote: 'good'
									}
								},
								$inc: {good: 1, score: 1}
							},
							function(err,result){
								if(err) return res.send(err);
								res.send(result);
							}
						);	
					}else if(req.body.bad){
						var bad = req.body.bad;
						Status
							.findOneAndUpdate(
								{
									_id: id,
									voters: {$nin: [accountId]}
								},
								{
									$push: {
										voters: accountId, 
										votes: {
											accountId: accountId,
											username: username,
											vote: 'bad'
										}
									},
									$inc: {bad: 1, score: -1}
								},
								function(err, result){
									if(err) return res.send(err);
									res.send(result);
								}
							);
					}else{
						res.send({code: 40000, message: 'can not vote.'});
					}
					break;
				case 'comment':
					var comment = req.body.comment || '';
					if(comment.length < 1) 
						return res.send({code: 40000, message: 'comment length is 0.'});
					Status
						.findByIdAndUpdate(
							id,
							{
								$push: {
									comments: {
										accountId: accountId,
										username: username,
										comment: comment
									}
								}
							},
							function(err,result){
								if(err) return res.send(err);
								res.send(result);
							}
						);		
					break;				
				default:
					Status
						.findByIdAndUpdate(
							id,
							{
								$set: req.body
							},
							function(err,result){
								if(err) return res.send(err);
								res.send(result);
							}
						);		
					break;
			}		
		};


	var getOne = function(req,res){
			if(req.params.aid != 'me') 
				return res.send({code: 40100, message: 'not support.'});
			res.send({code: 00000, message: 'not implemented.'});
		};
	
	var getMore =function(req,res){
			var accountId = req.params.aid == 'me' 
								? req.session.accountId
								: req.params.aid;

			var page = req.query.page || 0;
			var per = 20;
			if(isNaN(page)) page = 0;
			
			Account.findById(
				accountId, 
				function(err,account){
					if(err) return res.send(err);
					if(!account) return res.send({code: 40400,message: 'account not exist.'});
					Status
						.find({
							uid: accountId
						})
						.skip(page*per)
						.limit(per)
						.exec(function(err,docs){
							if(err) return res.send(err);
							res.send(docs);
						}
					);
				}
			);
		};

/**
 * router outline
 */
	/**
	 * add account's status
	 */
	app.post('/statuses/account/:aid', app.isLogined, add);
	
	/**
	 * remove account's status
	 */
	app.delete('/statuses/account/:aid/:id',app.isLogined, remove);

	/**
	 * update account's status
	 * type:
	 *     vote
	 *     comment
	 */
	app.put('/statuses/account/:aid/:id', app.isLogined, update);
	app.patch('/statuses/account/:aid/:id', app.isLogined, update);

	/**
	 * get account's status
	 * 
	 */
	app.get('/statuses/account/:aid/:id',app.isLogined, getOne);

	/**
	 * get account's statuses
	 * type:
	 * 
	 */
	app.get('/statuses/account/:aid', app.isLogined, getMore);
 };
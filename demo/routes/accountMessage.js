 exports = module.exports = function(app,models){
	var Account = models.Account;
	var Message = models.AccountMessage;

	var add = function(req,res){
		var accountId = req.params.aid == 'me' 
							? req.session.accountId
							: req.params.aid;

		Account.findById(
			accountId, 
			function(err,account){
				if(err) return res.send(err);
				if(!account) return res.send({code: 40400, message: 'account not exist.'});

				var message = {
						fromId: req.session.accountId,
						toId: account._id,
						fromUser:{},
						toUser:{},
						subject: '',
						content: {
							MsgType: 'mixed',
							Content: req.body.status,
							Urls: req.body.attachments
						},
						tags: [],
						level: 0,
						good: 0,
						bad: 0,
						score: 0,
						createtime: new Date(),
					};
					message.fromUser[message.fromId] = {
						username: req.session.username,
						avatar: req.session.avatar
					};
					message.toUser[message.toId] ={
						username: account.username,
						avatar: account.avatar
					};

				Message.create(message, function(err,doc){
					if(err) return res.send(err);
					res.send(doc);
				});
			}
		);	
	};

	var remove = function(req,res){

	};
	var updateVote = function(req,res){
		var id = req.params.id;
		var accountId = req.session.accountId;
		var username = req.session.username;
		if(req.body.good){
			var good = req.body.good;
			Message.findOneAndUpdate(
				{
					 _id: id,
					voters: {$nin: [accountId]}
				},
				{
					$push: {
						voters: accountId, 
						votes: {
							accountId: accountId,
							username: voterUsername,
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
			Message
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
								username: voterUsername,
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
	};

	var updateComment = function(req,res){
			var id = req.params.id;
			var accountId = req.session.accountId;
			var username = req.session.username;
			var comment = req.body.comment || '';
			if(comment.length < 1) 
				return res.send({code: 40000, message: 'comment length is 0.'});
			Message
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
		};

	var getOne = function(req,res){
		res.sendStatus(401);
	};
	
	var getCollectionByStatus = function(req,res){
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
				if(!account) return send({code: 40400,message: 'account not exist.'});
				Message
					.find({toId: accountId, fromId: accountId})
					.sort({createtime:-1})
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

	var getCollectionByExchange = function(req,res){
		if(req.params.aid != 'me'){
			res.sendStatus(401);
			return;
		}
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
				if(!account) return send({code: 40400,message: 'account not exist.'});
				var contactIds = [];
				account.contacts.forEach(function(contact){
					contactIds.push(contact.accountId);
				});

				Message
					.find({
						$or: [
								{
									toId: accountId,
									fromId: {$in: contactIds} 
								},
								{
									fromId: accountId,
									toId: {$in: contactIds} 
								}
							]
					})
					.sort({createtime:-1})
					.skip(page*per)
					.limit(per)
					.exec(function(err,docs){
						if(err) return res.send(err);
						res.send(docs);
					});
			}
		);
	};

	var getCollectionByActivity = function(req,res){
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
				if(!account) return send({code: 40400,message: 'account not exist.'});

				var contactIds = [];
				account.contacts.forEach(function(contact){
					contactIds.push(contact.accountId);
				});

				var pairs = [];
				contactIds.forEach(function(contantId){
					pairs.push({
						fromId: contantId,
						toId: contantId
					});
				});

				pairs.push({
					toId: accountId,
					fromId: accountId 
				});

				Message
					.find({
						$or: pairs
					})
					.sort({createtime:-1})
					.skip(page*per)
					.limit(per)
					.exec(function(err,docs){
						if(err) return res.send(err);
						res.send(docs);
					});
			}
		);
	};

/**
 * router outline
 */
	//add
	app.post('/messages/account/:aid', app.isLogined, add);
	//remove
	app.delete('/message/account/:id',app.isLogined, remove);
	//update model by category 'vote'
	app.post('/message/account/vote/:id', app.isLogined, updateVote);
	//update model by category 'comment'
	app.post('/message/account/comment/:id', app.isLogined, updateComment);
	//query model
	app.get('/message/account/:id',app.isLogined, getOne);
	//query collection by category 'status'
	app.get('/messages/account/status/:aid', app.isLogined, getCollectionByStatus);
	//query collection by category 'exchange'
	app.get('/messages/account/exchange/:aid',app.isLogined, getCollectionByExchange);
	//query collection by category 'activity'
	app.get('/messages/account/activity/:aid',app.isLogined, getCollectionByActivity);
	//query collection by search
	app.get('/messages/account/search', function(req,res){
		res.sendStatus(401);
	});	
 };
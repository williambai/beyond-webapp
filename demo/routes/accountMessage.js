 exports = module.exports = function(app,models){
	var Account = models.Account;
	var Message = models.AccountMessage;

	var add = function(req,res){
		var accountId = req.params.aid == 'me' 
							? req.session.accountId
							: req.params.aid;
		Account.findById(accountId, function(account){
			if(!account){
				res.sendStatus(404);
				return;
			}
			var username = req.session.username || '匿名';
			var avatar = req.session.avatar || '';
			var text = req.body.status || '';
			var attachments = req.body.attachments || [];

			var statusNew = {
				MsgType: 'mixed',
				Content: text,
				Urls: attachments
			};

			if(text.length<0){
				res.sendStatus(400);
				return;
			}
			var action = 'status';//朋友圈
			if(req.session.accountId != accountId){
				action = 'message';//私信
			}
			Message.add(req.session.accountId,accountId,username,avatar,account.username,account.avatar,'',statusNew,function(status){
				// if(status){
				// 	app.triggerEvent('event:' + accountId, {
				// 		action: action,
				// 		from: accountId,
				// 		data: {
				// 			username: username,
				// 			avatar: avatar,
				// 			status: statusNew
				// 		},
				// 	});
				// }
			});
		});
		res.sendStatus(200);
	};

	var remove = function(req,res){

	};
	var updateVote = function(req,res){
		var id = req.params.id;
		var accountId = req.session.accountId;
		var username = req.session.username;
		if(req.body.good){
			var good = req.body.good;
			Message.updateVoteGood(id,accountId,username, function(success){
				if(success){
					res.sendStatus(200);
				}else{
					res.sendStatus(406);
				}
			});
		}else if(req.body.bad){
			var bad = req.body.bad;
			Message.updateVoteBad(id,accountId,username, function(success){
				if(success){
					res.sendStatus(200);
				}else{
					res.sendStatus(406);
				}
			});
		}else{
			res.sendStatus(400);
		}
	};

	var updateComment = function(req,res){
		var id = req.params.id;
		var accountId = req.session.accountId;
		var username = req.session.username;
		var comment = req.body.comment || '';
		if(comment.length == 0){
			res.sendStatus(400);
			return;
		}
		Message.addComment(id,accountId,username,comment,function(success){
			if(success){
				res.sendStatus(200);
			}else{
				res.sendStatus(406);
			}
		});
	};

	var getOne = function(req,res){
		res.sendStatus(401);
	};
	
	var getCollectionByStatus = function(req,res){
		var accountId = req.params.aid == 'me' 
							? req.session.accountId
							: req.params.aid;
		var page = req.query.page || 0;

		if(isNaN(page)) page = 0;

		Account.findById(accountId, function(account){
			if(!account){
				res.sendStatus(404);
				return;
			}
			Message.getStatusById(accountId,page,function(status){
				res.send(status);
			});
		});
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

		if(isNaN(page)) page = 0;

		Account.findById(accountId, function(account){
			if(!account){
				res.sendStatus(404);
				return;
			}
			var contactIds = [];
			account.contacts.forEach(function(contact){
				contactIds.push(contact.accountId);
			});
			Message.getExchangeById(accountId,contactIds,page,function(status){
				res.send(status);
			});
		});
	};

	var getCollectionByActivity = function(req,res){
		var accountId = req.params.aid == 'me' 
							? req.session.accountId
							: req.params.aid;
		var page = req.query.page || 0;

		if(isNaN(page)) page = 0;

		Account.findById(accountId, function(account){
			if(!account){
				res.sendStatus(404);
				return;
			}
			var contactIds = [];
			account.contacts.forEach(function(contact){
				contactIds.push(contact.accountId);
			});
			Message.getActivityById(accountId,contactIds,page,function(status){
				res.send(status);
			});
		});
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
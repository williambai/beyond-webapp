 exports = module.exports = function(app,models){
	var Account = models.Account;
	var Status = models.Status;

	app.get('/accounts/:id', app.isLogined,function(req,res){
		var accountId = req.params.id == 'me' 
							? req.session.accountId
							: req.params.id;
		Account.findById(accountId, function(account){
			if(!account){
				res.sendStatus(404);
				return;
			}
			if(accountId == 'me' || Account.hasContact(account,req.session.accountId)){
				account.isFriend = true;
			}
			res.send(account);
		});
	});

	app.get('/accounts/:id/status',app.isLogined,function(req,res){
		var accountId = req.params.id == 'me' 
							? req.session.accountId
							: req.params.id;
		Account.findById(accountId, function(account){
			if(!account){
				res.sendStatus(404);
				return;
			}
			Status.getAllByBelongTo(accountId,0,function(status){
				res.send(status);
			});
		});
	});

	app.post('/accounts/:id/status',app.isLogined,function(req,res){
		var accountId = req.params.id == 'me' 
							? req.session.accountId
							: req.params.id;
		Account.findById(accountId, function(account){
			var username = req.session.username || '匿名';
			var avatar = req.session.avatar || '';
			var status = req.body.status || '';
			if(status.length<0){
				res.sendStatus(400);
				return;
			}
			Status.add(accountId,accountId,username,avatar,status,function(err){
				if(!err){
					app.triggerEvent('event:' + accountId, {
						from: accountId,
						data: status,
						action: 'status'
					});
				}
			});
		});
		res.sendStatus(200);
	});

	app.get('/accounts/:id/activity',app.isLogined,function(req,res){
		var accountId = req.params.id == 'me' 
							? req.session.accountId
							: req.params.id;
		Account.findById(accountId, function(account){
			if(!account){
				res.sendStatus(404);
				return;
			}
			res.send(account.activity);
		});
	});

	app.get('/accounts/:id/contacts',app.isLogined, function(req,res){
		var accountId = req.params.id == 'me' 
							? req.session.accountId
							: req.params.id;
		Account.findById(accountId,function(account){
			if(!account){
				res.sendStatus(404);
				return;
			}
			res.send(account.contacts);
		});				
	});

	app.post('/accounts/:id/contacts',app.isLogined, function(req,res){
		var accountId = req.params.id == 'me' 
							? req.session.accountId
							: req.params.id;
		var contactId = req.body.contactId;

		if(null == contactId){
			res.sendStatus(400);
			return;
		}
		Account.findById(accountId,function(account){
			if(account){
				Account.findById(contactId,function(contact){
					if(contact){
						Account.addContact(account,contact);
						//Make the reverse link
						Account.addContact(contact,account);
					}
				});
			}
		});
		res.sendStatus(200);
	});

	app.delete('/accounts/:id/contacts', app.isLogined,function(req,res){
		var accountId = req.params.id == 'me' 
							? req.session.accountId
							: req.params.id;
		var contactId = req.body.contactId;

		if(null == contactId){
			res.sendStatus(400);
			return;
		}
		Account.findById(accountId,function(account){
			if(account){
				Account.findById(contactId,function(contact){
					if(contact){
						Account.removeContact(account,contactId);
						//Kill the reverse link
						Account.removeContact(contact,accountId);
					}
				});
			}
		});
		res.sendStatus(200);
	});

	app.post('/contacts/find', app.isLogined,function(req,res){
		var searchStr = req.body.searchStr;
		if(null == searchStr){
			res.sendStatus(400);
			return;
		}
		Account.findByString(searchStr,function(accounts){
			if(!accounts){
				res.sendStatus(404);
				return;
			}
			res.send(accounts);
		});
	});
}
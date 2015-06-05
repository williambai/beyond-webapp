 exports = module.exports = function(app,models){
 	var path = require('path');
 	var fs = require('fs');

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

	app.post('/accounts/:id/avatar', app.isLogined, function(req,res){
		var accountId = req.params.id == 'me' 
							? req.session.accountId
							: req.params.id;
		// console.log(req.files);
		// res.writeHead(200, {'content-type': 'text/plain'});
		// res.write('received upload:\n\n');
		// var util = require('util');
		// res.end(util.inspect({files: req.files}));
		var file = req.files.files;
		var filename = app.randomHex() + '.' + file.extension;//file.name;
		var tmp_path = file.path;
		var new_path = path.join(__dirname, '../public/upload/',filename);
		var avatar = '/upload/' + filename;
		fs.rename(tmp_path,new_path,function(err){
			if(err) {
				console.log(err);
				res.sendStatus(400);
				return;
			}
			Account.updateAvatar(accountId,avatar, function(err){
				if(!err){
					res.end(avatar);
				}else{
					res.end();
				}
			});
		});
	});

	app.post('/accounts/:id', app.isLogined, function(req,res){
		var accountId = req.params.id == 'me' 
							? req.session.accountId
							: req.params.id;
		var account = {};
		if(req.body.username) account.username = req.body.username;
		if(req.body.realname) account.realname = req.body.realname;
		if(req.body.biography) account.biography = req.body.biography;
		// console.log(account);
		Account.updateAccount(accountId,account);
		res.sendStatus(200);
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
			Status.getAll(accountId,accountId,0,function(status){
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
			Status.add(req.session.accountId,accountId,username,avatar,status,function(err){
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
			Status.getAllByBelongTo(accountId,0,function(status){
				res.send(status);
			});
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
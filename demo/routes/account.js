 exports = module.exports = function(app,models){
 	var async = require('async');
 	var path = require('path');
 	var fs = require('fs');

	var Account = models.Account;
	var Status = models.Status;

	app.get('/accounts/:id', app.isLogined,function(req,res){
		var meId = req.session.accountId;
		var accountId = req.params.id == 'me' 
							? meId
							: req.params.id;

		async.waterfall(
			[
				function _account(callback){
					Account.findById(accountId, function(account){
						if(!account){
							callback(404);
							return;
						}
						if(accountId == meId || Account.hasContact(account,meId)){
							account.isFriend = true;
						}
						callback(null,account);
					});
				}
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.send(result);
			}
		);
	});

	app.post('/accounts/:id/avatar', app.isLogined, function(req,res){
		var meId = req.session.accountId;
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
		var page = req.query.page || 0;

		if(isNaN(page)) page = 0;

		Account.findById(accountId, function(account){
			if(!account){
				res.sendStatus(404);
				return;
			}
			Status.getAll(accountId,accountId,page,function(status){
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
			var text = req.body.status || '';
			if(text.length<0){
				res.sendStatus(400);
				return;
			}
			Status.add(req.session.accountId,accountId,username,avatar,text,function(status){
				if(status){
					app.triggerEvent('event:' + accountId, {
						action: 'status',
						from: accountId,
						data: {
							username: username,
							avatar: avatar,
							status: text
						},
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
		var page = req.query.page || 0;

		if(isNaN(page)) page = 0;

		Account.findById(accountId, function(account){
			if(!account){
				res.sendStatus(404);
				return;
			}
			Status.getAllByToId(accountId,page,function(status){
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

	app.get('/accounts/:id/projects',app.isLogined, function(req,res){
		var meId = req.session.accountId;
		var accountId = req.params.id == 'me' 
							? meId
							: req.params.id;

		async.waterfall(
			[
				function _account(callback){
					Account.findById(accountId,function(account){
						if(!account){
							callback(404);
							return;
						}
						callback(null,account.projects);
					});
				},
				function _project(projects,callback){
					callback(null,projects);
				}
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.send(result);
			}
		);
	});

}
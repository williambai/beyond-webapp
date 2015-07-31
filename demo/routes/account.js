 exports = module.exports = function(app,models){
 	var async = require('async');
 	var path = require('path');
 	var fs = require('fs');

	var Account = models.Account;

	var getOne = function(req,res){
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
		};

	var updateAvatar = function(req,res){
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
		};

	var update = function(req,res){
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
		};

	var getContacts = function(req,res){
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
		};

	var addContact = function(req,res){
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
		};

	var removeContact = function(req,res){
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
		};

	var findAccounts = function(req,res){
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
		};

	var getProjects = function(req,res){
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
		};

	var inviteFriend = function(req,res){
			var emails = req.body.emails;
			var inviteUrl = 'http://' + req.header('host');
			var username = req.session.username;
			var email = req.session.email;
			Account.inviteFriend(emails,inviteUrl,username,email,function(success){
				if(!success){
					console.err('email sender error.');
				}
			});
			res.sendStatus(200);
		};

/**
 * router outline
 */
 	//update account
 	app.post('/accounts/:id', app.isLogined, update);
 	app.post('/account/:id', app.isLogined, update);
 	//update account by adding a contact
 	app.post('/accounts/:id/contacts',app.isLogined, addContact);//Deprecated
 	app.post('/account/:id/contacts',app.isLogined, addContact);
 	//update account by removing a contact
 	app.delete('/accounts/:id/contacts', app.isLogined, removeContact); //Deprecated
 	app.delete('/account/:id/contacts', app.isLogined, removeContact); 
 	//update avatar
 	app.post('/accounts/:id/avatar', app.isLogined, updateAvatar);//Deprecated
 	app.post('/account/:id/avatar', app.isLogined, updateAvatar);
	//query model
	app.get('/accounts/:id', app.isLogined,getOne);//Deprecated
	app.get('/account/:id', app.isLogined,getOne);
	//query model's contacts
	app.get('/accounts/:id/contacts',app.isLogined, getContacts);//Deprecated
	app.get('/account/:id/contacts',app.isLogined, getContacts);
	//query model's projects
	app.get('/accounts/:id/projects',app.isLogined, getProjects);//Deprecated
	app.get('/account/:id/projects',app.isLogined, getProjects);
	//query accounts by string match
	app.post('/contacts/find', app.isLogined, findAccounts);//Deprecated
	app.post('/accounts/find', app.isLogined, findAccounts);
	//invite friend
	app.post('/account/invite/friend', app.isLogined, inviteFriend);
	app.post('/accounts/invite/friend', app.isLogined, inviteFriend);
}
 exports = module.exports = function(app,models){
 	var crypto = require('crypto');
 	var async = require('async');
 	var path = require('path');
 	var fs = require('fs');


 	var nodemailer = require('nodemailer');
	var smtpTransport = require('nodemailer-smtp-transport');
	var config = {
			mail: require('../config/mail')
		};		

	var Account = models.Account;

	var getById = function(req,res){
			var meId = req.session.accountId;
			var accountId = req.params.id == 'me' 
								? meId
								: req.params.id;

			async.waterfall(
				[
					function(callback){
						Account.findById(accountId, function(err,account){
							if(err) return callback(err);
							if(!account) return callback({code: 40400, message: 'account not exsit.'});
							// if(accountId == meId || Account.hasContact(account,meId)){
							// 	account.isFriend = true;
							// }
							callback(null,account);
						});
					}
				],
				function(err,result){
					if(err) return res.send(err);
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
				Account.findByIdAndUpdate(
					accountId,
					{
						$set: {
							avatar: avatar
						}
					}, function(err){
						if(err) return res.send(err);
						res.sendStatus(200);
					}
				);
			});
		};

	var update = function(req,res){
			var accountId = req.params.id == 'me' 
								? req.session.accountId
								: req.params.id;
			var account = req.body;
			// if(req.body.username) account.username = req.body.username;
			// if(req.body.realname) account.realname = req.body.realname;
			// if(req.body.biography) account.biography = req.body.biography;
			// console.log(account);
			Account.findByIdAndUpdate(
				accountId,
				account,
				function(err){
					if(err) return res.send(err);
					res.sendStatus(200);
				});
		};

	var getContacts = function(req,res){
			var accountId = req.params.id == 'me' 
								? req.session.accountId
								: req.params.id;
			Account.findById(
				accountId,
				function(err,account){
					if(err) return res.send(err);
					if(!account || !account.contacts) return res.send({code: 40400, message: 'not exist.'});
					res.send(account.contacts);
				}
			);				
		};

	var addContact = function(req,res){
			var accountId = req.params.id == 'me' 
								? req.session.accountId
								: req.params.id;
			var contact = req.body;
			var contactId = contact.contactId;

			if(null == contactId)
				return res.send({code: 40000, message: 'parameter lost.'});

			Account.findByIdAndUpdate(
				accountId,
				{
					$push: {
						contacts: contact
					}
				},
				function(err,doc){
					if(err) return res.send(err);
					return res.send(doc);
				}
			);
		};

	var removeContact = function(req,res){
			var accountId = req.params.id == 'me' 
								? req.session.accountId
								: req.params.id;
			var contactId = req.body.contactId;

			if(null == contactId)
				return res.send({code: 40000, message: 'parameter lost.'});

			Account.findByIdAndUpdate(
				accountId,
				{
					$pull: {
						contacts: contactId
					}
				},
				function(err,doc){
					if(err) return res.send(err);
					res.send(doc);
				}
			);
		};

	var findAccounts = function(req,res){
			var searchStr = req.body.searchStr;
			if(null == searchStr){
				res.sendStatus(400);
				return;
			}
			var searchRegex = new RegExp(searchStr,'i');
			Account.find(
				{
					$or: [
							{'username': {$regex: searchRegex}},
							{'email': {$regex: searchRegex}}
						]
				},
				function(err,accounts){
					if(err) return res.send(err);
					res.send(accounts);
				}
			);
		};

	var getProjects = function(req,res){
			var meId = req.session.accountId;
			var accountId = req.params.id == 'me' 
								? meId
								: req.params.id;

			async.waterfall(
				[
					function(callback){
						Account.findById(
							accountId,
							function(err,account){
								if(err) return res.send(err);
								if(!account) return res.send({code: 40400, message: 'account not exist.'});
							callback(null,account.projects);
						});
					},
				],
				function(err,result){
					if(err) return res.send(err);
					res.send(result);
				}
			);
		};

	var inviteFriend = function(req,res){
			var emails = req.body.emails;
			var inviteUrl = 'http://' + req.header('host');
			var username = req.session.username;
			var email = req.session.email;

			var smtpTransporter = nodemailer.createTransport(smtpTransport(config.mail));
			inviteUrl = inviteUrl ? inviteUrl : 'http://localhost:8080';
			emails.forEach(function(email){
				smtpTransporter.sendMail({
					from: 'socialworkserivce@appmod.cn',
					to: email,
					subject: '我的工作社交网--邀请信',
					text: '您的朋友' + username + '(' + email + ')' + '邀请您加入。请点击：' + inviteUrl,
				},function(err){
					if(err) return res.send(err);
					res.sendStatus(200);
				});
			});
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
	app.get('/accounts/:id', app.isLogined,getById);//Deprecated
	app.get('/account/:id', app.isLogined,getById);
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
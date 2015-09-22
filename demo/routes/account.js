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


	var update = function(req,res){
			var accountId = req.params.id == 'me' 
								? req.session.accountId
								: req.params.id;
			var type = req.query.type || '';
			var account = req.body;
			switch(type){
				case 'avatar': 
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
					break;
				case 'contact_add':
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
					break;
				case 'contact_remove':
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
					break;						
				default:
					Account.findByIdAndUpdate(
						accountId,
						account,
						function(err){
							if(err) return res.send(err);
							res.sendStatus(200);
						});
					break;	
			}
		};

	var getOne = function(req,res){
			var type = req.query.type || '';
			var meId = req.session.accountId;
			var accountId = req.params.id == 'me' 
								? meId
								: req.params.id;
			switch(type){
				case 'contact':
					Account.findById(
						accountId,
						function(err,account){
							if(err) return res.send(err);
							if(!account || !account.contacts) return res.send({code: 40400, message: 'not exist.'});
							res.send(account.contacts);
						}
					);				
					break;
				case 'project':
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
					break;	
				default:
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
					break;
			}

		};

	var getMore = function(req,res){
			var type = req.query.type || '';
			var accountId = req.params.id == 'me' 
								? req.session.accountId
								: req.params.id;
			var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
			page = (!page || page < 0) ? 0 : page;
			var per = 20;

			switch(type){
				case 'search':
					var searchStr = req.query.searchStr || '';
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
					break;
				default:
					Account
						.find({})
						.skip(per*page)
						.limit(per)
						.exec(function(err,accounts){
							if(err) return res.send(err);
							res.send(accounts);
						});
					break;
			}
	}	

/**
 * router outline
 */
 	/**
 	 * update account
 	 * type:
 	 *     contact_add
 	 *     contact_remove
 	 *     avatar
 	 *     
 	 */
 	app.put('/accounts/:id', app.isLogined, update);

	/**
	 * get account
	 */
	app.get('/accounts/:id', app.isLogined,getOne);

	/**
	 * get accounts
	 * type:
	 *    contact
	 *    project
	 *    search
	 */
	app.get('/accounts', app.isLogined, getMore);
}
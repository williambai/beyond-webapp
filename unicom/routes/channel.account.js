 exports = module.exports = function(app, models) {
 	var async = require('async');
 	var path = require('path');
 	var fs = require('fs');

 	var Account = models.Account;

 	var add = function(req, res) {
		res.send({});
 	};
	var remove = function(req,res){
		res.send({});
 	};

 	var update = function(req, res) {
 		var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
 		var type = req.query.type || '';
 		var account = req.body;
 		switch (type) {
 			case 'avatar':
 				// console.log(req.files);
 				// res.writeHead(200, {'content-type': 'text/plain'});
 				// res.write('received upload:\n\n');
 				// var util = require('util');
 				// res.end(util.inspect({files: req.files}));
 				var file = req.files.files;
 				var filename = app.randomHex() + '.' + file.extension; //file.name;
 				var tmp_path = file.path;
 				var new_path = path.join(__dirname, '../public/_tmp/', filename);
 				var avatar = '/_tmp/' + filename;
 				fs.rename(tmp_path, new_path, function(err) {
 					if (err) {
 						console.log(err);
 						return res.send(err);
 					}
 					Account.findByIdAndUpdate(
 						accountId, {
 							$set: {
 								avatar: avatar
 							}
 						}, {
 							'new': true,
 							'upsert': false,
 						},
 						function(err, doc) {
 							if (err) return res.send(err);
 							res.send({
 								src: avatar
 							});
 						}
 					);
 				});
 				break;
 			default:
 				Account.findByIdAndUpdate(
 					accountId, {
 						$set: account,
 					}, {
 						'new': true,
 						'upsert': false,
 					},
 					function(err, doc) {
 						if (err) return res.send(err);
 						res.send(doc);
 					});
 				break;
 		}
 	};

 	var getOne = function(req, res) {
 		var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
 		Account.findById(accountId)
 			.select({
 				password: 0,
 				histories: 0,
 			})
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc || {});
 			});
 	};

 	var getMore = function(req, res) {
 		var type = req.query.type || '';
 		var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		var per = 20;

 		switch (type) {
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(searchStr, 'i');
 				Account.find({
 						$or: [{
 							'username': {
 								$regex: searchRegex
 							}
 						}, {
 							'email': {
 								$regex: searchRegex
 							}
 						}]
 					})
 					.skip(per * page)
 					.limit(per)
 					.exec(function(err, docs) {
 						if (err) return res.send(err);
 						res.send(docs);
 					});
 				break;
 			default:
 				Account
 					.find({})
 					.skip(per * page)
 					.limit(per)
 					.exec(function(err, docs) {
 						if (err) return res.send(err);
 						res.send(docs);
 					});
 				break;
 		}
 	}

 	/**
 	 * router outline
 	 */
 	/**
 	 * add account
 	 *     
 	 */
 	app.post('/channel/accounts', app.grant, add);
 	/**
 	 * update account
 	 * type:
 	 *     avatar
 	 *     
 	 */
 	app.put('/channel/accounts/:id', app.grant, update);

 	/**
 	 * delete account
 	 *     
 	 */
 	app.delete('/channel/accounts/:id', app.grant, remove);
	/**
 	 * get account
 	 */
 	app.get('/channel/accounts/:id', getOne);

 	/**
 	 * get accounts
 	 * type:
 	 *    search
 	 */
 	app.get('/channel/accounts', app.grant, getMore);
 }
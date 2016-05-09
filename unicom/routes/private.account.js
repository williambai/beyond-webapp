 exports = module.exports = function(app, models) {
 	var async = require('async');
 	var path = require('path');
 	var fs = require('fs');
	var crypto = require('crypto');

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
		if(account.password){
			account.password = crypto.createHash('sha256').update(account.password).digest('hex');
		}
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
 				var new_path = path.join(__dirname, '../public/_images/', filename);
 				var avatar = '/_images/' + filename;
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
 				res.send(doc);
 			});
 	};

 	var getMore = function(req, res) {
		res.send({});
 	};

 	/**
 	 * router outline
 	 */
 	/**
 	 * add account
 	 *     
 	 */
 	app.post('/accounts', app.isLogin, add);
 	/**
 	 * update account
 	 * type:
 	 *     avatar
 	 *     
 	 */
 	app.put('/accounts/:id', app.isLogin, update);

 	/**
 	 * delete account
 	 *     
 	 */
 	app.delete('/accounts/:id', app.isLogin, remove);
	/**
 	 * get account
 	 */
 	app.get('/accounts/:id', app.isLogin, getOne);

 	/**
 	 * get accounts
 	 * type:
 	 *    search
 	 */
 	app.get('/accounts', app.isLogin, getMore);
 }
var mongoose = require('mongoose');

 exports = module.exports = function(app, models) {

 	var _ = require('underscore');
 	var crypto = require('crypto');

 	var update = function(req, res) {
 		var oldPassword = req.body.old_password || '';
 		var newPassword = req.body.password || '';
 		var oldPasswordCrypto = crypto.createHash('sha256').update(oldPassword).digest('hex');
 		var newPasswordCrypto = crypto.createHash('sha256').update(newPassword).digest('hex');
 		models.Account.findOneAndUpdate(
	 		{
	 			_id: req.session.accountId, //** 只能改自己的
	 			password: oldPasswordCrypto, //** 原来旧的加密密码
	 		}, 
	 		{
 				$set: {
 					password: newPasswordCrypto
 				}
 			}, {
 				'upsert': false,
 				'new': true,
 			},
 			function(err,doc) {
 				if (err) return res.send(err);
 				if(!doc) return res.send({code: 404123, errmsg: '原密码不正确, 修改失败'});
 				res.send(doc);
 			}
 		);
 	};
 	var getOne = function(req, res) {
 		models.Account
 			.findById({
 				_id: req.session.accountId, //** 只能看自己的 			 				
 			})
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};

 	/**
 	 * router outline
 	 */
 	/**
 	 * update private/account/changepass
 	 * type:
 	 *     
 	 */
 	app.post('/private/account/changepass', app.isLogin, update);
 	/**
 	 * get private/account/changepass
 	 */
 	app.get('/private/account/changepass', app.isLogin, getOne);

 };
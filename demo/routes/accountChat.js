exports = module.exports = function(app,models){
	var _ = require('underscore');
 	var async = require('async');
	var AccountFriend = models.AccountFriend;
	var Chat = models.AccountChat;

	var add = function(req,res){
			var friendId = req.params.aid;
			var chat = req.body;
			chat.createby = {
				uid: req.session.accountId,
				username: req.session.username,
				avatar: req.session.avatar				
			};

			async.waterfall(
				[
					function(callback){
						AccountFriend.findOne({
							uid: req.session.accountId,
							fid: friendId
						},function(err,friend){
							if(err) return callback(err);
							if(_.isEmpty(friend)) return callback({code: 40400, message: 'friend is not exist.'});
							callback(null,friend);
						});
					},
					function(friend,callback){
						var message1 = _.clone(chat);
						message1.uid = req.session.accountId;
						message1.fid = friend.fid;
						var message2 = _.clone(chat);
						message2.uid = friend.fid;
						message2.fid = req.session.accountId;

						Chat.create([message1,message2],function(err,doc){
							if(err) return callback(err);
							callback(null,doc[0]);
						});
					}
				],
				function(err,result){
					if(err) return res.send(err);
					res.send(result);
				}
			);
		};

	var getMore = function(req,res){
			var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
			page = (!page || page < 0) ? 0 : page;
			var per = 20;

			models.AccountChat
				.find({
					'uid': req.session.accountId,
					'fid': req.params.aid
				})
				.sort({_id:-1})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					if(err) return res.send(err);
					res.send(docs);
				});
		};
/**
 * router outline
 */
	/**
	 * add account's message
	 */
	app.post('/chats/account/:aid', app.isLogined, add);

	/**
	 * get chats
	 * 
	 */
	app.get('/chats/account/:aid', app.isLogined, getMore);
}
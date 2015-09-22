exports = module.exports = function(app,models){

	var add = function(req,res){
			if(req.params.aid == 'me' || req.params.aid == req.session.accountId) 
				return res.send({code: 40100, message: 'not support.'});
			var fid = req.params.aid;
			var invitor = {
					uid: req.session.accountId,
					fid: aid,//friend id
					username: res.session.account.username,
					avatar: res.session.account.avatar,
					status: {
						code: 0,
						message: '你邀请TA成为好友，等待同意'
					},
					lastupdatetime: new Date()				
				};
			var invitee = {
					uid: req.session.accountId,
					fid: aid,//friend id
					username: res.session.account.username,
					avatar: res.session.account.avatar,
					status: {
						code: 1,
						message: 'TA邀请您成为好友，请答复'
					},
					lastupdatetime: new Date()				
				};

			models.AccountFriend
				.findOneAndUpdate(
					{
						uid: req.session.accountId,
						fid: aid
					},
					{
						$set: invitor
					},
					function(err,doc){
						if(err) return res.send(err);
						models.AccountFriend
							.findOneAndUpdate(
								{
									uid: aid,
									fid: req.session.accountId
								},
								{
									$set: invitee
								},
								function(err){
									if(err) return res.send(err);
									return res.send(doc);
								}
							);
					}
				);
		};

	var remove = function(req,res){
		res.send({code: 00000, message: 'not implemented.'});
	};

	var update = function(req,res){
			if(req.params.aid != 'me') 
				return res.send({code: 40100, message: 'not support.'});
			var type = req.query.type || '';
			switch(type){
				case 'agree':
					break;
				case 'deny':
					break;
				default:
					res.send({});
					break;
			}

		};

	var getMore = function(req,res){
			if(req.params.aid != 'me') 
				return res.send({code: 40100, message: 'not support.'});
			
			var aid = req.session.accountId;
			var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
			page = (!page || page < 0) ? 0 : page;
			var per = 20;

			models.AccountFriend
				.find({
					uid: aid
				})
				// .skip(page*per)
				// .limit(per)
				.exec(function(err,docs){
					if(err) return res.send(err);
					res.send(docs);
				});
		};
/**
 * router outline
 */
 	/**
 	 * add a friend
 	 */
 	app.post('/friends/account/:aid',app.isLogined, add);

 	/**
 	 * remove friend relationship
 	 * 
 	 */
 	app.delete('/friends/account/:aid/:id', app.isLogined, remove);
 	
 	/**
 	 * update a friend
 	 * 
 	 */
 	app.put('/friends/account/:aid/:id', app.isLogined, update);

	/**
	 * get account's friends
	 * 
	 */
	app.get('/friends/account/:aid', app.isLogined, getMore);
}
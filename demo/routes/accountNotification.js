exports = module.exports = function(app,models){

	var update = function(req,res){
			// if(req.params.aid != 'me') 
			// 	return res.send({code: 40100, message: 'not support.'});
			// var aid = req.params.aid == 'me' ?
			// 			req.session.accountId :
			// 			req.params.aid;
			var id = req.params.id;			
			models.AccountNotification
				.findByIdAndUpdate(
					id,
					{
						$set: req.body
					},
					function(err,doc){
						if(err) return res.send(err);
						res.send(doc);
					}
				);			
		};

	var getMore = function(req,res){
			if(req.params.aid != 'me') 
				return res.send({code: 40100, message: 'not support.'});
			var aid = req.params.aid == 'me' ?
						req.session.accountId :
						req.params.aid;
			var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
			isNaN(page) ? 0 : page;
			var per = 20;

			models.AccountNotification
				.find({
					uid: aid,
				})
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
 	 * update a notification
 	 * 
 	 */
 	app.put('/notifications/account/me/:id', app.isLogined, update);

	/**
	 * get account's notifications
	 * 
	 */
	app.get('/notifications/account/:aid', app.isLogined, getMore);
}
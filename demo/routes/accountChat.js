exports = module.exports = function(app,models){

	var getMore = function(req,res){
			var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
			page = (!page || page < 0) ? 0 : page;
			var per = 20;

			var id1 = req.session.accountId;
			var id2 = req.params.aid;
			models.AccountChat
				.find({
					fromId:{$in: [id1, id2]},
					toId: {$in: [id1, id2]}
				})
				.sort({createtime:-1})
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
	 * get chats
	 * 
	 */
	app.get('/chats/account/:aid', app.isLogined, getMore);
}
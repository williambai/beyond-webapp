exports = module.exports = function(app,models){

	app.get('/chats/:toId',function(req,res){
		var id1 = req.session.accountId;
		var id2 = req.params.toId;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;
		var per = 20;
		if(!(id1 && id2))
			return res.send({code: 40000, message: 'parameters lost.'});
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
	});
}
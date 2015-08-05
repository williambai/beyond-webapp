exports = module.exports = function(app,models){

	// app.get('/chats/:toId',function(req,res){
	// 	var fromId = req.session.accountId;
	// 	var toId = req.params.toId;
	// 	var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
	// 	models.Chat.getByToId(toId,page,function(docs){
	// 		res.send(docs);
	// 	});
	// });
	app.get('/chats/:toId',function(req,res){
		var id1 = req.session.accountId;
		var id2 = req.params.toId;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		models.AccountChat.getChatHistory(id1,id2,page,function(docs){
			res.send(docs);
		});
	});
}
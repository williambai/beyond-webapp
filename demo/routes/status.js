exports =module.exports = function(app,models){
	var Status = models.Status;

	app.post('/status/:id', function(req,res){
		var id = req.params.id;
		var accountId = req.session.accountId;
		var username = req.session.username;
		if(req.body.good){
			var good = req.body.good;
			Status.updateVoteGood(id,accountId,username, function(success){
				if(success){
					res.sendStatus(200);
				}else{
					res.sendStatus(406);
				}
			});
		}else if(req.body.bad){
			var bad = req.body.bad;
			Status.updateVoteBad(id,accountId,username, function(success){
				if(success){
					res.sendStatus(200);
				}else{
					res.sendStatus(406);
				}
			});
		}else{
			res.sendStatus(400);
		}
	});

	app.post('/status/:id/comment', function(req,res){
		var id = req.params.id;
		var accountId = req.session.accountId;
		var username = req.session.username;
		var comment = req.body.comment || '';
		if(comment.length == 0){
			res.sendStatus(400);
			return;
		}
		Status.addComment(id,accountId,username,comment,function(success){
			if(success){
				res.sendStatus(200);
			}else{
				res.sendStatus(406);
			}
		});
	});

};
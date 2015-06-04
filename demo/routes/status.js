exports =module.exports = function(app,models){
	var Status = models.Status;

	app.post('/status/:id', function(req,res){
		var id = req.params.id;
		var accountId = req.session.accountId;
		if(req.body.good){
			var good = req.body.good;
			Status.updateVoteGood(id,accountId);
		}else if(req.body.bad){
			var bad = req.body.bad;
			Status.updateVoteBad(id,accountId);
		}
		res.sendStatus(200);
	});
};
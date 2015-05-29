exports = module.exports = function(app,models){

	app.get('/projects',function(req,res){
		var accountId = req.session.accountId;
		if(accountId){
			models.Project.getByAccountId(accountId,function(data){
				res.send(data);
			});
		}else{
			res.sendStatus(401);
		}
	});

	app.post('/projects',function(req,res){
		var accountId = req.session.accountId;
		models.Project.add(accountId,{
			name: req.body.name,
			description: req.body.description
		});
		res.sendStatus(200);
	});

	app.get('/projects/:id', function(req,res){
		var id = req.params.id;
		models.Project.getById(id,function(data){
			res.send(data);
		});
	});

};
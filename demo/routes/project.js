exports = module.exports = function(app,models){
	var Project = models.Project;
	var Status = models.Status;

	app.get('/projects',function(req,res){
		page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		var accountId = req.session.accountId;
		if(req.session.loggedIn && accountId){
			models.Project.getByAccountId(accountId,page,function(data){
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

	app.get('/projects/:id/contacts',app.isLogined, function(req,res){
		Project.getById(req.params.id,function(project){
			if(!project){
				res.sendStatus(404);
				return;
			}
			models.Account.findAll(project.contacts, 0 ,function(accounts){
				res.send(accounts);
			});
		});				
	});

	app.post('/projects/:id/contacts',app.isLogined, function(req,res){
		var projectId = req.params.id || 0;
		var contactId = req.body.contactId;
		var accountId = req.session.accountId;
		Project.getById(projectId,function(project){
			if(!project){
				res.sendStatus(404);
				return;
			}
			if(accountId != project.accountId){
				res.sendStatus(401);
				return;
			}
			Project.addContactById(project._id,contactId);
			res.sendStatus(200);
		});
	});

	app.delete('/projects/:pid/contacts/:cid', app.isLogined,function(req,res){
		var projectId = req.params.pid;
		var contactId = req.params.cid;
		if(!contactId){
			res.sendStatus(400);
			return;
		}
		var accountId = req.session.accountId;
		Project.getById(projectId,function(project){
			if(!project){
				res.sendStatus(404);
				return;
			}
			if(accountId != project.accountId){
				res.sendStatus(401);
				return;
			}
			Project.removeContactById(project._id,contactId);
			res.sendStatus(200);
		});
	});

	app.get('/projects/:id/status',app.isLogined, function(req,res){
		Project.getById(req.params.id,function(project){
			if(!project){
				res.sendStatus(404);
				return;
			}
			Status.getAllByBelongTo(project._id,0,function(status){
				res.send(status);
			});
		});				
	});

	app.post('/projects/:id/status',app.isLogined, function(req,res){
		var projectId = req.params.id || 0;
		var accountId = req.session.accountId;
		var name = req.session.username || '匿名';
		var text = req.body.text || '';
		if(text.length<1){
			res.sendStatus(400);
			return;
		}
		Project.getById(projectId,function(project){
			if(!project){
				res.sendStatus(404);
				return;
			}
			if(accountId != project.accountId){
				res.sendStatus(401);
				return;
			}
			Status.add(accountId,project._id,name,'',text);
			res.sendStatus(200);
		});
	});

	app.delete('/projects/:id/status', app.isLogined,function(req,res){
		//TODO
		var projectId = req.params.id || 0;
		var accountId = req.session.accountId;
		Project.getById(projectId,function(project){
			if(!project){
				res.sendStatus(404);
				return;
			}
			if(accountId != project.accountId){
				res.sendStatus(401);
				return;
			}
			Project.removeStatusById(project._id,accountId);
			res.sendStatus(200);
		});
	});	

};
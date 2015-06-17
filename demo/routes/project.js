exports = module.exports = function(app,models){
	var async = require('async');

	var Project = models.Project;
	var Account = models.Account;
	var Status = models.Status;

	app.get('/projects',app.isLogined,function(req,res){
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		var accountId = req.session.accountId;

		async.waterfall(
			[
				function _project(callback){
					Project.getByAccountId(accountId,page,function(data){
						callback(null,data);
					});
				}
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.send(result);
			}
		);
	});

	app.post('/projects', app.isLogined, function(req,res){
		var	name = req.body.name;
		var description = req.body.description;
		var accountId = req.session.accountId;

		async.waterfall(
			[
				function _project(callback){
					Project.add(accountId,{
						name: name,
						description: description
					},function(project){
						if(!project){
							callback(400);
							return;
						}
						callback(null,project);
					});
				},
				function _account(project,callback){
					Account.addProject(accountId,project._id,project.name,1,function(err){
						callback(null);
					});
				}
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.sendStatus(200);
			}			
		);
	});

	app.get('/projects/:id', app.isLogined, function(req,res){
		var id = req.params.id;

		async.waterfall(
			[
				function _project(callback){
					Project.getById(id,function(data){
						callback(null,data);
					});
				},
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.send(result);
			}
		);
	});

	app.get('/projects/:id/contacts',app.isLogined, function(req,res){
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		var id = req.params.id;

		async.waterfall(
			[
				function _project(callback){
					Project.getById(id,function(project){
						if(!project){
							callback(404);
							return;						
						}
						callback(null,project);
					});
				},
				function _account(project,callback){
					Account.findAll(project.contacts, page, function(accounts){
						callback(null,accounts);
					});
				}
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.send(result);
			}
		);
	});

	app.post('/projects/:id/contacts',app.isLogined, function(req,res){
		var projectId = req.params.id || 0;
		var contactId = req.body.contactId;
		var accountId = req.session.accountId;

		async.waterfall(
			[
				function _project(callback){
					Project.getById(projectId,function(project){
						if(!project){
							callback(404);
							return;
						}
						if(accountId != project.accountId){
							callback(401);
							return;
						}
						callback(null,project);						
					});
				},
				function _contact(project,callback){
					Project.addContactById(project._id,contactId);
					callback(null,project);
				},
				function _account(project,callback){
					Account.addProject(contactId,project._id,project.name,0,function(err){
						callback(null);
					});
				}
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.sendStatus(200);
			}
		);
	});

	app.delete('/projects/:pid/contacts/:cid', app.isLogined,function(req,res){
		var projectId = req.params.pid;
		var contactId = req.params.cid;
		if(!contactId){
			res.sendStatus(400);
			return;
		}
		var accountId = req.session.accountId;

		async.waterfall(
			[
				function _project(callback){
					Project.getById(projectId,function(project){
						if(!project){
							callback(404);
							return;
						}
						if(accountId != project.accountId){
							callback(401);
							return;
						}
						callback(null,project);
					});
				},
				function _contact(project,callback){
					Project.removeContactById(project._id,contactId);
					callbac(null,project);
				},
				function _account(project,callback){
					Account.removeProject(accountId,project._id);

				}				
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.sendStatus(200);
			}
		);
	});

	app.get('/projects/:id/status',app.isLogined, function(req,res){
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		var id = req.params.id;

		async.waterfall(
			[
				function _project(callback){
					Project.getById(id,function(project){
						if(!project){
							callback(404);
							return;
						}
						callback(null,project);
					});
				},
				function _status(project,callback){
					Status.getAllByToId(project._id,page,function(status){
						callback(null,status);
					});
				}
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.send(result);
			}
		);
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

		async.waterfall(
			[
				function _project(callback){
					Project.getById(projectId,function(project){
						if(!project){
							callback(404);
							return;
						}
						if(accountId != project.accountId){
							callback(401);
							return;
						}
						callback(null,project);
					});
				},
				function _status(project,callback){
					Status.add(accountId,project._id,name,'',text);
					callback(null);
				}
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.sendStatus(200);
			}
		);
	});

	app.delete('/projects/:id/status', app.isLogined,function(req,res){
		//TODO
		var projectId = req.params.id || 0;
		var accountId = req.session.accountId;

		async.waterfall(
			[
				function _project(callback){
					Project.getById(projectId,function(project){
						if(!project){
							callback(404);
							return;
						}
						if(accountId != project.accountId){
							callback(401);
							return;
						}
						callback(null,project);
					});					
				},
				function _status(project,callback){
					Project.removeStatusById(project._id,accountId);
					callback(null);
				}
			],
			function _result(err,result){
				if(err){
					res.sendStatus(err);
					return;
				}
				res.sendStatus(200);
			}
		);
	});	
};
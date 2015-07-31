exports = module.exports = function(app,models){
	var async = require('async');

	var Project = models.Project;
	var Account = models.Account;
	var Status = models.ProjectMessage;

	var getAll = function(req,res){
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
		};

	var add = function(req,res){
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
		};

	var close = function(req,res){
			var id = req.params.id;
			async.waterfall(
				[
					function _project(callback){
						Project.close(id,function(success){
							callback(null,success);
						});
					},
				],
				function _result(err,result){
					if(err){
						res.sendStatus(err);
						return;
					}
					res.sendStatus(200);
				}
			);
		};

	var open = function(req,res){
			var id = req.params.id;
			async.waterfall(
				[
					function _project(callback){
						Project.open(id,function(success){
							callback(null,success);
						});
					},
				],
				function _result(err,result){
					if(err){
						res.sendStatus(err);
						return;
					}
					res.sendStatus(200);
				}
			);
		};

	var getOne = function(req,res){
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
		};

	var getContacts = function(req,res){
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
		};

	var addContact = function(req,res){
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
		};

	var removeContact = function(req,res){
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
						callback(null,project);
					},
					function _account(project,callback){
						Account.removeProject(accountId,project._id);
						callback(null,project);
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
		};
/**
 * router outline
 */
 	//add project
 	app.post('/projects', app.isLogined, add);
 	//update project to be closed
 	app.post('/projects/:id/close', app.isLogined, close);
 	//update project to be opened
 	app.post('/projects/:id/open', app.isLogined, open);
 	//update project by adding contact
 	app.post('/projects/:id/contacts',app.isLogined, addContact);//Deprecated
 	app.post('/project/contacts/:pid',app.isLogined, addContact);
 	//update project by removing contact
 	app.delete('/projects/:pid/contacts/:cid', app.isLogined,removeContact);//Deprecated
 	app.delete('/project/contacts/:pid/:cid', app.isLogined,removeContact);
 	//query model
 	app.get('/projects/:id', app.isLogined, getOne);//Deprecated
 	app.get('/project/:id', app.isLogined, getOne);
 	//query projects of mine
 	app.get('/projects',app.isLogined, getAll);
 	//query project's contacts
 	app.get('/projects/:id/contacts',app.isLogined, getContacts);//Deprecated
 	app.get('/project/contacts/:pid',app.isLogined, getContacts);
};
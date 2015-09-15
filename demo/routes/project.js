exports = module.exports = function(app,models){
	var async = require('async');

	var Project = models.Project;
	var Account = models.Account;
	var Status = models.ProjectMessage;

	var add = function(req,res){
			var accountId = req.session.accountId;
			var project = req.project;
			project.accountId = accountId;
			project.createtime = new Date();
			project.updatetime = new Date();
			project.closed = false;

			async.waterfall(
				[
					function _project(callback){
						Project.create(project,function(err,doc){
							if(err) return callback(err);
							callback(null,doc);
						});
					},
					function _account(project,callback){
						Account
							.findByIdAndUpdate(
								accountId,
								{
									$push: {
										projects: {
											_id: project._id,
											name: project.name,
											type: 0,
											notification: 0,
											agree: 0,
										}
									}
								},
								callback
							);
					}
				],
				function _result(err,result){
					if(err) return res.send(err);
					res.sendStatus(200);
				}
			);
		};

	var close = function(req,res){
			var id = req.params.id;
			async.waterfall(
				[
					function _project(callback){
						Project
						.findByIdAndUpdate(
							id,
							{
								$set: {
									closed: true,
									updatetime: new Date(),
								}
							},
							callback
						);
					},
				],
				function _result(err,result){
					if(err) return res.send(err);
					res.sendStatus(200);
				}
			);
		};

	var open = function(req,res){
			var id = req.params.id;
			async.waterfall(
				[
					function _project(callback){
						Project
						.findByIdAndUpdate(
							id,
							{
								$set: {
									closed: false,
									updatetime: new Date(),
								}
							},
							callback
						);
					},
				],
				function _result(err,result){
					if(err) return res.send(err);
					res.sendStatus(200);
				}
			);
		};

	var addContact = function(req,res){
			var projectId = req.params.id || 0;
			var contactId = req.body.contactId;
			var accountId = req.session.accountId;

			async.waterfall(
				[
					function(callback){
						Project.findByIdAndUpdate(
							projectId,
							{
								$addToSet: {
									contacts: contactId
								}
							},
							callback
						);
					},

					function(project,callback){
						Account
							.findByIdAndUpdate(
								contactId,
								{
									$push: {
										projects: {
											_id: project._id,
											name: project.name,
											type: 0,
											notification: 0,
											agree: 0,
										}
									}
								},
								callback
							);
					}
				],
				function(err,result){
					if(err) return res.send(err);
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
					function(callback){
						Project.findByIdAndUpdate(
							projectId,
							{
								$pull: {
									contacts: contactId
								}
							},
							callback
						);
					},

					function(project,callback){
						Account
							.findByIdAndUpdate(
								contactId,
								{
									$pull: {
										'projects.$._id': projectId
									}
								},
								callback
							);
					}
				],
				function(err,result){
					if(err) return res.send(err);
					res.sendStatus(200);
				}
			);
		};


	var getContacts = function(req,res){
			var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			var id = req.params.id;

			async.waterfall(
				[
					function _project(callback){
						Project.findById(id,function(err,project){
							if(err) return callback(err);
							if(!project || !project.contacts) return callback({code: 40400, message: 'project id not exsit.'});
							
							callback(null,project.contacts);
						});
					},
					function _account(contacts,callback){
						Account
							.find({_id: {$in: contacts}})
							.skip(page*per)
							.limit(per)
							.exec(callback);
					}
				],
				function(err,result){
					if(err) return res.send(err);
					res.send(result);
				}
			);
		};


	var getProjects = function(req,res){
			var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			var accountId = req.session.accountId;

			async.waterfall(
				[
					function(callback){
						Project
							.find({accountId:accountId})
							.sort({updatetime:-1})
							.skip(page*per)
							.limit(per)
							.exec(callback);
					}
				],
				function(err,result){
					if(err){
						res.sendStatus(err);
						return;
					}
					res.send(result);
				}
			);
		};

	var getById = function(req,res){
			var id = req.params.id;

			async.waterfall(
				[
					function(callback){
						Project.findById(id,callback);
					},
				],
				function(err,result){
					if(err) return res.send(err);
					res.send(result);
				}
			);
		};


/**
 * router outline
 */
 	/**
 	 * add project
 	 * 
 	 */
 	app.post('/projects', app.isLogined, add);

 	/**
 	 * remove project
 	 * 
 	 */

 	/**
 	 * update project
 	 *  type: 
 	 *        open
 	 *        close
 	 *        contact_add
 	 *        contact_remove
 	 */
 	app.post('/projects/:id/close', app.isLogined, close);
 	//update project to be opened
 	app.post('/projects/:id/open', app.isLogined, open);
 	//update project by adding contact
 	app.post('/projects/:id/contacts',app.isLogined, addContact);//Deprecated
 	app.post('/project/contacts/:pid',app.isLogined, addContact);
 	//update project by removing contact
 	app.delete('/projects/:pid/contacts/:cid', app.isLogined,removeContact);//Deprecated
 	app.delete('/project/contacts/:pid/:cid', app.isLogined,removeContact);

 	/**
 	 * get projects
 	 *   type: 
 	 *   	contacts
 	 */
 	app.get('/projects',app.isLogined, getProjects);
 	app.get('/project/contacts/:pid',app.isLogined, getContacts);

 	/**
 	 * get project by id
 	 * 
 	 */
 	app.get('/project/:id', app.isLogined, getById);






 	//query model
 	app.get('/projects/:id', app.isLogined, getById);//Deprecated
 	//query projects of mine
 	app.get('/projects',app.isLogined, getProjects);
 	//query project's contacts
 	app.get('/projects/:id/contacts',app.isLogined, getContacts);//Deprecated
};
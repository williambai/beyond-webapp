exports = module.exports = function(app,models){
	var async = require('async');

	var Project = models.Project;
	var Account = models.Account;
	var Status = models.ProjectMessage;

	var add = function(req,res){
			var project = req.body;
			var accountId = req.session.accountId;
			project.accountId = accountId;
			project.createtime = new Date();
			project.updatetime = new Date();
			project.closed = false;

			async.waterfall(
				[
					function(callback){
						Project.create(project,function(err,doc){
							if(err) return callback(err);
							callback(null,doc);
						});
					},
					function(project,callback){
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
				function(err,result){
					if(err) return res.send(err);
					res.sendStatus(200);
				}
			);
		};
	
	var remove = function(req,res){

		};

	var update = function(req,res){
			var type = req.query.type || '';
			var id = req.params.id;
			switch(type){
				case 'close':
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
					break;
				case 'open':
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
					break;
				case 'contact_add':	
					var cid = req.body.cid;
					var accountId = req.session.accountId;

					async.waterfall(
						[
							function(callback){
								Project.findByIdAndUpdate(
									id,
									{
										$addToSet: {
											contacts: cid
										}
									},
									callback
								);
							},

							function(project,callback){
								Account
									.findByIdAndUpdate(
										cid,
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
					break;
				case 'contact_remove':
					var cid = req.body.cid;
					if(!cid){
						res.sendStatus(400);
						return;
					}
					var accountId = req.session.accountId;

					async.waterfall(
						[
							function(callback){
								Project.findByIdAndUpdate(
									id,
									{
										$pull: {
											contacts: cid
										}
									},
									callback
								);
							},

							function(project,callback){
								Account
									.findByIdAndUpdate(
										cid,
										{
											$pull: {
												'projects.$._id': id
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
					break;	
				default:
					res.sendStatus(200);
					break;	
			}
		};

	var getMore = function(req,res){
			var type = req.query.type || '';
			var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			var accountId = req.session.accountId;
			switch(type){
				default:
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
					break;
			}

		};

	var getOne = function(req,res){
			var type = req.query.type || '';
			var id = req.params.id;
			switch(type){
				case 'contact':
					var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
					page = (!page || page < 0) ? 0 : page;
					var per = 20;

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
					break;
				default:
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
					break;
			}

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
 	 app.delete('/projects/:id', app.isLogined, remove);
 	/**
 	 * update project
 	 *  type: 
 	 *        open
 	 *        close
 	 *        contact_add
 	 *        contact_remove
 	 */
 	app.put('/projects/:id', app.isLogined, update);

 	/**
 	 * get projects
 	 */
 	app.get('/projects',app.isLogined, getMore);

 	/**
 	 * get project
 	 * 	   type: 
 	 * 	      contact
 	 */
 	app.get('/projects/:id', app.isLogined, getOne);

};
 exports = module.exports = function(app,models){
	var async = require('async');
	var Project = models.Project;
	var Account = models.Account;
	var Message = models.ProjectMessage;

	var add = function(req,res){
			var projectId = req.params.pid || 0;
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
						Message.add(accountId,project._id,name,'','','',text);
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
		};

	var remove = function(req,res){
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
		};
	var updateVote = function(req,res){
			var id = req.params.id;
			var accountId = req.session.accountId;
			var username = req.session.username;
			if(req.body.good){
				var good = req.body.good;
				Message.updateVoteGood(id,accountId,username, function(success){
					if(success){
						res.sendStatus(200);
					}else{
						res.sendStatus(406);
					}
				});
			}else if(req.body.bad){
				var bad = req.body.bad;
				Message.updateVoteBad(id,accountId,username, function(success){
					if(success){
						res.sendStatus(200);
					}else{
						res.sendStatus(406);
					}
				});
			}else{
				res.sendStatus(400);
			}
		};

	var updateComment = function(req,res){
		var id = req.params.id;
		var accountId = req.session.accountId;
		var username = req.session.username;
		var comment = req.body.comment || '';
		if(comment.length == 0){
			res.sendStatus(400);
			return;
		}
		Message.addComment(id,accountId,username,comment,function(success){
			if(success){
				res.sendStatus(200);
			}else{
				res.sendStatus(406);
			}
		});
	};
	var updateLevel = function(req,res){
		var id = req.params.id;
		var accountId = req.session.accountId;
		var username = req.session.username;
		var level = req.body.level || 0;
		Message.updateLevel(id,level, function(success){
			if(success){
				res.sendStatus(200);
			}else{
				res.sendStatus(406);
			}
		});

	};

	var getOne = function(req,res){

	};
	
	var getCollectionByStatus = function(req,res){
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		var id = req.params.pid;

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
					Message.getAllByToId(project._id,page,function(status){
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
	};

/**
 * router outline
 */
	//add
	app.post('/messages/project/:pid', app.isLogined, add);
	//remove
	app.delete('/message/project/:id',app.isLogined, remove);
	//update model by category 'vote'
	app.post('/message/project/vote/:id', app.isLogined, updateVote);
	//update model by category 'comment'
	app.post('/message/project/comment/:id', app.isLogined, updateComment);
	//update model by category 'level'
	app.post('/message/project/level/:id', app.isLogined, updateLevel);
	//query model
	app.get('/message/project/:id',app.isLogined, getOne);
	//query collection by category 'status'
	app.get('/messages/project/status/:pid', app.isLogined, getCollectionByStatus);
	//query collection by search
	app.get('/messages/project/search', function(req,res){
		res.sendStatus(401);
	});	
 };
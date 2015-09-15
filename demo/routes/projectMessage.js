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
					function(callback){
						Project.findById(projectId,function(err,project){
							if(err) return callback(err);
							if(!project) return callback({code: 40000, message: 'project not exist.'});

							if(accountId != project.accountId)
								return callback({code: 40100, message: 'can not do.'});
							callback(null,project);
						});
					},
					function(project,callback){
						var message = {
								fromId: req.session.accountId,
								toId: project._id,
								fromUser:{},
								toUser:{},
								subject: '',
								content: req.body.text,
								tags: [],
								level: 0,
								good: 0,
								bad: 0,
								score: 0,
								createtime: new Date(),
							};
							message.fromUser[message.fromId] = {
								username: req.session.username,
								avatar: req.session.avatar
							};
							message.toUser[message.toId] ={
								username: '',
								avatar: ''
							};

						Message.create(message, function(err,doc){
							if(err) return res.send(err);
							res.send(doc);
						});
					}
				],
				function _result(err,result){
					if(err) return res.send(err);
					res.sendStatus(200);
				}
			);
		};

	var remove = function(req,res){

		};

	var updateVote = function(req,res){
		var id = req.params.id;
		var accountId = req.session.accountId;
		var username = req.session.username;
		if(req.body.good){
			var good = req.body.good;
			Message.findOneAndUpdate(
				{
					 _id: id,
					voters: {$nin: [accountId]}
				},
				{
					$push: {
						voters: accountId, 
						votes: {
							accountId: accountId,
							username: voterUsername,
							vote: 'good'
						}
					},
					$inc: {good: 1, score: 1}
				},
				function(err,result){
					if(err) return res.send(err);
					res.send(result);
				}
			);	
		}else if(req.body.bad){
			var bad = req.body.bad;
			Message
				.findOneAndUpdate(
					{
						_id: id,
						voters: {$nin: [accountId]}
					},
					{
						$push: {
							voters: accountId, 
							votes: {
								accountId: accountId,
								username: voterUsername,
								vote: 'bad'
							}
						},
						$inc: {bad: 1, score: -1}
					},
					function(err, result){
						if(err) return res.send(err);
						res.send(result);
					}
				);
		}else{
			res.send({code: 40000, message: 'can not vote.'});
		}
	};

	var updateComment = function(req,res){
			var id = req.params.id;
			var accountId = req.session.accountId;
			var username = req.session.username;
			var comment = req.body.comment || '';
			if(comment.length < 1) 
				return res.send({code: 40000, message: 'comment length is 0.'});
			Message
				.findByIdAndUpdate(
					id,
					{
						$push: {
							comments: {
								accountId: accountId,
								username: username,
								comment: comment
							}
						}
					},
					function(err,result){
						if(err) return res.send(err);
						res.send(result);
					}
				);
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
		var accountId = req.params.aid == 'me' 
							? req.session.accountId
							: req.params.aid;
		var page = req.query.page || 0;
		var per = 20;

		if(isNaN(page)) page = 0;

		Account.findById(
			accountId, 
			function(err,account){
				if(err) return res.send(err);
				if(!account) return send({code: 40400,message: 'account not exist.'});
				Message
					.find({toId: accountId, fromId: accountId})
					.sort({createtime:-1})
					.skip(page*per)
					.limit(per)
					.exec(function(err,docs){
						if(err) return res.send(err);
						res.send(docs);
					}
				);
			}
		);
	};
	var getCollectionByStatus = function(req,res){
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		var per = 20;
		var id = req.params.pid;

		async.waterfall(
			[
				function(callback){
					Project.findById(id,function(err,project){
						if(err) return res.send(err);
						if(!project) return send({code: 40400,message: 'project not exist.'});
						callback(null,project);
					});
				},
				function(project,callback){
					Message
						.find({
							toId:project._id
						})
						.sort({createtime:-1})
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
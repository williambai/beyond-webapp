 exports = module.exports = function(app,models){
	var async = require('async');
	var Project = models.Project;
	var Account = models.Account;
	var Message = models.ProjectStatus;

	var add = function(req,res){
			var projectId = req.params.pid;
			var accountId = req.session.accountId;
			var message = req.body;
			message.pid = projectId;
			message.createby = {
				uid: req.session.accountId,
				username: req.session.username,
				avatar: req.session.avatar
			};
			message.lastupdatetime = new Date();

			async.waterfall(
				[
					function(callback){
						Project.findById(projectId,function(err,project){
							if(err) return callback(err);
							if(!project) return callback({code: 40000, message: 'project not exist.'});
							callback(null,project);
						});
					},
					function(project,callback){

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

	var update = function(req,res){
			var type = req.query.type || '';
			var id = req.params.id;
			var accountId = req.session.accountId;
			var username = req.session.username;
			switch(type){
				case 'vote':
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
										username: username,
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
											username: username,
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
					break;
				case 'comment':
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
					break;
				case 'level':
					var level = req.body.level || 0;
					Message.updateLevel(id,level, function(success){
						if(success){
							res.sendStatus(200);
						}else{
							res.sendStatus(406);
						}
					});		
					break;			
				default:
					break;	
			}

		};

	var getOne = function(req,res){

	};

	var getMore = function(req,res){
		var type = req.query.type || '';
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		var per = 20;
		var id = req.params.pid;
		switch(type){
			default:
				async.waterfall(
					[
						function(callback){
							Project
								.findById(
									id,
									function(err,project){
										if(err) return res.send(err);
										if(!project) return res.send({code: 40400,message: 'project not exist.'});
										callback(null,project);
									}
								);
						},
						function(project,callback){
							Message
								.find({
									pid:project._id
								})
								.sort({_id:-1})
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
		}
	};

/**
 * router outline
 */
	/**
	 * add
	 */
	app.post('/statuses/project/:pid', app.isLogined, add);

	/**
	 * remove
	 */
	app.delete('/statuses/project/:pid/:id',app.isLogined, remove);

	/**
	 * update
	 * type:
	 *    vote
	 *    comment
	 *    level
	 *    
	 */
	app.put('/statuses/project/:pid/:id', app.isLogined, update);

	/**
	 * get one
	 */
	app.get('/statuses/project/:pid/:id',app.isLogined, getOne);

	/**
	 * get more
	 */
	app.get('/statuses/project/:pid', app.isLogined, getMore);
 };
module.exports = exports = function(app, config,mongoose,nodemailer){
	var debug = true;

	var statusSchema = new mongoose.Schema({
			fromId: {type: String},
			toId: {type:String},//accountId or projectId
			username: {type: String},
			avatar: {type: String},
			status: {type: String},
			comments: [],//accountId,username,comment
			level: {type: Number}, // important index: 0~100
			voters:[],//accountId
			votes: [],//accountId,username,vote(good or bad)
			good: {type: Number},
			bad: {type: Number},
			score: {type: Number},
			createtime: {type: Date}
		});

	mongoose.statusSchema = statusSchema;

	var Status = mongoose.model('Status', statusSchema);

	var defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Status Save/Remove/Update successfully.');
		};

	var add = function(fromId,toId,username,avatar,status,callback){
			var status = new Status({
					fromId: fromId,
					toId: toId,
					username: username,
					avatar: avatar || '',
					status: status,
					level: 0,
					good: 0,
					bad: 0,
					score: 0,
					createtime: new Date(),
				});
			status.save(function(err){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(status);
				}
			});
		};

	var remove = function(id,callback){
			Status
				.findByIdAndRemove(
					id, 
					function(err){
						debug && defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(true);
						}
					}
				);
		};

	var updateAvatar = function(id,avatar,callback){
			Status
				.findByIdAndUpdate(
					id,
					{
						avatar: avatar
					},
					function(err, result){
						debug && defaultCallback(err);
						if(err || !result){
							callback && callback(false);
						}else{
							callback && callback(true);
						}
					}
				);
		};

	var updateVoteGood = function(id,accountId,voterUsername,callback){
			Status.findOneAndUpdate(
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
					debug && defaultCallback(err);
					if(err || !result){
						callback && callback(false);
					}else{
						callback && callback(true);
					}
				}
			);			
		};

	var addComment = function(id,accountId,username,comment,callback){
			Status
				.findOneAndUpdate(
					{
						_id: id,
					},
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
						debug && defaultCallback(err);
						if(err || !result){
							callback && callback(false);
						}else{
							callback && callback(true);
						}
					}
				);
		};

	var updateVoteBad = function(id,accountId,voterUsername,callback){
			Status
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
						debug && defaultCallback(err);
						if(err || !result){
							callback && callback(false);
						}else{
							callback && callback(true);
						}
					}
				);
		};

	var updateLevel = function(id,level,callback){
			Status
				.findByIdAndUpdate(
					id,
					{
						level: level
					},
					function(err,result){
						debug && defaultCallback(err);
						if(err || !result){
							callback && callback(false);
						}else{
							callback && callback(true);
						}
					}
				);
		};

	var getAll = function(fromId,toId,page,callback){
			if(typeof fromId == 'string') {
				fromId = [fromId];
			}
			var per = 20;
			if(typeof page == 'function'){
				callback = page;
				page = 0;
			}
			if(!callback){
				throw new Error('callback is not defined.');
			}
			Status
				.find({toId:toId, fromId: {$in: fromId}})
				.sort({createtime:-1})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					debug && defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(docs);
					}
				});
		};

	var getAllByToId = function(toId,page,callback){
			var per = 20;
			if(typeof page == 'function'){
				callback = page;
				page = 0;
			}
			if(!callback){
				throw new Error('callback is not defined.');
			}
			Status
				.find({toId:toId})
				.sort({createtime:-1})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					debug && defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(docs);
					}
				});
		};

	var getAllByFromId = function(fromId,page,callback){
			var per = 20;
			if(typeof page == 'function'){
				callback = page;
				page = 0;
			}
			if(!callback){
				throw new Error('callback is not defined.');
			}

			Status
				.find({fromId: fromId})
				.sort({createtime:-1})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					debug && defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(docs);
					}
				});
		};

	var getShortMessageById = function(accountId,contactIds,page,callback){
			var per = 20;
			if(typeof page == 'function'){
				callback = page;
				page = 0;
			}
			if(!callback){
				throw new Error('callback is not defined.');
			}

			Status
				.find({
						toId: accountId,
						fromId: {$in: contactIds} 
					})
				.sort({createtime:-1})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					debug && defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(docs);
					}
				});
		};

	var getActivityById = function(accountId, contactIds, page, callback){
			var per = 20;
			if(typeof page == 'function'){
				callback = page;
				page = 0;
			}
			if(!callback){
				throw new Error('callback is not defined.');
			}

			Status
				.find({})
				.or([
					{
						toId: accountId,
						fromId: accountId 
					},
					{
						toId: {$in: contactIds},
						fromId: {$in: contactIds}
					}
				])
				.sort({createtime:-1})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					debug && defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(docs);
					}
				});
		};

	return {
		Status: Status,
		add: add,
		remove: remove,
		updateAvatar: updateAvatar,
		updateVoteGood: updateVoteGood,
		updateVoteBad: updateVoteBad,
		updateLevel: updateLevel,
		addComment: addComment,
		getAll:getAll,
		getAllByToId: getAllByToId,
		getAllByFromId: getAllByFromId,
		getShortMessageById: getShortMessageById,
		getActivityById: getActivityById
	};
};
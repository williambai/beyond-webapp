module.exports = exports = function(app, config,mongoose,nodemailer){
	var debug = true;

	var statusSchema = new mongoose.Schema({
			userId: {type: String},
			belongTo: {type:String},//accountId or projectId
			username: {type: String},
			avatar: {type: String},
			status: {type: String},
			comments: [{type: String}],
			level: {type: Number}, // important index: 0~100
			voters: [],//accountId
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

	var add = function(userId,belongTo,username,avatar,status,callback){
			var status = new Status({
					userId: userId,
					belongTo: belongTo,
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
				callback && callback(err);
			});
		};

	var remove = function(id,callback){
			Status
				.findByIdAndRemove(
					id, 
					function(err){
						debug && defaultCallback(err);
						callback && callback(err);
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
					function(err){
						debug && defaultCallback(err);
						callback && callback(err);
					}
				);
		};

	var updateVoteGood = function(id,accountId,callback){
			Status.findOneAndUpdate(
				{
					 _id: id,
					voters: {$nin: [accountId]}
				},
				{
					$push: {voters: accountId},
					$inc: {good: 1, score: 1}
				},
				function(err){
					debug && defaultCallback(err);
					callback && callback(err);
				}
			);			
	};

	var updateVoteBad = function(id,accountId,callback){
		Status
			.findOneAndUpdate(
				{
					_id: id,
					voters: {$nin: [accountId]}
				},
				{
					$push: {voters: accountId},
					$inc: {bad: 1, score: -1}
				},
				function(err){
					debug && defaultCallback(err);
					callback && callback(err);
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
					function(err){
						debug && defaultCallback(err);
						callback && callback(err);
					}
				);
		};
	var getAll = function(userId,belongTo,page,callback){
			if(typeof userId == 'string') {
				userId = [userId];
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
				.find({belongTo:belongTo, userId: {$in: userId}})
				.sort({createtime:-1})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					debug && defaultCallback(err);
					callback && callback(docs);
				});
		};

	var getAllByBelongTo = function(belongTo,page,callback){
			var per = 20;
			if(typeof page == 'function'){
				callback = page;
				page = 0;
			}
			if(!callback){
				throw new Error('callback is not defined.');
			}
			Status
				.find({belongTo:belongTo})
				.sort({createtime:-1})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					debug && defaultCallback(err);
					callback && callback(docs);
				});
		};

	var getAllByUserId = function(userId,page,callback){
			var per = 20;
			if(typeof page == 'function'){
				callback = page;
				page = 0;
			}
			if(!callback){
				throw new Error('callback is not defined.');
			}

			Status
				.find({userId: userId})
				.sort({createtime:-1})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					debug && defaultCallback(err);
					callback && callback(docs);
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
		getAll:getAll,
		getAllByBelongTo: getAllByBelongTo,
		getAllByUserId: getAllByUserId
	};
};
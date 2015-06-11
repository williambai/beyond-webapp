module.exports = exports = function(app, config,mongoose,nodemailer){
	var debug = true;

	var chatSchema = new mongoose.Schema({
		fromId: {type: String},
		toId: {type: String},
		username: {type: String},
		avatar: {type: String},
		status: {type: String},
		createtime: {type: Date}
	});
	mongoose.chatSchema = chatSchema;

	var Chat = mongoose.model('Chat', chatSchema);

	var defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Chat Save/Remove/Update successfully.');
		};
	
	var add = function(from,to,options,callback){
			var chat = new Chat({
				fromId: from,
				toId: to,
				username: options.username,
				avatar: options.avatar, 
				status: options.status,
				createtime: new Date()
			});
			chat.save(function(err){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(chat);
				}
			});
		};

	var update = function(id, options,callback){
			Chat
				.where({_id:id})
				.update({$set: options}, function(err){
					debug && defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(true);
					}					
				});
		};

	var remove = function(id,callback){
			Chat.remove({_id:id}, function(err){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(true);
				}									
			});
		};

	var getById = function(id, callback){
			Chat.findOne({_id:id}, function(err,doc){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(doc);
				}									
			});
		};

	var getByToId = function(toId,page,callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(!toId){
				callback && callback(null);
				return;
			}
			Chat
				.find({toId:toId})
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

	var getChatHistory = function(id1, id2, page, callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(!(id1 && id2)){
				callback && callback(null);
				return;
			}			
			Chat
				.find({
					fromId:{$in: [id1, id2]},
					toId: {$in: [id1, id2]}
				})
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
		Chat: Chat,
		add: add,
		remove: remove,
		getByToId: getByToId,
		getChatHistory: getChatHistory,
	};		
};
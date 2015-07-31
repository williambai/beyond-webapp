module.exports = exports = function(app, config,mongoose,nodemailer){
	var chat = null;

	var chatSchema = new mongoose.Schema({
		fromId: {type: String},
		toId: {type: String},
		username: {type: String},
		avatar: {type: String},
		status: {type: String},
		createtime: {type: Date}
	});
	chatSchema.set('collection','account-chats');

	var ChatModel = mongoose.model('AccountChat', chatSchema);

	var Chat = function(model){
		this.model = model;
	};

	Chat.prototype.debug = true;
	Chat.prototype.defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Chat Save/Remove/Update successfully.');
		};
	
	Chat.prototype.add = function(from,to,options,callback){
			var chat = new this.model({
				fromId: from,
				toId: to,
				username: options.username,
				avatar: options.avatar, 
				status: options.status,
				createtime: new Date()
			});
			chat.save(function(err){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(chat);
				}
			});
		};

	Chat.prototype.update = function(id, options,callback){
			this.model
				.where({_id:id})
				.update({$set: options}, function(err){
					this.debug && this.defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(true);
					}					
				});
		};

	Chat.prototype.remove = function(id,callback){
			this.model.remove({_id:id}, function(err){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(true);
				}									
			});
		};

	Chat.prototype.getById = function(id, callback){
			this.model.findOne({_id:id}, function(err,doc){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(doc);
				}									
			});
		};

	Chat.prototype.getByToId = function(toId,page,callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(!toId){
				callback && callback(null);
				return;
			}
			this.model
				.find({toId:toId})
				.sort({createtime:-1})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					this.debug && this.defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(docs);
					}									
				});
		};

	Chat.prototype.getChatHistory = function(id1, id2, page, callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(!(id1 && id2)){
				callback && callback(null);
				return;
			}			
			this.model
				.find({
					fromId:{$in: [id1, id2]},
					toId: {$in: [id1, id2]}
				})
				.sort({createtime:-1})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					this.debug && this.defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(docs);
					}									
				});
		};
	if(!chat){
		chat = new Chat(ChatModel);
	}
	return chat;
};
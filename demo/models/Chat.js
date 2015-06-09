module.exports = exports = function(app, config,mongoose,nodemailer){
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
			return console.log('Save/Remove/Update successfully.');
		};
	
	var add = function(from,to,options){
			var chat = new Chat({
				fromId: from,
				toId: to,
				username: options.username,
				avatar: options.avatar, 
				status: options.status,
				createtime: new Date()
			});
			chat.save(defaultCallback);
		};

	var update = function(id, options){
			Chat.where({_id:id}).update({$set: options}, defaultCallback);
		};

	var remove = function(id){
			Chat.remove({_id:id}, defaultCallback);
		};

	var getById = function(id, callback){
			Chat.findOne({_id:id}, function(err,doc){
				callback(doc);
			});
		};

	var getByToId = function(toId,page,callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(toId){
				Chat.find({toId:toId},function(err,docs){
					callback(docs);
				}).skip(page*per).limit(per);
			}else{
				callback(null);
			}
		};

	return {
		Chat: Chat,
		add: add,
		remove: remove,
		getByToId: getByToId,
	};		
};
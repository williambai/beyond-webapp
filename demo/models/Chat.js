module.exports = exports = function(app, config,mongoose,nodemailer){
	var chatSchema = new mongoose.Schema({
		roomId: {type: mongoose.Schema.ObjectId},
		from: {type: mongoose.Schema.ObjectId},
		to: {type: mongoose.Schema.ObjectId},
		text: {type: String},
		time: {type: Date}
	});
	mongoose.chatSchema = chatSchema;

	var Chat = mongoose.model('Chat', chatSchema);

	var defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Save/Remove/Update successfully.');
		};
	
	var add = function(roomId,options){
			var chat = new Chat({
				roomId: roomId,
				from: options.from,
				to: options.to,
				text: options.text,
				time: new Date()
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

	var getByRoomId = function(roomId,page,callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(roomId){
				Chat.find({roomId:roomId},function(err,docs){
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
		getByRoomId: getByRoomId,
	};		
};
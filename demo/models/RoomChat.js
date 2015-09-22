module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			rid: String,//room id
			uid: String,
			username: String,
			avatar: String,
			message: {},
			lastupdatetime: Date
		});

	schema.set('collection','room.chats');

	return mongoose.model('RoomChat', schema);
};
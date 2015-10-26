module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			rid: String,//room id
			createby: {
				uid: String,
				username: String,
				avatar: String,
			},
			type: {
				type: String, 
				enum: 'text|file|image|link|mixed|voice|video|shortvideo|location|email'.split('|')
			},
			content: {
				subject: String,
				body: String,
				urls: {},
				thumbnails: {},
				format: String,
				location: {
					// type: String,
					// coordinates: [Number]
				},
				scale: Number,
				label: String,
			},
			lastupdatetime: Date
		});

	schema.set('collection','room.chats');

	return mongoose.model('RoomChat', schema);
};
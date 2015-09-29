module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			uid: String,
			fid: String,
			createby: {
				uid: String,
				username: String,
				avatar: String,
			},	
			type: {
				type: String, 
				enum: 'text|image|mixed|vioce|video|shortvideo|location|email'.split('|')
			},
			content: {
				subject: String,
				body: String,
				urls: {},
				thumbnails: {},
				format: String,
				location_x: Number,
				location_y: Number,
				scale: Number,
				label: String,
			},
			lastupdatetime: {type: Date, default: Date.now}
		});

	schema.set('collection','account.chats');

	return mongoose.model('AccountChat', schema);
};
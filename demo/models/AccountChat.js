module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			user:{
				uid: String, //uid > fid
				username: String,
				avatar: String,
			},
			friend: {
				uid: String,// fid < uid
				username: String,
				avatar: String,
			},	
			type: String,//text|image|vioce|video|shortvideo|location|moreimage
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
			lastupdatetime: Date
		});

	schema.set('collection','account.chats');

	return mongoose.model('AccountChat', schema);
};
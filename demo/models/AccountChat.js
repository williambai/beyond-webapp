module.exports = exports = function(app,mongoose){

	//new version
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
			message: {},
			lastupdatetime: Date
		});

	schema.set('collection','account.chats');

	return mongoose.model('AccountChat', schema);
};
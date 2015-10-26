module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			rid: String, //room id
			uid: String, //account id
			username: String,
			avatar: String,
			roles: [], //0:参与; 1:主持
			status: {
				code: Number,//0: 正常；
				message: String,
			},
			lastupdatetime: {type: Date}
		});

	schema.set('collection','room.accounts');

	return mongoose.model('RoomAccount', schema);
};
module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			name: String,
			avatar: String,
			description: String,
			status: {
				code: Number,//0: 正常；
				message: String,
			},
			lastupdatetime: {type: Date}
		});

	schema.set('collection','rooms');

	return mongoose.model('Room', schema);
};
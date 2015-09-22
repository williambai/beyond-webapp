module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			name: String,
			avatar: String,
			description: String,
			users: [{
				uid: String,
				username: String,
				avatar: String,
			}],
			lastupdatetime: {type: Date}
		});

	schema.set('collection','rooms');

	return mongoose.model('Room', schema);
};
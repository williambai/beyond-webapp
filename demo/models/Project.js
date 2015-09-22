module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		members: Number,
		createby: {
			uid: String,
			username: String,
			avatar: String,
		},
		status: {
			code: Number,
			message: String
		},
		lastupdatetime: Date,
	});

	schema.set('collection', 'projects');

	return mongoose.model('Project', schema);
};
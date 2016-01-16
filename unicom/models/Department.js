module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		nickname: {
			type: String,
		},
		description: String,
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ChannelDepartment',
		},
		path: String,
	});

	schema.set('collection','departments');
	return mongoose.model('Department',schema);
};
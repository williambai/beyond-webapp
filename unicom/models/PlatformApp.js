module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		name: String,
		nickname: {
			type: String,
			required: true,
		},
		description: String,
	});

	schema.set('collection', 'platform.apps');
	return mongoose.model('PlatformApp', schema);
};
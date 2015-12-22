module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		name: String,
		nickname: {
			type: String,
		},
		description: String,
		features: [],
		// features: [{
		// 	id: mongoose.Schema.ObjectId,
		// 	name: String,
		// 	nickname: String,
		// 	router: String
		// }],
	});

	schema.set('collection', 'platform.apps');
	return mongoose.model('PlatformApp', schema);
};
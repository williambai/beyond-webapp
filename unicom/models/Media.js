module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		category: String,
		description: String,
		originalname: String,
		mimetype: String,
		size: Number,
		extension: String,
		url: String,
		width: Number,
		height: Number,
		target_url: String,
	});

	schema.set('collection','medias');
	return mongoose.model('Media',schema);
};
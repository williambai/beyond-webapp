module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		originalname: String,
		name: String,
		nickname: String,
		description: String,
		mimetype: String,
		size: Number,
		extension: String,
		url: String,
		width: Number,
		height: Number,
		target_url: String,
	});

	schema.set('collection','promote.media');
	return mongoose.model('PromoteMedia',schema);
};
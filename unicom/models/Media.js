var mongoose = require('mongoose');

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

schema.set('collection', 'medias');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('Media', schema);
};
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	description: String,
	thumbnail: String,
});

schema.set('collection', 'product.categories');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('ProductCategory', schema);
};
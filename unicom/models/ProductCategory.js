module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		thumbnail: String,
	});

	schema.set('collection', 'product.categories');
	return mongoose.model('ProductCategory', schema);
};
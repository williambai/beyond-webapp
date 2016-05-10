var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	description: String,
	thumbnail: String,
	status: {
		type: String,
		enum: {
			values: '有效|无效'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
});

schema.set('collection', 'product.categories');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('ProductCategory', schema);
};
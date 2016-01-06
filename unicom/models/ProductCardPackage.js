module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		category: String,
		classification: String,
		price: Number,
		unit: String,
		quantity: Number,
		goods: {
			id: String,
			name: String,
		},
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
	});

	schema.set('collection','product.card.packages');
	return mongoose.model('ProductCardPackage',schema);
};
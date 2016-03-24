module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		category: String,
		thumbnail_url: String,
		url: String,
		price: Number,
		unit: String,
		quantity: Number,
		starttime: String,
		endtime: String,
		display_sort: Number,
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

	schema.set('collection','product.exchanges');
	return mongoose.model('ProductExchange',schema);
};
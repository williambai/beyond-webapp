module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		goods: {
			name: String,
			nickname: String,
			sourceId: String,
		},
		category: String,
		subject: String,
		description: String,
		thumbnail_url: String,
		url: String,
		starttime: String,
		endtime: String,
		price: String,
		unit: String,
		display_sort: Number,
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','product.exchange');
	return mongoose.model('ProductExchange',schema);
};
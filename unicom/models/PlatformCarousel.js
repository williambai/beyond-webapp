module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		img_url: String,
		target_url: String,
		display_sort: Number,
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
	});

	schema.set('collection', 'platform.carousels');
	return mongoose.model('PlatformCarousel', schema);
};
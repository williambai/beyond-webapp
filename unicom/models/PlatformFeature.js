module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		name: String,
		nickname: {
			type: String,
			required: true,
		},
		description: String,
		app: [],
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		}
	});

	schema.set('collection', 'platform.features');
	return mongoose.model('PlatformFeature', schema);
};
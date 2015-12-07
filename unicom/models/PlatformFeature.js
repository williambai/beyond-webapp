module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		code: {
			type: String,
			// unique: true,
		},
		status: {
			code: {
				type: Number,
				enum: {
					values: '0|1'.split('|'), //1: 有效，0：无效
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			},
			message: {
				type: String,
				enum: {
					values: '有效|无效'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			}
		}
	});

	schema.set('collection','platform.features');
	return mongoose.model('PlatformFeature',schema);
};
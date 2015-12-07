module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		features: [],
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

	schema.set('collection','platform.roles');
	return mongoose.model('PlatformRole',schema);
};
module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		name: String,
		nickname: String,
		description: String,
		grant: {},
		createBy: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Account',
			}
		}
		// app: String,
		// status: {
		// 	type: String,
		// 	enum: {
		// 		values: '有效|无效'.split('|'),
		// 		message: 'enum validator failed for path {PATH} with value {VALUE}',
		// 	}
		// }
	});

	schema.set('collection', 'platform.roles');
	return mongoose.model('PlatformRole', schema);
};
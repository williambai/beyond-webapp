var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	nickname: {
		type: String,
	},
	description: String,
	route: String,
	// app: [],
	status: {
		type: String,
		enum: {
			values: '有效|无效'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	}
});

schema.set('collection', 'platform.features');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('PlatformFeature', schema);
};
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	nickname: String,
	description: String,
	grant: {},
	creator: {
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

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('PlatformRole', schema);
};
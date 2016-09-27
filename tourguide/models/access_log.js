var mongoose = require('mongoose');
var connection = mongoose;

var schema = new mongoose.Schema({
		app: {
			id: String,
			name: String,
		},
		member: {
			id: String,
			name: String,
			username: String,
		},
		user: {
			id: String,
			name: String,
			mobile: String,
			email: String,
		},
		api: {
			name: String,
			path: String,
			query: String,
		},
		status: String,
	});

schema.set('collection','logs');


module.exports = exports = function(conn) {
	connection = conn || mongoose;
	return connection.model('Log', schema);
};

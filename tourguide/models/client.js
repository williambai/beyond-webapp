var mongoose = require('mongoose');
var connection = mongoose;

var schema = new mongoose.Schema({
		name: String,
		description: String,
		cid: String, //** 客户端id
		key: String,
		secret: String,
		application: {
			id: String,
			aid: String,
			name: String,
		},

	});

schema.set('collection','clients');

module.exports = exports = function(conn) {
	connection = conn || mongoose;
	return connection.model('Client', schema);
};

var mongoose = require('mongoose');
var connection = mongoose;

var schema = new mongoose.Schema({
	});

schema.set('collection','roles');

module.exports = exports = function(conn) {
	connection = conn || mongoose;
	return connection.model('Role', schema);
};

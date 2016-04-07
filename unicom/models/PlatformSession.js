var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	_id: String,
	session: String,
	expires: Date,
});

schema.set('collection', 'sessions');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('PlatformSession', schema);
};
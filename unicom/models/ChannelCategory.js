var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	description: String,
	features: []
});

schema.set('collection', 'channel.categories');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('ChannelCategory', schema);
};
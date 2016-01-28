module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		features: []
	});

	schema.set('collection','channel.categories');
	return mongoose.model('ChannelCategory',schema);
};
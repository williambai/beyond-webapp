module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		nickname: {
			type: String,
			unique: true,
		},
	});

	schema.set('collection','channel.categories');
	return mongoose.model('ChannelCategory',schema);
};
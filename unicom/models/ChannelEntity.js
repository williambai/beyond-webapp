module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		nickname: {
			type: String,
			unique: true,
		},
		category: String,
		department: String,
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','channel.entities');
	return mongoose.model('ChannelEntity',schema);
};
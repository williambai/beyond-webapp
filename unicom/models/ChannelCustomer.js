module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		mobile: {
			type: String,
			unique: true,
		},
		department: String,
		category: String,
		channel: String,
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','channel.customers');
	return mongoose.model('ChannelCustomer',schema);
};
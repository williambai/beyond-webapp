module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		nickname: {
			type: String,
			unique: true
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ChannelDepartment',
		}
	});

	schema.set('collection','channel.departments');
	return mongoose.model('ChannelDepartment',schema);
};
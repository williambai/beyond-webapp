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

	schema.set('collection','channels');
	return mongoose.model('Channel',schema);
};
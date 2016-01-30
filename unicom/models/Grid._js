module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		nickname: {
			type: String,
		},
		description: String,
		department: {
			id: String,//mongoose.Schema.Types.ObjectId,
			name: String,
			path: String,
		}
	});

	schema.set('collection','grids');
	return mongoose.model('Grid',schema);
};
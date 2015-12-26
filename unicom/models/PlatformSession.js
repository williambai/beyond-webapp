module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		_id: String,
		session: String,
		expires: Date,
	});

	schema.set('collection', 'sessions');
	return mongoose.model('PlatformSession', schema);
};
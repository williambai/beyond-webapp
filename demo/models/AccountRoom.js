module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			_id: mongoose.Schema.ObjectId,//account id
			rooms: [{
				rid: String,
				name: String,
				avatar: String,
				description: String,
			}],
			lastupdatetime: Date
		});

	schema.set('collection','account.rooms');

	return mongoose.model('AccountRoom', schema);
};
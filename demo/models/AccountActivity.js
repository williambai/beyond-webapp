module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			uid: String,//account id
			statuses: [String],
			lastupdatetime: Date
		});

	schema.set('collection', 'account.activities');

	return mongoose.model('AccountActivity', schema);
};
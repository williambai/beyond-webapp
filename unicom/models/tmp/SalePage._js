module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		nickname: String,
		url: String,
		saleid: String,
		views: Number,
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','sale.pages');
	return mongoose.model('SalePage',schema);
};
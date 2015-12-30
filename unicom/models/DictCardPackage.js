module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		goods: {
			name: String,
			nickname: String,
			sourceId: String,
		},
		name: String,
		nickname: String,
		description: String,
		classification: String,
		category: String,
		price: Number,
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
	});

	schema.set('collection','dict.card.package');
	return mongoose.model('DictCardPackage',schema);
};
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		category: String,
		price: Number,
		unit: String,
		quantity: Number,
		foreigner: String,//foreign key
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
	});

	schema.set('collection','goods');
	return mongoose.model('Goods',schema);
};
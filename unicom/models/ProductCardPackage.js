module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		category: String,
		classification: String,
		cardType: [{
			type: String,
			enum: {
				values: 'AAAAA|AAAA|ABCDE|ABCD|AAA|AABB|ABAB|ABC|AA|普通号码'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		}],
		cardPrice: {
			type: Number,
			default: 0
		},
		price: Number,
		unit: String,
		quantity: Number,
		goods: {
			id: String,
			name: String,
		},
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
	});

	schema.set('collection','product.card.packages');
	return mongoose.model('ProductCardPackage',schema);
};
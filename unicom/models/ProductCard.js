/**
 * 号卡库存
 * 按分类(category)，对应产品的SKU
 */
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		// description: String,
		category: {
			type: String,
			enum: {
				values: 'AAAAA|AAAA|ABCDE|ABCD|AAA|AABB|ABAB|ABC|AA|普通号码'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		price: Number,
		unit: String,
		// quantity: Number,
		// goods:{
		// 	id: String,
		// 	name: String,
		// },
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			},
			default: '有效'
		},
		creator:{
			id: String,
			name: String,
		},
	});

	schema.set('collection','product.cards');
	return mongoose.model('ProductCard',schema);
};
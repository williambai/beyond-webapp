module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		category: String,
		price: Number,
		unit: String,
		quantity: Number,
		months: Number,
		pre_pay: Number,
		online_return: Number,
		month_fee: Number,
		month_return: Number,
		coupon: String,
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

	schema.set('collection','product.phone.packages');
	return mongoose.model('ProductPhonePackage',schema);
};
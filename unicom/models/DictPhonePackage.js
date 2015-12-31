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
		category: String,
		months: Number,
		price: Number,
		pre_pay: Number,
		online_return: Number,
		month_return: Number,
		coupon: String,
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
	});

	schema.set('collection','dict.phone.package');
	return mongoose.model('DictPhonePackage',schema);
};
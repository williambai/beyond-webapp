module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		thumbnail_url: String,
		price: Number,
		quantity: Number,
		uptime: String,
		hot: Number,
		addons: String,
		starttime: Date,
		endtime: Date,
		display_sort: Number,
		packages: [{
			name: String,
			description: String,
			category: String,
			price: Number,
			unit: String,
			quantity: Number,
			// months: Number,
			// pre_pay: Number,
			// online_return: Number,
			// month_fee: Number,
			// month_return: Number,
			// coupon: String,
			goods: {
				id: String,
				name: String,
			},
		}],//有效套餐
		params: {},//手机参数
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

	schema.set('collection','product.phones');
	return mongoose.model('ProductPhone',schema);
};
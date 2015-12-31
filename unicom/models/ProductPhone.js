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
			id: mongoose.Schema.Types.ObjectId,
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
		}],//有效套餐
		params: {},//手机参数
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
	});

	schema.set('collection','product.phone.package');
	return mongoose.model('ProductPhonePackage',schema);
};
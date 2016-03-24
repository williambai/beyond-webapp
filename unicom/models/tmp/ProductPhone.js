/**
 * 终端商品
 * 每个终端商品对应多个内嵌packages, 每个package对应一个产品(goods._id)
 */
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		category: String,
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
			months: Number,
			pre_pay: Number,
			online_return: Number,
			month_fee: Number,
			month_return: Number,
			coupon: String,
			goods: {
				id: String,//** 产品编码(goods.barcode)
				name: String, //** 产品名称(goods.name)
			},
			bonus: {
				income: Number,//** 佣金收入
				times: Number, //** 佣金分几次兑现
				points: Number,//** 积分
			},
			status: {
				type: String,
				enum: {
					values: '有效|无效'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			},
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

	schema.set('collection','product.phones');
	return mongoose.model('ProductPhone',schema);
};
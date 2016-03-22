/**
 * 简单商品 
 * 每个商品与产品(goods._id)一对一
 */
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		category: String,
		thumbnail_url: String,
		url: String,
		price: Number,
		unit: String,
		quantity: Number,
		starttime: String,
		endtime: String,
		display_sort: Number,
		tags: [],
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
	});

	schema.set('collection','product.directs');
	return mongoose.model('ProductDirect',schema);
};
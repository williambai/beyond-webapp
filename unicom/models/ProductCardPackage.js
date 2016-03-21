/**
 * 号卡商品
 * 每个商品对应一个产品，但每个产品下有多个SKU(ProductCard)
 */
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

	schema.set('collection','product.card.packages');
	return mongoose.model('ProductCardPackage',schema);
};
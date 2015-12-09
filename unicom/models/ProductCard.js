module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		cardNo: String,
		goodsId: String,
		goodsName: String,
		cardRange: {
			type: String,
			enum: {
				values: '186|185|156|131|130|155|132'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		category: {
			type: String,
			enum: {
				values: 'AAAAA|AAAA|ABCDE|ABCD|AAA|AABB|ABAB|ABC|AA|普通号码'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		price: Number,
		status: {
			code: {
				type: Number,
				enum: {
					values: '-1|0|1'.split('|'), //1: 已用，0：未用；-1：删除
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			},
			message: {
				type: String,
				enum: {
					values: '已用|未用|删除'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			}
		},
		createBy:{
			id: String,
			name: String,
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','product.cards');
	return mongoose.model('ProductCard',schema);
};
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		items: [
			{
				id: mongoose.Schema.Types.ObjectId,
				name: String,
				price: Number,
				quantity: Number,
				category: String,
			}
		],
		total: Number,
		place: {
			name: String,
		},
		dispatch: {
			type: String,
			enum: {
				values: '自提|物流'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		customer: {
			name: String,
			idNo: String,
			idType: String,
			idAddress: String,
			address: String,
			mobile: String,
			location: String,
		},
		createBy: {
			id: mongoose.Schema.Types.ObjectId,
		},
		status: {
			code: {
				type: Number,
				enum: {
					values: '0|1|2|3|4|-1|-2|-3'.split('|'), 
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			},
			message: {
				type: String,
				enum: {
					values: '新建|已确认|已配送|完成|用户取消|系统取消|其他原因'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			}
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','order.cards');
	return mongoose.model('OrderCard',schema);
};
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		customer: {
			name: String,
			mobile: String,
		},
		product: {
			id: String,
			name: String,
			category: String,
		},
		status: {
			code: {
				type: Number,
				enum: {
					values: '0|1'.split('|'), //1: 有效，0：无效
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			},
			message: {
				type: String,
				enum: {
					values: '有效|无效'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			}
		},
		createBy: {
			id: mongoose.Schema.Types.ObjectId,
			name: String,
			mobile: String,
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','wo.orders');
	return mongoose.model('WoOrders',schema);
};
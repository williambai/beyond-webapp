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
		goods: {
			id: mongoose.Schema.Types.ObjectId,
			name: String,
			nickname: String,
			sourceId: String,
		},
		status: {
			type: String,
			enum: {
				values: '新建|已确认|已配送|完成|用户取消|系统取消|其他原因'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
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
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		category: {
			type: String,
			enum: {
				values: '数据订购|传统增值|内容推荐|活动推荐|号卡|终端'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		// goods: {
		// 	id: mongoose.Schema.Types.ObjectId,
		// 	name: String,
		// 	nickname: String,
		// 	sourceId: String,
		// },
		items: [
			{
				id: mongoose.Schema.Types.ObjectId,
				model: String,
				name: String,
				price: Number,
				quantity: Number,
				category: String,
				source: {},//goods
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
			id: String,
			name: String,
		},
		customerInfo: {
			name: String,
			idNo: String,
			idType: String,
			idAddress: String,
			address: String,
			phone: String,
			location: String,
		},
		createBy: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Account',
			},
			username: String,
			mobile: String,
			avatar: String,
		},
		status: {
			type: String,
			enum: {
				values: '新建|已确认|已配送|完成|用户取消|系统取消|其他原因'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		histories: [],
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','orders');
	return mongoose.model('Order',schema);
};
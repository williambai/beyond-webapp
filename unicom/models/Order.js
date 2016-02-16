module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		customer: {
			name: String,
			id: String,
		},
		name: String,
		description: String,
		category: {
			type: String,
			enum: {
				values: '数据订购|传统增值|内容推荐|活动推荐|号卡|终端|金币兑换'.split('|'),
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
				category: String,
				price: Number,
				quantity: Number,
				source: {},//goods
			}
		],
		total: Number,
		place: {
			name: String,
		},
		dispatch: {
			method: {
				type: String,
				enum: {
					values: '自提|物流'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			},
			phone: String,
			address: String,
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
		bonus: {
			income: Number,
			times: Number,
			points: {
				type: Number,
				default: 0
			},
			cash: {
				type: Number,
				default: 0
			},
			cashStatus: {
				type: String,
				enum: {
					values: '冻结|一次解冻|二次解冻|三次解冻|全部解冻'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				},
				default: '冻结',
			},			
		},
		status: {
			type: String,
			enum: {
				values: '新建|已确认|已配送|完成|用户取消|后台取消|其他原因'.split('|'),
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
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		product: {
			id: String,
			name: String,
			description: String,
			category: String,
			price: Number,
			quantity: {
				type: Number,
				default: 1
			},
		},
		customer: {
			id: String,
			name: String,
			phone: String,
			email: String,
			age: Number,
			sex: {
				type: String,
				enum: {
					values: '保密|男|女'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			},
			zipcode: String,
			address: String,
			attach: String,//留言
		},
		seller: {//** 客户经理
			id: String, //** Account._id
			email: String, //** 用户手机号
			username: String, 
		},
		status: {
			type: String,
			enum: {
				values: '有效|无效|已处理'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			},
			default: '有效',
		},
		lastupdatetime: {
			type: Date,
			default: Date.now,
		},
	});

	schema.set('collection','sale.leads');
	return mongoose.model('SaleLead',schema);
};
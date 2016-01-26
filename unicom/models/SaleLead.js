module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		category: String,
		price: Number,
		quantity: {
			type: Number,
			default: 1
		},
		goods:{
			id: String,
			model: String,
		},
		customer: {
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
		sale: {//** 客户经理
			id: String,
			name: String,
		},
		status: {
			type: String,
			enum: {
				values: '有效|无效|已处理'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			},
			default: '有效',
		},
	});

	schema.set('collection','sale.leads');
	return mongoose.model('SaleLead',schema);
};
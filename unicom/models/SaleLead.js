module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		sale: {
			id: String,
			name: String,
		},
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
		product: {
			name: String,
			category: String,
			quantity: String,
			id: String,
			model: String,
		},
		info: String,//留言
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
	});

	schema.set('collection','sale.leads');
	return mongoose.model('SaleLead',schema);
};
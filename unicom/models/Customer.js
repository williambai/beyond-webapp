module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		mobile: {
			type: String,
			unique: true,
		},
		department: [String],
		account_name: String,//** 客户经理
		account_mobile: String, //** 客户经理ID
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
	});

	schema.set('collection','customers');
	return mongoose.model('Customer',schema);
};
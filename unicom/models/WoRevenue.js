module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		uid: mongoose.Schema.Types.ObjectId,
		username: String,
		product: {
			id: String,
			name: String,
			category: String,
		},
		income: Number,
		cash: Number,
		histories: [],
		status: {
			code: {
				type: Number,
				enum: {
					values: '0|1|2|3|-1'.split('|'), 
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			},
			message: {
				type: String,
				enum: {
					values: '冻结|一次解冻|二次解冻|三次解冻|作废'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			}
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','wo.revenues');
	return mongoose.model('WoRevenues',schema);
};
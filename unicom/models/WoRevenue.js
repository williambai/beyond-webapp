module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		uid: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account'
		},
		source: {
			id: mongoose.Schema.Types.ObjectId,
			model: String,
			name: String,
			category: String,
			reason: String,			
		},
		username: String,
		mobile: String,
		income: Number,
		cash: Number,
		cashMaxTimes: Number,
		cashTimes: Number,
		nextCashTime: Date,
		cashStrategy: [],
		status: {
			type: String,
			enum: {
				values: '冻结|一次解冻|二次解冻|三次解冻|作废'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		histories: [],
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','wo.revenues');
	return mongoose.model('WoRevenues',schema);
};
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		uid: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account'
		},
		mobile: String,
		username: String,
		category: String,
		referrer: {
			// id: mongoose.Schema.Types.ObjectId,
			// model: String,
			// name: String,
		},
		income: Number,
		cash: Number,
		cashStatus: {
			type: String,
			enum: {
				values: '冻结|一次解冻|二次解冻|三次解冻|全部解冻'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		reason: String,	
		creator: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Account',
			},
			username: String,
			avatar: String,
		},
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		histories: [],
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','revenues');
	return mongoose.model('Revenues',schema);
};
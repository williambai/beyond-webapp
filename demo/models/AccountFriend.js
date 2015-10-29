module.exports = exports = function(app, mongoose) {

	var schemaOptions = {
		toJSON: {
			virtuals: true
		},
		toObject: {
			virtuals: true
		}
	};

	var schema = new mongoose.Schema({
		uid: String,
		fid: String, //friend id
		username: String,
		realname: String, //original username
		avatar: String,
		status: {
			code: {
				type: Number,
				enum: [0, 1, 2], //0: '是邀请方'; 1: '是受邀方'; 2: '是好友' 
			},
			message: String
		},
		histories: [],
		lastupdatetime: Date
	}, schemaOptions);

	schema.virtual('online').get(function() {
		return app.isAccountOnline(this.get('fid'));
	});

	schema.set('collection', 'account.friends');

	return mongoose.model('AccountFriend', schema);
};
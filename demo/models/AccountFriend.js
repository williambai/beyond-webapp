module.exports = exports = function(app,mongoose){

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
			fid: String,//friend id
			username: String,
			avatar: String,
			status: {
				code: Number,
				message: String
			},
			histories: [],
			lastupdatetime: Date
		},schemaOptions);

	schema.virtual('online').get(function(){
		return app.isAccountOnline(this.get('fid'));
	});

	schema.set('collection','account.friends');

	return mongoose.model('AccountFriend', schema);
};
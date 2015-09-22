module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			uid: String,
			from: [{
				uid: String,
				username: String,
				avatar: String,
				type: String,
				content: {},
				actions: [{
					method: String,
					label: String,
					enable: Boolean,
					script: String
				}],
				lastupdatetime: Date
			}],
			status: {
				code: Number,
				message: String
			},
			lastupdatetime: Date
		});

	schema.set('collection','account.notifications');

	return mongoose.model('Notification', schema);
};
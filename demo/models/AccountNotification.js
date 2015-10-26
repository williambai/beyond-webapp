module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			uid: String,
			createby: {
				uid: String,
				username: String,
				avatar: String,
			},
			type: String,
			content: {
				subject: String,
				body: String,
			},
			actions: [{
				name: String,
				method: String,
				label: String,
				enable: Boolean,
				url: String,
				script: String
			}],
			status: {
				code: Number,
				message: String
			},
			lastupdatetime: {type: Date, default: Date.now}
		});

	schema.set('collection','account.notifications');

	return mongoose.model('Notification', schema);
};
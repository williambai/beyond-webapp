module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		openid: String,
		name: String,
		avatar: String,
		creator: {
			id: String,
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','platform.wechat.customers');
	return mongoose.model('PlatformWeChatCustomer',schema);
};
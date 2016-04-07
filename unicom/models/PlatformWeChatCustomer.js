var mongoose = require('mongoose');

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

schema.set('collection', 'platform.wechat.customers');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('PlatformWeChatCustomer', schema);
};
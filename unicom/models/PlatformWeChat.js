var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	description: String,
	appname: String, //微信号
	appid: String,
	appsecret: String,
	token: {
		access_token: String,
		expired: Date
	},
	menus: [{
		name: String,
		description: String,
		category: {
			type: String,
			enum: {
				values: 'click|view'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		target: String,
		path: String,
		display_sort: {
			type: Number,
			default: 0
		},
		parent: String, //parent menu id
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		}
	}],
	status: {
		type: String,
		enum: {
			values: '有效|无效'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	}
});

schema.set('collection', 'platform.wechats');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('PlatformWeChat', schema);
};
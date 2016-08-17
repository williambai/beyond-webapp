var mongoose = require('mongoose');
var connection = mongoose;

var schema = new mongoose.Schema({

	key: String, //** client key
	secret: String, //** client secret
	callback_url: String, //** 回调Url
	cbss_accounts: [{
		login_name: String, //** 登录名
	}],
	status: { //** 订单状态
		type: String,
		enum: {
			values: '有效|无效'.split('|'),
			message: ' {PATH} 无效的值 {VALUE}',
		}
	},
});

schema.set('collection', 'clients');

// schema.statics.findOne = function(options, done){

// };

exports = module.exports = function(conn){
	connection = conn || mongoose;
	return connection.model('Client',schema);
}
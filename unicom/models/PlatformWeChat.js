var request = require('request');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	description: String,
	appname: String, //微信号
	appid: String,
	appsecret: String,
	apptoken: String, //** mp接入验证token
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

	//** 更新access token，可能需要定期任务
	schema.statics.updateAccessToken = function(options, done) {
		if(arguments.length < 1) throw new Error('参数不足：function(options,done)');
		if(options instanceof Function) {
			done = options;
			options = {};
		}
		var PlatformWeChat = connection.model('PlatformWeChat');
		//** 返回最后一个
		var access_token;
		PlatformWeChat
			.find({})
			.exec(function(err, docs) {
				if (err || !docs) return done(err);
				if(!docs) return done(null);
				var _updateAccessToken = function(docs) {
					var doc = docs.pop();
					if (!doc) return done(null,access_token);
					request({
						url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + doc.appid + '&secret=' + doc.appsecret,
						method: 'GET',
						json: true,
					}, function(err, response, body) {
						if (err || !body) return done(err);
						// console.log('access_token: ' + JSON.stringify(body));
						access_token = body;
						var token = {
							access_token: body.access_token || '',
							expired: new Date(Date.now() + 7000000),
						};
						PlatformWeChat
							.findByIdAndUpdate(doc._id, {
								$set: {
									'token': token
								}
							}, {
								'upsert': false,
								'new': true
							}, function(err, result) {
								if (err) return done(err);
								_updateAccessToken(docs);
							});
					});
				};
				_updateAccessToken(docs);
			});
	};
	return connection.model('PlatformWeChat', schema);
};

var request = require('request');
var wechat = {};

wechat.updateAccessToken = function(models,options, done) {
	models
		.PlatformWeChat
		.find({})
		.exec(function(err, docs) {
			if (err || !docs) return done(err);
			if(!docs) return done(null);
			var _updateAccessToken = function(docs) {
				var doc = docs.pop();
				if (!doc) return done(null);
				request({
					url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + doc.appid + '&secret=' + doc.appsecret,
					method: 'GET',
					json: true,
				}, function(err, response, body) {
					if (err || !body) return done(err);
					// console.log('access_token: ' + body.access_token);
					var token = {
						access_token: body.access_token || '',
						expired: new Date(Date.now() + 7000000),
					};
					models
						.PlatformWeChat
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
exports = module.exports = wechat;
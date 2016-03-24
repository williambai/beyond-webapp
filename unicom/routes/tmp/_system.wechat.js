var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var request = require('request');

exports = module.exports = function(app, models) {

	var updateAccessToken = function(req,res){
		models
			.PlatformWeChat
			.find({})
			.exec(function(err,docs){
				if(err || !docs) return res.send(err);
				var _updateAccessToken = function(docs, done){
					var doc = docs.pop();
					if(!doc) return done();
					request({
						url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + doc.appid + '&secret=' + doc.appsecret,
						method: 'GET',
						json: true,
					}, function(err, response, body) {
						if (err || !body) return res.send(err);
						logger.debug('access_token: ' + body.access_token);
						var token = {
							access_token: body.access_token || '',
							expired: new Date(Date.now() + 7000000),
						};
						models
							.PlatformWeChat
							.findByIdAndUpdate(doc._id,{
								$set: {
									'token': token
								}
							},{
								'upsert': false,
								'new': true
							},function(err,result){
								if(err) return res.send(err);
								_updateAccessToken(docs,done);
							});
					});
				};
				_updateAccessToken(docs, function(){
					res.send({});
				});
			});
		};

	/**
	 * 处理订单
	 * system/wechat/process
	 */
	app.post('/system/wechat/access_token', updateAccessToken);

}
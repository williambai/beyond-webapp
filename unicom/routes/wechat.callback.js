var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:wechat.callback');
logger.setLevel('DEBUG');

exports = module.exports = function(app, models) {
	var token = 'tWEHVpn8PyGoQdjVJ0k8vBaJVT66hW6P';
	var wechat = require('wechat');
	var _ = require('underscore');

	var wechatMiddleware = function(req, res, next) {
		// logger.debug('wechat request body: ' + req.body);
		var appid = 'wx0179baae6973c5e6';

		wechat({
			token: token,
			appid: appid,
			encodingAESKey: ''
		}, function(req, res) {
			next();
		})(req, res);
	};

	var handler = function(req, res) {
		var message = req.weixin || {};
		var MsgType = message.MsgType || '';
		logger.debug('wechat request message: ' + JSON.stringify(message));
		switch (MsgType) {
			case 'event':
				var eventType = message.Event || '';
				switch(eventType){
					case 'SCAN':
						models
							.PlatformWeChatQrcode
							.findOneAndUpdate({
								'ticket': message.Ticket
							}, {
								$set: {
									'openid': message.FromUserName
								}
							},{
								'upsert': false,
								'new': true,
							},function(err,doc){
								if(err || !doc){
									logger.error('qrcode SCAN update error.');
									return res.reply();
								} 
								logger.debug('set openid: ' + doc.openid);
								var eventKey = message.EventKey || '';
								return res.reply();
							});
						return;
					case 'subscribe':
						break;
					case 'unsubscribe':
						break;
					default:
						break;	
				}
				break;
			default:
				break;
		}
		res.reply();
	};
	/**
	 * router outline
	 */

	/**
	 * get/post wechat/callback
	 * action:
	 */
	app.post('/wechat/callback', wechatMiddleware, handler);

	app.get('/wechat/callback', wechatMiddleware);
};
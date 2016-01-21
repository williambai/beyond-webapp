var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:wechat.qrcode');
logger.setLevel('DEBUG');

exports = module.exports = function(app, models) {
	var request = require('request');
	var token = 'tWEHVpn8PyGoQdjVJ0k8vBaJVT66hW6P';
	var wechat = require('wechat');
	var _ = require('underscore');

	var add = function(req, res) {
		var scene_id = req.params.sceneid;
		var appid = 'wx0179baae6973c5e6';
		var appsecret = 'd4624c36b6795d1d99dcf0547af5443d';
		request({
			url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecret,
			method: 'GET',
			json: true,
		}, function(err, response, body) {
			if (err || !body) return res.send(err);
			logger.debug('access_token: ' + body.access_token);
			request({
				url: 'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=' + body.access_token,
				method: 'POST',
				json: true,
				body: {
					expire_seconds: 7200,
					action_name: 'QR_SCENE',
					action_info: {
						scene: {
							scene_id: scene_id
						}
					}
				}
			}, function(err, response, body) {
				if (err || !body) return res.send(err);
				logger.debug(body);
				logger.debug('ticket: ' + body.ticket);
				models
					.PlatformWeChatQrcode
					.create({
						ticket: body.ticket,
						sceneid: scene_id,
						userid: req.session.accountId || '',
					}, function(err, doc) {
						if (err) return res.send(err);
						res.send({
							ticket: body.ticket,
							src: 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + encodeURIComponent(body.ticket)
						});
						// res.redirect('https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + encodeURIComponent(body.ticket));
					});
			});

		});

	};

	var getOne = function(req, res) {
		var ticket = req.params.ticket;
		models
			.PlatformWeChatQrcode
			.findOne({
				ticket: ticket
			})
			.exec(function(err, doc) {
				if (err || !doc) return res.send(err);
				if (!doc.openid) return res.send({
					success: false
				});
				var sceneid = doc.sceneid;
				switch (sceneid) {
					case 100001: //wechat openid bind to userid
						models
							.Account
							.findByIdAndUpdate(req.session.accountId, {
								$set: {
									'openid': doc.openid
								}
							}, {
								'upsert': false,
								'new': true
							}, function(err, account) {
								if (err) return res.send({
									success: false
								});
								logger.debug('qrcode update account openid: ' + account.openid);
								res.send({
									success: true
								});
							});
						return;
					case 100002: //wechat openid login
						req.session.openid = doc.openid;
						res.send({
							success: true
						});
						return;
					default:
						break;
				}
				res.send({
					success: false
				});
			});
	};

	/**
	 * router outline
	 */
	/**
	 * add platform/wechat/qrcode
	 * action:
	 *     
	 */
	app.post('/platform/wechat/qrcode/:sceneid', add);
	/**
	 * get platform/wechat/qrcode
	 */
	app.get('/platform/wechat/qrcode/:ticket', getOne);

};
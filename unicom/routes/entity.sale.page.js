var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:sale.page');
logger.setLevel('DEBUG');

exports = module.exports = function(app, models) {
	var sign = require('../libs/wechat/sign');
	var request = require('request');

	var pageData = function(req, res) {
		var saleid = req.params.uid;
		var appid = 'wx0179baae6973c5e6';
		models
			.PlatformWeChat
			.findOne({
				appid: appid
			})
			.exec(function(err, doc) {
				if (err || !doc) return res.send(err);
				var access_token = (doc.token instanceof Object) ? doc.token.access_token : undefined;
				if (!access_token) return res.send({
					code: 404100,
					errmsg: 'access_token is not ready.'
				});
				request({
					url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi',
					method: 'GET',
					json: true,
				}, function(err, response, body) {
					if (err || !body) return res.send(err);
					logger.debug(body);
					logger.debug('ticket: ' + body.ticket);
					if (!body.ticket) return res.send({
						code: 40420,
						errmsg: 'ticket is not ready.'
					});
					var url = req.protocol + '://' + req.headers['host'] + req.originalUrl;
					var imgUrl = req.protocol + '://' + req.headers['host'] + '/images/avatar.jpg';
					logger.debug(url);
					var config = sign(body.ticket, url);
					config.appid = appid;
					var shareMessage = {
						title: '数据业务推荐', // 分享标题
						desc: '选择数据业务', // 分享描述
						link: url, // 分享链接
						imgUrl: imgUrl, // 分享图标
						type: 'link', // 分享类型,music、video或link，不填默认为link
						dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					};
					logger.debug(config);
					res.set('Content-Type', 'text/html');
					res.render('data', {
						config: config,
						shareMessage: shareMessage
					});
				});
			});
	};

	app.get('/sale/page/data/:uid', pageData);
};
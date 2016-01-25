var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:sale.page');
logger.setLevel('DEBUG');

exports = module.exports = function(app, models) {
	var async = require('async');
	var sign = require('../libs/wechat/sign');
	var request = require('request');

	var _updateWeChatCustomer = function(req, res, next) {
		var appid = req.params.appid || 'wx0179baae6973c5e6';
		async.waterfall([
			function getWeChatOpenId(callback) {
				models
					.PlatformWeChat
					.findOne({
						appid: appid
					})
					.exec(function(err, doc) {
						if (err) return callback(err);
						if (!doc) return callback({
							code: 404200,
							errmsg: 'wechat appid is not exist.'
						});
						var appsecret = doc.appsecret || 'd4624c36b6795d1d99dcf0547af5443d';
						if(!req.query.code){
							//** call wechat oauth2
							logger.debug('wechat oauth2 is called.');
							var redirect_uri = req.protocol + '://' + req.headers['host'] + req.originalUrl;
							var state = Date.now();
							return res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(redirect_uri) + '&response_type=code&scope=snsapi_base&state=' + state + '#wechat_redirect');
						}
						logger.debug('0. oauth2/authorize return url: ' + req.originalUrl);
						logger.debug('1. oauth2/authorize return query: ' + JSON.stringify(req.query));
						var code = req.query.code;
						request({
							url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=' + appsecret + '&code=' + code + '&grant_type=authorization_code',
							method: 'GET',
							json: true,
						}, function(err, response, body) {
							if (err) return callback(err);
							if(!body) return callback({code: 404300,errmsg: 'openid is not ready.'});
							logger.debug('2. oauth2 access_token return object: ' + JSON.stringify(body));
							callback(null,body);
						});
					});
			},
			function createWeChatCustomer(customer,callback) {
				var openid = customer.openid;
				var userid = req.params.uid;
				var doc_customer = {
					openid: openid,
					creator: {
						id: userid
					}
				};
				models
					.PlatformWeChatCustomer
					.findOne({
						openid: openid,
					})
					.exec(function(err,doc){
						if(err) return callback(err);
						if(!doc) {
							models
								.PlatformWeChatCustomer
								.create(doc_customer, function(err,doc){
									if(err) return callback(err);
									callback(null,doc);
								});
						}else{
							callback();
						}
					});
			}
		], function(err, result) {
			if (err) res.send(err);
			next();
		});
	};

	var pageData = function(req, res) {
		var productid = req.params.pid;
		var saleid = req.params.uid;
		var appid = req.params.appid || 'wx0179baae6973c5e6';
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
					var link = req.protocol + '://' + req.headers['host'] + req.path;
					var imgUrl = req.protocol + '://' + req.headers['host'] + '/images/avatar.jpg';
					logger.debug(url);
					var config = sign(body.ticket, url);
					config.appid = appid;
					var shareMessage = {
						title: '数据业务推荐', // 分享标题
						desc: '选择数据业务', // 分享描述
						link: link, // 分享链接
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

	app.get('/sale/page/data/:appid/:pid/:uid', _updateWeChatCustomer, pageData);
};
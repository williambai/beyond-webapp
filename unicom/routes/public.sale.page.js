var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

exports = module.exports = function(app, models) {
	var _ = require('underscore');
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

	var _prepareWeChatJsTicket = function(req, res, next) {
		// var productid = req.params.pid;
		// var saleid = req.params.uid;
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
					logger.debug(url);
					var config = sign(body.ticket, url);
					config.appid = appid;
					logger.debug(config);
					res.locals.ticket = body.ticket;
					res.locals.config = config;
					next();
				});
			});
	};

	var snsShareWeixinPage = function(req,res){
		var appid = req.params.appid;
		var pid = req.params.pid;
		var uid = req.params.uid;
		models
			.ProductDirect
			.findById(pid)
			.exec(function(err,doc){
				if (err || !doc) return res.send(err);
				var link = req.protocol + '://' + req.headers['host'] + '/sns/web/sale/' + pid +'/' + uid;
				var imgUrl = req.protocol + '://' + req.headers['host'] + doc.thumbnail_url;
				var shareMessage = {
					title: doc.name, // 分享标题
					desc: doc.description, // 分享描述
					link: link, // 分享链接
					imgUrl: imgUrl, // 分享图标
					type: 'link', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				};
				res.set('Content-Type', 'text/html');
				res.render('sns_share_weixin', {
					params: {
						appid: appid,
						pid: pid,
						uid: uid,
					},
					product: {
						name: doc.name,
						description: doc.description,
						thumbnail_url: doc.thumbnail_url,
						category: doc.category,
						price: doc.price,
						unit: doc.unit,
						tags: doc.tags,
					},
					config: res.locals.config || {},
					shareMessage: shareMessage || {}
				});
			});
	};

	var snsShareWeixinPageDev = function(req,res){
		res.set('Content-Type', 'text/html');
		res.render('sns_share_weixin', {
			params: {
				pid: '566e17d72ad3a36d0c5b614a',
				uid: 'saleid',
			},
			product: {
				name: 'product.name',
				description: 'product.description',
				category: 'product.category',
				thumbnail_url: "/images/product_2.png",
				price: '10.00',
				unit: '元',
				tags: "3G省内,半年包,40元1.5G,立即生效"
			},
			config: {},
			shareMessage: {}
		});
	};

	/**
	 * 添加销售线索
	 * @param {[type]} req [description]
	 * @param {[type]} res [description]
	 */
	var addSaleLead = function(req,res){
		var pid = req.params.pid;
		var uid = req.params.uid;
		var customer = req.body.customer || {};
		models.Account
			.findById(uid, function(err,account){
				if(err || !account) return res.send(err);
				models
					.ProductDirect
					.findById(pid)
					.exec(function(err,product){
						if(err || !product) return res.send(err);
						var doc = {
							product: product,
							customer: customer,
							seller: account.toJSON(),
						};
						doc.seller.id = account._id;
						models
							.SaleLead
							.create(doc, function(err){
								if(err) return res.send(err);
								res.redirect('/sns/web/sale/success');
							});
					});

			});

	};

	var saleSuccessPage = function(req,res){
		res.set('Content-Type', 'text/html');
		res.render('sale_success');
	};

	var snsSaleWebPage = function(req,res){
		var pid = req.params.pid;
		var uid = req.params.uid;
		models
			.ProductDirect
			.findById(pid)
			.exec(function(err,doc){
				if (err || !doc) return res.send(err);
				res.set('Content-Type', 'text/html');
				res.render('sns_sale_web', {
					params: {
						pid: pid,
						uid: uid,
					},
					product: {
						name: doc.name,
						description: doc.description,
						thumbnail_url: doc.thumbnail_url,
						category: doc.category,
						price: doc.price,
						unit: doc.unit,
						tags: doc.tags,
					},
				});
			});
	};

	//** sns开发weixin share界面使用
	app.get('/dev/sns/weixin/share/pid/uid',snsShareWeixinPageDev);
	//** sns客户web访问页面
	app.get('/sns/web/sale/:pid/:uid', snsSaleWebPage);
	//** sns客户web提交申请，新增销售线索
	app.post('/sns/web/sale/:pid/:uid', addSaleLead);
	//** sns客户web提交成功显示
	app.get('/sns/web/sale/success', saleSuccessPage);

	//** app在分享至微信界面时调用
	app.get('/sns/weixin/share/:appid/:pid/:uid', _updateWeChatCustomer, _prepareWeChatJsTicket, snsShareWeixinPage);

};
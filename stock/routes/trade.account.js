var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(), __filename));
var cp = require('child_process');
var crypto = require('crypto');

exports = module.exports = function(app, models) {
	//** 配置文件
	var CITIC = require('../config/citic');
	//** captcha图片在casperjs与nodejs之间的文件交换
	var captchaImage = {};

	var autoLogin = function(req, res) {
		//** 账户id
		var id = req.body.id;
		//** 设置captcha图片上传POST回调，由casperjs调用
		var callback_url = req.header('origin') + '/trade/accounts';
		//** 预设希望captcha图片文件的存储路径
		var captcha_file = path.join(__dirname, '../public/_tmp/captcha_' + id + '.png');
		//** 预设希望login页面截图文件的存储路径(调试有用，生产无用)
		var login_file = path.join(__dirname, '../public/_tmp/login_' + id + '.png');
		//** 运行casperjs的相对路径
		casperjs_cwd = path.join(__dirname, '../libs/citic');
		//** 调用casperjs子进程
		var worker = cp.execFile(
			'casperjs', [
				'login.casper.js',
				'--id=' + id,
				'--callback_url=' + callback_url,
				'--captcha_file=' + captcha_file,
				'--login_file=' + login_file,

			], {
				cwd: casperjs_cwd,
			},
			function(err, stdout, stderr) {
				if (err) return logger.error(err);
			});
		logger.debug('casperjs started.');
		res.send({});
	};

	var processCaptchaText = function(req, res) {
		var id = req.body.id;
		models.TradeAccount
			.findById(id)
			.exec(function(err, doc) {
				var captchaText = req.body.plain;
				//** casperjs server(localhost:8084) is waiting for feedback on step 1 forever.
				//** so feeback casperjs server when captcha has been parsed.(step 2)
				//** (step 5)transfer username/password/captcha to casperjs(as webServer)
				var http = require('http');
				var querystring = require('querystring');
				var password = crypto.privateDecrypt(CITIC.privateKey, new Buffer(doc.password, 'base64')).toString();
				// logger.debug(password);
				postData = querystring.stringify({
					action: 'login',
					username: doc.username,
					password: password,
					captcha: captchaText,
				});
				logger.debug(postData)
				var request = http.request({
					hostname: 'localhost',
					port: 8084,
					path: '/',
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': postData.length
					},
				}, function(response) {
					logger.debug('response from casper(action:login): ' + response.statusCode);
				});
				request.on('error', function(err) {
					logger.error('problem with request: ' + err.message);
				});
				request.write(postData);
				request.end();
				res.send({});
			});
	};

	var refreshCookie = function(req, res) {
		models.TradeAccount
			.find({
				'company.name': '中信证券',
				'login': true,
				'status': '有效',
				'lastupdatetime': {
					$lte: (Date.now() - 300000)
				}
			})
			.limit(5)
			.exec(function(err, docs) {
				if (err) return res.send(err);
				if (!docs) return res.send({});
				var _refreshCiticCookie = function(docs) {
					//** process one
					var doc = docs.pop();
					if (!doc) return res.send({});
					var id = doc._id;
					var path = require('path');
					casperjs_cwd = path.join(__dirname, '../libs/citic');
					var worker = require('child_process').execFile(
						'casperjs', [
							'cookie.casper.js',
							'--id=' + id,
							'--cookie=' + JSON.stringify(doc.cookies),
							'--refresh_url=' + 'http://localhost:8091/trade/accounts'
						], {
							cwd: casperjs_cwd,
						},
						function(err, stdout, stderr) {
							if (err) logger.error(err);
							logger.debug('-----refresh citic cookie--------');
							logger.debug(stdout);
							setTimeout(function() {
								_refreshCiticCookie(docs);
							}, 1000);
						});
				};
				_refreshCiticCookie(docs);
			});
	};

	var updateCookie = function(req, res) {
		var id = req.body.id;
		var cookies = [];
		try {
			cookies = JSON.parse(req.body.cookies);
		} catch (e) {};
		models.TradeAccount
			.findByIdAndUpdate(
				id, {
					$set: {
						'login': req.body.success,
						'cookieRaw': req.body.cookies,
						'cookies': cookies,
						'lastupdatetime': Date.now(),
					}
				}, {
					'upsert': false,
					'new': true,
				},
				function(err, doc) {
					if (err) return res.send(err);
					//** (step 6)tell casperjs(as webServer) that cookie is received.
					// var http = require('http');
					// var querystring = require('querystring');
					// postData = querystring.stringify({
					// 	action: 'cookie_received',
					// });
					// var request = http.request({
					// 	hostname: 'localhost',
					// 	port: 8084,
					// 	path: '/',
					// 	method: 'POST',
					// 	headers: {
					// 		'Content-Type': 'application/x-www-form-urlencoded',
					// 		'Content-Length': postData.length
					// 	},
					// }, function(response) {
					// 	logger.debug('response from casper(action:cookie_received): ' + response.statusCode);
					// });
					// request.on('error', function(err) {
					// 	logger.error('problem with request: ' + err.message);
					// });
					// request.write(postData);
					// request.end();
					res.send({});
				});
	};

	var add = function(req, res) {
		var action = req.body.action || '';
		switch (action) {
			case 'login':
				//** (client)call from browser
				//** (step 1)start casperjs to login, transfer id
				autoLogin(req, res);
				break;
				// case 'started': 
				// 	logger.debug('casperjs was started.');
				// 	var id = req.body.id;
				// 	res.send({});
				// 	break;	
			case 'uploadImage':
				//** (client)call from casperjs
				//** (step 2)casperjs uploadImage 
				//** casperjs save captcha image into /_tmp/captcha.png
				//** after that, casperjs server is listening to HOST:PORT(localhost:8084) forever.
				logger.debug(req.body);
				if (req.body.id && req.body.file) {
					captchaImage[req.body.id] = req.body.file;
				}
				break;
			case 'getImage':
				//** (client)call from browser
				//** (step 3)browser getImage which is ready on step 2
				var id = req.body.id;
				if (id && captchaImage[id]) {
					var file = captchaImage[id];
					res.send({
						src: file.slice(file.indexOf('/_tmp')), //'./_tmp/captcha.png'
					});
					captchaImage[id] = false;
				} else {
					res.send({});
				}
				break;
			case 'captchaText':
				//** (client)call from browser
				//** (step 4) recieve browser's feedback captcha text
				processCaptchaText(req, res);
				break;
			case 'updateCookie':
				logger.debug('updateCookie: ' + JSON.stringify(req.body));
				//** (client)call from casperjs
				//** update cookie
				updateCookie(req, res);
				break;
			case 'refreshCookie':
				refreshCookie(req, res);
				break;
			default:
				var doc = req.body;
				if (doc.password) {
					doc.password = crypto.publicEncrypt(CITIC.publicKey, new Buffer(doc.password)).toString('base64');
					// logger.debug(doc.password);
				}
				//** 设置createBy 用户
				doc.createBy = {
					id: req.session.accountId,
					name: req.session.username,
				};
				models.TradeAccount.create(doc, function(err) {
					if (err) return res.send(err);
					res.send({});
				});
				break;
		}
	};

	var remove = function(req, res) {
		var id = req.params.id;
		models.TradeAccount.findByIdAndRemove(id, function(err, doc) {
			if (err) return res.send(err);
			res.send(doc);
		});
	};

	var update = function(req, res) {
		var id = req.params.id;
		var action = req.body.action || '';
		switch (action) {
			default: var set = req.body;
			if (set.password) {
				set.password = crypto.publicEncrypt(CITIC.publicKey, new Buffer(set.password)).toString('base64');
				// logger.debug(set.password);
			}
			models.TradeAccount.findOneAndUpdate({
					_id: id,
					'createBy.id': req.session.accountId
				}, {
					$set: set
				}, {
					'upsert': false,
					'new': true,
				},
				function(err, doc) {
					if (err) return res.send(err);
					res.send(doc);
				}
			);
			break;
		}

	};

	var getOne = function(req, res) {
		var id = req.params.id;
		var action = req.query.action || '';
		switch (action) {
			default: models.TradeAccount
				.findById(id)
				.select({
					cookies: 0,
					cookieRaw: 0,
					password: 0
				})
				.exec(function(err, doc) {
					if (err) return res.send(err);
					res.send(doc);
				});
			break;
		}
	};
	var getMore = function(req, res) {
		var per = 20;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;

		models.TradeAccount
			.find({})
			.select({
				cookies: 0,
				cookieRaw: 0,
				password: 0
			})
			.skip(per * page)
			.limit(per)
			.exec(function(err, docs) {
				if (err) return res.send(err);
				res.send(docs);
			});
	};


	/**
	 * router outline
	 */
	/**
	 * add trade/accounts
	 * type:
	 *     
	 */
	app.post('/trade/accounts', add);
	/**
	 * update trade/accounts
	 * type:
	 *     
	 */
	app.put('/trade/accounts/:id', update);

	/**
	 * delete trade/accounts
	 * type:
	 *     
	 */
	app.delete('/trade/accounts/:id', remove);
	/**
	 * get trade/accounts
	 */
	app.get('/trade/accounts/:id', getOne);

	/**
	 * get trade/accounts
	 * type:
	 */
	app.get('/trade/accounts', getMore);
};
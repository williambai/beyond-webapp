var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(), __filename));
var cp = require('child_process');

 exports = module.exports = function(app, models) {

	//** 预设casperjs 内部Http server的服务端口
	var capser_server_port = 8085; 
 	var captchaImage = {};

 	var autoLogin = function(req,res){
		//** 账户id
		var id = req.body.id;
		//** 设置captcha图片上传POST回调，由casperjs调用
		var callback_url = req.header('origin') + '/protect/cbss/accounts';
		//** 预设希望captcha图片文件的存储路径
		var captcha_file = path.join(__dirname, '../public/_tmp/captcha_' + id + '.png');
		//** 预设希望login页面截图文件的存储路径(调试有用，生产无用)
		var login_file = path.join(__dirname, '../public/_tmp/login_' + id + '.png');
		//** 运行casperjs的相对路径
		casperjs_cwd = path.join(__dirname, '../libs/cbss');
		//** 调用casperjs子进程
		var worker = cp.execFile(
			'casperjs', [
				'login.casper.js',
				'--ignore-ssl-errors=true',
				'--ssl-protocol=any',
				'--id=' + id,
				'--callback_url=' + callback_url,
				'--captcha_file=' + captcha_file,
				'--login_file=' + login_file,
				'--server_port=' + capser_server_port,
			], {
				cwd: casperjs_cwd,
			},
			function(err, stdout, stderr) {
				if (err) return logger.error(err);
				logger.debug(stdout);
			});
		logger.debug('casperjs started.');
		res.send({});
 	};
 	var processCaptchaText = function(req,res){
		var id = req.body.id;
		models.CbssAccount
			.findById(id)
			.exec(function(err, doc) {
				var captchaText = req.body.plain;
				//** casperjs server(localhost:8084) is waiting for feedback on step 1 forever.
				//** so feeback casperjs server when captcha has been parsed.(step 2)
				//** (step 5)transfer username/password/captcha to casperjs(as webServer)
				var http = require('http');
				var querystring = require('querystring');
				postData = querystring.stringify({
					action: 'login',
					username: doc.username,
					password: doc.password,
					captcha: captchaText,
				});
				logger.debug(postData)
				//** 连接casperjs，传递登录Form数据
				var request = http.request({
					hostname: 'localhost',
					port: capser_server_port,
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
 	var updateCookie = function(req,res){
		var id = req.body.id;
		var cookies = [];
		try {
			cookies = JSON.parse(req.body.cookies);
		} catch (e) {};
		models.CbssAccount
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
					res.send({});
				}); 
 	};
 	var refreshCookie = function(req,res){
 		models.CbssAccount
 			.find({
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
 				var _refreshCookie = function(docs) {
 					//** process one
 					var doc = docs.pop();
 					if (!doc) return res.send({});
 					var id = doc._id;
 					var path = require('path');
 					cbss_cwd = path.join(__dirname, '../libs/cbss');
 					var worker = require('child_process').execFile(
 						'casperjs', [
 							'cookie.refresh.casper.js',
 							'--id=' + id,
 							'--cookie=' + JSON.stringify(doc.cookies),
 							'--refresh_url=' + 'http://localhost:8092/protect/cbss/accounts'
 						], {
 							cwd: cbss_cwd,
 						},
 						function(err, stdout, stderr) {
 							if (err) logger.error(err);
 							logger.debug('-----refresh cookie--------');
 							logger.debug(stdout);
 							setTimeout(function() {
 								_refreshCookie(docs);
 							}, 1000);
 						});
 				};
 				_refreshCookie(docs);
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
			case 'uploadImage':
				//** (client)call from casperjs
				//** (step 2)casperjs uploadImage 
				//** casperjs save captcha image into /_tmp/captcha.png
				//** after that, casperjs server is listening to HOST:PORT(localhost:8084) forever.
				// logger.debug(req.body);
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
				//** (client)call from casperjs
				//** update cookie
				// logger.debug('updateCookie: ' + JSON.stringify(req.body));
				updateCookie(req, res);
				break;
			case 'refreshCookie':
				//** (client)call from command(schedule)
				refreshCookie(req, res);
				break;
			default:
				var doc = new models.CbssAccount(req.body);
				doc.save(function(err) {
					if (err) return res.send(err);
					res.send({});
				});
				break;
		}
 	};

 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.CbssAccount.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};

 	var update = function(req, res) {
 		var id = req.params.id;
		var set = req.body;
		//** 更新，则退出登录
		set.login = false;
		models.CbssAccount.findByIdAndUpdate(id, {
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
 	};

 	var getOne = function(req, res) {
 		var id = req.params.id;
 		var action = req.query.action || '';
 		switch (action) {
 			default:
 				models.CbssAccount
 					.findById(id)
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

 		models.CbssAccount
 			.find({})
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
 	 * add protect/cbss/accounts
 	 * type:
 	 *     
 	 */
 	// app.post('/protect/cbss/accounts', app.grant, add);
 	app.post('/protect/cbss/accounts', add);
 	/**
 	 * update protect/cbss/accounts
 	 * type:
 	 *     
 	 */
 	app.put('/protect/cbss/accounts/:id', app.grant, update);

 	/**
 	 * delete protect/cbss/accounts
 	 * type:
 	 *     
 	 */
 	app.delete('/protect/cbss/accounts/:id', app.grant, remove);
 	/**
 	 * get protect/cbss/accounts
 	 */
 	app.get('/protect/cbss/accounts/:id', app.grant, getOne);

 	/**
 	 * get protect/cbss/accounts
 	 * type:
 	 */
 	app.get('/protect/cbss/accounts', app.grant, getMore);
 };
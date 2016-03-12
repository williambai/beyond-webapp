 exports = module.exports = function(app, models) {
 	var crypto = require('crypto');
 	var CITIC = require('../config/citic');
 	var captchaImage = {};

 	var autoLogin = function(req,res){
 		var id = req.body.id;
 		var path = require('path');
 		cbss_cwd = path.join(__dirname, '../libs/citic');
 		console.log(cbss_cwd);
 		var worker = require('child_process').execFile(
 			'casperjs', [
 				'login.casper.js',
 				'--id=' + id,
 				'--captcha_file=' + path.join(__dirname, '../public/_tmp/captcha_' + id + '.png'),
 				'--login_file=' + path.join(__dirname, '../public/_tmp/login_' + id + '.png'),

 			], {
 				cwd: cbss_cwd,
 			},
 			function(err, stdout, stderr) {
 				if (err) return console.log(err);
 			});
 		console.log('casperjs started.');
 		res.send({});
 	};

 	var processCaptchaText = function(req,res){
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
				var password = crypto.privateDecrypt(CITIC.privateKey,new Buffer(doc.password,'base64')).toString();
				// console.log(password);
 				postData = querystring.stringify({
 					action: 'login',
 					username: doc.username,
 					password: password,
 					captcha: captchaText,
 				});
 				console.log(postData)
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
 					console.log('response from casper(action:login): ' + response.statusCode);
 				});
 				request.on('error', function(err) {
 					console.error('problem with request: ' + err.message);
 				});
 				request.write(postData);
 				request.end();
 				res.send({});
 			});
 	};

 	var refreshCookie = function(req,res){
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
 					cbss_cwd = path.join(__dirname, '../libs/citic');
 					var worker = require('child_process').execFile(
 						'casperjs', [
 							'cookie.casper.js',
 							'--id=' + id,
 							'--cookie=' + JSON.stringify(doc.cookies),
 							'--refresh_url=' + 'http://localhost:8091/trade/accounts'
 						], {
 							cwd: cbss_cwd,
 						},
 						function(err, stdout, stderr) {
 							if (err) console.error(err);
 							console.log('-----refresh citic cookie--------');
 							console.log(stdout);
 							setTimeout(function() {
 								_refreshCiticCookie(docs);
 							}, 1000);
 						});
 				};
 				_refreshCiticCookie(docs);
 			});
 	};

 	var updateCookie = function(req,res){
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
 					// 	console.log('response from casper(action:cookie_received): ' + response.statusCode);
 					// });
 					// request.on('error', function(err) {
 					// 	console.error('problem with request: ' + err.message);
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
 				autoLogin(req,res);
 				break;
			// case 'started': 
			// 	console.log('casperjs was started.');
			// 	var id = req.body.id;
			// 	res.send({});
			// 	break;	
 			case 'uploadImage':
 				//** (client)call from casperjs
 				//** (step 2)casperjs uploadImage 
 				//** casperjs save captcha image into /_tmp/captcha.png
 				//** after that, casperjs server is listening to HOST:PORT(localhost:8084) forever.
 				console.log(req.body);
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
 				processCaptchaText(req,res);
 				break;
 			case 'updateCookie':
 				console.log('updateCookie: ' + JSON.stringify(req.body));
 				//** (client)call from casperjs
 				//** update cookie
 				updateCookie(req,res);
 				break;
 			case 'refreshCookie':
 				refreshCookie(req,res);
 				break;
 			default:
 				var doc = req.body;
 				if(doc.password){
 					doc.password = crypto.publicEncrypt(CITIC.publicKey,new Buffer(doc.password)).toString('base64');
 					// console.log(doc.password);
 				}
 				//** 设置createBy 用户
 				doc.createBy = {
 					id: req.session.accountId,
 					name: req.session.username,
 				};
 				models.TradeAccount.create(doc,function(err) {
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
 			default:
 				var set = req.body;
 				if(set.password){
 					set.password = crypto.publicEncrypt(CITIC.publicKey,new Buffer(set.password)).toString('base64');
 					// console.log(set.password);
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
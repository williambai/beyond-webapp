 exports = module.exports = function(app, models) {

 	var captchaImage = {};

 	var add = function(req, res) {
 		var action = req.body.action || '';
 		switch (action) {
 			case 'login':
 				//** (client)call from browser
 				//** (step 1)start casperjs to login, transfer id
 				var id = req.body.id;
 				var path = require('path');
 				cbss_cwd = path.join(__dirname, '../libs/citic');
 				console.log(cbss_cwd);
 				var worker = require('child_process').execFile(
 					'casperjs', [
 						'login.casper.js',
 						'--id=' + id,
 						'--captcha_file=' + path.join(__dirname,'../public/_tmp/captcha_' + id + '.png'),
 						'--login_file=' + path.join(__dirname,'../public/_tmp/login_' + id + '.png'),

 					], {
 						cwd: cbss_cwd,
 					},
 					function(err, stdout, stderr) {
 						if (err) return console.log(err);
 					});
 				console.log('casperjs started.');
 				res.send({});
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
 				if(req.body.id && req.body.file){
 					captchaImage[req.body.id] = req.body.file;
 				}
 				break;
 			case 'getImage': 
 				//** (client)call from browser
 				//** (step 3)browser getImage which is ready on step 2
 				var id = req.body.id;
 				if(id && captchaImage[id]){
 					var file = captchaImage[id];
		 			res.send({
		 				src: file.slice(file.indexOf('/_tmp')),//'./_tmp/captcha.png'
		 			});
		 			captchaImage[id] = false;
 				}else{
 					res.send({});
 				}
 				break;
 			case 'captchaText':
 				//** (client)call from browser
 				//** (step 4) recieve browser's feedback captcha text
 				var id = req.body.id;
 				models.StockAccount
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
 				break;
 			case 'updateCookie':
 				console.log('updateCookie: ' + JSON.stringify(req.body));
 				//** (client)call from casperjs
 				//** update cookie
 				var id = req.body.id;
 				var cookies = [];
 				try{
	 				cookies = JSON.parse(req.body.cookies);
 				}catch(e){
 				};
 				models.StockAccount
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
 				break;
  			default:
 				var doc = new models.StockAccount(req.body);
 				doc.save(function(err) {
 					if (err) return res.send(err);
 					res.send({});
 				});
 				break;
 		}
 	};

 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.StockAccount.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};

 	var update = function(req, res) {
 		var id = req.params.id;
		var set = req.body;
		models.StockAccount.findByIdAndUpdate(id, {
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
 				models.StockAccount
 					.findById(id)
 					.select({password:0})
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

 		models.StockAccount
 			.find({})
 			.select({password: 0})
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
 	 * add stock/accounts
 	 * type:
 	 *     
 	 */
 	app.post('/stock/accounts', add);
 	/**
 	 * update stock/accounts
 	 * type:
 	 *     
 	 */
 	app.put('/stock/accounts/:id', update);

 	/**
 	 * delete stock/accounts
 	 * type:
 	 *     
 	 */
 	app.delete('/stock/accounts/:id', remove);
 	/**
 	 * get stock/accounts
 	 */
 	app.get('/stock/accounts/:id', getOne);

 	/**
 	 * get stock/accounts
 	 * type:
 	 */
 	app.get('/stock/accounts', getMore);
 };
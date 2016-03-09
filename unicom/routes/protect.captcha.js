 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		console.log('++++++')
 		console.log(req.body);
 		res.send({});
 		setTimeout(function(){
 			console.log('------')
 			var http = require('http');
 			var querystring = require('querystring');
 			postData = querystring.stringify({
 				result: 'ok'
 			});
 			var request = http.request({
 				hostname: 'localhost',
 				port: 8084,
 				path: '/?captcha=text',
 				method: 'POST',
 				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': postData.length
				},
 			},function(){
 				console.log('ok');
 			});
 			request.on('error', function(err){
 				console.log('problem with request: ' + err.message);
 			});
 			request.write(postData);
 			request.end();
 		},4000);
 		return;
 		var doc = new models.Captcha(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.Captcha.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Captcha.findByIdAndUpdate(id, {
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
 		if (id.length != 24) {
 			models.Captcha
 				.findOne({
 					nickname: id,
 				})
 				.exec(function(err, doc) {
 					if (err) return res.send(err);
 					res.send(doc);
 				});
 			return;
 		}
 		models.Captcha
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		console.log('------')
 		res.send({});
 		return;
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.Captcha
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
 	 * add captchas
 	 * type:
 	 *     
 	 */
 	app.post('/captchas', add);
 	/**
 	 * update captchas
 	 * type:
 	 *     
 	 */
 	app.put('/captchas/:id', update);

 	/**
 	 * delete captchas
 	 * type:
 	 *     
 	 */
 	app.delete('/captchas/:id', remove);
 	/**
 	 * get captchas
 	 */
 	app.get('/captchas/:id', getOne);

 	/**
 	 * get captchas
 	 * type:
 	 */
 	app.get('/captchas', getMore);
 };
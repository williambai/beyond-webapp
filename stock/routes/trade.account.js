var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var _ = require('underscore');
var util = require('util');
var crypto = require('crypto');
//** 配置文件
var CITIC = require('../config/citic');

exports = module.exports = function(app, models) {
	//** captcha图片在casperjs与nodejs之间的文件交换
	var captchaImage = {};

	var add = function(req, res) {
		var action = req.body.action || '';
		switch (action) {
			case 'login':
				//** (client)call from browser
				//** (step 1)start casperjs to login, transfer id
				models.TradeAccount.getLoginPage({
					id: req.body.id,
					login_file: path.join(__dirname, '../public/_tmp/login_' + req.body.id + '.png'),
					captcha_file: path.join(__dirname, '../public/_tmp/captcha_' + req.body.id + '.png'),
				}, function(err){
					if(err) logger.error(err);
					res.send({})
				});
				break;
			case 'uploadImage':
				//** (client)call from casperjs
				//** (step 2)casperjs uploadImage 
				//** casperjs save captcha image into /_tmp/captcha_id.png
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
				models.TradeAccount.autoLogin({
					id: req.body.id,
					plain: req.body.plain, //** 验证码明文
				}, function(err){
					if(err) return res.send(err);
					res.send({});
				})
				break;
			case 'updateCookie':
				//** (client)call from casperjs
				//** (step 5)update cookie
				logger.debug('updateCookie: ' + JSON.stringify(req.body));
				models.TradeAccount.updateCookie({
					id: req.body.id,
					cookies: req.body.cookies,
					success: req.body.success,
				},function(err){
					if(err) return res.send(err);
					res.send({});
				})
				break;
			case 'logout': 
				//** 登出
				models.TradeAccount.findByIdAndUpdate(
					req.body.id,
					{
						$set: {
							'login': false,
						}
					},{
						'upsert': false,
						'new': true,
					}, 
					function(err,doc){
						if (err) return res.send(err);
						res.send(doc);
					}
				);
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
			default: 
				var set = req.body;
				set = _.omit(set,'_id');
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


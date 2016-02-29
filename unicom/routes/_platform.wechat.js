var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

exports = module.exports = function(app, models) {
	var _ = require('underscore');
	var request = require('request');

	var add = function(req, res) {
		var doc = req.body;
		var action = req.body.action || '';
		switch (action) {
			case 'updateAccessToken':
				models
					.PlatformWeChat
					.find({})
					.exec(function(err,docs){
						if(err || !docs) return res.send(err);
						var updateAccessToken = function(docs, done){
							var doc = docs.pop();
							if(!doc) return done();
							request({
								url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + doc.appid + '&secret=' + doc.appsecret,
								method: 'GET',
								json: true,
							}, function(err, response, body) {
								if (err || !body) return res.send(err);
								logger.debug('access_token: ' + body.access_token);
								var token = {
									access_token: body.access_token || '',
									expired: new Date(Date.now() + 7000000),
								};
								models
									.PlatformWeChat
									.findByIdAndUpdate(doc._id,{
										$set: {
											'token': token
										}
									},{
										'upsert': false,
										'new': true
									},function(err,result){
										if(err) return res.send(err);
										updateAccessToken(docs,done);
									});
							});
						};
						updateAccessToken(docs, function(){
							res.send({});
						});
					});
				break;
			default:
				doc.menus = [];
				models.PlatformWeChat.create(doc, function(err) {
					if (err) return res.send(err);
					res.send({});
				});
				break;
		}
	};
	var remove = function(req, res) {
		var id = req.params.id;
		models.PlatformWeChat.findByIdAndRemove(id, function(err, doc) {
			if (err) return res.send(err);
			res.send(doc);
		});
	};
	var update = function(req, res) {
		var id = req.params.id;
		var set = req.body;
		set = _.omit(set, 'menus');
		models.PlatformWeChat.findByIdAndUpdate(id, {
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
		models.PlatformWeChat
			.findById(id)
			.select({
				menus: 0
			})
			.exec(function(err, doc) {
				if (err) return res.send(err);
				res.send(doc);
			});
	};

	var getMore = function(req, res) {
		var action = req.query.action || '';
		var per = req.query.per || 20;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;

		models.PlatformWeChat
			.find({})
			.select({
				menus: 0
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
	 * add platform/wechats
	 * action:
	 *     
	 */
	app.post('/platform/wechats', app.grant, add);
	/**
	 * update platform/wechats
	 * action:
	 *     
	 */
	app.put('/platform/wechats/:id', app.grant, update);

	/**
	 * delete platform/wechats
	 * action:
	 *     
	 */
	app.delete('/platform/wechats/:id', app.grant, remove);
	/**
	 * get platform/wechats
	 */
	app.get('/platform/wechats/:id', app.grant, getOne);

	/**
	 * get platform/wechats
	 * action:
	 *      action=category&category=xxx
	 */
	app.get('/platform/wechats', app.grant, getMore);
};
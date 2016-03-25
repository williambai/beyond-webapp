 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var request = require('request');

 	var add = function(req, res) {
 		var action = req.body.action || '';
 		switch (action) {
 			case 'export':
 				models
 					.PlatformWeChat
 					.findById(req.params.wid)
 					.exec(function(err,doc){
 						if(err || !doc) return res.send(err);
 						var access_token = (doc.token instanceof Object) ? doc.token.access_token : undefined;
 						if(!access_token) return res.send({code: 404100, errmsg: 'access_token is not ready.'});
	 					request({
	 						url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + access_token,
	 						method: 'POST',
	 						json: true,
	 						body: {
	 							button: [{
	 								name: 'Wo地带',
	 								sub_button: [{
	 									type: 'view',
	 									name: '同事圈',
	 									url: 'http://wo.pdbang.cn/wechat.html#activity/index'
	 								}, {
	 									type: 'view',
	 									name: '销售线索',
	 									url: 'http://wo.pdbang.cn/wechat.html#sale/lead/index'
	 								}, {
	 									type: 'view',
	 									name: '意见反馈',
	 									url: 'http://wo.pdbang.cn/wechat.html#feedback/index'
	 								}]
	 							}, {
	 								name: 'Wo产品',
	 								sub_button: [{
	 									type: 'view',
	 									name: '流量产品',
	 									url: 'http://wo.pdbang.cn/wechat.html#data/index'
	 								}, {
	 									type: 'view',
	 									name: '传统增值',
	 									url: 'http://wo.pdbang.cn/wechat.html#sms/index'
	 								}, {
	 									type: 'view',
	 									name: '内容推荐',
	 									url: 'http://wo.pdbang.cn/wechat.html#push/index'
	 								}, {
	 									type: 'view',
	 									name: '号卡产品',
	 									url: 'http://wo.pdbang.cn/wechat.html#card/index'
	 								}, {
	 									type: 'view',
	 									name: '终端产品',
	 									url: 'http://wo.pdbang.cn/wechat.html#phone/index'
	 								}]
	 							}, {
	 								name: '我的领地',
	 								sub_button: [{
	 									type: 'view',
	 									name: '我的成绩',
	 									url: 'http://wo.pdbang.cn/wechat.html#order/index'
	 								},{
	 									type: 'view',
	 									name: '我的客户',
	 									url: 'http://wo.pdbang.cn/wechat.html#customer/index'
	 								},{
	 									type: 'view',
	 									name: '我的金币',
	 									url: 'http://wo.pdbang.cn/wechat.html#revenue/stat'
	 								},{
	 									type: 'view',
	 									name: '我的资料',
	 									url: 'http://wo.pdbang.cn/wechat.html#profile/me'
	 								}]
	 							}]

	 						}
	 					}, function(err, response, body) {
	 						if (err) return res.send(err);
	 						res.send(body);
	 					});

 					});
 				// models.PlatformWeChat
 				// 		.findById(req.params.wid)
 				// 		.exec(function(err,doc){
 				// 			if(err || !doc ) return res.send(err);
 				// 			var menus = doc.menus || [];
 				// 			var button = {};
 				// 			var sub_button = {};
 				// 			_.each(menus,function(menu){
 				// 				var paths = (menu.path || '').split('>>'); 
 				// 				if(paths.length == 1){
 				// 				button[paths[0]] = menu;
 				// 				}else if(paths.length == 2){
 				// 					// button[paths[0]] = button[paths[0]] || {};
 				// 					// button[paths[0]]['sub_button'] = menu;
 				// 				};
 				// 			});
 				// 			res.send({button: _.values(button)});
 				// 		});
 				break;
 			default:
 				var wid = req.params.wid;
 				var menu = _.omit(req.body, '_id');
 				//transform menu
 				if (_.isEmpty(menu.parent)) menu = _.omit(menu, 'parent');
 				if (_.isEmpty(menu.path)) {
 					menu.path = menu.name;
 				} else {
 					menu.path += ' >> ' + menu.name;
 				}
 				menu.display_sort = req.body.display_sort || 0;
 				models.PlatformWeChat.findByIdAndUpdate(wid, {
 						$push: {
 							'menus': menu
 						}
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
 		};
 	}
 	var remove = function(req, res) {
 		var wid = req.params.wid;
 		var id = req.params.id;
 		models.PlatformWeChat.findByIdAndUpdate(wid, {
 				$pull: {
 					'menus': {
 						_id: id
 					},
 				}
 			}, {
 				'upsert': false,
 				'new': true,
 			},
 			function(err, doc) {
 				if (err) return res.send(err);
 				res.send({});
 			}
 		);
 	};
 	var update = function(req, res) {
 		var wid = req.params.wid;
 		var id = req.params.id;
 		//** pull out
 		models.PlatformWeChat.findByIdAndUpdate(wid, {
 				$pull: {
 					'menus': {
 						_id: id
 					},
 				}
 			}, {
 				'upsert': false,
 				'new': true,
 			},
 			function(err) {
 				if (err) return res.send(err);
 				//** push into
 				var menu = req.body;
 				//transform doc
 				if (_.isEmpty(menu.parent)) menu = _.omit(menu, 'parent');
 				var regex = new RegExp(menu.name, 'i');
 				if (_.isEmpty(menu.path)) {
 					menu.path += menu.name;
 				} else {
 					if (!regex.test(menu.path)) menu.path += ' >> ' + menu.name;
 				}
 				menu._id = id;
 				menu.display_sort = req.body.display_sort || 0;
 				models.PlatformWeChat.findByIdAndUpdate(wid, {
 						$push: {
 							'menus': menu
 						}
 					}, {
 						'upsert': false,
 						'new': true,
 					},
 					function(err, doc) {
 						if (err) return res.send(err);
 						res.send({});
 					}
 				);
 			}
 		);
 	};
 	var getOne = function(req, res) {
 		var wid = req.params.wid;
 		var id = req.params.id;
 		models.PlatformWeChat
 			.findOne({
 				'menus._id': id
 			})
 			.select({
 				menus: 1
 			})
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				var menus = doc.menus || [];
 				res.send(_.findWhere(menus, {
 					'id': id
 				}));
 			});
 	};
 	var getMore = function(req, res) {
 		var wid = req.params.wid;
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.PlatformWeChat
 			.findOne({
 				_id: wid
 			})
 			.select({
 				'menus': 1
 			})
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc.menus.slice(per * page, per));
 			});
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add protect/wechat/:wid/menus
 	 * action:
 	 *     
 	 */
 	app.post('/protect/wechat/:wid/menus', app.grant, add);
 	/**
 	 * update protect/wechat/:wid/menus
 	 * action:
 	 *     
 	 */
 	app.put('/protect/wechat/:wid/menus/:id', app.grant, update);

 	/**
 	 * delete protect/wechat/:wid/menus
 	 * action:
 	 *     
 	 */
 	app.delete('/protect/wechat/:wid/menus/:id', app.grant, remove);
 	/**
 	 * get protect/wechat/:wid/menus
 	 */
 	app.get('/protect/wechat/:wid/menus/:id', app.grant, getOne);

 	/**
 	 * get protect/wechat/:wid/menus
 	 * action:
 	 */
 	app.get('/protect/wechat/:wid/menus', app.grant, getMore);
 };
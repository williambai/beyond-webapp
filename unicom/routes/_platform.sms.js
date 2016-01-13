 exports = module.exports = function(app, models) {

 	var _ = require('underscore');
 	var async = require('async');
 	var sp = require('../libs/sms');

 	/**
 	 * 由新建状态 转移到 失败状态或已发送状态
 	 * -或者-
 	 * 发送失败重试3次：
 	 * 由失败状态 转移到 失败状态或已发送状态 
 	 */
 	var send = function(req, res) {
 		models.PlatformSms
 			.find({
 				$or: [{
 					'status': '新建'
 				}, {
 					'status': '失败',
 					'tryTimes': {
 						$lt: 3
 					}
 				}]
 			})
 			.limit(20)
 			.exec(function(err, docs) {
 				if (err) return res.send(err);
 				if (_.isEmpty(docs)) return res.send({}); //没有可执行的新建SMS
 				var _send = function(docs) {
 					var doc = docs.pop();
 					if (!doc) return res.send({});
 					//** send sms
 					sp.send(doc, function(err,result) {
 						if (err) {
 							models.PlatformSms
 								.findByIdAndUpdate(
 									doc._id, {
 										$set: {
 											'status': '失败',
 										},
 										$inc: {
 											'tryTimes': 1
 										}
 									}, {
 										'upsert': false,
 										'new': true,
 									},
 									function(err, newDoc) {
 										if (err) return res.send(err);
 										setTimeout(function() {
 											_send(docs);
 										}, 50);
 									});
 							return res.send(err);
 						}
 						models.PlatformSms
 							.findByIdAndUpdate(
 								doc._id, {
 									$set: {
 										'status': '已发送',
 										'series': result.id,
 									},
 									$push: {
 										replies: result,
 									}
 								}, {
 									'upsert': false,
 									'new': true,
 								},
 								function(err, newDoc) {
 									if (err) return res.send(err);
 									setTimeout(function() {
 										_send(docs);
 									}, 50);
 								});
 					});
 				};
 				_send(docs);
 			});
 	};

 	/**
 	 * check发送结果报告
 	 * 由已发送状态 转化为失败状态 或已确认状态
 	 */
 	var checkReport = function(req, res) {
 		models.PlatformSms
 			.find({
 				'status': '已发送',
 			})
 			.limit(20)
 			.exec(function(err, docs) {
 				if (err) return res.send(err);
 				if (_.isEmpty(docs)) return res.send({}); //没有可执行的新建SMS
 				var _checkReport = function(docs) {
 					var doc = docs.pop();
 					if (!doc) return res.send({});
 					//** send sms
 					sp.checkReport(doc, function(err, report) {
 						if (err) return res.send(err);
 						if (!report) return res.send({});
 						models.PlatformSms
 							.findByIdAndUpdate(
 								doc._id, {
 									$set: {
 										'status': report.status, //'已确认' 或 '失败'
 									},
 									$push: {
 										replies: report,
 									}
 								}, {
 									'upsert': false,
 									'new': true,
 								},
 								function(err, newDoc) {
 									if (err) return res.send(err);
 									setTimeout(function() {
 										_checkReport(docs);
 									}, 50);
 								});
 					});
 				};
 				_checkReport(docs);
 			});
 	};

 	/**
 	 * check用户回复
 	 * 由已确认状态，转化为已订购状态或已取消状态
 	 * @param  {Function} callback [description]
 	 * @return {[type]}            [description]
 	 */
 	var checkReply = function(req, res) {
 		models.PlatformSms
 			.find({
 				'status': '已确认',
 			})
 			.limit(20)
 			.exec(function(err, docs) {
 				if (err) return res.send(err);
 				if (_.isEmpty(docs)) return res.send({}); //没有可执行的新建SMS
 				var _checkReply = function(docs) {
 					var doc = docs.pop();
 					if (!doc) return res.send({});
 					//** send sms
 					sp.checkReply(doc, function(err, reply) {
 						if (err) return res.send(err);
 						if (!reply) return res.send({});
 						models.PlatformSms
 							.findByIdAndUpdate(
 								doc._id, {
 									$set: {
 										'status': reply.status, //'已订购' 或 '已取消'
 									},
 									$push: {
 										replies: reply,
 									}
 								}, {
 									'upsert': false,
 									'new': true,
 								},
 								function(err, newDoc) {
 									if (err) return res.send(err);
 									setTimeout(function() {
 										_checkReply(docs);
 									}, 50);
 								});
 					});
 				};
 				_checkReply(docs);
 			});
 	};

 	var add = function(req, res) {
 		var action = req.body.action || '';
 		switch (action) {
 			case 'send':
 				//call from command
 				send(req, res);
 				break;
 			case 'report':
 				//call from command
 				checkReport(req, res);
 				break;
 			case 'reply':
 				//call from command
 				checkReply(req, res);
 				break;
 			default:
 				var doc = req.body;
 				models.PlatformSms.create(doc, function(err) {
 					if (err) return res.send(err);
 					res.send({});
 				});
 				break;
 		}
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.PlatformSms.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.PlatformSms.findByIdAndUpdate(id, {
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
 			models.PlatformSms
 				.findOne({
 					nickname: id,
 				})
 				.exec(function(err, doc) {
 					if (err) return res.send(err);
 					res.send(doc);
 				});
 			return;
 		}
 		models.PlatformSms
 			.findById(id)
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.PlatformSms
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
 	 * add platform/smses
 	 * type:
 	 *     
 	 */
 	app.post('/platform/smses', add);
 	/**
 	 * update platform/smses
 	 * type:
 	 *     
 	 */
 	app.put('/platform/smses/:id', update);

 	/**
 	 * delete platform/smses
 	 * type:
 	 *     
 	 */
 	app.delete('/platform/smses/:id', remove);
 	/**
 	 * get platform/smses
 	 */
 	app.get('/platform/smses/:id', getOne);

 	/**
 	 * get platform/smses
 	 * type:
 	 */
 	app.get('/platform/smses', getMore);
 };
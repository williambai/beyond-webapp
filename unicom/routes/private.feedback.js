 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var add = function(req, res) {
 		var doc = req.body || {};
 		doc.uid = req.session.accountId;
 		doc.username = req.session.username;
 		doc.avatar = req.session.avatar;
 		doc.comments = [];
 		doc.tags = [];
 		doc.voters = [];
 		doc.votes = [];
 		models
 			.PlatformFeedback
 			.create(doc,function(err) {
	 			if (err) return res.send(err);
	 			res.send({});
	 		});
 	};
 	var remove = function(req, res) {
 		var id = req.params.id;
 		models.PlatformFeedback.findByIdAndRemove(id, function(err, doc) {
 			if (err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var action = req.query.action || '';
 		var id = req.params.id;
 		switch(action){
 			case 'comment': 
 				var comment = {
					uid: req.session.accountId,
					username: req.session.username,
					avatar: req.session.avatar,
					content: req.body.content || ''
 				};
 				models
 					.PlatformFeedback
 					.findByIdAndUpdate(id,{
 						$set: {
 							lastupdatetime: Date.now()
 						},
 						$push: {
 							'comments': comment,
 						}
 					},{
 						'upsert': false,
 						'new': true
 					},function(err,doc){
 						if(err) return res.send(err);
 						res.send(comment);
 					})
 				break;
 			default:
	 			var set = req.body;
	 			set = _.omit(set,'comments');
	 			set = _.omit(set,'tags');
	 			set = _.omit(set, 'votes');
	 			set = _.omit(set, 'voters');
	 			models.PlatformFeedback.findByIdAndUpdate(id, {
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
 		if (id.length != 24) {
 			models.PlatformFeedback
 				.findOne({
 					nickname: id,
 				})
 				.exec(function(err, doc) {
 					if (err) return res.send(err);
 					res.send(doc);
 				});
 			return;
 		}
 		models.PlatformFeedback
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

 		models.PlatformFeedback
 			.find({})
 			.sort({lastupdatetime: -1})
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
 	 * add private/feedbacks
 	 * action:
 	 *     
 	 */
 	app.post('/private/feedbacks', app.isLogin, add);
 	/**
 	 * update private/feedbacks
 	 * action:
 	 *       comment
 	 *     
 	 */
 	app.put('/private/feedbacks/:id', app.isLogin, update);

 	/**
 	 * delete private/feedbacks
 	 * action:
 	 *     
 	 */
 	app.delete('/private/feedbacks/:id', app.isLogin, remove);
 	/**
 	 * get private/feedbacks
 	 */
 	app.get('/private/feedbacks/:id', app.isLogin, getOne);

 	/**
 	 * get private/feedbacks
 	 * action:
 	 */
 	app.get('/private/feedbacks', app.isLogin, getMore);
 };
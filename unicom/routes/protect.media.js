var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var regexp = require('../libs/regexp');

 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

	var add = function(req, res) {
 		var doc = new models.Media(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.Media.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Media.findByIdAndUpdate(id, {
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
 		models.Media
 			.findById(id)
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
 		switch(action){
 			case 'search':
 				var searchStr = req.query.searchStr || '';
 				var searchRegex = new RegExp(regexp.escape(searchStr), 'i');
 				var status = req.query.status;
 				var query = models.Media.find({
 					$or: [{
 						'name': {
 							$regex: searchRegex
 						}
 					}, {
 						'url': {
 							$regex: searchRegex
 						}
 					}]
 				});
 				if (!_.isEmpty(status)) {
 					query.where({
 						status: status
 					});
 				}
 				query.sort({
 						_id: -1
 					})
 					.skip(per * page)
 					.limit(per)
 					.exec(function(err, docs) {
 						if (err) return res.send(err);
 						res.send(docs);
 					});
 				break;
  			case 'category':
 				models.Media
 					.find({
 						category: req.query.category,
 						status: '有效',
 					})
		 			.skip(per * page)
		 			.limit(per)
		 			.exec(function(err, docs) {
		 				if (err) return res.send(err);
		 				res.send(docs);
		 			});
 				break;
 			default:
		 		models.Media
		 			.find({})
		 			.skip(per * page)
		 			.limit(per)
		 			.exec(function(err, docs) {
		 				if (err) return res.send(err);
		 				res.send(docs);
		 			});
 		}
  	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add protect/medias
 	 * action:
 	 *     
 	 */
 	app.post('/protect/medias', app.isLogin, add);
 
 	/**
 	 * update protect/medias
 	 * action:
 	 *     
 	 */
 	app.put('/protect/medias/:id', app.isLogin, update);
 	/**
 	 * delete protect/medias
 	 * action:
 	 *     
 	 */
 	app.delete('/protect/medias/:id', app.isLogin, remove);
 	/**
 	 * get protect/medias
 	 */
 	app.get('/protect/medias/:id', app.isLogin, getOne);

 	/**
 	 * get protect/medias
 	 * action:
 	 *      action=category&category=xxx
 	 */
 	app.get('/protect/medias', app.isLogin, getMore);
 };
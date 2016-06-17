var _ = require('underscore');
var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
var regexp = require('../libs/regexp');

 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = req.body;
 		models.Goods
 			.findOne(
 				{
 					'barcode': doc.goods.barcode
 				},
 				function(err,goods){
 					if(err || !goods) return res.send(err || {code: 404112, errmsg: 'goods id 不存在。'});
 					//** 保存goods
 					doc.goods = goods;
			 		//** 将所属分类按字符串保存
			 		doc.category = (doc.category || '').join(',');
 					models.ProductDirect
 						.create(doc, function(err) {
	 						if (err) return res.send(err);
	 						res.send({});
	 					});
 				});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ProductDirect.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var doc = req.body;
 		models.Goods
 			.findOne(
 				{
 					'barcode': doc.goods.barcode
 				},
 				function(err,goods){
 					if(err || !goods) return res.send(err || {code: 404112, errmsg: 'goods id 不存在。'});
 					//** 保存goods
 					doc.goods = goods;
			 		doc = _.omit(doc,'_id');
			 		//** 将所属分类按字符串保存
			 		doc.category = (doc.category || '').join(',');
 					models.ProductDirect.findByIdAndUpdate(id, {
 							$set: doc
 						}, {
 							'upsert': false,
 							'new': true,
 						},
 						function(err, doc) {
 							if (err) return res.send(err);
 							res.send(doc);
 						}
 					);
 				});
 	};
 	var getOne = function(req, res) {
 		var id = req.params.id;
 		models.ProductDirect
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
	 			var category = req.query.category;
	 			var query = models.ProductDirect.find({
 						$or: [{
 							'name': {
 								$regex: searchRegex
 							}
 						}, {
 							'goods.name': {
 								$regex: searchRegex
 							}
 						}]
 					});
	 			if (!_.isEmpty(status)) {
	 				query.where({status: status});
	 			}
	 			if(!_.isEmpty(category)){
	 				query.where({category: category});
	 			};
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
 				models.ProductDirect
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
		 		models.ProductDirect
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
 	 * add protect/product/directs
 	 * action:
 	 *     
 	 */
 	app.post('/protect/product/directs', app.grant, add);
 	/**
 	 * update protect/product/directs
 	 * action:
 	 *     
 	 */
 	app.put('/protect/product/directs/:id', app.grant, update);

 	/**
 	 * delete protect/product/directs
 	 * action:
 	 *     
 	 */
 	app.delete('/protect/product/directs/:id', app.grant, remove);
 	/**
 	 * get protect/product/directs
 	 */
 	app.get('/protect/product/directs/:id', app.grant, getOne);

 	/**
 	 * get protect/product/directs
 	 * action:
 	 *      action=category&category=xxx
 	 */
 	app.get('/protect/product/directs', app.grant, getMore);
 };
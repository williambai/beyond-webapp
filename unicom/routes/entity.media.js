var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:entity.media');
logger.setLevel('INFO');

 exports = module.exports = function(app, models) {

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
 		var type = req.query.type || '';
 		var per = req.query.per || 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
 		switch(type){
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
 	 * add medias
 	 * type:
 	 *     
 	 */
 	app.post('/medias', add);
 
 	/**
 	 * update medias
 	 * type:
 	 *     
 	 */
 	app.put('/medias/:id', update);
 	/**
 	 * delete medias
 	 * type:
 	 *     
 	 */
 	app.delete('/medias/:id', remove);
 	/**
 	 * get medias
 	 */
 	app.get('/medias/:id', getOne);

 	/**
 	 * get medias
 	 * type:
 	 *      type=category&category=xxx
 	 */
 	app.get('/medias', getMore);
 };
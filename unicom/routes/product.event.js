var log4js = require('log4js');
var path = require('path');
log4js.configure(path.join(__dirname,'../config/log4js.json'));
var logger = log4js.getLogger('server');
logger.setLevel('DEBUG');

 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.PromoteEvent(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.PromoteEvent.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.PromoteEvent.findByIdAndUpdate(id, {
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
 		models.PromoteEvent
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
 				models.PromoteEvent
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
		 		models.PromoteEvent
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
 	 * add promote/events
 	 * type:
 	 *     
 	 */
 	app.post('/promote/events', add);
 	/**
 	 * update promote/events
 	 * type:
 	 *     
 	 */
 	app.put('/promote/events/:id', update);

 	/**
 	 * delete promote/events
 	 * type:
 	 *     
 	 */
 	app.delete('/promote/events/:id', remove);
 	/**
 	 * get promote/events
 	 */
 	app.get('/promote/events/:id', getOne);

 	/**
 	 * get promote/events
 	 * type:
 	 *      type=category&category=xxx
 	 */
 	app.get('/promote/events', getMore);
 };
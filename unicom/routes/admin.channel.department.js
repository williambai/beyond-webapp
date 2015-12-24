 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var add = function(req, res) {
 		var doc = req.body;
 		//transform doc
 		if(_.isEmpty(doc.parent)) doc = _.omit(doc,'parent');
 		if(_.isEmpty(doc.path)){
 			doc.path += doc.name;
 		}else{
 	 		doc.path += ' >> '+ doc.name;
 		}
 		models.ChannelDepartment.create(doc, function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.ChannelDepartment.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var doc = req.body;
 		//transform doc
 		if(_.isEmpty(doc.parent)) doc = _.omit(doc,'parent');
 		var regex = new RegExp(doc.name,'i');
 		if(_.isEmpty(doc.path)){
 			doc.path += doc.name;
 		}else{
	 		if(!regex.test(doc.path)) doc.path += ' >> '+ doc.name;
 		}

 		models.ChannelDepartment.findByIdAndUpdate(id, {
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
 	};
 	var getOne = function(req, res) {
 		var id = req.params.id;
 		models.ChannelDepartment
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

 		models.ChannelDepartment
 			.find({})
 			.sort({ _id: -1})
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
 	 * add channel/departments
 	 * type:
 	 *     
 	 */
 	app.post('/channel/departments', add);
 	/**
 	 * update channel/departments
 	 * type:
 	 *     
 	 */
 	app.put('/channel/departments/:id', update);

 	/**
 	 * delete channel/departments
 	 * type:
 	 *     
 	 */
 	app.delete('/channel/departments/:id', remove);
 	/**
 	 * get channel/departments
 	 */
 	app.get('/channel/departments/:id', getOne);

 	/**
 	 * get channel/departments
 	 * type:
 	 */
 	app.get('/channel/departments', getMore);
 };
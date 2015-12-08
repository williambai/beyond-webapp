 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.ChannelDepartment(req.body);
 		doc.save(function(err) {
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
 		var set = req.body;
 		models.ChannelDepartment.findByIdAndUpdate(id, {
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
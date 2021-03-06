 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.SaleLead(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.SaleLead.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.SaleLead.findByIdAndUpdate(id, {
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
 		models.SaleLead
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

 		models.SaleLead
 			.find({})
 			.sort({_id: -1})
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
 	 * add channel/sale/leads
 	 * action:
 	 *     
 	 */
 	app.post('/channel/sale/leads', app.grant, add);
 	/**
 	 * update channel/sale/leads
 	 * action:
 	 *     
 	 */
 	app.put('/channel/sale/leads/:id', app.grant, update);

 	/**
 	 * delete channel/sale/leads
 	 * action:
 	 *     
 	 */
 	app.delete('/channel/sale/leads/:id', app.grant, remove);
 	/**
 	 * get channel/sale/leads
 	 */
 	app.get('/channel/sale/leads/:id', app.grant, getOne);

 	/**
 	 * get channel/sale/leads
 	 * action:
 	 */
 	app.get('/channel/sale/leads', app.grant, getMore);
 };
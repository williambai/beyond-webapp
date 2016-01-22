 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		res.set('Content-Type', 'text/html');
 		res.render('data_success');
 		return;

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
 	 * add sale/leads
 	 * action:
 	 *     
 	 */
 	app.post('/sale/leads', add);
 	/**
 	 * update sale/leads
 	 * action:
 	 *     
 	 */
 	app.put('/sale/leads/:id', update);

 	/**
 	 * delete sale/leads
 	 * action:
 	 *     
 	 */
 	app.delete('/sale/leads/:id', remove);
 	/**
 	 * get sale/leads
 	 */
 	app.get('/sale/leads/:id', getOne);

 	/**
 	 * get sale/leads
 	 * action:
 	 */
 	app.get('/sale/leads', getMore);
 };
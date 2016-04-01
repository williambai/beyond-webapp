 exports = module.exports = function(app, models) {

 	// var add = function(req, res) {
 	// 	res.set('Content-Type', 'text/html');
 	// 	res.render('data_success');
 	// 	return;

 	// 	var doc = new models.SaleLead(req.body);
 	// 	doc.save(function(err) {
 	// 		if (err) return res.send(err);
 	// 		res.send({});
 	// 	});
 	// };
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.SaleLead.findOneAndRemove({
 			_id: id,
 			'seller.id': req.session.accountId, //** 仅自己可操作
 		},function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.SaleLead.findOneAndUpdate({
 			_id: id,
 			'seller.id': req.session.accountId, //** 仅自己可操作
 		}, {
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
 			.findOne({
 				_id: id,
	 			'seller.id': req.session.accountId, //** 仅自己可操作
 			})
 			.exec(function(err, doc) {
 				if (err || !doc) return res.send(err || {});
 				res.send(doc);
 			});
 	};
 	var getMore = function(req, res) {
 		var per = 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.SaleLead
 			.find({
	 			'seller.id': req.session.accountId, //** 仅自己可操作
 			})
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
 	 * add private/sale/leads
 	 * action:
 	 *     
 	 */
 	// app.post('/private/sale/leads', app.isLogin, add);
 	/**
 	 * update private/sale/leads
 	 * action:
 	 *     
 	 */
 	app.put('/private/sale/leads/:id', app.isLogin, update);

 	/**
 	 * delete private/sale/leads
 	 * action:
 	 *     
 	 */
 	app.delete('/private/sale/leads/:id', app.isLogin, remove);
 	/**
 	 * get private/sale/leads
 	 */
 	app.get('/private/sale/leads/:id', app.isLogin, getOne);

 	/**
 	 * get private/sale/leads
 	 * action:
 	 */
 	app.get('/private/sale/leads', app.isLogin, getMore);
 };
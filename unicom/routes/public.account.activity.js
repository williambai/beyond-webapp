 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.AccountActivity(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.AccountActivity.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.AccountActivity.findByIdAndUpdate(id, {
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
 		models.AccountActivity
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

 		models.AccountActivity
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
 	 * add public/account/activities
 	 * type:
 	 *     
 	 */
 	app.post('/public/account/activities', app.isLogin, add);
 	/**
 	 * update public/account/activities
 	 * type:
 	 *     
 	 */
 	app.put('/public/account/activities/:id', app.isLogin, update);

 	/**
 	 * delete public/account/activities
 	 * type:
 	 *     
 	 */
 	app.delete('/public/account/activities/:id', app.isLogin, remove);
 	/**
 	 * get public/account/activities
 	 */
 	app.get('/public/account/activities/:id', app.isLogin, getOne);

 	/**
 	 * get public/account/activities
 	 * type:
 	 */
 	app.get('/public/account/activities', app.isLogin, getMore);
 };
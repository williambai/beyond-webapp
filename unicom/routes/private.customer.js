 exports = module.exports = function(app, models) {

 	var add = function(req, res) {
 		var doc = new models.Customer(req.body);
 		doc.save(function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.Customer.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		models.Customer.findByIdAndUpdate(id, {
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
 		models.Customer
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
 		var department = (req.session.department && req.session.department.id) || '';
 		var mobile = (req.session.account && req.session.account.email) || '';
 		models.Customer
 			.find({
 				$or: [
 					{
 						'department': department, //** 用户所在部门分配的客户
 					},{
 						'account_mobile': mobile, //** 用户分配的客户
 					}
 				]
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
 	 * add private/customers
 	 * type:
 	 *     
 	 */
 	app.post('/private/customers', app.isLogin, add);
 	/**
 	 * update private/customers
 	 * type:
 	 *     
 	 */
 	app.put('/private/customers/:id', app.isLogin, update);

 	/**
 	 * delete private/customers
 	 * type:
 	 *     
 	 */
 	app.delete('/private/customers/:id', app.isLogin, remove);
 	/**
 	 * get private/customers
 	 */
 	app.get('/private/customers/:id', app.isLogin, getOne);

 	/**
 	 * get private/customers
 	 * type:
 	 */
 	app.get('/private/customers', app.isLogin, getMore);
 };
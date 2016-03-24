 exports = module.exports = function(app, models) {
 	var _ = require('underscore');

 	var add = function(req, res) {
 		var doc = req.body;
 		var department = doc.department;
 		if(_.isEmpty(department.id)){
 			doc = _.omit(doc,'department');
 		}
 		console.log(doc)
 		models.Grid.create(doc, function(err) {
 			if (err) return res.send(err);
 			res.send({});
 		});
 	};
 	var remove = function(req,res){
 		var id = req.params.id;
 		models.Grid.findByIdAndRemove(id,function(err,doc){
 			if(err) return res.send(err);
 			res.send(doc);
 		});
 	};
 	var update = function(req, res) {
 		var id = req.params.id;
 		var set = req.body;
 		var department = set.department;
 		if(_.isEmpty(department.id)){
 			set = _.omit(set,'department');
 		}
 		models.Grid.findByIdAndUpdate(id, {
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
 		models.Grid
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

 		models.Grid
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
 	 * add grids
 	 * type:
 	 *     
 	 */
 	app.post('/grids', add);
 	/**
 	 * update grids
 	 * type:
 	 *     
 	 */
 	app.put('/grids/:id', update);

 	/**
 	 * delete grids
 	 * type:
 	 *     
 	 */
 	app.delete('/grids/:id', remove);
 	/**
 	 * get grids
 	 */
 	app.get('/grids/:id', getOne);

 	/**
 	 * get grids
 	 * type:
 	 */
 	app.get('/grids', getMore);
 };
 exports = module.exports = function(app, models) {

 	var add = function(req,res){
 		res.send({code: -1});
 	};
 	var update = function(req,res){
 		res.send({code: -1});
 	};
 	var getOne = function(req,res){
 		res.send({code: -1});
 	};
 	var getMore = function(req,res){
 		var per = 20;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

 		models.ChannelGrid
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
 	 * update channel/grids
 	 * type:
 	 *     
 	 */
 	app.put('/channel/grids/:id', update);

 	/**
 	 * get channel/grids
 	 */
 	app.get('/channel/grids/:id', getOne);

 	/**
 	 * get channel/grids
 	 * type:
 	 */
 	app.get('/channel/grids', getMore);
 };
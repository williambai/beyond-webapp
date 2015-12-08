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

 		models.ChannelCategory
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
 	 * update channel/categoies
 	 * type:
 	 *     
 	 */
 	app.put('/channel/categoies/:id', update);

 	/**
 	 * get channel/categoies
 	 */
 	app.get('/channel/categoies/:id', getOne);

 	/**
 	 * get channel/categoies
 	 * type:
 	 */
 	app.get('/channel/categoies', getMore);
 };
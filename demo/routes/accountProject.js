exports = module.exports = function(app,models){
	var _ = require('underscore');

	var getMore = function(req,res){
			if(req.params.aid != 'me') 
				return res.send({code: 40100, message: 'not support.'});
			var aid = req.session.accountId;
			var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
			page = isNaN(page) ? 0 : page;
			var per = 20;

			models.AccountProject
				.find({
					uid: aid
				})
				// .skip(page*per)
				// .limit(per)
				.exec(function(err,docs){
					if(err) return res.send(err);
					if(!docs) return res.send(null);
					var pids = _.pluck(docs, 'pid');
					models.Project
						.find({
							_id: {
								$in: pids
							}
						})
						.exec(function(err,docs){
							if(err) return res.send(err);
							res.send(docs);
						});
				});
		};
/**
 * router outline
 */
	/**
	 * get account's projects
	 * 
	 */
	app.get('/projects/account/:aid', app.isLogined, getMore);
}
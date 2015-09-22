exports = module.exports = function(app,models){

	var getMore = function(req,res){
			var pid = req.params.pid;
			var id = req.session.accountId;
			var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
			isNaN(page) ? 0 : page;
			var per = 20;

			models.AccountProject
				.find({
					pid: pid
				})
				.skip(page*per)
				.limit(per)
				.exec(function(err,docs){
					if(err) return res.send(err);
					res.send(docs);
				});
		};
/**
 * router outline
 */
	/**
	 * get account's projects
	 * 
	 */
	app.get('/accounts/project/:pid', app.isLogined, getMore);
}
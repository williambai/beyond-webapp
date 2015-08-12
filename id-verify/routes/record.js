exports = module.exports = function(app,models){
	var async = require('async');
	var Record = models.Record;

	var getRecords = function(req,res){
			var userId = req.session.account._id;
			var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;

			if(!req.query.type){
				Record.getByTimeline(userId,page,function(records){
					if(!records){
						res.sendStatus(404);
						return;
					}
					res.send(records);
				});
				return;
			}
			switch(req.query.type){
				case 'search': 
					_searchRecordsByString(req,res);
					break;
				default: 
					break;
			}
		};

	var _searchRecordsByString = function(req,res){
			var accountId = req.session.account._id;
			var searchStr = req.query.searchStr;
			if(null == searchStr){
				res.sendStatus(400);
				return;
			}
			Record.findByString(accountId,searchStr,0,function(records){
				if(!records){
					res.sendStatus(404);
					return;
				}
				res.send(records);
			});
		};	
/**
 * router outline
 */
	//query collection
	app.get('/records', app.isLogined, getRecords);
};
exports = module.exports = function(app,models){
	var async = require('async');
	var Record = models.Record;

	var getRecords = function(req,res){
			var accountId = req.session.account._id;
			var roles = req.session.account.roles;
			var type = req.query.type || '';
			var page = req.query.page || 0;
			switch(type){
				case 'search':
					async.waterfall(
						[
							function(callback){
								var searchStr = req.query.searchStr || '';
								if(roles.user){
									Record.findByString(accountId,searchStr,page,callback);
								}else{
									callback({errcode: 40100, errmsg: '没有权限'});
								}
							},
						]
						,function(err,result){
							if(err){
								res.send(err)
								return;
							}
							res.send(result);
						}
					);
					break;
				default:
					async.waterfall(
						[
							function(callback){
								if(roles.user){
									Record.getAllByUser(accountId,page,callback);
								}else{
									callback({errcode: 40100, errmsg: '没有权限'});
								}
							},
						]
						,function(err,result){
							if(err){
								res.send(err)
								return;
							}
							res.send(result);
						}
					);
					break;
			}
		};

/**
 * router outline
 */

	/**
	 * query collection
	 * type:
	 *      search
	 */
	app.get('/records', app.isLogined, getRecords);
};
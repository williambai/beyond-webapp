var authorize = function(models,options){
	return function(req,res,next){
		req.query = {
			app_id: 'app_id',
			sign_method: 'md5',
			timestamp: (new Date()).getTime(),
			nonce: parseInt(Math.random()*100000000),
			sign: 'sign', 
		};
		req.body = {
				message: {
					head: {
						version: '1.0.0.0',
						mechantid: 'app_id',//mechantid
						command: 1004,
						messageid: "app_id" + (new Date()).getTime(),
						encrypt: 0,
						compress: 0,
						timestamp: (new Date()).getTime(),
						bodymd: '',
					},
					body: {

					}
				}
			};
		// Account.findOne(
		// 	{
		// 		appid: app_id
		// 	},
		// 	function(err,doc){
		// 		if(err) return callback(err);
		// 		if(!doc) return callback({code: 40400, message: 'appid does not exist.'});
		// 		var appsecret = doc.appsecret;
				next();
		// 	}
		// );		
	};
};	

exports = module.exports = {
	authorize: authorize,
	request: require('./request'),
}
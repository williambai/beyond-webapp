var signature = require('./signature');
var clients = require('../config/clients');

exports = module.exports = function(options){
	return function(req,res,next){
		// console.log('+++++')
		// console.log(req.query.key)
		var key = req.query.key;
		var timestamp = req.query.timestamp;
		var nonce = req.query.nonce;
		if(!(key && timestamp && nonce)) return res.status(400).send('请求参数错误\n');
		var account = clients[key];
		if(!account) return res.status(403).send('key不存在');
		var args = {
			key: key,
			timestamp: timestamp,
			nonce: nonce,
			secret: account.secret,
		};
		var signed = signature.unsign(args);
		// console.log(signed);
		if( signed != req.signature) return res.status(401).send('未授权，请与管理员联系。');
		req.user = account;
		next();
	};
}
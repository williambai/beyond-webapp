var request = require('request');


exports = module.exports = function(body,callback){
	request({
		uri: 'http://localhost:8526/api',
		method: 'POST',
		headers:{
			'content-type': 'application/xml',
		},
		body: body,
	},function(err,response){
		if(err) return callback(err);
		callback(null,response.body,response);
	});
};

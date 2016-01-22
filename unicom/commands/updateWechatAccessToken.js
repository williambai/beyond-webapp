var request = require('request');

var updateWechatAccessToken = function(callback) {
	request.post('http://localhost:8092/platform/wechats', {
		form: {
			action: 'updateAccessToken',
		}
	}, function(err, response, body) {
		callback(err, body);
	});
};

exports = module.exports = updateWechatAccessToken;

if (process.argv[1] === __filename) {
	updateWechatAccessToken(function(err, result) {
		if (err) console.error(err);
		console.log(result);
	});
}
var request = require('request');

var refreshCookie = function(callback) {
	request.post('http://localhost:8091/stock/accounts', {
		form: {
			action: 'refreshCookie',
		}
	}, function(err, response, body) {
		callback(err, body);
	});
};

exports = module.exports = refreshCookie;

if (process.argv[1] === __filename) {
	refreshCookie(function(err, result) {
		if (err) console.error(err);
		console.log(result);
	});
}
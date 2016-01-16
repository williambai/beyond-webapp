var request = require('request');

var processOrder = function(callback) {
	request.post('http://localhost:8092/platform/orders', {
		form: {
			action: 'processOrder',
		}
	}, function(err, response, body) {
		callback(err, body);
	});
};

var confirmOrder = function(callback) {
	request.post('http://localhost:8092/platform/orders', {
		form: {
			action: 'confirmOrder',
		}
	}, function(err, response, body) {
		callback(err, body);
	});
};

exports = module.exports = {
	processOrder: processOrder,
	confirmOrder: confirmOrder,
};

if (process.argv[1] === __filename) {
	processOrder(function(err, result) {
		if (err) console.error(err);
		console.log(result);
		confirmOrder(function(err, result) {
			if (err) console.error(err);
			console.log(result);
		});
	});
}
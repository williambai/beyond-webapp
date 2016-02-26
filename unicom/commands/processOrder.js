var request = require('request');

var processOrder = function(callback) {
	request.post('http://localhost:8092/system/order/process', {
		form: {
		}
	}, function(err, response, body) {
		if(err || response.statusCode != 200) throw new Error();
		callback && callback(null, body);
	});
};

var confirmOrder = function(callback) {
	request.post('http://localhost:8092/system/order/confirm', {
		form: {
		}
	}, function(err, response, body) {
		if(err || response.statusCode != 200) throw new Error();
		callback && callback(null, body);
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
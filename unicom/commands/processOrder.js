var path = require('path');
var log4js = require('log4js');
log4js.configure(path.join(__dirname, '../config/log4js.json'));
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

var request = require('request');

var processOrder = function(callback) {
	request.post('http://localhost:8092/system/order/process', {
		form: {
		}
	}, function(err, response, body) {
		if(err || response.statusCode != 200) 
			logger.error('process order failure, please check the url.');
		else 
			logger.info('process Order successfully.');
		callback && callback();
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
var request = require('request');

var submit = function(callback) {
	request.post('http://localhost:8092/system/sms/submit', {
		form: {
		}
	}, function(err, response, body) {
		if(err || response.statusCode != 200) throw new Error();
		callback && callback(null, body);
	});
};

var report = function(data, callback) {
	request.post('http://localhost:8092/system/sms/report', {
		form: {
			data: data
		}
	}, function(err, response, body) {
		if(err || response.statusCode != 200) throw new Error();
		callback && callback(null, body);
	});
};

var deliver = function(data, callback) {
	request.post('http://localhost:8092/system/sms/deliver', {
		form: {
			data: data,
		}
	}, function(err, response, body) {
		if(err || response.statusCode != 200) throw new Error();
		callback && callback(null, body);
	});
};

exports = module.exports = {
	submit: submit,
	report: report,
	deliver: deliver,
};

//** send sms
if (process.argv[1] === __filename) {
	submit(function(err, result) {
		if (err) console.error(err);
		console.log(result);
	});
}
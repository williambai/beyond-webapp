var request = require('request');

var send = function(callback) {
	request.post('http://localhost:8092/platform/smses', {
		form: {
			action: 'send',
		}
	}, function(err, response, body) {
		callback && callback(err, body);
	});
};

var report = function(data, callback) {
	request.post('http://localhost:8092/platform/smses', {
		form: {
			action: 'report',
			data: data
		}
	}, function(err, response, body) {
		callback(err, body);
	});
};

var reply = function(data, callback) {
	request.post('http://localhost:8092/platform/smses', {
		form: {
			action: 'reply',
			data: data,
		}
	}, function(err, response, body) {
		callback(err, body);
	});
};

exports = module.exports = {
	send: send,
	report: report,
	reply: reply,
};

if (process.argv[1] === __filename) {
	send(function(err, result) {
		if (err) console.error(err);
		console.log(result);
		report({}, function(err,report){
			if(err) console.error(err);
			console.log(report);
			reply({}, function(err,reply){
				if(err) console.error(err);
				console.log(reply);
			});
		});
	});
}
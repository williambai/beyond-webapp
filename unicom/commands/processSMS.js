var path = require('path');
var log4js = require('log4js');
log4js.configure(path.join(__dirname, '../config/log4js.json'));
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

var request = require('request');

var submit = function(callback) {
	request.post('http://localhost:8092/system/sms/submit', {
		form: {
		}
	}, function(err, response, body) {
		if(!err && response.statusCode == 200){
			logger.debug('submit result: ' + body);
			var data = JSON.parse(body);
			if(data.count && data.count > 0){
				logger.info('submit ' + (data.count || 0) + ' SMS successfully.');
			}else{
				logger.info('none SMS need submit till now.');			
			}
		}else{
			logger.error(err || 'status code(' + response.statusCode + '): submit failure, please check the url.');
		}
		callback && callback();
	});
};

var report = function(data, callback) {
	request.post('http://localhost:8092/system/sms/report', {
		form: {
			data: data
		}
	}, function(err, response, body) {
		if(!err && response.statusCode == 200){
			logger.debug('report result: ' + body);
			var data = JSON.parse(body);
			logger.info('report SMS successfully.');
		}else{
			logger.error(err || 'status code(' + response.statusCode + '): report failure, please check the url.');
		}
		callback && callback();
	});
};

var deliver = function(data, callback) {
	request.post('http://localhost:8092/system/sms/deliver', {
		form: {
			data: data,
		}
	}, function(err, response, body) {
		if(!err && response.statusCode == 200){
			logger.debug('deliver result: ' + body);
			var data = JSON.parse(body);
			logger.info('deliver SMS successfully.');
		}else{
			logger.error(err || 'status code(' + response.statusCode + '): submit failure, please check the url.');
		}
		callback && callback();
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
		if (err) logger.error(err);
		logger.info(result);
	});
}
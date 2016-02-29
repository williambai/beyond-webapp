var path = require('path');
var log4js = require('log4js');
log4js.configure(path.join(__dirname, '../config/log4js.json'));
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

var request = require('request');

var refreshCookie = function(callback) {
	request.post('http://localhost:8092/cbss/accounts', {
		form: {
			action: 'refreshCookie',
		}
	}, function(err, response, body) {
		if(err || response.statusCode != 200) 
			logger.error('refresh cookie failure, please check the url.');
		else 
			logger.info('refresh CBSS cookie successfully.');
		callback && callback();
	});
};

exports = module.exports = refreshCookie;

if (process.argv[1] === __filename) {
	refreshCookie(function(err, result) {
		if (err) logger.error(err);
		logger.info(result);
	});
}
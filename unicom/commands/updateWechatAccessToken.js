var path = require('path');
var log4js = require('log4js');
log4js.configure(path.join(__dirname, '../config/log4js.json'));
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

var request = require('request');

var updateWechatAccessToken = function(callback) {
	request.post('http://localhost:8092/system/wechat/access_token', {
	}, function(err, response, body) {
		if(!err && response.statusCode == 200){
			logger.debug('refresh result: ' + body);
			var data = JSON.parse(body);
			logger.info('refresh Wechat AccessToken successfully.');
		}else{
			logger.error(err || 'status code(' + response.statusCode + '): refresh failure, please check the url.');
		}
		callback && callback();
	});
};

exports = module.exports = updateWechatAccessToken;

if (process.argv[1] === __filename) {
	updateWechatAccessToken(function(err, result) {
		if (err) logger.error(err);
		logger.info(result);
	});
}
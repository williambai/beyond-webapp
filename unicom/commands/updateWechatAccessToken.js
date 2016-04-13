//** refresh wechat token in database

if (process.argv[1] === __filename) {
	//** common packages
	var path = require('path');
	var fs = require('fs');
	var config = {
		db: require('../config/db'),
	};
	//** MongoDB packages
	var mongoose = require('mongoose');
	mongoose.connect(config.db.URI, function onMongooseError(err) {
		if (err) {
			logger.error('Error: can not open Mongodb.');
			throw err;
		}
	});
	//** import MongoDB's models
	var models = {};
	fs.readdirSync(path.join(__dirname, '../models')).forEach(function(file) {
		if (/\.js$/.test(file)) {
			var modelName = file.substr(0, file.length - 3);
			models[modelName] = require('../models/' + modelName)(mongoose);
		}
	});
	// mongoose.disconnect();
	models.PlatformWeChat.updateAccessToken(function(err, result) {
		if (err) console.log(err);
		console.log(result);
		console.log('refresh Wechat AccessToken successfully.');
		mongoose.disconnect();
	});
}



// var path = require('path');
// var log4js = require('log4js');
// log4js.configure(path.join(__dirname, '../config/log4js.json'));
// var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

// var request = require('request');

// var updateWechatAccessToken = function(callback) {
// 	request.post('http://localhost:8092/system/wechat/access_token', {
// 	}, function(err, response, body) {
// 		if(!err && response.statusCode == 200){
// 			logger.debug('refresh result: ' + body);
// 			var data = JSON.parse(body);
// 			logger.info('refresh Wechat AccessToken successfully.');
// 		}else{
// 			logger.error(err || 'status code(' + response.statusCode + '): refresh failure, please check the url.');
// 		}
// 		callback && callback();
// 	});
// };

// exports = module.exports = updateWechatAccessToken;

// if (process.argv[1] === __filename) {
// 	updateWechatAccessToken(function(err, result) {
// 		if (err) logger.error(err);
// 		logger.info(result);
// 	});
// }
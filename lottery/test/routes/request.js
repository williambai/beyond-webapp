var request = require('request');
var fs = require('fs');
var path = require('path');

var config = {
		server: require('../../config/server'),
		mail: require('../../config/mail'),
		db: require('../../config/db')
	};		

request.host = 'http://localhost:' + config.server.PORT;

request.cookies = {
	admin: fs.readFileSync(path.join(__dirname,'../fixtures/cookie_admin.txt'),'utf8'),
	agent: fs.readFileSync(path.join(__dirname,'../fixtures/cookie_agent.txt'),'utf8'),
	user: fs.readFileSync(path.join(__dirname,'../fixtures/cookie_user.txt'),'utf8')
}

exports = module.exports = request;
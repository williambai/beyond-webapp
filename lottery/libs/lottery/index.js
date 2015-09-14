var request = require('request');
var parser = require('xml2json');

/**
 * Lottery Api
 * @param {Object} options
 * options.server
 * options.server.url
 */
Lottery = function(options){
	this.options = options || {};
};

Lottery.prototype.buildMessage = function(body,command){
	var message = {};
	var body = body || {};
	var date = new Date();
	var messageid = merchant.merchantid + date.Format('yyyyMMdd') + date.getTime();
	var timestamp = date.Format('yyyyMMddhhmmss');
	var md5 = crypto.createHash('md5').update(messageid + timestamp + json2xml({body:body}) + merchant.secret).digest('hex');

	message.head = {
		version: '1.0.0.0',
		merchantid: merchant.merchantid,
		messageid: messageid,
		command: command,
		encrypt: 0,
		compress:0,
		timestamp: timestamp,
		bodymd: md5,
	};

	message.body = body;

	return json2xml({message:message},{ header:true });	
};

Lottery.prototype.request = function(body,command,callback){
	request({
		url: options.server.url,
		method: 'POST',
		body: this.buildMessage(body,command),
	},function(err,body,response){
		if(err) return callback(err);

		var messageRecieved = parser.toJson(body);
		callback(null,messageRecieved.body);
	});
};


// Lottery.prototype.command1000 = function(body,callback){
// 	request({
// 		url: options.server.url,
// 		method: 'POST',
// 		body: this.buildMessage(body,'1000'),
// 	},function(err,body,response){
// 		if(err) return callback(err);

// 		var messageRecieved = parser.toJson(body);
// 		callback(null,messageRecieved.body);
// 	});
// };

// Lottery.prototype.command1015 = function(body,callback){
// 	request({
// 		url: options.server.url,
// 		method: 'POST',
// 		body: this.buildMessage(body,'1015'),
// 	},function(err,body,response){
// 		if(err) return callback(err);

// 		var messageRecieved = parser.toJson(body);
// 		callback(null,messageRecieved.body);
// 	});
// };

exports = module.exports = Lottery;
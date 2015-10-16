var request = require('request');
var json2xml = require('json2xml');
var xml2Json = require('xml2json');
var crypto = require('crypto');
var _ = require('underscore');

var encryptMessage = function(message,options){
	console.log('+++')
	console.log(message)
	if(!(message.head && message.head.messageid))
		console.error(new Error('message.head or message.head.messageid lost.'));

	var messageid = message.head.messageid;
	var timestamp = message.head.timestamp;
	var md5 = crypto
				.createHash('md5')
				.update(
						messageid + 
						timestamp + 
						json2xml({body:message.body}) + 
						options.secret
					)
				.digest('hex');
	message.head.bodymd = md5;
	return json2xml({message:message},{ header:true });	
};

var decryptMessage = function(message, options, callback){
	console.log('---')
	console.log(message)
	if(!(message.head && message.head.messageid))
		console.error(new Error('message.head or message.head.messageid lost.'));

	var head = message.head;
	if(head.encrypt){
		var encrypt_body = message.body;
		var decipher = crypto.createDecipher(encrypt_alg, new Buffer(options.encrypt_key), new Buffer(options.iv));
		decipher.setAutoPadding(options.encrypt_autoPadding);
		var xml_body = decipher.update(encrypt_body, 'hex', 'utf8').final('utf8');
		var json_body;
		try{
			json_body = xml2Json.toJson(xml_body);
		}catch(err){
			return callback(err);
		}
		message.body = json_body;
	}
	callback(null,message);
};

/**
 * Lottery Request Api
 * @param {Object} options
 * options.server
 * options.server.url
 */
exports = module.exports = function(options){
	return function(message,callback){
		request({
			url: options.url,
			method: 'POST',
			data: message,//encryptMessage(message,options),
		},function(err,response){
			if(err) return callback(err);
			console.log(response.body)
			decryptMessage(response.body, options, callback);
		});
	};
};



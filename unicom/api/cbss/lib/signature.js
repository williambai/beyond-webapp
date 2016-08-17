var crypto = require('crypto');
var createNonce = function () {
  return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

var getSortedString = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort();
  var string = '';
  var newArgs = {};
  keys.forEach(function (key) {
  	string += key.toLowerCase() + args[key];
  });
  return string;
};

var sign = function(options){
	if(!(options && options.key && options.secret)) throw new Error('缺少参数：key,secret');
	var ret = {
		key: options.key || '1234567890',
		timestamp: createTimestamp(),
		nonce: createNonce(),
	};
	var secret = options.secret || '0987654321';
	ret.secret = secret;
	ret.signature = crypto.createHash('sha1').update(getSortedString(ret)).digest('hex');
	delete ret.secret;
	return ret;
};

var unsign = function(options){
	if(!(options && options.key && options.secret && options.timestamp && options.nonce)) throw new Error('缺少参数：key,secret,timestamp,nonce');
	var args = {
		key: options.key || '1234567890',
		secret: options.secret || '0987654321',
		timestamp: options.timestamp || createTimestamp(),
		nonce: options.nonce || createNonce(),
	};
	return crypto.createHash('sha1').update(getSortedString(args)).digest('hex');
};

exports = module.exports = {
	sign: sign,
	unsign: unsign,
};
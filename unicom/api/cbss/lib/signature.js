var crypto = require('crypto');
var _ = require('underscore');

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

var sign = function(key,secret,options){
	if(!(key && secret)) throw new Error('缺少参数：key,secret');
	options = options || {};
	var ret = _.extend(options,{
			key: key || '1234567890',
			timestamp: createTimestamp(),
			nonce: createNonce(),
		});
	ret.secret = secret || '0987654321';
	ret.signature = crypto.createHash('sha1').update(getSortedString(ret)).digest('hex');
	return _.omit(ret,'secret');
};

var unsign = function(secret,options){
	if(!(options && options.key && options.timestamp && options.nonce)) throw new Error('缺少参数：key,timestamp,nonce');
	secret = secret || '9876543210';
	options.secret = secret;
	options = _.omit(options,'signature');
	return crypto.createHash('sha1').update(getSortedString(options)).digest('hex');
};

exports = module.exports = {
	sign: sign,
	unsign: unsign,
};
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	original: String, //** 源链接
	shortCode: String, //** 短连接地址，以/开头，不包含http://host:port
});

schema.set('collection', 'platform.shorturls');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('PlatformShortUrl', schema);
};
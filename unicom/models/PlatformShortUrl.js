module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		url: String, //** 短连接地址，以/开头，不包含http://host:port
		params: {}, //** 短链接Get请求的参数
	});

	schema.set('collection', 'platform.shorturls');
	return mongoose.model('PlatformShortUrl', schema);
};
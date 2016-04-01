module.exports = exports = function(mongoose) {


	var schema = new mongoose.Schema({
		original: String, //** 源链接
		shortCode: String, //** 短连接地址，以/开头，不包含http://host:port
	});

	schema.set('collection', 'platform.shorturls');
	return mongoose.model('PlatformShortUrl', schema);
};

module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		ticket: String,
		sceneid: Number, //100001: bind; 100002: login
		openid: String,
		userid: String,
		lastupdatetime: {
			type: Date,
			default: Date.now
		},		
	});

	schema.set('collection', 'platform.wechat.qrcodes');
	return mongoose.model('PlatformWeChatQrcode', schema);
};
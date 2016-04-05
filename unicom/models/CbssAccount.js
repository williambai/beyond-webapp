module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		province_name: String, //** 省市名称
		province_id: String, //** 省市编码
		username: String,//** cbss账号
		password: String,//** cbss密码
		cookies: [],
		cookieRaw: String,
		login: {
			type: Boolean,
			default: false
		},
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','cbss.accounts');
	return mongoose.model('CbssAccount',schema);
};
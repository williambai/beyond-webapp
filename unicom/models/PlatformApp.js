module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		name: String,
		nickname: {
			type: String,
		},
		description: String,
		features: [],
		isDefault: {//** 是否是默认的App，注册用户属于默认应用
			type: Boolean,
			default: false,
		}
	});

	schema.set('collection', 'platform.apps');
	return mongoose.model('PlatformApp', schema);
};
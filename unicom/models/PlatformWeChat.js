module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		name: String,
		description: String,
		appid: String,
		appsecret: String,
		menus: [{
			name: String,
			description: String,
			category: {
				type: String,
				enum: {
					values: 'click|view'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			},
			target: String,
			path: String,
			display_sort: {
				type: Number,
				default: 0
			},
			parent: String,//parent menu id
			status: {
				type: String,
				enum: {
					values: '有效|无效'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			}
		}],
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		}
	});

	schema.set('collection', 'platform.wechats');
	return mongoose.model('PlatformWeChat', schema);
};
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		url: String,//** 页面URL
		description: String,
		category: {//** jade 类型
			type: String,
			enum: {
				values: 'layout|include|page'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		models: [],//** 模板用到的models
		template: String, //** 模板内容
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
	});

	schema.set('collection','pages');
	return mongoose.model('Page',schema);
};
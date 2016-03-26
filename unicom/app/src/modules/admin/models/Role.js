var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	urlRoot: config.api.host + '/protect/roles',
	idAttribute: '_id',

	defaults: {
		status: {}
	},
	validation: {
		name: {
			required: true,
			msg: '请输入名称'
		},
		nickname: {
			required: true,
			msg: '请输入编码(字母、_与数字的组合)'
		}
	},
});

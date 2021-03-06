var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/features',
	defaults: {
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
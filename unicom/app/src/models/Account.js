var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',

	defaults: {
		apps: [],
		roles: []
	},

	validation: {
		'username': {
			required: true,
			msg: '请输入用户名'
		},
		'email': {
			required: true,
			pattern: 'email',
			msg: '请输入有效的电子邮件'
		},
	},
	
});

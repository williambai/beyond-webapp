var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',

	urlRoot: config.api.host + '/accounts',

	defaults: {
		status: {},
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
	    'password': {
			required: true,
	    	minLength: 5,
	    	msg:'密码长度至少五位'
	    }
	},
	
});

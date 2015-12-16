var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	
	url: config.api.host + '/forgotPassword',

	validation: {
		'email': {
	      required: true,
	      pattern: 'email',
	      msg: '请输入有效的电子邮件'
	    },
	},
});
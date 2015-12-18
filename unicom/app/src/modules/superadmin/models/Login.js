var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var validation = require('backbone-validation');
_.extend(Backbone.Model.prototype,validation.mixin);

exports = module.exports = Backbone.Model.extend({
	
	url: config.api.host + 'super/login',

	validation: {
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
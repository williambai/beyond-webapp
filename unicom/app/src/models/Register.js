var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	url: config.api.host + '/register',

	initialize: function(options) {
		if (options && options.appCode)
			this.url = this.url + '/' + options.appCode;
	},

	validation: {
		username: {
			required: true,
			minLength: 2,
			msg: '用户名至少2个字母或汉字'
		},
		email: {
			pattern: /^(1\d{10}|[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+)$/,
			msg: '请输入有效的手机号码'
		},
		password: {
			required: true,
			minLength: 5,
			msg: '密码长度至少五位'
		},
	},
});
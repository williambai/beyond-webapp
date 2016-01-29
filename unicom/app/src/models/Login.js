var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var validation = require('backbone-validation');
_.extend(Backbone.Model.prototype, validation.mixin);

exports = module.exports = Backbone.Model.extend({
	url: config.api.host + '/login',

	initialize: function(options) {
		if (options && options.appCode)
			this.url = this.url + '/' + options.appCode;
	},

	validation: {
		'email': {
			pattern: /^(1\d{10}|[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+)$/,
			msg: '请输入有效的手机号码或电子邮件'
		},
		'password': {
			required: true,
			minLength: 5,
			msg: '密码长度至少五位'
		}
	},
});
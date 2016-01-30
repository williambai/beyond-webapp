var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/customers',	
	
	defaults: {
	},
	
	validation: {
		'name': {
			required: true,
			msg: '请输入客户姓名'
		},
		'mobile': {
			pattern: /^(1\d{10}|[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+)$/,
			msg: '请输入有效的手机号码'
		},
	},	
});
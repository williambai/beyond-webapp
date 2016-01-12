var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/stock/accounts',	
	defaults: {
		user: {}
	},
	validation: {
		'user[name]': {
			required: true,
			msg: '请输入用户姓名'
		},
		'username': {
			required: true,
			msg: '请输入账户名称'
		},
	},
});
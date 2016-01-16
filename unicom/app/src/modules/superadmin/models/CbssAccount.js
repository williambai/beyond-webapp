var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/cbss/accounts',	

	validation: {
		'username': {
			required: true,
			msg: '请输入用户名'
		},
	},
});
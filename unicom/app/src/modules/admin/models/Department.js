var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/departments',

	validation: {
		name: {
			required : true,
			msg: '请输入组织名称'
		},
		// nickname: {
		// 	required : true,
		// 	msg: '请输入组织编码'
		// },

	},
});
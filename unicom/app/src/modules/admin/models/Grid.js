var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/channel/grids',	
	defaults: {
		department: {}
	},
	validation: {
		name: {
			required: true,
			msg: '请输入名称'
		}
	},
});
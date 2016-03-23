var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/channel/product/phones',	
	defaults: {
		params: {
		},
		packages: {},
		goods: {}
	},
	validation: {
		'package[id]': {
			required: true,
			msg: '您还没有选择套餐，请选择一种套餐'
		},
	},
});
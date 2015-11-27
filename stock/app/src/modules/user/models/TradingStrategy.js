var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',

	url: config.api.host + '/strategy',
	defaults: {
		stock: {},
		params: {},
		status: {}
	},
});
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/admin/orders',	
	defaults: {
		customer: {},
		customerInfo: {},
		bonus: {
			income: 0,
			cash: 0,
		},
		dispatch: {},
	},
	validation: {
	},
});
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/product/card/packages',	
	defaults: {
		goods:{},
		bonus: {
			income: 0,
			times: 1,
			points: 0,
		},
	}
});
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/trade/portfolios',
	parse: function(response){
		return response.backup;
	},
	defaults: {
		bid:{},
		params: {},
	},
});
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Model = require('./PlatformFeature');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/protect/features',
	model: Model,
});
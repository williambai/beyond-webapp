var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Model = require('./PlatformApp');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/platform/apps',
	model: Model,
});
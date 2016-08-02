var _ = require('underscore');
var Backbone = require('backbone');
var Page = require('./PageStatic');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/page/statics',
	model: Page,
});
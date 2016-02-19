var _ = require('underscore');
var Backbone = require('backbone');
var Page = require('./Page');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/platform/pages',
	model: Page,
});
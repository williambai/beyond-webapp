var _ = require('underscore');
var Backbone = require('backbone');
var PageDynamic = require('./PageDynamic');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/page/dynamics',
	model: PageDynamic,
});
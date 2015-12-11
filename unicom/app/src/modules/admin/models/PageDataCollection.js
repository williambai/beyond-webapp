var _ = require('underscore');
var Backbone = require('backbone');
var PageData = require('./PageData');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/page/data',
	model: PageData,
});
var _ = require('underscore');
var Backbone = require('backbone');
var Revenue = require('./Revenue');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/revenues',
	model: Revenue,
});
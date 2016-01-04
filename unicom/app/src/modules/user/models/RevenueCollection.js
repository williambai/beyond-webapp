var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Revenue = require('./Revenue');

exports = module.exports = Backbone.Collection.extend({
	model: Revenue,
	url: config.api.host + '/channel/revenues',
});